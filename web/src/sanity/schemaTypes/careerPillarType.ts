import { defineField, defineType } from "sanity";

export const careerPillarType = defineType({
  name: "careerPillar",
  title: "Career Pillar",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Pillar Title",
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
    defineField({
      name: "description",
      title: "Description (Optional)",
      type: "text",
      rows: 3,
      description: "",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order (Optional)",
      type: "number",
      description: "Priority for columns: High shows first, Low shows last.",
      options: {
        list: [
          { title: "High (top)", value: 1 },
          { title: "Medium", value: 2 },
          { title: "Low (bottom)", value: 3 },
        ],
        layout: "dropdown",
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      sortOrder: "sortOrder",
    },
    prepare({ title, sortOrder }) {
      const order = typeof sortOrder === "number" ? `#${sortOrder}` : "no order";
      return {
        title,
        subtitle: order,
      };
    },
  },
});
