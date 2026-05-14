'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface DatePickerProps {
  label: string;
  value: string; // ISO string or empty
  onChange: (value: string) => void;
  id: string;
  hint?: string;
}

export function DatePicker({ label, value, onChange, id, hint }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Internal state for calendar navigation
  const [viewDate, setViewDate] = useState(() => (value ? new Date(value) : new Date()));
  const [selectedDate, setSelectedDate] = useState(() => (value ? new Date(value) : null));

  // Sync external value
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setViewDate(date);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const prevMonthDays = daysInMonth(year, month - 1);
    const days = [];

    // Prev month padding
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: month - 1, year, current: false });
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month, year, current: true });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: month + 1, year, current: false });
    }

    return days;
  }, [viewDate]);

  const handleDateClick = (day: number, month: number, year: number) => {
    const newDate = new Date(selectedDate || new Date());
    newDate.setFullYear(year);
    newDate.setMonth(month);
    newDate.setDate(day);
    setSelectedDate(newDate);
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'period', val: string | number) => {
    const newDate = new Date(selectedDate || new Date());
    
    if (type === 'hour') {
      const h = parseInt(val as string);
      const isPM = newDate.getHours() >= 12;
      if (isPM && h < 12) newDate.setHours(h + 12);
      else if (!isPM && h === 12) newDate.setHours(0);
      else newDate.setHours(h);
    }
    
    if (type === 'minute') {
      newDate.setMinutes(parseInt(val as string));
    }
    
    if (type === 'period') {
      const currentH = newDate.getHours();
      const isPM = val === 'PM';
      if (isPM && currentH < 12) newDate.setHours(currentH + 12);
      else if (!isPM && currentH >= 12) newDate.setHours(currentH - 12);
    }
    
    setSelectedDate(newDate);
    onChange(newDate.toISOString());
  };

  const formatDisplay = (date: Date | null) => {
    if (!date) return 'Select date & time';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase();
  };

  const changeMonth = (offset: number) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + offset);
    setViewDate(next);
  };

  return (
    <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
      <label htmlFor={id} className="font-display font-semibold text-xs text-charcoal-600 uppercase tracking-wider">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between
          border-2 rounded-2xl bg-white transition-all duration-200 px-4 py-3
          ${isOpen
            ? 'border-brand-400 shadow-[0_0_0_3px_rgb(232_72_58_/_0.09)]'
            : 'border-warm-300 hover:border-warm-400'
          }
        `}
      >
        <span className={`text-sm font-body ${selectedDate ? 'text-charcoal-900' : 'text-charcoal-400'}`}>
          {formatDisplay(selectedDate)}
        </span>
        <CalendarIcon size={16} className="text-charcoal-400" />
      </button>

      {hint && <p className="text-xs text-charcoal-400">{hint}</p>}

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-warm-200 rounded-[22px] shadow-xl p-4 w-[380px] animate-fade-up">
          <div className="flex gap-5">
            {/* Left: Calendar */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex flex-col">
                  <h4 className="font-display font-bold text-charcoal-900 text-[13px]">
                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const now = new Date();
                      setSelectedDate(now);
                      setViewDate(now);
                      onChange(now.toISOString());
                    }}
                    className="text-[9px] font-bold text-brand-600 uppercase tracking-wider hover:text-brand-700 transition-colors text-left"
                  >
                    Select Today
                  </button>
                </div>
                <div className="flex gap-0.5 self-start mt-0.5">
                  <button onClick={(e) => { e.stopPropagation(); changeMonth(-1); }} type="button" className="p-1 hover:bg-warm-50 rounded-lg text-charcoal-500 transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); changeMonth(1); }} type="button" className="p-1 hover:bg-warm-50 rounded-lg text-charcoal-500 transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <span key={d} className="text-[9px] font-bold text-charcoal-400 uppercase py-1">{d}</span>
                ))}
                {calendarDays.map((d, i) => {
                  const isSelected = selectedDate && 
                                   selectedDate.getDate() === d.day && 
                                   selectedDate.getMonth() === d.month && 
                                   selectedDate.getFullYear() === d.year;
                  const isToday = new Date().getDate() === d.day && 
                                new Date().getMonth() === d.month && 
                                new Date().getFullYear() === d.year;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDateClick(d.day, d.month, d.year); }}
                      className={`
                        text-[11px] font-medium py-1.5 rounded-lg transition-all
                        ${!d.current ? 'text-charcoal-200' : 'text-charcoal-700 hover:bg-warm-50'}
                        ${isSelected ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm scale-90' : ''}
                        ${isToday && !isSelected ? 'text-brand-600 font-bold' : ''}
                      `}
                    >
                      {d.day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-warm-100 self-stretch my-1" />

            {/* Right: Time Selector */}
            <div className="w-20 flex flex-col pt-0.5">
              <div className="flex items-center gap-1.5 text-charcoal-400 mb-3">
                <Clock size={12} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Time</span>
              </div>
              
              <div className="space-y-2.5">
                {/* Hour */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-charcoal-400 uppercase ml-1">Hour</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="HH"
                    value={selectedDate ? (selectedDate.getHours() % 12 || 12) : 12}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val === '') return handleTimeChange('hour', '12');
                      const num = parseInt(val);
                      if (num >= 1 && num <= 12) handleTimeChange('hour', val);
                    }}
                    className="w-full text-xs font-bold bg-warm-50 border-none rounded-xl px-2 py-2 focus:ring-2 focus:ring-brand-400/20 text-center transition-all"
                  />
                </div>

                {/* Min */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-charcoal-400 uppercase ml-1">Min</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={selectedDate ? selectedDate.getMinutes().toString().padStart(2, '0') : '00'}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val === '') return handleTimeChange('minute', '0');
                      const num = parseInt(val);
                      if (num >= 0 && num <= 59) handleTimeChange('minute', val);
                    }}
                    className="w-full text-xs font-bold bg-warm-50 border-none rounded-xl px-2 py-2 focus:ring-2 focus:ring-brand-400/20 text-center transition-all"
                  />
                </div>

                {/* AM/PM */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-charcoal-400 uppercase ml-1">Period</span>
                  <select
                    value={selectedDate && selectedDate.getHours() >= 12 ? 'PM' : 'AM'}
                    onChange={(e) => handleTimeChange('period', e.target.value)}
                    className="w-full text-xs font-bold bg-warm-50 border-none rounded-xl px-2 py-2 focus:ring-0 cursor-pointer hover:bg-warm-100 transition-colors appearance-none text-center"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="w-full py-1.5 bg-charcoal-900 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-charcoal-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
