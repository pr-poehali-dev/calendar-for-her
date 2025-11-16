export type Category = 'family' | 'health' | 'work' | 'sport' | 'tasks';
export type Priority = 'low' | 'medium' | 'high';
export type MoodType = 'great' | 'good' | 'ok' | 'bad' | 'terrible';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: Category;
  priority: Priority;
  completed: boolean;
  repeat: RepeatType;
  repeatUntil?: Date;
}

export interface MoodEntry {
  date: Date;
  mood: MoodType;
  notes: string;
  headache: boolean;
  anxiety: boolean;
  apathy: boolean;
}

export const categories = {
  family: { name: 'Семья и дети', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: 'Users' },
  health: { name: 'Здоровье', color: 'bg-green-100 text-green-700 border-green-200', icon: 'Heart' },
  work: { name: 'Работа фотографа', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'Camera' },
  sport: { name: 'Спорт', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: 'Dumbbell' },
  tasks: { name: 'Задачи', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'CheckSquare' },
};

export const moodEmojis = {
  great: '😊',
  good: '🙂',
  ok: '😐',
  bad: '😟',
  terrible: '😢',
};
