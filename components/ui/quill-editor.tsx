/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import ReactQuill from 'react-quill-new';
// import type ReactQuillProps from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';

interface QuillEditorProps {
  error?: string;
  label?: React.ReactNode;
  value: string;
  onChange: (value: string, delta: any, source: string, editor: any) => void;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  placeholder?: string;
  toolbarPosition?: 'top' | 'bottom';
}

export default function QuillEditor({
  label,
  error,
  className,
  labelClassName,
  placeholder,
  toolbarPosition = 'top',
  ...props
}: QuillEditorProps) {
  const quillModules = {
    toolbar: [
      // [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ['bold', 'italic', 'underline', 'strike', 'blockquote'], // toggled buttons
      // ['blockquote', 'code-block'],

      // [{ list: 'ordered' }, { list: 'bullet' }],
      // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

      // [{ color: [] }, 'image', { background: [] }], // dropdown with defaults from theme
      // [{ font: [] }],
      // [{ 'code-block': true }],
      [{ align: [] }],

      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    // "blockquote",
    'list',
    'bullet',
    // 'blockquote',
    // 'code-block',
    // 'script',
    // 'indent',
    // 'image',
    // 'color',
    // 'background',
    'font',
    'align',
  ];

  return (
    <div className={cn(className)}>
      {label && <label className={cn('mb-1.5 block', labelClassName)}>{label}</label>}
      <ReactQuill
        modules={quillModules}
        formats={quillFormats}
        theme="snow"
        className={cn(
          'react-quill !rounded-md',
          toolbarPosition === 'bottom' && 'react-quill-toolbar-bottom relative',
          className
        )}
        value={props.value}
        onChange={props.onChange}
        placeholder={placeholder}
      />
      {error && <div>{error}</div>}
    </div>
  );
}
