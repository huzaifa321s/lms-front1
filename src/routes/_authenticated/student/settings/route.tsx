import { createFileRoute } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import Settings from './settings'

// Explicitly type the component (optional if Settings is already typed correctly)
const TypedSettings: ComponentType = Settings

export const Route = createFileRoute('/_authenticated/student/settings')({
  component: TypedSettings
})
