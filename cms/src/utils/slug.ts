import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const { ValidationError } = errors;

const SLUG_FIELD = 'slug';
const SEQUENCE_STORE_KEY = 'slug-sequences';
const FALLBACK_PREFIX = 'entry';

type LifecycleAction = 'beforeCreate' | 'beforeUpdate';

type LifecycleEvent = {
  action: LifecycleAction;
  model: {
    uid: string;
    tableName: string;
    singularName?: string;
    attributes?: Record<string, unknown>;
  };
  params: {
    data?: Record<string, unknown>;
    where?: Record<string, unknown>;
  };
};

type SequenceState = Record<string, number>;
type RecordIdentity = {
  id?: number | string;
  documentId?: string;
};

function normalizeSlugPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function extractRecordId(where?: Record<string, unknown>): number | string | undefined {
  const id = where?.id;

  if (typeof id === 'number' || typeof id === 'string') {
    return id;
  }

  if (
    id &&
    typeof id === 'object' &&
    '$eq' in id
  ) {
    const value = (id as { $eq?: unknown }).$eq;

    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }
  }

  return undefined;
}

function extractDocumentId(value?: Record<string, unknown>): string | undefined {
  const raw = value?.documentId;

  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw;
  }

  if (
    raw &&
    typeof raw === 'object' &&
    '$eq' in raw
  ) {
    const resolved = (raw as { $eq?: unknown }).$eq;

    if (typeof resolved === 'string' && resolved.trim() !== '') {
      return resolved;
    }
  }

  return undefined;
}

function getSlugPrefix(model: LifecycleEvent['model']): string {
  const rawPrefix = model.singularName || model.uid.split('.').pop() || FALLBACK_PREFIX;
  return normalizeSlugPart(rawPrefix) || FALLBACK_PREFIX;
}

function getSequenceStore(strapi: Core.Strapi) {
  return strapi.store({
    type: 'plugin',
    name: 'jarvis-cms',
  });
}

async function getSequenceState(strapi: Core.Strapi): Promise<SequenceState> {
  const stored = await getSequenceStore(strapi).get({ key: SEQUENCE_STORE_KEY });
  return (stored ?? {}) as SequenceState;
}

async function setSequenceState(strapi: Core.Strapi, value: SequenceState) {
  await getSequenceStore(strapi).set({
    key: SEQUENCE_STORE_KEY,
    value,
  });
}

async function slugExists(
  strapi: Core.Strapi,
  tableName: string,
  slug: string,
  identity?: RecordIdentity
) {
  const query = strapi.db.getConnection(tableName).select('id').where(SLUG_FIELD, slug);

  if (identity?.documentId) {
    query.whereNot('document_id', identity.documentId);
  }

  if (identity?.id !== undefined) {
    query.whereNot('id', identity.id);
  }

  const existing = await query.first();
  return Boolean(existing);
}

async function assertUniqueSlug(
  strapi: Core.Strapi,
  model: LifecycleEvent['model'],
  slug: string,
  identity?: RecordIdentity
) {
  if (await slugExists(strapi, model.tableName, slug, identity)) {
    throw new ValidationError(`URL 标识 "${slug}" 已存在，请改用其它值。`);
  }
}

async function generateAutomaticSlug(
  strapi: Core.Strapi,
  model: LifecycleEvent['model'],
  identity?: RecordIdentity
) {
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

function normalizeManualSlug(value: string) {
  const normalized = normalizeSlugPart(value);

  if (!normalized) {
    throw new ValidationError('URL 标识仅支持英文字母、数字与连字符。');
  }

  return normalized;
}

export async function applyManagedSlug(strapi: Core.Strapi, event: LifecycleEvent) {
  if (!event.model.attributes?.[SLUG_FIELD] || !event.params.data) {
    return;
  }

  const { data, where } = event.params;
  const identity: RecordIdentity = {
    id: extractRecordId(where),
    documentId: extractDocumentId(where) || extractDocumentId(data),
  };
  const rawSlug = data[SLUG_FIELD];
  const hasManualSlug = typeof rawSlug === 'string';
  const shouldAutoGenerate =
    event.action === 'beforeCreate'
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
