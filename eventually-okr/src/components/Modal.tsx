import { type ReactNode, useState } from "react";

type ModalRenderProps = {
  close: () => void;
};

interface ModalProps {
  children: ReactNode | ((props: ModalRenderProps) => ReactNode);
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  triggerLabel?: string;
  title?: string;
  hideTrigger?: boolean;
}

const Modal = ({
  children,
  isOpen,
  onOpenChange,
  triggerLabel = "Add OKR",
  title = "New OKR",
  hideTrigger = false,
}: ModalProps) => {
  const isControlled = typeof isOpen === "boolean";
  const [isModalOpen, setIsModalOpen] = useState(isOpen ?? false);
  const modalOpen = isControlled ? isOpen : isModalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setIsModalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  if (!modalOpen) {
    if (hideTrigger) return null;
    return (
      <button
        className={
          "rounded-full border border-[#e5e5ea] bg-white/70 text-[#007AFF] px-5 py-2 text-base font-semibold shadow-sm cursor-pointer transition hover:bg-white"
        }
        onClick={() => {
          setOpen(true);
        }}
      >
        {triggerLabel}
      </button>
    );
  }

  const closeModal = () => {
    setOpen(false);
  };
  const content =
    typeof children === "function" ? children({ close: closeModal }) : children;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-3xl border border-[#e5e5ea] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e5e5ea] px-5 py-4">
          <div className="text-lg font-semibold text-zinc-900">{title}</div>
          <button
            className="rounded-full border border-[#e5e5ea] px-4 py-2 text-base font-semibold text-zinc-700 cursor-pointer hover:bg-[#f2f2f7]"
            onClick={closeModal}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="p-2 sm:p-4">{content}</div>
      </div>
    </div>
  );
};
export default Modal;
