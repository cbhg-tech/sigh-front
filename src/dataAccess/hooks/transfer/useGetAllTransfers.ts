import { useQuery } from '@tanstack/react-query';
import { TransferController } from '../../controllers/transfer.controller';

const transferController = new TransferController();

async function getAllTransfers() {
  return transferController.getAll();
}

export function useGetAllTransfers() {
  return useQuery(['getAllTransfers'], () => getAllTransfers(), {
    refetchOnWindowFocus: false,
  });
}
