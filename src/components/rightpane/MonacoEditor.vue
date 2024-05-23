<template>
    <div id="codeEditor" class="codeEditor"></div>
</template>

<script lang="ts">
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue'
import { editorProps, LangEnum, type Options } from '@/module/MonacoEditorType'
import {
    adaptLangConfig,
    adaptLangFileName,
    adaptLangModel,
    createMonacoEditor,
    createUrl,
    doInit,
    initWebSocketAndStartClient,
    type LangConfig,
    type LanguageClientRunConfig
} from '@/client/monaco-client'
import { ExtensionHostKind, registerExtension } from '@codingame/monaco-vscode-api/extensions'
import { pythonExtension } from '@/client/monaco-editor-extension'
import { type IStandaloneCodeEditor } from '@codingame/monaco-vscode-api/vscode/vs/editor/standalone/browser/standaloneCodeEditor'
import { type IReference, type ITextFileEditorModel } from 'vscode/monaco'
import { updateUserConfiguration } from '@codingame/monaco-vscode-configuration-service-override'
import {
    RegisteredFileSystemProvider,
    RegisteredMemoryFile,
    registerFileSystemOverlay
} from '@codingame/monaco-vscode-files-service-override'
import * as vscode from 'vscode'
import { MonacoEditorCodeStoreDir } from '@/client/config'

