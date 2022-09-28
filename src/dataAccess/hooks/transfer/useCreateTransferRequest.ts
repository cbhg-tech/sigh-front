import { useMutation } from 'react-query';
import {
  TransferController,
  ICreateTransfer,
} from '../../controllers/transfer.controller';

const transferController = new TransferController();

export function useCreateTransferRequest() {
  async function create(data: ICreateTransfer): Promise<void> {
    await transferController.create(data);
  }

  return useMutation(create);
}
