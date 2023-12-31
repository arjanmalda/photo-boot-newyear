"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";
import { set } from "firebase/database";
import { Modal } from "@/components/Modal";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraCanBeUsed, setCameraCanBeUsed] = useState<boolean>();
  const [videoFacingMode, setVideoFacingMode] = useState<
    "user" | "environment"
  >("environment");
  const [imageHasBeenCaptured, setImageHasBeenCaptured] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>();
  const [modal, setModal] = useState<string>();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: videoFacingMode,
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setThumbnail(imageSrc);
    return imageSrc;
  };

  const addPhoto = async () => {
    const imageSrc = capture();
    try {
      setImageHasBeenCaptured(true);
      setIsCelebrating(true);

      setTimeout(() => {
        setImageHasBeenCaptured(false);
      }, 300);

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
      setTimeout(() => {
        setIsCelebrating(false);
      }, 1500);
      setTimeout(() => {
        setThumbnail(null);
      }, 4000);
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const photo = await convertToBase64(file);
        setIsLoading(true);
        const formData = new FormData();
        formData.append("photo", file);
        await fetch("/api/photos", {
          method: "POST",
          body: JSON.stringify({ photo }),
        });
      } catch (error) {
        console.error("Error uploading photo: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-8 bg-cover bg-center"
      style={{ backgroundImage: `url('/photo-boot-background.jpeg')` }}
    >
      {isCelebrating && (
        <Confetti
          gravity={0.9}
          initialVelocityY={9}
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            height: "100%",
            transform: "translate(-50%)",
          }}
          colors={["#FFD700", "#C0C0C0", "#FFFFFF", "#8B4513", "#000000"]}
        />
      )}
      <button
        onClick={toggleCameraFacingMode}
        className=" p-1 rounded-md border border-white fixed bottom-1 right-1"
      >
        <CameraToggleIcon />
      </button>
      <div className="mb-32 grid text-center items-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <motion.div
          initial={{ scale: 1, opacity: 1, background: "transparent" }}
          animate={{
            opacity: imageHasBeenCaptured ? 0.3 : 1,
          }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          exit={{ scale: 1 }}
        >
          <Webcam
            mirrored={videoFacingMode === "user"}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            height={1000}
            videoConstraints={videoConstraints}
            width={1280}
            style={{ borderRadius: "2.4rem", boxShadow: "0 0 0 5px #fff" }}
          />
        </motion.div>
        <div className="relative w-[90%] flex justify-center">
          <AnimatePresence key={thumbnail}>
            {thumbnail && (
              <motion.button
                className="fixed bottom-1 right-1 z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => setModal(thumbnail)}
              >
                <img
                  src={thumbnail}
                  alt="thumbnail"
                  className="w-16 h-16 rounded-md bg-cover"
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <button
          disabled={isLoading}
          onClick={addPhoto}
          className="[&_svg]:h-14 [&_svg]:w-14 flex justify-center py-4 -mt-24 z-10 w-full"
        >
          <motion.div
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <CameraCaptureIcon />
          </motion.div>
        </button>

        {cameraCanBeUsed === false && (
          <div className=" text-red-500"> Camera not available </div>
        )}
      </div>
      <div className="relative w-[90%] flex justify-center fixed bottom-2">
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 17 }}
          className="absolute w-full h-full top-0 bg-black pointer-events-none rounded-md [&>svg]:w-4 [&>svg]:h-4 flex justify-center gap-4 border-white border pt-1"
        >
          <UploadIcon />
        </motion.div>
      </div>
      <AnimatePresence key={modal}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: modal ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 17 }}
        >
          {!!modal && (
            <Modal onClose={() => setModal(undefined)}>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Foto</h1>
                <img src={modal} alt="modal" className="w-full" />
              </div>
            </Modal>
          )}
        </motion.div>
      </AnimatePresence>
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
      strokeWidth={10}
      stroke="#000"
      fill="#fff"
      d="M56 0h80a24 24 0 1 1 0 48H56a8 8 0 0 0-8 8v80a24 24 0 1 1-48 0V56A56 56 0 0 1 56 0zm320 0h80a56 56 0 0 1 56 56v80a24 24 0 1 1-48 0V56a8 8 0 0 0-8-8h-80a24 24 0 1 1 0-48zM48 376v80a8 8 0 0 0 8 8h80a24 24 0 1 1 0 48H56a56 56 0 0 1-56-56v-80a24 24 0 1 1 48 0zm464 0v80a56 56 0 0 1-56 56h-80a24 24 0 1 1 0-48h80a8 8 0 0 0 8-8v-80a24 24 0 1 1 48 0zM180 128l6.2-16.4A24 24 0 0 1 208.7 96h94.7c10 0 19 6.2 22.5 15.6L332 128h36a48 48 0 0 1 48 48v160a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V176a48 48 0 0 1 48-48h36zm140 128a64 64 0 1 0-128 0 64 64 0 1 0 128 0z"
      opacity="1"
    />
  </svg>
);

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16"
    width="16"
    viewBox="0 0 512 512"
  >
    <path
      opacity="1"
      fill="#fff"
      d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"
    />
  </svg>
);

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
