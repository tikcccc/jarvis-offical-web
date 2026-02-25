import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { projectId, dataset } from "./client";

const builder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlFor = (source: Image | undefined | null) => {
  if (!source) return undefined;
  return builder.image(source);
};
