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
  children: React.ReactElement;
}) => {
  const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);

  function sendKeyResult(keyResult: KeyResult) {
    if (
      keyResult.progress &&
      keyResult.description &&
      Number(keyResult.progress)
    ) {
      if (Number(keyResult.progress) < 0 || Number(keyResult.progress) > 100) {
        throw new Error(`The value should be in the range (0-100)`);
      }
      setKeyResultList([...keyResultList, keyResult]);
    } else {
      throw new Error("Invalid Input");
    }
  }

  return (
    <KeyResultContext.Provider
      value={{ keyResultList, sendKeyResult, setKeyResultList }}
    >
      {children}
    </KeyResultContext.Provider>
  );
};
