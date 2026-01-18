'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Wand2, 
  Download, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Palette,
  Zap,
  Image as ImageIcon,
  type LucideIcon
} from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  tip?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to Jewelshot! 💎',
    description: 'Transform your jewelry photos into stunning visuals with AI. Let\'s show you how it works in 60 seconds.',
    icon: Sparkles,
    tip: 'You have 5 free credits to get started!',
  },
  {
    title: 'Step 1: Upload Your Image',
    description: 'Drag & drop or click to upload your jewelry photo. We support JPG, PNG, and WebP formats up to 10MB.',
    icon: Upload,
    tip: 'Tip: Clear, well-lit photos work best',
  },
  {
    title: 'Step 2: Choose a Preset',
    description: 'Select from our curated presets or use custom prompts. Each preset is optimized for jewelry photography.',
    icon: Palette,
    tip: 'Try "Lifestyle" presets for social media',
  },
  {
    title: 'Step 3: Generate with AI',
    description: 'Click the magic button and watch AI transform your photo. Generation takes about 10-15 seconds.',
    icon: Wand2,
    tip: 'Each generation uses 1 credit',
  },
  {
    title: 'Step 4: Download & Share',
    description: 'Download your stunning new image in high resolution. All your generations are saved in your Gallery.',
    icon: Download,
    tip: 'Right-click to copy or share directly',
  },
  {
    title: 'You\'re Ready! 🚀',
    description: 'Start creating amazing jewelry visuals. Need help? Click the chat icon anytime.',
    icon: CheckCircle2,
    tip: 'Pro tip: Use Batch mode for multiple images',
  },
];

const STORAGE_KEY = 'jewelshot_onboarding_complete';

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem(STORAGE_KEY);
    if (!hasCompleted) {
      // Delay showing modal slightly for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute right-4 top-4 z-10 rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Content */}
            <div className="p-8 pt-12">
              {/* Icon */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 flex justify-center"
              >
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 border border-purple-500/30">
                  <Icon className="h-12 w-12 text-purple-400" />
                </div>
              </motion.div>

              {/* Title & Description */}
              <motion.div
                key={`content-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl font-bold text-white mb-3">
                  {step.title}
                </h2>
                <p className="text-white/70 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Tip Box */}
              {step.tip && (
                <motion.div
                  key={`tip-${currentStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mb-8 rounded-xl bg-purple-500/10 border border-purple-500/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-purple-400 shrink-0" />
                    <span className="text-purple-300 text-sm">{step.tip}</span>
                  </div>
                </motion.div>
              )}

              {/* Step Indicators */}
              <div className="flex justify-center gap-2 mb-8">
                {ONBOARDING_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-purple-500'
                        : index < currentStep
                        ? 'w-2 bg-purple-500/50'
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {!isFirstStep && (
                  <button
                    onClick={prevStep}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-white font-medium hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors ${
                    isFirstStep ? 'w-full' : ''
                  }`}
                >
                  {isLastStep ? (
                    <>
                      Get Started
                      <Sparkles className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Skip Link */}
              <button
                onClick={handleSkip}
                className="mt-4 w-full text-center text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Skip tutorial
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to manually trigger onboarding
export function useOnboarding() {
  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const isOnboardingComplete = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  };

  return { resetOnboarding, isOnboardingComplete };
}
