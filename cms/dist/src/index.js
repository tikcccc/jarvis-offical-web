"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slug_1 = require("./utils/slug");
function toDefaultLabel(field) {
    return field
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .trim()
        .replace(/^./, (char) => char.toUpperCase());
}
function getLayoutFields(configuration) {
    var _a, _b;
    const listFields = ((_a = configuration.layouts) === null || _a === void 0 ? void 0 : _a.list) || [];
    const editFields = (((_b = configuration.layouts) === null || _b === void 0 ? void 0 : _b.edit) || []).flatMap((row) => row.map((field) => field.name));
    return new Set([...listFields, ...editFields]);
}
function getAllowedFields(model, schema) {
    return new Set(Object.keys((model === null || model === void 0 ? void 0 : model.attributes) || (schema === null || schema === void 0 ? void 0 : schema.attributes) || {}));
}
function normalizeConfiguration(configuration, allowedFields) {
    var _a, _b, _c, _d;
    const sanitized = sanitizeConfiguration(configuration, allowedFields);
    const metadataFields = new Set([
        ...allowedFields,
        ...getLayoutFields(sanitized),
    ]);
    const metadatas = Object.fromEntries(Object.entries(sanitized.metadatas || {}).map(([field, metadata]) => {
        var _a, _b, _c, _d;
        const fallbackLabel = ((_a = metadata.list) === null || _a === void 0 ? void 0 : _a.label) || ((_b = metadata.edit) === null || _b === void 0 ? void 0 : _b.label) || toDefaultLabel(field);
        return [
            field,
            {
                ...metadata,
                edit: {
                    ...(metadata.edit || {}),
                    label: ((_c = metadata.edit) === null || _c === void 0 ? void 0 : _c.label) || fallbackLabel,
                },
                list: {
                    ...(metadata.list || {}),
                    label: ((_d = metadata.list) === null || _d === void 0 ? void 0 : _d.label) || fallbackLabel,
                },
            },
        ];
    }));
    for (const field of metadataFields) {
        const metadata = metadatas[field] || {};
        const fallbackLabel = ((_a = metadata.list) === null || _a === void 0 ? void 0 : _a.label) || ((_b = metadata.edit) === null || _b === void 0 ? void 0 : _b.label) || toDefaultLabel(field);
        metadatas[field] = {
            ...metadata,
            edit: {
                ...(metadata.edit || {}),
                label: ((_c = metadata.edit) === null || _c === void 0 ? void 0 : _c.label) || fallbackLabel,
            },
            list: {
                ...(metadata.list || {}),
                label: ((_d = metadata.list) === null || _d === void 0 ? void 0 : _d.label) || fallbackLabel,
            },
        };
    }
    return {
        ...sanitized,
        metadatas,
    };
}
function sanitizeConfiguration(configuration, allowedFields) {
    var _a, _b;
    const metadatas = Object.fromEntries(Object.entries(configuration.metadatas || {}).filter(([field]) => allowedFields.has(field)));
    const edit = (((_a = configuration.layouts) === null || _a === void 0 ? void 0 : _a.edit) || [])
        .map((row) => row.filter((field) => allowedFields.has(field.name)))
        .filter((row) => row.length > 0);
    const list = (((_b = configuration.layouts) === null || _b === void 0 ? void 0 : _b.list) || []).filter((field) => allowedFields.has(field));
    return {
        ...configuration,
        metadatas,
        layouts: {
            ...configuration.layouts,
            edit,
            list,
        },
    };
}
function mergeConfiguration(current, override) {
    const currentMetadatas = current.metadatas || {};
    const overrideMetadatas = override.metadatas || {};
    const metadatas = Object.entries(overrideMetadatas).reduce((acc, [field, metadata]) => {
        const existing = currentMetadatas[field] || {};
        acc[field] = {
            ...existing,
            ...(metadata || {}),
            edit: {
                ...(existing.edit || {}),
                ...(metadata.edit || {}),
            },
            list: {
                ...(existing.list || {}),
                ...(metadata.list || {}),
            },
        };
        return acc;
    }, { ...currentMetadatas });
    return {
        settings: {
            ...(current.settings || {}),
            ...(override.settings || {}),
        },
        metadatas,
        layouts: {
            ...(current.layouts || {}),
            ...(override.layouts || {}),
        },
    };
}
async function syncContentManagerLabels(strapi) {
    const contentTypeService = strapi.service('plugin::content-manager.content-types');
    const componentService = strapi.service('plugin::content-manager.components');
    for (const [uid, schema] of Object.entries(strapi.contentTypes)) {
        if (!uid.startsWith('api::'))
            continue;
        const model = contentTypeService.findContentType(uid);
        const schemaConfig = schema.config;
        const allowedFields = getAllowedFields(model, schema);
        if (!model || !schemaConfig)
            continue;
        const current = normalizeConfiguration(await contentTypeService.findConfiguration(model), allowedFields);
        const next = normalizeConfiguration(mergeConfiguration(current, schemaConfig), allowedFields);
        await contentTypeService.updateConfiguration(model, next);
    }
    for (const [uid, schema] of Object.entries(strapi.components)) {
        const model = componentService.findComponent(uid);
        const schemaConfig = schema.config;
        const allowedFields = getAllowedFields(model, schema);
        if (!model || !schemaConfig)
            continue;
        const current = normalizeConfiguration(await componentService.findConfiguration(model), allowedFields);
        const next = normalizeConfiguration(mergeConfiguration(current, schemaConfig), allowedFields);
        await componentService.updateConfiguration(model, next);
    }
}
function getSlugManagedModels(strapi) {
    return Object.entries(strapi.contentTypes)
        .filter(([uid, schema]) => {
        if (!uid.startsWith('api::'))
            return false;
        const attributes = schema.attributes;
        return Boolean(attributes === null || attributes === void 0 ? void 0 : attributes.slug);
    })
        .map(([uid]) => uid);
}
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({ strapi }) {
        strapi.customFields.register({
            name: 'localized-enum',
            type: 'enumeration',
            inputSize: {
                default: 4,
                isResizable: true,
            },
        });
    },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi }) {
        await syncContentManagerLabels(strapi);
        strapi.db.lifecycles.subscribe({
            models: getSlugManagedModels(strapi),
            async beforeCreate(event) {
                await (0, slug_1.applyManagedSlug)(strapi, {
                    action: 'beforeCreate',
                    model: event.model,
                    params: event.params,
                });
            },
            async beforeUpdate(event) {
                await (0, slug_1.applyManagedSlug)(strapi, {
                    action: 'beforeUpdate',
                    model: event.model,
                    params: event.params,
                });
            },
        });
    },
};
