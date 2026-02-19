import React, { useState } from "react";
import type { KeyResult } from "../types/okr_form.types.ts";
import { KeyResultContext } from "./KeyResultContext.tsx";
export const KeyResultProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);

  function sendKeyResult(keyResult: KeyResult) {
    const description = keyResult.description?.trim();
    const metric = keyResult.metric?.trim();
    const updatedValueRaw = String(keyResult.updatedValue ?? "").trim();
    const targetValueRaw = String(keyResult.targetValue ?? "").trim();
    const updatedValue = Number(updatedValueRaw);
    const targetValue = Number(targetValueRaw);

    if (!description) throw new Error("Please enter a key result description.");
    if (!metric) throw new Error("Please enter a metric.");
    if (updatedValueRaw === "" || Number.isNaN(updatedValue))
      throw new Error("Please enter a valid updated value.");
    if (targetValueRaw === "" || Number.isNaN(targetValue))
      throw new Error("Please enter a valid target value.");
    if (updatedValue < 0) throw new Error("Updated value cannot be negative.");
    if (targetValue <= 0)
      throw new Error("Target value should be greater than 0.");
    if (updatedValue > targetValue)
      throw new Error("Updated value cannot be greater than target value.");

    setKeyResultList((prev) => [...prev, keyResult]);
  }

  return (
    <KeyResultContext.Provider
      value={{ keyResultList, sendKeyResult, setKeyResultList }}
    >
      {children}
    </KeyResultContext.Provider>
  );
};
