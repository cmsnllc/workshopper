export function Header() {
  return (
    <header className="flex flex-none items-center gap-3 border-b-2 border-ink bg-card px-6 py-3">
      <svg
        aria-hidden="true"
        className="size-9 flex-none"
        viewBox="0 0 36 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="fill-coral"
          d="M18 7c6.5-.4 11.2 4.3 11 10.8-.2 6.3-4.9 10.9-11.2 10.7C11.6 28.3 7.1 23.9 7 17.6 6.9 11.6 11.7 7.400 18 7z"
        />
        <path d="M18 2v2M30 6l-1.5 1.5M34 18h-2M6 6l1.5 1.5M2 18h2" />
      </svg>
      <h1 className="text-logo">トライ・やる・DAY</h1>
    </header>
  );
}
