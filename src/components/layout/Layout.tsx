import { Header } from './Header'
import { cn } from '../../utils'
import type { BaseProps } from '../../types'

export interface LayoutProps extends BaseProps {
  sidebar?: React.ReactNode
  footer?: React.ReactNode
}

export function Layout({ children, className, sidebar, footer }: LayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Header />

      <div className='flex-1 flex'>
        {sidebar && (
          <aside className='hidden lg:flex lg:flex-shrink-0'>
            <div className='flex flex-col w-64 border-r border-gray-200 bg-white'>
              <div className='flex-1 flex flex-col min-h-0'>
                <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>{sidebar}</div>
              </div>
            </div>
          </aside>
        )}

        <main className={cn('flex-1 flex flex-col', className)}>
          <div className='flex-1 px-4 sm:px-6 lg:px-8 py-8'>{children}</div>
        </main>
      </div>

      {footer && (
        <footer className='bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4'>
          {footer}
        </footer>
      )}
    </div>
  )
}
