import { Flame } from "lucide-react";

const FlameIcon = () => {
  return (
    <div
      style={{
        position: "relative",
        animation: "flicker 1.5s infinite ease-in-out",
      }}
    >
      <Flame
        style={{
          width: "24px",
          height: "24px",
          fill: "url(#flame-gradient)",
        }}
      />
      <svg width="0" height="0">
        <defs>
          <linearGradient id="flame-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="red">
              <animate
                attributeName="stop-color"
                values="red;orange;yellow;red"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="orange">
              <animate
                attributeName="stop-color"
                values="orange;yellow;red;orange"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default FlameIcon;
