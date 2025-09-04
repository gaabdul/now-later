import { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Grid3X3, 
  Archive, 
  Plus, 
  User, 
  LogOut, 
  Mail,
  UserCheck,
  Moon,
  Sun
} from 'lucide-react';
import { Board, User as UserType } from '../types';

interface TopNavigationProps {
  currentView: 'matrix' | 'archive';
  onViewChange: (view: 'matrix' | 'archive') => void;
  boards: Board[];
  currentBoardId: string;
  onBoardChange: (boardId: string) => void;
  onCreateBoard: (name: string) => void;
  user: UserType | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
  onToggleGuest: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function TopNavigation({
  currentView,
  onViewChange,
  boards,
  currentBoardId,
  onBoardChange,
  onCreateBoard,
  user,
  onLogin,
  onLogout,
  onToggleGuest,
  darkMode,
  onToggleDarkMode
}: TopNavigationProps) {
  const [showNewBoardDialog, setShowNewBoardDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName.trim());
      setNewBoardName('');
      setShowNewBoardDialog(false);
    }
  };

  const handleLogin = () => {
    if (loginEmail.trim()) {
      onLogin(loginEmail.trim());
      setLoginEmail('');
      setShowAuthDialog(false);
    }
  };

  const currentBoard = boards.find(board => board.id === currentBoardId);

  return (
    <nav className="border-b bg-background px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and main nav */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-md">
              <Grid3X3 className="h-4 w-4" />
            </div>
            <h1 className="text-lg md:text-xl">Now & Later</h1>
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant={currentView === 'matrix' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('matrix')}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Matrix
            </Button>
            <Button
              variant={currentView === 'archive' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('archive')}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>

        {/* Board selector and controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Board selector */}
          <div className="flex items-center gap-2">
            <Select value={currentBoardId} onValueChange={onBoardChange}>
              <SelectTrigger className="w-32 md:w-48">
                <SelectValue>
                  {currentBoard?.name || 'Select board'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {boards.map(board => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={showNewBoardDialog} onOpenChange={setShowNewBoardDialog}>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowNewBoardDialog(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="boardName">Board Name</Label>
                    <Input
                      id="boardName"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                      placeholder="Enter board name..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateBoard} className="flex-1">
                      Create Board
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewBoardDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="h-8 w-8 p-0"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User menu */}
          <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowAuthDialog(true)}
            >
              {user?.isGuest ? <User className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {user?.isGuest ? 'Guest' : user?.email || 'Login'}
              </span>
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Account</DialogTitle>
              </DialogHeader>
              
              {user ? (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    {user.isGuest ? <User className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                    <div>
                      <p className="font-medium">
                        {user.isGuest ? 'Guest User' : user.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.isGuest ? 'Using local storage' : 'Logged in'}
                      </p>
                    </div>
                    {user.isGuest && (
                      <Badge variant="outline" className="ml-auto">Guest</Badge>
                    )}
                  </div>
                  
                  {user.isGuest ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="email">Login with Magic Link</Label>
                        <Input
                          id="email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          placeholder="Enter your email..."
                        />
                      </div>
                      <Button onClick={handleLogin} className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Magic Link
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={onLogout} variant="outline" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <Button onClick={onToggleGuest} className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Continue as Guest
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="loginEmail">Login with Magic Link</Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="Enter your email..."
                    />
                  </div>
                  <Button onClick={handleLogin} variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Magic Link
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}