import { createContext, useCallback, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalTypes = {
  BLEResponseData: 'BLEResponseData'
}

export default function ModalProvider({children}) {

  const [modalShowing, setModalShowing] = useState(false);
  const [modalType, setModalType] = useState();
  
  const showModal = useCallback((type) => {
    setModalType(type);
    setModalShowing(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalShowing(false);  
    setModalType(null);  
  }, []);

  return (
    <ModalContext.Provider value={{
      modalShowing,
      modalType,
      showModal,
      hideModal
    }}>
      {children}
    </ModalContext.Provider>
  );
}