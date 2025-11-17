import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Field, ChequeTemplate } from '../types';

interface ChequeEditorProps {
  template: ChequeTemplate | null;
  updateField: (id: string, value: Partial<Field>) => void;
  printOffset: { x: number, y: number };
  selectedFieldId?: string | null;
  onFieldSelect?: (fieldId: string | null) => void;
  previewMode?: boolean;
}

type DragAction = 'move' | 'resize-br' | null;

const DraggableField: React.FC<{ 
  field: Field; 
  onUpdate: (id: string, value: Partial<Field>) => void; 
  parentRef: React.RefObject<HTMLDivElement>;
  isSelected: boolean;
  onSelect: () => void;
  previewMode?: boolean;
}> = ({ field, onUpdate, parentRef, isSelected, onSelect, previewMode }) => {
  const [dragAction, setDragAction] = useState<DragAction>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });
  
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, action: DragAction) => {
    if (previewMode) return;
    e.preventDefault();
    e.stopPropagation();
    if (action === 'move') {
      onSelect();
    }
    setDragAction(action);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { x: field.x, y: field.y, width: field.width, height: field.height };
  }, [field, onSelect, previewMode]);

  useEffect(() => {
    if (!dragAction) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      
      let newPos: Partial<Field> = {};

      if (dragAction === 'move') {
        newPos = {
          x: elementStartPos.current.x + dx,
          y: elementStartPos.current.y + dy,
        };
      } else if (dragAction === 'resize-br' && field.isResizable) {
        newPos = {
          width: Math.max(20, elementStartPos.current.width + dx),
          height: Math.max(15, elementStartPos.current.height + dy),
        };
      }

      const parentBounds = parentRef.current?.getBoundingClientRect();
      if (parentBounds) {
        if(newPos.x !== undefined) newPos.x = Math.max(0, Math.min(newPos.x, parentBounds.width - (newPos.width || field.width)));
        if(newPos.y !== undefined) newPos.y = Math.max(0, Math.min(newPos.y, parentBounds.height - (newPos.height || field.height)));
      }

      onUpdate(field.id, newPos);
    };

    const handleMouseUp = () => {
      setDragAction(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragAction, field, onUpdate, parentRef]);

  const isEmpty = !field.value || field.value.trim() === '';
  const fieldClassName = `absolute select-none p-1 border border-dashed printable-field ${
    isEmpty ? 'field-empty' : ''
  } ${
    previewMode 
      ? 'border-gray-400 bg-white bg-opacity-90' 
      : isSelected 
        ? 'field-selected border-blue-500 bg-blue-500 bg-opacity-20' 
        : 'border-blue-500 bg-blue-500 bg-opacity-10 hover:bg-opacity-20'
  } ${dragAction ? 'field-dragging z-20' : 'z-10'} ${previewMode ? 'cursor-default' : 'cursor-move'}`;

  return (
    <div
      className={fieldClassName}
      data-field-id={field.id}
      style={{
        left: `${field.x}px`,
        top: `${field.y}px`,
        width: `${field.width}px`,
        height: `${field.height}px`,
        fontSize: `${field.fontSize}px`,
        fontWeight: field.fontWeight,
        textAlign: field.textAlign,
        fontFamily: field.fontFamily,
      }}
      onMouseDown={(e) => !previewMode && handleMouseDown(e, 'move')}
      onClick={(e) => {
        e.stopPropagation();
        if (!previewMode) onSelect();
      }}
    >
      <div className="w-full h-full overflow-hidden" style={{ 
        fontFamily: field.fontFamily,
        direction: field.textAlign === 'right' ? 'rtl' : field.textAlign === 'left' ? 'ltr' : field.textAlign === 'center' ? 'ltr' : 'rtl',
        textAlign: field.textAlign
      }}>
        {field.value || <span className="text-gray-400 italic empty-placeholder">Empty</span>}
      </div>
      {!previewMode && field.isResizable && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
          onMouseDown={(e) => handleMouseDown(e, 'resize-br')}
        />
      )}
      {!previewMode && isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded field-label-tag no-print">
          {field.id}
        </div>
      )}
    </div>
  );
};


export const ChequeEditor: React.FC<ChequeEditorProps> = ({ 
  template, 
  updateField, 
  printOffset,
  selectedFieldId,
  onFieldSelect,
  previewMode = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Don't deselect if clicking inside the editor
      if (editorRef.current && editorRef.current.contains(target)) {
        return;
      }
      // Don't deselect if clicking inside controls panel or other UI elements
      const clickedElement = target as HTMLElement;
      const isInControlsPanel = clickedElement.closest('.no-print') !== null;
      const isInFormControl = clickedElement.closest('input, select, textarea, button') !== null;
      
      if (!isInControlsPanel && !isInFormControl && editorRef.current && !editorRef.current.contains(target)) {
        onFieldSelect?.(null);
      }
    };
    if (!previewMode) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [onFieldSelect, previewMode]);

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-900 printable-container">
        <p className="text-gray-500 dark:text-gray-400">Select a bank and template to begin.</p>
      </div>
    );
  }

  const mmToPx = (mm: number) => mm * 3.7795275591;

  const printStyle = {
    transform: `translate(${mmToPx(printOffset.x)}px, ${mmToPx(printOffset.y)}px)`,
    '--print-offset-x': `${mmToPx(printOffset.x)}px`,
    '--print-offset-y': `${mmToPx(printOffset.y)}px`,
  } as React.CSSProperties;

  // Data attributes as fallback if CSS vars don't work in print
  const printAreaProps = {
    'data-print-offset-x': mmToPx(printOffset.x),
    'data-print-offset-y': mmToPx(printOffset.y),
  };

  return (
    <div className={`printable-container flex-1 p-8 bg-gray-200 dark:bg-gray-900 overflow-auto ${previewMode ? 'preview-mode' : ''}`}>
      <div 
        className="print-area mx-auto"
        style={printStyle}
        {...printAreaProps}
      >
        <div
          ref={editorRef}
          className="relative shadow-lg bg-white"
          style={{ width: `${template.width}px`, height: `${template.height}px` }}
        >
          <img
            src={template.imageUrl}
            alt={template.name}
            className="absolute top-0 left-0 w-full h-full object-contain cheque-bg-image pointer-events-none"
            draggable="false"
          />
          {template.fields.map((field) => (
            <DraggableField 
              key={field.id} 
              field={field} 
              onUpdate={updateField} 
              parentRef={editorRef}
              isSelected={selectedFieldId === field.id}
              onSelect={() => onFieldSelect?.(field.id)}
              previewMode={previewMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
