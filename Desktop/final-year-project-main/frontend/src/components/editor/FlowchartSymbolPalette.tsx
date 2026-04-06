import React, { useState } from "react";
import { Node } from "reactflow";

interface FlowchartSymbolPaletteProps {
  onAddNode: (nodeType: string, label: string) => void;
}

// Define symbol types with their labels, descriptions and icons based on the flowchart standards
const symbols = [
  {
    type: "terminal",
    label: "Terminator",
    description: "Start, stop or halt the process",
    icon: (
      <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
        Start/End
      </div>
    ),
  },
  {
    type: "process",
    label: "Process",
    description: "Any operation or activity step",
    icon: (
      <div className="w-12 h-6 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs">
        Process
      </div>
    ),
  },
  {
    type: "predefined",
    label: "Predefined Process",
    description: "Named process(es) defined elsewhere",
    icon: (
      <div className="w-12 h-6 bg-blue-200 border border-blue-400 flex items-center justify-center text-xs relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 border-l border-r border-blue-400"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1 border-l border-r border-blue-400"></div>
        Predefined
      </div>
    ),
  },
  {
    type: "decision",
    label: "Decision",
    description: "Select one of several paths based on a condition",
    icon: (
      <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 transform rotate-45 flex items-center justify-center">
        <span className="transform -rotate-45 text-xs">?</span>
      </div>
    ),
  },
  {
    type: "input",
    label: "Input/Output",
    description: "Input/output of data",
    icon: (
      <div className="w-12 h-6 bg-cyan-100 border border-cyan-300 transform skew-x-12 flex items-center justify-center text-xs">
        <span className="transform -skew-x-12">I/O</span>
      </div>
    ),
  },
  {
    type: "manual_input",
    label: "Manual Input",
    description: "Data or command entry done manually",
    icon: (
      <div
        className="w-12 h-6 bg-orange-100 border border-orange-300 flex items-center justify-center text-xs"
        style={{
          clipPath: "polygon(0% 35%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      >
        Manual
      </div>
    ),
  },
  {
    type: "document",
    label: "Document",
    description: "Printed document or report",
    icon: (
      <div 
        className="w-12 h-6 bg-purple-100 border border-purple-300 flex items-center justify-center text-xs"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 0% 100%)",
        }}
      >
        Doc
      </div>
    ),
  },
  {
    type: "display",
    label: "Display",
    description: "Information displayed to users on screen",
    icon: (
      <div 
        className="w-12 h-6 bg-indigo-200 border border-indigo-400 flex items-center justify-center text-xs"
        style={{
          clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
        }}
      >
        Display
      </div>
    ),
  },
  {
    type: "preparation",
    label: "Preparation",
    description: "Preparation steps or initialization for a process",
    icon: (
      <div 
        className="w-12 h-6 bg-amber-100 border border-amber-300 flex items-center justify-center text-xs"
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      >
        Prep
      </div>
    ),
  },
  {
    type: "connector",
    label: "Connector",
    description: "Links processes on the same page",
    icon: (
      <div className="w-6 h-6 bg-sky-100 border border-sky-300 rounded-full flex items-center justify-center text-xs">
        C
      </div>
    ),
  },
  {
    type: "off_page",
    label: "Off-page Connector",
    description: "Indicates flow continues on another page",
    icon: (
      <div 
        className="w-10 h-6 bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs"
        style={{
          clipPath: "polygon(0% 0%, 80% 0%, 80% 70%, 100% 70%, 80% 100%, 0% 100%)",
        }}
      >
        Link
      </div>
    ),
  },
  {
    type: "database",
    label: "Database",
    description: "Data stored in a database system",
    icon: (
      <div className="w-10 h-6 bg-rose-100 border-t border-b border-rose-300 rounded-t-lg rounded-b-lg relative flex items-center justify-center text-xs">
        <div className="absolute left-0 top-0 bottom-0 w-full h-full border-t border-b border-rose-300 rounded-t-lg rounded-b-lg"></div>
        DB
      </div>
    ),
  },
  {
    type: "data_storage",
    label: "Data Storage",
    description: "Stored data of any kind",
    icon: (
      <div 
        className="w-12 h-6 bg-fuchsia-100 border border-fuchsia-300 flex items-center justify-center text-xs"
        style={{
          borderRadius: "0 10px 10px 0"
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 border-l border-fuchsia-400"></div>
        Storage
      </div>
    ),
  },
  {
    type: "merge",
    label: "Merge",
    description: "Combines multiple processes into one flow",
    icon: (
      <div 
        className="w-6 h-6 bg-teal-100 border border-teal-300 flex items-center justify-center text-xs"
        style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        }}
      >
      </div>
    ),
  },
  {
    type: "delay",
    label: "Delay",
    description: "Waiting period or delay in the process",
    icon: (
      <div className="w-10 h-6 bg-pink-100 border border-pink-300 rounded-r-full flex items-center justify-center text-xs">
        Delay
      </div>
    ),
  },
  {
    type: "alternate_process",
    label: "Alternate Process",
    description: "Alternative to a standard process",
    icon: (
      <div className="w-12 h-6 bg-violet-100 border border-violet-300 rounded-md flex items-center justify-center text-xs">
        Alt
      </div>
    ),
  },
  {
    type: "sort",
    label: "Sort",
    description: "Sorting or organizing items sequentially",
    icon: (
      <div 
        className="w-6 h-6 bg-lime-100 border border-lime-300 flex items-center justify-center text-xs"
        style={{
          clipPath: "polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)",
        }}
      >
        Sort
      </div>
    ),
  },
  {
    type: "annotation",
    label: "Annotation",
    description: "Additional notes or comments about the flowchart",
    icon: (
      <div className="w-12 h-6 flex items-center justify-start">
        <div className="w-4 border-t border-dashed border-gray-500"></div>
        <div className="w-8 h-5 bg-gray-100 border border-gray-300 flex items-center justify-center text-xs">
          Note
        </div>
      </div>
    ),
  },
  {
    type: "summing_junction",
    label: "Summing Junction",
    description: "Logical AND function",
    icon: (
      <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs relative">
        <div className="absolute w-6 h-0.5 bg-blue-300"></div>
        <div className="absolute w-0.5 h-6 bg-blue-300"></div>
      </div>
    ),
  },
  {
    type: "or",
    label: "OR Junction",
    description: "Logical OR function",
    icon: (
      <div className="w-6 h-6 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-xs relative">
        <div className="absolute w-0.5 h-6 bg-pink-300 transform rotate-45"></div>
        <div className="absolute w-0.5 h-6 bg-pink-300 transform -rotate-45"></div>
      </div>
    ),
  }
];

