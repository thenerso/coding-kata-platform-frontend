import LangSelector from "./LangSelector";

interface IEditorTools {
  langs: string[];
  changeLang: (
    value: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  submitButtonTitle: string;
  onSubmit: any; //@TODO - inconsistancies between this prop and upper level
}

const EditorTools: React.FC<IEditorTools> = ({
  langs,
  changeLang,
  submitButtonTitle,
  onSubmit,
}) => {
  return (
    <>
      <LangSelector options={langs} onSelectionChange={changeLang} />
      <button onClick={onSubmit}>{submitButtonTitle}</button>
    </>
  );
};

export default EditorTools;
