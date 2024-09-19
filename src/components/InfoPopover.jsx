import useOutsideClick from '@/hooks/useOutsideClick'
import { AnimatePresence, motion } from 'framer-motion'

export const InfoPopover = ({ isOpen, onClose, selectedExercise }) => {
  const popoverRef = useOutsideClick(onClose)

  return (
    <AnimatePresence>
      {isOpen && selectedExercise.exercise_definitions.progress.length > 0 && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className='absolute top-12 right-0 bg-popover-bg text-white py-4 rounded-3xl shadow-lg z-10 w-60 border-popover-border border-2'
        >
          <h3 className='mb-2 text-left px-4'>Previous Week Progress</h3>
          <div className='flex flex-col bg-popover-card'>
            <div key={selectedExercise.exercise_definitions.progress[0].id} className='flex items-center gap-2 px-4  py-2 border-b-2 border-[#3B3A3F]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='icon icon-tabler icons-tabler-outline icon-tabler-arrow-up-right'><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M17 7l-10 10' /><path d='M8 7l9 0l0 9' /></svg>
              <p>{selectedExercise.exercise_definitions.progress[0].weight} kg x {selectedExercise.exercise_definitions.progress[0].repetitions} reps</p>
            </div>
            {selectedExercise.exercise_definitions.progress.slice(1).map((exercise, index) => (
              <div key={index} className='flex items-center gap-2 px-4  py-2 border-b-2 border-[#3B3A3F]'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='icon icon-tabler icons-tabler-outline icon-tabler-arrow-right'><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M5 12l14 0' /><path d='M13 18l6 -6' /><path d='M13 6l6 6' /></svg>
                <p>{exercise.weight} kg x {exercise.repetitions} reps</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
