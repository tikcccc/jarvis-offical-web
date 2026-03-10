"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const READ_ONLY_MESSAGE = "Contact submissions are immutable and can only be viewed.";
const CREATE_BLOCKED_MESSAGE = "Contact submissions can only be created from the website contact form.";
exports.default = {
    beforeCreate() {
        var _a, _b;
        const request = (_a = strapi.requestContext.get()) === null || _a === void 0 ? void 0 : _a.request;
        if ((_b = request === null || request === void 0 ? void 0 : request.url) === null || _b === void 0 ? void 0 : _b.startsWith("/content-manager")) {
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
