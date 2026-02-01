import React, { createContext, useState } from "react";
import type { KeyResult } from "../types/okr_form.types.ts";

type KeyResultContextType = {
  keyResultList: KeyResult[];
  sendKeyResult: (keyResult: KeyResult) => void;
  setKeyResultList: (keyResultList: KeyResult[]) => void;
};

export const KeyResultContext = createContext<KeyResultContextType>({
  keyResultList: [],
  sendKeyResult: () => {},
  setKeyResultList: () => {},
});
export const KeyResultProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);

  function sendKeyResult(keyResult: KeyResult) {
    const description = keyResult.description?.trim();
    const progressRaw = String(keyResult.progress ?? "").trim();
    const progress = Number(progressRaw);

    if (!description) throw new Error("Please enter a key result description.");
    if (progressRaw === "" || Number.isNaN(progress))
      throw new Error("Please enter a valid progress value.");
    if (progress < 0 || progress > 100)
      throw new Error("Progress should be in the range 0-100.");

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
