import { useQuery } from '@tanstack/react-query';
import { TransferController } from '../../controllers/transfer.controller';

const transferController = new TransferController();

export function useGetAllTransfers() {
  async function getAllTransfers() {
    return transferController.getAll();
  }

  return useQuery(['getPendingTransfers'], () => getAllTransfers(), {
    refetchOnWindowFocus: false,
  });
}
