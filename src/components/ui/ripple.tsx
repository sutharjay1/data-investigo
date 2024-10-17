import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
  circleColor?: string;
}

const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  circleColor = "rgba(0, 255, 0, 0.9)",
}: RippleProps) {
  return (
    <div className={cn("absolute inset-0", className)}>
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 15;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;

        return (
          <div
            key={i}
            className={`opcacity-50 animate-ripple absolute rounded-full border shadow-xl [--i:${i}]`}
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: "1px",
                backgroundColor: circleColor,
                borderColor: `rgba(34, 197, 94, ${borderOpacity / 100})`, // green color with dynamic opacity
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";

export default Ripple;
