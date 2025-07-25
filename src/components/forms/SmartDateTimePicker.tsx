/**
 * Smart Date/Time Picker with Temple Schedule Integration
 *
 * Features:
 * - Temple schedule awareness and conflict detection
 * - Beautiful calendar with Buddhist holidays
 * - Time slot suggestions based on temple activities
 * - Mobile-optimized date/time selection
 * - Availability indicators
 * - Alternative suggestions when conflicts occur
 */

import { addDays, addHours, format, isSameDay, startOfDay } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import type { SmartScheduleIntegration } from '../../types/event-registration';

interface SmartDateTimePickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  templeSchedule?: SmartScheduleIntegration['templeSchedule'];
  eventDuration?: number; // in hours
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Mock temple schedule data
const defaultTempleSchedule: SmartScheduleIntegration['templeSchedule'] = {
  recurringEvents: [
    { day: 'Monday', time: '06:00', activity: 'Morning Meditation', capacity: 20 },
    { day: 'Monday', time: '19:00', activity: 'Evening Dharma Talk', capacity: 40 },
    { day: 'Tuesday', time: '06:00', activity: 'Morning Meditation', capacity: 20 },
    { day: 'Wednesday', time: '06:00', activity: 'Morning Meditation', capacity: 20 },
    { day: 'Wednesday', time: '19:00', activity: 'Community Discussion', capacity: 30 },
    { day: 'Thursday', time: '06:00', activity: 'Morning Meditation', capacity: 20 },
    { day: 'Friday', time: '06:00', activity: 'Morning Meditation', capacity: 20 },
    { day: 'Friday', time: '19:00', activity: 'Group Meditation', capacity: 50 },
    { day: 'Saturday', time: '08:00', activity: 'Weekend Retreat Prep', capacity: 15 },
    { day: 'Sunday', time: '09:00', activity: 'Community Gathering', capacity: 60 },
  ],
  specialEvents: [
    {
      date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      time: '10:00',
      activity: 'Vesak Day Celebration',
      priority: 'high',
    },
    {
      date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      time: '14:00',
      activity: 'Teacher Training Workshop',
      priority: 'medium',
    },
  ],
  closedDates: [
    format(addDays(new Date(), 21), 'yyyy-MM-dd'), // Maintenance day
  ],
};

// Buddhist holidays and special dates
const buddhistHolidays = [
  { date: '2025-02-12', name: 'Vesak Day', emoji: '🪷' },
  { date: '2025-03-15', name: 'Dharma Day', emoji: '☸️' },
  { date: '2025-04-08', name: 'Buddha Day', emoji: '🧘‍♂️' },
];

