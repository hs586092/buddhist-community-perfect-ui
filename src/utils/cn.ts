// Simple utility for conditional class names without external dependencies
type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassDictionary
type ClassArray = ClassValue[]
type ClassDictionary = Record<string, any>

/**
 * Simple implementation of clsx functionality
 */
function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) {
      continue
    }

    if (typeof input === 'string') {
      classes.push(input)
    } else if (typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const result = clsx(...input)
      if (result) {
        classes.push(result)
      }
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}

/**
 * Utility function to merge class names
 * Simple implementation without Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/**
 * Creates a compound variant utility for component styling
 */
export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>
    compoundVariants?: Array<Record<string, any> & { class: string }>
    defaultVariants?: Record<string, string>
  }
) {
  return (props?: Record<string, any>) => {
    if (!config) {
      return base
    }

    const { variants, compoundVariants, defaultVariants } = config
    const activeVariants = { ...defaultVariants, ...props }

    let classes = base

    // Apply variant classes
    if (variants) {
      Object.entries(activeVariants).forEach(([key, value]) => {
        const variant = variants[key]
        if (variant && value && variant[value]) {
          classes += ` ${variant[value]}`
        }
      })
    }

    // Apply compound variant classes
    if (compoundVariants) {
      compoundVariants.forEach(compound => {
        const { class: compoundClass, ...conditions } = compound
        const matches = Object.entries(conditions).every(
          ([key, value]) => activeVariants[key] === value
        )
        if (matches) {
          classes += ` ${compoundClass}`
        }
      })
    }

    return cn(classes)
  }
}
