"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { PasswordProtection } from "@/components/PasswordProtection";
import Image from "next/image";
import { set } from "firebase/database";
import { AnimatePresence, motion } from "framer-motion";

export default function CarouselPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(collection(db, "photos"), (snapshot) => {
      const newPhotos = snapshot.docs.map((doc) => doc.data().photo);
      setPhotos(newPhotos);
    });
    setIsLoading(false);

    return () => unsubscribe();
  }, []);

  const addPhotoToSelection = useCallback((photo: string) => {
    setSelectedPhotos((prevPhotos) => [...prevPhotos, photo]);
    setPhotos((prevPhotos) => prevPhotos.filter((p) => p !== photo));
  }, []);

  const removePhotoFromSelection = useCallback((photo: string) => {
    setPhotos((prevPhotos) => [...prevPhotos, photo]);
    setSelectedPhotos((prevPhotos) => prevPhotos.filter((p) => p !== photo));
  }, []);

  return (
    <main
      className="flex h-screen w-screen flex-col items-center justify-center p-8 bg-cover bg-center"
      style={{ backgroundImage: `url('/photo-boot-background.jpeg')` }}
    >
      <PasswordProtection>
        {isLoading ? (
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
        ) : (
          <Fragment>
            <h1 className="text-4xl font-bold mb-4">Alle foto&apos;s</h1>
            <ul className="grid grid-cols-6 gap-2 mb-4">
              {photos.map((photo, index) => (
                <AnimatePresence key={photo.slice(0, 10)}>
                  <motion.button
                    key={photo.slice(0, 10)}
                    onClick={() => addPhotoToSelection(photo)}
                    className="h-72 overflow-hidden rounded-xl"
                  >
                    <Image
                      className="-translate-y-1/3"
                      src={photo}
                      alt={`Photo ${index}`}
                      width={1000}
                      height={1000}
                    />
                  </motion.button>
                </AnimatePresence>
              ))}
            </ul>
            <h1 className="text-4xl font-bold mb-4">Selectie</h1>
            <ul className="grid grid-cols-6 gap-2">
              {selectedPhotos.map((photo, index) => (
                <AnimatePresence key={photo.slice(0, 10)}>
                  <motion.button
                    key={photo.slice(0, 10)}
                    onClick={() => removePhotoFromSelection(photo)}
                    className="h-72 overflow-hidden rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Image
                      className="-translate-y-1/3"
                      src={photo}
                      alt={`Photo ${index}`}
                      width={1000}
                      height={1000}
                    />
                  </motion.button>
                </AnimatePresence>
              ))}
            </ul>
          </Fragment>
        )}
      </PasswordProtection>
    </main>
  );
}
