import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
  },
  register(app: StrapiApp) {
    app.customFields.register({
      name: 'localized-enum',
      type: 'enumeration',
      intlLabel: {
        id: 'global.localized-enum.label',
        defaultMessage: 'Localized enum',
      },
      intlDescription: {
        id: 'global.localized-enum.description',
        defaultMessage: 'Enumeration field with localized option labels.',
      },
      components: {
        Input: async () => import('./components/localized-enum-input'),
      },
    });
  },
};
