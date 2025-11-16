import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Icon from '@/components/ui/icon';

type Category = 'family' | 'health' | 'work' | 'sport' | 'tasks';
type Priority = 'low' | 'medium' | 'high';
type MoodType = 'great' | 'good' | 'ok' | 'bad' | 'terrible';

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: Category;
  priority: Priority;
  completed: boolean;
}

interface MoodEntry {
  date: Date;
  mood: MoodType;
  notes: string;
  headache: boolean;
  anxiety: boolean;
  apathy: boolean;
}

const categories = {
  family: { name: 'Семья и дети', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: 'Users' },
  health: { name: 'Здоровье', color: 'bg-green-100 text-green-700 border-green-200', icon: 'Heart' },
  work: { name: 'Работа фотографа', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'Camera' },
  sport: { name: 'Спорт', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: 'Dumbbell' },
  tasks: { name: 'Задачи', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'CheckSquare' },
};

const moodEmojis = {
  great: '😊',
  good: '🙂',
  ok: '😐',
  bad: '😟',
  terrible: '😢',
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Съемка свадьбы',
      description: 'Встреча с клиентами в 14:00',
      date: new Date(),
      category: 'work',
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      title: 'Тренировка детей',
      description: 'Футбол в 16:00',
      date: new Date(),
      category: 'family',
      priority: 'medium',
      completed: false,
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
  });
  const [newMood, setNewMood] = useState<Partial<MoodEntry>>({
    date: new Date(),
    mood: 'good',
    headache: false,
    anxiety: false,
    apathy: false,
  });

  const todayTasks = tasks.filter(
    (task) => format(task.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

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
        },
      ]);
      setNewTask({ category: 'tasks', priority: 'medium', date: new Date() });
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 p-6 animate-scale-in">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ru}
              className="rounded-md border-0"
            />
            
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-slate-700 mb-3">Категории</h3>
              {Object.entries(categories).map(([key, cat]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <Icon name={cat.icon as any} size={16} className="text-slate-600" />
                  <Badge variant="outline" className={cat.color}>
                    {cat.name}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-slate-800">
                  {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
                </h2>
                <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Icon name="Plus" size={16} />
                      Добавить задачу
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новая задача</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Название задачи"
                        value={newTask.title || ''}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                      <Textarea
                        placeholder="Описание"
                        value={newTask.description || ''}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask({ ...newTask, category: value as Category })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categories).map(([key, cat]) => (
                            <SelectItem key={key} value={key}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value as Priority })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкий приоритет</SelectItem>
                          <SelectItem value="medium">Средний приоритет</SelectItem>
                          <SelectItem value="high">Высокий приоритет</SelectItem>
                        </SelectContent>
                      </Select>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <CalendarIcon size={16} />
                            {format(newTask.date || new Date(), 'PPP', { locale: ru })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newTask.date}
                            onSelect={(date) => date && setNewTask({ ...newTask, date })}
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button onClick={addTask} className="w-full">
                        Создать задачу
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {todayTasks.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Нет задач на этот день</p>
                ) : (
                  todayTasks.map((task) => (
                    <Card
                      key={task.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'
                          }`}
                        >
                          {task.completed && <Icon name="Check" size={14} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-medium ${
                                task.completed ? 'line-through text-slate-500' : 'text-slate-800'
                              }`}
                            >
                              {task.title}
                            </h3>
                            {task.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">
                                Важно
                              </Badge>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                          )}
                          <Badge variant="outline" className={categories[task.category].color}>
                            {categories[task.category].name}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Самочувствие</h2>
                <Dialog open={isAddMoodOpen} onOpenChange={setIsAddMoodOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="Plus" size={16} />
                      Записать
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Как вы себя чувствуете?</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Настроение</label>
                        <div className="flex gap-2 justify-around">
                          {Object.entries(moodEmojis).map(([key, emoji]) => (
                            <button
                              key={key}
                              onClick={() => setNewMood({ ...newMood, mood: key as MoodType })}
                              className={`text-4xl p-2 rounded-lg transition-all ${
                                newMood.mood === key
                                  ? 'bg-blue-100 scale-110'
                                  : 'hover:bg-slate-100 opacity-50'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newMood.headache}
                            onChange={(e) => setNewMood({ ...newMood, headache: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Головная боль / мигрень</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newMood.anxiety}
                            onChange={(e) => setNewMood({ ...newMood, anxiety: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Тревожность</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newMood.apathy}
                            onChange={(e) => setNewMood({ ...newMood, apathy: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Апатия</span>
                        </label>
                      </div>
                      <Textarea
                        placeholder="Заметки о самочувствии..."
                        value={newMood.notes || ''}
                        onChange={(e) => setNewMood({ ...newMood, notes: e.target.value })}
                      />
                      <Button onClick={addMood} className="w-full">
                        Сохранить
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {todayMood ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{moodEmojis[todayMood.mood]}</span>
                    <div>
                      <p className="font-medium text-slate-700">
                        {todayMood.mood === 'great' && 'Отлично'}
                        {todayMood.mood === 'good' && 'Хорошо'}
                        {todayMood.mood === 'ok' && 'Нормально'}
                        {todayMood.mood === 'bad' && 'Плохо'}
                        {todayMood.mood === 'terrible' && 'Ужасно'}
                      </p>
                      {todayMood.notes && <p className="text-sm text-slate-600">{todayMood.notes}</p>}
                    </div>
                  </div>
                  {(todayMood.headache || todayMood.anxiety || todayMood.apathy) && (
                    <div className="flex flex-wrap gap-2">
                      {todayMood.headache && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Головная боль
                        </Badge>
                      )}
                      {todayMood.anxiety && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Тревожность
                        </Badge>
                      )}
                      {todayMood.apathy && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Апатия
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">
                  Записей о самочувствии пока нет
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
