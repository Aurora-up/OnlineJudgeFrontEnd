import { WebSocketServer, ServerOptions } from 'ws';
import { IncomingMessage, Server } from 'http';
import { URL } from 'url';
import { Socket } from 'net';
import { IWebSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';
import { createConnection, createServerProcess, forward } from 'vscode-ws-jsonrpc/server';
import { Message, InitializeRequest, InitializeParams } from 'vscode-languageserver';
import * as cp from 'child_process';

/**
 * 枚举类型: 启动相关语言服务器的命令前缀
 */
export enum LanguageName {
    /**
     * python -- pyright
     */
    node = 'node',
    /**
     * java --
     */
    java = 'java',
    /**
     * rust -- rust-analyzer
     */
    rust = "rust-analyzer",
    /**
     * cpp/c -- clangd
     */
    cpp = "clangd"
}

/**
 * 语言服务器————需要的运行配置
 */
export interface LanguageServerRunConfig {
    serverName: string;                        // LSP 名称
    pathName: string;                          // LSP 所在路径
    serverPort: number;                        // LSP 运行端口
    runCommand: LanguageName | string;         // 启动 LSP 的命令前缀
    runCommandArgs: string[];                  // 启动 LSP 的命令的参数列表
    wsServerOptions: ServerOptions,            // WebSocket 服务器选项
    spawnOptions?: cp.SpawnOptions;            // 子进程选项
}

/**
 * 启动 LSP Server 进程
 * @param runConfig  LSP 服务运行配置
 * @param socket     WebSocket
 */
export const launchLanguageServer = (runConfig: LanguageServerRunConfig, socket: IWebSocket) => {
    const { serverName, runCommand, runCommandArgs, spawnOptions } = runConfig;

    /* 1. 创建 WebSocket 的信息输入输出管道 */
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    /* 2. 启动 LSP 服务器进程 并 创建一个 WebSocket 服务 与其进行连接  */
    const socketConnection = createConnection(reader, writer, () => socket.dispose());  // 创建WebSocket连接
    const serverConnection = createServerProcess(serverName, runCommand, runCommandArgs, spawnOptions);  // 创建语言服务器进程
    // 若已成功连接
    if (serverConnection) {
        /* 3. 转发 WebSocket 服务连接双方的通信的消息 */
        forward(socketConnection, serverConnection, message => {
            // Express Server --> LSP 服务器
            if (Message.isRequest(message)) {
                console.log(`${serverName} Express Server 接收到请求:`);  // 打印服务器收到的请求消息
                console.log(message);  // 打印消息内容
                // 处理  monaco-editor-client --> LSP 服务器 的 "首次请求", 持久化一些相关参数
                if (message.method === InitializeRequest.type.method) {
                    const initializeParams = message.params as InitializeParams;  // 获取初始化参数
                    initializeParams.processId = process.pid;  // 将当前进程的ID添加到初始化参数中
                }
            }
            // LSP 服务器 --> Express Server
            if (Message.isResponse(message)) {
                console.log(`${serverName} Express Server 发送消息:`);
                console.log(message);
            }
            return message;  // 返回消息
        });
    }
};

/**
 * 将普通的 HTTP Server 升级为 WebSocket Server
 * @param runConfig LSP 服务运行配置
 * @param config    HTTP Server 配置 和 WebSocket Server 配置
 */
export const upgradeWsServer = (runConfig: LanguageServerRunConfig,
                                config: {
                                    server: Server,
                                    wss: WebSocketServer
                                }) => {
    config.server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
        // 解析请求URL
        const baseURL = `http://${request.headers.host}/`;
        const pathName = request.url ? new URL(request.url, baseURL).pathname : undefined;

        // 如果请求路径与配置的路径匹配，则处理升级请求
        if (pathName === runConfig.pathName) {
            config.wss.handleUpgrade(request, socket, head, webSocket => {
                //
                const socket: IWebSocket = {
                    // 发送数据
                    send: content => webSocket.send(content, error => {
                        if (error) { throw error; }
                    }),
                    // 接收消息
                    onMessage: cb => webSocket.on('message', (data) => {  // 监听消息事件
                        console.log(data.toString());  // 将接收到的消息转换为字符串并打印
                        cb(data);  // 调用回调函数处理消息
                    }),
                    // 处理错误
                    onError: cb => webSocket.on('error', cb),  // 监听错误事件
                    // 关闭连接
                    onClose: cb => webSocket.on('close', cb),  // 监听连接关闭事件
                    // 销毁WebSocket
                    dispose: () => webSocket.close()     // 关闭 WebSocket 连接
                };
                // WebSocket 连接打开后启动 LSP Server
                if (webSocket.readyState === webSocket.OPEN) {  // 如果WebSocket连接处于打开状态
                    launchLanguageServer(runConfig, socket);  // 启动语言服务器
                } else {
                    webSocket.on('open', () => {  // 监听WebSocket的打开事件
                        launchLanguageServer(runConfig, socket);  // 启动语言服务器
                    });
                }
            });
        }
    });
};
