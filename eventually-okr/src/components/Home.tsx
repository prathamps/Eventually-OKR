import Eventually_OKR from "../Eventually_OKR.tsx";
import Modal from "./Modal.tsx";
import OkrList from "./OkrList.tsx";
import { useEffect, useState } from "react";
import type { OKR } from "../types/okr_form.types.ts";

const Home = () => {
  const [okrList, setOkrList] = useState<OKR[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/okrs").then(async (res) => {
      const result = await res.json();
      console.log(result)
      setOkrList(result);
    });
  }, []);

  return (
    <>
      <Modal>
        <Eventually_OKR setOkrList={setOkrList} />
      </Modal>
      <OkrList okr={okrList} />
    </>
  );
};
export default Home;
