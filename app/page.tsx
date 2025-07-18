"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const username = data?.session?.user?.user_metadata?.user_name;

      if (
        data?.session &&
        process.env.NEXT_PUBLIC_ADMIN_GITHUB_HANDLE?.split(",").includes(
          username
        ) &&
        username === "zorixid"
      ) {
        router.push("/dashboard");
      }
    })();
  }, []);

  const loginHandler = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  return (
    <main className="flex justify-center items-center">
      <button
        className="px-5 py-2 rounded-md bg-white/10"
        onClick={loginHandler}
      >
        Login with Github
      </button>
    </main>
  );
}
