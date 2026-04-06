import { Link } from "wouter";
import { MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Project, DiagramType, diagramTypeSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import AnimatedThumbnail from "./AnimatedThumbnail";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { toast } = useToast();
  
  const getIconByType = (type: string) => {
    return type === 'mindmap' ? 'share' : 'account_tree';
  };
  
  const getProjectLink = (project: Project) => {
    return project.type === 'mindmap' ? `/mindmap/${project.id}` : `/flowchart/${project.id}`;
  };

  const handleDelete = async () => {
    try {
      await apiRequest('DELETE', `/api/projects/${project.id}`);
      
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully.',
      });
      
      // Invalidate projects query to mark it stale
      await queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      // Explicitly refetch the query to update the UI immediately
      await queryClient.refetchQueries({ queryKey: ['/api/projects'] });

    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: 'Error',
        description: 'Failed to delete project.',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-200">
      <Link href={getProjectLink(project)}>
        <div className="relative aspect-video bg-neutral-50">
          {project.thumbnail ? (
            <div className="w-full h-full">
              <img 
                src={project.thumbnail} 
                alt={project.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <AnimatedThumbnail 
                type={diagramTypeSchema.parse(project.type)} 
                name={project.name} 
                size="lg" 
              />
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
            <span className="material-icons text-neutral-500 text-sm">
              {getIconByType(project.type)}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-neutral-800">{project.name}</h3>
            <p className="text-xs text-neutral-500 mt-1">
              {project.type === 'mindmap' ? 'Mind Map' : 'Flowchart'} • Updated {formatDate(project.updatedAt)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-neutral-400 hover:text-neutral-500">
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={getProjectLink(project)}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
