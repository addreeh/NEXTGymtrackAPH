'use client'

import { ArrowLeft, Calendar, ChevronRight, Crosshair, Loader2, ArrowRight } from 'lucide-react'
import React, { Suspense, useCallback, useEffect, useState, useRef } from 'react'
import { Drawer } from 'vaul'
import { motion, AnimatePresence } from 'framer-motion'
import { capitalizeWords } from '@/lib/mix'
import { Modal } from './Modal'
import { addExerciseToRoutine, editRoutine, handleSeriesChangeRoutine, insertExercisesRoutine } from '@/lib/actions'
import SerieSelector from './SerieSelector'
import RepsSelector from './RepsSelector'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const boxVariants = {
  hover: { scale: 1.05 },
  pressed: { scale: 0.95 }
}

const iconVariants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0 }
}

const tickVariants = {
  checked: { pathLength: 1 },
  unchecked: { pathLength: 0 }
}

const pageVariants = {
  enter: {
    x: '0%', opacity: 1
  },
  animate: {
    x: 0, opacity: 1
  },
  exit: {
    x: '-20%', opacity: 0, transition: { duration: 0.2 }
  }
}

const pageTransition = {
  delay: 0, duration: 0.2
}

export function DrawerEditWorkout ({ workout, setOpen, editOpen, setEditOpen, drawerPage, selectedExercise, setDrawerPage, children }) {
  const [workoutName, setWorkoutName] = useState(workout.name)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedDays, setSelectedDays] = useState({ [workout.day]: true })
  const [selectedExercises, setSelectedExercises] = useState([])
  const [exercises, setExercises] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [differenceExercises, setDifferenceExercises] = useState({})
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSerie, setSelectedSerie] = useState(0)
  const [selectedReps, setSelectedReps] = useState(0)

  const [numberSeries, setNumberSeries] = useState(selectedExercise?.series ? selectedExercise?.series?.match(/(\d+)\s*x/)?.[1] : 0)
  const [topSet, setTopSet] = useState(selectedExercise?.series ? selectedExercise?.series?.match(/TP(\d+)/)?.[1] : 0)
  const [backOffSet, setBackOffSet] = useState(selectedExercise?.series ? selectedExercise?.series?.match(/BOS(\d+)/)?.[1] : 0)

  const initialNumberSeries = useRef(selectedExercise?.series ? parseInt(selectedExercise.series) : 0)
  const initialTopSet = useRef(selectedExercise?.series?.match(/TP(\d+)/)?.[1] || 0)
  const initialBackOffSet = useRef(selectedExercise?.series?.match(/BOS(\d+)/)?.[1] || 0)

  console.log(drawerPage, currentPage)

  const hasValuesChanged = () => {
    return numberSeries !== initialNumberSeries.current ||
           topSet !== initialTopSet.current ||
           backOffSet !== initialBackOffSet.current
  }

  const handleArrowLeftClick = () => {
    if (currentPage === 0) {
      if (drawerPage === 1 && hasValuesChanged()) {
        setTimeout(() => {
          setDrawerPage(0)
          setEditOpen(false)
        }, 1000)
      } else {
        setEditOpen(false)
      }
    } else if (currentPage === 1) {
      setCurrentPage(0)
    } else if (currentPage === 2) {
      handleExercisesChangeExit()
      setCurrentPage(0)
    }
  }

  const handleSeriesChange = async (event, type) => {
    const value = parseInt(event.target.value)

    try {
      switch (type) {
        case 'numberSeries':
          setNumberSeries(value)
          await handleSeriesChangeRoutine(selectedExercise.id, value, exerciseTypes[selectedSerie])
          break
        case 'topSet':
          setTopSet(value)
          await handleSeriesChangeRoutine(selectedExercise.id, value, 'TP')
          break
        case 'backOffSet':
          setBackOffSet(value)
          await handleSeriesChangeRoutine(selectedExercise.id, value, 'BOS')
          break
      }
    } catch (error) {
      console.error('Error updating series:', error)
      // Aquí podrías manejar el error, por ejemplo mostrando una notificación
    }
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/workout')
      const responseData = await response.json()

      setExercises(responseData.exercises)

      const preSelectedExercises = {}
      workout.routine_exercises.forEach(routineExercise => {
        const exerciseId = routineExercise.exercise_definitions.id
        preSelectedExercises[exerciseId] = true
      })
      setSelectedExercises(preSelectedExercises)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [workout])

  useEffect(() => {
    if (editOpen) {
      fetchData()
    }
  }, [editOpen, fetchData])

  const handleDaySelection = useCallback((day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }))
  }, [])

  const handleExercisesChange = useCallback((id) => {
    setDifferenceExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
    setSelectedExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  const handleExercisesChangeExit = async () => {
    const selectedExercisesData = []

    Object.entries(differenceExercises).forEach(([id, isSelected]) => {
      if (isSelected) {
        const exercise = exercises.find(e => e.id === parseInt(id))
        if (exercise) {
          selectedExercisesData.push(exercise)
        }
      }
    })

    await insertExercisesRoutine(workout.id, selectedExercisesData)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const handleWorkoutNameChange = async (event) => {
    try {
      await editRoutine(workout.id, workoutName)
    } catch (error) {
      console.error('Error editing routine:', error)
    }
  }

  const exerciseTypes = [
    'Lineal',
    'Drop Set',
    'Rest Pause',
    'Top Set',
    'Back Off Set',
    '2 + 1 Slow',
    'Target'
  ]

  const getSeriesType = (seriesString) => {
    const lowerSeriesString = seriesString.toLowerCase()

    const foundType = exerciseTypes.find(type =>
      lowerSeriesString.includes(type.toLowerCase())
    )

    return foundType || 'Unknown Type'
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Drawer.Root open={editOpen} shouldScaleBackground>
        <Drawer.Trigger asChild>
          {children}
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 rounded-3xl bg-drawer-overlay border-2 border-drawer-border' />
          <Drawer.Content className='bg-drawer-bg flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0'>
            <div className='p-4 bg-drawer-bg rounded-t-[10px] flex-1'>
              <div className='mx-auto w-20 h-1 flex-shrink-0 rounded-full bg-white mb-4' />
              <div className='max-w-md mx-auto'>
                <div className='w-full flex flex-row justify-between items-center text-white mb-4 font-bold'>
                  <motion.div
                    animate={{ rotate: currentPage === 0 ? -90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className='cursor-pointer'
                    onClick={handleArrowLeftClick}
                  >
                    <ArrowLeft />
                  </motion.div>
                  {(drawerPage !== 1)
                    ? (<Modal workout={workout.id} setOpen={setOpen} setEditOpen={setEditOpen} drawerPage={drawerPage} />)
                    : (<Modal workout={workout.id} setOpen={setOpen} setEditOpen={setEditOpen} drawerPage={drawerPage} setDrawerPage={setDrawerPage} exerciseId={selectedExercise.id} />)}
                </div>
                {drawerPage !== 1
                  ? (
                    <AnimatePresence initial={false} mode='wait'>
                      {currentPage === 0 && (
                        <motion.div
                          key='page0'
                          initial='enter'
                          animate='center'
                          exit='exit'
                          variants={pageVariants}
                          transition={pageTransition}
                          className='flex flex-col gap-7'
                        >
                          <div className='flex flex-col gap-2'>
                            <Drawer.Title className='font-bold text-4xl text-white'>
                              Settings
                            </Drawer.Title>
                            <Drawer.Description className='text-white/75 text-xs'>
                              Edit settings for this workout
                            </Drawer.Description>
                          </div>
                          <motion.div
                            key={currentPage}
                            initial={{ x: '20%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-20%', opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ delay: 0, duration: 0.2 }}
                            className='flex flex-col gap-4 px-2'
                          >
                            <input
                              type='text'
                              placeholder='Enter a name'
                              className='bg-transparent border-b-2 border-white/75 border-t-0 border-l-0 border-r-0 py-4 text-white'
                              value={workoutName}
                              onChange={(e) => setWorkoutName(e.target.value)}
                              onBlur={handleWorkoutNameChange}
                            />
                            <div className='flex flex-col gap-6 w-full pt-4'>
                              <div className='flex flex-row text-white w-full gap-4 cursor-pointer' onClick={() => setCurrentPage(1)}>
                                <div className='rounded-full bg-svg-bg p-2.5 text-white cursor-pointer'>
                                  <Calendar size={22} strokeWidth={2} />
                                </div>
                                <div className='w-full justify-between flex flex-row items-center'>
                                  <div>
                                    <p className='text-white text-sm font-semibold'>Schedule</p>
                                    <p className='text-white/75 text-[10px]'>{workout.day}</p>
                                  </div>
                                  <ChevronRight size={20} strokeWidth={2} className='text-white/30' />
                                </div>
                              </div>
                              <div className='flex flex-row text-white w-full gap-4 cursor-pointer' onClick={() => setCurrentPage(2)}>
                                <div className='rounded-full bg-svg-bg p-2.5 text-white'>
                                  <Crosshair size={22} strokeWidth={2} />
                                </div>
                                <div className='w-full justify-between flex flex-row items-center'>
                                  <div>
                                    <p className='text-white text-sm font-semibold'>Exercises</p>
                                    <p className='text-white/75 text-[10px]'>Add more exercises to this workout</p>
                                  </div>
                                  <ChevronRight size={20} strokeWidth={2} className='text-white/30' />
                                </div>
                              </div>
                            </div>
                          </motion.div>

                        </motion.div>
                      )}
                      {currentPage === 1 && (
                        <motion.div
                          key='page1'
                          initial='enter'
                          animate='center'
                          exit='exit'
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <div className='flex flex-col gap-4'>
                            <p className='text-white border-b-2 pb-1 border-b-white/75 w-20'>Weekdays</p>
                            <p className='text-white/75'>On which <span className='text-white font-semibold'>days of the week</span> should this workout be performed?</p>
                            <div className='grid grid-cols-3 gap-x-3 gap-y-5'>
                              {days.map((day, index) => (
                                <div
                                  key={index}
                                  className={`flex justify-center items-center space-x-2 gap-3 font-semibold rounded-3xl p-3 cursor-pointer ${
                                    selectedDays[day] ? 'bg-white text-drawer-bg' : 'bg-svg-bg text-white'
                                  }`}
                                  onClick={() => handleDaySelection(day)}
                                >
                                  {day}
                                </div>
                              ))}
                            </div>
                            <p className='text-white/65 text-sm'>Pick weekdays to repeat this on</p>
                          </div>
                        </motion.div>
                      )}

                      {currentPage === 2 && (
                        <motion.div
                          key='page2'
                          initial='enter'
                          animate='center'
                          exit='exit'
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <div className='flex flex-col gap-4 h-[calc(100vh-250px)]' id='exercises'>
                            {isLoading
                              ? (
                                <p className='text-white'>Loading exercises...</p>
                                )
                              : exercises?.length === 0
                                ? (
                                  <p className='text-white'>No exercises found in the API response.</p>
                                  )
                                : exercises.map((exercise) => (
                                  <div key={exercise.id} className='flex items-center space-x-2 gap-3'>
                                    <label className='relative flex items-center justify-center'>
                                      <motion.input
                                        type='checkbox'
                                        className='rounded-2xl border-2 border-svg-border bg-svg-bg relative h-14 w-14 cursor-pointer appearance-none transition-all duration-500 checked:border-svg-border checked:bg-white'
                                        onChange={() => handleExercisesChange(exercise.id)}
                                        checked={selectedExercises[exercise.id] || false}
                                        variants={boxVariants}
                                        whileHover='hover'
                                        whileTap='pressed'
                                      />
                                      <div className='pointer-events-none absolute inset-0 flex items-center justify-center text-svg-text'>
                                        <motion.svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          fill='none'
                                          viewBox='0 0 24 24'
                                          strokeWidth='3.5'
                                          stroke='currentColor'
                                          className='h-9 w-9 absolute'
                                          initial={false}
                                          animate={selectedExercises[exercise.id] ? 'visible' : 'hidden'}
                                          variants={iconVariants}
                                        >
                                          <motion.path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M4.5 12.75l6 6 9-13.5'
                                            variants={tickVariants}
                                            initial='unchecked'
                                            animate={selectedExercises[exercise.id] ? 'checked' : 'unchecked'}
                                          />
                                        </motion.svg>
                                      </div>
                                    </label>
                                    <div className='flex flex-col'>
                                      <p className='text-white text-lg font-semibold'>{capitalizeWords(exercise.name)}</p>
                                      <p className='text-white/75 text-xs'>{exercise.muscle_group}</p>
                                    </div>
                                  </div>
                                ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    )
                  : (
                    <AnimatePresence initial={false} mode='wait'>
                      <motion.div
                        key='page0'
                        initial='enter'
                        animate='center'
                        exit='exit'
                        variants={pageVariants}
                        transition={pageTransition}
                        className='flex flex-col gap-7'
                      >
                        <div className='flex flex-col gap-2'>
                          <Drawer.Title className='font-bold text-4xl text-white'>
                            Series
                          </Drawer.Title>
                          <Drawer.Description className='text-white/75 text-xs'>
                            Add a series to this workout
                          </Drawer.Description>
                        </div>
                        <div>
                          <div className='flex flex-row items-center gap-4'>
                            {(numberSeries || topSet || backOffSet) && <p className='text-white'>Current series</p>}
                            {numberSeries
                              ? (
                                <>
                                  <input
                                    type='number' min='0' max='10' value={numberSeries} className='border-2 border-svg-border rounded-2xl p-2 text-white'
                                    onChange={(e) => handleSeriesChange(e, 'numberSeries')}
                                  />
                                  <p className='text-white'>{getSeriesType(selectedExercise.series)}</p>
                                </>
                                )
                              : topSet
                                ? (
                                  <>
                                    <input
                                      type='number' min='0' max='10' value={topSet} className='border-2 border-svg-border rounded-2xl p-2 text-white'
                                      onChange={(e) => handleSeriesChange(e, 'topSet')}

                                    />

                                  </>
                                  )
                                : backOffSet
                                  ? (
                                    <input
                                      type='number' min='0' max='10' value={backOffSet} className='border-2 border-svg-border rounded-2xl p-2 text-white'
                                      onChange={(e) => handleSeriesChange(e, 'backOffSet')}
                                    />
                                    )
                                  : (
                                    <></>
                                    )}
                          </div>
                          <div className='flex flex-col mt-4'>
                            <p className='text-white'>Type of series</p>
                            <SerieSelector selectedSerie={selectedSerie} setSelectedSerie={setSelectedSerie} exerciseTypes={exerciseTypes} />
                          </div>
                          <div className='flex flex-col'>
                            <p className='text-white'>Reps</p>
                            <RepsSelector selectedReps={selectedReps} setSelectedReps={setSelectedReps} />
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    )}
              </div>
            </div>
            {drawerPage === 1 && (
              <div className='px-4 py-10 bg-drawer-bg flex justify-end items-end'>
                <button
                  className='bg-white text-black font-bold px-4 py-2 rounded-full flex flex-row items-center justify-between  gap-2'
                  onClick={async () => {
                    setIsAdding(true)
                    const serie = {
                      id: selectedExercise.id,
                      routine_id: workout.id,
                      exercise_id: selectedExercise.exercise_definitions.id,
                      series: exerciseTypes[selectedSerie] === 'Top Set' ? `${selectedReps + 1} x TS` : exerciseTypes[selectedSerie] === 'Back Off Set' ? `${selectedReps + 1} x BOS` : `${selectedReps + 1} x ${exerciseTypes[selectedSerie].toUpperCase()}`
                    }
                    await addExerciseToRoutine(serie)
                    setTimeout(() => {
                      setIsAdding(false)
                      setDrawerPage(0)
                      setEditOpen(false)
                    }, 2000)
                  }}
                >
                  {isAdding
                    ? <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    : <ArrowRight strokeWidth={2.5} />} {currentPage === 4
                      ? isAdding
                        ? 'Creating'
                        : 'Finish'
                      : 'Continue'}
                </button>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Suspense>
  )
}
