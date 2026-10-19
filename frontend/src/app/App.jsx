import "./App.css";
import { Editor } from "@monaco-editor/react";
function App() {
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
        />
      </section>
    </main>
  );
}
export default App;
