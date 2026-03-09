const READ_ONLY_MESSAGE = "Contact submissions are immutable and can only be viewed.";

export default {
  beforeUpdate() {
    throw new Error(READ_ONLY_MESSAGE);
  },
  beforeDelete() {
    throw new Error(READ_ONLY_MESSAGE);
  },
  beforeUpdateMany() {
    throw new Error(READ_ONLY_MESSAGE);
  },
  beforeDeleteMany() {
    throw new Error(READ_ONLY_MESSAGE);
  },
};
