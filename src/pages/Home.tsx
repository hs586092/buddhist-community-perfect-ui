import { Heart, Users, BookOpen, Calendar } from 'lucide-react'
import { Button } from '../components/ui'
import type { BaseProps } from '../types'

const features = [
  {
    icon: Heart,
    title: 'Mindful Practice',
    description: 'Connect with guided meditation sessions and mindfulness practices.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join a supportive community of practitioners on the path.',
  },
  {
    icon: BookOpen,
    title: 'Teachings',
    description: 'Access dharma talks, texts, and educational resources.',
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Participate in retreats, workshops, and community gatherings.',
  },
]

export interface HomeProps extends BaseProps {}

export function Home({ className }: HomeProps) {
  return (
    <div className={className}>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl p-8 mb-12'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>Welcome to Our Buddhist Community</h1>
          <p className='text-xl md:text-2xl mb-8 text-blue-100'>
            A space for mindful practice, learning, and connection on the path to awakening
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' variant='secondary'>
              Join Community
            </Button>
            <Button size='lg' variant='outline'>
              Explore Teachings
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='mb-12'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Nurture Your Practice</h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Discover tools and resources to support your journey toward inner peace and wisdom
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
              >
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                  <Icon className='w-6 h-6 text-blue-600' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>{feature.title}</h3>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className='bg-gray-100 rounded-xl p-8 text-center'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Ready to Begin Your Journey?</h2>
        <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
          Take the first step toward a more mindful and peaceful life. Join our community today and
          connect with fellow practitioners.
        </p>
        <Button size='lg'>Get Started</Button>
      </section>
    </div>
  )
}
