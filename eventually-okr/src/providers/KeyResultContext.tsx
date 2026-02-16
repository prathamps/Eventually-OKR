import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { KeyResult } from "../types/okr_form.types.ts";

export type KeyResultContextType = {
  keyResultList: KeyResult[];
  sendKeyResult: (keyResult: KeyResult) => void;
  setKeyResultList: Dispatch<SetStateAction<KeyResult[]>>;
};

export const KeyResultContext = createContext<KeyResultContextType>({
  keyResultList: [],
  sendKeyResult: () => {},
  setKeyResultList: () => {},
});
