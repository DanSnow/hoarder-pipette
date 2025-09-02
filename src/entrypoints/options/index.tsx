import '~/styles/tailwind.css'
import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'
import { $ } from '~/lib/utils'
import { OptionsRoot } from './components/OptionsRoot'

const $container = $('#root')
invariant($container, `Could not find the container with id "root"`)
const root = createRoot($container)
root.render(<OptionsRoot />)
