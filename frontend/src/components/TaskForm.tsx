import { useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Task } from './TaskCard';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [category, setCategory] = useState(task?.category || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [deadline, setDeadline] = useState(task?.deadline ? task.deadline.split('T')[0] : '');
  const [subtasks, setSubtasks] = useState<{ id?: number; title: string; completed: boolean }[]>(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { title: newSubtask, completed: false }]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    const updated = [...subtasks];
    updated.splice(index, 1);
    setSubtasks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      category,
      priority,
      status,
      deadline: deadline ? new Date(deadline).toISOString() : null,
    };

    try {
      let taskId = task?.id;
      if (task) {
        await api.put(`/tasks/${task.id}`, taskData);
      } else {
        const response = await api.post('/tasks/', taskData);
        taskId = response.data.id;
      }

      // Handle subtasks
      if (taskId) {
        for (const st of subtasks) {
           if (!st.id) {
              await api.post(`/tasks/${taskId}/subtasks`, st);
           }
        }
      }
      onSubmit();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
          placeholder="e.g., Go To Gym"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow resize-none"
          placeholder="Add details about the task..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
          placeholder="e.g., Design, Development"
        />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'todo' | 'in_progress' | 'completed')}
            className="block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Subtasks</label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            className="block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
            placeholder="Add a subtask..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSubtask();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddSubtask}
            className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {subtasks.map((st, index) => (
            <li key={index} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border border-border/50 group">
              <span className={`text-sm ${st.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{st.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveSubtask(index)}
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all text-xs font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 border border-input rounded-lg shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </motion.form>
  );
}
