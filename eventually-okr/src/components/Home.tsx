import EventuallyOkr from "../Eventually_OKR.tsx"
import Modal from "./Modal.tsx"
import OkrList from "./OkrList.tsx"
import { useEffect, useState } from "react"
import type { OKR } from "../types/okr_form.types.ts"
import ChatBot from "./ChatBot.tsx"

const API_BASE = "http://localhost:3001"

type ConfirmState =
	| {
			kind: "objective"
			objectiveId: number
			title: string
			message: string
			confirmLabel?: string
	  }
	| {
			kind: "keyResult"
			objectiveId: number
			keyResultId: number
			title: string
			message: string
			confirmLabel?: string
	  }

const Home = () => {
	const [okrList, setOkrList] = useState<OKR[]>([])
	const [notice, setNotice] = useState<string | null>(null)
	const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)
	const [isChatOpen, setIsChatOpen] = useState(false)
	const [generatePrompt, setGeneratePrompt] = useState("")
	const [isGenerating, setIsGenerating] = useState(false)
	const totalObjectives = okrList.length
	const totalKeyResults = okrList.reduce(
		(sum, objective) => sum + (objective.keyResults?.length ?? 0),
		0,
	)
	const completedObjectives = okrList.filter((objective) => {
		const keyResults = objective.keyResults ?? []
		return (
			keyResults.length > 0 &&
			keyResults.every((keyResult) => {
				if (keyResult.isCompleted) return true
				if (
					!Number.isFinite(keyResult.targetValue) ||
					keyResult.targetValue <= 0
				)
					return false
				return (keyResult.updatedValue / keyResult.targetValue) * 100 >= 100
			})
		)
	}).length

	async function loadOkrs() {
		try {
			const res = await fetch(`${API_BASE}/objectives`)
			if (!res.ok) throw new Error(`Failed to load OKRs (${res.status}).`)
			const result = await res.json()
			setOkrList(result)
			setNotice(null)
		} catch (err) {
			setNotice(err instanceof Error ? err.message : String(err))
		}
	}

	useEffect(() => {
		loadOkrs()
	}, [])

	async function performDeleteObjective(objectiveId: number) {
		try {
			const res = await fetch(`${API_BASE}/objectives/${objectiveId}`, {
				method: "DELETE",
			})
			if (!res.ok) throw new Error(`Failed to delete OKR (${res.status}).`)
			setOkrList((prev) => prev.filter((o) => o.id !== objectiveId))
			setNotice(null)
		} catch (err) {
			setNotice(err instanceof Error ? err.message : String(err))
		}
	}

	function requestDeleteObjective(objectiveId: number) {
		setConfirmState({
			kind: "objective",
			objectiveId,
			title: "Delete OKR",
			message: "Delete this objective?",
			confirmLabel: "Delete",
		})
	}

	async function saveObjectiveTitle(
		objectiveId: number,
		title: string,
	): Promise<boolean> {
		const nextObjective = title.trim()
		if (!nextObjective) return false

		try {
			const res = await fetch(`${API_BASE}/objectives/${objectiveId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: nextObjective }),
			})
			if (!res.ok) throw new Error(`Failed to update OKR (${res.status}).`)

			setOkrList((prev) =>
				prev.map((o) =>
					o.id === objectiveId ? { ...o, title: nextObjective } : o,
				),
			)
			setNotice(null)
			return true
		} catch (err) {
			setNotice(err instanceof Error ? err.message : String(err))
			return false
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
			)

			const res = await fetch(
				`${API_BASE}/objective/${objectiveId}/key-results/${keyResultId}`,
				{
					method: "DELETE",
				},
			)
			if (!res.ok)
				throw new Error(`Failed to delete key result (${res.status}).`)
			setNotice(null)
		} catch (err) {
			setNotice(err instanceof Error ? err.message : String(err))
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
		})
	}

	async function updateKeyResult(
		objectiveId: number,
		keyResultId: number,
		updates: {
			updatedValue?: number
			targetValue?: number
			metric?: string
			isCompleted?: boolean
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
		)

		try {
			const res = await fetch(
				`${API_BASE}/objective/${objectiveId}/key-results/${keyResultId}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updates),
				},
			)
			if (!res.ok)
				throw new Error(`Failed to update key result (${res.status}).`)
			setNotice(null)
		} catch (err) {
			setNotice(err instanceof Error ? err.message : String(err))
			loadOkrs()
		}
	}

	async function handleConfirm(confirm: ConfirmState) {
		if (confirm.kind === "objective") {
			await performDeleteObjective(confirm.objectiveId)
			return
		}
		await performDeleteKeyResult(confirm.objectiveId, confirm.keyResultId)
	}

	async function generateObjective(close: () => void): Promise<void> {
		const prompt = generatePrompt.trim()
		if (!prompt) {
			setNotice("Please enter a prompt to generate an OKR.")
			return
		}

		setIsGenerating(true)
		try {
			const res = await fetch(`${API_BASE}/objectives/generate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt }),
			})

			if (!res.ok) {
				throw new Error(`Failed to generate OKR (${res.status}).`)
			}

			const createdObjective: OKR = await res.json()
			setOkrList((prev) => [
				...prev,
				{
					...createdObjective,
					keyResults: createdObjective.keyResults ?? [],
				},
			])
			setGeneratePrompt("")
			setNotice(null)
			close()
		} catch (err) {
			setNotice(err instanceof Error ? err.message : String(err))
		} finally {
			setIsGenerating(false)
		}
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
							<div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-2xl font-semibold uppercase tracking-wide text-teal-700">
								Eventually OKR
							</div>
							<h1 className="mt-3 text-md font-bold tracking-tight text-slate-900 sm:text-md">
								Build momentum, not just lists.
							</h1>
							<div className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
								Plan objectives, track user-defined metrics, and finish what
								matters with clear completion signals.
							</div>
						</div>
						<div className="w-full sm:w-auto">
							<div className="flex flex-col gap-2 sm:flex-row">
								<Modal
									triggerLabel="Add OKR"
									triggerVariant="primary"
									size="xl"
								>
									<EventuallyOkr setOkrList={setOkrList} apiBase={API_BASE} />
								</Modal>
								<Modal
									triggerLabel="Generate OKR"
									triggerVariant="secondary"
									size="md"
									title="Generate OKR"
								>
									{({ close }) => (
										<form
											onSubmit={(event) => {
												event.preventDefault()
												void generateObjective(close)
											}}
											className="glass-card flex flex-col gap-4 rounded-3xl p-5"
										>
											<div className="text-sm text-slate-600">
												Describe the objective in natural language. The backend
												will generate key results and create it.
											</div>
											<textarea
												value={generatePrompt}
												onChange={(event) =>
													setGeneratePrompt(event.target.value)
												}
												placeholder="Example: Increase trial-to-paid conversion to 20% by improving onboarding and reducing drop-offs."
												className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
											/>
											<div className="flex items-center justify-end gap-2">
												<button
													type="button"
													onClick={close}
													className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-slate-100"
												>
													Cancel
												</button>
												<button
													type="submit"
													disabled={isGenerating}
													className="rounded-full border border-teal-300 bg-teal-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
												>
													{isGenerating ? "Generating..." : "Generate"}
												</button>
											</div>
										</form>
									)}
								</Modal>
							</div>
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
					if (!open) setConfirmState(null)
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
									if (!confirmState) return
									void handleConfirm(confirmState)
									close()
								}}
								className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 cursor-pointer hover:bg-rose-50"
							>
								{confirmState?.confirmLabel ?? "Confirm"}
							</button>
						</div>
					</div>
				)}
			</Modal>
			<div className="fixed bottom-6 right-6 z-40">
				<button
					type="button"
					onClick={() => setIsChatOpen((prev) => !prev)}
					aria-label={isChatOpen ? "Close assistant" : "Open assistant"}
					title={isChatOpen ? "Close assistant" : "Open assistant"}
					className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-800"
				>
					{isChatOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-5 w-5"
							aria-hidden="true"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-5 w-5"
							aria-hidden="true"
						>
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						</svg>
					)}
				</button>
			</div>

			{isChatOpen ? (
				<>
					<button
						type="button"
						aria-label="Close chat panel overlay"
						onClick={() => setIsChatOpen(false)}
						className="fixed inset-0 z-40 bg-slate-900/20"
					/>
					<aside className="fixed right-0 top-0 z-50 h-dvh w-full max-w-md border-l border-slate-200 bg-white shadow-2xl">
						<ChatBot apiBase={API_BASE} onClose={() => setIsChatOpen(false)} />
					</aside>
				</>
			) : null}
		</div>
	)
}
export default Home
