import type { ReactNode } from "react";
import { Header } from "../src/react-app/components/Header";
import "../src/react-app/index.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      {children}
    </div>
  );
}
