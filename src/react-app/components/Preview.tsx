import { useEffect, useRef } from "react";
import { runP5Code, P5Controller } from "../lib/p5-runner";

interface PreviewProps {
  code: string;
  isRunning?: boolean;
}

export function Preview({ code, isRunning = true }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<P5Controller | null>(null);

  // コードが変わったときに新しいインスタンスを作成
  useEffect(() => {
    if (!containerRef.current || !code) return;

    // 既存のインスタンスを削除
    if (controllerRef.current) {
      controllerRef.current.remove();
    }

    // 新しいインスタンスを作成
    const controller = runP5Code(code, containerRef.current);
    controllerRef.current = controller;

    // 初期状態を反映
    if (!isRunning) {
      controller.stop();
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.remove();
        controllerRef.current = null;
      }
    };
  }, [code]);

  // 実行/停止状態が変わったときにloop/noLoopを切り替え
  useEffect(() => {
    if (!controllerRef.current) return;

    if (isRunning) {
      controllerRef.current.start();
    } else {
      controllerRef.current.stop();
    }
  }, [isRunning]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #ccc",
        borderRadius: "4px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    />
  );
}
