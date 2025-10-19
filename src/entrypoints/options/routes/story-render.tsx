import { createFileRoute } from '@tanstack/react-router'
import { StoryRenderer } from '../components/StoryRenderer'

export const Route = createFileRoute('/story-render')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StoryRenderer />
}
