import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-500">Looks like this page doesn't exist.</p>

      <Link
        href="/"
        className="bg-purple-600 text-white px-6 py-3 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}