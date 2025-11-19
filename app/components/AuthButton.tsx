"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        type="button"
        className="px-4 py-2 rounded-full border border-slate-500 text-sm text-slate-200"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (!session) {
    return (
      <button
        type="button"
        onClick={() => signIn("google")}
        className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-sm font-medium text-white shadow-sm transition"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="px-4 py-2 rounded-full border border-slate-500 text-sm text-slate-200 hover:bg-slate-800/60 transition"
    >
      Sign out {session.user?.name ? `(${session.user.name})` : ""}
    </button>
  );
}
