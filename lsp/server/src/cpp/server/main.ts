import { resolve } from 'path';
import { runLanguageServer } from '../../common/LSPRunner.js';
import { IncomingMessage } from 'http';
import { LanguageName } from '../../common/LSPserver.js';

export const runCppServer = (baseDir: string, relativeDir: string) => {
    const processRunPath = resolve(baseDir, relativeDir);
    runLanguageServer({
        serverName: 'CLANGD',
        pathName: '/cpp',
        serverPort: 30004,
        /**
         * c/cpp 的 LSP 之一是 clangd , 启动该 LSP Server 使用命令:
         *  `clangd <args>`
         */
        runCommand: `${LanguageName.cpp}`,
        runCommandArgs: [
            '-j=2',
            '--completion-style=detailed',
            '--header-insertion=iwyu',
            '--clang-tidy',
            '--function-arg-placeholders=true',
            "--query-driver=/usr/bin/g++",
            "--query-driver=/usr/bin/gcc",
            '--header-insertion-decorators',
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
