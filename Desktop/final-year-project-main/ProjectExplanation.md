# ConceptCrafter Project Documentation

## Overview
ConceptCrafter is a web application that allows users to create, edit, and manage both flowcharts and mind maps. The project uses modern web technologies and provides an intuitive interface for visual diagram creation.

## Core Components

### 1. Flowchart Editor (`client/src/components/editor/FlowchartEditor.tsx`)

**Purpose:**
- Main component for creating and editing flowcharts
- Provides an interactive canvas with drag-and-drop functionality
- Handles node and edge management

**Key Features:**
- Interactive node creation and connection
- Auto-layout functionality
- Node property customization
- Real-time updates and state management
- Minimap for navigation
- Background grid and controls

**Code Structure:**
```typescript
// Main wrapper component with ReactFlow context
export default function FlowchartEditor(props: FlowchartEditorProps)

// Content component with actual functionality
function FlowchartEditorContent({ initialNodes, initialEdges, onSave })
```

**Data Flow:**
1. User interacts with canvas → Updates node/edge states
2. Property changes → Updates node appearance
3. Save action → Triggers callback to parent component
4. Auto-layout → Reorganizes nodes for better visualization

### 2. Flowchart Utilities (`client/src/lib/flowchartUtils.ts`)

**Purpose:**
- Provides core functionality for flowchart operations
- Handles data structure management
- Implements layout algorithms

**Key Features:**
- Node and edge creation
- Data validation
- Auto-layout algorithm
- Connection management

**Important Interfaces:**
```typescript
interface FlowchartNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    [key: string]: any;
  };
}

interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: {
    label?: string;
    [key: string]: any;
  };
}
```

### 3. Mind Map Editor (Similar Structure)
- Follows similar patterns to Flowchart Editor
- Specialized for hierarchical relationships
- Different node styling and connection rules

## Key Libraries and Dependencies

1. **ReactFlow (`@xyflow/react`)**
   - Handles the interactive canvas
   - Provides drag-and-drop functionality
   - Manages node and edge rendering

2. **UUID**
   - Generates unique identifiers for nodes and edges

3. **React and TypeScript**
   - Core framework and type system
   - Component-based architecture

## Data Flow

1. **User Input → Visual Output**
   ```
   User Action → React State Update → ReactFlow Render → Visual Update
   ```

2. **Save Operation**
   ```
   Save Button → Collect State → API Call → Server Storage → Success Toast
   ```

3. **Auto Layout**
   ```
   Trigger → Load Algorithm → Apply Layout → Update Positions → Re-render
   ```

## Best Practices Used

1. **Type Safety**
   - Comprehensive TypeScript interfaces
   - Strict type checking
   - Clear data structures

2. **Component Structure**
   - Clear separation of concerns
   - Reusable utilities
   - Modular design

3. **State Management**
   - React hooks for local state
   - Memoization for performance
   - Controlled updates

## Areas for Improvement

1. **Performance Optimization**
   - Large diagram handling
   - Render optimization for complex layouts
   - Caching strategies

2. **Error Handling**
   - More comprehensive error states
   - Better user feedback
   - Recovery mechanisms

3. **Code Organization**
   - Further modularization
   - Shared utilities consolidation
   - Documentation improvements

## Usage Examples

### Creating a New Flowchart
```typescript
// Initialize with default nodes
const defaultNodes = [
  {
    id: '1',
    type: 'terminal',
    data: { label: 'Start', color: '#90EE90' },
    position: { x: 250, y: 5 },
  }
];

// Add new node
const addNode = () => {
  addNodeWithType('process', 'New Process');
};
```

### Applying Auto Layout
```typescript
const autoLayout = () => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = 
    applyAutoLayout(flowchartNodes, edges);
  setNodes(layoutedNodes);
  setEdges(layoutedEdges);
};
```

## Future Enhancements

1. **Collaboration Features**
   - Real-time multi-user editing
   - Comments and annotations
   - Version control

2. **Export Options**
   - Multiple format support
   - High-resolution export
   - Template system

3. **Advanced Features**
   - Custom node types
   - Advanced layout algorithms
   - Integration with other tools

## Troubleshooting Common Issues

1. **Layout Issues**
   - Check node connections
   - Verify data structure
   - Ensure proper type casting

2. **Performance Problems**
   - Limit node count
   - Use memoization
   - Implement pagination

3. **Save Errors**
   - Validate data before save
   - Check API connectivity
   - Handle edge cases

## Contributing Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use consistent formatting
   - Add proper documentation

2. **Testing**
   - Write unit tests
   - Add integration tests
   - Test edge cases

3. **Pull Requests**
   - Clear description
   - Focused changes
   - Include tests 

### Frontend-Backend Communication

**Overview:**
The front end and back end communicate through RESTful API calls. The front end sends requests to the server, which processes them and returns responses. This interaction is crucial for saving and loading diagrams, as well as handling user authentication and other operations.

**Key Components:**

1. **API Requests (`client/src/lib/queryClient.ts`):**
   - The `apiRequest` function is used to make HTTP requests to the server.
   - Supports different HTTP methods like GET, POST, PUT, and DELETE.
   - Handles JSON data and includes error handling.

   ```typescript
   export async function apiRequest(
     method: string,
     url: string,
     data?: unknown
   ): Promise<Response> {
     const res = await fetch(url, {
       method,
       headers: data ? { "Content-Type": "application/json" } : {},
       body: data ? JSON.stringify(data) : undefined,
       credentials: "include",
     });

     await throwIfResNotOk(res);
     return res;
   }
   ```

2. **Server Routes (`server/routes.ts`):**
   - Defines endpoints for handling requests related to projects, templates, and AI generation.
   - Uses Express.js to manage routing and middleware.
   - Validates and processes incoming data, then interacts with storage.

   ```typescript
   app.post("/api/projects", async (req: Request, res: Response) => {
     // Handle project creation
   });

   app.put("/api/projects/:id", async (req: Request, res: Response) => {
     // Handle project updates
   });
   ```

**Data Flow:**

1. **User Action → API Request:**
   - User interacts with the UI (e.g., clicking save).
   - Front end collects data and sends an API request using `apiRequest`.

2. **Server Processing:**
   - Server receives the request and processes it.
   - Validates data and performs necessary operations (e.g., saving to database).

3. **Response Handling:**
   - Server sends a response back to the front end.
   - Front end processes the response and updates the UI accordingly.

**Example: Saving a Mind Map:**

1. User clicks "Save" → `handleSave` function is triggered.
2. `apiRequest` sends a POST or PUT request to `/api/projects`.
3. Server processes the request and updates the project.
4. Response is received, and a success message is shown to the user.

This communication ensures that the application remains responsive and data is consistently managed between the client and server. 