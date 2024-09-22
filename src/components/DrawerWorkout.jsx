'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, useState } from 'react'
import { Drawer } from 'vaul'

import { capitalizeWords } from '@/lib/mix'

// import { Dots } from '../assets/svg/Dots'
// import { Adjustments } from '../assets/svg/Adjustments'

import { InfoPopover } from '@/components/InfoPopover'
import { renderDescription } from '@/components/RenderDescription'
import { ToDo } from '@/components/ToDo'
import { Abs } from '@/svg/Abs'
import { Arms } from '@/svg/Arms'
import { Back } from '@/svg/Back'
import { Chest } from '@/svg/Chest'
import { Legs } from '@/svg/Legs'
import { Shoulder } from '@/svg/Shoulder'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'

function findMaxWeightProgress (exercise) {
  if (!exercise.progress.lastWeek || exercise.progress.lastWeek.length === 0) {
    return null
  }

  const maxWeightProgress = exercise.progress.lastWeek.reduce((max, current) => {
    const currentMaxWeight = Math.max(...current.weight)
    return currentMaxWeight > max ? currentMaxWeight : max
  }, 0)

  return maxWeightProgress
}

export function DrawerWorkout ({ workout }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState()
  const [open, setOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Drawer.Root open={open} shouldScaleBackground onClose={() => setCurrentPage(0)}>
        <Drawer.Trigger asChild>
          <div onClick={() => setOpen(true)} className='border-card-border flex h-[9.5rem] w-[9.5rem] flex-col justify-between rounded-3xl border-2 bg-card-bg p-4 cursor-pointer ml-1.5'>
            <div className='text-card-border flex w-full justify-between'>
              <div className='border-card-border-2 flex h-16 w-16 items-center justify-center rounded-full border-2'>
                <h2 className='border-card-border flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl text-white'>
                  0
                </h2>
              </div>
              <div className='mt-2 text-card-border-2'>
                <svg fill='currentColor' width='20' height='20' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='currentColor'>
                  <g id='SVGRepo_bgCarrier' strokeWidth='0' />
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />
                  <g id='SVGRepo_iconCarrier'>
                    <path d='M1,6A1,1,0,0,1,2,5H12a1,1,0,0,1,0,2H2A1,1,0,0,1,1,6ZM22,5H17V3a1,1,0,0,0-2,0V9a1,1,0,0,0,2,0V7h5a1,1,0,0,0,0-2Zm0,12H13V15a1,1,0,0,0-2,0v6a1,1,0,0,0,2,0V19h9a1,1,0,0,0,0-2ZM8,19a1,1,0,0,0,0-2H2a1,1,0,0,0,0,2Z' />
                  </g>

                </svg>
              </div>
            </div>
            <div className='flex flex-col'>
              <h3 className='text-sm font-semibold text-white'>
                {workout.name}
              </h3>
              <h4 className='text-card-text text-xs'>
                {workout.day}
              </h4>
            </div>
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 rounded-3xl bg-drawer-overlay border-2 border-drawer-border' />
          <Drawer.Content className='bg-drawer-bg flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0'>
            <div
              className='p-4 bg-drawer-bg rounded-t-[10px] flex-1'
            >
              <div className='mx-auto w-20 h-1 flex-shrink-0 rounded-full bg-white mb-4' />
              <div className='max-w-md mx-auto'>
                <div className='w-full flex flex-row justify-between items-center text-white mb-4 font-bold'>
                  <motion.div
                    animate={{ rotate: currentPage === 0 ? -90 : 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      currentPage === 1 && setCurrentPage(0)
                      currentPage === 0 && setOpen(false)
                    }}
                  >
                    <ArrowLeft />
                  </motion.div>
                  {selectedExercise && selectedExercise.exercise_definitions.progress.length > 0 &&
                    <motion.button
                      initial={currentPage === 1 ? { opacity: 0, scale: 0.5 } : { opacity: 0 }}
                      animate={currentPage === 1 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                      transition={currentPage === 1 ? { duration: 0.5 } : { duration: 0 }}
                      className='bg-svg-bg text-white rounded-full font-semibold p-3 relative'
                      onClick={() => setInfoOpen(!infoOpen)}
                    >
                      <Info />
                      <InfoPopover isOpen={infoOpen} onClose={() => setInfoOpen(false)} selectedExercise={selectedExercise} />
                    </motion.button>}
                </div>
                <AnimatePresence initial={false} mode='wait'>
                  <motion.div
                    key={currentPage}
                    initial={{ x: '20%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-20%', opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ delay: 0, duration: 0.2 }}
                    className='flex flex-col gap-4'
                  >
                    {currentPage === 0
                      ? (
                        <>
                          <Drawer.Title className='font-bold text-4xl text-white'>
                            {workout.name}
                          </Drawer.Title>
                          <Drawer.Description className='text-white'>
                            {workout.day}
                          </Drawer.Description>
                          <div className='flex flex-col gap-4 h-full overflow-auto pb-10' id='exercises'>
                            {workout && workout.routine_exercises.map((exercise, index) => (
                              <div
                                key={`${exercise.exercise_definitions.id}-${index}`}
                                className='flex flex-row justify-between items-center'
                                onClick={() => {
                                  setCurrentPage(1)
                                  setSelectedExercise(exercise)
                                }}
                              >
                                <div className='flex flex-row items-center gap-4'>
                                  <div className='bg-transparent border-2 border-svg-bg w-14 h-14 rounded-full text-white flex flex-row items-center justify-center'>
                                    <div className='bg-svg-bg w-12 h-12 text-white rounded-full flex justify-center items-center'>
                                      {exercise.exercise_definitions.muscle_group === 'Hombros' && <Shoulder />}
                                      {exercise.exercise_definitions.muscle_group === 'Abdominales' && <Abs />}
                                      {exercise.exercise_definitions.muscle_group === 'Piernas' && <Legs />}
                                      {exercise.exercise_definitions.muscle_group === 'Pecho' && <Chest />}
                                      {exercise.exercise_definitions.muscle_group === 'Espalda' && <Back />}
                                      {(exercise.exercise_definitions.muscle_group === 'Biceps' || exercise.exercise_definitions.muscle_group === 'Triceps') && <Arms />}
                                    </div>
                                  </div>
                                  <div className='flex flex-col justify-center'>
                                    <p className='text-white font-semibold'>{capitalizeWords(exercise.exercise_definitions.name)}</p>
                                    <p className='text-white text-sm'>
                                      {(!exercise.series.includes('SST') && !exercise.series.includes('TP') && exercise.series.includes('TS') && !exercise.series.includes('BOS')) ? capitalizeWords(exercise.series) : exercise.series}
                                    </p>
                                  </div>
                                </div>
                                <div className='text-arrow-right flex flex-row items-center gap-5'>
                                  {exercise.exercise_definitions.progress && findMaxWeightProgress(exercise.exercise_definitions)
                                    ? (
                                      <div className='relative w-12 h-12 bg-svg-bg rounded-full flex justify-center items-center text-white'>
                                        <p className='text-2xl font-semibold'>{findMaxWeightProgress(exercise.exercise_definitions)}</p>
                                        <div className='absolute w-full h-0.5 bg-svg-bg top-1/2 transform -translate-y-1/2' />
                                      </div>
                                      )
                                    : (
                                      <ArrowRight />
                                      )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                        )
                      : (
                        <>
                          <Drawer.Title className='font-bold text-4xl text-white truncate text-ellipsis overflow-hidden'>
                            {capitalizeWords(selectedExercise.exercise_definitions.name)}
                          </Drawer.Title>
                          <Drawer.Description className='text-white'>
                            Tick the checkboxes as you complete the sets
                          </Drawer.Description>
                          <ToDo exercise={selectedExercise} exerciseId={selectedExercise.exercise_definitions.id} series={selectedExercise.series} progress={selectedExercise.exercise_definitions.progress} workoutDay={workout.day} />
                          <hr className='h-px my-2 border-0 bg-gray-700' />
                          {renderDescription({ selectedExercise })}
                        </>
                        )}

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Suspense>
  )
}