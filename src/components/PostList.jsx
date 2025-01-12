import React from "react";
import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
// API call
const fetchPost = async (pageParam) => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    params: { page: pageParam, limit: 2 },
  });
  return res.data;
};

const PostList = () => {
  // const { isPending, error, data } = useQuery({
  //   queryKey: ["repoData"],
  //   queryFn: () => fetchPost(),
  // });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPost(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMoreData ? pages.length + 1 : undefined,
  });

  console.log(data);

  if (status === "pending") {
    return "Loading....";
  }

  if (status === "error") {
    return "Something went wrong!";
  }

  const allPosts = data?.pages[0]?.data?.flatMap((page) => page.posts) || [];

  console.log(data?.pages[0]?.data[0]._id);

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more posts ...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! you have seen it all, get some rest</b>
        </p>
      }
    >
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;
