import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import EditorTools from "../components/EditorTools";

interface ICodeEditorContainerProps {
  onSubmit: (code: string, lang: string) => Promise<void>;
  submitButtonTitle: string;
}

interface IEditorValues {
  [key: string]: string;
  java: string;
  javascript: string;
  python: string;
}

const CodeEditorContainer: React.FC<ICodeEditorContainerProps> = ({
  onSubmit,
  submitButtonTitle,
}) => {
  const [langs] = useState<string[]>(["java", "javascript", "python"]);
  const [langIndex, setLangIndex] = useState<number>(0);
  const [editorValues, setEditorValues] = useState<IEditorValues>({
    java: "public class Main {\n//write your solution here\n\n}",
    javascript: "// write your solution here",
    python: "# write your solution here",
  });

  const changeLang = (
    evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setLangIndex(parseInt(evt.target.value));
  };

  const editorValueChange = (newValue: string) => {
    setEditorValues((current) => {
      current[langs[langIndex]] = newValue;
      return current;
    });
  };

  return (
    <>
      <CodeEditor
        onEditorValueChange={editorValueChange}
        lang={langs[langIndex]}
        value={editorValues[langs[langIndex]]}
      />

      <EditorTools
        langs={langs}
        changeLang={changeLang}
        onSubmit={onSubmit}
        submitButtonTitle={submitButtonTitle}
      />
    </>
  );
};

export default CodeEditorContainer;
