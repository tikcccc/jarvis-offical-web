const READ_ONLY_MESSAGE = "Contact submissions are immutable and can only be viewed.";
const CREATE_BLOCKED_MESSAGE =
  "Contact submissions can only be created from the website contact form.";

export default {
  beforeCreate() {
    const request = strapi.requestContext.get()?.request;
    if (request?.url?.startsWith("/content-manager")) {
      throw new Error(CREATE_BLOCKED_MESSAGE);
    }
  },
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
