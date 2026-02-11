import { type FormEvent, useState } from "react";
import type { KeyResult, OKR } from "../types/okr_form.types.ts";
import Modal from "./Modal.tsx";

type OKRListProps = {
  okr: OKR[];
  onDeleteObjective: (objectiveId: number) => void;
  onSaveObjectiveTitle: (
    objectiveId: number,
    title: string,
  ) => Promise<boolean>;
  onDeleteKeyResult: (objectiveId: number, keyResultId: number) => void;
  onUpdateKeyResult: (
    objectiveId: number,
    keyResultId: number,
    updates: { progress?: number; isCompleted?: boolean },
  ) => void;
};

type ActiveKeyResult = {
  objectiveId: number;
  keyResult: KeyResult;
};

type ObjectiveEditFormProps = {
  objective: OKR;
  onSave: (objectiveId: number, title: string) => Promise<boolean>;
  onClose: () => void;
};

const ObjectiveEditForm = ({
  objective,
  onSave,
  onClose,
}: ObjectiveEditFormProps) => {
  const [draftTitle, setDraftTitle] = useState(objective.title);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = draftTitle.trim();
    if (!nextTitle) {
      setFormError("Please enter an objective.");
      return;
    }
    const saved = await onSave(objective.id, nextTitle);
    if (saved) {
      setFormError(null);
      onClose();
      return;
    }
    setFormError("Unable to save objective.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl border border-[#c7c7cc] bg-white/60 p-5"
    >
      {formError ? (
        <div className="rounded-2xl border border-[#ffd1d1] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]">
          {formError}
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`objective-${objective.id}`}
          className="text-lg font-semibold text-zinc-900"
        >
          Objectives
        </label>
        <input
          id={`objective-${objective.id}`}
          type="text"
          placeholder="Objectives"
          name="objective"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          className="rounded-2xl border border-[#e5e5ea] bg-[#f2f2f7] px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
          required
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-[#f2f2f7]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-[#007AFF] cursor-pointer hover:bg-[#f2f2f7]"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const OkrList = ({
  okr,
  onDeleteObjective,
  onSaveObjectiveTitle,
  onDeleteKeyResult,
  onUpdateKeyResult,
}: OKRListProps) => {
  const [activeKeyResult, setActiveKeyResult] =
    useState<ActiveKeyResult | null>(null);
  const [progressInput, setProgressInput] = useState("");
  const [progressError, setProgressError] = useState<string | null>(null);

  const closeProgressModal = () => {
    setActiveKeyResult(null);
    setProgressInput("");
    setProgressError(null);
  };

  const openProgressModal = (objectiveId: number, keyResult: KeyResult) => {
    setActiveKeyResult({ objectiveId, keyResult });
    setProgressInput(String(keyResult.progress ?? 0));
    setProgressError(null);
  };

  const saveProgress = () => {
    if (!activeKeyResult) return;
    const nextProgress = Number(progressInput);
    if (Number.isNaN(nextProgress)) {
      setProgressError("Please enter a valid progress value.");
      return;
    }
    if (nextProgress < 0 || nextProgress > 100) {
      setProgressError("Progress should be in the range 0-100.");
      return;
    }

    onUpdateKeyResult(
      activeKeyResult.objectiveId,
      activeKeyResult.keyResult.id,
      {
        progress: nextProgress,
      },
    );
    setProgressError(null);
    closeProgressModal();
  };

  return (
    <>
      <div className="space-y-4">
        {okr?.map((objective: OKR) => (
          <div
            key={objective.id}
            className="overflow-hidden rounded-3xl border border-[#c7c7cc] bg-white/60"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#e5e5ea] px-5 py-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                {objective.title}
              </h2>
              <div className="flex items-center gap-2">
                <Modal triggerLabel="Edit" title="Edit OKR">
                  {({ close }) => (
                    <ObjectiveEditForm
                      objective={objective}
                      onSave={onSaveObjectiveTitle}
                      onClose={close}
                    />
                  )}
                </Modal>
                <button
                  type="button"
                  onClick={() => onDeleteObjective(objective.id)}
                  className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-[#FF3B30] cursor-pointer hover:bg-[#f2f2f7]"
                >
                  Delete
                </button>
              </div>
            </div>
            <ul className="divide-y divide-[#e5e5ea]">
              {objective.keyResults?.map((keyResult: KeyResult, index) => {
                const checkboxId = `kr-${objective.id}-${keyResult.id}`;
                const progressText =
                  typeof keyResult.progress === "number"
                    ? `${keyResult.progress}%`
                    : keyResult.progress;
                let bg_color = "bg-amber-200";
                if (index % 2) {
                  bg_color = "bg-pink-100";
                }
                return (
                  <li
                    key={keyResult.id}
                    className={`flex items-center justify-between gap-4 px-5 py-4 ${bg_color}`}
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <input
                        id={checkboxId}
                        type="checkbox"
                        name={checkboxId}
                        checked={Boolean(keyResult.isCompleted)}
                        onChange={(e) =>
                          onUpdateKeyResult(objective.id, keyResult.id, {
                            isCompleted: e.target.checked,
                          })
                        }
                        aria-label={`Mark ${keyResult.description} complete`}
                        className="h-4 w-4 accent-[#007AFF]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openProgressModal(objective.id, keyResult)
                        }
                        className="min-w-0 flex-1 text-left"
                        aria-label={`Edit progress for ${keyResult.description}`}
                      >
                        <span className="truncate text-base font-medium text-zinc-900 hover:text-[#007AFF]">
                          {keyResult.description}
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          openProgressModal(objective.id, keyResult)
                        }
                        className="rounded-2xl border border-[#e5e5ea] bg-white px-3 py-1.5 text-base font-semibold text-zinc-700 hover:bg-[#f2f2f7]"
                        aria-label={`Progress ${progressText}. Click to edit.`}
                      >
                        {progressText}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onDeleteKeyResult(objective.id, keyResult.id)
                        }
                        className="rounded-full border border-[#e5e5ea] px-3 py-1.5 text-sm font-semibold text-[#FF3B30] cursor-pointer hover:bg-[#f2f2f7]"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <Modal
        isOpen={Boolean(activeKeyResult)}
        hideTrigger
        title="Update Progress"
        onOpenChange={(open) => {
          if (!open) closeProgressModal();
        }}
      >
        <form
          className="flex flex-col gap-4 rounded-3xl border border-[#c7c7cc] bg-white/60 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveProgress();
          }}
        >
          <div className="text-base font-semibold text-zinc-900">
            {activeKeyResult?.keyResult.description}
          </div>
          {progressError ? (
            <div className="rounded-2xl border border-[#ffd1d1] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]">
              {progressError}
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <label htmlFor="progress-edit" className="text-lg font-semibold">
              Progress
            </label>
            <input
              id="progress-edit"
              type="number"
              min={0}
              max={100}
              inputMode="numeric"
              value={progressInput}
              onChange={(event) => setProgressInput(event.target.value)}
              placeholder="Progress"
              className="rounded-2xl border border-[#e5e5ea] bg-[#f2f2f7] px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeProgressModal}
              className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-[#f2f2f7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-[#007AFF] cursor-pointer hover:bg-[#f2f2f7]"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default OkrList;
