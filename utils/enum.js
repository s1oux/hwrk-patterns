// Proxy usage
const READ_ONLY = () => {
  throw new Error("Can not modify read-only property.");
};

const READ_ONLY_HANDLER = {
  set: READ_ONLY,
  defineProperty: READ_ONLY,
  deleteProperty: READ_ONLY,
  preventExtension: READ_ONLY,
  setPrototypeOf: READ_ONLY
};

const readOnlyCreator = target => new Proxy(target, READ_ONLY_HANDLER);

const createEnum = (target) => readOnlyCreator(new Proxy(target, {
  get: (obj, prop) => {
    if (prop in obj) {
      return Reflect.get(obj, prop);
    }
    throw new ReferenceError(`Unknown property "${prop}"`);
  }
}));

export default createEnum;