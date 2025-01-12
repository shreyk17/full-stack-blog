import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdAddPhotoAlternate } from "react-icons/md";
import { RiVideoAddFill } from "react-icons/ri";
import Upload from "../components/Upload";
import { IKImage } from "imagekitio-react";
import Image from "../components/Image";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();

  const { getToken } = useAuth();

  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [video, setVideo] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [progress, setProgress] = useState(0);

  //to show image in the react quill
  useEffect(() => {
    image && setValue((prev) => prev + `<p><image src="${image.url}" /></p>`);
  }, [image]);

  useEffect(() => {
    video &&
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src="${video.url}" /></p>`
      );
  }, [video]);

  useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/posts/create`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },

    onSuccess: (res) => {
      toast.success("Post has been created!");
      navigate(`/${res.data.data.slug}`);
    },
  });

  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="">You should login first...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    mutation.mutate(data);
  };

  return (
    <div className="md:h-[calc(100vh-80px)] h-[calc(100vh-64px)] flex flex-col gap-6 ">
      <h1 className="text-xl font-light">Create a new post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 flex-1 mb-6 "
      >
        {imageUrl ? (
          <Image src={imageUrl} w="50" h="50" />
        ) : (
          <Upload
            type="image"
            setProgress={setProgress}
            setData={setCover}
            setImageUrl={setImageUrl}
          >
            <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
              Add your cover images here!
            </button>
          </Upload>
        )}

        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          name="title"
          required
          placeholder="My awesome story"
        />
        <div className="flex items-center gap-4">
          <label className="text-sm font-normal" htmlFor="">
            Choose a category:
          </label>
          <select
            name="category"
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
          name="desc"
          required
          placeholder="A short description"
          className="p-4 border-none outline-none rounded-xl bg-white shadow-md"
        />
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 mr-2">
            {/* <div className="cursor-pointer">📷</div>
            <div className="cursor-pointer">📽️</div> */}
            <Upload type="image" setProgress={setProgress} setData={setImage}>
              <MdAddPhotoAlternate size={35} className="cursor-pointer" />
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              <RiVideoAddFill size={35} className="cursor-pointer" />
            </Upload>
          </div>
          <ReactQuill
            className="flex-1 rounded-xl bg-white shadow-md border-none"
            theme="snow"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-blue-700 text-white font-semibold rounded-xl mt-4 p-2 w-36 disabled:bg-blue-500 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Submitting" : "Send"}
        </button>
        {"Progress : " + progress}
        {mutation.isError && <span>{mutation.error.message}</span>}
      </form>
    </div>
  );
};

export default Write;
