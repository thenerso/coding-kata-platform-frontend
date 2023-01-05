import { InputOutlined, OutputOutlined } from "@mui/icons-material";
import {
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Case } from "../../interfaces/problemSet";

interface ITestCasesProps {
  testCase: Case;
}

const TestCases = ({ testCase }: ITestCasesProps) => {
  return (
    <>
      <ListSubheader>Inputs</ListSubheader>
      {testCase.inputs?.map((input, index) => {
        return (
          <ListItem key={`${index}-${input.id}`}>
            <ListItemIcon>
              <InputOutlined />
            </ListItemIcon>
            <ListItemText
              primary={`Expected Value: ${input.value} - ${input.dataType}`}
            />
          </ListItem>
        );
      })}
      <ListSubheader>Output</ListSubheader>
      <ListItem>
        <ListItemIcon>
          <OutputOutlined />
        </ListItemIcon>
        <ListItemText
          primary={`Expected Value: ${testCase.output?.value} - ${testCase.output?.dataType}`}
        />
      </ListItem>
    </>
  );
};

export default TestCases;
