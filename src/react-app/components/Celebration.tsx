import { useEffect, useState } from "react";

const VISIBLE_MS = 2600;
const PIECE_COUNT = 36;
// 黄金角。番号をかけるだけで、紙ふぶきが全方向へ均等に散る
const GOLDEN_ANGLE_DEG = 137.5;
const HALF_TURN_DEG = 180;
const MIN_DISTANCE_PX = 140;
const DISTANCE_SPREAD_PX = 190;
const DISTANCE_STEP_PX = 53;
const SPIN_STEP_DEG = 97;
const STAGGER_MS = 12;

const PIECE_COLORS = ["bg-accent", "bg-coral", "bg-leaf", "bg-ink"];

interface Piece {
  colorClass: string;
  style: React.CSSProperties;
}

const makePiece = (_: unknown, i: number): Piece => {
  const angle = (i * GOLDEN_ANGLE_DEG * Math.PI) / HALF_TURN_DEG;
  const distance = MIN_DISTANCE_PX + ((i * DISTANCE_STEP_PX) % DISTANCE_SPREAD_PX);
  return {
    colorClass: PIECE_COLORS[i % PIECE_COLORS.length],
    // 飛ぶ先は 1 枚ずつ違うので、CSS 変数で keyframes に渡す
    style: {
      "--dx": `${Math.round(Math.cos(angle) * distance)}px`,
      "--dy": `${Math.round(Math.sin(angle) * distance)}px`,
      "--spin": `${i * SPIN_STEP_DEG}deg`,
      animationDelay: `${i * STAGGER_MS}ms`,
    } as React.CSSProperties,
  };
};

const PIECES: Piece[] = Array.from({ length: PIECE_COUNT }, makePiece);

/** 正解したときの「正解！」と紙ふぶき。親が key を変えるたびにもう一度出る */
export function Celebration() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {PIECES.map((piece, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`confetti-piece absolute top-1/3 left-1/2 h-4 w-2.5 rounded-[2px] ${piece.colorClass}`}
          style={piece.style}
        />
      ))}
      <div className="absolute inset-x-0 top-6 flex justify-center">
        <p
          role="status"
          className="stamp-pop -rotate-6 rounded-pill border-2 border-ink bg-accent px-8 py-1 text-title shadow-offset"
        >
          正解！
        </p>
      </div>
    </div>
  );
}
