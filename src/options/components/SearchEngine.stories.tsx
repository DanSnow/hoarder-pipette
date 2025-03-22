import type { Meta, StoryObj } from '@storybook/react'

import { ListBox } from '~/components/ui/listbox'
import { SearchEngine } from './SearchEngine'

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

export const PartialEnabled: Story = {
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
        {
          isEnabled: false,
          isEnabledByDefault: false,
          match: 'https://google.de/search',
          originUrl: 'https://google.de/search*',
        },
      ],
    },
  },
}

export const Disabled: Story = {
  args: {
    engine: {
      id: 'startpage',
      name: 'StartPage',
      allowUserSites: false,
      icon: 'i-simple-icons-startpage',
      matches: [
        {
          isEnabled: false,
          isEnabledByDefault: false,
          match: 'https://startpage.com/search',
          originUrl: 'https://startpage.com/search*',
        },
      ],
    },
  },
}
