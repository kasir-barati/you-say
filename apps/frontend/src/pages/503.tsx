export default function ServiceUnavailablePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex h-3/5 w-2/5 flex-col items-center justify-center gap-4 rounded-3xl bg-white px-7 text-center shadow-md">
        <h1 className="text-5xl font-bold">Be right back soon.</h1>
        <p className="text-2xl text-slate-700">
          We&apos;re working on our site to give you the best
          experience, and will come back soon.
        </p>
      </div>
    </div>
  );
}
