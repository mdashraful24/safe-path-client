export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-white">
            SafePath
          </span>
          <span>· Community safety platform</span>
        </div>
        <p>&copy; 2026 SafePath. All rights reserved.</p>
      </div>
    </footer>
  );
}
