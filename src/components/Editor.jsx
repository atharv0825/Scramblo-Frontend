import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { LetterSpacing } from '../extensions/LetterSpacing';
import { LineHeight } from '../extensions/LineHeight';
import { ParagraphSpacing } from '../extensions/ParagraphSpacing';
import { useToast } from "../hooks/useToast.jsx";


import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
  Type,
} from 'lucide-react';

const buildImageStyle = ({ alignment = 'center', width = '100', height = '100' }) => {
  let style = `width: ${width}%; max-width: 100%; display: block;`;
  if (height) {
    style += ` height: ${height}%;`;
  }

  if (alignment === 'center') {
    style += ' margin: 0 auto; float: none;';
  } else if (alignment === 'left') {
    style += ' margin: 0 1.5rem 1.5rem 0; float: left;';
  } else if (alignment === 'right') {
    style += ' margin: 0 0 1.5rem 1.5rem; float: right;';
  }

  return style;
};

const ImageWithAlign = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alignment: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-alignment') || 'center',
        renderHTML: attrs => (attrs.alignment ? { 'data-alignment': attrs.alignment } : {}),
      },
      width: {
        default: '100',
        parseHTML: element => element.getAttribute('data-width') || '100',
        renderHTML: attrs => (attrs.width ? { 'data-width': attrs.width } : {}),
      },
      height: {
        default: '100',
        parseHTML: element => element.getAttribute('data-height') || '100',
        renderHTML: attrs => (attrs.height ? { 'data-height': attrs.height } : {}),
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attrs => (attrs.style ? { style: attrs.style } : {}),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes];
  },
});

// Helper to extract YouTube video ID
const getYouTubeVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Helper to get thumbnail URL for various platforms
const getThumbnailUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
};

// Helper to check if URL is a video platform
const isVideoUrl = (url) => {
  return getYouTubeVideoId(url) !== null;
};

