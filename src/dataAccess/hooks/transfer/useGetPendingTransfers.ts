import { useQuery } from '@tanstack/react-query';
import { TransferController } from '../../controllers/transfer.controller';

const transferController = new TransferController();

async function getPendingTransfers() {
  return transferController.getPending();
}

export function useGetPendingTransfers() {
  return useQuery(['getPendingTransfers'], () => getPendingTransfers(), {
    refetchOnWindowFocus: false,
  });
}
