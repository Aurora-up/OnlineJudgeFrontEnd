/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestCase } from './TestCase';
export type ProblemAddRequest = {
    userId?: number;
    title?: string;
    description?: string;
    content?: string;
    tags?: Array<string>;
    difficult?: number;
    answer?: string;
    answerLang?: string;
    judgeCase?: Array<TestCase>;
    testSample?: Array<TestCase>;
    timeLimit?: number;
    memoryLimit?: number;
    source?: Array<string>;
};

