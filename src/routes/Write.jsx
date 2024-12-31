import { useUser } from "@clerk/clerk-react";
// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="">You should login first...</div>;
  }
  return (
    <div className="md:h-[calc(100vh-80px)] h-[calc(100vh-64px)] flex flex-col gap-6 ">
      <h1 className="text-xl font-light">Create a new post</h1>
      <form className="flex flex-col gap-6 flex-1 mb-6 ">
        <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
          Add your cover images here!
        </button>
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="My awesome story"
        />
        <div className="flex items-center gap-4">
          <label className="text-sm font-normal" htmlFor="">
            Choose a category:
          </label>
          <select
            name="cat"
            id=""
            className="p-2 rounded-xl bg-white shadow-md"
          >
            <option value="general">General</option>
            <option value="webDesign">Web Design</option>
            <option value="databases">Databases</option>
            <option value="development">Development</option>
            <option value="searchEngines">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        <textarea
          name="description"
          placeholder="A short description"
          className="p-4 border-none outline-none rounded-xl bg-white shadow-md"
        />
        <ReactQuill
          className="flex-1 rounded-xl bg-white shadow-md border-none"
          theme="snow"
        />
        <button className="bg-blue-700 text-white font-semibold rounded-xl mt-4 p-2 w-36">
          Send
        </button>
      </form>
    </div>
  );
};

export default Write;
