import { resolve } from 'path'
import { runLanguageServer } from '../../common/LSPRunner.js'
import { IncomingMessage } from 'http'
import { LanguageName } from '../../common/LSPserver.js'

export const runRustServer = (baseDir: string, relativeDir: string) => {
  const processRunPath = resolve(baseDir, relativeDir)
  const lspPath = `${processRunPath}/${LanguageName.rust}`;
  console.log('地址: ', lspPath)
  runLanguageServer({
    serverName: 'Rust-Analyzer',
    pathName: '/rust',
    serverPort: 30003,
    /**
     * rust 的 LSP 之一是 rust-analyzer , 其由 rust 编写, 编译后为二进制文件, 故启动该 LSP Server 使用命令:
     *  `rust-analyzer`
     */
    runCommand: lspPath,
    runCommandArgs: [],
    wsServerOptions: {
      noServer: true,
      perMessageDeflate: false,
      clientTracking: true,
      verifyClient: (
        clientInfo: { origin: string; secure: boolean; req: IncomingMessage },
        callback
      ) => {
        const parsedURL = new URL(`${clientInfo.origin}${clientInfo.req?.url ?? ''}`)
        const authToken = parsedURL.searchParams.get('authorization')
        if (authToken === 'AuroraOJ-HDD') {
          callback(true)
        } else {
          callback(false)
        }
      }
    }
  })
}
