import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import EditorTools from "../components/EditorTools";


const CodeEditorContainer = (onSubmit, submitButtonTitle)=> {
    const [langs] = useState(['java', 'javascript', 'python']);
    const [langIndex, setLangIndex] = useState(0);
    const [editorValues, setEditorValues] = useState({
        java: "public class Main {\n//write your solution here\n\n}",
        javascript: "// write your solution here",
        python: "# write your solution here "
    });

    const changeLang = (evt)=>{
        setLangIndex(evt.target.value);
    }

    const editorValueChange = (newValue)=> {
        setEditorValues((current)=> {

            current[langs[langIndex]] = newValue;
            return current;
        })
    }

    return (
        <>
        <CodeEditor onEditorValueChange={editorValueChange} 
        lang={langs[langIndex]} value ={editorValues[langs[langIndex]]}/>

        <EditorTools langs={langs} changeLang={changeLang} onSubmit={onSubmit}
        submitButtonTitle = {submitButtonTitle} />
        </>
    );
}

 export default CodeEditorContainer;