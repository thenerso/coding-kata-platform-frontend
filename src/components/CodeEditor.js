import React from "react";
import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";

function onLoad(evt) {
    
}

// Render editor
const CodeEditor = ({lang, value, onEditorValueChange}) => {
console.log('language: ', lang, ' value: ', value);
return (
    <>
    <AceEditor
    mode={lang}
    theme="monokai"
    name="blah2"
    onLoad={onLoad}
    onChange={onEditorValueChange}
    fontSize={16}
    showPrintMargin={true}
    showGutter={true}
    highlightActiveLine={true}
    value={value}
    setOptions={{
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: false,
    showLineNumbers: true,
    tabSize: 2,    }}/>
    
    </>
);
};

export default CodeEditor;