import styled from "@emotion/styled";
import { AddCircleOutline } from "@mui/icons-material";
import {
  Button,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControlLabel,
  FormLabel,
  List,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Case, DataType, Put } from "../../../interfaces/problemSet";
import TestCases from "../TestCases";
import CreateData from "./CreateData";

/**
 * Injected styles
 *
 */
const StyledChip = styled(Chip)`
  margin: 10px 0;
`;

interface ICreateTestCaseProps {
  functionName: string;
  existingTestCase: Case | null;
  setExistingTestCase: (param: any) => void;
  updateExistingTestCase: (testCase: Case) => void;
  setTestCase: (isPublic: boolean, inputs: Put[], output: Put) => void;
}

const defaultInputValue = {
  value: "",
  dataType: "INT" as DataType,
};

const CreateTestCase = ({
  functionName,
  existingTestCase,
  setExistingTestCase,
  updateExistingTestCase,
  setTestCase,
}: ICreateTestCaseProps) => {
  const [open, setOpen] = useState(false);

  const [isPublic, setIsPublic] = useState(false);
  const [inputs, setInputs] = useState<Put[]>([
    { value: "", dataType: "INT" as DataType },
  ]);
  const [output, setOutput] = useState<Put>({
    value: "",
    dataType: "INT" as DataType,
  });

  const handleValidation = () => {
    let passed = true;

    return passed;
  };

  const resetData = () => {
    setOpen(false);
    setInputs([defaultInputValue]);
    setOutput(defaultInputValue);
    setIsPublic(false);
    setExistingTestCase(null);
  };

  useEffect(() => {
    if (existingTestCase && open === false) {
      setInputs(existingTestCase.inputs);
      setOutput(existingTestCase.output);
      setIsPublic(existingTestCase.isPublic || false);
      setOpen(true);
    }
    // if (open === false && inputs.length > 0) {
    //   resetData();
    // }
  }, [existingTestCase, inputs.length, open, setExistingTestCase]);

  const submit = () => {
    if (handleValidation()) {
      if (existingTestCase) {
        updateExistingTestCase({
          id: existingTestCase.id,
          isPublic,
          inputs,
          output,
        });
      } else {
        setTestCase(isPublic, inputs, output);
      }
      setOpen(false);
      resetData();
    }
  };

  const addItem = () => {
    const input: Put = {
      value: "",
      dataType: "INT" as DataType,
    };
    const newInputs = [...inputs, input];
    setInputs(newInputs);
  };
  const removeItem = (index: number) => {
    let newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };
  const setItemData = (
    isInput: boolean,
    index: number,
    field: string,
    data: string
  ) => {
    if (isInput) {
      let newInputs = inputs;
      newInputs[index][field] = data;
      setInputs([...newInputs]);
    } else {
      let newOutput = { ...output };
      newOutput[field] = data;
      setOutput(newOutput);
    }
  };

  return (
    <>
      <CardHeader
        title="Test Cases"
        action={
          <Fab
            color="primary"
            aria-label="Create a test case"
            onClick={() => setOpen(true)}
          >
            <AddCircleOutline />
          </Fab>
        }
      />

      <Dialog
        fullWidth
        open={open}
        onClose={() => resetData()}
        aria-labelledby="create-test-case-popup"
        aria-describedby="popup for creating a testcase"
      >
        <DialogTitle>Create a test case</DialogTitle>
        <DialogContent>
          <>
            <FormLabel component="legend">Visibility</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  value={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              }
              label={isPublic ? "Public Test Case" : "Private Test Case"}
            />

            <FormLabel component="legend">Inputs</FormLabel>
            {inputs.map((input, index) => {
              return (
                <CreateData
                  key={`${index}-${input.value}`}
                  index={index}
                  isInput
                  data={input}
                  setData={setItemData}
                  addItem={addItem}
                  removeItem={removeItem}
                />
              );
            })}

            <FormLabel component="legend">Outputs</FormLabel>
            <CreateData data={output} setData={setItemData} />

            <FormLabel component="legend">Preview</FormLabel>
            <List>
              <StyledChip
                label={isPublic ? "Public" : "Private"}
                color={isPublic ? "success" : "error"}
              />
              <TestCases
                functionName={functionName}
                testCase={{ inputs, output }}
              />
            </List>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={submit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateTestCase;
