export default function TextEditor() {
  const [editor] = useState(() => withReact(createEditor()));
  const initialValue = [
    {
      type: "paragraph",
      children: [{ text: "Hello World" }]
    }
  ];
  return (
    <div className="editor-container">
      <Slate editor={editor} initialValue={initialValue}>
        <Editable 
          className="editor-content"
          placeholder="Start typing..."  
        />
      </Slate>
    </div>
  );
}