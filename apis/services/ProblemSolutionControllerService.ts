/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpResponseListProblemSolutionRepositoryResponse } from '../models/BaseHttpResponseListProblemSolutionRepositoryResponse';
import type { BaseHttpResponseLong } from '../models/BaseHttpResponseLong';
import type { BaseHttpResponseProblemSolutionQueryResponse } from '../models/BaseHttpResponseProblemSolutionQueryResponse';
import type { ProblemSolutionAddRequest } from '../models/ProblemSolutionAddRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProblemSolutionControllerService {
    /**
     * @param requestBody
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static addProblemSolution(
        requestBody: ProblemSolutionAddRequest,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/solution/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param problemSolutionId
     * @returns BaseHttpResponseProblemSolutionQueryResponse OK
     * @throws ApiError
     */
    public static getProblemSolutionByPsId(
        problemSolutionId: number,
    ): CancelablePromise<BaseHttpResponseProblemSolutionQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/solution/query',
            query: {
                'problemSolutionId': problemSolutionId,
            },
        });
    }
    /**
     * @param problemId
     * @returns BaseHttpResponseListProblemSolutionRepositoryResponse OK
     * @throws ApiError
     */
    public static getProblemSolutionByPId(
        problemId: number,
    ): CancelablePromise<BaseHttpResponseListProblemSolutionRepositoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/solution/query/repository',
            query: {
                'problemId': problemId,
            },
        });
    }
    /**
     * @param problemId
     * @param userId
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static isHaveProblemSolution(
        problemId: number,
        userId: number,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/solution/have',
            query: {
                'problemId': problemId,
                'userId': userId,
            },
        });
    }
}