export default function FlowchartSymbolPalette({
  onAddNode,
}: FlowchartSymbolPaletteProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Toggle sidebar expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative flex flex-col border-l border-neutral-200 bg-white overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        width: isExpanded ? 'clamp(250px, 20vw, 300px)' : '60px',
        minWidth: isExpanded ? '200px' : '60px',
        maxHeight: "calc(100vh - 120px)" 
      }}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-200 sticky top-0 bg-white z-10">
        {isExpanded ? (
          <h3 className="font-medium text-neutral-800">Flowchart Symbols</h3>
        ) : (
          <span className="material-icons text-neutral-600 mx-auto">category</span>
        )}
        
        <button
          onClick={toggleExpand}
          className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 focus:outline-none"
        >
          <span className="material-icons text-lg">
            {isExpanded ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>
      </div>

      {/* Symbol list with scroll */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {symbols.map((symbol) => (
            <div
              key={symbol.type}
              className={`flex items-center p-2 border border-neutral-200 rounded-md hover:bg-neutral-50 cursor-pointer transition-colors ${!isExpanded ? 'justify-center' : ''}`}
              onClick={() => onAddNode(symbol.type, symbol.label)}
              title={symbol.description}
            >
              <div className={`flex-shrink-0 ${isExpanded ? 'mr-3' : ''}`}>{symbol.icon}</div>
              {isExpanded && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {symbol.label}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {symbol.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile-friendly footer controls */}
      <div className={`${isExpanded ? 'hidden sm:flex' : 'flex'} justify-center p-2 border-t border-neutral-200 bg-white`}>
        <button 
          className="p-1 text-neutral-500 hover:text-neutral-700 rounded-md hover:bg-neutral-50"
          title="Scroll to top"
          onClick={() => {
            const scrollContainer = document.querySelector('.overflow-y-auto');
            if (scrollContainer) scrollContainer.scrollTop = 0;
          }}
        >
          <span className="material-icons text-lg">arrow_upward</span>
        </button>
      </div>
    </div>
  );
}
