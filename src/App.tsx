import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={() => setCount((p) => p + 1)}
        className="text-center mx-auto mt-10 bg-amber-200 rounded-md"
      >
        add {count}
      </button>
    </div>
  );
}

export default App;
