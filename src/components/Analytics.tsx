import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

type MoodType = 'great' | 'good' | 'ok' | 'bad' | 'terrible';
type Category = 'family' | 'health' | 'work' | 'sport' | 'tasks';

interface MoodEntry {
  date: Date;
  mood: MoodType;
  headache: boolean;
  anxiety: boolean;
  apathy: boolean;
}

interface Task {
  date: Date;
  category: Category;
  completed: boolean;
}

interface AnalyticsProps {
  moodEntries: MoodEntry[];
  tasks: Task[];
}

const moodScores = {
  great: 5,
  good: 4,
  ok: 3,
  bad: 2,
  terrible: 1,
};

export default function Analytics({ moodEntries, tasks }: AnalyticsProps) {
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const moodData = last30Days.map((day) => {
    const entry = moodEntries.find(
      (e) => format(e.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    return {
      date: day,
      score: entry ? moodScores[entry.mood] : null,
      hasHeadache: entry?.headache || false,
      hasAnxiety: entry?.anxiety || false,
      hasApathy: entry?.apathy || false,
    };
  });

  const categoryStats = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = { total: 0, completed: 0 };
    }
    acc[task.category].total++;
    if (task.completed) acc[task.category].completed++;
    return acc;
  }, {} as Record<Category, { total: number; completed: number }>);

  const avgMood =
    moodData.filter((d) => d.score !== null).reduce((sum, d) => sum + (d.score || 0), 0) /
    moodData.filter((d) => d.score !== null).length;

  const headacheDays = moodData.filter((d) => d.hasHeadache).length;
  const anxietyDays = moodData.filter((d) => d.hasAnxiety).length;
  const apathyDays = moodData.filter((d) => d.hasApathy).length;

  const maxScore = 5;
  const chartHeight = 120;

  return (
    <div className="space-y-6">
      <Card className="p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="TrendingUp" size={20} className="text-slate-700" />
          <h2 className="text-xl font-semibold text-slate-800">Динамика настроения</h2>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-800">
              {avgMood ? avgMood.toFixed(1) : '—'}
            </p>
            <p className="text-sm text-slate-600">Средний балл</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{headacheDays}</p>
            <p className="text-sm text-slate-600">Дней с головной болью</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{anxietyDays}</p>
            <p className="text-sm text-slate-600">Дней с тревожностью</p>
          </div>
        </div>

        <div className="relative" style={{ height: chartHeight + 40 }}>
          <div className="absolute inset-0 flex items-end gap-1">
            {moodData.map((day, idx) => {
              const barHeight = day.score ? (day.score / maxScore) * chartHeight : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t transition-all hover:opacity-80 ${
                      day.score === null
                        ? 'bg-slate-100'
                        : day.score >= 4
                        ? 'bg-green-400'
                        : day.score >= 3
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`}
                    style={{ height: barHeight || 4 }}
                  />
                  {(day.hasHeadache || day.hasAnxiety || day.hasApathy) && (
                    <div className="flex gap-0.5">
                      {day.hasHeadache && <div className="w-1 h-1 rounded-full bg-red-500" />}
                      {day.hasAnxiety && <div className="w-1 h-1 rounded-full bg-orange-500" />}
                      {day.hasApathy && <div className="w-1 h-1 rounded-full bg-gray-500" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>{format(last30Days[0], 'd MMM', { locale: ru })}</span>
          <span>{format(last30Days[last30Days.length - 1], 'd MMM', { locale: ru })}</span>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-400" />
            Отлично
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-400" />
            Нормально
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-400" />
            Плохо
          </div>
        </div>
      </Card>

      <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="BarChart3" size={20} className="text-slate-700" />
          <h2 className="text-xl font-semibold text-slate-800">Активность по категориям</h2>
        </div>

        <div className="space-y-4">
          {Object.entries(categoryStats).map(([category, stats]) => {
            const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
            const categoryInfo = {
              family: { name: 'Семья и дети', color: 'bg-pink-400', icon: 'Users' },
              health: { name: 'Здоровье', color: 'bg-green-400', icon: 'Heart' },
              work: { name: 'Работа фотографа', color: 'bg-blue-400', icon: 'Camera' },
              sport: { name: 'Спорт', color: 'bg-yellow-400', icon: 'Dumbbell' },
              tasks: { name: 'Задачи', color: 'bg-purple-400', icon: 'CheckSquare' },
            }[category as Category];

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name={categoryInfo?.icon as any} size={16} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {categoryInfo?.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stats.completed}/{stats.total}
                  </Badge>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${categoryInfo?.color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(categoryStats).length === 0 && (
          <p className="text-slate-500 text-center py-8">Пока нет данных для анализа</p>
        )}
      </Card>
    </div>
  );
}
