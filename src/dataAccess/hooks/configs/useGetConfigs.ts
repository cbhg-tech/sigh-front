import { useQuery } from '@tanstack/react-query';
import { ConfigsController } from '../../controllers/configs.controller';

const configsController = new ConfigsController();

export function useGetCurrentConfigs() {
  async function getConfigs() {
    return configsController.get();
  }

  return useQuery(['getConfigs'], () => getConfigs(), {
    refetchOnWindowFocus: false,
  });
}
