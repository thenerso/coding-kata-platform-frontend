import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { DataType, Difficulty, Put } from "../../interfaces/problemSet";

interface ICreateTestCaseProps {
  setTestCase: (name: string, data: Put) => void;
}

const CreateTestCase = ({ setTestCase }: ICreateTestCaseProps) => {
  const [dataType, setDataType] = useState<string>("");

  return (
    <>
      <FormControl>
        <InputLabel variant="standard" id="difficulty-label">
          Data Type
        </InputLabel>
        <Select
          variant="standard"
          labelId="data-type-label"
          value={dataType}
          label="Data Type"
          onChange={(e) => setDataType(e.target.value as Difficulty)}
        >
          {Object.keys(DataType).map((item) => (
            <MenuItem key={item} value={item}>
              {item.replace("_", " ").toLowerCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default CreateTestCase;
