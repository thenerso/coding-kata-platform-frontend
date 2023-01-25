import { useState } from "react";
import CodeEditor from "./CodeEditor";
import EditorTools from "./EditorTools";
import { StartCode } from "../../interfaces/problemSet";
import { languageOptions, languagePlaceholders } from "./EditorVariables";

interface ICodeEditorContainerProps {
  // onSubmit?: (code: string, lang: string) => Promise<void>;
  // submitButtonTitle: string;
  readOnly?: boolean;
  startCode: StartCode;
  setStartCode?: (startCode: StartCode) => void;
}

const CodeEditorContainer: React.FC<ICodeEditorContainerProps> = ({
  readOnly = false,
  startCode,
  setStartCode,
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("monokai");
  const [language, setLanguage] = useState("javascript");

  const [value, setValue] = useState(startCode.js);

  const updateLanguage = (value: string) => {
    setLanguage(value);
    setValue(startCode[languageOptions[value]]);
    // checkForStartCode();
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
    // console.log("update", newStartCode, languageOptions[language]);

    // console.log(startCode[languageOptions[language]]);
    if (setStartCode) setStartCode(newStartCode);
  };

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
        defaultValue={languagePlaceholders[language]}
        value={setStartCode ? startCode[languageOptions[language]] : value}
        onEditorValueChange={setStartCode ? updateStartCode : setValue}
        readOnly={readOnly}
      />
    </>
  );
};

export default CodeEditorContainer;
