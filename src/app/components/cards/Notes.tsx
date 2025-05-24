'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';

interface NotesProps {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded-t border-b border-gray-200">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'bg-white'}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'bg-white'}`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded ${editor.isActive('underline') ? 'bg-gray-300' : 'bg-white'}`}
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-2 py-1 rounded ${editor.isActive('strike') ? 'bg-gray-300' : 'bg-white'}`}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'bg-white'}`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'bg-white'}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'bg-white'}`}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'bg-white'}`}
      >
        Ordered List
      </button>
      <button
        onClick={() => {
          const url = window.prompt('URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`px-2 py-1 rounded ${editor.isActive('link') ? 'bg-gray-300' : 'bg-white'}`}
      >
        Link
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="px-2 py-1 rounded bg-white"
        disabled={!editor.isActive('link')}
      >
        Unlink
      </button>
    </div>
  );
};

const Notes: React.FC<NotesProps> = ({ data, setData }) => {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: data,
    onUpdate: ({ editor }) => {
      setData(editor.getHTML());
    },
  });

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Notes</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className={expanded ? 'h-96' : 'h-48'}>
        {mounted && editor && (
          <div className="bg-white h-full border rounded">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-4 h-[calc(100%-48px)] overflow-auto" />
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
   );
};

export default Notes;
