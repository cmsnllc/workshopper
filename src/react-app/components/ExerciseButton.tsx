interface ExerciseButtonProps {
  label: string;
  onClick: () => void;
}

export function ExerciseButton({ label, onClick }: ExerciseButtonProps) {
  return (
    <div style={{ margin: "24px 0", textAlign: "center" }}>
      <button
        onClick={onClick}
        style={{
          padding: "12px 32px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#218838";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#28a745";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
      >
        {label}
      </button>
    </div>
  );
}
