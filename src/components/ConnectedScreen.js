import { Grid, makeStyles, Card, CardContent, Typography } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';
import { BLECharacteristics, useBLE } from '../contexts/BLEContext';
import { useModal, ModalTypes } from '../contexts/ModalContext';
import { BLECharacteristicsMenuTitles, BLECharacteristicsIcons } from '../constants/BLEConstants';
import { ScreenSafeArea } from './Screens';

const useConnectedScreenStyle = makeStyles(theme => ({
  characteristicItem: {
    margin: '1rem',
  }
}));

export default function ConnectedScreen() {
  
  const connectedScreenStyles = useConnectedScreenStyle();

  const modal = useModal();
  const ble = useBLE();
  const auth = useAuth();

  const menuBackgroundColors = [
    '#fc7d48',
    '#ef4335',
    '#c9223e'
  ];

  const performCharacteristic = (char) => {
    switch (char) {
      case BLECharacteristics.LogVisit:
        ble.logVisit(auth.token);
        break;
      default: // do nothing
    }
  }

  const onClickCharacteristic = (char) => () => {
    performCharacteristic(char);
    modal.showModal(ModalTypes.BLEResponseData);
  }

  return (
    <ScreenSafeArea>
      <Grid container>
        <Grid item xs={12} >
        {Object.entries(BLECharacteristics).map(([key, char], i) => {
          return (
            <Card 
              key={char}
              className={connectedScreenStyles.characteristicItem}
              style={{
                background: menuBackgroundColors[i],
              }}
              onClick={onClickCharacteristic(char)}
            >
              <CardContent style={{textAlign: 'left'}}>
                <Typography variant="body1">{ BLECharacteristicsIcons[char] }</Typography>
                <Typography variant="h5">{ BLECharacteristicsMenuTitles[char] }</Typography>
              </CardContent>
            </Card>
          );
        })}
        </Grid>
      </Grid>
    </ScreenSafeArea>
  );
}