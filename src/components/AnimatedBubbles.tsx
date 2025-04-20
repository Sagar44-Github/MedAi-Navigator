"use client";

import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
  popping: boolean;
  animationDelay: number;
}

export default function AnimatedBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const bubbleColor = "#D05715"; // Orange color from the image

  // Set up initial dimensions
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Create initial bubbles
  useEffect(() => {
    if (dimensions.width === 0) return;

    const initialBubbles: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 50 + 20, // 20-70px
      opacity: Math.random() * 0.4 + 0.1, // 0.1-0.5
      speed: Math.random() * 1 + 0.5, // 0.5-1.5
      direction: Math.random() * 2 * Math.PI, // Random direction in radians
      popping: false,
      animationDelay: Math.random() * 10, // Random delay for the float animation
    }));

    setBubbles(initialBubbles);
  }, [dimensions.width, dimensions.height]);

  // Animate bubbles
  useEffect(() => {
    if (bubbles.length === 0) return;

    const interval = setInterval(() => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          // Generate popping effect randomly
          if (!bubble.popping && Math.random() < 0.01) {
            return { ...bubble, popping: true };
          }

          // Reset popped bubbles
          if (bubble.popping) {
            return {
              ...bubble,
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              size: Math.random() * 50 + 20,
              opacity: Math.random() * 0.4 + 0.1,
              speed: Math.random() * 1 + 0.5,
              direction: Math.random() * 2 * Math.PI,
              popping: false,
              animationDelay: Math.random() * 10,
            };
          }

          // Randomly change direction occasionally
          let newDirection = bubble.direction;
          if (Math.random() < 0.02) {
            newDirection =
              bubble.direction + ((Math.random() - 0.5) * Math.PI) / 2;
          }

          // Move bubble based on direction and speed
          let newX = bubble.x + Math.cos(newDirection) * bubble.speed;
          let newY = bubble.y + Math.sin(newDirection) * bubble.speed;

          // Bounce off walls
          if (newX < 0 || newX > dimensions.width) {
            newDirection = Math.PI - newDirection;
            newX = bubble.x;
          }
          if (newY < 0 || newY > dimensions.height) {
            newDirection = -newDirection;
            newY = bubble.y;
          }

          return {
            ...bubble,
            x: newX,
            y: newY,
            direction: newDirection,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [bubbles, dimensions]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`bubble ${
            bubble.popping ? "animate-pop" : "animate-float"
          }`}
          style={{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            animationDelay: `${bubble.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
}
