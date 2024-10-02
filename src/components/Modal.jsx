import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AlertDialogHeader } from './ui/alert-dialog'
import { Trash } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { removeWorkout } from '@/lib/actions'

export function Modal ({ workout, setOpen, setEditOpen }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleRemove = async () => {
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
                    <svg
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      fill='none'
                      className='h-5 w-5 mr-2'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        strokeWidth='2'
                        strokeLinejoin='round'
                        strokeLinecap='round'
                      />
                    </svg>

                    Delete
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
