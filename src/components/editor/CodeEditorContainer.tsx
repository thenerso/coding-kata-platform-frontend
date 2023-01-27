import { useState } from "react";
import CodeEditor from "./CodeEditor";
import EditorTools from "./EditorTools";
import { StartCode } from "../../interfaces/problemSet";
import { languageOptions } from "./EditorVariables";

interface ICodeEditorContainerProps {
  // onSubmit?: (code: string, lang: string) => Promise<void>;
  // submitButtonTitle: string;
  readOnly?: boolean;
  startCode: StartCode;
  setStartCode?: (startCode: StartCode) => void;
  setActiveLanguage?: (language: string) => void;
}

const CodeEditorContainer: React.FC<ICodeEditorContainerProps> = ({
  readOnly = false,
  startCode,
  setStartCode,
  setActiveLanguage,
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("monokai");
  const [language, setLanguage] = useState("javascript");

  const [value, setValue] = useState(startCode.js);

  const updateLanguage = (value: string) => {
    setLanguage(value);
    setValue(startCode[languageOptions[value]]);
    if (setActiveLanguage) {
      setActiveLanguage(value);
    }
  };

  // const checkForStartCode = () => {
  //   if (value === "") {
  //     setValue(languagePlaceholders[language]);
  //   }
  // };

  // checkForStartCode();

  const updateStartCode = (value: string, event: any) => {
    let newStartCode = { ...startCode };
    newStartCode[languageOptions[language]] = value;
    if (setStartCode) setStartCode(newStartCode);
  };

  const editorValue = setStartCode
    ? startCode[languageOptions[language]]
    : value;

  return (
    <>
      <EditorTools
        language={language}
        setLanguage={updateLanguage}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <CodeEditor
        fontSize={fontSize}
        theme={theme}
        language={language}
        // defaultValue={editorValue === "" ? languagePlaceholders[language] : }
        value={editorValue}
        onEditorValueChange={setStartCode ? updateStartCode : setValue}
        readOnly={readOnly}
      />
    </>
  );
};

export default CodeEditorContainer;
