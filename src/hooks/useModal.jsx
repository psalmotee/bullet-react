import { useState } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export const useConfirmModal = () => {
  const [modal, setModal] = useState({
    isOpen: false,
    data: null,
  });

  const openModal = (data = null) => {
    setModal({ isOpen: true, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, data: null });
  };

  return {
    ...modal,
    openModal,
    closeModal,
  };
};