/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFriendlyErrorMessage(error: unknown, context: string): string {
    let rawMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
        rawMessage = error.message;
    } else if (typeof error === 'string') {
        rawMessage = error;
    } else if (error) {
        rawMessage = String(error);
    }

    // Check for quota exceeded error from Gemini API
    if (rawMessage.includes("quota") || rawMessage.includes("RESOURCE_EXHAUSTED") || rawMessage.includes("429")) {
        try {
            // Try to parse JSON error response
            const errorJson = JSON.parse(rawMessage);
            const errorMessage = errorJson?.error?.message;
            if (errorMessage && (errorMessage.includes("quota") || errorMessage.includes("exceeded"))) {
                return "API quota exceeded. You've reached your daily limit for free tier. Please try again tomorrow or upgrade your Google AI Studio plan.";
            }
        } catch (e) {
            // Not a JSON string, check for quota keywords in raw message
            if (rawMessage.includes("quota") || rawMessage.includes("exceeded") || rawMessage.includes("limit")) {
                return "API quota exceeded. You've reached your daily limit for free tier. Please try again tomorrow or upgrade your Google AI Studio plan.";
            }
        }
    }

    // Check for specific unsupported MIME type error from Gemini API
    if (rawMessage.includes("Unsupported MIME type")) {
        try {
            // It might be a JSON string like '{"error":{"message":"..."}}'
            const errorJson = JSON.parse(rawMessage);
            const nestedMessage = errorJson?.error?.message;
            if (nestedMessage && nestedMessage.includes("Unsupported MIME type")) {
                const mimeType = nestedMessage.split(': ')[1] || 'unsupported';
                return `File type '${mimeType}' is not supported. Please use a format like PNG, JPEG, or WEBP.`;
            }
        } catch (e) {
            // Not a JSON string, but contains the text. Fallthrough to generic message.
        }
        // Generic fallback for any "Unsupported MIME type" error
        return `Unsupported file format. Please upload an image format like PNG, JPEG, or WEBP.`;
    }
    
    return `${context}. ${rawMessage}`;
}