<template>
    <div id="codeEditor" class="codeEditor"></div>
</template>

<script lang="ts">
import { inject, onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue'
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
    emits: ['update-codeValue'],
    setup(props, { emit }) {
        const LangConfig = ref<LangConfig>()
        LangConfig.value = adaptLangConfig(props.lang)
        const editorRunConfig = ref<LanguageClientRunConfig>({
            vscodeApiInit: true,
            clientUrl: 'localhost',
            serverPath: LangConfig.value.serverPath,
            serverPort: LangConfig.value.serverPort,
            registerConfig: LangConfig.value.langRegisterConfig,
            codeValue: props.codeValue,
            htmlElementId: props.htmlElementId,
            configOption: props.options
        })

        let editor: IStandaloneCodeEditor
        let modelRef: IReference<ITextFileEditorModel>
        let webSocket: WebSocket

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

                    // 更新 monaco editor 的配置
                    await updateUserConfiguration(`{
                        "editor.fontSize": ${props.options.fontSize},
                        "editor.tabSize": ${props.options.tabSize},
                        "workbench.colorTheme": "${props.options.theme}",
                        "editor.minimap.enabled": ${false},
                        "editor.gotoLocation.multipleDefinitions": "alt",
                    }`)

                    // 注册 LSP 的一些配置
                    if (props.lang == LangEnum.PYTHON) {
                        // 将 pyright 插件注册到 vscode API 中
                        registerExtension(pythonExtension, ExtensionHostKind.LocalProcess)
                    }
                    const url = createUrl(
                        editorRunConfig.value.clientUrl,
                        editorRunConfig.value.serverPort,
                        editorRunConfig.value.serverPath,
                        {
                            authorization: 'AuroraOJ-HDD'
                        },
                        false
                    )
                    if (props.lang != LangEnum.C) {
                        webSocket = initWebSocketAndStartClient(url, props.lang)
                    }
                    editor.setValue(props.codeValue)
                    // 监听用户输入代码的改变, 将其传至父组件
                    editor.onDidChangeModelContent(() => {
                        const codeContent = editor.getValue()
                        emit('update-codeValue', codeContent)
                    })
                } else {
                    console.error(`Monaco Editor DOM ID: ${props.htmlElementId} 无法挂载`)
                }
            })()
        }

        onMounted(() => {
            InitEditor()
        })

        /* 切换语言时更新相关配置 */
        watch(
            () => props.lang,
            async (newLang: string) => {
                if (webSocket) {
                    webSocket.close() // 关闭上一个语言的 LSP 连接
                }
                if (modelRef) {
                    modelRef.dispose()
                }
                if (editor) {
                    const langConfig = adaptLangConfig(newLang)
                    const fileName = adaptLangFileName(newLang)
                    try {
                        const fileSystemProvider = new RegisteredFileSystemProvider(false)
                        fileSystemProvider.registerFile(
                            new RegisteredMemoryFile(
                                vscode.Uri.file(`${MonacoEditorCodeStoreDir}/${fileName}`),
                                newLang
                            )
                        )
                        registerFileSystemOverlay(1, fileSystemProvider)
                        const newModelRef = await adaptLangModel(newLang, fileName, props.codeValue)
                        editor.setModel(newModelRef.object.textEditorModel)
                        const url = createUrl(
                            editorRunConfig.value.clientUrl,
                            langConfig.serverPort,
                            langConfig.serverPath,
                            {
                                authorization: 'AuroraOJ-HDD'
                            },
                            false
                        )
                        if (newLang != LangEnum.C) {
                            webSocket = initWebSocketAndStartClient(url, newLang)
                        }
                    } catch (error) {
                        console.error('语言切换失败: ', error)
                    }
                }
            }
        )

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

        /* 组件销毁的同时关闭与 LSP 的同时 也销毁 monaco editor */
        onBeforeUnmount(() => {
            webSocket.close()
            editor.dispose()
        })

        const codeEditor = ref()
        /* 接收来自 QuestionView 中 "拖拽" 或 "双击" 后同步 Code mirror 组件高度的设置 */
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

        const CodeWidthIsChange = inject<Ref<boolean>>('codeWidthIsChange')
        const codeWidthIsChange = ref(CodeWidthIsChange)
        // 监听 CodeHeightVH 的变化
        watch(codeWidthIsChange, (newHeight) => {
            if (editor && newHeight != null && codeEditor.value) {
                codeEditor.value.style.width = '100%'
                editor.layout() // 通知 Monaco 重新布局
            }
        })

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
