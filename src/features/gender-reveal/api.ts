import useApiMutation from '$/lib/hooks/useApiMutation'
import useApiQuery from '$/lib/hooks/useApiQuery'
import { apiClient } from '$/lib/utils/apiClient'

import type {
  GenderGuess,
  GenderRevealSettings,
  SubmitGuessPayload,
  UpdateSettingsPayload,
} from './types'

// ── Settings ─────────────────────────────────────────────────────────────────

export function useRevealSettings(refetchInterval?: number) {
  return useApiQuery<GenderRevealSettings>({
    queryKey: ['gender-reveal', 'settings'],
    queryFn: ({ apiClient }) =>
      apiClient.get('gender-reveal/settings').json<GenderRevealSettings>(),
    refetchInterval,
    retry: false,
  })
}

export function useUpdateSettings() {
  return useApiMutation({
    mutationFn: (payload: UpdateSettingsPayload) =>
      apiClient
        .patch('gender-reveal/settings', { json: payload })
        .json<GenderRevealSettings>(),
    mutationKey: ['gender-reveal', 'update-settings'],
  })
}

export function useTriggerReveal() {
  return useApiMutation({
    mutationFn: () =>
      apiClient.post('gender-reveal/reveal').json<GenderRevealSettings>(),
    mutationKey: ['gender-reveal', 'trigger-reveal'],
  })
}

// ── Guesses ───────────────────────────────────────────────────────────────────

export function useGuesses() {
  return useApiQuery<GenderGuess[]>({
    queryKey: ['gender-reveal', 'guesses'],
    queryFn: ({ apiClient }) =>
      apiClient.get('gender-reveal/guesses').json<GenderGuess[]>(),
    retry: false,
  })
}

export function useSubmitGuess() {
  return useApiMutation({
    mutationFn: (payload: SubmitGuessPayload) =>
      apiClient
        .post('gender-reveal/guess', { json: payload })
        .json<GenderGuess>(),
    mutationKey: ['gender-reveal', 'submit-guess'],
  })
}
