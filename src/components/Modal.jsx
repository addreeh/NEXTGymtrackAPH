import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AlertDialogHeader } from './ui/alert-dialog'
import toast, { Toaster } from 'react-hot-toast'
import { removeWorkout } from '@/lib/actions'
import { Loader2, Trash2, Trash } from 'lucide-react'

export function Modal ({ workout, setOpen, setEditOpen }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRemove = async () => {
    setIsLoading(true)
    const result = await removeWorkout(workout)
    if (result.success) {
      toast.success('Workout deleted', {
        // duration: 3000,
        style: {
          minWidth: '50px',
          minHeight: '45px',
          borderRadius: '10px',
          background: '#333',
          color: '#fff'
        }
      })
    } else {
      toast.error('Error deleting workout', {
        // duration: 3000,
        style: {
          minWidth: '50px',
          minHeight: '45px',
          borderRadius: '10px',
          background: '#333',
          color: '#fff'
        }
      })
    }
    setIsLoading(false)
    setIsOpen(false)
    setOpen(false)
    setEditOpen(false)
  }

  return (
    <>
      <Toaster />
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
                    className='inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110 cursor-pointer'
                    onClick={() => handleRemove()}
                  >
                    {isLoading
                      ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Eliminando...
                        </>
                        )
                      : (
                        <>
                          <Trash2 className='mr-2 h-4 w-4' />
                          Eliminar
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
