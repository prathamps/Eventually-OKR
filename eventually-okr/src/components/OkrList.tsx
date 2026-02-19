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
    updates: {
      updatedValue?: number;
      targetValue?: number;
      metric?: string;
      isCompleted?: boolean;
    },
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
      className="glass-card flex flex-col gap-4 rounded-3xl p-5"
    >
      {formError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/85 px-4 py-3 text-sm text-rose-700">
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
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
          required
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full border border-teal-300 bg-teal-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-teal-700"
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
  const [updatedValueInput, setUpdatedValueInput] = useState("");
  const [targetValueInput, setTargetValueInput] = useState("");
  const [metricInput, setMetricInput] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const closeProgressModal = () => {
    setActiveKeyResult(null);
    setUpdatedValueInput("");
    setTargetValueInput("");
    setMetricInput("");
    setEditError(null);
  };

  const openProgressModal = (objectiveId: number, keyResult: KeyResult) => {
    setActiveKeyResult({ objectiveId, keyResult });
    setUpdatedValueInput(String(keyResult.updatedValue ?? 0));
    setTargetValueInput(String(keyResult.targetValue ?? 0));
    setMetricInput(keyResult.metric ?? "");
    setEditError(null);
  };

  const saveProgress = () => {
    if (!activeKeyResult) return;
    const nextUpdatedValue = Number(updatedValueInput);
    const nextTargetValue = Number(targetValueInput);
    const nextMetric = metricInput.trim();

    if (!nextMetric) {
      setEditError("Please enter a metric.");
      return;
    }
    if (Number.isNaN(nextUpdatedValue)) {
      setEditError("Please enter a valid updated value.");
      return;
    }
    if (Number.isNaN(nextTargetValue)) {
      setEditError("Please enter a valid target value.");
      return;
    }
    if (nextUpdatedValue < 0) {
      setEditError("Updated value cannot be negative.");
      return;
    }
    if (nextTargetValue <= 0) {
      setEditError("Target value should be greater than 0.");
      return;
    }
    if (nextUpdatedValue > nextTargetValue) {
      setEditError("Updated value cannot be greater than target value.");
      return;
    }

    onUpdateKeyResult(
      activeKeyResult.objectiveId,
      activeKeyResult.keyResult.id,
      {
        updatedValue: nextUpdatedValue,
        targetValue: nextTargetValue,
        metric: nextMetric,
      },
    );
    setEditError(null);
    closeProgressModal();
  };

  const getProgress = (updatedValue: number, targetValue: number) => {
    if (!Number.isFinite(updatedValue) || !Number.isFinite(targetValue)) {
      return 0;
    }
    if (targetValue <= 0) return 0;
    return Math.round((updatedValue / targetValue) * 100);
  };

  const isKeyResultComplete = (keyResult: KeyResult) =>
    Boolean(keyResult.isCompleted) ||
    getProgress(keyResult.updatedValue, keyResult.targetValue) >= 100;

  return (
    <>
<<<<<<< HEAD
      <div className="space-y-4">
        {okr?.map((objective: OKR) => {
          const keyResults = objective.keyResults ?? [];
          const completedCount = keyResults.filter(isKeyResultComplete).length;
          const objectiveComplete =
            keyResults.length > 0 && completedCount === keyResults.length;

          return (
            <div
              key={objective.id}
              className={`glass-card overflow-hidden rounded-3xl border ${
                objectiveComplete ? "border-emerald-300" : "border-slate-200"
              }`}
            >
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
=======
      <div className="space-y-4 ">
        {okr?.map((objective: OKR) => (
          <div
            key={objective.id}
            className="overflow-hidden shadow-sm rounded-3xl border border-[#c7c7cc] bg-white/60"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#e5e5ea] px-5 py-4">
>>>>>>> 3dfec36f86c0c088231470f35a0ed062b323c4ef
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-zinc-900">
                  {objective.title}
                </h2>
                {objectiveComplete ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Completed
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600">
                  {completedCount}/{keyResults.length} done
                </span>
                <Modal
                  triggerLabel="Edit"
                  title="Edit OKR"
                  triggerVariant="secondary"
                  size="sm"
                >
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
                  className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 cursor-pointer hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
            <ul className="divide-y divide-slate-200">
              {keyResults.map((keyResult: KeyResult, index) => {
                const checkboxId = `kr-${objective.id}-${keyResult.id}`;
<<<<<<< HEAD
                const progressValue = getProgress(
                  keyResult.updatedValue,
                  keyResult.targetValue,
                );
                const progressText = `${progressValue}%`;
                const valueText = `${keyResult.updatedValue}/${keyResult.targetValue} ${keyResult.metric}`;
                const keyResultComplete = isKeyResultComplete(keyResult);
                let bg_color = "bg-white/85";
=======
                const progressText =
                  typeof keyResult.progress === "number"
                    ? `${keyResult.progress}%`
                    : keyResult.progress;
                let bg_color = "bg-amber-200";
>>>>>>> 3dfec36f86c0c088231470f35a0ed062b323c4ef
                if (index % 2) {
                  bg_color = "bg-amber-50/70";
                }
                if (keyResultComplete) {
                  bg_color = "bg-emerald-50/85";
                }
                return (
                  <li
                    key={keyResult.id}
                    className={`flex flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between ${bg_color}`}
                  >
                    <div className="min-w-0 flex items-start gap-3 sm:items-center">
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
                        aria-label={`Edit values for ${keyResult.description}`}
                      >
                        <span
                          className={`truncate text-base font-medium hover:text-[#007AFF] ${
                            keyResultComplete
                              ? "text-emerald-700 line-through"
                              : "text-zinc-900"
                          }`}
                        >
                          {keyResult.description}
                        </span>
                        <span className="truncate text-sm text-zinc-500">
                          {valueText}
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          openProgressModal(objective.id, keyResult)
                        }
                        className={`rounded-2xl border px-3 py-1.5 text-base font-semibold hover:bg-[#f2f2f7] ${
                          keyResultComplete
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-zinc-700"
                        }`}
                        aria-label={`Progress ${progressText}. Click to edit values.`}
                      >
                        {progressText}
                      </button>
                      {keyResultComplete ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          Done
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() =>
                          onDeleteKeyResult(objective.id, keyResult.id)
                        }
<<<<<<< HEAD
                        className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-sm font-semibold text-rose-700 cursor-pointer hover:bg-rose-50"
=======
                        className="rounded-full border border-black px-3 py-1.5 text-sm font-semibold text-[#FF3B30] cursor-pointer hover:bg-[#f2f2f7]"
>>>>>>> 3dfec36f86c0c088231470f35a0ed062b323c4ef
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          );
        })}
      </div>

      <Modal
        isOpen={Boolean(activeKeyResult)}
        hideTrigger
        title="Update Key Result"
        size="md"
        onOpenChange={(open) => {
          if (!open) closeProgressModal();
        }}
      >
        <form
          className="glass-card flex flex-col gap-4 rounded-3xl p-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveProgress();
          }}
        >
          <div className="text-base font-semibold text-zinc-900">
            {activeKeyResult?.keyResult.description}
          </div>
          {editError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/85 px-4 py-3 text-sm text-rose-700">
              {editError}
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <label htmlFor="metric-edit" className="text-lg font-semibold">
              Metric
            </label>
            <input
              id="metric-edit"
              type="text"
              value={metricInput}
              onChange={(event) => setMetricInput(event.target.value)}
              placeholder="Metric"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="updated-value-edit" className="text-lg font-semibold">
              Updated Value
            </label>
            <input
              id="updated-value-edit"
              type="number"
              min={0}
              inputMode="decimal"
              value={updatedValueInput}
              onChange={(event) => setUpdatedValueInput(event.target.value)}
              placeholder="Updated value"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="target-value-edit" className="text-lg font-semibold">
              Target Value
            </label>
            <input
              id="target-value-edit"
              type="number"
              min={1}
              inputMode="decimal"
              value={targetValueInput}
              onChange={(event) => setTargetValueInput(event.target.value)}
              placeholder="Target value"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
            />
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={closeProgressModal}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-slate-100 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-full border border-teal-300 bg-teal-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-teal-700 sm:w-auto"
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
