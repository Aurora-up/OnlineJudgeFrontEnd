import { editor, languages } from 'monaco-editor'
import {
    createConfiguredEditor,
    createModelReference,
    type IReference,
    type ITextFileEditorModel
} from 'vscode/monaco'
import '@codingame/monaco-vscode-theme-defaults-default-extension'
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override'
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override'
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override'
import { initServices, MonacoLanguageClient } from 'monaco-language-client'
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient'
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc'
import { Uri } from 'vscode'
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override'
import { type Options } from '@/module/MonacoEditorType'
import '@codingame/monaco-vscode-rust-default-extension'
import '@codingame/monaco-vscode-java-default-extension'
import '@codingame/monaco-vscode-python-default-extension'
import '@codingame/monaco-vscode-cpp-default-extension'
import * as vscode from 'vscode'
import {
    RegisteredFileSystemProvider,
    RegisteredMemoryFile,
    registerFileSystemOverlay
} from '@codingame/monaco-vscode-files-service-override'

import { MonacoEditorCodeStoreDir } from '@/client/config'

export interface LanguageClientRunConfig {
    vscodeApiInit: boolean
    clientUrl: string
    serverPath: string
    serverPort: number
    registerConfig: languages.ILanguageExtensionPoint
    codeValue: string
    htmlElementId: string
    configOption?: Options
}

/**
 * 创建 LSP Serve 对应的 Language Client
 * @param transports   输入输出管道
 * @param lang         对应语言
 */
export const createLanguageClient = (
    transports: MessageTransports,
    lang: string
): MonacoLanguageClient => {
    return new MonacoLanguageClient({
        name: 'Language Client',
        clientOptions: {
            documentSelector: [lang],
            errorHandler: {
                error: () => ({ action: ErrorAction.Continue }),
                closed: () => ({ action: CloseAction.DoNotRestart })
            },
            workspaceFolder: {
                index: 0,
                name: 'workspace',
                uri: vscode.Uri.parse(MonacoEditorCodeStoreDir)
            },
            synchronize: {
                fileEvents: [vscode.workspace.createFileSystemWatcher('**')]
            }
        },
        connectionProvider: {
            get: () => {
                return Promise.resolve(transports)
            }
        }
    })
}

/**
 * 创建 webSocket 协议的 URL
 * @param hostname 域名 / IP地址
 * @param port     端口
 * @param path     路径
 * @param searchParams 参数
 * @param secure   ws | wss
 */
export const createUrl = (
    hostname: string,
    port: number,
    path: string,
    searchParams: Record<string, string | string[]> = {},
    secure: boolean = location.protocol === 'https:'
): string => {
    const protocol = secure ? 'wss' : 'ws'
    const url = new URL(`${protocol}://${hostname}:${port}${path}`)
    for (const [key, value] of Object.entries(searchParams)) {
        let output: string | undefined
        if (value instanceof Array) {
            output = value.join(',')
        } else {
            output = value?.toString()
        }
        url.searchParams.set(key, output)
    }
    return url.toString()
}

/**
 * 创建 WebSocket 连接
 * @param url  WebSocket 连接 URL, 例如: ws://localhost:30001/pyright
 * @param lang 编程语言
 */
export const initWebSocketAndStartClient = (url: string, lang: string): WebSocket => {
    const webSocket: WebSocket = new WebSocket(url)
    webSocket.onopen = async () => {
        const socket = toSocket(webSocket)
        const reader = new WebSocketMessageReader(socket)
        const writer = new WebSocketMessageWriter(socket)
        // 创建对应的语言客户端
        const languageClient = createLanguageClient(
            {
                reader,
                writer
            },
            lang
        )
        await languageClient.start()
        reader.onClose(() => languageClient.stop())
    }
    webSocket.onerror = async () => {
        console.log('LSP 服务的 WebSocket 连接出错: -> ', url)
    }
    webSocket.onclose = async () => {
        console.log(lang, ' LSP 关闭, ', url)
    }
    return webSocket
}

export type MonacoCodeEditor = {
    lang: string
    editor: editor.IStandaloneCodeEditor
    uri: Uri
    modelRef: IReference<ITextFileEditorModel>
}

/**
 * 初始化 VsCode 服务和插件
 * @param vscodeApiInit   VsCode API 是否初始化结束
 * @param registerConfig  注册对不同编程语言对应的插件
 */
