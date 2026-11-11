import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();

  return (
    <main className="bg-dots flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-title">
        <span className="marker">
          {is404 ? "ページが見つかりません" : "うまく表示できませんでした"}
        </span>
      </h1>
      <a
        href="/"
        className="pressable flex min-h-14 items-center rounded-pill border-2 border-ink bg-accent px-8 text-subheading font-black shadow-offset"
      >
        レッスンにもどる
      </a>
    </main>
  );
}
