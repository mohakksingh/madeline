import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, ToolbarProps, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';
import { Task } from './TaskCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const CustomToolbar: React.FC<ToolbarProps> = ({ date, onNavigate, onView, view, label }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded-lg">
        <button
          onClick={() => onNavigate('PREV')}
          className="p-2 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1.5 text-sm font-medium hover:bg-background rounded-md transition-colors text-foreground"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="p-2 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <h2 className="text-xl font-bold text-foreground capitalize">
        {label}
      </h2>

      <div className="flex items-center space-x-1 bg-muted/50 p-1 rounded-lg">
        <button
          onClick={() => onView('month')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            view === 'month' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onView('week')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            view === 'week' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => onView('day')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            view === 'day' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Day
        </button>
      </div>
    </div>
  );
};

export default function CalendarView({ tasks, onEdit }: CalendarViewProps) {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const events = tasks
    .filter((task) => task.deadline)
    .map((task) => ({
      id: task.id,
      title: task.title,
      start: new Date(task.deadline),
      end: new Date(task.deadline),
      allDay: true,
      resource: task,
    }));

  const eventPropGetter = (event: any) => {
    const priority = event.resource.priority;
    let backgroundColor = 'var(--primary)';
    
    if (priority === 'HIGH') backgroundColor = '#ef4444';
    if (priority === 'MEDIUM') backgroundColor = '#f59e0b';
    if (priority === 'LOW') backgroundColor = '#10b981';

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        border: 'none',
        color: '#fff',
        display: 'block',
      },
    };
  };

  return (
    <div className="h-[700px] bg-card p-6 rounded-xl border border-border shadow-sm">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={(event) => onEdit(event.resource)}
        views={['month', 'week', 'day']}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        eventPropGetter={eventPropGetter}
        components={{
          toolbar: CustomToolbar,
        }}
        className="text-foreground"
      />
    </div>
  );
}
