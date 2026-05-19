import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { uploadFilesOnS3WithUrls } from '$/lib/utils/media-utils/functions'

import { useRevealSettings, useSubmitGuess } from './api'
import FloatingParticles from './FloatingParticles'
import StarField from './StarField'
import type { Gender } from './types'
import Countdown from './Countdown'
import VoteTally from './VoteTally'

type Step = 'entry' | 'form' | 'thanks'

export default function GuestPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<Step>('entry')
  const [name, setName] = useState('')
  const [guess, setGuess] = useState<Gender | null>(null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: settings } = useRevealSettings(5000)
  const { mutateAsync: submitGuess, isPending } = useSubmitGuess()

  // Redirect to reveal page when reveal is triggered
  useEffect(() => {
    if (settings?.isRevealed) {
      navigate({ to: '/reveal' })
    }
  }, [settings?.isRevealed, navigate])

  const handleSubmit = async () => {
    if (!name.trim() || !guess) return

    let mediaUrls: string[] = []
    if (mediaFiles.length > 0) {
      const progress = new Array(mediaFiles.length).fill(0)
      setUploadProgress(progress)
      try {
        mediaUrls = await uploadFilesOnS3WithUrls(
          'gender-reveal',
          mediaFiles,
          (p, idx) => {
            setUploadProgress((prev) => {
              const next = [...prev]
              next[idx] = p
              return next
            })
          },
        )
      } catch {
        toast.error('Failed to upload media, submitting without it.')
      }
    }

    await submitGuess(
      { name: name.trim(), guess, mediaUrls },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['gender-reveal', 'guesses'],
          })
          setStep('thanks')
        },
      },
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) setMediaFiles((prev) => [...prev, ...files])
  }

  return (
    <div className="gr-page">
      <StarField count={120} />
      <FloatingParticles count={14} />

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -6, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl mb-4 inline-block"
          >
            👶
          </motion.div>
          <h1
            className="text-5xl sm:text-6xl font-black mb-3 gr-gradient-text"
            style={{ letterSpacing: '-0.02em' }}
          >
            Baby Reveal
          </h1>
          <p className="gr-muted text-lg">
            Make your guess before the big reveal!
          </p>
        </motion.div>

        {settings?.revealDate && !settings.isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <Countdown targetDate={settings.revealDate} />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'entry' && (
            <motion.div
              key="entry"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md"
            >
              <div className="gr-card p-8">
                <h2 className="text-xl font-bold text-center mb-1">
                  What's your name?
                </h2>
                <p className="gr-muted text-sm text-center mb-7">
                  Enter your name to cast your vote
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && name.trim() && setStep('form')
                  }
                  placeholder="Your name..."
                  className="gr-input mb-5"
                  autoFocus
                />
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => name.trim() && setStep('form')}
                  disabled={!name.trim()}
                  className="gr-btn-gradient"
                >
                  Continue &rarr;
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-lg"
            >
              <div className="gr-card p-8">
                <p className="gr-muted text-sm text-center mb-1">
                  Hey, {name}! 👋
                </p>
                <h2
                  className="text-3xl font-black text-center mb-8"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Boy or Girl?
                </h2>
                <div className="grid grid-cols-2 gap-5 mb-8">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setGuess('BOY')}
                    className={`gr-card-choice ${guess === 'BOY' ? 'selected-boy' : ''}`}
                  >
                    <span className="text-6xl">👦</span>
                    <span
                      className="text-2xl font-black tracking-widest"
                      style={{
                        color:
                          guess === 'BOY'
                            ? '#60a5fa'
                            : 'rgba(255,255,255,0.45)',
                      }}
                    >
                      BOY
                    </span>
                    <div className="flex gap-1 text-sm mt-1">
                      {['💙', '🚂', '⚽'].map((e) => (
                        <span key={e}>{e}</span>
                      ))}
                    </div>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setGuess('GIRL')}
                    className={`gr-card-choice ${guess === 'GIRL' ? 'selected-girl' : ''}`}
                  >
                    <span className="text-6xl">👧</span>
                    <span
                      className="text-2xl font-black tracking-widest"
                      style={{
                        color:
                          guess === 'GIRL'
                            ? '#f472b6'
                            : 'rgba(255,255,255,0.45)',
                      }}
                    >
                      GIRL
                    </span>
                    <div className="flex gap-1 text-sm mt-1">
                      {['💗', '🦋', '🌸'].map((e) => (
                        <span key={e}>{e}</span>
                      ))}
                    </div>
                  </motion.button>
                </div>
                <div className="mb-7">
                  <p className="gr-muted text-xs text-center mb-3">
                    📸 Reaction photo/video (optional)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="gr-upload-zone"
                  >
                    <span className="text-xl block mb-1">+</span>Add photo /
                    video
                  </button>
                  {mediaFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {mediaFiles.map((f, i) => (
                        <div key={i} className="relative group">
                          {f.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(f)}
                              alt={f.name}
                              className="h-16 w-16 object-cover rounded-xl"
                              style={{
                                border: '1px solid rgba(255,255,255,0.15)',
                              }}
                            />
                          ) : (
                            <div
                              className="h-16 w-16 flex items-center justify-center rounded-xl text-2xl"
                              style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.12)',
                              }}
                            >
                              🎬
                            </div>
                          )}
                          {uploadProgress[i] !== undefined &&
                            uploadProgress[i] < 100 && (
                              <div
                                className="absolute inset-0 rounded-xl flex items-center justify-center text-xs font-bold"
                                style={{ background: 'rgba(0,0,0,0.65)' }}
                              >
                                {uploadProgress[i]}%
                              </div>
                            )}
                          <button
                            onClick={() =>
                              setMediaFiles((p) => p.filter((_, j) => j !== i))
                            }
                            className="absolute -top-1 -right-1 rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                            style={{ background: '#f15757', color: '#fff' }}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('entry')}
                    className="gr-btn-ghost"
                  >
                    &larr; Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={!guess || isPending}
                    className="gr-btn-gradient"
                    style={{ flex: 1 }}
                  >
                    {isPending ? 'Submitting...' : '🎉 Submit my guess!'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'thanks' && (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="w-full max-w-md text-center"
            >
              <div className="gr-card p-10">
                <motion.div
                  animate={{
                    rotate: [0, -15, 15, -10, 10, 0],
                    scale: [1, 1.25, 1],
                  }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="text-8xl mb-5 block"
                >
                  {guess === 'BOY' ? '💙' : '💗'}
                </motion.div>
                <h2 className="text-2xl font-black mb-3">You're in! 🎊</h2>
                <p className="gr-muted mb-1">
                  <span className="text-white font-bold">{name}</span> voted for
                  a{' '}
                  <span
                    className="font-black"
                    style={{ color: guess === 'BOY' ? '#60a5fa' : '#f472b6' }}
                  >
                    {guess === 'BOY' ? 'Baby Boy' : 'Baby Girl'}
                  </span>
                </p>
                <p className="gr-faint text-sm mt-5">
                  The reveal will happen soon. Stay tuned! 👀
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-12 w-full max-w-md"
        >
          <VoteTally />
        </motion.div>
      </div>
    </div>
  )
}
