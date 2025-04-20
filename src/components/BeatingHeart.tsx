"use client";
import React, { useState, useRef, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const BeatingHeart: React.FC = () => {
  const [beatSpeed, setBeatSpeed] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Update to use the gold-orange-pink gradient
  const heartColor = "url(#gradient)";

  // Function to smoothly reset heart to initial state
  const resetHeart = () => {
    setIsResetting(true);

    // Start the smooth transition animation
    let startTime: number | null = null;
    const startBeatSpeed = beatSpeed;
    const startClicks = clicks;
    const duration = 2000; // 2 seconds for smooth transition

    const animateReset = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutCubic for a smooth deceleration
      const easing = 1 - Math.pow(1 - progress, 3);

      // Gradually decrease values
      const newBeatSpeed = startBeatSpeed - (startBeatSpeed - 1) * easing;
      const newClicks = startClicks - startClicks * easing;

      setBeatSpeed(newBeatSpeed);
      setClicks(newClicks);

      if (progress < 1) {
        // Continue animation
        animationRef.current = requestAnimationFrame(animateReset);
      } else {
        // Animation complete
        setBeatSpeed(1);
        setClicks(0);
        setIsResetting(false);
        animationRef.current = null;
      }
    };

    // Start animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animateReset);
  };

  // Start/reset the 20-second inactivity timer
  const startInactivityTimer = () => {
    // Don't restart timer if currently in reset animation
    if (isResetting) return;

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      resetHeart();
    }, 20000); // 20 seconds
  };

  const handleClick = () => {
    if (!isHolding && clicks < 10 && !isResetting) {
      setBeatSpeed((prev) => prev + 0.3);
      setClicks((prev) => prev + 1);
      startInactivityTimer(); // Reset the timer on each click
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResetting) return;

    setIsHolding(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startInactivityTimer(); // Reset the timer on interaction

    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isHolding && !isResetting) {
      // Calculate rotation based on horizontal movement
      const deltaX = e.clientX - startPosRef.current.x;
      setRotation((prev) => prev + deltaX * 0.5);

      // Update starting position for next movement
      startPosRef.current = { x: e.clientX, y: e.clientY };

      // Reset the timer when interacting with the heart
      startInactivityTimer();
    }
  };

  const handleMouseUp = () => {
    setIsHolding(false);
  };

  // Initialize the inactivity timer when component mounts
  useEffect(() => {
    startInactivityTimer();

    // Clean up timer and animation on component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Add event listeners for when mouse goes outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsHolding(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  // Calculate the scale factor for the heartbeat line
  const scaleFactor = 1 + clicks * 0.1;
  const heartSize = 80 + clicks * 10;

  return (
    <div
      className="relative flex flex-col items-center justify-center cursor-pointer mx-10 my-5 px-5"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={heartRef}
    >
      {/* Continuous EKG Line */}
      <div
        className="absolute w-full overflow-hidden"
        style={{
          height: `${heartSize}px`,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 0,
          transition: isResetting
            ? "height 2s cubic-bezier(0.33, 1, 0.68, 1)"
            : "none",
        }}
      >
        <div
          className="ecg-line-container"
          style={{
            position: "absolute",
            width: "200%",
            height: "100%",
            left: 0,
            top: 0,
            animation: `ecgMove ${2.5 / beatSpeed}s linear infinite`,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="60%" stopColor="#FF6B00" />
                <stop offset="100%" stopColor="#FF3E96" />
              </linearGradient>
            </defs>
            {/* Repeat the ECG pattern to ensure continuous flow */}
            <path
              d="M0,50 L40,50 L60,50 L70,20 L80,80 L90,50 L100,50 L140,50 L160,50 L170,20 L180,80 L190,50 L200,50 L240,50 L260,50 L270,20 L280,80 L290,50 L300,50 L340,50 L360,50 L370,20 L380,80 L390,50 L400,50 L440,50 L460,50 L470,20 L480,80 L490,50 L500,50 L540,50 L560,50 L570,20 L580,80 L590,50 L600,50 L640,50 L660,50 L670,20 L680,80 L690,50 L700,50 L740,50 L760,50 L770,20 L780,80 L790,50 L800,50 L840,50 L860,50 L870,20 L880,80 L890,50 L900,50 L940,50 L960,50 L970,20 L980,80 L990,50 L1000,50"
              fill="none"
              stroke={heartColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Heart */}
      <div
        className="transition-all relative z-10"
        style={{
          animation: isHolding
            ? "none"
            : `heartBeat ${1.5 / beatSpeed}s infinite ease-in-out`,
          transform: `scale(${scaleFactor}) rotate(${rotation}deg)`,
          transformOrigin: "center center",
          transition: isResetting
            ? "transform 2s cubic-bezier(0.33, 1, 0.68, 1)"
            : "none",
        }}
      >
        <Heart
          size={heartSize}
          fill={heartColor}
          stroke="#FF7A00"
          strokeWidth={1}
          style={{
            transition: isResetting
              ? "width 2s cubic-bezier(0.33, 1, 0.68, 1), height 2s cubic-bezier(0.33, 1, 0.68, 1)"
              : "none",
          }}
        />
      </div>
      <style jsx global>{`
        @keyframes heartBeat {
          0% {
            transform: scale(${scaleFactor}) rotate(${rotation}deg);
          }
          25% {
            transform: scale(${scaleFactor * 1.2}) rotate(${rotation}deg);
          }
          50% {
            transform: scale(${scaleFactor}) rotate(${rotation}deg);
          }
          75% {
            transform: scale(${scaleFactor * 1.2}) rotate(${rotation}deg);
          }
          100% {
            transform: scale(${scaleFactor}) rotate(${rotation}deg);
          }
        }

        @keyframes ecgMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default BeatingHeart;
