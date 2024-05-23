/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpResponseListProblemRepositoryResponse } from '../models/BaseHttpResponseListProblemRepositoryResponse';
import type { BaseHttpResponseLong } from '../models/BaseHttpResponseLong';
import type { BaseHttpResponseProblemQueryResponse } from '../models/BaseHttpResponseProblemQueryResponse';
import type { ProblemAddRequest } from '../models/ProblemAddRequest';
import type { ProblemUpdateRequest } from '../models/ProblemUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProblemControllerService {
    /**
     * @param requestBody
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static updateProblem(
        requestBody: ProblemUpdateRequest,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/problem/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param pId
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static recoverProblem(
        pId: number,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/problem/recover/{pId}',
            path: {
                'pId': pId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static addProblem(
        requestBody: ProblemAddRequest,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/problem/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param keywords
     * @returns BaseHttpResponseListProblemRepositoryResponse OK
     * @throws ApiError
     */
    public static searchProblem(
        keywords: string = '',
    ): CancelablePromise<BaseHttpResponseListProblemRepositoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/problem/search',
            query: {
                'keywords': keywords,
            },
        });
    }
    /**
     * @param userId
     * @returns BaseHttpResponseListProblemRepositoryResponse OK
     * @throws ApiError
     */
    public static getAllProblemByUserId(
        userId: number,
    ): CancelablePromise<BaseHttpResponseListProblemRepositoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/problem/repository/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param userId
     * @param pageIndex
     * @param pageSize
     * @returns BaseHttpResponseListProblemRepositoryResponse OK
     * @throws ApiError
     */
    public static getAllProblemByPagedStrategy(
        userId: number,
        pageIndex: number = 1,
        pageSize: number = 30,
    ): CancelablePromise<BaseHttpResponseListProblemRepositoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/problem/repository/page/{userId}',
            path: {
                'userId': userId,
            },
            query: {
                'pageIndex': pageIndex,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * @param problemId
     * @returns BaseHttpResponseProblemQueryResponse OK
     * @throws ApiError
     */
    public static getProblemById(
        problemId: number,
    ): CancelablePromise<BaseHttpResponseProblemQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/problem/query/{problemId}',
            path: {
                'problemId': problemId,
            },
        });
    }
    /**
     * @param pId
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static deleteProblem(
        pId: number,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/problem/remove/{pId}',
            path: {
                'pId': pId,
            },
        });
    }
}
