import { createContext } from "react";
import type { KeyResult } from "../types/okr_form.types.ts";

export type KeyResultContextType = {
  keyResultList: KeyResult[];
  sendKeyResult: (keyResult: KeyResult) => void;
  setKeyResultList: (keyResultList: KeyResult[]) => void;
};

export const KeyResultContext = createContext<KeyResultContextType>({
  keyResultList: [],
  sendKeyResult: () => {},
  setKeyResultList: () => {},
});
