import { useState, useEffect } from "react";
import type { Lesson } from "../lessons/types";

interface LessonListProps {
  lessons: Lesson[];
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

interface LessonGroup {
  groupId: string;
  groupTitle: string;
  lessons: Lesson[];
}

export function LessonList({
  lessons,
  selectedLessonId,
  onSelectLesson,
}: LessonListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set() // デフォルトで全て閉じる
  );

  // 選択中のレッスンのグループを自動的に開く
  useEffect(() => {
    if (selectedLessonId) {
      const groupId = selectedLessonId.split("-")[0];
      setExpandedGroups((prev) => new Set(prev).add(groupId));
    }
  }, [selectedLessonId]);

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

  const getChapterTitle = (groupId: string): string => {
    const chapterTitles: Record<string, string> = {
      "01": "簡単なプログラミングをしてみよう",
      "02": "色と形で遊ぼう",
      "03": "変数を使ってみよう",
      "04": "計算してみよう",
      "05": "比較してみよう",
      "06": "「もし○○のとき」と「○○である間は」",
      "07": "条件を組み合わせよう",
      "08": "繰り返してみよう",
      "09": "ドット模様を描こう",
      "10": "図形を動かそう",
      "11": "ランダムに動かそう",
      "12": "クリックした場所に描こう",
      "13": "関数を作ろう",
      "14": "再帰関数",
      "15": "自由課題",
    };
    return chapterTitles[groupId] || `レッスン ${parseInt(groupId)}`;
  };

  // レッスンIDから親グループIDを抽出（例: "01-01-first-circle" → "01"）
  const extractGroupId = (lessonId: string): string => {
    const match = lessonId.match(/^(\d+)-/);
    return match ? match[1] : lessonId;
  };

  // カテゴリごとにグループ化
  const groupedByCategory = lessons.reduce((acc, lesson) => {
    const category = lesson.meta.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  // さらに各カテゴリ内でレッスングループごとに分類
  const groupedLessons: Record<string, LessonGroup[]> = {};

  Object.entries(groupedByCategory).forEach(([category, categoryLessons]) => {
    const lessonGroups: Record<string, Lesson[]> = {};

    categoryLessons.forEach((lesson) => {
      const groupId = extractGroupId(lesson.meta.id);
      if (!lessonGroups[groupId]) {
        lessonGroups[groupId] = [];
      }
      lessonGroups[groupId].push(lesson);
    });

    groupedLessons[category] = Object.entries(lessonGroups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([groupId, groupLessons]) => ({
        groupId,
        groupTitle: getChapterTitle(groupId),
        lessons: groupLessons,
      }));
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

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

        {Object.entries(groupedLessons).map(([category, lessonGroups]) => (
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
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {lessonGroups.map((group) => (
                <div key={group.groupId}>
                  {/* グループ内にレッスンが1つだけの場合は直接表示 */}
                  {group.lessons.length === 1 ? (
                    <button
                      onClick={() => onSelectLesson(group.lessons[0].meta.id)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        textAlign: "left",
                        border: "none",
                        backgroundColor:
                          selectedLessonId === group.lessons[0].meta.id
                            ? "#007bff"
                            : "white",
                        color:
                          selectedLessonId === group.lessons[0].meta.id
                            ? "white"
                            : "#333",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontSize: "0.85em",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedLessonId !== group.lessons[0].meta.id) {
                          e.currentTarget.style.backgroundColor = "#f0f0f0";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedLessonId !== group.lessons[0].meta.id) {
                          e.currentTarget.style.backgroundColor = "white";
                        }
                      }}
                    >
                      {group.lessons[0].meta.title}
                    </button>
                  ) : (
                    <>
                      {/* グループヘッダー（アコーディオン） */}
                      <button
                        onClick={() => toggleGroup(group.groupId)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "#e8e8e8",
                          color: "#333",
                          cursor: "pointer",
                          borderRadius: "4px",
                          fontSize: "0.9em",
                          fontWeight: 600,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#d8d8d8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#e8e8e8";
                        }}
                      >
                        <span>{group.groupTitle}</span>
                        <span style={{ fontSize: "0.8em" }}>
                          {expandedGroups.has(group.groupId) ? "▼" : "▶"}
                        </span>
                      </button>

                      {/* サブレッスン（開いているときのみ表示） */}
                      {expandedGroups.has(group.groupId) && (
                        <div
                          style={{
                            marginTop: "4px",
                            marginLeft: "8px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          {group.lessons.map((lesson) => (
                            <button
                              key={lesson.meta.id}
                              onClick={() => onSelectLesson(lesson.meta.id)}
                              style={{
                                padding: "8px 12px",
                                textAlign: "left",
                                border: "none",
                                backgroundColor:
                                  selectedLessonId === lesson.meta.id
                                    ? "#007bff"
                                    : "white",
                                color:
                                  selectedLessonId === lesson.meta.id
                                    ? "white"
                                    : "#333",
                                cursor: "pointer",
                                borderRadius: "4px",
                                fontSize: "0.85em",
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
                              {lesson.meta.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
