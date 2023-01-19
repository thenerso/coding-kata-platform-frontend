import { Edit, InputOutlined } from "@mui/icons-material";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Case } from "../../interfaces/problemSet";

interface ITestCasesProps {
  functionName: string;
  testCase: Case;
}

const TestCases = ({ functionName, testCase }: ITestCasesProps) => {
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <InputOutlined />
        </ListItemIcon>
        <ListItemText>
          <code>
            {functionName}(
            {testCase.inputs.map((input, index) => {
              return (
                <span key={`${input.value}-${index}`}>
                  <Tooltip style={{ cursor: "pointer" }} title={input.dataType}>
                    <span>{input.value || ""}</span>
                  </Tooltip>
                  {index !== testCase.inputs.length - 1 ? "," : ""}
                </span>
              );
            })}
            ) {"=> "}
            <Tooltip
              style={{ cursor: "pointer" }}
              title={testCase.output.dataType}
            >
              <span>{testCase.output.value}</span>
            </Tooltip>
          </code>
        </ListItemText>

        <ListItemIcon>
          <IconButton>
            <Edit />
          </IconButton>
        </ListItemIcon>
      </ListItem>
    </>
  );
};

export default TestCases;
