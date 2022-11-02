import LangSelector from "./LangSelector";

const EditorTools = (langs, changeLang, submitButtonTitle, onSubmit)=>{
    return (
        <>
        <LangSelector options={langs} onSelectionChange={changeLang} />
        <button onClick={onSubmit}>{submitButtonTitle}</button>
        </>
    );
}

export default EditorTools;