import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="explorer-panel py-20 text-center">
      <p className="font-['Space_Grotesk'] text-4xl font-bold text-[#d7dde8]">404</p>
      <p className="mt-2 text-[#7b8798]">Page not found</p>
      <Link
        to="/"
        className="teal-link mt-4 inline-block border border-[#287d72] bg-[#0d2527] px-4 py-2 text-sm"
      >
        ← Back to blocks
      </Link>
    </div>
  );
}
