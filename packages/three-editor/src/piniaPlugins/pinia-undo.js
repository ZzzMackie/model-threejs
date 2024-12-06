// src/index.ts
import createStack from './undo-stacker.js';
const removeOmittedKeys = (options, store, serializer = { serialize: JSON.stringify, deserialize: JSON.parse }) => {
  const clone = serializer.deserialize(serializer.serialize(store.$state));
  if (options.undo && options.undo.omit) {
    options.undo.omit.forEach(key => {
      delete clone[key];
    });
    return clone;
  }
  return clone;
};

const PiniaUndo = ({ store, options = {}, serializer }) => {
  if (options.undo && options.undo.disable) return;
  let stack = createStack(removeOmittedKeys(options, store, serializer));
  store.stack = stack;
  let changeKeyStack = createStack(removeOmittedKeys(options, store, serializer));
  store.changeKeyStack = changeKeyStack;
  store.preventUpdateOnSubscribe = false;
  store.undo = () => {
    store.preventUpdateOnSubscribe = true;
    const undoStore = stack.undo();
    const changeKeyStore = changeKeyStack.undo();
    store.$patch(undoStore);
    return changeKeyStore;
  };
  store.redo = () => {
    store.preventUpdateOnSubscribe = true;
    const changeKeyStore = changeKeyStack.redo();
    store.$patch(stack.redo());
    return changeKeyStore;
  };
  store.resetStack = () => {
    stack = createStack(removeOmittedKeys(options, store, serializer));
    changeKeyStack = createStack({});
    store.stack = stack;
    store.changeKeyStack = changeKeyStack;
  };
  store.$subscribe(
    newVal => {
      if (store.preventUpdateOnSubscribe) {
        store.preventUpdateOnSubscribe = false;
        return;
      }
      changeKeyStack.push(newVal);
      stack.push(removeOmittedKeys(options, store, serializer));
    },
    {
      flush: 'sync'
    }
  );
};
export { PiniaUndo };
