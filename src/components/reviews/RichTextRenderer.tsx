import React from 'react';

interface RichTextRendererProps {
  content: any[];
  mentions?: string[];
  hashtags?: string[];
  maxLines?: number;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  mentions = [],
  hashtags = [],
  maxLines
}) => {
  const textContent = Array.isArray(content)
    ? content.map(c => typeof c === 'object' ? c.content || '' : c).join('')
    : String(content);

  const style = maxLines ? {
    display: '-webkit-box',
    WebkitLineClamp: maxLines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden'
  } : {};

  return (
    <div className="rich-text" style={style}>
      {textContent}
    </div>
  );
};
