import { KeyResultList } from "./components/KeyResultList.tsx";
import React, { useContext } from "react";
import { KeyResultForm } from "./components/KeyResultForm.tsx";
import {
  KeyResultContext,
  KeyResultProvider,
} from "./providers/KeyResultProvider.tsx";

function Eventually_OKR() {
  const { keyResultList, setKeyResultList } = useContext(KeyResultContext);

  function displayObjectives(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const objectives = formData.get("objectives");

    console.log(objectives);
    console.log(keyResultList);
  }

  return (
    <KeyResultProvider>
      <div className={"flex flex-col justify-center items-center"}>
        <h1 className={"text-4xl font-bold m-4"}>Eventually OKR</h1>
        <div className={"w-dvw flex justify-center"}>
          <form
            className={
              "border-2 w-2/6 h-fit flex flex-col gap-2 p-4 my-4 rounded-lg border-gray-400"
            }
            onSubmit={displayObjectives}
          >
            <div className={"flex flex-col gap-2"}>
              <label htmlFor="objectives" className={"font-bold text-lg"}>
                Objectives
              </label>
              <input
                id="objectives"
                type="text"
                placeholder={"Objectives"}
                name={"objectives"}
                className={"border-2 border-gray-200 rounded-lg p-2"}
                required={true}
              />
            </div>

            <KeyResultForm />

            <KeyResultList />

            <div className={"flex justify-around"}>
              <button
                type="submit"
                className={
                  "bg-[#007AFF] hover:bg-blue-700 border shadow-blue-500/20 shadow-lg text-white p-2 px-4 rounded-xl transition-all "
                }
              >
                Submit
              </button>
              <button
                type="reset"
                className={
                  "bg-[#FF3B30] hover:bg-red-700 border shadow-blue-500/20 shadow-lg text-white p-2 px-4 rounded-xl transition-all "
                }
                onClick={() => {
                  setKeyResultList([]);
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </KeyResultProvider>
  );
}

export default Eventually_OKR;
