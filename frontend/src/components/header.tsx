"use client";

import Image from "next/image";
import zkmLogo from "../../public/zkm-logo.svg";
import { useState } from "react";

export const NavBar = ({
  setLanguage,
}: {
  setLanguage: (language: string) => void;
}) => {
  const [isActive, setIsActive] = useState(true);

  const handleClick = (language: string) => {
    if (
      (!isActive && language === "golang") ||
      (isActive && language === "rust")
    ) {
      setIsActive((current) => !current);
      setLanguage(language);
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <a
          href="https://playground.zkm.io"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src={zkmLogo} alt="ZKM Logo" className="h-9" width={300} />
        </a>
        <div className="w-auto" id="navbar-default">
          <ul className="font-medium flex p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 flex-row space-x-8 mt-0 border-0 bg-white dark:bg-gray-800 dark:bg-gray-900 dark:border-gray-700">
            <li>
              <button
                className="py-2 text-white bg-blue-700 rounded bg-transparent text-blue-700 p-0"
                style={{
                  color: isActive ? "blue" : "grey",
                }}
                onClick={() => handleClick("golang")}
              >
                Golang
              </button>
            </li>
            <li>
              <button
                className="block py-2 rounded hover:bg-transparent border-0 hover:text-blue-700 p-0 "
                style={{
                  color: !isActive ? "blue" : "grey",
                }}
                onClick={() => handleClick("rust")}
              >
                Rust
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
