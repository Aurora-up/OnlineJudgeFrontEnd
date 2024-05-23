/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpResponseListProblemSubmitRecordQueryResponse } from '../models/BaseHttpResponseListProblemSubmitRecordQueryResponse';
import type { BaseHttpResponseLong } from '../models/BaseHttpResponseLong';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProblemSubmitControllerService {
    /**
     * @param pId
     * @param uId
     * @returns BaseHttpResponseListProblemSubmitRecordQueryResponse OK
     * @throws ApiError
     */
    public static getProblemSubmissionByPIdAndUId(
        pId: number,
        uId: number,
    ): CancelablePromise<BaseHttpResponseListProblemSubmitRecordQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/submission/query',
            query: {
                'PId': pId,
                'UId': uId,
            },
        });
    }
    /**
     * @param psId
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static deleteProblemSubmission(
        psId: number,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/submission/remove/{psId}',
            path: {
                'psId': psId,
            },
        });
    }
}
