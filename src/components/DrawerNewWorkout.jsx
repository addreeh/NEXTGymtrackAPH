'use client'

import React, { Suspense, useState, useCallback, useEffect } from 'react'
import { Drawer } from 'vaul'
import { ProgressBar } from 'react-step-progress-bar'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Plus, ArrowRight } from 'lucide-react'
import { capitalizeWords } from '@/lib/mix'
import { createRoutine } from '@/lib/actions'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const muscleGroups = [
  { id: 'Pecho', label: 'Push', category: 'Upper body', desc: 'Pushing weight away from the body' },
  { id: 'Espalda', label: 'Pull', category: 'Upper body', desc: 'Pulling weight toward the body' },
  { id: 'Piernas', label: 'Legs', category: 'Lower body', desc: 'Quads, hamstrings, calves and glutes' },
  { id: 'Hombros', label: 'Shoulders', category: 'Upper body', desc: 'Just shoulders' },
  { id: 'Brazos', label: 'Arms', category: 'Upper body', desc: 'Bicepts and triceps' },
  { id: 'Abdominales', label: 'Core', category: 'Core', desc: 'Abdominals' },
  { id: 'Torso', label: 'Upper body', category: 'Group', desc: 'Excercises for muscles in upper body' },
  { id: 'Full body', label: 'Full body', category: 'Group', desc: 'Excercises for all major muscles' },
  { id: 'Otros', label: 'Other', category: 'Other', desc: 'Excercises for other muscle groups' }
]

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

