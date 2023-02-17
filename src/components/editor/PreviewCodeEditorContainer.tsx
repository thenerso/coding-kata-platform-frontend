import { useState } from "react";
import CodeEditor from "./CodeEditor";
import EditorTools from "./EditorTools";

interface ICodeEditorContainerProps {
  code: string;
  inputLanguage: string;
}

const PreviewCodeEditorContainer: React.FC<ICodeEditorContainerProps> = ({
  code,
  inputLanguage,
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("monokai");

  const editorLanguage = () => {
    switch (inputLanguage) {
      case "js":
        return "javascript";
      case "py":
        return "python";
      default:
        return "java";
    }
  };

  const editorLanguageValue = editorLanguage();

  return (
    <>
      <EditorTools
        language={editorLanguageValue}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <CodeEditor
        fontSize={fontSize}
        theme={theme}
        language={editorLanguageValue}
        value={code}
        height="575px"
        readOnly
      />
    </>
  );
};

export default PreviewCodeEditorContainer;
