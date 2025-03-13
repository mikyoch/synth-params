"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const initValue = {
  coldkey: "",
};

export default function AddColdkey() {
  const router = useRouter();
  const [form, setForm] = useState<{
    coldkey: string;
  }>(initValue);
  const [isPending, setIsPending] = useState<boolean>(false);

  const createColdkeyHandler = async () => {
    try {
      setIsPending(true);
      if (!form.coldkey?.length) return;
      const response = await fetch("/api/coldkeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update coldkeys");
      }

      const data = await response.json();
      console.log("Created a coldkey successful:", data);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Error occurred while creating a coldkey");
    } finally {
      setForm(initValue);
      setIsPending(false);
    }
  };

  return (
    <div className="border border-white *:text-center bg-white/10 flex justify-evenly mb-4">
      <div>Add New Coldkey</div>
      <div className="w-1/2">
        <input
          className="text-center text-black disabled:text-white w-full"
          placeholder="coldkey"
          value={form.coldkey}
          onChange={(e) => setForm({ ...form, coldkey: e.target.value })}
          disabled={isPending}
        />
      </div>
      <div>
        <button disabled={isPending} onClick={createColdkeyHandler}>
          {isPending ? "Creating" : "Create"}
        </button>
      </div>
    </div>
  );
}
