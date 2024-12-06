import { storeToRefs } from 'pinia';
import { useProjectStore } from '@stores/project.js';

export function useProject() {
  const project = useProjectStore();

  return storeToRefs(project);
}
