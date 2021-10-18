import { BLECharacteristics } from '../contexts/BLEContext';
import { AssistantPhoto, MobileFriendly, PhonelinkErase } from '@material-ui/icons';

export const BLECharacteristicsMenuTitles = {
  [BLECharacteristics.LogVisit]: 'Log visit.',
  [BLECharacteristics.CheckIn]: 'Check-in.',
  [BLECharacteristics.CheckOut]: 'Check-out.'
}

export const BLECharacteristicsIcons = {
  [BLECharacteristics.LogVisit]: <AssistantPhoto/>,
  [BLECharacteristics.CheckIn]: <MobileFriendly/>,
  [BLECharacteristics.CheckOut]: <PhonelinkErase/>
}