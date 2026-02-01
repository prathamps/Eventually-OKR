import { type ReactElement, useState } from "react";

interface ModalProps {
  children: ReactElement;
  isOpen?: boolean;
}



const Modal    = ({children , isOpen = false} : ModalProps) => {

  const [isModalOpen , setIsModalOpen] =useState(isOpen)

  if (!isModalOpen) {
    return (
      <button
        className={
          "mt-2 w-full rounded-2xl border border-[#e5e5ea] text-[#007AFF] px-6 py-3 text-base font-semibold "
        }
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Open Modal
      </button>
    );
  }


  const closeModal = () => {
    setIsModalOpen(false);
  }
  return (
    <div className="bg-gray-300/90 fixed  w-full ">
      <button
        className={
          "mt-2 w-full rounded-2xl shadow text-[#007AFF] px-6 py-3 text-base font-semibold bg-gray-200 cursor-pointer "
        }
        onClick={closeModal}
      >
        {" "}
        Close{" "}
      </button>
      {children}
    </div>
  );
};
export default Modal;
