import { IProblem } from "./problemSet";
import { IUser } from "./user";

export interface ISolution {
    id?: number;
    code?: string;
    lang?: string;
    correct?: boolean;
    problem?: IProblem;
    submissionDate?: string;
    user?: IUser;
}

export interface IEvalInput {
    lang?: string;
    code?: string;
    userId?: string;
}

export interface IEvalResult {
    successful?: boolean;
    privateTestsPassed?: boolean;
    testResultsWithLogs?: ITestCaseResult[];
    publicTestResults?: ITestCaseResult[];
    problem?: IProblem;
}

export interface ICompileInput {
    lang?: string;
    code?: string;
}

export interface ITestCaseResult {
    correct?: boolean;
    compileResult?: ICompileInput;
}

export interface ICompileResult {
    id?: number;
    output?: string;
    errors?: string;
    lang?: string;
    code?: string;
    compiled?: boolean;
}