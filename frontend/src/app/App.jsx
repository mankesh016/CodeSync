import "./App.css";
import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
function App() {
  const bindingRef = useRef(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });
  const [nameInput, setNameInput] = useState("");
  const [users, setUsers] = useState([]);

  const handleJoin = (e) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (name) setUsername(name);
  };

  const handleMount = (editor) => {
    const ydoc = new Y.Doc();
    const yText = ydoc.getText("monaco");

    const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc, {});

    provider.awareness.setLocalStateField("user", { username });
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(states.filter((state) => state.user).map((state) => state.user));
    };
    provider.awareness.on("change", updateUsers);
    updateUsers();

    bindingRef.current = new MonacoBinding(yText, editor.getModel(), new Set([editor]), provider.awareness);
  };

  if (!username) {
    return (
      <main className="flex h-screen items-center justify-center bg-zinc-900">
        <form
          onSubmit={handleJoin}
          className="flex w-72 flex-col gap-4 rounded-xl bg-zinc-800 p-6 border border-zinc-700"
        >
          <h1 className="text-center text-xl text-white pb-2">Welcome to CodeSync</h1>
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name"
            className="rounded-md bg-zinc-900 px-4 py-3 text-white outline-none"
          />
          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="rounded-md bg-indigo-600 py-3 text-white disabled:opacity-60"
          >
            Join
          </button>
        </form>
      </main>
    );
  }
  return (
    <main className="flex h-screen gap-4 p-4 bg-black">
      <aside className="w-1/5 rounded-xl bg-zinc-800 p-4">
        <h1 className="pb-2 mb-2 text-zinc-200 text-2xl border-b border-zinc-600">Users</h1>
        {users.map((user, i) => (
          <p key={i} className="text-zinc-300">
            {user.username}
          </p>
        ))}
      </aside>
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
