import CodeEditorContainer from "./CodeEditorContainer";


const ProblemContainer = ()=> {
    const evaluate = (evt)=> {

    }

    return (
        <>
            <CodeEditorContainer onSubmit={evaluate} />
        </>
    );
}

export default ProblemContainer;