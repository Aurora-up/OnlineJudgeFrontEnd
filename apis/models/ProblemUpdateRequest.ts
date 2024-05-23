/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestCase } from './TestCase';
export type ProblemUpdateRequest = {
    problemId?: string;
    title?: string;
    description?: string;
    content?: string;
    tags?: Array<string>;
    timeLimit?: number;
    memoryLimit?: number;
    difficult?: number;
    answer?: string;
    answerLang?: string;
    judgeCase?: Array<TestCase>;
    testSample?: Array<TestCase>;
    updateTime?: string;
    source?: Array<string>;
};

