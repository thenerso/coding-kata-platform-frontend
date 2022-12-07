import { IUser } from "./user";

export interface ICohort {
  id?: number;
  name: string;
  startDate: string;
  members: IUser[];
}
