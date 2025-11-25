'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import TaskCard, { Task } from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import AISummary from '@/components/AISummary';
import KanbanBoard from '@/components/KanbanBoard';
import CalendarView from '@/components/CalendarView';
import { Plus, LayoutGrid, Kanban, Calendar as CalendarIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('board');
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get('/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery) ||
          task.description?.toLowerCase().includes(searchQuery)
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, searchQuery]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  };

  const handleTaskMove = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'completed') => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status', error);
      fetchTasks();
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    fetchTasks();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Overview</h2>
          <p className="text-muted-foreground">Manage and track your projects.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-muted p-1 rounded-lg flex space-x-1">
            {['list', 'board', 'calendar'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`relative p-2 rounded-md transition-all duration-200 ${
                  viewMode === mode ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
              >
                {viewMode === mode && (
                  <motion.div
                    layoutId="viewMode"
                    className="absolute inset-0 bg-background shadow-sm rounded-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">
                  {mode === 'list' && <LayoutGrid className="w-4 h-4" />}
                  {mode === 'board' && <Kanban className="w-4 h-4" />}
                  {mode === 'calendar' && <CalendarIcon className="w-4 h-4" />}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={handleCreateTask}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </button>
        </div>
      </div>

      <AISummary tasks={tasks} />

      <div className="min-h-[500px]">
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : viewMode === 'board' ? (
          <div className="h-full">
            <KanbanBoard
              tasks={filteredTasks}
              onTaskMove={handleTaskMove}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        ) : (
          <div className="h-full bg-card rounded-xl border border-border p-4 shadow-sm">
            <CalendarView tasks={filteredTasks} onEdit={handleEditTask} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card rounded-xl shadow-2xl w-full max-w-lg border border-border overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                <h3 className="text-lg font-semibold text-foreground">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <TaskForm
                  task={editingTask}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsFormOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
