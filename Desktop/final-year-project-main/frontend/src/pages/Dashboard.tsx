import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import FeatureCard from '@/components/dashboard/FeatureCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import TemplateCard from '@/components/dashboard/TemplateCard';
import { Project, Template } from '@shared/schema';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  // Fetch projects
  const { 
    data: projects = [], 
    isLoading: projectsLoading 
  } = useQuery({
    queryKey: ['/api/projects'],
  });
  
  // Fetch templates
  const { 
    data: templates = [], 
    isLoading: templatesLoading 
  } = useQuery({
    queryKey: ['/api/templates'],
  });
  
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-neutral-50">
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Dashboard</h1>
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FeatureCard 
          title="Mind Mapping"
          description="Create visual connections between ideas and concepts"
          icon="share"
          color="primary"
          link="/mindmap"
          buttonText="Create Mind Map"
        />
        
        <FeatureCard 
          title="Flowcharting"
          description="Design process flows, algorithms and decision trees"
          icon="account_tree"
          color="secondary"
          link="/flowchart"
          buttonText="Create Flowchart"
        />
        
        <FeatureCard 
          title=" Generation"
          description="Generate diagrams from text descriptions or code"
          icon="auto_awesome"
          color="accent"
          link="/ai-generator"
          buttonText=" Generate"
        />
      </div>
      
      {/* Recent Projects Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral-800">Recent Projects</h2>
          <Button variant="link" className="text-primary-500 hover:text-primary-600 p-0 h-auto">
            View All
          </Button>
        </div>
        
        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200 h-60 animate-pulse">
                <div className="h-40 bg-neutral-100"></div>
                <div className="p-4">
                  <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.slice(0, 4).map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No projects yet</h3>
            <p className="text-neutral-500 mb-4">Create your first project to see it here</p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/mindmap">Create Mind Map</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/flowchart">Create Flowchart</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Examples & Templates Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral-800">Examples & Templates</h2>
          <Button variant="link" className="text-primary-500 hover:text-primary-600 p-0 h-auto">
            Browse Library
          </Button>
        </div>
        
        {templatesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200 animate-pulse">
                <div className="w-24 h-24 bg-neutral-100 rounded-lg mx-auto mb-3"></div>
                <div className="h-4 bg-neutral-100 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-3 bg-neutral-100 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template: Template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
