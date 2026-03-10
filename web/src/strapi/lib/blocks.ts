import type { PortableTextBlock } from "@portabletext/types";
import type {
  CmsPortableText,
  CmsPortableTextImage,
  StrapiBlocksContent,
  StrapiBlocksNode,
  StrapiDefaultInlineNode,
  StrapiListBlockNode,
  StrapiMediaAsset,
  StrapiTextInlineNode,
} from "./types";

let keyCounter = 0;

const nextKey = () => `strapi-pt-${keyCounter++}`;

type PortableTextSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

type PortableTextMarkDef = {
  _key: string;
  _type: "link";
  href: string;
};

type PortableTextBlockDraft = PortableTextBlock & {
  markDefs: PortableTextMarkDef[];
  children: PortableTextSpan[];
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asString = (value: unknown) =>
  typeof value === "string" ? value : "";

function toDecoratorMarks(node: StrapiTextInlineNode): string[] {
  const marks: string[] = [];

  if (node.bold) marks.push("strong");
  if (node.italic) marks.push("em");
  if (node.underline) marks.push("underline");
  if (node.strikethrough) marks.push("strike-through");
  if (node.code) marks.push("code");

  return marks;
}

function getInlineText(node: StrapiDefaultInlineNode): string {
  if (node.type === "text") {
    return node.text;
  }

  return node.children.map((child) => child.text).join("");
}

function normalizeMedia(value: unknown): StrapiMediaAsset | null {
  if (!isObject(value)) return null;

  const raw = "data" in value ? value.data : value;
  if (!isObject(raw)) return null;

  const entity = "attributes" in raw && isObject(raw.attributes)
    ? { ...raw.attributes, id: raw.id, documentId: raw.documentId }
    : raw;

  const url = asString(entity.url);
  if (!url) return null;

  return {
    id: typeof entity.id === "number" || typeof entity.id === "string" ? entity.id : undefined,
    documentId: asString(entity.documentId) || undefined,
    name: asString(entity.name) || undefined,
    alternativeText: asString(entity.alternativeText) || undefined,
    url,
    width: typeof entity.width === "number" ? entity.width : undefined,
    height: typeof entity.height === "number" ? entity.height : undefined,
    mime: asString(entity.mime) || undefined,
    formats: isObject(entity.formats) ? (entity.formats as StrapiMediaAsset["formats"]) : undefined,
  };
}

function convertInlineChildren(
  nodes: StrapiDefaultInlineNode[]
): { children: PortableTextSpan[]; markDefs: PortableTextMarkDef[] } {
  const children: PortableTextSpan[] = [];
  const markDefs: PortableTextMarkDef[] = [];

  for (const node of nodes) {
    if (node.type === "text") {
      children.push({
        _type: "span",
        _key: nextKey(),
        text: node.text,
        marks: toDecoratorMarks(node),
      });
      continue;
    }

    if (node.type === "link") {
      const markKey = nextKey();
      markDefs.push({
        _key: markKey,
        _type: "link",
        href: node.url,
      });

      for (const child of node.children) {
        children.push({
          _type: "span",
          _key: nextKey(),
          text: child.text,
          marks: [...toDecoratorMarks(child), markKey],
        });
      }
    }
  }

  return { children, markDefs };
}

function createPortableTextBlock(
  style: "normal" | "h2" | "h3" | "blockquote",
  nodes: StrapiDefaultInlineNode[],
  extras: Partial<PortableTextBlockDraft> = {}
): PortableTextBlockDraft {
  const { children, markDefs } = convertInlineChildren(nodes);

  return {
    _type: "block",
    _key: nextKey(),
    style,
    markDefs,
    children,
    ...extras,
  } as PortableTextBlockDraft;
}

function flattenList(
  listNode: StrapiListBlockNode,
  level = (listNode.indentLevel ?? 0) + 1
): PortableTextBlockDraft[] {
  const result: PortableTextBlockDraft[] = [];

  for (const child of listNode.children) {
    if (child.type === "list") {
      result.push(...flattenList(child, level + 1));
      continue;
    }

    result.push(
      createPortableTextBlock("normal", child.children, {
        listItem: listNode.format === "ordered" ? "number" : "bullet",
        level,
      })
    );
  }

  return result;
}

function convertNode(node: StrapiBlocksNode): CmsPortableText {
  switch (node.type) {
    case "paragraph":
      return [createPortableTextBlock("normal", node.children)];
    case "quote":
      return [createPortableTextBlock("blockquote", node.children)];
    case "heading":
      return [
        createPortableTextBlock(
          node.level <= 2 ? "h2" : "h3",
          node.children
        ),
      ];
    case "code":
      return [
        createPortableTextBlock("normal", [
          {
            type: "text",
            text: node.children.map((child) => getInlineText(child)).join(""),
            code: true,
          },
        ]),
      ];
    case "list":
      return flattenList(node);
    case "image": {
      const asset = normalizeMedia(node.image);
      if (!asset) return [];

      const imageNode: CmsPortableTextImage = {
        _type: "image",
        _key: nextKey(),
        asset,
        alt: asset.alternativeText || asset.name || "",
      };

      return [imageNode];
    }
    default:
      return [];
  }
}

function flattenPlainTextFromList(
  listNode: StrapiListBlockNode
): string[] {
  const result: string[] = [];

  for (const child of listNode.children) {
    if (child.type === "list") {
      result.push(...flattenPlainTextFromList(child));
      continue;
    }

    const line = child.children.map((item) => getInlineText(item)).join(" ").trim();
    if (line) {
      result.push(line);
    }
  }

  return result;
}

function getPlainTextFromNode(node: StrapiBlocksNode): string[] {
  switch (node.type) {
    case "paragraph":
    case "quote":
    case "heading":
    case "code": {
      const text = node.children.map((child) => getInlineText(child)).join(" ").trim();
      return text ? [text] : [];
    }
    case "list":
      return flattenPlainTextFromList(node);
    case "image":
    default:
      return [];
  }
}

export function blocksToPortableText(
  value: StrapiBlocksContent | null | undefined
): CmsPortableText {
  if (!Array.isArray(value)) {
    return [];
  }

  keyCounter = 0;

  return value.flatMap((node) => convertNode(node));
}

export function blocksToPlainText(
  value: StrapiBlocksContent | null | undefined
): string {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .flatMap((node) => getPlainTextFromNode(node))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
