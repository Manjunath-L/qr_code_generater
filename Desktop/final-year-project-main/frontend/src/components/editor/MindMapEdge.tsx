import { memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, MarkerType } from '@xyflow/react';

function MindMapEdge({ id, source, target, sourceX, sourceY, targetX, targetY }: EdgeProps) {
  // Calculate a bezier curve path
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  
  return (
    <BaseEdge 
      id={id}
      path={edgePath} 
      style={{
        strokeWidth: 2,
        stroke: '#F6AD55', // Orange color
      }}
      markerEnd={MarkerType.ArrowClosed}
    />
  );
}

export default memo(MindMapEdge);