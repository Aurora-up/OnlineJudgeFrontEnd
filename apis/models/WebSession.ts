/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WebSession = {
    id?: string;
    attributes?: Record<string, Record<string, any>>;
    lastAccessTime?: string;
    creationTime?: string;
    started?: boolean;
    expired?: boolean;
    maxIdleTime?: {
        seconds?: number;
        nano?: number;
        negative?: boolean;
        zero?: boolean;
        units?: Array<{
            dateBased?: boolean;
            timeBased?: boolean;
            durationEstimated?: boolean;
        }>;
    };
};

