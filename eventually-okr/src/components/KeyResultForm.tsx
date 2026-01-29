import React, { useState } from "react";
import type { KeyResult } from "../types/okr_form.types.ts";

type KeyResultForm = {
  KeyResultsList: KeyResult[];
  setKeyResultsList: (keyResultList: KeyResult[]) => void;
};

export const KeyResultForm = ({
  KeyResultsList,
  setKeyResultsList,
}: KeyResultForm) => {
  const [KeyResult, setKeyResult] = useState<KeyResult>({
    id: 0,
    description: "",
    progress: 0,
  });

  function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyResult({ ...KeyResult, [e.target.name]: e.target.value });
    console.log(KeyResult);
  }

  function addKeyResult() {
    if (KeyResult.progress && KeyResult.description) {
      if (KeyResultsList.length)
        setKeyResultsList([
          ...KeyResultsList,
          {
            ...KeyResult,
            id: KeyResultsList[KeyResultsList.length - 1].id + 1,
          },
        ]);
      else setKeyResultsList([{ ...KeyResult, id: 0 }]);
    }
  }
  return (
    <div>
      <label htmlFor={"description"}>Key Results</label>
      <input
        id={"description"}
        type="text"
        name={"description"}
        placeholder={"Key Results"}
        value={KeyResult.description}
        className={"border-2 border-gray-200 rounded-lg p-2"}
        onChange={inputHandler}
        required={true}
      />
      <label htmlFor={"progress"}>Progress</label>
      <input
        id={"progress"}
        type="text"
        name={"progress"}
        value={KeyResult.progress}
        onChange={inputHandler}
        placeholder={"Progress"}
        className={"border-2 border-gray-200 rounded-lg p-2"}
        required={true}
      />
      <button
        type={"button"}
        onClick={addKeyResult}
        className={"bg-blue-300 border-3 border-blue-900  p-2 px-4 rounded-xl"}
      >
        Add
      </button>
    </div>
  );
};
