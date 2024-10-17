import React, {
  useRef,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Delta = Quill.import("delta");

const DescriptionEditor = ({ defaultContent, onChange }) => {
  const quillRef = useRef();
  const [editorContent, setEditorContent] = useState(defaultContent);

  const handleTextChange = () => {
    const currentQuill = quillRef.current;
    const currentText = currentQuill.getText();
    onChange(currentText);
    setEditorContent(currentText);
  };

  return (
    <div>
      <Editor
        ref={quillRef}
        defaultValue={new Delta().insert(editorContent)}
        onTextChange={handleTextChange}
      />
    </div>
  );
};

export default DescriptionEditor;

const Editor = forwardRef(({ defaultValue, onTextChange }, ref) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onTextChange);

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
  }, [onTextChange]);

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const quill = new Quill(editorContainer, {
      theme: "snow",
    });

    ref.current = quill;

    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      onTextChangeRef.current?.(...args);
    });

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <div ref={containerRef}></div>;
});

Editor.displayName = "Editor";
