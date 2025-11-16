import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ru } from 'date-fns/locale';
import Icon from '@/components/ui/icon';
import { categories } from './types';

interface CalendarSidebarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function CalendarSidebar({ selectedDate, onSelectDate }: CalendarSidebarProps) {
  return (
    <Card className="lg:col-span-1 p-6 animate-scale-in">
      <CalendarComponent
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
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
  );
}
