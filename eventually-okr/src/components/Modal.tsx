import { type ReactNode, useState } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  triggerLabel?: string;
}

const Modal = ({
  children,
  isOpen = false,
  triggerLabel = "Add OKR",
}: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  if (!isModalOpen) {
    return (
      <button
        className={
          "rounded-full border border-[#e5e5ea] bg-white/70 text-[#007AFF] px-5 py-2 text-base font-semibold shadow-sm cursor-pointer transition hover:bg-white"
        }
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {triggerLabel}
      </button>
    );
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-3xl border border-[#e5e5ea] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e5e5ea] px-5 py-4">
          <div className="text-lg font-semibold text-zinc-900">New OKR</div>
          <button
            className="rounded-full border border-[#e5e5ea] px-4 py-2 text-base font-semibold text-zinc-700 cursor-pointer hover:bg-[#f2f2f7]"
            onClick={closeModal}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="p-2 sm:p-4">{children}</div>
      </div>
    </div>
  );
};
export default Modal;
