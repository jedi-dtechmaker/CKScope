import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSyncStatus } from '../hooks/useSyncStatus';

const STATUS_COLOR: Record<string, string> = {
  caught_up: 'text-emerald-400',
  syncing: 'text-amber-400',
  idle: 'text-gray-400',
  reorg: 'text-red-400',
};

export function Layout() {
  const sync = useSyncStatus();
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    localStorage.getItem('ckscope-theme') === 'light' ? 'light' : 'dark',
  );
  const status = sync.data?.status ?? '…';
  const color = STATUS_COLOR[status] ?? 'text-gray-400';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ckscope-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell min-h-screen overflow-x-hidden bg-[#070a10] text-[#b7c0cf] [background-image:radial-gradient(ellipse_at_top_left,rgba(102,45,15,.22),transparent_34rem),linear-gradient(135deg,rgba(46,30,22,.28)_1px,transparent_1px)] [background-size:auto,48px_48px]">
      <header className="sticky top-0 z-20 border-b border-[#182131] bg-[#080b12]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-7 gap-y-2 px-4 py-2.5 sm:px-6">
          <Link to="/" className="group flex items-center gap-2 text-[#fb923c]">
            <span className="grid h-7 w-7 place-items-center rounded border border-[#fb923c]/50 bg-[#30180d] text-sm font-bold shadow-[0_0_16px_rgba(251,146,60,.25)]">C</span>
            <span className="font-['Space_Grotesk'] text-sm font-bold tracking-tight">CKB<span className="text-[#fbbf24]">Scope</span></span>
          </Link>
          <nav className="order-3 flex w-full items-center gap-4 text-[10px] uppercase tracking-[.14em] text-[#8893a8] sm:order-none sm:w-auto">
            <Link to="/" className="text-[#fb923c] hover:text-[#fdba74]">Blocks</Link>
            <Link to="/activities" className="hover:text-[#fdba74]">Activities</Link>
            <Link to="/inventory" className="hover:text-[#fdba74]">Inventory</Link>
            <span className="hidden sm:inline">Scripts</span><span className="hidden sm:inline">Charts</span>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden w-72 border-b border-[#273246] px-1 pb-1 text-[11px] text-[#59657a] md:block">› Search block / tx / address / cell ...</div>
          <button
            type="button"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <span
            title={`Sync status: ${status}`}
            className={`inline-flex items-center gap-1.5 border border-[#233043] bg-[#0d121c] px-2 py-1 font-mono text-[10px] uppercase ${color}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </span>
          </div>
        </div>
        <div className="border-t border-[#121a27] bg-[#090d14] py-1">
          <div className="mx-auto flex max-w-[1440px] gap-5 overflow-hidden px-4 text-[9px] uppercase tracking-[.1em] text-[#5e6b80] sm:px-6"><span>Block <b className="font-medium text-[#fb923c]">synced</b></span><span>Network <b className="font-medium text-[#d9a939]">mainnet</b></span><span>Indexer <b className="font-medium text-[#fb923c]">online</b></span></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6">
        <Outlet />
      </main>
      <footer className="mt-8 border-t border-[#182131] px-4 py-4 text-[9px] text-[#566176] sm:px-6"><div className="mx-auto flex max-w-[1440px] justify-between"><span>CKB SCOPE · NERVOS NETWORK EXPLORER</span><span className="text-[#fb923c]">● CONNECTED</span></div></footer>
    </div>
  );
}
