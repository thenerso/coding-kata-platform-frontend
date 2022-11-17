import CodeEditorContainer from "./CodeEditorContainer";
import CompileService from "../services/compileService";

export interface ICompileParams {
  code: string;
  lang: string;
}

const PlaygroundContainer = () => {
  const compile: any = async ({ code, lang }: ICompileParams) => {
    const compileResult = await CompileService.compile(lang, code);
  };

  return (
    <>
      <CodeEditorContainer onSubmit={compile} submitButtonTitle="compile" />
    </>
  );
};

export default PlaygroundContainer;