export const doInit = async (
    vscodeApiInit: boolean,
    registerConfig: languages.ILanguageExtensionPoint
) => {
    if (vscodeApiInit) {
        await initServices({
            userServices: {
                ...getThemeServiceOverride(), // 初始化 "主题" 服务
                ...getTextmateServiceOverride(), // 初始化 "文本元信息" 服务
                ...getConfigurationServiceOverride(), // 初始化 "配置" 服务
                ...getKeybindingsServiceOverride() // 初始化 "键位映射" 服务
            },
            debugLogging: false, // 是否开启调试日志
            // workspace 配置
            workspaceConfig: {
                workspaceProvider: {
                    trusted: true,
                    workspace: {
                        workspaceUri: Uri.file(MonacoEditorCodeStoreDir)
                    },
                    async open() {
                        return false
                    }
                }
            }
        })
        languages.register(registerConfig)
    }
}

/**
 * 适配不同语言对应的虚拟内存文件
 * @param lang 编程语言
 */
export const adaptLangFileName = (lang: string): string => {
    const mp = new Map<string, string>()
    mp.set('python', 'main.py')
    mp.set('java', 'Main.java')
    mp.set('rust', 'rust_project/src/main.rs')
    mp.set('cpp', 'main.cpp')
    mp.set('c', 'main.c')
    if (mp.has(lang)) {
        return mp.get(lang) ?? 'main.py'
    }
    return 'main.py'
}

/**
 * 语言配置
 */
export type LangConfig = {
    serverPath: string // 该语言对应 LSP 的地址
    serverPort: number // 该语言对应 LSP 的端口
    langRegisterConfig: languages.ILanguageExtensionPoint // 注册到 monaco editor 的相关配置
}

export const adaptLangModel = async (lang: string, fileName: string, codeContent: string) => {
    const uri = vscode.Uri.parse(`${MonacoEditorCodeStoreDir}/${fileName}`)
    const modelRef = await createModelReference(uri, codeContent)
    modelRef.object.setLanguageId(lang)
    return modelRef
}

/**
 * 适配不同语言的一些配置项:[LSP 服务的地址和端口, Monaco Editor 注册配置]
 * @param lang 语言
 */
export const adaptLangConfig = (lang: string): LangConfig | undefined => {
    const mp = new Map<string, LangConfig>()
    mp.set('python', {
        serverPath: '/pyright',
        serverPort: 30001,
        langRegisterConfig: {
            id: 'python',
            extensions: ['.py']
        }
    })
    mp.set('java', {
        serverPath: '/java',
        serverPort: 30002,
        langRegisterConfig: {
            id: 'java',
            extensions: ['.java'],
            aliases: ['java']
        }
    })
    mp.set('rust', {
        serverPath: '/rust',
        serverPort: 30003,
        langRegisterConfig: {
            id: 'rust',
            extensions: ['.rs'],
            aliases: ['rs', 'Rust']
        }
    })
    mp.set('cpp', {
        serverPath: '/cpp',
        serverPort: 30004,
        langRegisterConfig: {
            id: 'cpp',
            extensions: ['.cpp'],
            aliases: ['Cpp']
        }
    })
    mp.set('c', {
        serverPath: '/cpp',
        serverPort: 30004,
        langRegisterConfig: {
            id: 'c',
            extensions: ['.c']
        }
    })
    if (mp.has(lang)) {
        return mp.get(lang)
    } else {
        throw '不支持当前语言'
    }
}

/**
 * 创建 Monaco Editor
 * @param config
 *  hTMLElement:  Monaco Editor 要挂载的 DOM 节点
 *  codeValue:    编辑器中的代码内容
 *  lang:         对应的编程语言
 */
export const createMonacoEditor = async (config: {
    htmlElement: HTMLElement
    codeValue: string
    lang: string
}) => {
    const fileName = adaptLangFileName(config.lang)
    // 创建语言 Model
    const fileSystemProvider: RegisteredFileSystemProvider = new RegisteredFileSystemProvider(false)

    fileSystemProvider.registerFile(
        new RegisteredMemoryFile(
            vscode.Uri.file(`${MonacoEditorCodeStoreDir}/${fileName}`),
            config.codeValue
        )
    )
    registerFileSystemOverlay(1, fileSystemProvider)
    const uri = vscode.Uri.parse(`${MonacoEditorCodeStoreDir}/${fileName}`)

    const modelRef = await createModelReference(uri, config.codeValue)
    modelRef.object.setLanguageId(config.lang)

    // 创建 Monaco Editor
    const editor = createConfiguredEditor(config.htmlElement, {
        model: modelRef.object.textEditorModel,
        glyphMargin: false,
        lightbulb: {
            enabled: true
        },
        automaticLayout: true,
        wordBasedSuggestions: 'allDocuments'
    })

    const result = {
        editor,
        uri,
        modelRef
    } as MonacoCodeEditor
    return Promise.resolve(result)
}
