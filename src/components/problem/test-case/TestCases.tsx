import { Delete, Edit, InputOutlined } from "@mui/icons-material";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Case } from "../../../interfaces/problemSet";
import TestCaseValue from "./TestCaseValue";

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
            {<span style={{ fontStyle: "italic" }}>{functionName}(</span>}
            {testCase.inputs.map((input, index) => {
              return (
                <span key={`${input.value}-${index}`}>
                  <Tooltip style={{ cursor: "pointer" }} title={input.dataType}>
                    <span style={{padding: '2px', borderRadius: '5px', backgroundColor: 'lightgray'}}>
                      {/* <span>{input.dataType?.includes("ARRAY") ? "[" : ""}</span> */}
                      {input.dataType?.includes("STRING")  && input.dataType?.includes("ARRAY") ? input.value?.split(",").map(word => `"${word.trim()}"`).join(",") : input.value ? input.value : ""}
                      {input.dataType?.includes("ARRAY") ? "]" : ""}
                    </span>
                  </Tooltip>
                  {index !== testCase.inputs.length - 1 ? "," : ""}
                </span>
              );
            })}
            <TestCaseValue>) {"=> "}</TestCaseValue>
            <Tooltip
              style={{ cursor: "pointer"}}
              title={testCase.output.dataType}
            >
              
              <span style={{ padding: '2px', color: 'darkgreen', borderRadius: '5px', backgroundColor: 'lightgray' }}>
                {testCase.output.dataType?.includes("ARRAY") ? "[" : ""}
                {testCase.output.dataType?.includes("STRING") && testCase.output.dataType.includes("ARRAY") ? testCase.output.value?.split(",").map(word => `"${word.trim()}"`).join(",") : testCase.output.value ? testCase.output.value : ""}
                {testCase.output.dataType?.includes("ARRAY") ? "]" : ""}
                </span>
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