export const SmartDateTimePicker: React.FC<SmartDateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  templeSchedule = defaultTempleSchedule,
  eventDuration = 2,
  minDate = new Date(),
  maxDate = addDays(new Date(), 90),
  disabled = false,
  size = 'md',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Size configurations
  const sizeConfig = {
    sm: { calendar: 'text-sm', cell: 'h-8 w-8', button: 'px-2 py-1 text-xs' },
    md: { calendar: 'text-base', cell: 'h-10 w-10', button: 'px-3 py-2 text-sm' },
    lg: { calendar: 'text-lg', cell: 'h-12 w-12', button: 'px-4 py-2 text-base' },
  }[size];

  // Generate available time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }, []);

  // Check for conflicts with temple schedule
  const checkConflicts = (date: Date, time: string) => {
    if (!selectedDate || !time) return [];

    const dayName = format(date, 'EEEE');
    const dateString = format(date, 'yyyy-MM-dd');
    const conflicts: string[] = [];

    // Check recurring events
    const dayEvents = templeSchedule.recurringEvents.filter(event => event.day === dayName);
    dayEvents.forEach(event => {
      const eventStart = new Date(`${dateString}T${event.time}:00`);
      const eventEnd = addHours(eventStart, 1.5); // Assume 1.5 hour events
      const selectedStart = new Date(`${dateString}T${time}:00`);
      const selectedEnd = addHours(selectedStart, eventDuration);

      if (
        (selectedStart >= eventStart && selectedStart < eventEnd) ||
        (selectedEnd > eventStart && selectedEnd <= eventEnd) ||
        (selectedStart <= eventStart && selectedEnd >= eventEnd)
      ) {
        conflicts.push(`Conflicts with ${event.activity} at ${event.time}`);
      }
    });

    // Check special events
    const specialEvent = templeSchedule.specialEvents.find(event => event.date === dateString);
    if (specialEvent) {
      const eventStart = new Date(`${dateString}T${specialEvent.time}:00`);
      const eventEnd = addHours(eventStart, 2); // Assume 2 hour special events
      const selectedStart = new Date(`${dateString}T${time}:00`);
      const selectedEnd = addHours(selectedStart, eventDuration);

      if (
        (selectedStart >= eventStart && selectedStart < eventEnd) ||
        (selectedEnd > eventStart && selectedEnd <= eventEnd) ||
        (selectedStart <= eventStart && selectedEnd >= eventEnd)
      ) {
        conflicts.push(`Conflicts with ${specialEvent.activity} (${specialEvent.priority} priority)`);
      }
    }

    return conflicts;
  };

  // Generate alternative suggestions
  const generateSuggestions = (date: Date) => {
    if (!date) return [];

    const suggestions: string[] = [];
    const dayName = format(date, 'EEEE');
    const dateString = format(date, 'yyyy-MM-dd');

    // Suggest times around temple activities
    const dayEvents = templeSchedule.recurringEvents.filter(event => event.day === dayName);

    // Morning slots (before 10 AM)
    if (!dayEvents.some(event => event.time < '10:00')) {
      suggestions.push('08:00 - Perfect for morning practice');
    }

    // Afternoon slots (12 PM - 5 PM)
    if (!dayEvents.some(event => event.time >= '12:00' && event.time < '17:00')) {
      suggestions.push('14:00 - Peaceful afternoon session');
    }

    // Early evening (5 PM - 6 PM, before evening activities)
    if (!dayEvents.some(event => event.time >= '17:00' && event.time < '19:00')) {
      suggestions.push('17:00 - Before evening activities');
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  };

  // Update conflicts when date/time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const newConflicts = checkConflicts(selectedDate, selectedTime);
      setConflicts(newConflicts);
    }
  }, [selectedDate, selectedTime, templeSchedule]);

  // Update suggestions when date changes
  useEffect(() => {
    if (selectedDate) {
      const newSuggestions = generateSuggestions(selectedDate);
      setSuggestions(newSuggestions);
    }
  }, [selectedDate, templeSchedule]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfDay(currentMonth);
    const firstDay = start.getDay();
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of current month
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }

    return days;
  }, [currentMonth]);

  // Check if date is selectable
  const isDateSelectable = (date: Date | null) => {
    if (!date) return false;
    if (date < minDate || date > maxDate) return false;

    const dateString = format(date, 'yyyy-MM-dd');
    return !templeSchedule.closedDates.includes(dateString);
  };

  // Get date info (holiday, special event, etc.)
  const getDateInfo = (date: Date | null) => {
    if (!date) return null;

    const dateString = format(date, 'yyyy-MM-dd');
    const holiday = buddhistHolidays.find(h => h.date === dateString);
    const specialEvent = templeSchedule.specialEvents.find(e => e.date === dateString);
    const isClosed = templeSchedule.closedDates.includes(dateString);

    return { holiday, specialEvent, isClosed };
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={disabled}
          >
            ←
          </button>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>

          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={disabled}
          >
            →
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const isSelected = date && selectedDate && isSameDay(date, selectedDate);
            const isSelectable = isDateSelectable(date);
            const dateInfo = getDateInfo(date);

            return (
              <motion.button
                key={index}
                className={`
                  ${sizeConfig.cell} rounded-lg relative transition-all duration-200
                  ${!date ? 'invisible' : ''}
                  ${!isSelectable ? 'opacity-30 cursor-not-allowed' :
                    isSelected ? 'bg-purple-500 text-white shadow-lg scale-105' :
                    'hover:bg-purple-100 dark:hover:bg-purple-900 text-gray-700 dark:text-gray-300'
                  }
                  ${dateInfo?.isClosed ? 'bg-red-100 dark:bg-red-900' : ''}
                `}
                onClick={() => {
                  if (date && isSelectable && !disabled) {
                    onDateChange(date);
                    setShowTimeSlots(true);
                  }
                }}
                disabled={!isSelectable || disabled}
                whileHover={isSelectable ? { scale: 1.05 } : {}}
                whileTap={isSelectable ? { scale: 0.95 } : {}}
              >
                {date && (
                  <>
                    <span className={sizeConfig.calendar}>{date.getDate()}</span>

                    {/* Holiday indicator */}
                    {dateInfo?.holiday && (
                      <div className="absolute -top-1 -right-1 text-xs">
                        {dateInfo.holiday.emoji}
                      </div>
                    )}

                    {/* Special event indicator */}
                    {dateInfo?.specialEvent && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full" />
                    )}

                    {/* Closed indicator */}
                    {dateInfo?.isClosed && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                        ✕
                      </div>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span>Special Event</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>Closed</span>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <AnimatePresence>
        {showTimeSlots && selectedDate && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Time for {format(selectedDate, 'MMMM do, yyyy')}
            </h4>

            {/* Time Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {timeSlots.map(time => {
                const isSelected = time === selectedTime;
                const timeConflicts = checkConflicts(selectedDate, time);
                const hasConflict = timeConflicts.length > 0;

                return (
                  <motion.button
                    key={time}
                    className={`
                      ${sizeConfig.button} rounded-lg transition-all duration-200
                      ${isSelected ? 'bg-purple-500 text-white shadow-lg' :
                        hasConflict ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                      }
                    `}
                    onClick={() => !disabled && onTimeChange(time)}
                    disabled={disabled}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {time}
                    {hasConflict && <span className="ml-1 text-xs">⚠️</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Conflicts Display */}
            <AnimatePresence>
              {conflicts.length > 0 && (
                <motion.div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    ⚠️ Schedule Conflicts
                  </h5>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {conflicts.map((conflict, index) => (
                      <li key={index}>• {conflict}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <motion.div
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  💡 Recommended Times
                </h5>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="block w-full text-left text-sm text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 rounded p-2 transition-colors"
                      onClick={() => {
                        const time = suggestion.split(' - ')[0];
                        onTimeChange(time);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
