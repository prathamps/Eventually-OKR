import { KeyResultList } from "./components/KeyResultList.tsx";
import React, { useContext, useRef, useState } from "react";
import { KeyResultForm } from "./components/KeyResultForm.tsx";
import { KeyResultContext } from "./providers/KeyResultContext.tsx";
import { KeyResultProvider } from "./providers/KeyResultProvider.tsx";
import type { OKR } from "./types/okr_form.types.ts";

type EventuallyOkrProps = {
  readonly setOkrList: React.Dispatch<React.SetStateAction<OKR[]>>;
  readonly apiBase: string;
};

function EventuallyOkrForm({ setOkrList, apiBase }: EventuallyOkrProps) {
  const { keyResultList, setKeyResultList } = useContext(KeyResultContext);
  const [objective, setObjective] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  async function submitObjectives(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const objectiveValue = objective.trim();
    if (!objectiveValue) {
      alert("Please enter an objective.");
      return;
    }
    if (!keyResultList.length) {
      alert("Please add at least one key result.");
      return;
    }

    try {
      const objectiveRes = await fetch(`${apiBase}/objectives`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: objectiveValue,
          keyResults: keyResultList.map((kr) => ({
            description: kr.description,
            progress: Number(kr.progress),
          })),
        }),
      });

      if (!objectiveRes.ok) {
        alert(`Failed to save objective (${objectiveRes.status}).`);
        return;
      }

      const createdObjective: OKR = await objectiveRes.json();

      setOkrList((prev) => [
        ...prev,
        {
          ...createdObjective,
          keyResults: createdObjective.keyResults ?? [],
        },
      ]);

      setObjective("");
      setKeyResultList([]);
      formRef.current?.reset();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="w-full flex justify-center">
      <form
        ref={formRef}
        className={
          "w-full max-w-xl h-fit flex flex-col gap-4 p-6 rounded-3xl border border-[#c7c7cc] bg-white/60"
        }
        onSubmit={submitObjectives}
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="objectives"
            className="text-lg font-semibold text-zinc-900"
          >
            Objectives
          </label>
          <input
            id="objectives"
            type="text"
            placeholder="Objectives"
            name="objectives"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="rounded-2xl border border-[#e5e5ea] bg-[#f2f2f7] px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500  outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
            required
          />
        </div>

        <KeyResultForm />

        <KeyResultList />

        <div className="mt-2 flex justify-around gap-4">
          <button
            type="submit"
            className={
              "min-w-32 rounded-full border border-[#e5e5ea] text-[#007AFF] px-8 py-3 text-base font-semibold shadow cursor-pointer transition-all hover:scale-115"
            }
          >
            Submit
          </button>
          <button
            type="reset"
            className={
              "min-w-32 rounded-full border border-[#e5e5ea] text-[#FF3B30] px-8 py-3 text-base font-semibold shadow cursor-pointer transition-all hover:scale-115"
            }
            onClick={() => {
              setObjective("");
              setKeyResultList([]);
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

function EventuallyOkr({ setOkrList, apiBase }: EventuallyOkrProps) {
  return (
    <KeyResultProvider>
      <div className="flex flex-col items-center px-4 py-6">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900">
          Add OKR
        </h2>
        <EventuallyOkrForm setOkrList={setOkrList} apiBase={apiBase} />
      </div>
    </KeyResultProvider>
  );
}

export default EventuallyOkr;
