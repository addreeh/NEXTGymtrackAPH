'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function RepsSelector ({ selectedReps, setSelectedReps }) {
  const containerRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    const selectedElement = itemRefs.current[selectedReps]
    if (selectedElement && containerRef.current) {
      const container = containerRef.current
      const containerHeight = container.clientHeight
      const elementHeight = selectedElement.clientHeight || 60
      const scrollPosition = selectedElement.offsetTop - (containerHeight / 2) + (elementHeight / 2)
      container.scrollTo({ top: scrollPosition, behavior: 'smooth' })
    }
  }, [selectedReps])

  const handleScroll = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.top + containerRect.height / 2

    let closestIndex = 0
    let closestDistance = Infinity

    itemRefs.current.forEach((item, index) => {
      if (item) {
        const itemRect = item.getBoundingClientRect()
        const itemCenter = itemRect.top + itemRect.height / 2
        const distance = Math.abs(containerCenter - itemCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      }
    })

    if (closestIndex !== selectedReps) {
      setSelectedReps(closestIndex)
    }
  }

  const handleItemClick = (index) => {
    if (index !== selectedReps) {
      setSelectedReps(index)
    }
  }

  return (
    < >
      <div className='relative w-full h-[180px] overflow-hidden mb-4'>
        <div
          ref={containerRef}
          id='hide-scroll'
          className='absolute inset-0 overflow-y-auto scrollbar-hide'
          onScroll={handleScroll}
        >
          <div className='h-[60px]' />
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={index}
              ref={el => { itemRefs.current[index] = el }}
              className={`h-[60px] flex items-center justify-center text-2xl font-bold cursor-pointer
                ${index === selectedReps ? 'text-white' : 'text-gray-500'}`}
              animate={{
                scale: index === selectedReps ? 1 : 0.8,
                opacity: index === selectedReps ? 1 : 0.6
              }}
              transition={{ duration: 0.2 }}
              onClick={() => handleItemClick(index + 1)}
            >
              {index + 1}
            </motion.div>
          ))}
          <div className='h-[60px]' />
        </div>
        <div className='absolute inset-x-0 top-1/2 h-[60px] -translate-y-1/2 pointer-events-none border-t-2 border-b-2 border-white/10' />
      </div>
      {/* <button
        onClick={() => setShowSelected(true)}
        className='bg-white text-gray-900 px-4 py-2 rounded-full flex items-center'
      >
        Select
        <ChevronRight className='ml-2' />
      </button> */}
      {/* {showSelected && (
        <div className='mt-4 text-white text-xl'>
          Selected: {exerciseTypes[selectedIndex]}
        </div>
      )} */}
    </>
  )
}
