/* --------------------------------------------------------------------------------------------
 * Copyright (cpp) 2024 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { BaseLanguageClient } from 'vscode-languageclient/lib/common/client.js';
export class MonacoLanguageClient extends BaseLanguageClient {
    connectionProvider;
    constructor({ id, name, clientOptions, connectionProvider }) {
        super(id || name.toLowerCase(), name, clientOptions);
        this.connectionProvider = connectionProvider;
    }
    createMessageTransports(encoding) {
        return this.connectionProvider.get(encoding);
    }
}
//# sourceMappingURL=monaco-language-client.js.map