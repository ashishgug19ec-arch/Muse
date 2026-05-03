import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
      <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif", color: "var(--ink)" }}>
        Muse
      </h1>
      <p className="text-lg mb-8" style={{ color: "var(--sakura)" }}>
        A sanctuary for women writers
      </p>
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="px-6 py-3 rounded-full text-white font-medium"
          style={{ background: "var(--purple)" }}
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="px-6 py-3 rounded-full font-medium"
          style={{ border: "1px solid var(--purple)", color: "var(--purple)" }}
        >
          Join Muse
        </Link>
      </div>
    </main>
  );
}
