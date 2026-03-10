"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyManagedSlug = void 0;
const utils_1 = require("@strapi/utils");
const { ValidationError } = utils_1.errors;
const SLUG_FIELD = 'slug';
const SEQUENCE_STORE_KEY = 'slug-sequences';
const FALLBACK_PREFIX = 'entry';
function normalizeSlugPart(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}
function extractRecordId(where) {
    const id = where === null || where === void 0 ? void 0 : where.id;
    if (typeof id === 'number' || typeof id === 'string') {
        return id;
    }
    if (id &&
        typeof id === 'object' &&
        '$eq' in id) {
        const value = id.$eq;
        if (typeof value === 'number' || typeof value === 'string') {
            return value;
        }
    }
    return undefined;
}
function extractDocumentId(value) {
    const raw = value === null || value === void 0 ? void 0 : value.documentId;
    if (typeof raw === 'string' && raw.trim() !== '') {
        return raw;
    }
    if (raw &&
        typeof raw === 'object' &&
        '$eq' in raw) {
        const resolved = raw.$eq;
        if (typeof resolved === 'string' && resolved.trim() !== '') {
            return resolved;
        }
    }
    return undefined;
}
function getSlugPrefix(model) {
    const rawPrefix = model.singularName || model.uid.split('.').pop() || FALLBACK_PREFIX;
    return normalizeSlugPart(rawPrefix) || FALLBACK_PREFIX;
}
function getSequenceStore(strapi) {
    return strapi.store({
        type: 'plugin',
        name: 'jarvis-cms',
    });
}
async function getSequenceState(strapi) {
    const stored = await getSequenceStore(strapi).get({ key: SEQUENCE_STORE_KEY });
    return (stored !== null && stored !== void 0 ? stored : {});
}
async function setSequenceState(strapi, value) {
    await getSequenceStore(strapi).set({
        key: SEQUENCE_STORE_KEY,
        value,
    });
}
async function slugExists(strapi, tableName, slug, identity) {
    const query = strapi.db.getConnection(tableName).select('id').where(SLUG_FIELD, slug);
    if (identity === null || identity === void 0 ? void 0 : identity.documentId) {
        query.whereNot('document_id', identity.documentId);
    }
    if ((identity === null || identity === void 0 ? void 0 : identity.id) !== undefined) {
        query.whereNot('id', identity.id);
    }
    const existing = await query.first();
    return Boolean(existing);
}
async function assertUniqueSlug(strapi, model, slug, identity) {
    if (await slugExists(strapi, model.tableName, slug, identity)) {
        throw new ValidationError(`URL 标识 "${slug}" 已存在，请改用其它值。`);
    }
}
async function generateAutomaticSlug(strapi, model, identity) {
    const prefix = getSlugPrefix(model);
    const state = await getSequenceState(strapi);
    let sequence = Number.isFinite(state[model.uid]) ? state[model.uid] : 0;
    let candidate = '';
    do {
        sequence += 1;
        candidate = `${prefix}-${sequence}`;
    } while (await slugExists(strapi, model.tableName, candidate, identity));
    if (state[model.uid] !== sequence) {
        await setSequenceState(strapi, {
            ...state,
            [model.uid]: sequence,
        });
    }
    return candidate;
}
function normalizeManualSlug(value) {
    const normalized = normalizeSlugPart(value);
    if (!normalized) {
        throw new ValidationError('URL 标识仅支持英文字母、数字与连字符。');
    }
    return normalized;
}
async function applyManagedSlug(strapi, event) {
    var _a;
    if (!((_a = event.model.attributes) === null || _a === void 0 ? void 0 : _a[SLUG_FIELD]) || !event.params.data) {
        return;
    }
    const { data, where } = event.params;
    const identity = {
        id: extractRecordId(where),
        documentId: extractDocumentId(where) || extractDocumentId(data),
    };
    const rawSlug = data[SLUG_FIELD];
    const hasManualSlug = typeof rawSlug === 'string';
    const shouldAutoGenerate = event.action === 'beforeCreate'
        ? !hasManualSlug || rawSlug.trim() === ''
        : hasManualSlug && rawSlug.trim() === '';
    if (shouldAutoGenerate) {
        data[SLUG_FIELD] = await generateAutomaticSlug(strapi, event.model, identity);
        return;
    }
    if (!hasManualSlug) {
        return;
    }
    const normalized = normalizeManualSlug(rawSlug);
    await assertUniqueSlug(strapi, event.model, normalized, identity);
    data[SLUG_FIELD] = normalized;
}
exports.applyManagedSlug = applyManagedSlug;
