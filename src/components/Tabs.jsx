'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = [
  { id: 'home', label: 'Inicio', content: 'Bienvenido a la página de inicio. Aquí encontrarás información general.' },
  { id: 'about', label: 'Acerca de', content: 'Somos una empresa dedicada a crear soluciones innovadoras.' },
  { id: 'contact', label: 'Contacto', content: 'Puedes contactarnos en info@ejemplo.com o llamando al 123-456-789.' }
]

export default function Tabs () {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <div className='w-full max-w-3xl mx-auto p-4'>
      <div className='flex space-x-1 mb-4'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-muted text-white/70 hover:bg-muted-foreground/10'
            } relative px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId='activeTab'
                className='absolute inset-0 bg-primary'
                style={{ borderRadius: 6 }}
                transition={{ type: 'spring', duration: 0.6 }}
              />
            )}
            <span className='relative z-10'>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className='bg-card text-red-400 rounded-lg p-6 h-[200px] overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
