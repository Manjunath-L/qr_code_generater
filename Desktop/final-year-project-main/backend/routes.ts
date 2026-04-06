import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { insertProjectSchema, insertTemplateSchema } from "./src/shared/schema";
import type { InsertProject } from "./src/shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { mindMapDataSchema, flowchartDataSchema } from "./src/shared/schema";
import { connectToDatabase } from "./db";
import authRoutes from "./src/routes/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Connect to MongoDB
  await connectToDatabase();

  // Register authentication routes
  app.use("/api/auth", authRoutes);

  // Projects Routes
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const project = await storage.getProject(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      // Add default empty data if not provided
      const projectData = { ...req.body };
      if (!projectData.data) {
        projectData.data = {}; // Default empty data
      }

      // Validate request body
      const validatedData = insertProjectSchema.parse(projectData);

      // Explicitly cast to InsertProject to ensure data is present
      const insertData: InsertProject = {
        name: validatedData.name,
        type: validatedData.type,
        data: validatedData.data || {},
        userId: validatedData.userId,
        thumbnail: validatedData.thumbnail,
      };

      // Create project
      const project = await storage.createProject(insertData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          details: validationError.message,
          errors: error.errors,
        });
      }
      console.error("Error creating project:", error);
      res.status(500).json({
        message: "Failed to create project",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      // Validate project exists
      const existingProject = await storage.getProject(id);
      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Validate the update data
      const updateData = { ...req.body };
      if (updateData.data) {
        // Validate data based on project type
        if (existingProject.type === "mindmap") {
          mindMapDataSchema.parse(updateData.data);
        } else if (existingProject.type === "flowchart") {
          flowchartDataSchema.parse(updateData.data);
        }
      }

      // Update project
      const updatedProject = await storage.updateProject(id, updateData);
      if (!updatedProject) {
        return res.status(500).json({ message: "Failed to update project" });
      }
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          details: validationError.message,
          errors: error.errors,
        });
      }
      console.error("Error updating project:", error);
      res.status(500).json({
        message: "Failed to update project",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      // Check if project exists
      const existingProject = await storage.getProject(id);
      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Delete project
      const success = await storage.deleteProject(id);

      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete project" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Templates Routes
  app.get("/api/templates", async (req: Request, res: Response) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const template = await storage.getTemplate(id);

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      const { type, prompt, options } = req.body;

      if (!type || !prompt) {
        return res
          .status(400)
          .json({ message: "Type and prompt are required" });
      }

      // Validate type
      if (type !== "mindmap" && type !== "flowchart") {
        return res
          .status(400)
          .json({ message: "Type must be either 'mindmap' or 'flowchart'" });
      }
      const apiKey = process.env.OPENROUTER_API_KEY || "";

      // Construct system prompt based on diagram type
      let systemPrompt = "";
      if (type === "mindmap") {
        systemPrompt = `Create a mind map structure based on the user's input topic: "${prompt}".
        Output MUST be valid JSON with exactly this structure:
        {
          "rootId": "1",
          "nodes": {
            "1": { 
              "id": "1", 
              "text": "Central Topic",  
              "children": ["2", "3"],
              "color": "#4CAF50"
            },
            "2": {
              "id": "2", 
              "text": "Main Branch 1", 
              "children": ["4", "5"],
              "color": "#2196F3"
            }
          }
        }
        
        Requirements:
        1. The "rootId" must be "1" and point to the central topic node
        2. Each node MUST have "id", "text", and "children" properties
        3. Node IDs must be unique strings (can be numbers as strings)
        4. Use descriptive, short text for each node
        5. Include "color" property with hex color values for each node
        6. Create a hierarchical structure with meaningful branches
        7. Respond ONLY with valid JSON, no other text`;
      } else {
        systemPrompt = `Create a flowchart structure based on the user's input process: "${prompt}".
        Output MUST be valid JSON with exactly this structure:
        {
          "nodes": [
            {
              "id": "1",
              "type": "terminal",
              "data": { "label": "Start", "color": "#90EE90" },
              "position": { "x": 250, "y": 0 }
            },
            {
              "id": "2",
              "type": "process", 
              "data": { "label": "Process Step", "color": "#ADD8E6" },
              "position": { "x": 250, "y": 100 }
            }
          ],
          "edges": [
            { 
              "id": "e1-2", 
              "source": "1", 
              "target": "2",
              "label": null,
              "animated": false,
              "markerEnd": { "type": "arrowclosed" }
            }
          ]
        }
        
        Requirements:
        1. Use these node types correctly:
           - "terminal" for start/end nodes (oval shaped, for "Start" and "End" nodes only)
           - "process" for process steps (rectangle)
           - "decision" for yes/no decisions (diamond)
           - "input" for input operations (parallelogram)
           - "output" for output operations (parallelogram)
           - "document" for document outputs
           - "manual_input" for manual input operations
           - "display" for information display
           - "preparation" for initialization steps
           - "connector" for flow connections
           - "data_storage" for data storage operations
           - "database" for database operations
           - "merge" for combining flows
           - "delay" for waiting periods
           - "alternate_process" for alternative steps

        2. Node color coding is mandatory:
           - For terminal "Start" nodes, use color: "#90EE90" (light green)
           - For terminal "End" nodes, use color: "#FFB6C1" (light red)
           - For decision nodes, use color: "#FFFACD" (light yellow)
           - For process nodes, use color: "#ADD8E6" (light blue)
           - For input nodes, use color: "#F0E68C" (light gold)
           - For output nodes, use color: "#D8BFD8" (light purple)
           - For document nodes, use color: "#FFE4B5" (light orange)

        3. Each node MUST have id, type, data.label, data.color, and position properties
        4. Each edge MUST have id, source, target, animated:false, and markerEnd:{"type":"arrowclosed"}
        5. Label all edges between decision nodes and their targets. Decision nodes MUST have TWO outgoing edges:
           - Edge from decision to Yes path must have label: "Yes" 
           - Edge from decision to No path must have label: "No"
           - Yes path should be on the LEFT side of the decision (lower x position)
           - No path should be on the RIGHT side of the decision (higher x position)
           - For edges from decision nodes, include sourceHandle:"left" or sourceHandle:"right"

        6. Position nodes precisely:
           - First node (Start) at x:250, y:0
           - Vertical distance between primary flow nodes: 100px
           - Branching nodes (from decision Yes/No):
             * Yes branch: 150px to the left (x - 150)
             * No branch: 150px to the right (x + 150)
             * Place both at y + 100 from decision node's y position

        7. Create a professional flowchart structure:
           - ALWAYS start with a terminal node labeled "Start"
           - ALWAYS end with at least one terminal node labeled "End"
           - Ensure all branches eventually connect back to the main flow or end node
           - For parallel processes, keep them properly aligned vertically
           - Ensure proper logical flow with no dead ends or disconnected nodes

        8. For every decision node:
           - Make sure the question in the label ends with a question mark
           - Position its two branches at exactly opposite sides (left/right)
           - Label paths precisely as "Yes" and "No", not "True/False" or other variants
           - Connect both branches eventually to a merge point or to separate end nodes

        9. Respond ONLY with valid JSON, no other text`;
      }

      // Complexity adjustment based on options
      const complexity = options?.complexity || "medium";
      let nodeCount = 8; // Default for medium complexity
      if (complexity === "simple") nodeCount = 5;
      if (complexity === "complex") nodeCount = 15;
      if (complexity === "comprehensive") nodeCount = 20;

      console.log(
        `Generating ${type} with complexity: ${complexity}, node count: ${nodeCount}`
      );

      try {
        console.log(
          "Making OpenRouter API request with Llama-4-Maverick model"
        );

        // Use OpenRouter API to access Llama-4-Maverick model
        const response = await axios({
          method: "post",
          url: "https://openrouter.ai/api/v1/chat/completions",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:5000", // Replace with your actual site URL
            "X-Title": "Diagram Generator",
          },
          data: {
            model: "google/gemma-3-27b-it:free",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: `Create a ${type} with approximately ${nodeCount} nodes that represents: ${prompt}\n\nRespond ONLY with valid JSON, nothing else.`,
              },
            ],
            temperature: 0.1,
            max_tokens: 8192,
          },
        });
        console.log("API response received");

        if (!response.data?.choices?.[0]?.message?.content) {
          console.error(
            "Invalid API response structure:",
            JSON.stringify(response.data)
          );
          return res.status(500).json({
            message: "AI generation failed. Invalid response structure.",
          });
        }

        let generatedText = response.data.choices[0].message.content;
        console.log("Generated text length:", generatedText.length);

        // Clean up the response to extract valid JSON
        generatedText = generatedText.trim();
        if (generatedText.startsWith("```json")) {
          generatedText = generatedText.substring(7);
        } else if (generatedText.startsWith("```")) {
          generatedText = generatedText.substring(3);
        }

        if (generatedText.endsWith("```")) {
          generatedText = generatedText.substring(0, generatedText.length - 3);
        }

        generatedText = generatedText.trim();

        try {
          const jsonResult = JSON.parse(generatedText);
          console.log("JSON parsed successfully");

          // Validate the structure based on type
          if (type === "mindmap") {
            if (!jsonResult.rootId || !jsonResult.nodes) {
              console.error(
                "Invalid mind map structure:",
                Object.keys(jsonResult)
              );
              throw new Error(
                "Invalid mind map structure: missing rootId or nodes"
              );
            }
          } else if (type === "flowchart") {
            if (
              !Array.isArray(jsonResult.nodes) ||
              !Array.isArray(jsonResult.edges)
            ) {
              console.error(
                "Invalid flowchart structure:",
                Object.keys(jsonResult)
              );
              throw new Error(
                "Invalid flowchart structure: nodes or edges not an array"
              );
            }
          }

          console.log("Returning generated content");
          return res.json(jsonResult);
        } catch (jsonError: any) {
          console.error("Failed to parse AI response as JSON:", jsonError);
          console.error("Raw text from API:", generatedText);
          return res.status(500).json({
            message: "AI generation produced invalid JSON response.",
            error: jsonError?.message || "Unknown JSON parsing error",
          });
        }
      } catch (apiError: any) {
        console.error("API request failed:", apiError.message);
        console.error("API error response:", apiError.response?.data);
        return res.status(500).json({
          message: "Failed to communicate with AI service: " + apiError.message,
        });
      }
    } catch (error: any) {
      console.error("AI generation error:", error.message);
      return res.status(500).json({
        message: "Failed to generate diagram with AI: " + error.message,
      });
    }
  });

  return httpServer;
}
