import { KeyResultList } from "./components/KeyResultList.tsx"
import React, { useContext } from "react"
import { KeyResultForm } from "./components/KeyResultForm.tsx"
import {
	KeyResultContext,
	KeyResultProvider,
} from "./providers/KeyResultProvider.tsx"

function Eventually_OKR({setOkrList}) {
	const { keyResultList, setKeyResultList } = useContext(KeyResultContext)

	function submitObjectives(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.target)
		const objectives = formData.get("objectives")

		// setOkrList((prev)=> [...prev, {objectives, keyResultList}])
	}

	return (
    <KeyResultProvider>
      <div className="flex min-h-dvh flex-col items-center px-4 py-10">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900">
          Eventually
        </h1>
        <div className="w-full flex justify-center">
          <form
            className={
              "w-full max-w-xl lg:w-2/6 h-fit flex flex-col gap-4 p-6 rounded-3xl border border-[#c7c7cc] bg-white/60"
            }
            onSubmit={submitObjectives}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="objectives"
                className="text-lg font-semibold text-zinc-900"
              >
                Objectives
              </label>
              <input
                id="objectives"
                type="text"
                placeholder={"Objectives"}
                name={"objectives"}
                className="rounded-2xl border border-[#e5e5ea] bg-[#f2f2f7] px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500  outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
                required={true}
              />
            </div>

            <KeyResultForm />

            <KeyResultList />

            <div className="mt-2 flex justify-around gap-4">
              <button
                type="submit"
                className={
                  "min-w-32 rounded-full border border-[#e5e5ea] text-[#007AFF] px-8 py-3 text-base font-semibold shadow cursor-pointer transition-all hover:scale-115  "
                }
              >
                Submit
              </button>
              <button
                type="reset"
                className={
                  "min-w-32 rounded-full border border-[#e5e5ea] text-[#FF3B30] px-8 py-3 text-base font-semibold shadow cursor-pointer transition-all hover:scale-115 "
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

export default Eventually_OKR
