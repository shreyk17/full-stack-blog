import { IKContext, IKUpload } from "imagekitio-react";
import React, { useRef } from "react";
import { toast } from "react-toastify";

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

const Upload = ({ children, setProgress, setData, type, setImageUrl }) => {
  const ref = useRef(null);

  // IMAGEKIT ERROR HANDLING
  const onError = (err) => {
    toast.error(
      "Something went wrong file uploading image. Please try again later"
    );
    console.error(err);
  };

  const onSuccess = (res) => {
    console.log(res);
    setData(res);
    setImageUrl(res.filePath);
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  return (
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
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      <div onClick={() => ref.current.click()} className="cursor-pointer">
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
