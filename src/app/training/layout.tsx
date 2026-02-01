"use client";

import { TrainingProvider } from "@/providers/training-provider";

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TrainingProvider>{children}</TrainingProvider>;
}
