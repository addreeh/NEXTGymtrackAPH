import useOutsideClick from '@/hooks/useOutsideClick'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

export const InfoPopover = ({ isOpen, onClose, selectedExercise, triggerRef }) => {
  const popoverRef = useOutsideClick(onClose)

  if (!isOpen || !selectedExercise?.exercise_definitions?.progress?.lastWeek?.length) {
    return null
  }

  // Calculate position relative to trigger button
  const calculatePosition = () => {
    if (!triggerRef.current) return {}
    const rect = triggerRef.current.getBoundingClientRect()
    return {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left - 220}px` // Adjust based on your needs
    }
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className='fixed bg-popover-bg text-white py-4 rounded-3xl shadow-lg w-60 border-popover-border border-2'
        style={calculatePosition()}
      >
        <h3 className='mb-2 text-left px-4'>Previous Week Progress</h3>
        <div className='flex flex-col bg-popover-card'>
          {selectedExercise.exercise_definitions.progress.lastWeek.map((exercise, index) => (
            <div key={index} className='flex items-center gap-2 px-4 py-2 border-b-2 border-[#3B3A3F]'>
              {index === 0
                ? (
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M17 7l-10 10' /><path d='M8 7l9 0l0 9' /></svg>
                  )
                : (
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M5 12l14 0' /><path d='M13 18l6 -6' /><path d='M13 6l6 6' /></svg>
                  )}
              <p>{exercise.weight} kg x {exercise.repetitions} reps</p>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
