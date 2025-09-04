import { Task, QuadrantType } from '../types';
import { TaskCard } from './TaskCard';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (quadrant: QuadrantType) => void;
  onEditTask?: (task: Task) => void;
}

export function EisenhowerMatrix({ tasks, onUpdateTask, onDeleteTask, onAddTask, onEditTask }: EisenhowerMatrixProps) {
  const activeTasks = tasks.filter(task => !task.completed);

  const getTasksByQuadrant = (urgent: boolean, important: boolean) => {
    return activeTasks.filter(task => task.urgent === urgent && task.important === important);
  };

  const getQuadrantType = (urgent: boolean, important: boolean): QuadrantType => {
    if (urgent && important) return 'urgent-important';
    if (!urgent && important) return 'not-urgent-important';
    if (urgent && !important) return 'urgent-not-important';
    return 'not-urgent-not-important';
  };

  const handleDrop = (e: React.DragEvent, urgent: boolean, important: boolean) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
    
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && (task.urgent !== urgent || task.important !== important)) {
      onUpdateTask(taskId, { urgent, important });
      
      // Get quadrant name for toast
      const quadrantName = urgent && important ? 'Do First' :
                          !urgent && important ? 'Schedule' :
                          urgent && !important ? 'Delegate' :
                          'Eliminate';
      
      toast.success(`Task moved to "${quadrantName}" quadrant`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const quadrants = [
    {
      title: 'Do First',
      subtitle: 'Urgent & Important',
      urgent: true,
      important: true,
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Schedule',
      subtitle: 'Not Urgent but Important',
      urgent: false,
      important: true,
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-200 dark:border-amber-800'
    },
    {
      title: 'Delegate',
      subtitle: 'Urgent but Not Important',
      urgent: true,
      important: false,
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Eliminate',
      subtitle: 'Not Urgent & Not Important',
      urgent: false,
      important: false,
      bgColor: 'bg-gray-50 dark:bg-gray-950/20',
      borderColor: 'border-gray-200 dark:border-gray-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {quadrants.map((quadrant) => {
        const quadrantTasks = getTasksByQuadrant(quadrant.urgent, quadrant.important);
        const quadrantType = getQuadrantType(quadrant.urgent, quadrant.important);
        
        return (
          <div 
            key={quadrantType}
            className={`rounded-lg border-2 ${quadrant.borderColor} ${quadrant.bgColor} p-3 md:p-4 flex flex-col h-[300px] md:h-[400px] transition-colors`}
            onDrop={(e) => handleDrop(e, quadrant.urgent, quadrant.important)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-primary', 'bg-primary/5');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
            }}
          >
            {/* Quadrant header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{quadrant.title}</h3>
                <p className="text-sm text-muted-foreground">{quadrant.subtitle}</p>
              </div>
              <Button
                onClick={() => onAddTask(quadrantType)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tasks */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
            }}>
              {quadrantTasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  No tasks in this quadrant
                </div>
              ) : (
                quadrantTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}