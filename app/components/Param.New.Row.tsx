'use client'

import { useState } from "react"
import { Row } from "./Param.Row"

const initValue = {
  uid: 0,
  dir: '0',
  gap: '0',
};

export default function NewParamRow() {
  const [form, setForm] = useState<{ uid: number, dir: string, gap: string }>(initValue)
  const [isPending, setIsPending] = useState<boolean>(false)

  const createMinerHandler = async () => {
    try {
      setIsPending(true)
      const response = await fetch("/api/create-miner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update params");
      }

      const data = await response.json();
      console.log("Created a miner successful:", data);
    } catch (e) {
      console.error(e);
      alert("Error occurred while creating a miner");
    } finally {
      setForm(initValue)
      setIsPending(false)
    }
  }

  return <tr className="border border-white *:text-center bg-white/10">
    <td><input className="text-center text-black disabled:text-white" placeholder="UID" value={form.uid} onChange={(e) => setForm({ ...form, uid: Number(e.target.value) })} type='number' disabled={isPending} /></td>
    <td>
      <input className="text-center text-black disabled:text-white" placeholder="dir" value={form.dir} onChange={(e) => setForm({ ...form, dir: (e.target.value) })} type='number' disabled={isPending} />
    </td>
    <td>
      <input className="text-center text-black disabled:text-white" placeholder="gap" value={form.gap} onChange={(e) => setForm({ ...form, gap: (e.target.value) })} type='number' disabled={isPending} />
    </td>
    <td>N/A</td>
    <td><button disabled={isPending} onClick={createMinerHandler}>{isPending ? "Creating" : "Create"}</button></td>
  </tr>
}