import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1
        data-test="404-title"
        className="text-9xl font-bold text-slate-400"
      >
        404
      </h1>
      <p
        data-test="404-message"
        className="text-xl tracking-wider text-slate-600"
      >
        Page not found
      </p>
      <Link
        data-test="404-link"
        className="text-sm text-[#5ba4e5]"
        href="/"
      >
        Go to the front page &rarr;
      </Link>
    </div>
  );
}
