import { useState } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const openModal = (data) => {
    setEditData(data);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal, editData };
};

export default useModal;
