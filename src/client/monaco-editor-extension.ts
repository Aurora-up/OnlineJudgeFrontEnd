// pyright 插件配置
// https://github.com/microsoft/pyright/blob/main/packages/vscode-pyright/package.json
// 最低配置确保 pyright 可以正常工作
export const pythonExtension = {
    name: 'pyright',
    publisher: 'HDD',
    version: '1.0.0',
    engines: {
        vscode: '^1.78.0'
    },
    contributes: {
        languages: [
            {
                id: 'python',
                aliases: ['Python'],
                extensions: ['.py', '.pyi']
            }
        ],
        commands: [
            {
                command: 'pyright.restartserver',
                title: 'Pyright: Restart Server',
                category: 'Pyright'
            },
            {
                command: 'pyright.organizeimports',
                title: 'Pyright: Organize Imports',
                category: 'Pyright'
            }
        ],
        keybindings: [
            {
                key: 'ctrl+k',
                command: 'pyright.restartserver',
                when: 'editorTextFocus'
            }
        ]
    }
}
