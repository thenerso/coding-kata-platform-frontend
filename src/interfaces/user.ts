import { ICohort } from "./cohort";

export interface IUser {
  id?: number;
  username: string;
  email: string;
  cohort?: ICohort | null;
  roles?: string[];
  score?: number;
  joinDate?: string;
  solutions?: any[];
  completedProblems?: any[];
}
