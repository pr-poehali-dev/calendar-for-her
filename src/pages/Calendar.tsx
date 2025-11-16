import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import Icon from '@/components/ui/icon';
import Analytics from '@/components/Analytics';
import Notifications from '@/components/Notifications';
import CalendarSidebar from '@/components/calendar/CalendarSidebar';
import TaskList from '@/components/calendar/TaskList';
import MoodTracker from '@/components/calendar/MoodTracker';
import { Task, MoodEntry, Category, Priority, RepeatType } from '@/components/calendar/types';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Съемка свадьбы',
      description: 'Встреча с клиентами в 14:00',
      date: new Date(),
      category: 'work',
      priority: 'high',
      completed: false,
      repeat: 'none',
    },
    {
      id: '2',
      title: 'Тренировка детей',
      description: 'Футбол в 16:00',
      date: new Date(),
      category: 'family',
      priority: 'medium',
      completed: false,
      repeat: 'none',
    },
  ]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    {
      date: new Date(),
      mood: 'good',
      notes: 'Продуктивный день',
      headache: false,
      anxiety: false,
      apathy: false,
    },
  ]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddMoodOpen, setIsAddMoodOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    category: 'tasks',
    priority: 'medium',
    date: new Date(),
    repeat: 'none',
  });
  const [newMood, setNewMood] = useState<Partial<MoodEntry>>({
    date: new Date(),
    mood: 'good',
    headache: false,
    anxiety: false,
    apathy: false,
  });

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = format(task.date, 'yyyy-MM-dd');
      const selectedDateStr = format(date, 'yyyy-MM-dd');
      
      if (taskDate === selectedDateStr) return true;
      
      if (task.repeat !== 'none' && new Date(task.date) <= date) {
        if (task.repeatUntil && date > task.repeatUntil) return false;
        
        const daysDiff = Math.floor((date.getTime() - new Date(task.date).getTime()) / (1000 * 60 * 60 * 24));
        
        if (task.repeat === 'daily') return true;
        if (task.repeat === 'weekly' && daysDiff % 7 === 0) return true;
        if (task.repeat === 'monthly') {
          const taskDay = new Date(task.date).getDate();
          const selectedDay = date.getDate();
          return taskDay === selectedDay;
        }
      }
      
      return false;
    });
  };

  const todayTasks = getTasksForDate(selectedDate);

  const todayMood = moodEntries.find(
    (entry) => format(entry.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const addTask = () => {
    if (newTask.title) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask.title,
          description: newTask.description || '',
          date: newTask.date || new Date(),
          category: newTask.category as Category,
          priority: newTask.priority as Priority,
          completed: false,
          repeat: newTask.repeat as RepeatType,
          repeatUntil: newTask.repeatUntil,
        },
      ]);
      setNewTask({ category: 'tasks', priority: 'medium', date: new Date(), repeat: 'none' });
      setIsAddTaskOpen(false);
    }
  };

  const addMood = () => {
    const existingIndex = moodEntries.findIndex(
      (entry) => format(entry.date, 'yyyy-MM-dd') === format(newMood.date || new Date(), 'yyyy-MM-dd')
    );
    
    if (existingIndex >= 0) {
      const updated = [...moodEntries];
      updated[existingIndex] = newMood as MoodEntry;
      setMoodEntries(updated);
    } else {
      setMoodEntries([...moodEntries, newMood as MoodEntry]);
    }
    setNewMood({ date: new Date(), mood: 'good', headache: false, anxiety: false, apathy: false });
    setIsAddMoodOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">Мой календарь</h1>
          <p className="text-slate-600">Организуй свою жизнь в одном месте</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
            <TabsTrigger value="calendar" className="gap-2">
              <Icon name="Calendar" size={16} />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Icon name="Bell" size={16} />
              Уведомления
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CalendarSidebar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate} 
              />

              <div className="lg:col-span-2 space-y-6">
                <TaskList
                  selectedDate={selectedDate}
                  tasks={todayTasks}
                  onToggleTask={toggleTask}
                  isAddTaskOpen={isAddTaskOpen}
                  onSetIsAddTaskOpen={setIsAddTaskOpen}
                  newTask={newTask}
                  onSetNewTask={setNewTask}
                  onAddTask={addTask}
                />

                <MoodTracker
                  todayMood={todayMood}
                  isAddMoodOpen={isAddMoodOpen}
                  onSetIsAddMoodOpen={setIsAddMoodOpen}
                  newMood={newMood}
                  onSetNewMood={setNewMood}
                  onAddMood={addMood}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics moodEntries={moodEntries} tasks={tasks} />
          </TabsContent>

          <TabsContent value="notifications">
            <Notifications tasks={tasks} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
