import styled from "@emotion/styled";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-solarized_light";

import "ace-builds/src-noconflict/ext-language_tools";

const StyledFormControl = styled(FormControl)`
  flex: 2;
  margin: 0 10px 0 0;
`;

const OptionsWrapper = styled("div")`
  display: flex;
  & div:first-of-type {
    flex: 1;
  }
  margin-bottom: 10px;
`;

interface ICodeEditor {
  lang: string;
  value: string;
  onEditorValueChange: (newValue: string) => void;
  readOnly?: boolean;
}

// Render editor
const CodeEditor: React.FC<ICodeEditor> = ({
  lang,
  value,
  onEditorValueChange,
  readOnly = false,
}) => {
  const [fontSize, setFontSize] = useState(16);
  const fontSizeOptions = [14, 16, 18, 20, 24, 28, 32, 40];
  const [theme, setTheme] = useState("monokai");
  const themeOptions = [
    "monokai",
    "github",
    // "tomorrow",
    // "kuroir",
    // "twilight",
    // "xcode",
    // "textmate",
    // "solarized_dark",
    "solarized_light",
    "terminal",
  ];
  return (
    <>
      <OptionsWrapper>
        <StyledFormControl fullWidth>
          <InputLabel id="font-size-label">Font Size</InputLabel>
          <Select
            labelId="font-size-label"
            value={fontSize}
            label="Font Size"
            onChange={(e) => setFontSize(parseInt(e.target.value as string))}
          >
            {fontSizeOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <StyledFormControl fullWidth>
          <InputLabel id="theme-label">Theme</InputLabel>
          <Select
            labelId="theme-label"
            value={theme}
            label="Theme"
            onChange={(e) => setTheme(e.target.value)}
          >
            {themeOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </OptionsWrapper>
      <AceEditor
        readOnly={readOnly}
        mode={lang}
        theme={theme}
        name="code-editor"
        onChange={onEditorValueChange}
        fontSize={fontSize}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={value}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </>
  );
};

export default CodeEditor;
