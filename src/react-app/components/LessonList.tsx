import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import type { Lesson, LessonMeta } from "../lessons/types";
import { CATEGORY_LABELS } from "../lessons/labels";
import { pathFor } from "../lib/route";

interface LessonListProps {
  lessons: Lesson[];
  selectedLessonId: string | null;
}

interface LessonGroup {
  groupId: string;
  groupTitle: string;
  lessons: Lesson[];
}

type Category = LessonMeta["category"];

// キーはレッスン ID の先頭 2 桁。章を足したり並べ替えたりしたら、ここも合わせる
const CHAPTER_TITLES: Record<string, string> = {
  "01": "簡単なプログラミングをしてみよう",
  "02": "変数を使ってみよう",
  "03": "計算してみよう",
  "04": "比較してみよう",
  "05": "「もし○○のとき」と「○○である間は」",
  "06": "図形を動かそう",
  "07": "ランダムに動かそう",
  "08": "クリックした場所に描こう",
  "09": "関数を作ろう",
  "10": "再帰関数",
  "11": "自由課題",
};

const ROW_CLASS =
  "flex min-h-11 w-full items-center gap-2.5 rounded-wobbly border-2 px-2 py-1 text-left text-small";
const ROW_IDLE_CLASS = "border-transparent hover:bg-card";
const ROW_SELECTED_CLASS = "border-ink bg-accent font-bold shadow-offset-sm";

// レッスンIDから親グループIDを抽出（例: "01-01-first-circle" → "01"）
const extractGroupId = (lessonId: string): string => lessonId.split("-")[0];

const getChapterTitle = (groupId: string): string =>
  CHAPTER_TITLES[groupId] ?? `レッスン ${parseInt(groupId, 10)}`;

// 配列の出現順を保ったまま key ごとにまとめる
const groupInOrder = <T,>(items: T[], keyOf: (item: T) => string): [string, T[]][] =>
  items.reduce<[string, T[]][]>((acc, item) => {
    const key = keyOf(item);
    const entry = acc.find(([k]) => k === key);
    if (entry) {
      entry[1].push(item);
      return acc;
    }
    return [...acc, [key, [item]]];
  }, []);

const toLessonGroups = (categoryLessons: Lesson[]): LessonGroup[] =>
  groupInOrder(categoryLessons, (lesson) => extractGroupId(lesson.meta.id))
    .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
    .map(([groupId, groupLessons]) => ({
      groupId,
      groupTitle: getChapterTitle(groupId),
      lessons: groupLessons,
    }));

function ChapterBadge({ groupId }: { groupId: string }) {
  return (
    <span className="flex size-[30px] flex-none items-center justify-center rounded-blob border-2 border-ink bg-card text-label tracking-normal">
      {groupId}
    </span>
  );
}

export function LessonList({ lessons, selectedLessonId }: LessonListProps) {
  // デフォルトで全て閉じる。選択中のレッスンのグループだけ開く
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(selectedLessonId ? [extractGroupId(selectedLessonId)] : []),
  );

  // 選択中のレッスンが変わったら、そのグループを自動的に開く
  const [prevSelectedLessonId, setPrevSelectedLessonId] = useState(selectedLessonId);
  if (selectedLessonId !== prevSelectedLessonId) {
    setPrevSelectedLessonId(selectedLessonId);
    if (selectedLessonId) {
      const groupId = extractGroupId(selectedLessonId);
      setExpandedGroups((prev) => new Set(prev).add(groupId));
    }
  }

  // カテゴリごと、さらにレッスングループごとに分類
  const categories: [Category, LessonGroup[]][] = groupInOrder(
    lessons,
    (lesson) => lesson.meta.category,
  ).map(([, categoryLessons]) => [
    categoryLessons[0].meta.category,
    toLessonGroups(categoryLessons),
  ]);

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

  const rowClass = (lessonId: string): string =>
    `${ROW_CLASS} ${selectedLessonId === lessonId ? ROW_SELECTED_CLASS : ROW_IDLE_CLASS}`;

  return (
    <nav
      aria-label="レッスン一覧"
      className="w-[250px] flex-none overflow-y-auto border-r-2 border-ink bg-paper-deep px-3.5 pt-5 pb-7"
    >
      <h2 className="px-1.5 pb-2 text-subheading font-black">レッスン一覧</h2>

      {categories.map(([category, lessonGroups]) => (
        <section key={category} className="mb-5">
          <h3 className="px-1.5 pt-1.5 pb-1 text-label text-ink-soft">
            {CATEGORY_LABELS[category]}
          </h3>
          <div className="flex flex-col gap-1.5">
            {lessonGroups.map((group) =>
              group.lessons.length === 1 ? (
                // グループ内にレッスンが1つだけの場合は直接表示
                <a
                  key={group.groupId}
                  href={pathFor({ lessonId: group.lessons[0].meta.id, exerciseId: null })}
                  aria-current={selectedLessonId === group.lessons[0].meta.id ? "page" : undefined}
                  className={rowClass(group.lessons[0].meta.id)}
                >
                  <ChapterBadge groupId={group.groupId} />
                  <span>{group.lessons[0].meta.title}</span>
                </a>
              ) : (
                <div key={group.groupId} className="flex flex-col gap-1.5">
                  {/* グループヘッダー（アコーディオン） */}
                  <button
                    onClick={() => toggleGroup(group.groupId)}
                    aria-expanded={expandedGroups.has(group.groupId)}
                    className={`${ROW_CLASS} ${ROW_IDLE_CLASS}`}
                  >
                    <ChapterBadge groupId={group.groupId} />
                    <span className="flex-1">{group.groupTitle}</span>
                    {expandedGroups.has(group.groupId) ? (
                      <FaChevronDown aria-hidden="true" className="size-3 flex-none" />
                    ) : (
                      <FaChevronRight aria-hidden="true" className="size-3 flex-none" />
                    )}
                  </button>

                  {/* サブレッスン（開いているときのみ表示） */}
                  {expandedGroups.has(group.groupId) && (
                    <div className="ml-10 flex flex-col gap-1.5">
                      {group.lessons.map((lesson) => (
                        <a
                          key={lesson.meta.id}
                          href={pathFor({ lessonId: lesson.meta.id, exerciseId: null })}
                          aria-current={selectedLessonId === lesson.meta.id ? "page" : undefined}
                          className={`${rowClass(lesson.meta.id)} px-3`}
                        >
                          {lesson.meta.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </section>
      ))}
    </nav>
  );
}
