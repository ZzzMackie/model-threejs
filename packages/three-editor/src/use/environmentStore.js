import { storeToRefs } from 'pinia';
import { useEnvironmentStore } from '@stores/environment.js';

export function useEnvironment() {
  const environment = useEnvironmentStore();
  return storeToRefs(environment);
}
