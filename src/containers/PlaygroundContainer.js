import CodeEditorContainer from "./CodeEditorContainer";
import CompileService from "../services/compileService";
const PlaygroundContainer = ()=> {
    const compile = async ({code, lang})=> {
       const compileResult = await CompileService.compile(lang, code);
    }

    return (
        <>
            <CodeEditorContainer onSubmit={compile} submitButtonTitle="compile" />
        </>
    );
}

export default PlaygroundContainer;