import Paragraph from '@tiptap/extension-paragraph';

export const ParagraphSpacing = Paragraph.extend({
  name: 'paragraph',

  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style') || null,
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {};
          }

          return {
            style: attributes.style,
          };
        },
      },
    };
  },
});