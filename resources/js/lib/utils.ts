import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getLimitTextContent = (html: string, maxLength: number) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const stringText = doc.body.textContent || '';

    if (stringText.length <= maxLength) return stringText;
    return stringText.substring(0, stringText.lastIndexOf(' ', maxLength)) + '...';
};
