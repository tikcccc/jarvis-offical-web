import { defineField, defineType } from 'sanity';

export const caseStudyType = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    // Basic fields
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (Optional)',
      type: 'string',
      description: 'Brief subtitle (optional, max 200 chars)',
      validation: (Rule) => Rule.max(200),
    }),

    // Category
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'caseStudyCategory' }],
      validation: (Rule) => Rule.required(),
    }),

    // Content
    defineField({
      name: 'mainImage',
      title: 'Main Image (Optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link (Optional)',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL (Optional)',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (Optional)',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Metadata
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'isBIM Team',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes',
      validation: (Rule) => Rule.required().min(1).max(60),
      initialValue: 5,
    }),

    // Status control
    defineField({
      name: 'featured',
      title: 'Featured (Optional)',
      type: 'boolean',
      description: 'Show as featured case study (top of list)',
      initialValue: false,
    }),
    // SEO fields (optional; auto-generated if blank)
    defineField({
      name: 'seo',
      title: 'SEO & Social (Optional)',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      description: 'Optional. Defaults to title/subtitle/excerpt and main image if left blank.',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title (Optional)',
          type: 'string',
          description: 'Optional. Defaults to title if blank.',
          validation: (Rule) => Rule.max(60).warning('Keep under 60 characters'),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description (Optional)',
          type: 'text',
          rows: 3,
          description: 'Optional. Auto-generated from subtitle/excerpt/body if blank.',
          validation: (Rule) => Rule.max(160).warning('Keep under 160 characters'),
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image (Optional)',
          type: 'image',
          description: 'Optional social image (1200x630). Defaults to main image if blank.',
          options: { hotspot: true },
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords (Optional)',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      categoryTitle: 'category.title',
      publishedAt: 'publishedAt',
    },
    prepare({ title, media, categoryTitle, publishedAt }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published';

      return {
        title,
        media,
        subtitle: `${categoryTitle || 'No category'} • ${date}`,
      };
    },
  },
});
