import { KeyResultList } from "./components/KeyResultList.tsx"
import React, { useContext, useRef, useState } from "react"
import { KeyResultForm } from "./components/KeyResultForm.tsx"
import { KeyResultContext } from "./providers/KeyResultContext.tsx"
import { KeyResultProvider } from "./providers/KeyResultProvider.tsx"
import type { OKR } from "./types/okr_form.types.ts"

type EventuallyOkrProps = {
	readonly setOkrList: React.Dispatch<React.SetStateAction<OKR[]>>
	readonly apiBase: string
}

function EventuallyOkrForm({ setOkrList, apiBase }: EventuallyOkrProps) {
	const { keyResultList, setKeyResultList } = useContext(KeyResultContext)
	const [objective, setObjective] = useState("")
	const [formError, setFormError] = useState<string | null>(null)
	const formRef = useRef<HTMLFormElement | null>(null)

	async function submitObjectives(
		event: React.SyntheticEvent<HTMLFormElement>,
	) {
		event.preventDefault()
		setFormError(null)

		const objectiveValue = objective.trim()
		if (!objectiveValue) {
			setFormError("Please enter an objective.")
			return
		}
		if (!keyResultList.length) {
			setFormError("Please add at least one key result.")
			return
		}

		try {
			const objectiveRes = await fetch(`${apiBase}/objectives`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: objectiveValue,
					keyResults: keyResultList.map((kr) => ({
						description: kr.description,
						updatedValue: Number(kr.updatedValue),
						targetValue: Number(kr.targetValue),
						metric: kr.metric,
					})),
				}),
			})

			if (!objectiveRes.ok) {
				setFormError(`Failed to save objective (${objectiveRes.status}).`)
				return
			}

			const createdObjective: OKR = await objectiveRes.json()

			setOkrList((prev) => [
				...prev,
				{
					...createdObjective,
					keyResults: createdObjective.keyResults ?? [],
				},
			])

			setObjective("")
			setKeyResultList([])
			formRef.current?.reset()
		} catch (err) {
			setFormError(err instanceof Error ? err.message : String(err))
		}
	}

	return (
		<div className="w-full flex justify-center">
			<form
				ref={formRef}
				className={
					"glass-card w-full max-w-4xl h-fit flex flex-col gap-4 rounded-3xl p-4 sm:p-6"
				}
				onSubmit={submitObjectives}
			>
				{formError ? (
					<div className="rounded-2xl border border-rose-200 bg-rose-50/85 px-4 py-3 text-sm text-rose-700">
						{formError}
					</div>
				) : null}
				<div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="flex flex-col gap-4">
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
								placeholder="Objectives"
								name="objectives"
								value={objective}
								onChange={(e) => setObjective(e.target.value)}
								className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500  outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
								required
							/>
						</div>

						<KeyResultForm />

						<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-around">
							<button
								type="submit"
								className={
									"w-full sm:w-auto min-w-32 rounded-full border border-teal-300 bg-teal-600 px-8 py-3 text-base font-semibold text-white shadow cursor-pointer transition hover:bg-teal-700"
								}
							>
								Submit
							</button>
							<button
								type="reset"
								className={
									"w-full sm:w-auto min-w-32 rounded-full border border-rose-200 bg-white px-8 py-3 text-base font-semibold text-rose-700 shadow cursor-pointer transition hover:bg-rose-50"
								}
								onClick={() => {
									setObjective("")
									setKeyResultList([])
									setFormError(null)
								}}
							>
								Clear
							</button>
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<div className="text-lg font-semibold text-zinc-900">
							Draft Key Results
						</div>
						<div className="max-h-[45vh] overflow-y-auto pr-1">
							<KeyResultList />
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

function EventuallyOkr({ setOkrList, apiBase }: EventuallyOkrProps) {
	return (
		<KeyResultProvider>
			<div className="flex flex-col items-center px-2 sm:px-4">
				<EventuallyOkrForm setOkrList={setOkrList} apiBase={apiBase} />
			</div>
		</KeyResultProvider>
	)
}

export default EventuallyOkr
