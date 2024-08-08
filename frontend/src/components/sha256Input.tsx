import { sha256 } from "js-sha256";
import { useState } from "react";

export default function Sha256Input() {
  const [input, setInput] = useState("hello");

  // We need to spread the previous state and change the one we're targeting, so other data cannot be lost.
  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <label
        htmlFor="input"
        className="block text-sm font-medium leading-6 text-white-900"
      >
        Sha256 Generator
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          id="input"
          name="input"
          type="text"
          placeholder="hello world"
          className="block w-full rounded-md border-0 py-1.5 pl-3 text-white-700 ring-1 ring-inset ring-gray-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-700"
          onChange={handleChange}
          defaultValue={input}
        />
      </div>
      <div>{sha256(input)}</div>
    </div>
  );
}
