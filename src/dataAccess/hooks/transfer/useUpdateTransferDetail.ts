import { useMutation } from '@tanstack/react-query';
import { ITransfer } from '../../../types/Transfer';
import { TransferController } from '../../controllers/transfer.controller';

const transferController = new TransferController();

export function useUpdateTransferDetails() {
  async function update(data: ITransfer): Promise<void> {
    await transferController.update(data);
  }

  return useMutation(update);
}
