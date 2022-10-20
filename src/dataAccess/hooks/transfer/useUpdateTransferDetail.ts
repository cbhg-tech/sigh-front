import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ITransfer } from '../../../types/Transfer';
import { TransferController } from '../../controllers/transfer.controller';

const transferController = new TransferController();

export function useUpdateTransferDetails() {
  const queryClient = useQueryClient();

  async function update(data: ITransfer): Promise<void> {
    await transferController.update(data);

    await queryClient.invalidateQueries(['getOneTransfer']);
  }

  return useMutation(update);
}
