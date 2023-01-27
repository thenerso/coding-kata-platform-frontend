import { List, Typography } from "@mui/material";
import { IEvalResponse } from "../../../interfaces/eval";
import { IProblem } from "../../../interfaces/problemSet";
import AttemptOutputTestCases from "./AttemptOutputTestCases";

interface IAttemptOutput {
  problem: IProblem;
  evalResponse: IEvalResponse | null | undefined;
}

const AttemptOutput = ({ problem, evalResponse }: IAttemptOutput) => {
  if (!evalResponse)
    return (
      <div>
        <Typography>Your results will be shown here </Typography>
      </div>
    );
  return (
    <List>
      {evalResponse?.testResultsWithLogs.map((result, index) => {
        return (
          <AttemptOutputTestCases
            key={index}
            index={index}
            evalResponse={result}
            testCase={problem.testSuite.publicCases[index]}
            functionName={problem.title}
          />
        );
      })}
    </List>
  );
};

export default AttemptOutput;
