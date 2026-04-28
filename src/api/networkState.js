let setBackendDownGlobal = null;

export const registerBackendHandler = (fn) => {
  setBackendDownGlobal = fn;
};

export const triggerBackendDown = () => {
  if (setBackendDownGlobal) {
    setBackendDownGlobal(true);
  }
};

export const clearBackendDown = () => {
  if (setBackendDownGlobal) {
    setBackendDownGlobal(false);
  }
};