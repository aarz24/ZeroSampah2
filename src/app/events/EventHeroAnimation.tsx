"use client";

import Lottie from "lottie-react";
import manFindingAnimation from "@/../Man finding hotel location.json";

export default function EventHeroAnimation() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Lottie
        animationData={manFindingAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%', maxWidth: '400px' }}
      />
    </div>
  );
}
