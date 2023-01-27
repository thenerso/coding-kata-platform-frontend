import { IProblem, StartCode, TestSuite } from "./problemSet";

export interface IEvaluate {
  userId: string;
  problemId: string;
  code: string;
  lang: string;
}

export interface IEvalResponse {
  successful: boolean;
  privateTestsPassed: boolean;
  testResultsWithLogs: PublicTestResult[];
  publicTestResults: PublicTestResult[];
  problem: IProblem;
}

export interface PublicTestResult {
  compileResult: CompileResult;
  correct: boolean;
}

export interface CompileResult {
  id: null;
  output: string;
  errors: string;
  lang: string;
  code: string;
  compiled: boolean;
}
