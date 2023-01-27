import styled from "@emotion/styled";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { DataType, Put } from "../../../interfaces/problemSet";

const TestCaseInput = styled(FormControl)`
  flex: 3;
  margin: 0 5px;
`;

const TestCaseInputWrapper = styled("div")`
  margin: 10px 0;
  display: flex;
  align-items: center;

  & div:first-of-type {
    flex: 1;
  }
  & div:last-of-type {
    flex: initial;
  }
`;

const StyledFormHelperText = styled(FormHelperText)`
  margin-bottom: 10px;
`;

interface ICreateDataProps {
  data: Put;
  setData: (
    isInput: boolean,
    index: number,
    field: string,
    data: string
  ) => void;
  isInput?: boolean;
  index?: number;
  addItem?: () => void;
  removeItem?: (index: number) => void;
}

interface IInputType {
  [key: string]: any;
}

const inputTypes: IInputType = {
  INT: { input: "number", placeholder: "Enter an integer e.g. 8" },
  INT_ARRAY: {
    input: "text",
    placeholder: "Enter an array of integers e.g. 5,2,4",
  },
  STRING: { input: "text", placeholder: "Enter a string" },
  STRING_ARRAY: {
    input: "text",
    placeholder: "Enter an array of strings e.g. hello, world",
  },
  FLOAT: { input: "number", placeholder: "Enter a float e.g. 4.80" },
  FLOAT_ARRAY: {
    input: "text",
    placeholder: "Enter an array of floats e.g. 4.80,5.60",
  },
  BOOLEAN: { input: "text", placeholder: "Enter a boolean e.g. TRUE/FALSE" },
  BOOLEAN_ARRAY: {
    input: "text",
    placeholder: "Enter an array of booleans e.g. TRUE,TRUE,FALSE",
  },
};

const CreateData = ({
  data,
  setData,
  isInput = false,
  index = 0,
  addItem,
  removeItem,
}: ICreateDataProps) => {
  const renderInputType = (type: string): string => {
    return inputTypes[data.dataType as string][type];
  };

  const renderAction = () => {
    if (index === 0)
      return (
        <Tooltip title="Add another input">
          <IconButton onClick={addItem}>
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
      );
    if (removeItem)
      return (
        <Tooltip title="Remove this input">
          <IconButton onClick={() => removeItem(index)}>
            <RemoveCircleOutline />
          </IconButton>
        </Tooltip>
      );
  };

  return (
    <>
      <TestCaseInputWrapper>
        <TestCaseInput>
          <InputLabel variant="standard" id="data-type-label">
            Data Type
          </InputLabel>

          <Select
            variant="standard"
            labelId="data-type-label"
            value={data.dataType}
            label="Data Type"
            onChange={(e) =>
              setData(isInput, index, "dataType", e.target.value as DataType)
            }
          >
            {Object.keys(DataType).map((item) => (
              <MenuItem key={item} value={item}>
                {item.replace("_", " ").toLowerCase()}
              </MenuItem>
            ))}
          </Select>
        </TestCaseInput>

        <TestCaseInput fullWidth>
          <InputLabel variant="standard" id="difficulty-label">
            Data Type
          </InputLabel>

          <Input
            autoFocus={isInput}
            fullWidth
            startAdornment={
              data.dataType?.includes("ARRAY") ? <code>[</code> : ""
            }
            endAdornment={
              data.dataType?.includes("ARRAY") ? <code>]</code> : ""
            }
            type={renderInputType("input")}
            // placeholder={renderInputType("placeholder")}
            value={data.value}
            onChange={(e) => setData(isInput, index, "value", e.target.value)}
          />
        </TestCaseInput>

        <TestCaseInput>{isInput && renderAction()}</TestCaseInput>
      </TestCaseInputWrapper>
      <StyledFormHelperText>
        {renderInputType("placeholder")}
      </StyledFormHelperText>
    </>
  );
};

export default CreateData;
