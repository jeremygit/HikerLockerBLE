import { Container, Box } from '@material-ui/core';
import { useBLE, BLETransferState } from '../../contexts/BLEContext';
import { ModalContainer } from '../ModalDisplay';

export default function BLEResponseDataModal() {
  
  const ble = useBLE();

  if (ble.transferState === BLETransferState.Idle) {
    return (
      <ModalContainer
        onClose={() => {
          ble.clearResponseData();
        }}
      >
        <Container>
          <Box>
            <Box>User ID: {ble.responseData.userVisits[0]}</Box>
            <Box>Marker ID: {ble.responseData.markerId}</Box>
          </Box>
        </Container>
      </ModalContainer>
    );
  }

  return null;
}