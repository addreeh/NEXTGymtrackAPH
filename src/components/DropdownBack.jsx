'use client'

import { IconChevronDown } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Dropdown ({ excercises }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleHoverMenu = () => {
    setIsOpen(!isOpen)
  }

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.5
      },
      display: 'block'
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.5,
        delay: 0.3
      },
      transitionEnd: {
        display: 'none'
      }
    }
  }

  return (
    <div className='flex flex-row w-full gap-5 px-2'>
      <motion.div
        className='menu-item w-full'
      >
        <button onClick={() => toggleHoverMenu()} className='text-white cursor-pointer bg-svg-bg py-2 px-4 rounded-full flex justify-between items-center w-full'>
          <p>1 Rep Max</p>
          <IconChevronDown className='w-5 h-5' />
        </button>
        <motion.div
          className='sub-menu bg-white'
          initial='exit'
          animate={isOpen ? 'enter' : 'exit'}
          variants={subMenuAnimate}
        >
          <div className='sub-menu-background' />
          <div className='sub-menu-container'>
            <div className='sub-menu-item'>Submenu Item 1</div>
            <div className='sub-menu-item'>Submenu Item 2</div>
            <div className='sub-menu-item'>Submenu Item 3</div>
            <div className='sub-menu-item'>Submenu Item 4</div>
            <div className='sub-menu-item'>Submenu Item 5</div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className='menu-item w-full'
      >
        <button onClick={() => toggleHoverMenu()} className='text-white cursor-pointer bg-svg-bg py-2 px-4 rounded-full flex justify-between items-center w-full'>
          <p>1 month</p>
          <IconChevronDown className='w-5 h-5' />
        </button>
        <motion.div
          className='sub-menu bg-white'
          initial='exit'
          animate={isOpen ? 'enter' : 'exit'}
          variants={subMenuAnimate}
        >
          <div className='sub-menu-background' />
          <div className='sub-menu-container'>
            <div className='sub-menu-item'>Submenu Item 1</div>
            <div className='sub-menu-item'>Submenu Item 2</div>
            <div className='sub-menu-item'>Submenu Item 3</div>
            <div className='sub-menu-item'>Submenu Item 4</div>
            <div className='sub-menu-item'>Submenu Item 5</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
