import { useModal } from '../contexts/ModalContext';
import { ModalComponents } from '../constants/ModalConstants';
import { Drawer } from '@material-ui/core';

export default function ModalDisplay() {
  const modal = useModal();

  if (modal.modalShowing && modal.modalType) {
    return ModalComponents[modal.modalType];
  }

  return (null);  
}

export function ModalLoadedDisplay({children, loaded}) {
  if (loaded) {
    return children();
  } else {
    return null;
  }
}

export function ModalContainer({ children, onCloseCallback}) {
  const modal = useModal();
  return (
    <Drawer
      anchor="bottom"
      open={true}
      onClose={() => {
        modal.hideModal();
        if (onCloseCallback) onCloseCallback();
      }}
    >
      { children }
    </Drawer>
  );
}