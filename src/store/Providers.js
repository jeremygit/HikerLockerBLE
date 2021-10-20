import BLEProvider from '../contexts/BLEContext';
import ModalProvider from '../contexts/ModalContext';

export function Providers({ children }) {
  return (
    <ModalProvider>
    <BLEProvider>
      { children }
    </BLEProvider>
    </ModalProvider>
  );
}
