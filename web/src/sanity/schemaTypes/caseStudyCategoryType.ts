import { defineType, defineField } from 'sanity';

export const caseStudyCategoryType = defineType({
  name: 'caseStudyCategory',
  title: 'Case Study Categories',
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
