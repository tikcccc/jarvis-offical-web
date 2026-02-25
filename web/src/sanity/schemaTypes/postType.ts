import { defineType, defineField } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content (Optional)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at (Optional)',
      type: 'datetime',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social (Optional)',
      type: 'object',
      description: 'SEO and social media sharing settings',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title (Optional)',
          type: 'string',
          description: 'Override the default title for SEO (recommended: 50-60 characters)',
          validation: (Rule) => Rule.max(60).warning('Keep title under 60 characters for best SEO results'),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description (Optional)',
          type: 'text',
          rows: 3,
          description: 'Description for search engines (recommended: 150-160 characters)',
          validation: (Rule) => Rule.max(160).warning('Keep description under 160 characters for best SEO results'),
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image (Optional)',
          type: 'image',
          description: 'Image for social media sharing (recommended: 1200x630px)',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text (Optional)',
              description: 'Important for accessibility and SEO',
            },
          ],
        }),
        defineField({
          name: 'keywords',
          title: 'Focus Keywords (Optional)',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Keywords for SEO (optional)',
          options: {
            layout: 'tags',
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
    },
  },
})
