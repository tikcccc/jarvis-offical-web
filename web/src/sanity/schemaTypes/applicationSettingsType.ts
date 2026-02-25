import { defineField, defineType } from "sanity";

export const applicationSettingsType = defineType({
  name: "applicationSettings",
  title: "Application Settings",
  type: "document",
  initialValue: {
    url: "https://forms.jarvisbim.com.cn/f/5ae840d915fd604188882302",
  },
  fields: [
    defineField({
      name: "url",
      title: "Application URL",
      type: "url",
      description: "Global application form link used by all career pages.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Application URL",
      };
    },
  },
});
