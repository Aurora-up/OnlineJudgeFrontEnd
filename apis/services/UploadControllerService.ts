/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpResponseString } from '../models/BaseHttpResponseString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadControllerService {
    /**
     * @param requestBody
     * @returns BaseHttpResponseString OK
     * @throws ApiError
     */
    public static fileUpload(
        requestBody?: {
            file: Blob;
        },
    ): CancelablePromise<BaseHttpResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload',
            body: requestBody,
            mediaType: 'multipart/form-data',
        });
    }
}
