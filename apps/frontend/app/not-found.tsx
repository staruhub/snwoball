import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">404</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">页面未找到</p>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)]"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
