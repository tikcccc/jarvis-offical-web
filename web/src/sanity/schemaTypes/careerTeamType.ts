import { defineField, defineType } from "sanity";

export const careerTeamType = defineType({
  name: "careerTeam",
  title: "Career Team",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Team Name",
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
      name: "pillar",
      title: "Pillar (Column Header)",
      type: "reference",
      to: [{ type: "careerPillar" }],
      description: "Which pillar this team appears under on the careers page.",
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
      description: "Priority within pillar: High shows first, Low shows last.",
      options: {
        list: [
          { title: "High (top)", value: 1 },
          { title: "Medium", value: 2 },
          { title: "Low (bottom)", value: 3 },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      pillarTitle: "pillar.title",
    },
    prepare({ title, pillarTitle }) {
      const subtitle = pillarTitle || "No pillar set";
      return {
        title,
        subtitle,
      };
    },
  },
});
