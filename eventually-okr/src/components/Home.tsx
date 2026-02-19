import EventuallyOkr from "../Eventually_OKR.tsx";
import Modal from "./Modal.tsx";
import OkrList from "./OkrList.tsx";
import { useEffect, useState } from "react";
import type { OKR } from "../types/okr_form.types.ts";

const API_BASE = "http://localhost:3001";

type ConfirmState =
  | {
      kind: "objective";
      objectiveId: number;
      title: string;
      message: string;
      confirmLabel?: string;
    }
  | {
      kind: "keyResult";
      objectiveId: number;
      keyResultId: number;
      title: string;
      message: string;
      confirmLabel?: string;
    };

const Home = () => {
  const [okrList, setOkrList] = useState<OKR[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const totalObjectives = okrList.length;
  const totalKeyResults = okrList.reduce(
    (sum, objective) => sum + (objective.keyResults?.length ?? 0),
    0,
  );
  const completedObjectives = okrList.filter((objective) => {
    const keyResults = objective.keyResults ?? [];
    return (
      keyResults.length > 0 &&
      keyResults.every((keyResult) => {
        if (keyResult.isCompleted) return true;
        if (!Number.isFinite(keyResult.targetValue) || keyResult.targetValue <= 0)
          return false;
        return (keyResult.updatedValue / keyResult.targetValue) * 100 >= 100;
      })
    );
  }).length;

  async function loadOkrs() {
    try {
      const res = await fetch(`${API_BASE}/objectives`);
      if (!res.ok) throw new Error(`Failed to load OKRs (${res.status}).`);
      const result = await res.json();
      setOkrList(result);
      setNotice(null);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : String(err));
    }
  }

  useEffect(() => {
    loadOkrs();
  }, []);

  async function performDeleteObjective(objectiveId: number) {
    try {
      const res = await fetch(`${API_BASE}/objectives/${objectiveId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete OKR (${res.status}).`);
      setOkrList((prev) => prev.filter((o) => o.id !== objectiveId));
      setNotice(null);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : String(err));
    }
  }

  function requestDeleteObjective(objectiveId: number) {
    setConfirmState({
      kind: "objective",
      objectiveId,
      title: "Delete OKR",
      message: "Delete this objective?",
      confirmLabel: "Delete",
    });
  }

  async function saveObjectiveTitle(
    objectiveId: number,
    title: string,
  ): Promise<boolean> {
    const nextObjective = title.trim();
    if (!nextObjective) return false;

    try {
      const res = await fetch(`${API_BASE}/objectives/${objectiveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextObjective }),
      });
      if (!res.ok) throw new Error(`Failed to update OKR (${res.status}).`);

      setOkrList((prev) =>
        prev.map((o) =>
          o.id === objectiveId ? { ...o, title: nextObjective } : o,
        ),
      );
      setNotice(null);
      return true;
    } catch (err) {
      setNotice(err instanceof Error ? err.message : String(err));
      return false;
    }
  }

  async function performDeleteKeyResult(
    objectiveId: number,
    keyResultId: number,
  ) {
    try {
      setOkrList((prev) =>
        prev.map((o) =>
          o.id === objectiveId
            ? {
                ...o,
                keyResults: (o.keyResults ?? []).filter(
                  (kr) => kr.id !== keyResultId,
                ),
              }
            : o,
        ),
      );

      const res = await fetch(
        `${API_BASE}/objective/${objectiveId}/key-results/${keyResultId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok)
        throw new Error(`Failed to delete key result (${res.status}).`);
      setNotice(null);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : String(err));
    }
  }

  function requestDeleteKeyResult(objectiveId: number, keyResultId: number) {
    setConfirmState({
      kind: "keyResult",
      objectiveId,
      keyResultId,
      title: "Delete Key Result",
      message: "Delete this key result?",
      confirmLabel: "Delete",
    });
  }

  async function updateKeyResult(
    objectiveId: number,
    keyResultId: number,
    updates: {
      updatedValue?: number;
      targetValue?: number;
      metric?: string;
      isCompleted?: boolean;
    },
  ) {
    setOkrList((prev) =>
      prev.map((o) =>
        o.id === objectiveId
          ? {
              ...o,
              keyResults: o.keyResults.map((kr) =>
                kr.id === keyResultId ? { ...kr, ...updates } : kr,
              ),
            }
          : o,
      ),
    );

    try {
      const res = await fetch(
        `${API_BASE}/objective/${objectiveId}/key-results/${keyResultId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        },
      );
      if (!res.ok)
        throw new Error(`Failed to update key result (${res.status}).`);
      setNotice(null);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : String(err));
      loadOkrs();
    }
  }

  async function handleConfirm(confirm: ConfirmState) {
    if (confirm.kind === "objective") {
      await performDeleteObjective(confirm.objectiveId);
      return;
    }
    await performDeleteKeyResult(confirm.objectiveId, confirm.keyResultId);
  }

  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        {notice ? (
          <div className="glass-card enter-up rounded-2xl border border-rose-200 bg-rose-50/85 px-4 py-3 text-sm text-rose-700">
            {notice}
          </div>
        ) : null}
        <div className="glass-card enter-up rounded-3xl p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
                Eventually OKR
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Build momentum, not just lists.
              </h1>
              <div className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Plan objectives, track user-defined metrics, and finish what
                matters with clear completion signals.
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Modal triggerLabel="Add OKR" triggerVariant="primary" size="xl">
                <EventuallyOkr setOkrList={setOkrList} apiBase={API_BASE} />
              </Modal>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Objectives
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {totalObjectives}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Key Results
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {totalKeyResults}
              </div>
            </div>
            <div className="col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 sm:col-span-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Completed
              </div>
              <div className="mt-1 text-2xl font-bold text-emerald-800">
                {completedObjectives}
              </div>
            </div>
          </div>
        </div>

        <div className="enter-up stagger-1">
          <OkrList
            okr={okrList}
            onDeleteObjective={requestDeleteObjective}
            onSaveObjectiveTitle={saveObjectiveTitle}
            onDeleteKeyResult={requestDeleteKeyResult}
            onUpdateKeyResult={updateKeyResult}
          />
        </div>
      </div>

      <Modal
        isOpen={Boolean(confirmState)}
        hideTrigger
        title={confirmState?.title ?? "Confirm"}
        size="sm"
        onOpenChange={(open) => {
          if (!open) setConfirmState(null);
        }}
      >
        {({ close }) => (
          <div className="glass-card enter-up flex flex-col gap-4 rounded-3xl p-5">
            <div className="text-base font-semibold text-zinc-900">
              {confirmState?.message}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!confirmState) return;
                  void handleConfirm(confirmState);
                  close();
                }}
                className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 cursor-pointer hover:bg-rose-50"
              >
                {confirmState?.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Home;
