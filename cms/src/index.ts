import type { Core } from '@strapi/strapi';
import { applyManagedSlug } from './utils/slug';

type FieldMetadata = {
  edit?: {
    label?: string;
    [key: string]: unknown;
  };
  list?: {
    label?: string;
    [key: string]: unknown;
  };
};

type ModelConfiguration = {
  settings?: Record<string, unknown>;
  metadatas?: Record<string, FieldMetadata>;
  layouts?: {
    list?: string[];
    edit?: Array<Array<{ name: string; size: number }>>;
  };
};

function toDefaultLabel(field: string) {
  return field
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function getLayoutFields(configuration: ModelConfiguration) {
  const listFields = configuration.layouts?.list || [];
  const editFields = (configuration.layouts?.edit || []).flatMap((row) =>
    row.map((field) => field.name)
  );

  return new Set([...listFields, ...editFields]);
}

function getAllowedFields(
  model: { attributes?: Record<string, unknown> } | null | undefined,
  schema: { attributes?: Record<string, unknown> } | null | undefined
) {
  return new Set(
    Object.keys(model?.attributes || schema?.attributes || {})
  );
}

function normalizeConfiguration(
  configuration: ModelConfiguration,
  allowedFields: Set<string>
): ModelConfiguration {
  const sanitized = sanitizeConfiguration(configuration, allowedFields);
  const metadataFields = new Set([
    ...allowedFields,
    ...getLayoutFields(sanitized),
  ]);
  const metadatas = Object.fromEntries(
    Object.entries(sanitized.metadatas || {}).map(([field, metadata]) => {
      const fallbackLabel =
        metadata.list?.label || metadata.edit?.label || toDefaultLabel(field);

      return [
        field,
        {
          ...metadata,
          edit: {
            ...(metadata.edit || {}),
            label: metadata.edit?.label || fallbackLabel,
          },
          list: {
            ...(metadata.list || {}),
            label: metadata.list?.label || fallbackLabel,
          },
        },
      ];
    })
  ) as Record<string, FieldMetadata>;

  for (const field of metadataFields) {
    const metadata: FieldMetadata = metadatas[field] || {};
    const fallbackLabel =
      metadata.list?.label || metadata.edit?.label || toDefaultLabel(field);

    metadatas[field] = {
      ...metadata,
      edit: {
        ...(metadata.edit || {}),
        label: metadata.edit?.label || fallbackLabel,
      },
      list: {
        ...(metadata.list || {}),
        label: metadata.list?.label || fallbackLabel,
      },
    };
  }

  return {
    ...sanitized,
    metadatas,
  };
}

function sanitizeConfiguration(
  configuration: ModelConfiguration,
  allowedFields: Set<string>
): ModelConfiguration {
  const metadatas = Object.fromEntries(
    Object.entries(configuration.metadatas || {}).filter(([field]) =>
      allowedFields.has(field)
    )
  );

  const edit = (configuration.layouts?.edit || [])
    .map((row) => row.filter((field) => allowedFields.has(field.name)))
    .filter((row) => row.length > 0);

  const list = (configuration.layouts?.list || []).filter((field) =>
    allowedFields.has(field)
  );

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

function mergeConfiguration(
  current: ModelConfiguration,
  override: ModelConfiguration
): ModelConfiguration {
  const currentMetadatas = current.metadatas || {};
  const overrideMetadatas = override.metadatas || {};

  const metadatas = Object.entries(overrideMetadatas).reduce<
    Record<string, FieldMetadata>
  >((acc, [field, metadata]) => {
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

async function syncContentManagerLabels(strapi: Core.Strapi) {
  const contentTypeService = strapi.service(
    'plugin::content-manager.content-types'
  ) as {
    findContentType: (uid: string) => unknown;
    findConfiguration: (model: unknown) => Promise<ModelConfiguration>;
    updateConfiguration: (
      model: unknown,
      configuration: ModelConfiguration
    ) => Promise<unknown>;
  };

  const componentService = strapi.service(
    'plugin::content-manager.components'
  ) as {
    findComponent: (uid: string) => unknown;
    findConfiguration: (model: unknown) => Promise<ModelConfiguration>;
    updateConfiguration: (
      model: unknown,
      configuration: ModelConfiguration
    ) => Promise<unknown>;
  };

  for (const [uid, schema] of Object.entries(strapi.contentTypes)) {
    if (!uid.startsWith('api::')) continue;

    const model = contentTypeService.findContentType(uid);
    const schemaConfig = (schema as { config?: ModelConfiguration }).config;
    const allowedFields = getAllowedFields(
      model as { attributes?: Record<string, unknown> } | null | undefined,
      schema as { attributes?: Record<string, unknown> } | null | undefined
    );

    if (!model || !schemaConfig) continue;

    const current = normalizeConfiguration(
      await contentTypeService.findConfiguration(model),
      allowedFields
    );
    const next = normalizeConfiguration(
      mergeConfiguration(current, schemaConfig),
      allowedFields
    );
    await contentTypeService.updateConfiguration(model, next);
  }

  for (const [uid, schema] of Object.entries(strapi.components)) {
    const model = componentService.findComponent(uid);
    const schemaConfig = (schema as { config?: ModelConfiguration }).config;
    const allowedFields = getAllowedFields(
      model as { attributes?: Record<string, unknown> } | null | undefined,
      schema as { attributes?: Record<string, unknown> } | null | undefined
    );

    if (!model || !schemaConfig) continue;

    const current = normalizeConfiguration(
      await componentService.findConfiguration(model),
      allowedFields
    );
    const next = normalizeConfiguration(
      mergeConfiguration(current, schemaConfig),
      allowedFields
    );
    await componentService.updateConfiguration(model, next);
  }
}

function getSlugManagedModels(strapi: Core.Strapi) {
  return Object.entries(strapi.contentTypes)
    .filter(([uid, schema]) => {
      if (!uid.startsWith('api::')) return false;

      const attributes = (schema as { attributes?: Record<string, unknown> }).attributes;
      return Boolean(attributes?.slug);
    })
    .map(([uid]) => uid);
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await syncContentManagerLabels(strapi);

    strapi.db.lifecycles.subscribe({
      models: getSlugManagedModels(strapi),
      async beforeCreate(event) {
        await applyManagedSlug(strapi, {
          action: 'beforeCreate',
          model: event.model,
          params: event.params,
        });
      },
      async beforeUpdate(event) {
        await applyManagedSlug(strapi, {
          action: 'beforeUpdate',
          model: event.model,
          params: event.params,
        });
      },
    });
  },
};
