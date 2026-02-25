import { defineField, defineType } from "sanity";

export const careerLocationType = defineType({
  name: "careerLocation",
  title: "Career Location",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Location Name",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : "No slug",
      };
    },
  },
});
