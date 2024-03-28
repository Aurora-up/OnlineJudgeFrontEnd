import { resolve } from 'path';
import { runLanguageServer } from '../../common/LSPRunner.js';
import { IncomingMessage } from 'http';
import { LanguageName } from '../../common/LSPserver.js';

export const runPythonServer = (baseDir: string, relativeDir: string) => {
    const processRunPath = resolve(baseDir, relativeDir);

    runLanguageServer({
        serverName: 'PYRIGHT',
        pathName: '/pyright',
        serverPort: 30001,
        /**
         * python 的 LSP 之一是 Microsoft 提供的 pyright , 其由 typescript 编写, 故启动该 LSP Server 使用命令:
         *  `node <path_name>/pyright/dist/pyright-langserver.js --stdio`
         */
        runCommand: LanguageName.node,
        runCommandArgs: [
            processRunPath,
            '--stdio'
        ],
        wsServerOptions: {
            noServer: true,
            perMessageDeflate: false,
            clientTracking: true,
            verifyClient: (
                clientInfo: { origin: string; secure: boolean; req: IncomingMessage },
                callback
            ) => {
                const parsedURL = new URL(`${clientInfo.origin}${clientInfo.req?.url ?? ''}`);
                const authToken = parsedURL.searchParams.get('authorization');
                if (authToken === 'AuroraOJ-HDD') {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        }
    });
};
