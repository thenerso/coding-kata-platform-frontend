import CodeEditorContainer from "./CodeEditorContainer";

const ProblemContainer = () => {
  const evaluate: any = (evt: any) => {};

  return (
    <>
      <CodeEditorContainer onSubmit={evaluate} submitButtonTitle="Title" />
    </>
  );
};

export default ProblemContainer;
