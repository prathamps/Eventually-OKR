import React, { useContext, useState } from "react";
import type { KeyResult } from "../types/okr_form.types.ts";
import { KeyResultContext } from "../providers/KeyResultContext.tsx";

export const KeyResultForm = () => {
  const [keyResult, setKeyResult] = useState<KeyResult>({
    id: 0,
    description: "",
    progress: 0,
  });
  const [progressInput, setProgressInput] = useState("0");
  const [formError, setFormError] = useState<string | null>(null);

  const { keyResultList, sendKeyResult } = useContext(KeyResultContext);

  function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "progress") {
      setProgressInput(value);
      return;
    }
    setKeyResult({ ...keyResult, [name]: value });
  }

  function addKeyResult() {
    const progress = Number(progressInput);
    const data = {
      ...keyResult,
      progress,
      id: keyResultList.length
        ? keyResultList[keyResultList.length - 1].id + 1
        : 0,
    };

    try {
      sendKeyResult(data);
      setKeyResult({ id: 0, description: "", progress: 0 });
      setProgressInput("0");
      setFormError(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    }
  }
  return (
    <div
      className={
        "flex flex-col gap-3 rounded-3xl border border-[#c7c7cc] bg-white/60 p-5 "
      }
    >
      {formError ? (
        <div className="rounded-2xl border border-[#ffd1d1] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]">
          {formError}
        </div>
      ) : null}
      <label htmlFor={"description"} className="text-lg font-semibold">
        Key Results
      </label>
      <input
        id={"description"}
        type="text"
        name={"description"}
        placeholder={"Key Results"}
        value={keyResult.description}
        className="rounded-2xl border border-[#e5e5ea] bg-[#f2f2f7] px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500  outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
        onChange={inputHandler}
      />
      <label htmlFor={"progress"} className="text-lg font-semibold">
        Progress
      </label>
      <input
        id={"progress"}
        type="number"
        min={0}
        max={100}
        inputMode="numeric"
        name={"progress"}
        value={progressInput}
        onChange={inputHandler}
        placeholder={"Progress"}
        className="rounded-2xl border border-[#e5e5ea] bg-[#f2f2f7] px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
      />
      <button
        type={"button"}
        onClick={addKeyResult}
        className={
          "mt-2 w-full rounded-2xl border border-[#e5e5ea] text-[#007AFF] px-6 py-3 text-base font-semibold "
        }
      >
        Add
      </button>
    </div>
  );
};
