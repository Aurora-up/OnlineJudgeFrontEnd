/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpResponseLong } from '../models/BaseHttpResponseLong';
import type { BaseHttpResponseNoteDTO } from '../models/BaseHttpResponseNoteDTO';
import type { NoteRequest } from '../models/NoteRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NoteControllerService {
    /**
     * @param requestBody
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static addOrUpdateProblem(
        requestBody: NoteRequest,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/note/modify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param problemId
     * @param userId
     * @returns BaseHttpResponseNoteDTO OK
     * @throws ApiError
     */
    public static getProblemNoteByPIdAndUId(
        problemId: number,
        userId: number,
    ): CancelablePromise<BaseHttpResponseNoteDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/note/query',
            query: {
                'problemId': problemId,
                'userId': userId,
            },
        });
    }
}
