"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    'content-type-builder': {
        enabled: env('NODE_ENV') !== 'production',
    },
});
