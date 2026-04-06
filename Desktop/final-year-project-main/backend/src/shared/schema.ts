import { z } from "zod";

// Define diagram types
export const diagramTypeSchema = z.enum(['mindmap', 'flowchart']);
export type DiagramType = z.infer<typeof diagramTypeSchema>;

// Define types without database dependencies
export interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
}

export interface InsertUser {
  username: string;
  password: string;
  email: string;
}

export interface Project {
  id: number;
  userId?: number;
  name: string;
  type: string; // 'mindmap' or 'flowchart'
  data: any; // Store the diagram data as JSON
  thumbnail?: string; // Base64 encoded thumbnail image
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertProject {
  userId?: number;
  name: string;
  type: string;
  data: any; // Must match Project interface
  thumbnail?: string;
}

export interface Template {
  id: number;
  name: string;
  type: string; // 'mindmap' or 'flowchart'
  data: any; // Store the template data as JSON
  thumbnail?: string; // Base64 encoded thumbnail image
  description?: string;
}

export interface InsertTemplate {
  name: string;
  type: string;
  data: any;
  thumbnail?: string;
  description?: string;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email()
});

// Mind Map Data Schema
export const mindMapNodeSchema = z.object({
  id: z.string(),
  text: z.string(),
  children: z.array(z.string()).default([])
});

export const mindMapDataSchema = z.object({
  rootId: z.string(),
  nodes: z.record(z.string(), mindMapNodeSchema)
});

// Flowchart Data Schema
export const flowchartNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    label: z.string(),
  }).and(z.record(z.string(), z.any())),
  position: z.object({
    x: z.number(),
    y: z.number()
  })
});

export const flowchartEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  data: z.record(z.string(), z.any()).optional()
});

export const flowchartDataSchema = z.object({
  nodes: z.array(flowchartNodeSchema),
  edges: z.array(flowchartEdgeSchema)
});

// Update the project schema to use the specific data schemas
export const insertProjectSchema = z.object({
  userId: z.number().optional(),
  name: z.string(),
  type: z.enum(['mindmap', 'flowchart']),
  data: z.union([mindMapDataSchema, flowchartDataSchema]),
  thumbnail: z.string().optional()
});

export const insertTemplateSchema = z.object({
  name: z.string(),
  type: z.string(),
  data: z.any(),
  thumbnail: z.string().optional(),
  description: z.string().optional()
});
