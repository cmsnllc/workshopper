import type { Lesson } from "../lessons/types";

interface LessonListProps {
  lessons: Lesson[];
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

export function LessonList({
  lessons,
  selectedLessonId,
  onSelectLesson,
}: LessonListProps) {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "basic":
        return "基礎編";
      case "advanced":
        return "応用編";
      case "challenge":
        return "発展編";
      default:
        return "";
    }
  };

  const groupedLessons = lessons.reduce(
    (acc, lesson) => {
      const category = lesson.meta.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(lesson);
      return acc;
    },
    {} as Record<string, Lesson[]>
  );

  return (
    <div
      style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ padding: "20px 16px" }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: "1.2em" }}>
          レッスン一覧
        </h2>

        {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
          <div key={category} style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "0.9em",
                color: "#666",
                margin: "0 0 8px 0",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {getCategoryLabel(category)}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {categoryLessons.map((lesson) => (
                <button
                  key={lesson.meta.id}
                  onClick={() => onSelectLesson(lesson.meta.id)}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    border: "none",
                    backgroundColor:
                      selectedLessonId === lesson.meta.id ? "#007bff" : "white",
                    color: selectedLessonId === lesson.meta.id ? "white" : "#333",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontSize: "0.9em",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedLessonId !== lesson.meta.id) {
                      e.currentTarget.style.backgroundColor = "#f0f0f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLessonId !== lesson.meta.id) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                    {lesson.meta.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85em",
                      opacity: 0.8,
                    }}
                  >
                    {lesson.meta.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
