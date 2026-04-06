import React from "react";

export default function HelpPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="material-icons mr-2 text-primary-500">view_module</span>
              Dashboard
            </h2>
            <p className="mb-4">The dashboard provides an overview of your projects and recent activities.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>View all your saved projects in one place</li>
              <li>Access recently edited items quickly</li>
              <li>Create new projects from templates</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="material-icons mr-2 text-primary-500">share</span>
              Mind Map
            </h2>
            <p className="mb-4">Create visual mind maps to organize your thoughts and ideas.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Add nodes by clicking the + button</li>
              <li>Connect related concepts with lines</li>
              <li>Customize colors and styles of your nodes</li>
              <li>Export your mind maps as images</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="material-icons mr-2 text-primary-500">account_tree</span>
              Flowchart
            </h2>
            <p className="mb-4">Design professional flowcharts to visualize processes and workflows.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Drag and drop shapes from the toolbar</li>
              <li>Connect shapes with arrows</li>
              <li>Add decision points and branches</li>
              <li>Save and share your flowcharts</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="material-icons mr-2 text-primary-500">auto_awesome</span>
              AI Generator
            </h2>
            <p className="mb-4">Use AI to generate ideas, content, and visualizations.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Generate mind map suggestions based on a topic</li>
              <li>Create flowchart templates for common processes</li>
              <li>Get AI-powered recommendations to improve your diagrams</li>
              <li>Convert text descriptions into visual representations</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">How do I save my work?</h3>
              <p className="text-neutral-600">Your work is automatically saved as you make changes. You can also manually save by pressing Ctrl+S or using the Save button in the toolbar.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Can I share my diagrams with others?</h3>
              <p className="text-neutral-600">Yes, you can share your diagrams by using the Share button in the top-right corner of the editor. You can generate a link or export the diagram as an image or PDF.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Is this application free to use?</h3>
              <p className="text-neutral-600">Yes, this application is completely free to use with no premium tiers or paid features.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Is there a limit to how many projects I can create?</h3>
              <p className="text-neutral-600">There is no limit to the number of projects you can create. Feel free to create as many diagrams as you need.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center pb-8">
          <p className="text-neutral-600">Still need help? Contact us at <a href="mailto:manjumanju890734897453@gmail.com" className="text-primary-500 hover:underline">manjumanju890734897453@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
} 