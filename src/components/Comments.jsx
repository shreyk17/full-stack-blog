import React from "react";
import Comment from "./Comment";

const Comments = () => {
  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <div className="flex justify-between items-center w-full gap-8">
        <textarea
          placeholder="Write your comment..."
          className="w-full p-4 rounded-xl"
        />
        <button className="bg-blue-700 text-white px-4 py-3 font-medium rounded-xl">
          Send
        </button>
      </div>

      {/* Single comment component */}
      <Comment />
    </div>
  );
};

export default Comments;
