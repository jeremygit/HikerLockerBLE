import { Drawer, Container, Box } from '@material-ui/core';
import { useBLE, BLETransferState } from '../../contexts/BLEContext';
import { useModal } from '../../contexts/ModalContext';

export default function BLEResponseDataModal() {
  
  const ble = useBLE();
  const modal = useModal();

  return (
    <Drawer
      anchor="bottom"
      open={true}
      onClose={() => {
        modal.hideModal();
        ble.clearResponseData();
      }}
    >
      <Container>
        {
          ble.transferState === BLETransferState.Idle
          && ble.responseData
          ? <Box>
              <Box>User ID: {ble.responseData.userVisits[0]}</Box>
              <Box>Marker ID: {ble.responseData.markerId}</Box>
            </Box>
          : <Box>Loading...</Box>
        }
      </Container>
    </Drawer>
  );
}