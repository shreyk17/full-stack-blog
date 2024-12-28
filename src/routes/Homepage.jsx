import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex gap-4">
        <Link to="/"> Home </Link>
        <span>.</span>
        <span className="text-blue-800">Blogs and Articles</span>
      </div>
      {/* Introduction */}
      <div className="flex items-center justify-between">
        {/* titles */}
        <div className="">
          <h1 className="text-gray-800 text-2xl md:text-5xl lg:text-6xl font-bold">
            LamaLog - Share Your Stories, One Post at a Time
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Welcome to LamaLog, where your ideas shine. Create, share, and
            explore blogs with a community of passionate writers. Start sharing
            today!
          </p>
        </div>
        {/* animated buttons */}
        <Link to="write"></Link>
      </div>
    </div>
  );
};

export default Homepage;
