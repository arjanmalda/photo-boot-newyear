"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraCanBeUsed, setCameraCanBeUsed] = useState(false);
  const [videoFacingMode, setVideoFacingMode] = useState<
    "user" | "environment"
  >("environment"); // Set the initial facing mode to 'environment'

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: videoFacingMode, // Use the videoFacingMode state to determine the facing mode
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
    ); // Toggle between 'user' and 'environment' facing mode
  };

  useEffect(() => {
    async function checkCamera() {
      if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
      ) {
        setCameraCanBeUsed(true);
        return;
      }
      setCameraCanBeUsed(false);
    }

    checkCamera();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          height={720}
          videoConstraints={videoConstraints}
          width={1280}
          screenshotQuality={1080}
        />
        {isLoading ? (
          <div className="w-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
          </div>
        ) : (
          <button disabled={isLoading} onClick={addPhoto}>
            Capture photo
          </button>
        )}

        {!cameraCanBeUsed && <div> Camera not available </div>}
      </div>
      <button onClick={toggleCameraFacingMode}>Toggle Camera</button>{" "}
      {/* Add a button to toggle the camera facing mode */}
    </main>
  );
}
