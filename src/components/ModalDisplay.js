import { useModal } from '../contexts/ModalContext';
import { ModalComponents } from '../constants/ModalConstants';

export default function ModalDisplay() {
  const modal = useModal();

  if (modal.modalShowing && modal.modalType) {
    return ModalComponents[modal.modalType];
  }

  return (null);  
}