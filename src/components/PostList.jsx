import React from "react";
import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API call
const fetchPost = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts`);
  return res.data;
};

const PostList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => fetchPost(),
  });

  if (isPending) {
    return "Loading....";
  }

  if (error) {
    return "An error has occured " + error.message;
  }

  console.log(data);

  return (
    <div className="flex flex-col gap-12 mb-8">
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
    </div>
  );
};

export default PostList;
