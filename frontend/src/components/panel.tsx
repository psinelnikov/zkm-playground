"use client";
import { GoCode } from "./code";

export const Panel = () => {
  return (
    <div className="flex w-full">
      <div className="flex-1 ">
        <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Playground Demo
        </h1>
        <GoCode />
      </div>
    </div>
  );
};
