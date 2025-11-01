import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, UploadIcon } from 'lucide-react'

type DragDropFileInputComponentProps = {
  isDragging?: boolean
}

export default function DragDropFileInputComponent({
  isDragging = false,
}: DragDropFileInputComponentProps) {
  return (
    <motion.div
      className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-24 transition-all duration-300 ${
        isDragging
          ? 'border-primary bg-primary/10 shadow-lg'
          : 'border-primary bg-primary-light/10'
      }`}
      initial={{ opacity: 0, scale: 1 }}
      animate={{
        opacity: 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {isDragging ? (
          <motion.div
            key="dragging-content"
            initial={{ y: 10, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Dragging state - compact */}
            <motion.div
              className="rounded-full bg-primary p-3"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>

            <motion.p
              className="text-base font-bold text-primary"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
            >
              Drop files here!
            </motion.p>

            <motion.div
              className="flex gap-1 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="upload-content"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Normal state - Animated upload icon */}
            <motion.div
              className="rounded-full bg-primary-light p-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <UploadIcon className="h-6 w-6 text-primary" />
              </motion.div>
            </motion.div>

            <motion.p
              className="text-base font-semibold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Upload
            </motion.p>

            <motion.span
              className="text-center text-xs text-neutral-medium px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Drag and drop or click to select
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
