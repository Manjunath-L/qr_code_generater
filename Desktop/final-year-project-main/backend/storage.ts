import { type User, type InsertUser, type Project, type InsertProject, type Template, type InsertTemplate } from "./src/shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(userId?: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private templates: Map<number, Template>;
  private userIdCounter: number;
  private projectIdCounter: number;
  private templateIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.templates = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.templateIdCounter = 1;
    
    // Initialize with some example templates
    this.createDefaultTemplates();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProjects(userId?: number): Promise<Project[]> {
    const allProjects = Array.from(this.projects.values());
    if (userId) {
      return allProjects.filter(project => project.userId === userId);
    }
    return allProjects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      return undefined;
    }
    
    const updatedProject: Project = { 
      ...existingProject, 
      ...projectUpdate,
      updatedAt: new Date()
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Template methods
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templateIdCounter++;
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }

  // Helper to create default templates
  private async createDefaultTemplates() {
    // Process Flowchart template
    this.createTemplate({
      name: "Process Flowchart",
      type: "flowchart",
      description: "Standard template for process documentation",
      data: {
        nodes: [
          { id: '1', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 0 } },
          { id: '2', type: 'default', data: { label: 'Process Step 1' }, position: { x: 250, y: 100 } },
          { id: '3', type: 'default', data: { label: 'Process Step 2' }, position: { x: 250, y: 200 } },
          { id: '4', type: 'output', data: { label: 'End' }, position: { x: 250, y: 300 } }
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: false },
          { id: 'e2-3', source: '2', target: '3', animated: false },
          { id: 'e3-4', source: '3', target: '4', animated: false }
        ]
      },
      thumbnail: ''
    });

    // Brainstorming Map template
    this.createTemplate({
      name: "Brainstorming Map",
      type: "mindmap",
      description: "Ideal for creative thinking sessions",
      data: {
        rootId: '1',
        nodes: {
          '1': { id: '1', text: 'Central Topic', children: ['2', '3', '4'] },
          '2': { id: '2', text: 'Idea 1', children: ['5', '6'] },
          '3': { id: '3', text: 'Idea 2', children: ['7', '8'] },
          '4': { id: '4', text: 'Idea 3', children: ['9', '10'] },
          '5': { id: '5', text: 'Detail 1.1', children: [] },
          '6': { id: '6', text: 'Detail 1.2', children: [] },
          '7': { id: '7', text: 'Detail 2.1', children: [] },
          '8': { id: '8', text: 'Detail 2.2', children: [] },
          '9': { id: '9', text: 'Detail 3.1', children: [] },
          '10': { id: '10', text: 'Detail 3.2', children: [] }
        }
      },
      thumbnail: ''
    });

    // Decision Tree template
    this.createTemplate({
      name: "Decision Tree",
      type: "flowchart",
      description: "For mapping out decision points",
      data: {
        nodes: [
          { id: '1', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 0 } },
          { id: '2', type: 'default', data: { label: 'Decision?' }, position: { x: 250, y: 100 } },
          { id: '3', type: 'default', data: { label: 'Option A' }, position: { x: 100, y: 200 } },
          { id: '4', type: 'default', data: { label: 'Option B' }, position: { x: 400, y: 200 } },
          { id: '5', type: 'output', data: { label: 'Result A' }, position: { x: 100, y: 300 } },
          { id: '6', type: 'output', data: { label: 'Result B' }, position: { x: 400, y: 300 } }
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: false },
          { id: 'e2-3', source: '2', target: '3', label: 'Yes', animated: false },
          { id: 'e2-4', source: '2', target: '4', label: 'No', animated: false },
          { id: 'e3-5', source: '3', target: '5', animated: false },
          { id: 'e4-6', source: '4', target: '6', animated: false }
        ]
      },
      thumbnail: ''
    });

    // Concept Map template
    this.createTemplate({
      name: "Concept Map",
      type: "mindmap",
      description: "Connect complex ideas and concepts",
      data: {
        rootId: '1',
        nodes: {
          '1': { id: '1', text: 'Main Concept', children: ['2', '3', '4'] },
          '2': { id: '2', text: 'Concept 1', children: ['5', '6'] },
          '3': { id: '3', text: 'Concept 2', children: ['7', '8'] },
          '4': { id: '4', text: 'Concept 3', children: ['9', '10'] },
          '5': { id: '5', text: 'Detail 1.1', children: [] },
          '6': { id: '6', text: 'Detail 1.2', children: [] },
          '7': { id: '7', text: 'Detail 2.1', children: [] },
          '8': { id: '8', text: 'Detail 2.2', children: [] },
          '9': { id: '9', text: 'Detail 3.1', children: [] },
          '10': { id: '10', text: 'Detail 3.2', children: [] }
        }
      },
      thumbnail: ''
    });
  }
}

export const storage = new MemStorage();
