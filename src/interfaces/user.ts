import { ICohort } from "./cohort";
// import { IFile } from "./file";
import { ISolution } from "./solutions";


export interface IUser {
  [key: string]: any;
  id?: number;
  username: string;
  email: string;
  cohort?: ICohort | null;
  roles?: string[];
  score?: number;
  joinDate?: string;
  solutions?: ISolution[];
  completedProblems?: any[];
}

export interface IUserProfile {
  [key: string]: any;
  id?: number;
  user: IUser;
  fullName?: string;
  githubLink?: string;
  workExperience?: string[];
  education: string[];
  bio?: string;
  headshot?: string | null;
  resume?: string | null;
}

export interface IUserProgress {
  username: string;
  score: number;
  problemsSolved: number;
  totalProblems: number;
}