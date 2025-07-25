import React, { useMemo } from 'react';

interface VirtualMasonryGridProps {
  items?: Array<any>;
  renderItem?: (item: any, index: number) => React.ReactNode;
  columnCount?: number;
  gap?: number;
  className?: string;
}

export const VirtualMasonryGrid: React.FC<VirtualMasonryGridProps> = ({
  items = [],
  renderItem,
  columnCount = 3,
  gap = 16,
  className = ''
}) => {
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => [] as any[]);
    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      cols[columnIndex].push({ item, index });
    });
    return cols;
  }, [items, columnCount]);

  const defaultRenderItem = (item: any, index: number) => (
    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="text-gray-600">Item {index}</div>
    </div>
  );

  return (
    <div
      className={`virtual-masonry-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col" style={{ gap: `${gap}px` }}>
          {column.map(({ item, index }) =>
            renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
          )}
        </div>
      ))}
    </div>
  );
};
