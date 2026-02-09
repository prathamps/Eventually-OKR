import EventuallyOkr from "../Eventually_OKR.tsx";
import Modal from "./Modal.tsx";
import OkrList from "./OkrList.tsx";
import { useEffect, useState } from "react";
import type { OKR } from "../types/okr_form.types.ts";

const API_BASE = "http://localhost:3001";

const Home = () => {
  const [okrList, setOkrList] = useState<OKR[]>([]);

  async function loadOkrs() {
    try {
      const res = await fetch(`${API_BASE}/objectives`);
      if (!res.ok) throw new Error(`Failed to load OKRs (${res.status}).`);
      const result = await res.json();
      setOkrList(result);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  useEffect(() => {
    loadOkrs();
  }, []);

  async function deleteObjective(objectiveId: number) {
    const confirmed = confirm("Delete this objective?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/objectives/${objectiveId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete OKR (${res.status}).`);
      setOkrList((prev) => prev.filter((o) => o.id !== objectiveId));
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
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
      return true;
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
      return false;
    }
  }

  async function deleteKeyResult(objectiveId: number, keyResultId: number) {
    const confirmed = confirm("Delete this key result?");
    if (!confirmed) return;

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
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  async function updateKeyResult(
    objectiveId: number,
    keyResultId: number,
    updates: { progress?: number; isCompleted?: boolean },
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
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
      loadOkrs();
    }
  }

  return (
    <div className="min-h-dvh px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
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
          onDeleteObjective={deleteObjective}
          onSaveObjectiveTitle={saveObjectiveTitle}
          onDeleteKeyResult={deleteKeyResult}
          onUpdateKeyResult={updateKeyResult}
        />
      </div>
    </div>
  );
};
export default Home;
