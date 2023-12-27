"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraCanBeUsed, setCameraCanBeUsed] = useState<boolean>();
  const [videoFacingMode, setVideoFacingMode] = useState<
    "user" | "environment"
  >("environment");

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: videoFacingMode,
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    return imageSrc;
  };

  const addPhoto = async () => {
    const imageSrc = capture();
    try {
      setIsLoading(true);
      await fetch("/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photo: imageSrc }),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCameraFacingMode = () => {
    setVideoFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );
  };

  useEffect(() => {
    async function checkCamera() {
      if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
      ) {
        setCameraCanBeUsed(true);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setCameraCanBeUsed(false);
    }

    checkCamera();
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24 bg-cover bg-center"
      style={{ backgroundImage: `url('/photo-boot-background.jpeg')` }}
    >
      <div className="mb-32 grid text-center items-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          height={720}
          videoConstraints={videoConstraints}
          width={1280}
          screenshotQuality={1080}
          style={{ borderRadius: "2.4rem", boxShadow: "0 0 0 5px #fff" }}
        />
        {isLoading ? (
          <div className="w-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
          </div>
        ) : (
          <button
            disabled={isLoading}
            onClick={addPhoto}
            className="[&_>_svg]:h-14 [&>svg]:w-14 flex justify-center py-4"
          >
            <CameraCaptureIcon />
          </button>
        )}

        {cameraCanBeUsed === false && (
          <div className=" text-red-500"> Camera not available </div>
        )}
      </div>
      <button
        onClick={toggleCameraFacingMode}
        className=" p-3 bg-slate-400 rounded-md"
      >
        <CameraToggleIcon />
      </button>
    </main>
  );
}

const CameraToggleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    className="w-6 h-6"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 12-.1-3.7a4 4 0 0 0-3.7-3.7 48.7 48.7 0 0 0-7.4 0 4 4 0 0 0-3.7 3.7V9m14.9 3 3-3m-3 3-3-3m-12 3 .1 3.7a4 4 0 0 0 3.7 3.7 48.7 48.7 0 0 0 7.4 0 4 4 0 0 0 3.7-3.7V15M4.5 12l3 3m-3-3-3 3"
    />
  </svg>
);

const CameraCaptureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path
      fill="#fff"
      d="M56 0h80a24 24 0 1 1 0 48H56a8 8 0 0 0-8 8v80a24 24 0 1 1-48 0V56A56 56 0 0 1 56 0zm320 0h80a56 56 0 0 1 56 56v80a24 24 0 1 1-48 0V56a8 8 0 0 0-8-8h-80a24 24 0 1 1 0-48zM48 376v80a8 8 0 0 0 8 8h80a24 24 0 1 1 0 48H56a56 56 0 0 1-56-56v-80a24 24 0 1 1 48 0zm464 0v80a56 56 0 0 1-56 56h-80a24 24 0 1 1 0-48h80a8 8 0 0 0 8-8v-80a24 24 0 1 1 48 0zM180 128l6.2-16.4A24 24 0 0 1 208.7 96h94.7c10 0 19 6.2 22.5 15.6L332 128h36a48 48 0 0 1 48 48v160a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V176a48 48 0 0 1 48-48h36zm140 128a64 64 0 1 0-128 0 64 64 0 1 0 128 0z"
      opacity="1"
    />
  </svg>
);
