import type { StructureResolver } from "sanity/desk";

const SINGLETON_TYPES = new Set(["applicationSettings"]);

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Application URL")
        .id("applicationSettings")
        .child(
          S.document()
            .schemaType("applicationSettings")
            .documentId("applicationSettings")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() || "")
      ),
    ]);
