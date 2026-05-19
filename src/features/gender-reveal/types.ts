export type Gender = 'BOY' | 'GIRL'

export type GenderRevealSettings = {
  gender: Gender | null
  revealDate: string | null
  isRevealed: boolean
}

export type GenderGuess = {
  id: number
  name: string
  guess: Gender
  mediaUrls: string[]
  createdAt: string
}

export type SubmitGuessPayload = {
  name: string
  guess: Gender
  mediaUrls: string[]
}

export type UpdateSettingsPayload = {
  gender?: Gender | null
  revealDate?: string | null
}
