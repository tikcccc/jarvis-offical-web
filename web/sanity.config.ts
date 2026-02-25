import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './src/sanity/schemaTypes'
import { deskStructure } from './src/sanity/deskStructure'

export default defineConfig({
  name: 'default',
  title: 'isBIM Sanity Studio',

  projectId: 'racyn2dq',
  dataset: 'production',

  basePath: '/studio',
  plugins: [deskTool({ structure: deskStructure })],

  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (previous, context) =>
      context.schemaType === "applicationSettings"
        ? previous.filter(({ action }) => action !== "delete" && action !== "duplicate")
        : previous,
    newDocumentOptions: (previous) =>
      previous.filter((templateItem) => templateItem.templateId !== "applicationSettings"),
  },
})
