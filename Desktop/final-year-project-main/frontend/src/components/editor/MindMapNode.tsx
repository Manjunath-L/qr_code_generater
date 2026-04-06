import { memo, useRef, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import useMindMapStore from './MindMapStore';

interface NodeData {
  label: string;
}

function MindMapNode({ id, data }: NodeProps) {
  // Ensure data exists with defaults
  const label = typeof data?.label === 'string' ? data.label : 'New Topic';
  
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useMindMapStore((state) => state.updateNodeLabel);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  // Handle double click to start editing
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  // Handle blur to finish editing
  const handleBlur = () => {
    setIsEditing(false);
  };
  
  // Handle key press (Enter to finish editing)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(id, e.target.value);
  };

  return (
    <>
      <div 
        className="node-container" 
        onDoubleClick={handleDoubleClick}
      >
        <div className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="node-content">
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="node-input"
              autoFocus
            />
          ) : (
            <div className="node-label">
              {label}
            </div>
          )}
        </div>
      </div>

      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ opacity: 0 }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{ opacity: 0 }}
      />
      <Handle 
        type="source" 
        position={Position.Left}
        style={{ opacity: 0 }}
      />
      <Handle 
        type="source" 
        position={Position.Right}
        style={{ opacity: 0 }}
      />
    </>
  );
}

export default memo(MindMapNode);