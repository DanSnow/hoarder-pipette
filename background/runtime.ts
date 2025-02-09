import { ManagedRuntime } from 'effect'
import { ContentScriptRegister } from './content-script-register'

export const BackgroundRuntime = ManagedRuntime.make(ContentScriptRegister.Default)
