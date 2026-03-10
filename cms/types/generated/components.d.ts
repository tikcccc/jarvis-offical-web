import type { Schema, Struct } from '@strapi/strapi';

export interface SharedRichTextSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_text_sections';
  info: {
    description: '\u5E26\u6807\u9898\u7684\u5BCC\u6587\u672C\u5185\u5BB9\u5757';
    displayName: '\u5171\u4EAB\uFF5C\u5BCC\u6587\u672C\u5206\u533A';
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '\u901A\u7528 SEO \u5143\u6570\u636E';
    displayName: '\u5171\u4EAB\uFF5CSEO\u8BBE\u7F6E';
  };
  attributes: {
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    openGraphImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.rich-text-section': SharedRichTextSection;
      'shared.seo': SharedSeo;
    }
  }
}
