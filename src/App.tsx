import { useState, useEffect } from 'react';
import { EisenhowerMatrix } from './components/EisenhowerMatrix';
import { ArchiveView } from './components/ArchiveView';
import { TopNavigation } from './components/TopNavigation';
import { AddTaskDialog } from './components/AddTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Board, Task, User, QuadrantType } from './types';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { Grid3X3, Archive } from 'lucide-react';
import { Button } from './components/ui/button';

// Sample data
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Fix critical bug in production',
    description: 'Users are reporting login issues',
    urgent: true,
    important: true,
    completed: false,
    tags: ['bug', 'production'],
    subtasks: [],
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Plan quarterly review meeting',
    description: 'Prepare agenda and schedule with team',
    urgent: false,
    important: true,
    completed: false,
    tags: ['meeting', 'quarterly'],
    subtasks: [
      { id: '2a', title: 'Send calendar invites', completed: false },
      { id: '2b', title: 'Prepare presentation', completed: true }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Respond to non-urgent emails',
    urgent: true,
    important: false,
    completed: false,
    tags: ['email'],
    subtasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Organize desk drawer',
    urgent: false,
    important: false,
    completed: true,
    tags: ['organization'],
    subtasks: [],
    createdAt: new Date().toISOString()
  }
];

const defaultBoard: Board = {
  id: 'default',
  name: 'My Tasks',
  tasks: sampleTasks
};

export default function App() {
  const [currentView, setCurrentView] = useState<'matrix' | 'archive'>('matrix');
  const [boards, setBoards] = useLocalStorage<Board[]>('now-later-boards', [defaultBoard]);
  const [currentBoardId, setCurrentBoardId] = useLocalStorage<string>('now-later-current-board', 'default');
  const [user, setUser] = useLocalStorage<User | null>('now-later-user', null);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('now-later-dark-mode', false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType | undefined>();
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const currentBoard = boards.find(board => board.id === currentBoardId) || boards[0];

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === currentBoardId
          ? {
              ...board,
              tasks: board.tasks.map(task => 
                task.id === taskId ? { ...task, ...updates } : task
              )
            }
          : board
      )
    );
    
    if (updates.completed !== undefined) {
      toast.success(updates.completed ? 'Task completed!' : 'Task restored!');
    }
  };

  const deleteTask = (taskId: string) => {
    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === currentBoardId
          ? {
              ...board,
              tasks: board.tasks.filter(task => task.id !== taskId)
            }
          : board
      )
    );
    toast.success('Task deleted');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === currentBoardId
          ? {
              ...board,
              tasks: [...board.tasks, newTask]
            }
          : board
      )
    );
    toast.success('Task added!');
  };

  const handleAddTask = (quadrant: QuadrantType) => {
    setSelectedQuadrant(quadrant);
    setShowAddTaskDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditTaskDialog(true);
  };

  const createBoard = (name: string) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name,
      tasks: []
    };
    setBoards(prev => [...prev, newBoard]);
    setCurrentBoardId(newBoard.id);
    toast.success('Board created!');
  };

  const restoreTask = (taskId: string) => {
    updateTask(taskId, { completed: false });
  };

  const clearArchive = () => {
    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === currentBoardId
          ? {
              ...board,
              tasks: board.tasks.filter(task => !task.completed)
            }
          : board
      )
    );
    toast.success('Archive cleared');
  };

  const handleLogin = (email: string) => {
    setUser({ id: Date.now().toString(), email, isGuest: false });
    toast.success('Magic link sent! (Demo: automatically logged in)');
  };

  const handleLogout = () => {
    setUser(null);
    toast.success('Logged out');
  };

  const handleToggleGuest = () => {
    setUser({ id: 'guest', isGuest: true });
    toast.success('Continuing as guest');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        boards={boards}
        currentBoardId={currentBoardId}
        onBoardChange={setCurrentBoardId}
        onCreateBoard={createBoard}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onToggleGuest={handleToggleGuest}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Mobile view selector */}
      <div className="sm:hidden border-b px-4 py-2">
        <div className="flex gap-2">
          <Button
            variant={currentView === 'matrix' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('matrix')}
            className="flex-1"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Matrix
          </Button>
          <Button
            variant={currentView === 'archive' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('archive')}
            className="flex-1"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {currentView === 'matrix' ? (
          <EisenhowerMatrix
            tasks={currentBoard?.tasks || []}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
          />
        ) : (
          <ArchiveView
            tasks={currentBoard?.tasks || []}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onRestoreTask={restoreTask}
            onClearArchive={clearArchive}
            onEditTask={handleEditTask}
          />
        )}
      </main>

      <AddTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
        onAddTask={addTask}
        initialQuadrant={selectedQuadrant}
      />

      <EditTaskDialog
        open={showEditTaskDialog}
        onOpenChange={setShowEditTaskDialog}
        onUpdateTask={updateTask}
        task={editingTask}
      />

      <Toaster />
    </div>
  );
}