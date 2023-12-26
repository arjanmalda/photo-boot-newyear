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
    <div className=" h-[100vh] flex flex col justify-center">
      <Carousel
        autoplay
        autoplayInterval={500}
        animation="fade"
        wrapAround
        defaultControlsConfig={{
          nextButtonStyle: { display: "none" },
          prevButtonStyle: { display: "none" },
        }}
      >
        {[...new Set(photos)].map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt="carousel"
            style={{ width: "100vw", height: "auto" }}
          />
        ))}
      </Carousel>
    </div>
  );
}
