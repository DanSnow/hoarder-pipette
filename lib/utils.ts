import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'
import type {ParseSelector} from 'typed-query-selector/parser'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function $<S extends string>(
  selector: S,
  context: Element | Document = document,
): ParseSelector<S, Element> | null {
  return context.querySelector(selector)
}

export function $$<S extends string>(
  selector: S,
  context: Element | Document = document,
): NodeListOf<ParseSelector<S>> | null {
  return context.querySelectorAll(selector)
}

export function decodeEntities(str: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = str
  return textarea.value
}

export function toOriginUrl(url: string): string {
  return `${url}*`
}

/**
 * Format a date string into a more readable format
 *
 * @param dateString - The date string to format (ISO 8601 format)
 * @returns A formatted date string based on relative time
 */
export function formattedDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString;
  }

  // Reset time part for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateToCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Format time part
  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // If it's today
  if (dateToCompare.getTime() === today.getTime()) {
    return `Today at ${timeString}`;
  }

  // If it's yesterday
  if (dateToCompare.getTime() === yesterday.getTime()) {
    return `Yesterday at ${timeString}`;
  }

  // If it's this year
  if (date.getFullYear() === now.getFullYear()) {
    const monthDayString = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
    return `${monthDayString} at ${timeString}`;
  }

  // For dates in other years
  const yearMonthDayString = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return `${yearMonthDayString} at ${timeString}`;
}
