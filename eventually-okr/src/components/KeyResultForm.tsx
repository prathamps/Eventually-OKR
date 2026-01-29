import React, { useContext, useState } from "react";
import type { KeyResult } from "../types/okr_form.types.ts";
import { KeyResultContext } from "../providers/KeyResultProvider.tsx";

type KeyResultForm = {
  KeyResultsList: KeyResult[];
  setKeyResultsList: (keyResultList: KeyResult[]) => void;
};

export const KeyResultForm = () => {
  const [keyResult, setKeyResult] = useState<KeyResult>({
    id: 0,
    description: "",
    progress: "",
  });

  const { keyResultList, sendKeyResult } = useContext(KeyResultContext);

  function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyResult({ ...keyResult, [e.target.name]: e.target.value });
    console.log(keyResult);
  }

  function addKeyResult() {
    console.log("Hello");
    const data = {
      ...keyResult,
      id: keyResultList.length
        ? keyResultList[keyResultList.length - 1].id + 1
        : 0,
    };

    try{
        sendKeyResult(data);
    }catch(err){
        alert(err);
    }
  }
  return (
    <div
      className={
        "flex flex-col gap-2 border-2 rounded-lg border-gray-400 p-4 m-4"
      }
    >
      <label htmlFor={"description"} className={"font-bold"}>
        Key Results
      </label>
      <input
        id={"description"}
        type="text"
        name={"description"}
        placeholder={"Key Results"}
        value={keyResult.description}
        className={"border-2 border-gray-200 rounded-lg p-2"}
        onChange={inputHandler}
        required={true}
      />
      <label htmlFor={"progress"} className={"font-bold"}>
        Progress
      </label>
      <input
        id={"progress"}
        type="text"
        name={"progress"}
        value={keyResult.progress}
        onChange={inputHandler}
        placeholder={"Progress"}
        className={"border-2 border-gray-200 rounded-lg p-2"}
        required={true}
      />
      <button
        type={"button"}
        onClick={addKeyResult}
        className={
          "bg-[#007AFF] hover:bg-blue-700 border shadow-blue-500/20 shadow-lg text-white p-2 px-4 rounded-xl transition-all "
        }
      >
        Add
      </button>
    </div>
  );
};
