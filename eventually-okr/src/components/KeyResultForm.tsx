import React, { useContext, useState } from "react"
import type { KeyResult } from "../types/okr_form.types.ts"
import { KeyResultContext } from "../providers/KeyResultProvider.tsx"

type KeyResultForm = {
	KeyResultsList: KeyResult[]
	setKeyResultsList: (keyResultList: KeyResult[]) => void
}

export const KeyResultForm = () => {
	const [keyResult, setKeyResult] = useState<KeyResult>({
		id: 0,
		description: "",
		progress: "",
	})

	const { keyResultList, sendKeyResult } = useContext(KeyResultContext)

	function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
		setKeyResult({ ...keyResult, [e.target.name]: e.target.value })
		console.log(keyResult)
	}

	function addKeyResult() {
		console.log("Hello")
		const data = {
			...keyResult,
			id: keyResultList.length
				? keyResultList[keyResultList.length - 1].id + 1
				: 0,
		}

		try {
			sendKeyResult(data)
		} catch (err) {
			alert(err)
		}
	}
	return (
		<div
			className={
				"flex flex-col gap-3 rounded-3xl border border-[#c7c7cc] bg-white/60 p-5 "
			}
		>
			<label htmlFor={"description"} className="text-lg font-semibold">
				Key Results
			</label>
			<input
				id={"description"}
				type="text"
				name={"description"}
				placeholder={"Key Results"}
				value={keyResult.description}
				className="rounded-2xl border border-[#e5e5ea] bg-[#f2f2f7] px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500  outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
				onChange={inputHandler}
				required={true}
			/>
			<label htmlFor={"progress"} className="text-lg font-semibold">
				Progress
			</label>
			<input
				id={"progress"}
				type="text"
				name={"progress"}
				value={keyResult.progress}
				onChange={inputHandler}
				placeholder={"Progress"}
				className="rounded-2xl border border-[#e5e5ea] bg-[#f2f2f7] px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/15"
				required={true}
			/>
			<button
				type={"button"}
				onClick={addKeyResult}
				className={
					"mt-2 w-full rounded-2xl border border-[#e5e5ea] text-[#007AFF] px-6 py-3 text-base font-semibold "
				}
			>
				Add
			</button>
		</div>
	)
}
