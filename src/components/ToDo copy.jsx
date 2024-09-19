import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Unlink2 } from 'lucide-react'

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

export const ToDo = ({ series, progress }) => {
  const [checkedItems, setCheckedItems] = useState([])
  const [inputWeight, setInputWeight] = useState(0)
  const [inputReps, setInputReps] = useState(0)
  const [formData, setFormData] = useState({})

  let numberSeries
  let topSet
  let backOffSet
  if (series.includes('TP') || series.includes('BOS')) {
    const numbers = series.match(/\d+/g)
    const numericValues = numbers.map(num => parseInt(num, 10))
    topSet = numericValues[0]
    backOffSet = numericValues[1]
  } else {
    numberSeries = parseInt(series.trim()[0])
  }

  const handleCheckboxChange = (index) => {
    setCheckedItems(prev => {
      const newCheckedItems = [...prev]
      newCheckedItems[index] = !newCheckedItems[index]
      return newCheckedItems
    })
  }

  const handleInputChange = (field, value) => {
    console.log(field, value)
  }

  const Checkbox = ({ isChecked, onChange, svgPath }) => (
    <label className='relative flex items-center justify-center'>
      <motion.input
        type='checkbox'
        className='rounded-2xl border-2 border-svg-border bg-svg-bg relative h-14 w-14 cursor-pointer appearance-none transition-all duration-500 checked:border-svg-border checked:bg-white'
        onChange={onChange}
        checked={isChecked}
        variants={boxVariants}
        whileHover='hover'
        whileTap='pressed'
      />
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center text-svg-text'>
        <motion.svg
          xmlns='http://www.w3.org/2000/svg'
          width='36'
          height='36'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='absolute'
          initial={false}
          animate={isChecked ? 'hidden' : 'visible'}
          variants={iconVariants}
        >
          {svgPath}
        </motion.svg>
        <motion.svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='3.5'
          stroke='currentColor'
          className='h-9 w-9 absolute'
          initial={false}
          animate={isChecked ? 'visible' : 'hidden'}
          variants={iconVariants}
        >
          <motion.path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M4.5 12.75l6 6 9-13.5'
            variants={tickVariants}
            initial='unchecked'
            animate={isChecked ? 'checked' : 'unchecked'}
          />
        </motion.svg>
      </div>
    </label>
  )

  const CheckboxSuperset = ({ isChecked, onChange, svgPath }) => (
    <label className='relative flex items-center justify-center'>
      <motion.input
        type='checkbox'
        className='rounded-2xl border-2 border-svg-border bg-svg-bg relative h-12 w-12 cursor-pointer appearance-none transition-all duration-500 checked:border-svg-border checked:bg-white'
        onChange={onChange}
        checked={isChecked}
        variants={boxVariants}
        whileHover='hover'
        whileTap='pressed'
      />
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center text-svg-text'>
        <motion.svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='absolute'
          initial={false}
          animate={isChecked ? 'hidden' : 'visible'}
          variants={iconVariants}
        >
          {svgPath}
        </motion.svg>
        <motion.svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='3.5'
          stroke='currentColor'
          className='h-9 w-9 absolute'
          initial={false}
          animate={isChecked ? 'visible' : 'hidden'}
          variants={iconVariants}
        >
          <motion.path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M4.5 12.75l6 6 9-13.5'
            variants={tickVariants}
            initial='unchecked'
            animate={isChecked ? 'checked' : 'unchecked'}
          />
        </motion.svg>
      </div>

    </label>
  )

  const InputField = ({ isChecked, placeholder, index, label }) => (
    <motion.input
      type='number'
      inputMode='numeric'
      className='w-20 h-14 rounded-full border-[3px] border-input-border text-center text-white placeholder:text-popover-text'
      placeholder={placeholder}
      animate={{
        x: isChecked ? [0, -4, 0] : [0, 4, 0],
        color: isChecked ? '#FFFFFF' : '#FFFFFF'
      }}
      initial={false}
      transition={{
        duration: 0.3,
        ease: 'easeOut'
      }}
      onChange={(e) => {
        e.preventDefault()
        console.log(e.target.value)
      }}
      onBlur={(e) => {
        e.preventDefault()
        console.log('f', e.target.value)
      }}
    />
  )

  const InputFieldSupersetLeft = ({ isChecked, placeholder }) => (
    <motion.input
      type='number'
      inputMode='numeric'
      className='w-14 h-12 rounded-l-full border-y-[3px] border-l-[3px] border-r-[2px] border-input-border text-center text-white placeholder:text-popover-text focus:outline-none'
      placeholder={placeholder}
      animate={{
        x: isChecked ? [0, -4, 0] : [0, 4, 0],
        color: isChecked ? '#FFFFFF' : '#FFFFFF'
      }}
      initial={false}
      transition={{
        duration: 0.3,
        ease: 'easeOut'
      }}
    />
  )

  const InputFieldSupersetRight = ({ isChecked, placeholder }) => (
    <motion.input
      type='number'
      inputMode='numeric'
      className='w-14 h-12 rounded-r-full border-y-[3px] border-r-[3px] border-l-[2px] border-input-border text-center text-white placeholder:text-popover-text  focus:outline-none'
      placeholder={placeholder}
      animate={{
        x: isChecked ? [0, -4, 0] : [0, 4, 0],
        color: isChecked ? '#FFFFFF' : '#27272a'
      }}
      initial={false}
      transition={{
        duration: 0.3,
        ease: 'easeOut'
      }}
    />

  )

  const renderCheckboxGroup = (count, svgPath) => {
    if (count === 1) {
      const [checked, setChecked] = useState(false)
      return (
        <form className='flex flex-row items-center gap-5'>
          <Checkbox
            isChecked={checked || false}
            onChange={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('DENTRO')
              setChecked(!checked)
            }}
            svgPath={svgPath}
          />
          <div className='flex flex-row gap-3 relative'>
            <InputField
              isChecked={checked}
              placeholder={progress && progress && progress.weight
                ? `${progress.weight} kg`
                : '0 kg'}
              index={0}
              label='weight'

            />
            <InputField
              isChecked={checked}
              placeholder={progress && progress && progress.repetitions
                ? `${progress.repetitions} reps`
                : '0 reps'}
              index={0}
              label='repetitions'
            />
            <motion.div
              className='absolute top-1/2 left-0 right-0 h-[2px] bg-svg-text pointer-events-none mx-2'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: checked ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <button
            className='text-red-300'
            type='submit'
            onSubmit={(e) => {
              e.preventDefault()
            }}
            onClick={(e) => {
              e.preventDefault()
              console.log('PEPE')
            }}
          >
            dale
          </button>
        </form>
      )
    } else {
      return Array.from({ length: count }).map((_, index) => (
        <div className='flex flex-row items-center gap-5' key={index}>
          <Checkbox
            isChecked={checkedItems[index] || false}
            onChange={() => handleCheckboxChange(index)}
            svgPath={svgPath}
          />
          <div className='flex flex-row gap-3 relative'>
            <InputField
              isChecked={checkedItems[index] || false} placeholder={progress && progress[index] && progress[index].weight
                ? `${progress[index].weight} kg`
                : '0 kg'}
              index={index}
              label='weight'
            />
            <InputField
              isChecked={checkedItems[index] || false} placeholder={progress && progress[index] && progress[index].repetitions
                ? `${progress[index].repetitions} reps`
                : '0 reps'}
              index={index}
              label='reps'
            />
            <motion.div
              className='absolute top-1/2 left-0 right-0 h-[2px] bg-svg-text pointer-events-none mx-2'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: checkedItems[index] ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      ))
    }
  }

  if (series === 'SST') {
    return renderCheckboxGroup(1, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M12 9v4' /><path d='M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z' /><path d='M12 16h.01' /></>)
  }

  if (series.includes('CALENTAMIENTO')) {
    return renderCheckboxGroup(1, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11' /></>)
  }

  if (series.includes('TARGET')) {
    return renderCheckboxGroup(3, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><circle cx='12' cy='12' r='.5' fill='currentColor' /><path d='M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' /><path d='M12 3l0 2' /><path d='M3 12l2 0' /><path d='M12 19l0 2' /><path d='M19 12l2 0' /></>)
  }

  if (series.includes('LINEAL')) {
    return renderCheckboxGroup(numberSeries, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M5 12h2' /><path d='M17 12h2' /><path d='M11 12h2' /></>)
  }

  if (series.includes('DROPSET')) {
    return renderCheckboxGroup(numberSeries, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M7 7l10 10' /><path d='M17 8l0 9l-9 0' /></>)
  }

  if (series.includes('REST PAUSE')) {
    return renderCheckboxGroup(numberSeries, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z' /><path d='M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z' /></>)
  }

  if (series.includes('SLOW')) {
    return renderCheckboxGroup(numberSeries, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M19 18l-14 -4' /><path d='M19 14l-14 -4l14 -4' /></>)
  }

  // if (series.includes('JUMPSET')) {
  //   return renderCheckboxGroup(numberSeries, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M4 15.5c3 -1 5.5 -.5 8 4.5c.5 -3 1.5 -5.5 3 -8' /><path d='M18 9a2 2 0 1 1 0 -4a2 2 0 0 1 0 4z' /></>)
  // }

  if (series.includes('TP') || series.includes('TS') || series.includes('BOS')) {
    return (
      <>
        {renderCheckboxGroup(topSet, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M3 17l6 -6l4 4l8 -8' /><path d='M14 7l7 0l0 7' /></>)}
        {renderCheckboxGroup(backOffSet, <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M3 7l6 6l4 -4l8 8' /><path d='M21 10l0 7l-7 0' /></>)}
      </>
    )
  }

  if (series.includes('SUPERSERIE') || series.includes('SUPER SERIE') || series.includes('JUMPSET')) {
    return (
      <div className='flex flex-col gap-5'>
        {Array.from({ length: numberSeries }).map((_, index) => (
          <div className='flex flex-row items-center max-w-screen gap-4' key={index}>
            <CheckboxSuperset
              isChecked={checkedItems[index * 2] || false}
              onChange={() => handleCheckboxChange(index * 2)}
              svgPath={series.includes('SUPERSERIE') || series.includes('SUPER SERIE') ? <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z' /></> : <><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M4 15.5c3 -1 5.5 -.5 8 4.5c.5 -3 1.5 -5.5 3 -8' /><path d='M18 9a2 2 0 1 1 0 -4a2 2 0 0 1 0 4z' /></>}
            />
            <div className='flex flex-row items-center justify-center relative gap-2'>
              <div className='flex flex-row'>
                <InputFieldSupersetLeft isChecked={checkedItems[index * 2] || false} placeholder='kg' />
                <InputFieldSupersetRight isChecked={checkedItems[index * 2] || false} placeholder='reps' />
              </div>
              <Unlink2 />
              <div className='flex flex-row'>
                <InputFieldSupersetLeft isChecked={checkedItems[index * 2 + 1] || false} placeholder='kg' />
                <InputFieldSupersetRight isChecked={checkedItems[index * 2 + 1] || false} placeholder='reps' />
              </div>
              <motion.div
                className='absolute top-1/2 left-0 right-0 h-[2px] bg-svg-text pointer-events-none mx-2'
                initial={{ scaleX: 0 }}
                animate={{ scaleX: checkedItems[index * 2] ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}
