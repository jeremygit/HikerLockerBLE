import { Grid, Toolbar, makeStyles } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';
import { BLEConnectionState, useBLE } from '../contexts/BLEContext';
import ConnectedScreen from './ConnectedScreen';
import MainScreen from './MainScreen';

export const useScreenStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    height: '100%',
    minHeight: '100%',
    flexWrap: 'nowrap',
  },
  row: {
    width: '100%',
    position: 'relative',
  },
  base: {
    width: '100%',
    background: '#2b102a',
    flexGrow: 1,
  }
}));

export default function Screens() {
  
  const screenStyles = useScreenStyles();

  const auth = useAuth();

  return (
    <Grid container className={screenStyles.container}>
      {
        auth.token
        ? <ScreenRouter/>
        : <MainScreen/>
      }
    </Grid>
  );
}

function ScreenRouter() {
  
  const ble = useBLE();

  switch (ble.connectionState) {
    case BLEConnectionState.Connecting:
    case BLEConnectionState.Disconnected:
      return <MainScreen/>;
    case BLEConnectionState.Connected:
      return <ConnectedScreen/>;
    default:
      return null;
  }
}

export function ScreenSafeArea({children}) {

  const screenStyles = useScreenStyles();

  return (
    <>
      <Grid item className={screenStyles.row}>
        <Toolbar/>
      </Grid>
      <Grid item>
        {children}
      </Grid>
    </>
  );
}

