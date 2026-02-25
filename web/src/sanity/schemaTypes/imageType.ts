import { defineField, defineType } from "sanity";

export const imageType = defineType({
  name: "imageAsset",
  title: "Image",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      description: "Required for accessibility and SEO. Describe what the image shows.",
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(125)
          .error('Alt text is required and should be between 10-125 characters'),
    }),
    defineField({
      name: "file",
      title: "Image File",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('Image file is required'),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "file",
      subtitle: "alt",
    },
  },
});
