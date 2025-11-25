'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Task } from '@/components/TaskCard';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks/');
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-purple-500 bg-purple-500/10';
      case 'in_progress': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">My Tasks</h2>
        <p className="text-muted-foreground">A detailed view of all your tasks.</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Task Details</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Deadline</th>
                <th className="px-6 py-4 font-medium">Subtasks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task) => (
                <tr key={task.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground text-base mb-1">{task.title}</div>
                    <div className="text-muted-foreground line-clamp-2 max-w-md">{task.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
                      {task.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 opacity-70" />
                      {task.deadline ? format(new Date(task.deadline), 'MMM d, yyyy') : 'No deadline'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.subtasks && task.subtasks.length > 0 ? (
                      <div className="space-y-1.5 min-w-[160px]">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} completed
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">No subtasks</span>
                    )}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-lg font-medium">No tasks found</p>
                      <p className="text-sm">Create a new task to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
