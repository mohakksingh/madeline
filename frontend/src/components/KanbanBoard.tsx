import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { Task } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: number, newStatus: 'todo' | 'in_progress' | 'completed') => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function KanbanBoard({ tasks, onTaskMove, onEdit, onDelete }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  // We need local state for optimistic updates if we want smooth dragging
  // But if we rely on props, it might be jumpy if the parent update is slow.
  // For now, let's rely on props and assume parent updates fast or we can implement local state later if needed.
  // Actually, dnd-kit works best if we control the state.
  // Let's derive columns from tasks.

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = {
    todo: tasks.filter((task) => task.status === 'todo'),
    in_progress: tasks.filter((task) => task.status === 'in_progress'),
    completed: tasks.filter((task) => task.status === 'completed'),
  };

  const findContainer = (id: number | string) => {
    if (id in columns) {
      return id as keyof typeof columns;
    }
    const task = tasks.find((t) => t.id === id);
    return task?.status as keyof typeof columns | undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) {
      return;
    }

    // This is mainly for visual sorting within columns, 
    // but since we group by status in the parent/props, 
    // we might not need complex reordering logic here unless we persist order.
    // For now, we just care about moving between columns.
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as number;
    const overId = over?.id;

    if (!overId) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(activeId);
    const overContainer = (overId in columns)
      ? (overId as keyof typeof columns)
      : findContainer(overId);

    if (
      activeContainer &&
      overContainer &&
      activeContainer !== overContainer
    ) {
      onTaskMove(activeId, overContainer);
    }
    
    setActiveId(null);
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full overflow-x-auto pb-4">
        <KanbanColumn
          id="todo"
          title="To Do"
          tasks={columns.todo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <KanbanColumn
          id="in_progress"
          title="In Progress"
          tasks={columns.in_progress}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <KanbanColumn
          id="completed"
          title="Completed"
          tasks={columns.completed}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} onEdit={() => {}} onDelete={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
