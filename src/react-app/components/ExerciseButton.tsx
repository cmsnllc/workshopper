interface ExerciseButtonProps {
  label: string;
  href: string;
}

export function ExerciseButton({ label, href }: ExerciseButtonProps) {
  return (
    <div className="my-8 flex justify-center">
      <a
        href={href}
        className="pressable flex min-h-14 items-center rounded-pill border-2 border-ink bg-accent px-8 py-2.5 text-subheading font-black no-underline shadow-offset"
      >
        {label}
      </a>
    </div>
  );
}
