import BLEProvider from '../contexts/BLEContext';

export function Providers({ children }) {
  return (
    <BLEProvider>
      { children }
    </BLEProvider>
  );
}
