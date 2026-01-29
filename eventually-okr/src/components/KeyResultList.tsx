import type { KeyResult } from "../types/okr_form.types.ts";
import { useContext } from "react";
import { KeyResultContext } from "../providers/KeyResultProvider.tsx";
type KeyResultList = {
  KeyResultsList: KeyResult[];
};
export const KeyResultList = () => {
  const { keyResultList } = useContext(KeyResultContext);
  return (
    <ol className={"flex flex-col gap-2"}>
      {keyResultList?.map((keyResult: KeyResult) => (
        <li
          key={keyResult.id}
          className={
            "border-b-2  border-b-gray-400 p-3 m-0 flex justify-between items-center"
          }
        >
          <div>{keyResult.description}</div>
          <div>{keyResult.progress} %</div>
        </li>
      ))}
    </ol>
  );
};