export default {
    name: 'MonacoEditor',
    props: editorProps,
    emits: ['update-codeValue', 'on-code-blur'],
    setup(props, { emit }) {
        /* Monaco Editor 加载需要的元信息 */
        const LangConfig = ref<LangConfig>()
        LangConfig.value = adaptLangConfig(props.lang)
        const editorRunConfig = ref<LanguageClientRunConfig>({
            vscodeApiInit: true,
            clientUrl: 'localhost', // todo 将其改为读取指定的环境变量文件形式
            serverPath: LangConfig.value.serverPath,
            serverPort: LangConfig.value.serverPort,
            registerConfig: LangConfig.value.langRegisterConfig,
            codeValue: props.codeValue,
            htmlElementId: props.htmlElementId,
            configOption: props.options
        })

        /* Monaco Editor 创建后的一些实例 */
        let editor: IStandaloneCodeEditor // 编辑器本身
        let modelRef: IReference<ITextFileEditorModel> // Monaco Editor 重要概念之一: Model
        let webSocket: WebSocket // 连接 LSP 服务的 WebSocket
        let fileSystemProvider: RegisteredFileSystemProvider // 文件系统

        /* 接受 EditorConfig 的消息去重制为模版代码 */
        const currentComponentInstance = getCurrentInstance()
        currentComponentInstance?.proxy?.$Bus.on('reset-code', (templateCode: any) => {
            if (editor) {
                editor.setValue(templateCode)
            }
        })

        /* 智能提示是否开启 */
        const isSwitchSmartTip = ref<number>(0) // 0 是不开启, 1 是开启
        let isStartTip = localStorage.getItem('code-tip')
        if (isStartTip != null) {
            isSwitchSmartTip.value = Number(isStartTip)
        }
        currentComponentInstance?.proxy?.$Bus.on('code-tip-switch', (SwitchSmartTip: any) => {
            isSwitchSmartTip.value = SwitchSmartTip
        })
        currentComponentInstance?.proxy?.$Bus.on('copy-code-to-editor', (langAndCode: any) => {
            editor.setValue(atob(langAndCode[1]))
        })

        /* 初始化编辑器函数 */
        const InitEditor = () => {
            ;(async () => {
                await doInit(true, editorRunConfig.value.registerConfig)
                const editorDom = document.getElementById(props.htmlElementId)
                // DOM 节点存在时, 创建 Monaco Editor
                if (editorDom) {
                    const monacoEditor = await createMonacoEditor({
                        htmlElement: editorDom,
                        codeValue: props.codeValue,
                        lang: props.lang
                    })
                    editor = monacoEditor.editor
                    modelRef = monacoEditor.modelRef
                    fileSystemProvider = monacoEditor.fileSystemProvider

                    /* 更新 monaco editor 的配置 */
                    await updateUserConfiguration(`{
                        "editor.fontSize": ${props.options.fontSize},
                        "editor.tabSize": ${props.options.tabSize},
                        "workbench.colorTheme": "${props.options.theme}",
                        "editor.minimap.enabled": ${false},
                        "editor.gotoLocation.multipleDefinitions": "alt",
                        "editor.codeLens": false,
                    }`)

                    /* 注册一些配置, 用于增强 Monaco 的功能, 例如添加快捷键去执行一些操作 pyright 相关的命令, 不过目前可有可无 */
                    if (props.lang == LangEnum.PYTHON) {
                        // 将 pyright 相关配置注册到 Monaco Editor 中
                        registerExtension(pythonExtension, ExtensionHostKind.LocalProcess)
                    }

                    /* 只有开启智能提示开关后才去加载 LSP 服务 */
                    if (isSwitchSmartTip.value == 1 && currentComponentInstance) {
                        const url = createUrl(
                            editorRunConfig.value.clientUrl,
                            editorRunConfig.value.serverPort,
                            editorRunConfig.value.serverPath,
                            {
                                authorization: 'AuroraOJ-HDD' // todo 改为加密字符串, 确保 LSP 不被攻击
                            },
                            false
                        )
                        webSocket = initWebSocketAndStartClient(
                            url,
                            props.lang,
                            currentComponentInstance
                        )
                    }

                    editor.setValue(props.codeValue) // 设置当前编辑器的代码

                    /* 为编辑器添加一些事件感知 */
                    // 监听用户输入代码的改变, 将其传至父组件
                    editor.onDidChangeModelContent(() => {
                        const codeContent = editor.getValue()
                        emit('update-codeValue', codeContent)
                    })
                    // 失去编辑器焦点
                    editor.onDidBlurEditorText(() => {
                        emit('on-code-blur', false)
                    })
                    // 获取编辑器焦点时
                    editor.onDidFocusEditorText(() => {
                        emit('on-code-blur', true)
                    })
                } else {
                    console.error(`Monaco Editor DOM ID: ${props.htmlElementId} 无法挂载`)
                }
            })()
        }

        /*------------------------------------------------------------------------------------------------------------------------*/

        /* 编辑已经加载完毕后, 动态感知是否去开启智能提示 */
        watch(isSwitchSmartTip, (n) => {
            if (n == 0 && webSocket) {
                // 关闭智能模式
                webSocket.close()
                currentComponentInstance?.proxy?.$Bus.emit('switch-tip', 0)
            } else {
                const langConfig = adaptLangConfig(props.lang)
                const url = createUrl(
                    editorRunConfig.value.clientUrl,
                    langConfig.serverPort,
                    langConfig.serverPath,
                    {
                        authorization: 'AuroraOJ-HDD'
                    },
                    false
                )
                if (currentComponentInstance) {
                    webSocket = initWebSocketAndStartClient(
                        url,
                        props.lang,
                        currentComponentInstance
                    )
                    webSocket.onclose = async () => {
                        isSwitchSmartTip.value = 0
                        currentComponentInstance?.proxy?.$Bus.emit('switch-tip', 0)
                    }
                }
            }
        })
        /*----------------------------------------------------------------------------------------*/

        /* 切换语言时更新相关配置 */
        watch(
            () => props.lang,
            async (newLang: string, oldLang: string) => {
                /* 一些对上次使用语言的善后工作 */
                if (webSocket) {
                    webSocket.close() // 关闭上一个语言的 LSP 连接, 防止性能浪费
                }
                if (modelRef) {
                    modelRef.dispose() // 防止缓存导致的错误
                }
                // 防止文件系统缓存导致的错误
                await fileSystemProvider.delete(
                    vscode.Uri.file(`${MonacoEditorCodeStoreDir}/${adaptLangFileName(oldLang)}`)
                )

                if (editor) {
                    const langConfig = adaptLangConfig(newLang)
                    const fileName = adaptLangFileName(newLang)
                    try {
                        /* 重新创建新的内存文件 和 Model */
                        fileSystemProvider.registerFile(
                            new RegisteredMemoryFile(
                                vscode.Uri.file(`${MonacoEditorCodeStoreDir}/${fileName}`),
                                newLang
                            )
                        )
                        registerFileSystemOverlay(1, fileSystemProvider)
                        modelRef = await adaptLangModel(newLang, fileName, props.codeValue)
                        editor.setModel(modelRef.object.textEditorModel)

                        /* 防止切换题目后上一题的缓存移至当前题目 */
                        if (editor.getValue() != props.codeValue) {
                            editor.setValue(props.codeValue)
                        }

                        /* 智能提示 */
                        const url = createUrl(
                            editorRunConfig.value.clientUrl,
                            langConfig.serverPort,
                            langConfig.serverPath,
                            {
                                authorization: 'AuroraOJ-HDD'
                            },
                            false
                        )
                        if (isSwitchSmartTip.value == 1 && currentComponentInstance) {
                            webSocket = initWebSocketAndStartClient(
                                url,
                                newLang,
                                currentComponentInstance
                            )
                        }
                        /* 编辑器当前状态感知 */
                        let storeStatus: number = 0
                        if (props.codeValue != '') {
                            // 已从本地恢复存储的代码
                            storeStatus = 1
                        }
                        // 将当前状态反馈至 Editor Config 中
                        currentComponentInstance?.proxy?.$Bus.emit('on-editor-blur', [storeStatus])
                    } catch (error) {
                        console.error('语言切换失败: ', error)
                    }
                }
            }
        )
        /*----------------------------------------------------------------------------------------*/

        /* 更新 monaco editor 的相关配置 */
        watch(
            () => props.options,
            async (newConfig: Options) => {
                await updateUserConfiguration(`{
                    "editor.tabSize": ${newConfig.tabSize ?? 4},
                    "editor.fontSize": ${newConfig.fontSize ?? 14},
                    "editor.minimap.enabled": ${false},
                    "workbench.colorTheme": "${newConfig.theme}"
                }`)
            },
            { deep: true }
        )
        /*----------------------------------------------------------------------------------------*/

        /* 根据 "拖动" 或 "双击" 等后布局发生的变化动态更新编辑器的宽高, 给用户更好的体验 */
        const codeEditor = ref() // Monaco Editor 绑定的 Div 盒子的实例
        /* 接收来自 QuestionView 中 "拖拽" 或 "双击" 后布局的变动同步 Monaco Editor 的组件高度的设置 */
        const CodeHeightVH = inject<Ref<string>>('CodeHeightVH')
        const codeHeightVH = ref(CodeHeightVH)
        // 监听 CodeHeightVH 的变化
        watch(codeHeightVH, (newHeight) => {
            if (editor && newHeight && codeEditor.value) {
                codeEditor.value.style.height = newHeight
                codeEditor.value.style.width = '100%'
                editor.layout() // 通知 Monaco 重新布局
            }
        })
        /* 接收来自 QuestionView 中 "拖拽" 或 "双击" 后布局的变动同步 Monaco Editor 的组件宽度的设置 */
        const CodeWidthIsChange = inject<Ref<boolean>>('codeWidthIsChange')
        const codeWidthIsChange = ref(CodeWidthIsChange)
        // 监听 CodeHeightVH 的变化
        watch(codeWidthIsChange, (newHeight) => {
            if (editor && newHeight != null && codeEditor.value) {
                codeEditor.value.style.width = '100%'
                editor.layout() // 通知 Monaco 重新布局
            }
        })

        /*------------------------------------------------------------------------------------------------------------------------*/
        /* 组件挂载时加载 Monaco Editor */
        onMounted(() => {
            InitEditor()
        })

        /* 组件销毁的同时关闭 LSP 连接、销毁 monaco editor、删除 Model、和内存文件 */
        onBeforeUnmount(async () => {
            if (webSocket) {
                webSocket.close()
            }
            if (modelRef) {
                modelRef.dispose()
            }
            editor.dispose()
            await fileSystemProvider.delete(
                vscode.Uri.file(`${MonacoEditorCodeStoreDir}/${adaptLangFileName(props.lang)}`)
            )
        })
        /*------------------------------------------------------------------------------------------------------------------------*/
        return { codeEditor, codeHeightVH }
    }
}
</script>

<style scoped>
.codeEditor {
    width: 100%;
    flex: 1;
    min-height: 100%;
    overflow: hidden;
    height: v-bind(codeHeightVH);
}
</style>
