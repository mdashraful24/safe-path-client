"use client";

import { List } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LegalTocProps {
  sections: Array<{ id: string; title: string }>;
}

export default function LegalToc({ sections }: LegalTocProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }))
      .filter(
        (item): item is { id: string; element: HTMLElement } =>
          item.element !== null,
      );

    if (elements.length === 0) return;

    let frame = 0;

    const updateActive = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const distanceFromBottom = Math.max(
        0,
        document.documentElement.scrollHeight -
          (window.scrollY + viewportHeight),
      );
      const bottomProgress = Math.min(
        1,
        1 - distanceFromBottom / Math.max(1, viewportHeight),
      );
      const offset = 160 + Math.max(0, bottomProgress) * viewportHeight * 0.8;
      let nextActive = elements[0].id;

      for (const { id, element } of elements) {
        if (element.getBoundingClientRect().top <= offset) {
          nextActive = id;
        }
      }

      if (distanceFromBottom <= 4) {
        nextActive = elements[elements.length - 1].id;
      }

      setActiveId(nextActive);
    };

    const scheduleUpdate = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateActive);
      }
    };

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        <List className="size-3.5" aria-hidden="true" />
        On this page
      </p>
      <ul className="mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
        {sections.map((section) => (
          <li key={section.id} className="shrink-0 lg:shrink">
            <a
              href={`#${section.id}`}
              className={cn(
                "block whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors lg:whitespace-normal",
                activeId === section.id
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
              )}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
