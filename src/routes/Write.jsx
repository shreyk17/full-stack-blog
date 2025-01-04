import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdAddPhotoAlternate } from "react-icons/md";
import { RiVideoAddFill } from "react-icons/ri";
import { IKContext, IKUpload } from "imagekitio-react";

// IMAGEKIT AUTHENTICATOR
const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/posts/upload-auth`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();

  const { getToken } = useAuth();

  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [progress, setProgress] = useState(0);

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

  // IMAGEKIT ERROR HANDLING
  const onError = (err) => {
    toast.error(
      "Something went wrong file uploading image. Please try again later"
    );
    console.error(err);
  };

  const onSuccess = (res) => {
    console.log(res);
    setCover(res);
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
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
        {/* <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
          Add your cover images here!
        </button> */}
        <IKContext
          publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
          urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
          authenticator={authenticator}
        >
          <IKUpload
            useUniqueFileName
            onError={onError}
            onSuccess={onSuccess}
            onUploadProgress={onUploadProgress}
            //fileName="test-upload.png"
          />
        </IKContext>
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
        <div className="flex">
          <div className="flex flex-col gap-2 mr-2">
            {/* <div className="cursor-pointer">📷</div>
            <div className="cursor-pointer">📽️</div> */}
            <MdAddPhotoAlternate className="cursor-pointer" />
            <RiVideoAddFill className="cursor-pointer" />
          </div>
          <ReactQuill
            className="flex-1 rounded-xl bg-white shadow-md border-none"
            theme="snow"
            value={value}
            onChange={setValue}
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
