import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="min-h-screen p-8" style={{ background: "var(--bg)" }}>
      <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
        Your Sanctuary
      </h1>
      <p style={{ color: "var(--sakura)" }}>Welcome back, writer.</p>
    </main>
  );
}
