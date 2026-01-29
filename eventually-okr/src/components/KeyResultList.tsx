import type { KeyResult } from "../types/okr_form.types.ts";
type KeyResultList = {
  KeyResultsList: KeyResult[];
};
export const KeyResultList = ({ KeyResultsList }: KeyResultList) => {
  return (
    <ol>
      {KeyResultsList?.map((keyResult: KeyResult) => (
        <li key={keyResult.id}>
          {keyResult.description}:{keyResult.progress}
        </li>
      ))}
    </ol>
  );
};
