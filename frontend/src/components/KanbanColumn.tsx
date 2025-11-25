import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { Task } from './TaskCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function KanbanColumn({ id, title, tasks, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col w-80 bg-gray-100 rounded-lg p-4 mr-4 h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-700 uppercase tracking-wide">
        {title} <span className="text-sm font-normal text-gray-500">({tasks.length})</span>
      </h2>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-[200px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
