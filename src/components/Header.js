import React from 'react';
import { AppBar, Toolbar, Grid, IconButton, Button, Typography, makeStyles } from '@material-ui/core';
import {
  BluetoothConnected,
  BluetoothSearching,
  BluetoothDisabled,
  Menu,
  PermIdentity,
} from '@material-ui/icons'
import { useAuth, AuthState } from '../contexts/AuthContext';
import { BLEConnectionState, useBLE } from '../contexts/BLEContext';
import { useGridStyles } from '../styles/useGridStyles';

const useHeaderStyles = makeStyles((theme) => ({
  appBar: {
    background: 'none',
    color: theme.palette.text.primary
  }
}));

export default function Header() {

  const gridStyles = useGridStyles();
  const headerStyles = useHeaderStyles();

  return (
    <AppBar position="fixed" className={headerStyles.appBar}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item><Typography>HikerLocker</Typography></Grid>
          <Grid item className={gridStyles.growItem}>
            <Grid container justifyContent="flex-end" alignItems="center">
              <HeaderBLETool/>
              <HeaderAuthTool/>
              <HeaderMenuTool/>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

function HeaderAuthTool() {

  const auth = useAuth();

  const onClickLogin = () => {
    auth.login();
  }

  const onClickLogout = () => {
    auth.logout();
  }

  if (auth.state === AuthState.Initializing) {
    return null;
  }

  return (
    auth.token
    ? <Grid item onClick={onClickLogout}><IconButton><PermIdentity/></IconButton></Grid>
    : <Grid item onClick={onClickLogin}><Button>Login</Button></Grid>
  );
}

const useHeaderBLEStyles = makeStyles((theme) => ({
  disconnected: {
    color: theme.palette.error.main
  },
  connecting: {
    color: theme.palette.warning.main
  },
  connected: {
    color: theme.palette.success.main
  }
}));

function HeaderBLETool() {
  
  const headerBLEStyles = useHeaderBLEStyles();

  const ble = useBLE();

  const onClickDisconnected = () => {
    ble.scanToConnect();
  }

  const onClickConnected = () => {
    ble.disconnect();
  }

  switch (ble.connectionState) {
    case BLEConnectionState.Disconnected:
      return <Grid item><IconButton onClick={onClickDisconnected}><BluetoothDisabled className={headerBLEStyles.disconnected}/></IconButton></Grid>
    case BLEConnectionState.Connecting:
      return <Grid item><IconButton><BluetoothSearching className={headerBLEStyles.connecting}/></IconButton></Grid>
    case BLEConnectionState.Connected:
      return <Grid item><IconButton onClick={onClickConnected}><BluetoothConnected  className={headerBLEStyles.connected}/></IconButton></Grid>
    default:
      return null;
  }
}

function HeaderMenuTool() {
  return <Grid item><IconButton><Menu/></IconButton></Grid>
}