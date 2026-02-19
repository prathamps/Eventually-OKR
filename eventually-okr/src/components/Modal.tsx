import { type ReactNode, useState } from "react";
import { createPortal } from "react-dom";

type ModalRenderProps = {
  close: () => void;
};

type ModalSize = "sm" | "md" | "lg" | "xl";
type TriggerVariant = "primary" | "secondary";

interface ModalProps {
  children: ReactNode | ((props: ModalRenderProps) => ReactNode);
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  triggerLabel?: string;
  title?: string;
  hideTrigger?: boolean;
  size?: ModalSize;
  triggerVariant?: TriggerVariant;
}

const Modal = ({
  children,
  isOpen,
  onOpenChange,
  triggerLabel = "Add OKR",
  title = "New OKR",
  hideTrigger = false,
  size = "md",
  triggerVariant = "secondary",
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
    const triggerClassName =
      triggerVariant === "primary"
        ? "w-full sm:w-auto rounded-full border border-teal-300 bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm cursor-pointer transition hover:bg-teal-700"
        : "w-full sm:w-auto rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm cursor-pointer transition hover:bg-slate-100";

    return (
      <button
        className={triggerClassName}
        type="button"
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

  const maxWidthClass = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  }[size];

  const content =
    typeof children === "function" ? children({ close: closeModal }) : children;
  const modalElement = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-3 sm:p-4 sm:items-center"
      onClick={closeModal}
    >
      <div
        className={`glass-card my-2 flex max-h-[92dvh] w-full flex-col ${maxWidthClass} rounded-3xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
          <div className="text-lg font-semibold text-zinc-900">{title}</div>
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-zinc-700 cursor-pointer hover:bg-slate-100"
            onClick={closeModal}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto p-2 sm:p-4">{content}</div>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
};
export default Modal;
