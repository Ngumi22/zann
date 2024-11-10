"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardHome() {
  const [count, setCount] = useState(400);

  function handleClick() {
    setCount(count + 1);
  }
  return (
    <section className="p-4">
      <Button onClick={handleClick}>{count}</Button>
    </section>
  );
}
