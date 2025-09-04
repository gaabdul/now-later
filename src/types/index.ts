export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  tags: string[];
  urgent: boolean;
  important: boolean;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Board {
  id: string;
  name: string;
  tasks: Task[];
}

export type QuadrantType = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

export interface User {
  id: string;
  email?: string;
  isGuest: boolean;
}