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
    <div className="min-h-dvh px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        {notice ? (
          <div className="mb-4 rounded-2xl border border-[#ffd1d1] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]">
            {notice}
          </div>
        ) : null}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Eventually
            </h1>
            <div className="mt-1 text-base text-zinc-600">
              Track objectives and key results
            </div>
          </div>
          <Modal triggerLabel="Add OKR">
            <EventuallyOkr setOkrList={setOkrList} apiBase={API_BASE} />
          </Modal>
        </div>

        <OkrList
          okr={okrList}
          onDeleteObjective={requestDeleteObjective}
          onSaveObjectiveTitle={saveObjectiveTitle}
          onDeleteKeyResult={requestDeleteKeyResult}
          onUpdateKeyResult={updateKeyResult}
        />
      </div>

      <Modal
        isOpen={Boolean(confirmState)}
        hideTrigger
        title={confirmState?.title ?? "Confirm"}
        onOpenChange={(open) => {
          if (!open) setConfirmState(null);
        }}
      >
        {({ close }) => (
          <div className="flex flex-col gap-4 rounded-3xl border border-[#c7c7cc] bg-white/60 p-5">
            <div className="text-base font-semibold text-zinc-900">
              {confirmState?.message}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-[#f2f2f7]"
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
                className="rounded-full border border-[#e5e5ea] px-4 py-2 text-sm font-semibold text-[#FF3B30] cursor-pointer hover:bg-[#f2f2f7]"
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
