import { storeToRefs } from 'pinia';
import { useEditorStore } from '@stores/editor.js';

export function useEditor() {
  const editor = useEditorStore();
  return storeToRefs(editor);
}
