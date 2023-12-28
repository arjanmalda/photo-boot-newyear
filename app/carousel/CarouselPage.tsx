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
    <main
      className="flex h-screen w-screen flex-col items-center justify-center p-8 bg-cover bg-center"
      style={{ backgroundImage: `url('/photo-boot-background.jpeg')` }}
    >
      <PasswordProtection>
        <div className=" rounded-lg border-8 border-[#cfa159] w-ful overflow-hidden w-full flex col justify-center h-full items-center [&>*]:flex [&>*]:justify-center [&>*]:items-center[&>*] [&>*]:w-full">
          <Carousel
            autoplay
            autoplayInterval={2000}
            animation="fade"
            wrapAround
            defaultControlsConfig={{
              nextButtonStyle: { display: "none" },
              prevButtonStyle: { display: "none" },
              pagingDotsStyle: { display: "none" },
            }}
          >
            {[...new Set(photos)].map((photo, index) => {
              return (
                <div
                  key={index}
                  className="w-full h-full flex justify-center items-center"
                >
                  <div
                    style={{
                      height: "auto",
                      width: "1000px",
                      backgroundPosition: "50% 50%",
                      backgroundRepeat: "no-repeat",
                      aspectRatio: "1/1",
                      backgroundSize: "contain",
                      backgroundImage:
                        "url('" + photo.replace(/(\r\n|\n|\r)/gm, "") + "')",
                    }}
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      </PasswordProtection>
    </main>
  );
}
