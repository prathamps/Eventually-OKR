import { useContext } from "react"
import { KeyResultContext } from "../providers/KeyResultContext.tsx"
export const KeyResultList = () => {
	const { keyResultList, setKeyResultList } = useContext(KeyResultContext)

	const getProgress = (updatedValue: number, targetValue: number) => {
		if (!Number.isFinite(updatedValue) || !Number.isFinite(targetValue)) {
			return 0
		}
		if (targetValue <= 0) return 0
		return Math.round((updatedValue / targetValue) * 100)
	}

	return (
		<div className="glass-card overflow-hidden rounded-3xl">
			<ol className="divide-y divide-[#e5e5ea]">
				{keyResultList?.map((keyResult, index) => {
					let bg_color = "bg-amber-200"
					if (index % 2) {
						bg_color = "bg-amber-50/85"
					}
					const progress = getProgress(
						keyResult.updatedValue,
						keyResult.targetValue,
					)
					const valueText = `${keyResult.updatedValue}/${keyResult.targetValue} ${keyResult.metric}`
					return (
						<li
							key={keyResult.id}
							className={`flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 ${bg_color}`}
						>
							<div className="min-w-0 text-base font-medium text-zinc-900">
								<div className="truncate">{keyResult.description}</div>
								<div className="text-sm text-zinc-500 truncate ml-1.5">
									{valueText}
								</div>
							</div>
							<div className="flex items-center justify-between gap-3 sm:justify-end">
								<div className="whitespace-nowrap tabular-nums text-base font-semibold text-zinc-600">
									{progress}%
								</div>
								<button
									type="button"
									className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-sm font-semibold text-rose-700 cursor-pointer hover:bg-rose-50"
									onClick={() =>
										setKeyResultList(
											keyResultList.filter((kr) => kr.id !== keyResult.id),
										)
									}
								>
									Delete
								</button>
							</div>
						</li>
					)
				})}
			</ol>
		</div>
	)
}
