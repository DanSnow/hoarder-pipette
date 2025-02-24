import type { Meta, StoryObj } from '@storybook/react'

import { SearchEngine } from './SearchEngine'
import { ListBox } from '~/components/ui/listbox'

const meta = {
  component: SearchEngine,
  decorators: [
    (Story) => (
      <ListBox>
        <Story />
      </ListBox>
    ),
  ],
} satisfies Meta<typeof SearchEngine>

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
