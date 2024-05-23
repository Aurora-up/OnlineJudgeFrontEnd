/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestCase } from './TestCase';
export type ProblemQueryResponse = {
    problemId?: number;
    title?: string;
    content?: string;
    tags?: Array<string>;
    timeLimit?: number;
    memoryLimit?: number;
    submitNum?: number;
    acceptedNum?: number;
    difficult?: number;
    testSample?: Array<TestCase>;
    source?: Array<string>;
};

