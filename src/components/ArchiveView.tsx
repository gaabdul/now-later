import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { Button } from './ui/button';
import { RotateCcw, Trash2 } from 'lucide-react';

interface ArchiveViewProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onRestoreTask: (taskId: string) => void;
  onClearArchive: () => void;
  onEditTask?: (task: Task) => void;
}

export function ArchiveView({ tasks, onUpdateTask, onDeleteTask, onRestoreTask, onClearArchive, onEditTask }: ArchiveViewProps) {
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Archive</h2>
          <p className="text-muted-foreground">
            {completedTasks.length} completed task{completedTasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        {completedTasks.length > 0 && (
          <Button
            onClick={onClearArchive}
            variant="outline"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Archive
          </Button>
        )}
      </div>

      {completedTasks.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <p className="text-lg mb-2">No completed tasks yet</p>
            <p className="text-sm">Completed tasks will appear here</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {completedTasks.map(task => (
            <div key={task.id} className="relative">
              <TaskCard
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
              />
              <div className="absolute top-4 right-14 flex gap-2">
                <Button
                  onClick={() => onRestoreTask(task.id)}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  title="Restore task"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}