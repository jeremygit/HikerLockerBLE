import { Grid, makeStyles, Button } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';
import { BLEConnectionState, useBLE } from '../contexts/BLEContext';
import SVGBackground from './SVGBackground';
import { useScreenStyles } from './Screens';

const useMainScreenStyles = makeStyles(theme => ({
  buttonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '150px',
    height: '150px',
    borderRadius: '100%',
    background: '#fed8c1',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  }
}));

export default function MainScreen() {

  const screenStyles = useScreenStyles();
  const mainScreenStyles = useMainScreenStyles();

  const ble = useBLE();
  const auth = useAuth();

  const onClickConnect = () => {
    ble.scanToConnect();
  }

  const onClickLogin = () => {
    auth.login();
  }

  return (
    <>
      <Grid item className={screenStyles.row}>
        <SVGBackground/>
        <div className={mainScreenStyles.buttonContainer}>
          {
            auth.token
            ? <Button className={mainScreenStyles.button} onClick={onClickConnect} disabled={ble.connectionState === BLEConnectionState.Connecting}>Scan Marker</Button>
            : <Button className={mainScreenStyles.button} onClick={onClickLogin}>Login to Begin</Button>
          }
        </div>
      </Grid>
      <Grid item className={screenStyles.base}/>
    </>
  );
}