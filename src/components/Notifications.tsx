import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { format, addMinutes, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

type Category = 'family' | 'health' | 'work' | 'sport' | 'tasks';
type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  date: Date;
  category: Category;
  priority: Priority;
  completed: boolean;
}

interface NotificationsProps {
  tasks: Task[];
}

interface NotificationSettings {
  enabled: boolean;
  beforeMinutes: number;
  highPriorityOnly: boolean;
}

export default function Notifications({ tasks }: NotificationsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    beforeMinutes: 30,
    highPriorityOnly: false,
  });

  const [notifiedTasks, setNotifiedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!settings.enabled) return;

    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.completed || notifiedTasks.has(task.id)) return;

        if (settings.highPriorityOnly && task.priority !== 'high') return;

        const notifyTime = addMinutes(task.date, -settings.beforeMinutes);

        if (isBefore(notifyTime, now) && isBefore(now, task.date)) {
          toast(task.title, {
            description: `Через ${settings.beforeMinutes} минут`,
            icon: getPriorityIcon(task.priority),
          });

          setNotifiedTasks((prev) => new Set(prev).add(task.id));
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks, settings, notifiedTasks]);

  const getPriorityIcon = (priority: Priority) => {
    if (priority === 'high') return '🔴';
    if (priority === 'medium') return '🟡';
    return '🟢';
  };

  const upcomingTasks = tasks
    .filter((task) => !task.completed && task.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Card className="p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Bell" size={20} className="text-slate-700" />
          <h2 className="text-xl font-semibold text-slate-800">Уведомления</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Включить уведомления</p>
              <p className="text-sm text-slate-500">Напоминания о предстоящих задачах</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Только важные задачи</p>
              <p className="text-sm text-slate-500">Уведомления только с высоким приоритетом</p>
            </div>
            <Switch
              checked={settings.highPriorityOnly}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, highPriorityOnly: checked })
              }
            />
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">Напомнить за</p>
            <div className="flex gap-2">
              {[15, 30, 60, 120].map((minutes) => (
                <Button
                  key={minutes}
                  variant={settings.beforeMinutes === minutes ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSettings({ ...settings, beforeMinutes: minutes })}
                >
                  {minutes < 60 ? `${minutes} мин` : `${minutes / 60} ч`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Clock" size={20} className="text-slate-700" />
          <h2 className="text-xl font-semibold text-slate-800">Предстоящие задачи</h2>
        </div>

        <div className="space-y-3">
          {upcomingTasks.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Нет предстоящих задач</p>
          ) : (
            upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getPriorityIcon(task.priority)}</span>
                    <h3 className="font-medium text-slate-800">{task.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {format(task.date, 'PPP, HH:mm', { locale: ru })}
                  </p>
                </div>
                {task.priority === 'high' && (
                  <Badge variant="destructive" className="ml-2">
                    Важно
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
