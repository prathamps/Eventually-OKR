import Eventually_OKR from "../Eventually_OKR.tsx";
import Modal from "./Modal.tsx";
import OkrList from "./OkrList.tsx";
import { useEffect, useState } from "react";
import type { OKR } from "../types/okr_form.types.ts";

const Home = () => {
  const [okrList, setOkrList] = useState<OKR[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/okrs")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load OKRs (${res.status}).`);
        const result = await res.json();
        setOkrList(result);
      })
      .catch((err) => {
        alert(err instanceof Error ? err.message : String(err));
      });
  }, []);

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
            <Eventually_OKR setOkrList={setOkrList} />
          </Modal>
        </div>

        <OkrList okr={okrList} />
      </div>
    </div>
  );
};
export default Home;
