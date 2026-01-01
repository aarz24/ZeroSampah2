/**
 * Input validation schemas and functions for ZeroSampah API
 * Uses type-safe validation to prevent invalid data
 */

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// URL validation
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Sanitize string input (prevent XSS)
// Note: This is basic sanitization. For production with user-generated HTML content,
// consider using a library like DOMPurify for more comprehensive protection.
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick, onload, etc.)
    .replace(/&lt;script&gt;/gi, '') // Remove encoded script tags
    .replace(/&lt;\/script&gt;/gi, '')
    .trim();
}

// Validate waste type
export function validateWasteType(wasteType: string): boolean {
  const validTypes = [
    'Plastic',
    'Glass',
    'Metal',
    'Paper',
    'Organic',
    'Electronic',
    'Hazardous',
    'Other'
  ];
  return validTypes.includes(wasteType);
}

// Validate report status
export function validateReportStatus(status: string): boolean {
  const validStatuses = ['pending', 'in_progress', 'collected', 'verified', 'rejected'];
  return validStatuses.includes(status);
}

// Validate event status
export function validateEventStatus(status: string): boolean {
  const validStatuses = ['published', 'cancelled', 'completed'];
  return validStatuses.includes(status);
}

// Validate transaction type
export function validateTransactionType(type: string): boolean {
  const validTypes = ['earned', 'redeemed'];
  return validTypes.includes(type);
}

// Validate notification type
export function validateNotificationType(type: string): boolean {
  const validTypes = ['info', 'success', 'warning', 'error', 'reward'];
  return validTypes.includes(type);
}

// Validate points (must be positive integer)
export function validatePoints(points: number): boolean {
  return Number.isInteger(points) && points > 0;
}

// Validate coordinates
export function validateCoordinates(lat?: string, lng?: string): boolean {
  if (!lat || !lng) return true; // Optional fields
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  return (
    !isNaN(latitude) && 
    !isNaN(longitude) &&
    latitude >= -90 && 
    latitude <= 90 &&
    longitude >= -180 && 
    longitude <= 180
  );
}

// Validate date string
export function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Validate future date
export function validateFutureDate(dateString: string): boolean {
  if (!validateDate(dateString)) return false;
  const date = new Date(dateString);
  return date > new Date();
}

// Report creation validation
export interface CreateReportInput {
  userId: string;
  location: string;
  wasteType: string;
  amount: string;
  imageUrl?: string;
}

export function validateCreateReport(input: CreateReportInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.userId || input.userId.trim().length === 0) {
    errors.push('User ID is required');
  }

  if (!input.location || input.location.trim().length === 0) {
    errors.push('Location is required');
  } else if (input.location.length > 500) {
    errors.push('Location must be less than 500 characters');
  }

  if (!input.wasteType || !validateWasteType(input.wasteType)) {
    errors.push('Invalid waste type');
  }

  if (!input.amount || input.amount.trim().length === 0) {
    errors.push('Amount is required');
  } else if (input.amount.length > 50) {
    errors.push('Amount must be less than 50 characters');
  }

  if (input.imageUrl && !validateUrl(input.imageUrl)) {
    errors.push('Invalid image URL');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Event creation validation
export interface CreateEventInput {
  title: string;
  description?: string;
  location: string;
  latitude?: string;
  longitude?: string;
  eventDate: string;
  eventTime: string;
  wasteCategories?: string[];
  maxParticipants?: number;
  rewardInfo?: string;
}

export function validateCreateEvent(input: CreateEventInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (input.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (input.description && input.description.length > 2000) {
    errors.push('Description must be less than 2000 characters');
  }

  if (!input.location || input.location.trim().length === 0) {
    errors.push('Location is required');
  } else if (input.location.length > 500) {
    errors.push('Location must be less than 500 characters');
  }

  if (!validateCoordinates(input.latitude, input.longitude)) {
    errors.push('Invalid coordinates');
  }

  if (!input.eventDate || !validateFutureDate(input.eventDate)) {
    errors.push('Event date must be in the future');
  }

  if (!input.eventTime || !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(input.eventTime)) {
    errors.push('Invalid time format (use HH:MM)');
  }

  if (input.wasteCategories) {
    if (!Array.isArray(input.wasteCategories)) {
      errors.push('Waste categories must be an array');
    } else if (input.wasteCategories.length > 10) {
      errors.push('Maximum 10 waste categories allowed');
    }
  }

  if (input.maxParticipants !== undefined) {
    if (!Number.isInteger(input.maxParticipants) || input.maxParticipants < 1) {
      errors.push('Max participants must be a positive integer');
    }
  }

  if (input.rewardInfo && input.rewardInfo.length > 500) {
    errors.push('Reward info must be less than 500 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Reward creation validation
export interface CreateRewardInput {
  name: string;
  description?: string;
  pointsRequired: number;
  imageUrl?: string;
  stock: number;
}

export function validateCreateReward(input: CreateRewardInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (input.name.length > 200) {
    errors.push('Name must be less than 200 characters');
  }

  if (input.description && input.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  if (!validatePoints(input.pointsRequired)) {
    errors.push('Points required must be a positive integer');
  }

  if (input.imageUrl && !validateUrl(input.imageUrl)) {
    errors.push('Invalid image URL');
  }

  if (!Number.isInteger(input.stock) || input.stock < 0) {
    errors.push('Stock must be a non-negative integer');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Generic validation error response
export function createValidationErrorResponse(errors: string[]) {
  return {
    error: 'Validation failed',
    details: errors
  };
}

// Rate limiting helper
// NOTE: This in-memory rate limiter is suitable for development and single-instance deployments.
// For production serverless/multi-instance environments, use Redis-based rate limiting:
// - Upstash Rate Limit: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
// - Redis + ioredis: Implement custom rate limiter with Redis
// 
// Example with Upstash:
// import { Ratelimit } from "@upstash/ratelimit"
// import { Redis } from "@upstash/redis"
// 
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, "60 s"),
// })
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests outside the time window
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    // Cleanup old entries periodically
    if (this.requests.size > 10000) {
      this.cleanup();
    }
    
    return true;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, times] of this.requests.entries()) {
      const recentTimes = times.filter(time => now - time < this.windowMs);
      if (recentTimes.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentTimes);
      }
    }
  }
}
