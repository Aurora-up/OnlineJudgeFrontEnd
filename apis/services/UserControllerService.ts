/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpResponseLoginUserVO } from '../models/BaseHttpResponseLoginUserVO';
import type { BaseHttpResponseLong } from '../models/BaseHttpResponseLong';
import type { BaseHttpResponseUser } from '../models/BaseHttpResponseUser';
import type { UserLoginRequest } from '../models/UserLoginRequest';
import type { UserRegisterRequest } from '../models/UserRegisterRequest';
import type { WebSession } from '../models/WebSession';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * @param requestBody
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static userRegister(
        requestBody: UserRegisterRequest,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param session
     * @param requestBody
     * @returns BaseHttpResponseLoginUserVO OK
     * @throws ApiError
     */
    public static userLogin(
        session: WebSession,
        requestBody: UserLoginRequest,
    ): CancelablePromise<BaseHttpResponseLoginUserVO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login',
            query: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param session
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static logoutCurrentLoginUser(
        session: WebSession,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/logout',
            query: {
                'session': session,
            },
        });
    }
    /**
     * @param session
     * @returns BaseHttpResponseLoginUserVO OK
     * @throws ApiError
     */
    public static getLoginUser(
        session: WebSession,
    ): CancelablePromise<BaseHttpResponseLoginUserVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/getLogin',
            query: {
                'session': session,
            },
        });
    }
    /**
     * @param userId
     * @param session
     * @returns BaseHttpResponseUser OK
     * @throws ApiError
     */
    public static getUserById(
        userId: number,
        session: WebSession,
    ): CancelablePromise<BaseHttpResponseUser> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/get/{userId}',
            path: {
                'userId': userId,
            },
            query: {
                'session': session,
            },
        });
    }
    /**
     * @param userId
     * @returns BaseHttpResponseLong OK
     * @throws ApiError
     */
    public static removeUser(
        userId: number,
    ): CancelablePromise<BaseHttpResponseLong> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/remove/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
}
