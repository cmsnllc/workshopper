import type { ReactNode } from "react";

/**
 * レッスン本文で、答えを最初は隠しておく枠。MDX から <Answer>…</Answer> で使う。
 * まず自分で考えさせたい問いのあとに置く。<details> なので JavaScript が無くても開く。
 */
export function Answer({ children }: { children?: ReactNode }) {
  return (
    <details className="group my-6">
      <summary className="pressable inline-flex min-h-11 cursor-pointer list-none items-center rounded-wobbly border-2 border-ink bg-accent px-5 text-body font-bold shadow-offset-sm [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">こたえを見る</span>
        <span className="hidden group-open:inline">こたえをとじる</span>
      </summary>
      <div className="mt-4 rounded-wobbly-lg border-2 border-dashed border-ink bg-card px-5 py-2">
        {children}
      </div>
    </details>
  );
}
