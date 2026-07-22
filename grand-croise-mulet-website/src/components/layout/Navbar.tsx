import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-neutral-900">
          Grand Croise Mulet
        </Link>
        <div className="flex gap-4">
          <Link href="/regles" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Règles</Link>
          <Link href="/lots" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Sponsors</Link>
        </div>
      </div>
    </nav>
  );
}