const Editor = ({ onChange, content = '<p>Start writing your editorial...</p>' }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('100');
  const [imageHeight, setImageHeight] = useState('100');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkWidth, setLinkWidth] = useState('auto');
  const [linkHeight, setLinkHeight] = useState('auto');
  const [linkPreview, setLinkPreview] = useState(null);
  const lineSpacingOptions = ['1', '1.2', '1.4', '1.6', '1.8', '2'];
  const letterSpacingOptions = ['normal', '0.02em', '0.05em', '0.08em', '0.12em', '0.15em'];
  const paragraphSpacingOptions = [
    { value: '', label: 'None' },
    { value: '0.5em', label: 'Small' },
    { value: '1em', label: 'Medium' },
    { value: '1.5em', label: 'Large' },
  ];
  const { showToast, ToastComponent } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        link: false,
        underline: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      ParagraphSpacing,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      LineHeight,
      LetterSpacing,
      Underline,
      Subscript,
      Superscript,
      ImageWithAlign.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link text-blue-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your amazing editorial...',
      }),
      CharacterCount,
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      if (onChange) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    setShowImageModal(true);
  };

  const handleImageAdd = () => {

    if (!imageUrl) {
      showToast("Please provide an image URL", "error");
      return;
    }

    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: 'Image',
          alignment: 'center',
          width: imageWidth,
          height: imageHeight,
          style: buildImageStyle({ alignment: 'center', width: imageWidth, height: imageHeight }),
        })
        .run();

      showToast("Image added", "success");
      if (imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageUrl('');
      setImageWidth('100');
      setImageHeight('100');
      setShowImageModal(false);
    }
  };

  const handleImageBrowse = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Only image files are allowed", "error");
      return;
    }

    // ✅ SIZE CHECK (2MB example)
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be less than 2MB", "error");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(objectUrl);
  };

  const handleImageCancel = () => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl('');
    setImageWidth('100');
    setImageHeight('100');
    setShowImageModal(false);
  };

  const setImageAlignment = (alignment) => {
    if (editor.isActive('image')) {
      const attrs = editor.getAttributes('image');
      const width = attrs.width || '100';
      const height = attrs.height || '100';
      editor
        .chain()
        .focus()
        .updateAttributes('image', {
          alignment,
          width,
          height,
          style: buildImageStyle({ alignment, width, height }),
        })
        .run();
    } else {
      editor.chain().focus().setTextAlign(alignment).run();
    }
  };

  const isAlignActive = (alignment) => {
    if (editor.isActive('image')) {
      return editor.getAttributes('image').alignment === alignment;
    }
    return editor.isActive({ textAlign: alignment });
  };

  const addLink = () => {
    setShowLinkModal(true);
  };

  const handleLinkAdd = () => {

    if (!linkUrl) {
      showToast("Please enter a link", "error");
      return;
    }

    if (linkUrl) {
      const thumbnailUrl = getThumbnailUrl(linkUrl);

      if (thumbnailUrl) {
        // It's a video URL - embed as thumbnail card
        const videoId = getYouTubeVideoId(linkUrl);
        const embedHtml = `
            <div class="video-embed" data-video-id="${videoId}" data-platform="youtube" style="margin: 1.5em 0;">
              <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="display: block; position: relative;">
                <img src="${thumbnailUrl}" alt="Video thumbnail" style="width: 100%; max-width: 560px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: rgba(0,0,0,0.8); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 18px solid white; margin-left: 4px;"></div>
                </div>
              </a>
              <p style="color: #666; font-size: 12px; margin-top: 8px;">${linkUrl}</p>
            </div>
          `;
        editor.chain().focus().insertContent(embedHtml).run();
      } else {
        // Regular link - insert as text or apply to selection
        if (editor.state.selection.empty) {
          editor.chain().focus().insertContent(`<a href="${linkUrl}" target="_blank">${linkUrl}</a>`).run();
        } else {
          editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl, target: '_blank' }).run();
        }
      }

      showToast("Link added", "success");

      setLinkUrl('');
      setLinkWidth('auto');
      setLinkHeight('auto');
      setLinkPreview(null);
      setShowLinkModal(false);
    }
  };

  const handleLinkCancel = () => {
    setLinkUrl('');
    setLinkWidth('auto');
    setLinkHeight('auto');
    setShowLinkModal(false);
  };

  const toggleLineHeight = (lineHeight) => {
    const current = editor.getAttributes('textStyle').lineHeight;

    if (current === lineHeight || (lineHeight === 'normal' && !current)) {
      editor.chain().focus().unsetLineHeight().run();
      return;
    }

    editor.chain().focus().setLineHeight(lineHeight).run();
  };

  const toggleLetterSpacing = (letterSpacing) => {
    const current = editor.getAttributes('textStyle').letterSpacing;

    if (current === letterSpacing || (letterSpacing === 'normal' && !current)) {
      editor.chain().focus().unsetLetterSpacing().run();
      return;
    }

    editor.chain().focus().setLetterSpacing(letterSpacing).run();
  };

  const setParagraphSpacing = (spacing) => {
    const style = spacing ? `margin-bottom: ${spacing}` : null;
    editor.chain().focus().updateAttributes('paragraph', { style }).run();
  };

  const getActiveParagraphSpacing = () => {
    const style = editor.getAttributes('paragraph').style || '';
    const match = style.match(/margin-bottom:\s*([^;]+)/);
    return match ? match[1] : '';
  };

  const currentLineHeight = editor.getAttributes('textStyle').lineHeight || 'normal';
  const currentLetterSpacing = editor.getAttributes('textStyle').letterSpacing || 'normal';
  const currentParagraphSpacing = getActiveParagraphSpacing() || '';

  const toolbarItems = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor?.isActive('bold'), title: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor?.isActive('italic'), title: 'Italic' },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor?.isActive('underline'), title: 'Underline' },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor?.isActive('strike'), title: 'Strikethrough' },
    { type: 'divider' },
    { icon: Type, action: () => editor.chain().focus().setParagraph().run(), active: editor?.isActive('paragraph'), title: 'Paragraph' },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive('heading', { level: 1 }), title: 'Heading 1' },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive('heading', { level: 3 }), title: 'Heading 3' },
    { type: 'divider' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList'), title: 'Ordered List' },
    { type: 'divider' },
    { icon: AlignLeft, action: () => setImageAlignment('left'), active: isAlignActive('left'), title: 'Align Left' },
    { icon: AlignCenter, action: () => setImageAlignment('center'), active: isAlignActive('center'), title: 'Align Center' },
    { icon: AlignRight, action: () => setImageAlignment('right'), active: isAlignActive('right'), title: 'Align Right' },
    { icon: AlignJustify, action: () => editor.chain().focus().setTextAlign('justify').run(), active: editor?.isActive({ textAlign: 'justify' }), title: 'Justify' },
    { type: 'divider' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor?.isActive('blockquote'), title: 'Blockquote' },
    { icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor?.isActive('codeBlock'), title: 'Code Block' },
    { icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run(), active: false, title: 'Horizontal Rule' },
    { type: 'divider' },
    { icon: LinkIcon, action: addLink, active: editor?.isActive('link'), title: 'Add Link' },
    { icon: ImageIcon, action: addImage, active: false, title: 'Add Image' },
    { type: 'divider' },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false, disabled: !editor?.can().undo(), title: 'Undo' },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false, disabled: !editor?.can().redo(), title: 'Redo' },
  ];

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="editor-container w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Simple Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-wrap">
        {toolbarItems.map((tool, index) => {
          if (tool.type === 'divider') {
            return (
              <div key={index} className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            );
          }
          const IconComponent = tool.icon;
          return (
            <button
              key={index}
              onClick={tool.action}
              disabled={tool.disabled}
              className={`p-2 rounded transition-colors ${tool.active
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : tool.disabled
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              title={tool.title}
            >
              <IconComponent className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Editor Content */}
      <div className="relative">
        <style>{`
            .editor-content figure {
              text-align: center;
              margin: 1.5em 0;
            }
            .editor-content img {
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              transition: transform 0.2s ease;
            }
            .editor-content img:hover {
              transform: scale(1.02);
            }
            .editor-content a {
              color: #2563eb;
              text-decoration: underline;
            }
            .ProseMirror a {
              color: #2563eb;
              text-decoration: underline;
            }
          `}</style>
        <div className="editor-content min-h-[400px] p-6 bg-white dark:bg-gray-900 prose prose-lg max-w-none dark:prose-invert">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
        {editor.storage.characterCount?.characters() || 0} characters • {editor.storage.characterCount?.words() || 0} words
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Image</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageBrowse}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer text-sm text-blue-600 hover:underline">
                  Browse file
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Width (%)
                  </label>
                  <input
                    type="number"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    min="10"
                    max="200"
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (%)
                  </label>
                  <input
                    type="number"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                    min="10"
                    max="200"
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {imageUrl && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-500 mb-2">Preview</p>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full h-32 object-contain rounded"
                    onError={() => setImageUrl('')}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleImageCancel}
                className="flex-1 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleImageAdd}
                disabled={!imageUrl}
                className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Link</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter link (YouTube, etc.)
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    const thumb = getThumbnailUrl(e.target.value);
                    setLinkPreview(thumb);
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              {/* Video Preview */}
              {linkPreview && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-500 mb-2">Video Preview</p>
                  <img
                    src={linkPreview}
                    alt="Video thumbnail"
                    className="w-full max-w-full rounded-lg"
                  />
                  <p className="text-xs text-blue-600 mt-2">Will be embedded as video card</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Width
                  </label>
                  <select
                    value={linkWidth}
                    onChange={(e) => setLinkWidth(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="auto">Auto</option>
                    <option value="100%">Full Width</option>
                    <option value="50%">Half Width</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height
                  </label>
                  <select
                    value={linkHeight}
                    onChange={(e) => setLinkHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="auto">Auto</option>
                    <option value="400px">Medium</option>
                    <option value="600px">Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleLinkCancel}
                className="flex-1 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkAdd}
                disabled={!linkUrl}
                className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {ToastComponent}
    </div>
  );
};

export default Editor;
