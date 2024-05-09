'use client';

import {
  MDXEditor,
  MDXEditorMethods,
  RealmPlugin,
} from '@mdxeditor/editor';
import classNames from 'classnames';
import { MutableRefObject } from 'react';
import { PlugInArgs, plugIn } from './plug-in';

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
export default function Editor({
  markdown,
  onChange,
  editorRef,
  placeholder,
  readonly = true,
  contentEditableClassName,
  plugins = { headingsPlugin: true },
}: EditorProps) {
  const pluggedInPlugins: RealmPlugin[] = plugIn(plugins);

  return (
    <MDXEditor
      onChange={onChange}
      ref={editorRef}
      markdown={markdown}
      plugins={pluggedInPlugins}
      readOnly={readonly}
      contentEditableClassName={classNames(
        contentEditableClassName,
        'wrap-mdxeditor-lines',
        'p-0',
      )}
      className="w-full"
      placeholder={placeholder}
    />
  );
}

export interface EditorProps {
  /**
   * @description Its initial value. Notice that the property works like the textarea `defaultValue`. To change the value dynamically, you should use the setMarkdown ref method.
   */
  markdown: string;
  /**
   * @description Required if it is not a in preview/view mode (**it is not readonly**).
   */
  onChange?: (markdown: string) => void;
  editorRef?: MutableRefObject<MDXEditorMethods | null>;
  /**
   * @description Set it to false if you need an editable text area
   * @default true
   */
  readonly?: boolean;
  contentEditableClassName?: string;
  plugins?: PlugInArgs;
  placeholder?: string;
}
