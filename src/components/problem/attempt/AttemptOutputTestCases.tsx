import {
  Check,
  DoNotDisturb,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
  ListItemButton,
} from "@mui/material";
import { useState } from "react";
import { PublicTestResult } from "../../../interfaces/eval";
import { Case } from "../../../interfaces/problemSet";
import CodeEditor from "../../editor/CodeEditor";

interface IAttemptOutputTestCasesProps {
  functionName: string;
  testCase: Case;
  evalResponse: PublicTestResult;
  index?: number;
}

const AttemptOutputTestCases = ({
  functionName,
  testCase,
  evalResponse,
  index = 0,
}: IAttemptOutputTestCasesProps) => {
  const [open, setOpen] = useState(!evalResponse.correct && index === 0);

  const handleClick = () => {
    setOpen(!open);
  };
  if (open && evalResponse.correct) {
    setOpen(false);
  }
  return (
    <>
      <ListItemButton onClick={!evalResponse.correct ? handleClick : () => {}}>
        <ListItemIcon>
          {evalResponse.correct ? (
            <Check color="success" />
          ) : (
            <DoNotDisturb color="error" />
          )}
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
        {evalResponse.correct ? "" : open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CodeEditor
          theme="github"
          height="200px"
          value={
            evalResponse.compileResult.compiled
              ? evalResponse.compileResult.output
              : evalResponse.compileResult.errors
          }
          language={"javascript"}
          readOnly
          fontSize={12}
          showGutter={false}
        />
      </Collapse>
    </>
  );
};

export default AttemptOutputTestCases;
