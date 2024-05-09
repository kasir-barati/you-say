import {
  RealmPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  jsxPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  maxLengthPlugin,
  quotePlugin,
  sandpackPlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';

export function plugIn(plugins: PlugInArgs): RealmPlugin[] {
  const result: RealmPlugin[] = [];

  if (plugins?.headingsPlugin) {
    result.push(headingsPlugin());
  }
  if (plugins?.listsPlugin) {
    result.push(listsPlugin());
  }
  if (plugins?.jsxPlugin) {
    result.push(jsxPlugin());
  }
  if (plugins?.linkPlugin) {
    result.push(linkPlugin());
  }
  if (plugins?.imagePlugin) {
    result.push(imagePlugin());
  }
  if (plugins?.quotePlugin) {
    result.push(quotePlugin());
  }
  if (plugins?.tablePlugin) {
    result.push(tablePlugin());
  }
  if (plugins?.toolbarPlugin) {
    result.push(toolbarPlugin());
  }
  if (plugins?.sandpackPlugin) {
    result.push(sandpackPlugin());
  }
  if (plugins?.codeBlockPlugin) {
    result.push(codeBlockPlugin());
  }
  if (plugins?.maxLengthPlugin) {
    result.push(maxLengthPlugin());
  }
  if (plugins?.codeMirrorPlugin) {
    result.push(codeMirrorPlugin());
  }
  if (plugins?.diffSourcePlugin) {
    result.push(diffSourcePlugin());
  }
  if (plugins?.directivesPlugin) {
    result.push(directivesPlugin());
  }
  if (plugins?.linkDialogPlugin) {
    result.push(linkDialogPlugin());
  }
  if (plugins?.frontmatterPlugin) {
    result.push(frontmatterPlugin());
  }
  if (plugins?.thematicBreakPlugin) {
    result.push(thematicBreakPlugin());
  }
  if (plugins?.markdownShortcutPlugin) {
    result.push(markdownShortcutPlugin());
  }

  return result;
}

export interface PlugInArgs {
  listsPlugin?: boolean;
  headingsPlugin?: boolean;
  jsxPlugin?: boolean;
  linkPlugin?: boolean;
  imagePlugin?: boolean;
  quotePlugin?: boolean;
  tablePlugin?: boolean;
  toolbarPlugin?: boolean;
  sandpackPlugin?: boolean;
  codeBlockPlugin?: boolean;
  maxLengthPlugin?: boolean;
  codeMirrorPlugin?: boolean;
  diffSourcePlugin?: boolean;
  directivesPlugin?: boolean;
  linkDialogPlugin?: boolean;
  frontmatterPlugin?: boolean;
  thematicBreakPlugin?: boolean;
  markdownShortcutPlugin?: boolean;
}
