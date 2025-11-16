import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { MoodEntry, MoodType, moodEmojis } from './types';

interface MoodTrackerProps {
  todayMood: MoodEntry | undefined;
  isAddMoodOpen: boolean;
  onSetIsAddMoodOpen: (open: boolean) => void;
  newMood: Partial<MoodEntry>;
  onSetNewMood: (mood: Partial<MoodEntry>) => void;
  onAddMood: () => void;
}

export default function MoodTracker({
  todayMood,
  isAddMoodOpen,
  onSetIsAddMoodOpen,
  newMood,
  onSetNewMood,
  onAddMood,
}: MoodTrackerProps) {
  return (
    <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Самочувствие</h2>
        <Dialog open={isAddMoodOpen} onOpenChange={onSetIsAddMoodOpen}>
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
                      onClick={() => onSetNewMood({ ...newMood, mood: key as MoodType })}
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
                    onChange={(e) => onSetNewMood({ ...newMood, headache: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Головная боль / мигрень</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMood.anxiety}
                    onChange={(e) => onSetNewMood({ ...newMood, anxiety: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Тревожность</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMood.apathy}
                    onChange={(e) => onSetNewMood({ ...newMood, apathy: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Апатия</span>
                </label>
              </div>
              <Textarea
                placeholder="Заметки о самочувствии..."
                value={newMood.notes || ''}
                onChange={(e) => onSetNewMood({ ...newMood, notes: e.target.value })}
              />
              <Button onClick={onAddMood} className="w-full">
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
  );
}
