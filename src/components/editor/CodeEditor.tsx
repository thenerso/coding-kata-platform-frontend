import React from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

// Other available themes can easily be imported and added in
// "tomorrow","kuroir","twilight","xcode","textmate","solarized_dark",
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-solarized_dark";

import "ace-builds/src-noconflict/ext-language_tools";

interface ICodeEditor {
  fontSize?: number;
  theme?: string;
  language: string;
  readOnly?: boolean;
  value: string;
  height?: string;
  defaultValue?: string;
  showGutter?: boolean;
  onEditorValueChange?: (value: string, event: any) => void;
}

// Render editor
const CodeEditor: React.FC<ICodeEditor> = ({
  fontSize = 16,
  theme = "monokai",
  language,
  readOnly = false,
  value,
  height = "500px",
  defaultValue = "",
  onEditorValueChange,
  showGutter = true,
}) => {
  return (
    <>
      <AceEditor
        readOnly={readOnly}
        mode={language}
        theme={theme}
        name="code-editor"
        onChange={onEditorValueChange}
        defaultValue={defaultValue}
        fontSize={fontSize}
        showPrintMargin={true}
        showGutter={showGutter}
        highlightActiveLine={true}
        value={value}
        width="100%"
        height={height}
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
