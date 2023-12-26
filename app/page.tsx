"use client";

import { useState, useRef } from "react";
import Webcam, { WebcamProps } from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        <button onClick={addPhoto}>Capture photo</button>
      </div>
    </main>
  );
}
