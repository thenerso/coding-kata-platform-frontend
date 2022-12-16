import React, { useState } from "react";
import { ICohort } from "../interfaces/cohort";
import { IUser } from "../interfaces/user";

export interface IAppContext {
  members: IUser[];
  setNewMembers: (members: IUser[]) => void;
  updateMember: (member: IUser) => void;
  cohorts: ICohort[];
  setNewCohorts: (cohorts: ICohort[]) => void;
  updateCohort: (cohort: ICohort) => void;
}

interface IAppProvider {
  children: React.ReactNode;
}

export const AppContext = React.createContext<IAppContext | null>(null);

const AppProvider = ({ children }: IAppProvider) => {
  const [members, setMembers] = useState<IUser[]>([]);
  const [cohorts, setCohorts] = useState<ICohort[]>([]);

  const setNewMembers = (newMembers: IUser[]) => {
    setMembers(newMembers);
  };

  const updateMember = (updatedMember: IUser) => {
    setMembers(
      members.map((member) => {
        if (member.id === updatedMember.id) {
          return updatedMember;
        }
        return member;
      })
    );
  };

  const setNewCohorts = (newCohorts: ICohort[]) => {
    setCohorts(newCohorts);
  };

  const updateCohort = (updatedCohort: ICohort) => {
    setCohorts(
      cohorts.map((cohort) => {
        if (cohort.id === updatedCohort.id) {
          return updatedCohort;
        }
        return cohort;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        members,
        setNewMembers,
        updateMember,
        cohorts,
        setNewCohorts,
        updateCohort,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
