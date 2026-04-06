import { Link, useLocation } from "wouter";
import { Template, DiagramType, diagramTypeSchema } from "@shared/schema";
import AnimatedThumbnail from "./AnimatedThumbnail";
import { useState } from "react";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [location] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine where to link based on template type
  const getTemplateLink = () => {
    const baseUrl = template.type === 'mindmap' ? '/mindmap' : '/flowchart';
    // Pass template data as URL parameters
    const params = new URLSearchParams({
      templateId: template.id.toString(),
      name: template.name,
      type: template.type,
      data: JSON.stringify(template.data)
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <Link href={getTemplateLink()}>
      <div 
        className="group cursor-pointer p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center border border-neutral-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`mb-3 relative rounded-lg overflow-hidden transform transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
          {template.thumbnail ? (
            <div>
              <img 
                src={template.thumbnail} 
                alt={template.name} 
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          ) : (
            <AnimatedThumbnail 
              type={diagramTypeSchema.parse(template.type)} 
              name={template.name} 
            />
          )}
        </div>
        <h3 className="font-medium text-neutral-800 transition-colors duration-300 group-hover:text-primary">{template.name}</h3>
        <p className="text-xs text-neutral-500 mt-1">{template.description}</p>
      </div>
    </Link>
  );
}
