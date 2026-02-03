import { useContext } from "react";
import { KeyResultContext } from "../providers/KeyResultContext.tsx";
export const KeyResultList = () => {
  const { keyResultList, setKeyResultList } = useContext(KeyResultContext);
  return (
    <div className="overflow-hidden rounded-3xl border border-[#c7c7cc] bg-white/60">
      <ol className="divide-y divide-[#e5e5ea]">
        {keyResultList?.map((keyResult) => (
          <li
            key={keyResult.id}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0 text-base font-medium text-zinc-900">
              <div className="truncate">{keyResult.description}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="whitespace-nowrap tabular-nums text-base font-semibold text-zinc-600">
                {keyResult.progress}%
              </div>
              <button
                type="button"
                className="rounded-full border border-[#e5e5ea] px-3 py-1.5 text-sm font-semibold text-[#FF3B30] cursor-pointer hover:bg-[#f2f2f7]"
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
        ))}
      </ol>
    </div>
  );
};
