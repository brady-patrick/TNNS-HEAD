'use client'

import { useState } from 'react'
import { Button } from 'react-aria-components'
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  ComputerDesktopIcon 
} from '@untitledui/icons/react'
import { useTheme } from 'next-themes'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">TNNS HEAD</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  className="btn btn-secondary"
                  onPress={() => setTheme('light')}
                  aria-label="Light mode"
                >
                  <SunIcon className="h-4 w-4" />
                </Button>
                <Button
                  className="btn btn-secondary"
                  onPress={() => setTheme('dark')}
                  aria-label="Dark mode"
                >
                  <MoonIcon className="h-4 w-4" />
                </Button>
                <Button
                  className="btn btn-secondary"
                  onPress={() => setTheme('system')}
                  aria-label="System theme"
                >
                  <ComputerDesktopIcon className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Mobile menu button */}
              <Button
                className="btn btn-secondary md:hidden"
                onPress={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6 animate-fade-in">
              Welcome to TNNS HEAD
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
              A modern Next.js application built with Untitled UI components, 
              featuring beautiful design and excellent user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button className="btn btn-primary">
                Get Started
              </Button>
              <Button className="btn btn-secondary">
                Learn More
              </Button>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: 'Modern Design',
                description: 'Built with the latest design principles and components',
                icon: '🎨'
              },
              {
                title: 'Responsive',
                description: 'Fully responsive design that works on all devices',
                icon: '📱'
              },
              {
                title: 'Accessible',
                description: 'Built with accessibility in mind using React Aria',
                icon: '♿'
              },
              {
                title: 'Fast',
                description: 'Optimized for performance and speed',
                icon: '⚡'
              },
              {
                title: 'Customizable',
                description: 'Easy to customize with Tailwind CSS',
                icon: '🔧'
              },
              {
                title: 'Type Safe',
                description: 'Full TypeScript support for better development',
                icon: '🛡️'
              }
            ].map((feature, index) => (
              <div key={index} className="card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="card-header">
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <h3 className="card-title">{feature.title}</h3>
                </div>
                <div className="card-content">
                  <p className="card-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="card bg-gradient-to-r from-brand-500 to-brand-600 text-white">
              <div className="card-header">
                <h3 className="card-title text-white">Ready to get started?</h3>
                <p className="card-description text-brand-100">
                  Start building your next great project with TNNS HEAD
                </p>
              </div>
              <div className="card-content">
                <Button className="btn bg-white text-brand-600 hover:bg-gray-100">
                  Start Building
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 TNNS HEAD. Built with Next.js and Untitled UI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
