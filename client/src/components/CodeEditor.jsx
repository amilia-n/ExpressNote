import React, { useRef } from 'react'

export const CodeEditor = () => {
  const editor = useRef()
  return <div ref={editor}></div>
}