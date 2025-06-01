import type { Meta, StoryObj } from '@storybook/react'

import { expect } from 'storybook/test'
import { SearchEngineDetail } from './SearchEngineDetail'

const meta = {
  component: SearchEngineDetail,
} satisfies Meta<typeof SearchEngineDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isAllowUrl: false,
    url: 'https://example.com',
    engine: {
      id: 'google',
      name: 'Google',
      allowUserSites: false,
      icon: 'i-simple-icons-google',
      matches: [
        {
          isEnabled: true,
          isEnabledByDefault: true,
          match: 'https://google.com/search',
          originUrl: 'https://google.com/search*',
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Google')).toBeVisible()
    await expect(canvas.getByText('https://google.com/search')).toBeVisible()
  },
}
