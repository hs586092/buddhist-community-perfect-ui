// Accessibility controls component
// 접근성 제어 컴포넌트

import React, { useState } from 'react';
import { a11y, i18n, useTranslation } from '@/utils/i18n';

interface AccessibilityControlsProps {
  className?: string;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  className = ''
}) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(a11y.getSettings());

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
    a11y.setFontSize(size);
    setSettings(a11y.getSettings());
  };

  const handleHighContrastToggle = () => {
    a11y.toggleHighContrast();
    setSettings(a11y.getSettings());
  };

  const handleReducedMotionToggle = () => {
    a11y.toggleReducedMotion();
    setSettings(a11y.getSettings());
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
  };

  return (
    <div className={`accessibility-controls ${className}`}>
      {/* Accessibility Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accessibility-toggle p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={t('a11y.menu_toggle')}
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Accessibility Menu */}
      {isOpen && (
        <div
          id="accessibility-menu"
          className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
          role="dialog"
          aria-labelledby="accessibility-menu-title"
          aria-hidden={!isOpen}
        >
          <div className="accessibility-menu">
            <h3 id="accessibility-menu-title" className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🪷</span>
              접근성 설정
            </h3>

            {/* Font Size Controls */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                글자 크기
              </h4>
              <div className="flex space-x-2">
                {[
                  { value: 'small', label: '작게', size: '14px' },
                  { value: 'medium', label: '보통', size: '16px' },
                  { value: 'large', label: '크게', size: '18px' },
                  { value: 'extra-large', label: '매우 크게', size: '20px' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFontSizeChange(option.value as any)}
                    className={`px-3 py-2 text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      settings.fontSize === option.value
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ fontSize: option.size }}
                    aria-pressed={settings.fontSize === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="mb-6">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  고대비 모드
                </span>
                <button
                  onClick={handleHighContrastToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    settings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={settings.highContrast}
                  aria-label={t('a11y.high_contrast')}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                텍스트와 배경의 대비를 높여 가독성을 향상시킵니다
              </p>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="mb-6">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  애니메이션 줄이기
                </span>
                <button
                  onClick={handleReducedMotionToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={settings.reducedMotion}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                움직임이나 애니메이션을 줄여 어지러움을 방지합니다
              </p>
            </div>

            {/* Language Selection */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                언어 / Language
              </h4>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="언어 선택"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={t('a11y.close_dialog')}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

// Quick accessibility toolbar (floating)
export const QuickAccessibilityToolbar: React.FC = () => {
  const [settings, setSettings] = useState(a11y.getSettings());

  const handleFontIncrease = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex < sizes.length - 1) {
      a11y.setFontSize(sizes[currentIndex + 1]);
      setSettings(a11y.getSettings());
    }
  };

  const handleFontDecrease = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      a11y.setFontSize(sizes[currentIndex - 1]);
      setSettings(a11y.getSettings());
    }
  };

  const handleHighContrastToggle = () => {
    a11y.toggleHighContrast();
    setSettings(a11y.getSettings());
  };

  return (
    <div 
      className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-lg border border-gray-200 p-2 z-40"
      role="toolbar"
      aria-label="빠른 접근성 도구모음"
    >
      <div className="flex flex-col space-y-2">
        {/* Font Size Decrease */}
        <button
          onClick={handleFontDecrease}
          disabled={settings.fontSize === 'small'}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="글자 크기 줄이기"
          title="글자 크기 줄이기"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Font Size Increase */}
        <button
          onClick={handleFontIncrease}
          disabled={settings.fontSize === 'extra-large'}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="글자 크기 키우기"
          title="글자 크기 키우기"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>

        {/* High Contrast Toggle */}
        <button
          onClick={handleHighContrastToggle}
          className={`p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            settings.highContrast 
              ? 'text-blue-600 bg-blue-100' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          aria-label="고대비 모드 전환"
          title="고대비 모드 전환"
          aria-pressed={settings.highContrast}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="w-full h-px bg-gray-200 my-1" aria-hidden="true" />

        {/* Accessibility Menu Link */}
        <AccessibilityControls />
      </div>
    </div>
  );
};

export default AccessibilityControls;