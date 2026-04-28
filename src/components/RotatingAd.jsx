import { useEffect, useState } from "react";
import AdvertisementCard from "./AdvertisementCard";

export default function RotatingAd({ ads = [], interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!ads.length) return;

    const timer = setInterval(() => {
      setFade(false); // start fade out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ads.length);
        setFade(true); // fade in new ad
      }, 300); // match animation duration

    }, interval);

    return () => clearInterval(timer);
  }, [ads, interval]);

  if (!ads.length) return null;

  return (
    <div
      className={`transition-all duration-300 ${
        fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <AdvertisementCard {...ads[index]} />
    </div>
  );
}