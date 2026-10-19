import "./App.css";
import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
function App() {
  const bindingRef = useRef(null);

  const handleMount = (editor) => {
    const ydoc = new Y.Doc();
    const yText = ydoc.getText("monaco");

    const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc, {});

    bindingRef.current = new MonacoBinding(yText, editor.getModel(), new Set([editor]), provider.awareness);
  };
  return (
    <main className="flex h-screen gap-4 p-4 bg-black">
      <aside className="w-1/5 rounded-xl bg-zinc-800"></aside>
      <section className="w-4/5 rounded-xl bg-zinc-900 overflow-hidden">
        <Editor
          height="100%"
          className="rounded-md"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}
export default App;