export function DrawerNewWorkout ({ exercises }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [workoutName, setWorkoutName] = useState('')
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState({})
  const [selectedDays, setSelectedDays] = useState({})
  const [filteredExercises, setFilteredExercises] = useState([])
  const [selectedExercises, setSelectedExercises] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const filtered = exercises.filter(exercise =>
      selectedMuscleGroups[exercise.muscle_group] ||
      (selectedMuscleGroups.Torso && ['Pecho', 'Espalda', 'Hombros', 'Brazos'].includes(exercise.muscle_group)) ||
      (selectedMuscleGroups['Full body'] && exercise.muscle_group !== 'Otros')
    )
    setFilteredExercises(filtered)
  }, [selectedMuscleGroups, exercises])

  const handleMuscleGroupChange = useCallback((id) => {
    setSelectedMuscleGroups(prev => {
      const newState = { ...prev, [id]: !prev[id] }

      if (id === 'Torso') {
        muscleGroups.forEach(group => {
          if (group.category === 'Upper body') {
            newState[group.id] = newState[id]
          }
        })
      } else if (id === 'Full body') {
        muscleGroups.forEach(group => {
          if (group.category !== 'Group' && group.category !== 'Other') {
            newState[group.id] = newState[id]
          }
        })
      } else {
        // Check if all upper body muscles are selected
        const allUpperBodySelected = muscleGroups
          .filter(group => group.category === 'Upper body')
          .every(group => newState[group.id])
        newState.Torso = allUpperBodySelected

        // Check if all muscles are selected
        const allMusclesSelected = muscleGroups
          .filter(group => group.category !== 'Group' && group.category !== 'Other')
          .every(group => newState[group.id])
        newState['Full body'] = allMusclesSelected
      }

      return newState
    })
  }, [])

  const handleExercisesChange = useCallback((id) => {
    setSelectedExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  const handleDaySelection = useCallback((day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }))
  }, [])

  const progressPercentage = () => {
    switch (currentPage) {
      case 0: return 33
      case 1: return 66
      case 2: return 100
      default: return 0
    }
  }

  const validatePage = () => {
    const newErrors = {}

    switch (currentPage) {
      case 0:
        if (!workoutName.trim()) {
          newErrors.workoutName = 'Workout name is required'
        }
        break
      case 1:
        if (Object.values(selectedMuscleGroups).filter(Boolean).length === 0) {
          newErrors.muscleGroups = 'At least one muscle group must be selected'
        }
        break
      case 2:
        if (Object.values(selectedDays).filter(Boolean).length === 0) {
          newErrors.days = 'At least one day must be selected'
        }
        break
      case 3:
        if (Object.values(selectedExercises).filter(Boolean).length === 0) {
          newErrors.exercises = 'At least one exercise must be selected'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextPage = () => {
    if (validatePage()) {
      if (currentPage < 4) {
        setCurrentPage(currentPage + 1)
      } else {
        showSummary()
        setOpen(false)
      }
    }
  }

  const showSummary = async () => {
    const summary = {
      workoutName,
      selectedMuscleGroups: Object.keys(selectedMuscleGroups).filter(key => selectedMuscleGroups[key]),
      selectedDays: Object.keys(selectedDays).filter(key => selectedDays[key]),
      selectedExercises: Object.keys(selectedExercises)
        .filter(key => selectedExercises[key])
        .map(id => {
          const exercise = exercises.find(e => e.id === Number(id))
          return exercise
            ? { id: exercise.id, name: capitalizeWords(exercise.name) }
            : { id, name: `Exercise with ID ${id} not found` }
        })
    }

    console.log('Workout Summary:', summary)
    const result = await createRoutine(summary)
    console.warn(result)
  }

  const renderPageContent = () => {
    return (
      <div className='h-full w-full flex flex-col overflow-y-hidden'>
        <div className='flex-shrink-0'>
          {currentPage === 0 && (
            <>
              <Drawer.Title className='font-bold text-4xl text-white pb-2'>
                Name
              </Drawer.Title>
              <Drawer.Description className='text-white/85 text-sm'>
                Set a name for this workout
              </Drawer.Description>
            </>
          )}
          {currentPage === 3 && (
            <>
              <Drawer.Title className='font-bold text-4xl text-white truncate text-ellipsis overflow-hidden pb-2'>
                Exercises
              </Drawer.Title>
              <Drawer.Description className='text-white text-sm'>
                Select exercises for your workout
              </Drawer.Description>
            </>
          )}
          {currentPage === 4 && (
            <>
              <Drawer.Title className='font-bold text-4xl text-white truncate text-ellipsis overflow-hidden'>
                Summary
              </Drawer.Title>
              <Drawer.Description className='text-white text-sm'>
                Review your workout plan
              </Drawer.Description>
            </>
          )}
        </div>
        <div className='flex-grow overflow-y-auto mt-4'>
          {currentPage === 0 && (
            <div className='flex flex-col gap-4'>
              <input
                type='text'
                placeholder='Enter a name'
                className='bg-transparent border-b-2 border-card-border border-t-0 border-l-0 border-r-0 py-4 text-white'
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
              />
            </div>
          )}
          {currentPage === 1 && (
            <div className='flex flex-col gap-4 h-[calc(100vh-200px)]' id='exercises'>
              {muscleGroups.map((group) => (
                <div key={group.id} className='flex items-center space-x-2 gap-3'>
                  <label className='relative flex items-center justify-center'>
                    <motion.input
                      type='checkbox'
                      className='rounded-2xl border-2 border-svg-border bg-svg-bg relative h-14 w-14 cursor-pointer appearance-none transition-all duration-500 checked:border-svg-border checked:bg-white'
                      onChange={() => handleMuscleGroupChange(group.id)}
                      checked={selectedMuscleGroups[group.id] || false}
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
                        animate={selectedMuscleGroups[group.id] ? 'visible' : 'hidden'}
                        variants={iconVariants}
                      >
                        <motion.path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M4.5 12.75l6 6 9-13.5'
                          variants={tickVariants}
                          initial='unchecked'
                          animate={selectedMuscleGroups[group.id] ? 'checked' : 'unchecked'}
                        />
                      </motion.svg>
                    </div>
                  </label>
                  <div className='flex flex-col'>
                    <p className='text-white text-lg font-semibold'>{group.label}</p>
                    <p className='text-white/75 text-xs'>{group.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {currentPage === 2 && (
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
          )}
          {currentPage === 3 && (
            <div className='flex flex-col gap-4 h-[calc(100vh-250px)]' id='exercises'>
              {filteredExercises.length > 0
                ? (
                    filteredExercises.map((exercise) => (
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
                          <p className='text-white/75 text-xs'>{(exercise.muscleGroups)}</p>
                        </div>
                      </div>
                    ))
                  )
                : (
                  <p className='text-white'>No exercises found for the selected muscle groups.</p>
                  )}
            </div>
          )}
          {currentPage === 4 && (
            <div className='flex flex-col gap-4'>
              <p className='text-white'>Workout name: {workoutName}</p>
              <p className='text-white'>Selected muscle groups:</p>
              <ul className='list-disc list-inside text-white'>

                {Object.entries(selectedMuscleGroups)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([id, _]) => (
                    <li key={id}>{muscleGroups.find(group => group.id === id).label}</li>
                  ))}
              </ul>
              <p className='text-white'>Selected days:</p>
              <ul className='list-disc list-inside text-white'>
                {Object.entries(selectedDays)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([day, _]) => (
                    <li key={day}>{day}</li>
                  ))}
              </ul>
              <p className='text-white'>Selected exercises:</p>
              <ul className='list-disc list-inside text-white'>
                {Object.entries(selectedExercises)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([id, _]) => {
                    const exercise = exercises.find(exercise => exercise.id === Number(id))
                    return (
                      <li key={id}>
                        {exercise ? capitalizeWords(exercise.name) : `Exercise with ID ${id} not found`}
                      </li>
                    )
                  })}
              </ul>
            </div>
          )}
        </div>
        <AnimatePresence>
          {Object.values(errors).map((error, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
              className='text-red-500 mt-2'
            >
              {error}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Drawer.Root open={open} shouldScaleBackground onClose={() => setCurrentPage(0)}>
        <Drawer.Trigger asChild>
          <div onClick={() => setOpen(true)} className='border-card-border flex h-[9.5rem] w-[9.5rem] justify-center items-center rounded-3xl border-2 bg-[#17171B] p-4 cursor-pointer ml-1 text-card-border'>
            <Plus className='w-20 h-20' />
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 rounded-3xl bg-drawer-overlay border-2 border-drawer-border' />
          <Drawer.Content className='bg-drawer-bg flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0'>
            <div className='p-4 bg-drawer-bg rounded-t-[10px] flex-1'>
              <div className='mx-auto w-20 h-1 flex-shrink-0 rounded-full bg-white mb-4' />
              <div className='max-w-md mx-auto'>
                <div className='w-full flex flex-row justify-between items-center text-white mb-4 font-bold min-h-10'>
                  <motion.div
                    animate={{ rotate: currentPage === 0 ? -90 : 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      if (currentPage > 0) setCurrentPage(currentPage - 1)
                      else setOpen(false)
                    }}
                  >
                    <ArrowLeft />
                  </motion.div>
                  <ProgressBar
                    filledBackground='#ffffff'
                    percent={progressPercentage()}
                    width={300}
                  />
                  {(currentPage === 1 || currentPage === 3) && (
                    <button
                      className='bg-white text-black font-bold p-2 rounded-full flex flex-row items-center justify-center gap-2'
                      onClick={handleNextPage}
                    >
                      <ArrowRight strokeWidth={2.5} />
                    </button>
                  )}
                </div>
                <AnimatePresence initial={false} mode='wait'>
                  <motion.div
                    key={currentPage}
                    initial={{ x: '20%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-20%', opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ delay: 0, duration: 0.2 }}
                    className='flex flex-col gap-4 px-2'
                  >
                    {renderPageContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            {(currentPage === 0 || currentPage === 2 || currentPage === 4) && (
              <div className='px-4 py-10 bg-drawer-bg flex justify-end'>
                <button
                  className='bg-white text-black font-bold px-4 py-2 rounded-full flex flex-row items-center justify-center gap-2'
                  onClick={handleNextPage}
                >
                  <ArrowRight strokeWidth={2.5} /> {currentPage === 4 ? 'Finish' : 'Continue'}
                </button>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Suspense>
  )
}
