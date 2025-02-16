import type { Meta, StoryObj } from '@storybook/react'

import { SearchEngineDetail } from './SearchEngineDetail'

const meta = {
  component: SearchEngineDetail,
} satisfies Meta<typeof SearchEngineDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
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
}
