import React from "react";
import { z } from "zod";

// Define strict types for thumbnail component
const DiagramTypeSchema = z.enum(['mindmap', 'flowchart']);
type DiagramType = z.infer<typeof DiagramTypeSchema>;

interface AnimatedThumbnailProps {
  type: DiagramType;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedThumbnail({ type, name, size = 'md' }: AnimatedThumbnailProps) {
  // Adjust sizes based on the size prop
  const containerClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  // Simple static thumbnail instead of animated
  return (
    <div className={`${containerClasses[size]} rounded-lg flex items-center justify-center bg-neutral-100`}>
      <div className="flex flex-col items-center justify-center">
        <span className="material-icons text-neutral-500 mb-1">
          {type === 'mindmap' ? 'share' : 'account_tree'}
        </span>
        <span className="text-xs text-neutral-500">
          {type === 'mindmap' ? 'Mind Map' : 'Flowchart'}
        </span>
      </div>
    </div>
  );
}