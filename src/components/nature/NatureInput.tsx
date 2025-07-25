/**
 * Nature Theme Input Component
 * 자연스러운 입력 필드 - 나무, 잎사귀 테마
 */

import React, { useState, useId, forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface NatureInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string
  multiline?: boolean
  rows?: number
  nature?: 'forest' | 'meadow' | 'earth' | 'stone'
}

export const NatureInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, NatureInputProps>(
  ({ 
    label, 
    multiline = false,
    rows = 4,
    nature = 'forest',
    className, 
    id,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const generatedId = useId()
    const inputId = id || generatedId

    const natures = {
      forest: {
        bg: 'bg-green-50 focus:bg-green-100',
        border: 'border-green-200 focus:border-green-400',
        text: 'text-green-900 placeholder:text-green-400',
        label: 'text-green-700'
      },
      meadow: {
        bg: 'bg-lime-50 focus:bg-lime-100', 
        border: 'border-lime-200 focus:border-lime-400',
        text: 'text-lime-900 placeholder:text-lime-400',
        label: 'text-lime-700'
      },
      earth: {
        bg: 'bg-amber-50 focus:bg-amber-100',
        border: 'border-amber-200 focus:border-amber-400', 
        text: 'text-amber-900 placeholder:text-amber-400',
        label: 'text-amber-700'
      },
      stone: {
        bg: 'bg-slate-50 focus:bg-slate-100',
        border: 'border-slate-200 focus:border-slate-400',
        text: 'text-slate-900 placeholder:text-slate-400', 
        label: 'text-slate-700'
      }
    }

    const currentNature = natures[nature]
    const InputComponent = multiline ? 'textarea' : 'input'

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium transition-colors',
              currentNature.label
            )}
          >
            {label}
          </label>
        )}
        
        <InputComponent
          ref={ref as any}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-0',
            'resize-none',
            currentNature.bg,
            currentNature.border,
            currentNature.text,
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e as any)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e as any)
          }}
          rows={multiline ? rows : undefined}
          {...props}
        />
      </div>
    )
  }
)

NatureInput.displayName = 'NatureInput'