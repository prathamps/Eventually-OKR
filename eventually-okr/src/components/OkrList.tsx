import type { KeyResult, OKR } from "../types/okr_form.types.ts";

type OKRListProps = {
  okr: OKR[];
  onDeleteObjective: (objectiveId: number) => void;
  onStartEditObjective: (objectiveId: number, currentTitle: string) => void;
  onCancelEditObjective: () => void;
  onSaveEditObjective: (objectiveId: number) => void;
  editingObjectiveId: number | null;
  editingTitle: string;
  onEditingTitleChange: (value: string) => void;
  onDeleteKeyResult: (objectiveId: number, keyResultId: number) => void;
  onUpdateKeyResult: (
    objectiveId: number,
    keyResultId: number,
    updates: { progress?: number; isCompleted?: boolean },
  ) => void;
};

const OkrList = ({
  okr,
  onDeleteObjective,
  onStartEditObjective,
  onCancelEditObjective,
  onSaveEditObjective,
  editingObjectiveId,
  editingTitle,
  onEditingTitleChange,
  onDeleteKeyResult,
  onUpdateKeyResult,
}: OKRListProps) => {
  return (
    <div className="space-y-4">
      {okr?.map((objective: OKR) => {
        const isEditing = editingObjectiveId === objective.id;
        return (
          <div
            key={objective.id}
            className="overflow-hidden rounded-3xl border border-[#c7c7cc] bg-white/60"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#e5e5ea] px-5 py-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => onEditingTitleChange(e.target.value)}
                  className="w-full rounded-2xl border border-[#e5e5ea] bg-white px-3 py-2 text-base font-semibold text-zinc-900 outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
                />
              ) : (
                <h2 className="text-lg font-semibold text-zinc-900">
                  {objective.title}
                </h2>
              )}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onSaveEditObjective(objective.id)}
                      className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-[#007AFF] cursor-pointer hover:bg-[#f2f2f7]"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={onCancelEditObjective}
                      className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-[#f2f2f7]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      onStartEditObjective(objective.id, objective.title)
                    }
                    className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-[#007AFF] cursor-pointer hover:bg-[#f2f2f7]"
                  >
                    Edit
                  </button>
                )}
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
              {objective.keyResults?.map((keyResult: KeyResult) => {
                const checkboxId = `kr-${objective.id}-${keyResult.id}`;
                const progressText =
                  typeof keyResult.progress === "number"
                    ? `${keyResult.progress}%`
                    : keyResult.progress;
                return (
                  <li
                    key={keyResult.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <label
                      htmlFor={checkboxId}
                      className="min-w-0 flex items-center gap-3"
                    >
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
                        className="h-4 w-4 accent-[#007AFF]"
                      />
                      <span className="truncate text-base font-medium text-zinc-900">
                        {keyResult.description}
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={keyResult.progress}
                        onChange={(e) => {
                          const nextProgress = Number(e.target.value);
                          if (Number.isNaN(nextProgress)) return;
                          onUpdateKeyResult(objective.id, keyResult.id, {
                            progress: nextProgress,
                          });
                        }}
                        className="w-20 rounded-2xl border border-[#e5e5ea] bg-white px-3 py-1.5 text-base font-semibold text-zinc-700 outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
                        aria-label="Progress"
                      />
                      <div className="whitespace-nowrap tabular-nums text-base font-semibold text-zinc-600">
                        {progressText}
                      </div>
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
        );
      })}
    </div>
  );
};
export default OkrList;
