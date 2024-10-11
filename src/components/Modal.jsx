import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AlertDialogHeader } from './ui/alert-dialog'
import { removeExerciseFromRoutine, removeWorkout } from '@/lib/actions'
import { Loader2, Trash2, Trash } from 'lucide-react'

export function Modal ({ workout, setOpen, setEditOpen, drawerPage, setDrawerPage, exerciseId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRemove = async () => {
    setIsLoading(true)
    if (drawerPage !== 1) {
      await removeWorkout(workout)
    } else {
      await removeExerciseFromRoutine(exerciseId)
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    try {
      setDrawerPage(0)
      setIsOpen(false)
      // setOpen(false)
      setEditOpen(false)
    } catch {}
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className='rounded-full bg-red-500 p-2.5 text-white cursor-pointer' onClick={() => setIsOpen(true)}>
            <Trash size={20} strokeWidth={2} />
          </div>
        </DialogTrigger>
        <AnimatePresence>
          {isOpen && (
            <DialogContent forceMount className='max-w-80 p-0 overflow-hidden bg-card-bg shadow-none border-2 border-svg-border rounded-3xl'>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className='bg-background p-6 rounded-lg shadow-lg text-white'
              >
                <AlertDialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </AlertDialogHeader>
                <div className='mt-4'>
                  <p>This action cannot be undone. Are you sure you want to delete this workout?</p>
                </div>
                <div className='mt-6 flex justify-end'>
                  <button
                    className='inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md cursor-pointer min-w-32 justify-between'
                    onClick={() => handleRemove()}
                  >
                    {isLoading
                      ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Removing ...
                        </>
                        )
                      : (
                        <>
                          <Trash2 className='mr-2 h-4 w-4' />
                          Remove
                        </>
                        )}
                  </button>
                </div>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  )
}
