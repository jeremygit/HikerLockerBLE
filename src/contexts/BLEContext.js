import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

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


const createBLEDevice = (primaryServiceUUID) => {

  let device = null;
  let deviceConnection = null;

  const request = async () => {
    try {
      device = await navigator.bluetooth.requestDevice({
        optionalServices: [ primaryServiceUUID ],
        acceptAllDevices: true,
      });
    } catch (err) {
      throw err;
    }
  }

  const connect = async (disconnectCallback) => {
    try {
      deviceConnection = await device.gatt.connect();
      device.addEventListener('gattserverdisconnected', () => {
        disconnect();
        if (disconnectCallback) disconnectCallback();
      });
    } catch (err) {
      throw err;
    }
  }

  const disconnect = () => {
    try {
      device?.gatt.disconnect();
      device = null;
      deviceConnection = null;
    } catch (err) {
      throw err;
    }
  }

  const scanAndConnect = async (disconnectCallback) => {
    try {
      await request();
      await connect(disconnectCallback);
    } catch (err) {
      throw new Error('BLE failed to scan and connect');
    }
  }

  const getCharacteristics = async () => {
    try {
      const primaryService = await deviceConnection.getPrimaryService(primaryServiceUUID);
      const characteristics = await primaryService.getCharacteristics();
      return characteristics;
    } catch (err) {
      throw err;
    }
  }

  const getCharacteristicByUUID = async (uuid) => {
    try {
      const characteristics = await getCharacteristics();
      const characteristic = characteristics.find(char => char.uuid === uuid);
      if (characteristic) {
        return characteristic;
      } else {
        throw new Error('BLE Characteristic not found.');
      }
    } catch (err) {
      throw err;
    }
  }

  return {
    request,
    connect,
    disconnect,
    scanAndConnect,
    getCharacteristics,
    getCharacteristicByUUID
  }
}

export default function BLEProvider({ children }) {

  const bleRef = useRef();
  
  const [error, setError] = useState('');
  const [connectionState, setConnectionState] = useState(BLEConnectionState.Disconnected);
  const [characteristicsState, setCharacteristicsState] = useState(BLEConnectionState.None);
  const [characteristics, setCharacteristics] = useState([]);
  const [transferState, setTransferState] = useState(BLETransferState.Idle);
  const [responseData, setResponseData] = useState('');

  useEffect(() => {
    bleRef.current = createBLEDevice(BLEPrimaryService);
  }, []);

  const disconnect = useCallback(() => {
    try {
      setConnectionState(BLEConnectionState.Disconnected);
      bleRef.current.disconnect();
    } catch (err) {
      return setError(err.message);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setConnectionState(BLEConnectionState.Connecting);
      await bleRef.current.scanAndConnect(() => {
        setConnectionState(BLEConnectionState.Disconnected);
      });
      setConnectionState(BLEConnectionState.Connected);
    } catch (err) {
      setConnectionState(BLEConnectionState.Disconnected);
      throw new Error('BLE could not connect.');
    }
  }, []);

  const refreshCharacteristics = useCallback(async () => {
    try {
      setCharacteristicsState(BLECharacteristicsState.Loading);
      const chars = await bleRef.current.getCharacteristics();
      setCharacteristics(chars);
      setCharacteristicsState(BLECharacteristicsState.Loaded);
    } catch (err) {
      // clear chars
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

  const handleBLEReadValueChanged = useCallback((evt) => {
    setTransferState(BLETransferState.Transferred);
    const decoder = new TextDecoder('utf-8');
    const jsonStr = decoder.decode(evt.target.value);
    const jsonData =  JSON.parse(jsonStr);
    // alert(JSON.stringify(jsonData));
    setResponseData(jsonData);
    setTransferState(BLETransferState.Idle);
    disconnect();
  }, [disconnect]);

  const logVisit = useCallback(async (data) => {
    setError('');
    try {
      setTransferState(BLETransferState.Transferring);
      setResponseData('');
      const char = await bleRef.current.getCharacteristicByUUID(BLECharacteristics.LogVisit);
      const userId = BLEEncodeString(data);
      char.oncharacteristicvaluechanged = handleBLEReadValueChanged;
      await char.writeValue(userId);
      await char.readValue();
    } catch (err) {
      setError(err.message);
      setTransferState(BLETransferState.Idle);
    }
  }, [handleBLEReadValueChanged]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const clearResponseData = useCallback(() => {
    setResponseData(null);
  }, []);

  return (
    <BLEContext.Provider
      value={{
        connectionState,
        characteristicsState,
        characteristics,
        transferState,
        responseData,
        error,
        scanToConnect,
        disconnect,
        logVisit,
        clearError,
        clearResponseData
      }}
    >
      { children }
    </BLEContext.Provider>
  );
}