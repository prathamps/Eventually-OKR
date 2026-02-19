import React, { useContext, useState } from "react";
import type { KeyResult } from "../types/okr_form.types.ts";
import { KeyResultContext } from "../providers/KeyResultContext.tsx";

export const KeyResultForm = () => {
  const [keyResult, setKeyResult] = useState<KeyResult>({
    id: 0,
    description: "",
    updatedValue: 0,
    targetValue: 1,
    metric: "",
  });
  const [updatedValueInput, setUpdatedValueInput] = useState("0");
  const [targetValueInput, setTargetValueInput] = useState("1");
  const [formError, setFormError] = useState<string | null>(null);

  const { keyResultList, sendKeyResult } = useContext(KeyResultContext);

  function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "updatedValue") {
      setUpdatedValueInput(value);
      return;
    }
    if (name === "targetValue") {
      setTargetValueInput(value);
      return;
    }
    setKeyResult({ ...keyResult, [name]: value });
  }

  function addKeyResult() {
    const updatedValue = Number(updatedValueInput);
    const targetValue = Number(targetValueInput);
    const data = {
      ...keyResult,
      updatedValue,
      targetValue,
      id: keyResultList.length
        ? keyResultList[keyResultList.length - 1].id + 1
        : 0,
    };

    try {
      sendKeyResult(data);
      setKeyResult({
        id: 0,
        description: "",
        updatedValue: 0,
        targetValue: 1,
        metric: "",
      });
      setUpdatedValueInput("0");
      setTargetValueInput("1");
      setFormError(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    }
  }
  return (
    <div
      className={
        "glass-card flex flex-col gap-3 rounded-3xl p-5 "
      }
    >
      {formError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/85 px-4 py-3 text-sm text-rose-700">
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
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500  outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
        onChange={inputHandler}
      />
      <label htmlFor={"metric"} className="text-lg font-semibold">
        Metric
      </label>
      <input
        id={"metric"}
        type="text"
        name={"metric"}
        placeholder={"Metric (e.g., users, %, seconds)"}
        value={keyResult.metric}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500  outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
        onChange={inputHandler}
      />
      <label htmlFor={"updatedValue"} className="text-lg font-semibold">
        Updated Value
      </label>
      <input
        id={"updatedValue"}
        type="number"
        min={0}
        inputMode="decimal"
        name={"updatedValue"}
        value={updatedValueInput}
        onChange={inputHandler}
        placeholder={"Updated value"}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
      />
      <label htmlFor={"targetValue"} className="text-lg font-semibold">
        Target Value
      </label>
      <input
        id={"targetValue"}
        type="number"
        min={1}
        inputMode="decimal"
        name={"targetValue"}
        value={targetValueInput}
        onChange={inputHandler}
        placeholder={"Target value"}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
      />
      <button
        type={"button"}
        onClick={addKeyResult}
        className={
          "mt-2 w-full rounded-2xl border border-teal-300 bg-teal-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-teal-700"
        }
      >
        Add
      </button>
    </div>
  );
};
