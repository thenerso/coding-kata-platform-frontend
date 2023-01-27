import { Delete, Edit, InputOutlined } from "@mui/icons-material";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Case } from "../../../interfaces/problemSet";

interface ITestCasesProps {
  functionName: string;
  testCase: Case;
  isPublic?: boolean;
  index?: number;
  testCaseAction?: (isPublic: boolean, action: string, index: number) => void;
}

const TestCases = ({
  functionName,
  testCase,
  isPublic = false,
  index = 0,
  testCaseAction,
}: ITestCasesProps) => {
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
                    <span>
                      {input.dataType?.includes("ARRAY") ? "[" : ""}
                      {input.value || ""}
                      {input.dataType?.includes("ARRAY") ? "]" : ""}
                    </span>
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
        {testCaseAction && (
          <>
            <ListItemIcon>
              <IconButton
                onClick={() => testCaseAction(isPublic, "edit", index)}
              >
                <Edit />
              </IconButton>
            </ListItemIcon>
            <ListItemIcon>
              <IconButton
                onClick={() => testCaseAction(isPublic, "delete", index)}
              >
                <Delete />
              </IconButton>
            </ListItemIcon>
          </>
        )}
      </ListItem>
    </>
  );
};

export default TestCases;
