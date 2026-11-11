interface ExerciseButtonProps {
  label: string;
  onClick: () => void;
}

export function ExerciseButton({ label, onClick }: ExerciseButtonProps) {
  return (
    <div className="my-8 flex justify-center">
      <button
        onClick={onClick}
        className="pressable min-h-14 rounded-pill border-2 border-ink bg-accent px-8 py-2.5 text-subheading font-black shadow-offset"
      >
        {label}
      </button>
    </div>
  );
}
