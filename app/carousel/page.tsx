"use client";

import { useState, useEffect } from "react";
import Carousel from "nuka-carousel";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export default function CarouselPage() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "photos"), (snapshot) => {
      const newPhotos = snapshot.docs.map((doc) => doc.data().photo);
      setPhotos(newPhotos);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
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
  );
}
