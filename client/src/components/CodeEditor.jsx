import React, { useRef } from 'react'

const CodeEditor = () => {
  const editor = useRef()
  return <div ref={editor}></div>
}

export default CodeEditor;