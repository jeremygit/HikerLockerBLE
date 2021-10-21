import { Container, Box } from '@material-ui/core';
import { useBLE, BLETransferState } from '../../contexts/BLEContext';
import { useModal } from '../../contexts/ModalContext';
import { ModalContainer, ModalLoadedDisplay } from '../ModalDisplay';

export default function BLEResponseDataModal() {
  
  const ble = useBLE();
  const modal = useModal();

  return (
    <ModalLoadedDisplay loaded={ble.transferState === BLETransferState.Idle}>
      { () => (
          <ModalContainer
            onClose={() => {
              modal.hideModal();
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
      ) }
    </ModalLoadedDisplay>
  );
}