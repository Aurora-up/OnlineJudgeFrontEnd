import { resolve } from 'path';
import { runLanguageServer } from '../../common/LSPRunner.js';
import { IncomingMessage } from 'http';
import { LanguageName } from '../../common/LSPserver.js';

export const runJavaServer = (baseDir: string, relativeDir: string) => {
  const processRunPath = resolve(baseDir, relativeDir);
  console.log("路径: " , processRunPath)
  runLanguageServer({
    serverName: 'JDT',
    pathName: '/java',
    serverPort: 30002,
    /**
     * java 的 LSP 之一是 Eclipse 提供的 Eclipse JDT , 其由 java 编写, 启动该 LSP Server 使用命令:
     * https://github.com/eclipse-jdtls/eclipse.jdt.ls?tab=readme-ov-file#running-from-the-command-line
     *  java \
     *         -Declipse.application=org.eclipse.jdt.ls.core.id1 \
     *         -Dosgi.bundles.defaultStartLevel=4 \
     *         -Declipse.product=org.eclipse.jdt.ls.core.product \
     *         -Dlog.level=ALL \
     *         -Xmx1G \
     *         --add-modules=ALL-SYSTEM \
     *         --add-opens java.base/java.util=ALL-UNNAMED \
     *         --add-opens java.base/java.lang=ALL-UNNAMED \
     *         -jar ./plugins/org.eclipse.equinox.launcher_1.5.200.v20180922-1751.jar \  # [执行器存放地址]
     *         -configuration ./config_mac \                                             # [根据不同的系统使用不同的配置]
     */
    runCommand: LanguageName.java,
    runCommandArgs: [
      // '-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=,quiet=y',
      '-Declipse.application=org.eclipse.jdt.ls.core.id1',
      '-Dosgi.bundles.defaultStartLevel=4',
      // '-noverify',
      '-Declipse.product=org.eclipse.jdt.ls.core.product',
      '-Dlog.level=ALL',
      '-Xmx512m',
      '-Xms512m',
      // '--add-modules=ALL-SYSTEM',
      '--add-opens',
      'java.base/java.util=ALL-UNNAMED',
      '--add-opens',
      'java.base/java.lang=ALL-UNNAMED',
      '--add-opens',
      'java.base/java.io=ALL-UNNAMED',
      '-jar',
      `${processRunPath}/plugins/org.eclipse.equinox.launcher_1.6.400.v20210924-0641.jar`,
      `-configuration`,
      `${processRunPath}/config_mac`,
      '-data',
      `${processRunPath}/workspace`
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
