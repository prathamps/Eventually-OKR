import type { KeyResult } from "../types/okr_form.types.ts"
import { useContext } from "react"
import { KeyResultContext } from "../providers/KeyResultProvider.tsx"
type KeyResultList = {
	KeyResultsList: KeyResult[]
}
export const KeyResultList = () => {
	const { keyResultList } = useContext(KeyResultContext)
	return (
		<div className="overflow-hidden rounded-3xl border border-[#c7c7cc] bg-white/60">
			<ol className="divide-y divide-[#e5e5ea]">
				{keyResultList?.map((keyResult: KeyResult) => (
					<li
						key={keyResult.id}
						className="flex items-center justify-between gap-4 px-5 py-4"
					>
						<div className="min-w-0 text-base font-medium text-zinc-900">
							<div className="truncate">{keyResult.description}</div>
						</div>
						<div className="whitespace-nowrap tabular-nums text-base font-semibold text-zinc-600">
							{keyResult.progress}%
						</div>
					</li>
				))}
			</ol>
		</div>
	)
}
