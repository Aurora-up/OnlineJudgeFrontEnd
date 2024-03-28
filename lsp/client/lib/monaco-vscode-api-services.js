/* --------------------------------------------------------------------------------------------
 * Copyright (cpp) 2024 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { ILogService, initialize, StandaloneServices } from 'vscode/services';
import 'vscode/localExtensionHost';
import getLanguagesServiceOverride from '@codingame/monaco-vscode-languages-service-override';
import getModelServiceOverride from '@codingame/monaco-vscode-model-service-override';
export const wasVscodeApiInitialized = () => {
    return window.MonacoEnvironment?.vscodeApiInitialised === true;
};
export const initServices = async (config) => {
    if (!wasVscodeApiInitialized()) {
        await importAllServices(config);
        if (config?.debugLogging === true) {
            console.log('Initialization of vscode services completed successfully.');
        }
        if (!window.MonacoEnvironment) {
            window.MonacoEnvironment = {};
        }
        window.MonacoEnvironment.vscodeApiInitialised = true;
    }
    else {
        if (config?.debugLogging === true) {
            console.log('Initialization of vscode services can only performed once!');
        }
    }
};
export const useOpenEditorStub = async (modelRef, options, sideBySide) => {
    console.log('Received open editor call with parameters: ', modelRef, options, sideBySide);
    return undefined;
};
export const reportServiceLoading = (services, debugLogging) => {
    for (const serviceName of Object.keys(services)) {
        if (debugLogging) {
            console.log(`Loading service: ${serviceName}`);
        }
    }
};
export const mergeServices = (services, overrideServices) => {
    for (const [name, service] of Object.entries(services)) {
        overrideServices[name] = service;
    }
};
/**
 * monaco-vscode-api automatically loads the following services:
 *  - layout
 *  - environment
 *  - extension
 *  - files
 *  - quickAccess
 *
 * monaco-languageclient always adds the following services:
 *   - languages
 *   - model
 */
export const importAllServices = async (config) => {
    const lc = config ?? {};
    const userServices = lc.userServices ?? {};
    const mlcDefautServices = {
        ...getLanguagesServiceOverride(),
        ...getModelServiceOverride()
    };
    mergeServices(mlcDefautServices, userServices);
    reportServiceLoading(userServices, lc.debugLogging === true);
    const haveThemeService = Object.keys(userServices).includes('themeService');
    const haveTextmateService = Object.keys(userServices).includes('textMateTokenizationFeature');
    const haveMarkersService = Object.keys(userServices).includes('markersService');
    const haveViewsService = Object.keys(userServices).includes('viewsService');
    // theme requires textmate
    if (haveThemeService && !haveTextmateService) {
        throw new Error('"theme" service requires "textmate" service. Please add it to the "userServices".');
    }
    // markers service requires views service
    if (haveMarkersService && !haveViewsService) {
        throw new Error('"markers" service requires "views" service. Please add it to the "userServices".');
    }
    await initialize(userServices);
    const logLevel = lc.workspaceConfig?.developmentOptions?.logLevel;
    if (logLevel) {
        StandaloneServices.get(ILogService).setLevel(logLevel);
    }
};
//# sourceMappingURL=monaco-vscode-api-services.js.map