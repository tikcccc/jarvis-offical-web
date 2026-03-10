import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cmsRoot = path.resolve(__dirname, "..");

const replacements = [
  {
    file: "node_modules/@strapi/content-manager/dist/admin/pages/EditView/components/FormInputs/BlocksInput/BlocksEditor.js",
    oldSnippet: `    // Ensure the editor is in sync after discard
    React__namespace.useEffect(()=>{
        // Never deselect while the editor is actively focused (typing / editing),
        if (slateReact.ReactEditor.isFocused(editor)) {
            return;
        }
        // Normalize empty states for comparison to avoid losing focus on the editor when content is deleted
        const normalizedValue = value?.length ? value : null;
        const normalizedEditorState = normalizeBlocksState(editor, editor.children);
        // Compare the field value with the editor state to check for a stale selection
        if (normalizedValue && normalizedEditorState && JSON.stringify(normalizedEditorState) !== JSON.stringify(normalizedValue)) {
            // When there is a diff, unset selection to avoid an invalid state
            slate.Transforms.deselect(editor);
        }
    }, [
        editor,
        value
    ]);`,
    newSnippet: `    // Ensure the editor is in sync after discard or external resets.
    React__namespace.useEffect(()=>{
        // Never deselect while the editor is actively focused (typing / editing),
        if (slateReact.ReactEditor.isFocused(editor)) {
            return;
        }
        // Normalize empty states for comparison to avoid losing focus on the editor when content is deleted
        const normalizedValue = value?.length ? value : null;
        const normalizedEditorState = normalizeBlocksState(editor, editor.children);
        let hasInvalidSelection = false;
        if (editor.selection) {
            try {
                slate.Editor.leaf(editor, editor.selection.anchor.path);
                slate.Editor.leaf(editor, editor.selection.focus.path);
            } catch {
                hasInvalidSelection = true;
            }
        }
        const hasStateMismatch = JSON.stringify(normalizedEditorState) !== JSON.stringify(normalizedValue);
        if (hasInvalidSelection || editor.selection && hasStateMismatch) {
            slate.Transforms.deselect(editor);
        }
    }, [
        editor,
        value
    ]);`,
  },
  {
    file: "node_modules/@strapi/content-manager/dist/admin/pages/EditView/components/FormInputs/BlocksInput/BlocksEditor.mjs",
    oldSnippet: `    // Ensure the editor is in sync after discard
    React.useEffect(()=>{
        // Never deselect while the editor is actively focused (typing / editing),
        if (ReactEditor.isFocused(editor)) {
            return;
        }
        // Normalize empty states for comparison to avoid losing focus on the editor when content is deleted
        const normalizedValue = value?.length ? value : null;
        const normalizedEditorState = normalizeBlocksState(editor, editor.children);
        // Compare the field value with the editor state to check for a stale selection
        if (normalizedValue && normalizedEditorState && JSON.stringify(normalizedEditorState) !== JSON.stringify(normalizedValue)) {
            // When there is a diff, unset selection to avoid an invalid state
            Transforms.deselect(editor);
        }
    }, [
        editor,
        value
    ]);`,
    newSnippet: `    // Ensure the editor is in sync after discard or external resets.
    React.useEffect(()=>{
        // Never deselect while the editor is actively focused (typing / editing),
        if (ReactEditor.isFocused(editor)) {
            return;
        }
        // Normalize empty states for comparison to avoid losing focus on the editor when content is deleted
        const normalizedValue = value?.length ? value : null;
        const normalizedEditorState = normalizeBlocksState(editor, editor.children);
        let hasInvalidSelection = false;
        if (editor.selection) {
            try {
                Editor.leaf(editor, editor.selection.anchor.path);
                Editor.leaf(editor, editor.selection.focus.path);
            } catch {
                hasInvalidSelection = true;
            }
        }
        const hasStateMismatch = JSON.stringify(normalizedEditorState) !== JSON.stringify(normalizedValue);
        if (hasInvalidSelection || editor.selection && hasStateMismatch) {
            Transforms.deselect(editor);
        }
    }, [
        editor,
        value
    ]);`,
  },
  {
    file: "node_modules/@strapi/content-manager/dist/admin/pages/EditView/components/FormInputs/BlocksInput/Modifiers.js",
    oldSnippet: ` */ const baseCheckIsActive = (editor, name)=>{
    const { selection } = editor;
    // If there's no selection, fall back to Slate's current marks.
    // (This is what will be applied to newly inserted text.)
    if (!selection) {
        const marks = slate.Editor.marks(editor);
        return Boolean(marks?.[name]);
    }
    // Collapsed selection (caret): current marks are reliable.
    if (slate.Range.isCollapsed(selection)) {
        const marks = slate.Editor.marks(editor);
        return Boolean(marks?.[name]);
    }
    /**
   * Expanded selection: derive "active" state from the selected text nodes.
   *
   * This avoids a common mobile edge case where the selection focus can sit just
   * outside the formatted span (so relying on caret/focus marks would be wrong).
   *
   * Additionally, mobile selection often includes an extra whitespace character at
   * the edge (e.g. the trailing space after a word). We ignore whitespace-only
   * portions when computing active state so the toolbar reflects the intended
   * formatted text.
   */ const range = slate.Editor.unhangRange(editor, selection);
    const selectedTextEntries = Array.from(slate.Editor.nodes(editor, {
        at: range,
        match: slate.Text.isText,
        mode: 'all'
    }));
    if (selectedTextEntries.length === 0) return false;
    const summary = selectedTextEntries.reduce((acc, [node, path])=>{
        const nodeRange = slate.Editor.range(editor, path);
        const intersection = slate.Range.intersection(range, nodeRange);
        if (!intersection) {
            return acc;
        }
        const start = Math.min(intersection.anchor.offset, intersection.focus.offset);
        const end = Math.max(intersection.anchor.offset, intersection.focus.offset);
        const selectedSlice = node.text.slice(start, end);
        // Ignore whitespace-only slices (common in mobile selection boundaries).
        if (selectedSlice.trim().length === 0) {
            return acc;
        }
        return {
            hasNonWhitespaceSelection: true,
            isEveryRelevantNodeMarked: acc.isEveryRelevantNodeMarked && Boolean(node[name])
        };
    }, {
        hasNonWhitespaceSelection: false,
        isEveryRelevantNodeMarked: true
    });
    return summary.hasNonWhitespaceSelection && summary.isEveryRelevantNodeMarked;
};`,
    newSnippet: ` */ const ensureValidSelection = (editor)=>{
    if (!editor.selection) {
        return null;
    }
    try {
        slate.Editor.leaf(editor, editor.selection.anchor.path);
        slate.Editor.leaf(editor, editor.selection.focus.path);
        return editor.selection;
    } catch {
        slate.Transforms.deselect(editor);
        return null;
    }
};
const baseCheckIsActive = (editor, name)=>{
    const selection = ensureValidSelection(editor);
    // If there's no selection, fall back to Slate's current marks.
    // (This is what will be applied to newly inserted text.)
    if (!selection) {
        const marks = slate.Editor.marks(editor);
        return Boolean(marks?.[name]);
    }
    // Collapsed selection (caret): current marks are reliable.
    if (slate.Range.isCollapsed(selection)) {
        const marks = slate.Editor.marks(editor);
        return Boolean(marks?.[name]);
    }
    /**
   * Expanded selection: derive "active" state from the selected text nodes.
   *
   * This avoids a common mobile edge case where the selection focus can sit just
   * outside the formatted span (so relying on caret/focus marks would be wrong).
   *
   * Additionally, mobile selection often includes an extra whitespace character at
   * the edge (e.g. the trailing space after a word). We ignore whitespace-only
   * portions when computing active state so the toolbar reflects the intended
   * formatted text.
   */ const range = slate.Editor.unhangRange(editor, selection);
    const selectedTextEntries = Array.from(slate.Editor.nodes(editor, {
        at: range,
        match: slate.Text.isText,
        mode: 'all'
    }));
    if (selectedTextEntries.length === 0) return false;
    const summary = selectedTextEntries.reduce((acc, [node, path])=>{
        const nodeRange = slate.Editor.range(editor, path);
        const intersection = slate.Range.intersection(range, nodeRange);
        if (!intersection) {
            return acc;
        }
        const start = Math.min(intersection.anchor.offset, intersection.focus.offset);
        const end = Math.max(intersection.anchor.offset, intersection.focus.offset);
        const selectedSlice = node.text.slice(start, end);
        // Ignore whitespace-only slices (common in mobile selection boundaries).
        if (selectedSlice.trim().length === 0) {
            return acc;
        }
        return {
            hasNonWhitespaceSelection: true,
            isEveryRelevantNodeMarked: acc.isEveryRelevantNodeMarked && Boolean(node[name])
        };
    }, {
        hasNonWhitespaceSelection: false,
        isEveryRelevantNodeMarked: true
    });
    return summary.hasNonWhitespaceSelection && summary.isEveryRelevantNodeMarked;
};`,
  },
  {
    file: "node_modules/@strapi/content-manager/dist/admin/pages/EditView/components/FormInputs/BlocksInput/Modifiers.mjs",
    oldSnippet: ` */ const baseCheckIsActive = (editor, name)=>{
    const { selection } = editor;
    // If there's no selection, fall back to Slate's current marks.
    // (This is what will be applied to newly inserted text.)
    if (!selection) {
        const marks = Editor.marks(editor);
        return Boolean(marks?.[name]);
    }
    // Collapsed selection (caret): current marks are reliable.
    if (Range.isCollapsed(selection)) {
        const marks = Editor.marks(editor);
        return Boolean(marks?.[name]);
    }
    /**
   * Expanded selection: derive "active" state from the selected text nodes.
   *
   * This avoids a common mobile edge case where the selection focus can sit just
   * outside the formatted span (so relying on caret/focus marks would be wrong).
   *
   * Additionally, mobile selection often includes an extra whitespace character at
   * the edge (e.g. the trailing space after a word). We ignore whitespace-only
   * portions when computing active state so the toolbar reflects the intended
   * formatted text.
   */ const range = Editor.unhangRange(editor, selection);
    const selectedTextEntries = Array.from(Editor.nodes(editor, {
        at: range,
        match: Text.isText,
        mode: 'all'
    }));
    if (selectedTextEntries.length === 0) return false;
    const summary = selectedTextEntries.reduce((acc, [node, path])=>{
        const nodeRange = Editor.range(editor, path);
        const intersection = Range.intersection(range, nodeRange);
        if (!intersection) {
            return acc;
        }
        const start = Math.min(intersection.anchor.offset, intersection.focus.offset);
        const end = Math.max(intersection.anchor.offset, intersection.focus.offset);
        const selectedSlice = node.text.slice(start, end);
        // Ignore whitespace-only slices (common in mobile selection boundaries).
        if (selectedSlice.trim().length === 0) {
            return acc;
        }
        return {
            hasNonWhitespaceSelection: true,
            isEveryRelevantNodeMarked: acc.isEveryRelevantNodeMarked && Boolean(node[name])
        };
    }, {
        hasNonWhitespaceSelection: false,
        isEveryRelevantNodeMarked: true
    });
    return summary.hasNonWhitespaceSelection && summary.isEveryRelevantNodeMarked;
};`,
    newSnippet: ` */ const ensureValidSelection = (editor)=>{
    if (!editor.selection) {
        return null;
    }
    try {
        Editor.leaf(editor, editor.selection.anchor.path);
        Editor.leaf(editor, editor.selection.focus.path);
        return editor.selection;
    } catch {
        Transforms.deselect(editor);
        return null;
    }
};
const baseCheckIsActive = (editor, name)=>{
    const selection = ensureValidSelection(editor);
    // If there's no selection, fall back to Slate's current marks.
    // (This is what will be applied to newly inserted text.)
    if (!selection) {
        const marks = Editor.marks(editor);
        return Boolean(marks?.[name]);
    }
    // Collapsed selection (caret): current marks are reliable.
    if (Range.isCollapsed(selection)) {
        const marks = Editor.marks(editor);
        return Boolean(marks?.[name]);
    }
    /**
   * Expanded selection: derive "active" state from the selected text nodes.
   *
   * This avoids a common mobile edge case where the selection focus can sit just
   * outside the formatted span (so relying on caret/focus marks would be wrong).
   *
   * Additionally, mobile selection often includes an extra whitespace character at
   * the edge (e.g. the trailing space after a word). We ignore whitespace-only
   * portions when computing active state so the toolbar reflects the intended
   * formatted text.
   */ const range = Editor.unhangRange(editor, selection);
    const selectedTextEntries = Array.from(Editor.nodes(editor, {
        at: range,
        match: Text.isText,
        mode: 'all'
    }));
    if (selectedTextEntries.length === 0) return false;
    const summary = selectedTextEntries.reduce((acc, [node, path])=>{
        const nodeRange = Editor.range(editor, path);
        const intersection = Range.intersection(range, nodeRange);
        if (!intersection) {
            return acc;
        }
        const start = Math.min(intersection.anchor.offset, intersection.focus.offset);
        const end = Math.max(intersection.anchor.offset, intersection.focus.offset);
        const selectedSlice = node.text.slice(start, end);
        // Ignore whitespace-only slices (common in mobile selection boundaries).
        if (selectedSlice.trim().length === 0) {
            return acc;
        }
        return {
            hasNonWhitespaceSelection: true,
            isEveryRelevantNodeMarked: acc.isEveryRelevantNodeMarked && Boolean(node[name])
        };
    }, {
        hasNonWhitespaceSelection: false,
        isEveryRelevantNodeMarked: true
    });
    return summary.hasNonWhitespaceSelection && summary.isEveryRelevantNodeMarked;
};`,
  },
];

async function applyReplacement(file, oldSnippet, newSnippet) {
  const absolutePath = path.join(cmsRoot, file);
  const content = await readFile(absolutePath, "utf8");

  if (content.includes(newSnippet)) {
    return "already-patched";
  }

  if (!content.includes(oldSnippet)) {
    throw new Error(`Expected snippet not found in ${file}`);
  }

  await writeFile(absolutePath, content.replace(oldSnippet, newSnippet), "utf8");
  return "patched";
}

let patchedCount = 0;

for (const replacement of replacements) {
  const result = await applyReplacement(
    replacement.file,
    replacement.oldSnippet,
    replacement.newSnippet
  );

  if (result === "patched") {
    patchedCount += 1;
    console.log(`Patched ${replacement.file}`);
  }
}

if (patchedCount === 0) {
  console.log("Strapi blocks editor patch already applied.");
}

await rm(path.join(cmsRoot, "node_modules/.strapi/vite"), {
  recursive: true,
  force: true,
});
