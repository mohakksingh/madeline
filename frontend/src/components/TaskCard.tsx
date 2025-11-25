import React from 'react';
import { Clock, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  deadline: string;
  subtasks: { id: number; title: string; completed: boolean }[];
}

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  const statusColors = {
    todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const deadlineDate = new Date(task.deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let timeLeft = '';
  if (diffDays < 0) timeLeft = 'Overdue';
  else if (diffDays === 0) timeLeft = 'Due today';
  else timeLeft = `${diffDays} days left`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-50"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex space-x-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1.5 leading-tight">{task.title}</h3>
      <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">{task.description}</p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
          {task.category}
        </div>
        <div className={`flex items-center text-xs font-medium ${diffDays < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {timeLeft}
        </div>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3 pt-1">
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
            <span>Progress</span>
            <span>{Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-primary h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            ></motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
