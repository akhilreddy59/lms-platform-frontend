import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Box from '@mui/material/Box';

const SortableItem = ({ id, children, handle = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'relative',
        touchAction: 'none',
      }}
      {...(handle ? {} : { ...attributes, ...listeners })}
    >
      {typeof children === 'function'
        ? children({ attributes, listeners, isDragging })
        : children}
    </Box>
  );
};

export default SortableItem;
