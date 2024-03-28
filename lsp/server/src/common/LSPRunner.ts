import { WebSocketServer } from 'ws';
import { Server } from 'http';
import express from 'express';
import { getLocalDirectory } from '../utils/fs-utils.js';
import { LanguageServerRunConfig, upgradeWsServer } from './LSPserver.js';

/** LSP server runner */
export const runLanguageServer = (
    languageServerRunConfig: LanguageServerRunConfig
) => {
    process.on('uncaughtException', function(err) {
        console.error('Uncaught Exception: ', err.toString());
        if (err.stack) {
            console.error(err.stack);
        }
    });
    // 创建 express Server
    const app = express();
    const dir = getLocalDirectory(import.meta.url);
    app.use(express.static(dir));
    // 启动一个 Http Server 监听 LSP Server 运行的端口号
    const httpServer: Server = app.listen(languageServerRunConfig.serverPort);
    const wss = new WebSocketServer(languageServerRunConfig.wsServerOptions);
    // 将 Http Server 升级为 WebSocket Server
    upgradeWsServer(languageServerRunConfig, {
        server: httpServer,
        wss
    });
};