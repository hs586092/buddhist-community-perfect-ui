import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Layout } from './Layout'
import { Home } from '@pages/Home'

// Layout wrapper with animations
function AnimatedLayout() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Outlet />
      </motion.div>
    </Layout>
  )
}

// Sample pages for demonstration
function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to our Buddhist Community Platform - a modern space for spiritual growth, 
            community connection, and mindful living.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mt-4">
            This platform demonstrates the integration of modern web technologies including 
            React Query, Zustand, React Router, Framer Motion, and Tailwind CSS.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Community</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Discussion Forums</h3>
            <p className="text-gray-600">
              Engage in meaningful conversations with fellow practitioners.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Events & Workshops</h3>
            <p className="text-gray-600">
              Join guided meditations, dharma talks, and community events.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Resources</h1>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="border-l-4 border-amber-400 pl-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Buddhist Texts</h3>
            <p className="text-gray-600">Access to classical and contemporary Buddhist literature.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="border-l-4 border-purple-400 pl-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Meditation Guides</h3>
            <p className="text-gray-600">Step-by-step instructions for various meditation practices.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="border-l-4 border-rose-400 pl-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Audio Teachings</h3>
            <p className="text-gray-600">Listen to dharma talks and guided meditations.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <AnimatedLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/community',
        element: <CommunityPage />,
      },
      {
        path: '/resources',
        element: <ResourcesPage />,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}