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
import { Task, Category, Priority, RepeatType, categories } from './types';

interface TaskListProps {
  selectedDate: Date;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  isAddTaskOpen: boolean;
  onSetIsAddTaskOpen: (open: boolean) => void;
  newTask: Partial<Task>;
  onSetNewTask: (task: Partial<Task>) => void;
  onAddTask: () => void;
}

export default function TaskList({
  selectedDate,
  tasks,
  onToggleTask,
  isAddTaskOpen,
  onSetIsAddTaskOpen,
  newTask,
  onSetNewTask,
  onAddTask,
}: TaskListProps) {
  return (
    <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">
          {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
        </h2>
        <Dialog open={isAddTaskOpen} onOpenChange={onSetIsAddTaskOpen}>
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
                onChange={(e) => onSetNewTask({ ...newTask, title: e.target.value })}
              />
              <Textarea
                placeholder="Описание"
                value={newTask.description || ''}
                onChange={(e) => onSetNewTask({ ...newTask, description: e.target.value })}
              />
              <Select
                value={newTask.category}
                onValueChange={(value) => onSetNewTask({ ...newTask, category: value as Category })}
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
                onValueChange={(value) => onSetNewTask({ ...newTask, priority: value as Priority })}
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
                    onSelect={(date) => date && onSetNewTask({ ...newTask, date })}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={newTask.repeat}
                onValueChange={(value) => onSetNewTask({ ...newTask, repeat: value as RepeatType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Повтор" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Не повторять</SelectItem>
                  <SelectItem value="daily">Каждый день</SelectItem>
                  <SelectItem value="weekly">Каждую неделю</SelectItem>
                  <SelectItem value="monthly">Каждый месяц</SelectItem>
                </SelectContent>
              </Select>
              {newTask.repeat !== 'none' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Icon name="CalendarX" size={16} />
                      {newTask.repeatUntil
                        ? format(newTask.repeatUntil, 'PPP', { locale: ru })
                        : 'Повторять до... (необязательно)'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newTask.repeatUntil}
                      onSelect={(date) => onSetNewTask({ ...newTask, repeatUntil: date })}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              )}
              <Button onClick={onAddTask} className="w-full">
                Создать задачу
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Нет задач на этот день</p>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                task.completed ? 'opacity-60' : ''
              }`}
              onClick={() => onToggleTask(task.id)}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={categories[task.category].color}>
                      {categories[task.category].name}
                    </Badge>
                    {task.repeat !== 'none' && (
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 gap-1">
                        <Icon name="Repeat" size={12} />
                        {task.repeat === 'daily' && 'Ежедневно'}
                        {task.repeat === 'weekly' && 'Еженедельно'}
                        {task.repeat === 'monthly' && 'Ежемесячно'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
}
