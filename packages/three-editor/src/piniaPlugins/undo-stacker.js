export default function createStack(current) {
  const stack = [current];
  let index = stack.length;
  function update() {
    current = stack[index - 1];
    return current;
  }

  const canUndo = () => {
    return index > 1;
  };
  const canRedo = () => {
    return index < stack.length;
  };
  const getIndex = () => {
    return index;
  };
  return {
    stack,
    push: value => {
      stack.length = index;
      stack[index++] = typeof value === 'function' ? value(current) : value;
      return update();
    },
    undo: () => {
      if (canUndo()) index -= 1;
      return update();
    },
    redo: () => {
      if (canRedo()) index += 1;
      return update();
    },
    canUndo,
    canRedo,
    getIndex
  };
}
