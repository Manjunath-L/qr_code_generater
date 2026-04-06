## Backend Snippets

### Server Entry Point (`server/index.ts`)
Initializes Express, registers routes, and starts the server.

```typescript
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json()); 

(async () => {
  const server = await registerRoutes(app); 

  
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  
  const port = process.env.PORT || 5000;
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
})();
```

### Core AI Generation Route (`server/routes.ts`)
Defines the endpoint for AI-based diagram generation.

```typescript
import type { Express, Request, Response } from "express";
import axios from "axios"; 
import { z } from "zod"; 

export async function registerRoutes(app: Express): Promise<Server> {
  

  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      const { type, prompt, options } = req.body;
      

      const apiKey = process.env.GEMINI_API_KEY || '...';
      const systemPrompt = "..."; 
      
      
      const response = await axios({
        method: 'post',
        url: 'https://generativelanguage.googleapis.com/...',
        headers: {  },
        data: {  }
      });

      
      const jsonResult = JSON.parse(processedText);

      return res.json(jsonResult);
    } catch (error: any) {
      console.error("AI generation error:", error.message);
      return res.status(500).json({ message: "Failed to generate diagram with AI..." });
    }
  });

  
  return httpServer;
}
```

### Data Storage Interface (`server/storage.ts`)
Defines the contract for data operations.

```typescript
import { type Project, type InsertProject, type Template, ... } from "@shared/schema";


export interface IStorage {
  getProjects(userId?: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  
}




import { MemStorage } from './storage-implementation'; 
export const storage: IStorage = new MemStorage(); 
```

## Frontend Snippets

### Application Entry Point (`client/src/main.tsx`)
Initializes React and renders the main `App` component.

```typescript
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient"; 


createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}> 
    <App /> 
  </QueryClientProvider>
);
```

### Main Application Component (`client/src/App.tsx`)
Defines the root layout and client-side routing.

```typescript
import { Switch, Route } from "wouter"; 
import Dashboard from "@/pages/Dashboard";
import MindMapPage from "@/pages/MindMapPage";
import FlowchartPage from "@/pages/FlowchartPage";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";


function App() {
  

  return (
    <div className="h-screen flex flex-col">  
        <>  
          <Navbar/>
          <div className="flex-1 flex overflow-hidden">  
            <Sidebar />
            <main className="flex-1 overflow-hidden">  
              
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/mindmap/:id?" component={MindMapPage} />
                <Route path="/flowchart/:id?" component={FlowchartPage} />
                
              </Switch>
            </main>
          </div>
        </>
    </div>
  );
}

export default App;
```

### Editor State Management (`client/src/components/editor/MindMapStore.ts`)
Uses Zustand to manage editor state (nodes, edges).

```typescript
import {
  applyNodeChanges, applyEdgeChanges,
  type Node, type Edge, type NodeChange, type EdgeChange, type XYPosition,
} from '@xyflow/react'; 
import { create } from 'zustand'; 
import { nanoid } from 'nanoid/non-secure';

export type NodeData = { label: string; ... }; 


type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addChildNode: (parentNode: Node<NodeData>, position: XYPosition) => void;
  
};


export const useMindMapStore = create<RFState>((set, get) => ({
  nodes: [ ], 
  edges: [],
  
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  
  
  addChildNode: (parentNode, position) => {
    const newNode = {  id: nanoid(), type: 'mindmap', ... };
    const newEdge = {  id: nanoid(), source: parentNode.id, target: newNode.id };
    set({ nodes: [...get().nodes, newNode], edges: [...get().edges, newEdge] });
  },
  
}));
``` 