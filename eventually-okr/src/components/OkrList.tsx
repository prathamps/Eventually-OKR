import type { KeyResult, OKR } from "../types/okr_form.types.ts";

type OKRListProps = {
  okr: OKR[];
  onDeleteObjective: (objectiveId: number) => void;
  onEditObjective: (objectiveId: number, currentObjective: string) => void;
  onDeleteKeyResult: (objectiveId: number, keyResultId: number) => void;
};

const OkrList = ({
  okr,
  onDeleteObjective,
  onEditObjective,
  onDeleteKeyResult,
}: OKRListProps) => {
  return (
    <div className="space-y-4">
      {okr?.map((objective: OKR) => {
        return (
          <div
            key={objective.id}
            className="overflow-hidden rounded-3xl border border-[#c7c7cc] bg-white/60"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#e5e5ea] px-5 py-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                {objective.objective}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onEditObjective(objective.id, objective.objective)
                  }
                  className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-[#007AFF] cursor-pointer hover:bg-[#f2f2f7]"
                >
                  Edit
                </button>
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
                        className="h-4 w-4 accent-[#007AFF]"
                      />
                      <span className="truncate text-base font-medium text-zinc-900">
                        {keyResult.description}
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="whitespace-nowrap tabular-nums text-base font-semibold text-zinc-600">
                        {keyResult.progress}
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
