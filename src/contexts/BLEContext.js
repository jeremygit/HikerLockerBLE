import { createContext, useCallback, useContext, useRef, useState } from 'react';

// Helpers
const BLEEncodeString = (str) => {
  return new TextEncoder('utf-8').encode(`${str}`);
}

export const BLEPrimaryService = 'FFFFFFFF-EEEE-EEEE-EEEE-DDDDDDDDDDDD'.toLowerCase();

export const BLEConnectionState = {
  Disconnected: 0,
  Connecting: 1,
  Connected: 2
}

export const BLECharacteristicsState = {
  None: 0,
  Loaded: 1,
  Loading: 2
}

export const BLETransferState = {
  Idle: 0,
  Transferring: 1,
  Transferred: 2,
}

export const BLECharacteristics = {
  CheckIn: 'ffffffff-eeee-eeee-eeee-dddd00000002',
  CheckOut: 'ffffffff-eeee-eeee-eeee-dddd00000003',
  LogVisit: 'ffffffff-eeee-eeee-eeee-dddd00000001'
}

const BLEContext = createContext();

export const useBLE = () => useContext(BLEContext);

export default function BLEProvider({ children }) {

  const deviceRef = useRef();
  const deviceServerRef = useRef();
  const primaryServiceRef = useRef();
  
  const [error, setError] = useState('');
  const [connectionState, setConnectionState] = useState(BLEConnectionState.Disconnected);
  const [characteristicsState, setCharacteristicsState] = useState(BLEConnectionState.None);
  const [characteristics, setCharacteristics] = useState([]);
  const [transferState, setTransferState] = useState(BLETransferState.Idle);
  const [responseData, setResponseData] = useState('');

  const disconnect = useCallback(() => {
    if (deviceRef.current) {
      setConnectionState(BLEConnectionState.Disconnected);
      deviceRef.current.gatt.disconnect();
      primaryServiceRef.current = null;
      deviceServerRef.current = null;
      deviceRef.current = null;
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setConnectionState(BLEConnectionState.Connecting);

      deviceRef.current = await navigator.bluetooth.requestDevice({
        optionalServices: [ BLEPrimaryService ],
        acceptAllDevices: true,
      });

      deviceRef.current.addEventListener('gattserverdisconnected', () => {
        disconnect();
      });
  
      deviceServerRef.current = await deviceRef.current.gatt.connect();
      primaryServiceRef.current = await deviceServerRef.current.getPrimaryService(BLEPrimaryService);
 
      setConnectionState(BLEConnectionState.Connected);
    } catch (err) {
      setConnectionState(BLEConnectionState.Disconnected);
      throw new Error('BLE could not connect.');
    }
  }, [disconnect]);

  const refreshCharacteristics = useCallback(async () => {
    if (primaryServiceRef.current) {
      setCharacteristicsState(BLECharacteristicsState.Loading);
      const chars = await primaryServiceRef.current.getCharacteristics();
      setCharacteristics(chars);
      setCharacteristicsState(BLECharacteristicsState.Loaded);
    } else {
      setCharacteristics([]);
      setCharacteristicsState(BLECharacteristicsState.None);
      throw new Error('BLE could not get characteristics.');
    }
  }, []);

  const scanToConnect = useCallback(async () => {
    setError('');
    try {
      await connect();
    } catch (err) {
      return setError(err.message);
    }
    try {
      await refreshCharacteristics();
    } catch (err) {
      return setError(err.message);
    }
  }, [connect, refreshCharacteristics]);

  const getCharacteristic = useCallback((uuid) => {
    return characteristics.find((char) => char.uuid === uuid);
  }, [characteristics]);

  const handleBLEReadValueChanged = useCallback((evt) => {
    setTransferState(BLETransferState.Transferred);
    const decoder = new TextDecoder('utf-8');
    const jsonStr = decoder.decode(evt.target.value);
    const jsonData =  JSON.parse(jsonStr);
    alert(JSON.stringify(jsonData));
    setResponseData(jsonData);
    setTransferState(BLETransferState.Idle);
    disconnect();
  }, [disconnect]);

  const logVisit = useCallback(async (data) => {
    setError('');
    try {
      setTransferState(BLETransferState.Transferring);
      setResponseData('');
      const char = getCharacteristic(BLECharacteristics.LogVisit);
      if (!char) throw new Error('Log Visit characteristic not found');
      const userId = BLEEncodeString(data);
      char.oncharacteristicvaluechanged = handleBLEReadValueChanged;
      await char.writeValue(userId);
      await char.readValue();
    } catch (err) {
      setError(err.message);
      setTransferState(BLETransferState.Idle);
    }
  }, [getCharacteristic, handleBLEReadValueChanged]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return (
    <BLEContext.Provider
      value={{
        connectionState,
        characteristicsState,
        transferState,
        responseData,
        error,
        scanToConnect,
        disconnect,
        logVisit,
        clearError
      }}
    >
      { children }
    </BLEContext.Provider>
  )
}