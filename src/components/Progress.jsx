'use client'

import Chart from '@/components/charts/Chart'
import DropdownExercises from '@/components/DropdownExercises'
import DropdownReps from '@/components/DropdownReps'
import DropdownTime from '@/components/DropdownTime'
import DropdownUsers from '@/components/DropdownUsers'
import ChartSkeleton from '@/components/skeletons/ChartSkeleton' // Import the new ChartSkeleton component
import { capitalizeWords } from '@/lib/mix'
import React, { useCallback, useEffect, useState } from 'react'

export default function Progress ({ exercises, progress, users, currentUser }) {
  const [selectedExercise, setSelectedExercise] = useState()
  const [chartData, setChartData] = useState([])
  const [selectedReps, setSelectedReps] = useState({ id: 1, name: '1 Rep Max', value: 'max' })
  const [selectedTime, setSelectedTime] = useState({ id: 2, name: '3 months', value: 3 })
  const [selectedUser, setSelectedUser] = useState(users.find(u => u.email === currentUser))
  const [initialLoad, setInitialLoad] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isData, setIsData] = useState(false)

  useEffect(() => {
    const exercise = exercises.find(e => e.id === 5)
    setSelectedExercise(exercise)
  }, [exercises])

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      if (selectedUser.email !== currentUser || !initialLoad) {
        const url = `/api/progress?email=${encodeURIComponent(selectedUser.email)}`
        await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then(data => {
          if (data && data.chartData.length > 0) {
            let filteredData = data.chartData.filter(p => p.exercise_id === selectedExercise.id)

            if (selectedTime.value !== 'all') {
              const now = new Date()
              const timeLimit = new Date()
              timeLimit.setMonth(now.getMonth() - selectedTime.value)

              filteredData = filteredData.filter(p => new Date(p.date) >= timeLimit)
            }
            setChartData(filteredData)
            setIsData(true)
          } else {
            setChartData([])
            setIsData(false)
          }
        })
      } else {
        if (progress && progress.length > 0 && selectedExercise) {
          let filteredData = progress.filter(p => p.exercise_id === selectedExercise.id)

          if (selectedTime.value !== 'all') {
            const now = new Date()
            const timeLimit = new Date()
            timeLimit.setMonth(now.getMonth() - selectedTime.value)

            filteredData = filteredData.filter(p => new Date(p.date) >= timeLimit)
          }

          setChartData(filteredData)
          setIsData(true)
        } else {
          setChartData([])
          setIsData(false)
        }
      }
      setIsLoading(false)
    }

    getData()
  }, [selectedExercise, selectedTime, progress, selectedUser, currentUser, initialLoad])

  const [searchItem, setSearchItem] = useState('')

  const handleInputChange = useCallback((e) => {
    setSearchItem(e.target.value)
  }, [])

  return (
    <>
      <header className='flex flex-row w-full items-center justify-between'>
        <section className='flex flex-col gap-2'>
          <h1 className='text-4xl font-bold text-white truncate text-ellipsis overflow-hidden max-w-72'>
            {selectedExercise ? capitalizeWords(selectedExercise.name) : 'Bench Press'}
          </h1>
          <p className='text-card-text text-sm'>
            This section will show you your progress
          </p>
        </section>
        <DropdownExercises
          exercises={exercises}
          selectedExercise={selectedExercise}
          setSelectedExercise={setSelectedExercise}
          searchItem={searchItem}
          handleInputChange={handleInputChange}
        />
      </header>
      <main className='w-full flex flex-col gap-8'>
        <div className='flex flex-row gap-5'>
          <DropdownReps selectedReps={selectedReps} setSelectedReps={setSelectedReps} />
          <DropdownTime selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        </div>
        <div className='w-full h-[320px] '>
          {isLoading
            ? (
              <ChartSkeleton />
              )
            : (
              <Chart chartData={chartData} selectedReps={selectedReps} />
              )}
        </div>
        <div className='flex w-full justify-center items-center'>
          <DropdownUsers users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} setInitialLoad={setInitialLoad} />
        </div>
      </main>
      {!isLoading && !isData && (
        <footer className='flex flex-col flex-1 text-center w-full h-full justify-between items-center py-4'>
          <p className='text-footer-text text-sm'>
            No hay <span className='font-bold'>ningún</span> registro de este ejercicio.
          </p>
        </footer>
      )}
    </>
  )
}
