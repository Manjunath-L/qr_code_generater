import mongoose from 'mongoose';
import { User } from './db';
import bcrypt from 'bcrypt';
import { type User as UserType, type InsertUser, type Project, type InsertProject, type Template, type InsertTemplate } from "./src/shared/schema";
import { IStorage } from './storage';

export class MongoStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<UserType | undefined> {
    try {
      const user = await User.findOne({ id });
      if (!user) return undefined;
      
      return {
        id: user.id,
        username: user.username,
        password: user.password
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    try {
      const user = await User.findOne({ username });
      if (!user) return undefined;
      
      return {
        id: user.id,
        username: user.username,
        password: user.password
      };
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(insertUser.password, salt);
      
      // Generate a unique ID
      const lastUser = await User.findOne().sort({ id: -1 });
      const id = lastUser ? lastUser.id + 1 : 1;
      
      // Create the user
      const newUser = new User({
        id,
        username: insertUser.username,
        password: hashedPassword,
        email: insertUser.email
      });
      
      await newUser.save();
      
      return {
        id,
        username: insertUser.username,
        password: hashedPassword
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Project methods - using the same implementation as MemStorage for now
  // These would be replaced with MongoDB implementations in a full solution
  private projects: Map<number, Project> = new Map();
  private projectIdCounter: number = 1;

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

  // Template methods - using the same implementation as MemStorage for now
  private templates: Map<number, Template> = new Map();
  private templateIdCounter: number = 1;

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

  // Helper method to verify password
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}