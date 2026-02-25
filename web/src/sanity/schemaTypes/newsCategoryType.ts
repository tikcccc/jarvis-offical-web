import { defineType, defineField } from 'sanity';

export const newsCategoryType = defineType({
  name: 'newsCategory',
  title: 'News Categories',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order (Optional)',
      type: 'number',
      description: 'Priority: High shows first.',
      options: {
        list: [
          { title: 'High (top)', value: 1 },
          { title: 'Medium', value: 2 },
          { title: 'Low (bottom)', value: 3 },
        ],
        layout: 'radio',
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
});
