"use client";

import { useState, useEffect } from "react";
import Carousel from "nuka-carousel";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { PasswordProtection } from "@/components/PasswordProtection";

export default function CarouselPage() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "photos"), (snapshot) => {
      const newPhotos = snapshot.docs.map((doc) => doc.data().photo);
      setPhotos(newPhotos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PasswordProtection>
      <div className="w-screen flex col justify-center ">
        <Carousel
          autoplay
          autoplayInterval={10_000}
          animation="fade"
          wrapAround
          defaultControlsConfig={{
            nextButtonStyle: { display: "none" },
            prevButtonStyle: { display: "none" },
            pagingDotsStyle: { display: "none" },
          }}
        >
          {[...new Set(photos)].map((photo, index) => (
            <img
              className="max-h-screen w-screen object-contain"
              key={index}
              src={photo}
              alt="carousel"
              style={{ height: "auto" }}
            />
          ))}
        </Carousel>
      </div>
    </PasswordProtection>
  );
}
