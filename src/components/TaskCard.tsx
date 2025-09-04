import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Calendar, Plus, X, Edit, GripVertical } from 'lucide-react';
import { Task, Subtask } from '../types';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

export function TaskCard({ task, onUpdateTask, onDeleteTask, onEditTask }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const handleToggleComplete = () => {
    onUpdateTask(task.id, { completed: !task.completed });
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const newSubtaskObj: Subtask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false
    };
    
    onUpdateTask(task.id, { 
      subtasks: [...task.subtasks, newSubtaskObj] 
    });
    setNewSubtask('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
    onUpdateTask(task.id, { subtasks: updatedSubtasks });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate consistent colors for tags based on tag name
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300'
    ];
    
    // Simple hash function to get consistent color for each tag
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      const char = tag.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Card 
      className={`p-4 transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''} cursor-grab active:cursor-grabbing`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={handleToggleComplete}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <h4 className={`leading-tight ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              {onEditTask && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTask(task)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteTask(task.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Summary line */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground pl-7">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            {task.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {task.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    className={`text-xs px-2 py-0 border-0 ${getTagColor(tag)}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expanded content */}
        <CollapsibleContent className="mt-4">
          <div className="space-y-4 pl-7">
            {/* Description */}
            {task.description && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>
            )}

            {/* Subtasks */}
            {task.subtasks.length > 0 && (
              <div>
                <h5 className="mb-2 text-sm">Subtasks</h5>
                <div className="space-y-2">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => handleToggleSubtask(subtask.id)}
                      />
                      <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                        {subtask.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        className="h-4 w-4 p-0 ml-auto text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add subtask */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                className="flex-1 px-3 py-1 text-sm border rounded bg-input-background"
              />
              <Button
                onClick={handleAddSubtask}
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                disabled={!newSubtask.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}