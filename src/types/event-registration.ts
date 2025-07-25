/**
 * Event Registration System Types
 * Netflix/Airbnb level modern registration with progressive enhancement
 */

export interface RegistrationStep {
  id: string;
  title: string;
  description?: string;
  icon: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  lotusProgress: number; // 0-100 for lotus petal filling
}

export interface EventRegistrationData {
  // Step 1: Event Selection
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventCapacity: number;
  currentAttendees: number;

  // Step 2: Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };

  // Step 3: Preferences & Requirements
  preferences: {
    dietaryRequirements?: string[];
    accessibilityNeeds?: string[];
    meditationExperience: 'beginner' | 'intermediate' | 'advanced';
    participationStyle: 'silent' | 'guided' | 'discussion';
    transportationNeeds?: boolean;
    accommodationRequired?: boolean;
  };

  // Step 4: Payment & Confirmation
  payment: {
    amount: number;
    currency: string;
    method: 'dana' | 'card' | 'transfer' | 'cash';
    danaAmount?: number; // Optional donation amount
    scholarshipRequested?: boolean;
  };

  // Metadata
  registrationSource: 'web' | 'mobile' | 'app';
  referralCode?: string;
  specialRequests?: string;
  agreedToTerms: boolean;
  marketingConsent: boolean;
}

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  teacher: {
    name: string;
    title: string;
    bio: string;
    image: string;
    credentials: string[];
  };
  schedule: {
    startDate: string;
    endDate: string;
    timezone: string;
    dailySchedule: {
      time: string;
      activity: string;
      duration: number;
    }[];
  };
  location: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    images: string[];
    facilities: string[];
    accessibility: string[];
    virtualLink?: string;
    isHybrid: boolean;
  };
  pricing: {
    suggested: number;
    minimum?: number;
    currency: string;
    includesAccommodation: boolean;
    includesMeals: boolean;
    scholarshipsAvailable: boolean;
  };
  capacity: {
    total: number;
    remaining: number;
    waitlistSize: number;
    registrationDeadline: string;
  };
  tags: string[];
  images: string[];
  testimonials?: {
    text: string;
    author: string;
    role: string;
    avatar?: string;
  }[];
}

export interface CapacityVisualization {
  total: number;
  registered: number;
  pending: number;
  waitlist: number;
  pattern: 'zen-garden' | 'lotus-grid' | 'mandala' | 'flowing-water';
  animationSpeed: 'gentle' | 'moderate' | 'dynamic';
}

export interface RegistrationProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  validationErrors: Record<string, string[]>;
  timeSpent: number; // seconds
  saveProgress: () => void;
  restoreProgress: () => void;
}

export interface SmartScheduleIntegration {
  templeSchedule: {
    recurringEvents: {
      day: string;
      time: string;
      activity: string;
      capacity: number;
    }[];
    specialEvents: {
      date: string;
      time: string;
      activity: string;
      priority: 'high' | 'medium' | 'low';
    }[];
    closedDates: string[];
  };
  conflictDetection: boolean;
  suggestedAlternatives: string[];
}

export interface MobileOptimizations {
  bottomSheetEnabled: boolean;
  swipeGestures: boolean;
  hapticFeedback: boolean;
  autoFocus: boolean;
  keyboardOptimized: boolean;
  pullToRefresh: boolean;
}

export interface PerformanceFeatures {
  skeletonLoading: boolean;
  progressiveImageLoading: boolean;
  optimisticUpdates: boolean;
  offlineCapability: boolean;
  virtualScrolling: boolean;
  lazyLoading: boolean;
}

// Validation schemas and form state
export interface FormValidation {
  schema: any; // Zod schema
  trigger: (field?: string) => Promise<boolean>;
  errors: Record<string, any>;
  isValid: boolean;
  isDirty: boolean;
  touchedFields: Record<string, boolean>;
}

// Animation states for smooth transitions
export interface AnimationStates {
  stepTransition: 'slide-left' | 'slide-right' | 'fade' | 'lotus-bloom';
  lotusProgress: number;
  gardenVisualization: {
    stones: { id: string; filled: boolean; x: number; y: number }[];
    waterFlow: { active: boolean; speed: number };
    bloomingLotus: { petals: number; openness: number };
  };
  loading: {
    skeleton: boolean;
    shimmer: boolean;
    pulsePattern: 'gentle' | 'rhythmic';
  };
}

// WhatsApp-style confirmation flow
export interface ConfirmationFlow {
  preview: {
    eventSummary: EventDetails;
    userSelections: EventRegistrationData;
    totalCost: number;
    confirmationRequired: boolean;
  };
  steps: {
    review: boolean;
    payment: boolean;
    confirmation: boolean;
    sharing: boolean;
  };
  messaging: {
    confirmationMessage: string;
    reminderSettings: {
      email: boolean;
      sms: boolean;
      push: boolean;
      timesBefore: string[]; // ['1week', '1day', '1hour']
    };
  };
}
