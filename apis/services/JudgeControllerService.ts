/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpResponseJudgeResponse } from '../models/BaseHttpResponseJudgeResponse';
import type { BaseHttpResponseListMultiTestCaseDebugResponse } from '../models/BaseHttpResponseListMultiTestCaseDebugResponse';
import type { DebugSubmitRequest } from '../models/DebugSubmitRequest';
import type { JudgeSubmitRequest } from '../models/JudgeSubmitRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class JudgeControllerService {
    /**
     * @param requestBody
     * @returns BaseHttpResponseJudgeResponse OK
     * @throws ApiError
     */
    public static judgeCode(
        requestBody: JudgeSubmitRequest,
    ): CancelablePromise<BaseHttpResponseJudgeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/code/judge',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseHttpResponseListMultiTestCaseDebugResponse OK
     * @throws ApiError
     */
    public static multiTestCaseDebug(
        requestBody: DebugSubmitRequest,
    ): CancelablePromise<BaseHttpResponseListMultiTestCaseDebugResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/code/debug',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
