export interface IProblemSet {
  id?: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  problems: IProblem[];
}

export interface IProblem {
  id?: number;
  title?: string;
  description?: string;
  difficulty?: string;
  testSuite?: TestSuite;
  startCode: StartCode;
  tags?: string[];
}

export interface StartCode {
  [key: string]: any;
  id: number;
  js: string;
  py: string;
  java: string;
}

export interface TestSuite {
  publicCases: Case[];
  privateCases: Case[];
}

export interface Case {
  id?: number;
  inputs: Put[];
  output: Put;
}

export interface Put {
  id?: number;
  value?: string;
  dataType?: DataType;
}

export enum DataType {
  INT = "INT",
  INT_ARRAY = "INT_ARRAY",
  STRING = "STRING",
  STRING_ARRAY = "STRING_ARRAY",
  FLOAT = "FLOAT",
  FLOAT_ARRAY = "FLOAT_ARRAY",
  BOOLEAN = "BOOLEAN",
  BOOLEAN_ARRAY = "BOOLEAN_ARRAY",
}

export enum Difficulty {
  VERY_EASY = "Very Easy",
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
  VERY_HARD = "Very Hard",
}
