/**
 * Forms Components Export
 *
 * Netflix/Airbnb level event registration system components
 */

// Main registration system
export { EventRegistrationSystem } from './EventRegistrationSystem';

// Progress and visualization components
export { LotusProgressIndicator } from './LotusProgressIndicator';
export { ZenCapacityVisualization } from './ZenCapacityVisualization';

// Mobile and interaction components
export { MobileBottomSheet, useMobileBottomSheet, withMobileBottomSheet } from './MobileBottomSheet';
export { WhatsAppConfirmation } from './WhatsAppConfirmation';

// Types
export type {
    AnimationStates, CapacityVisualization, ConfirmationFlow, EventDetails, EventRegistrationData, FormValidation, MobileOptimizations,
    PerformanceFeatures, RegistrationProgress, RegistrationStep, SmartScheduleIntegration
} from '../../types/event-registration';

