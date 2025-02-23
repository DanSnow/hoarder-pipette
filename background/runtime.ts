import { Layer, ManagedRuntime } from 'effect'
import { ContentScriptRegister } from './content-script-register'
import { Storage } from './store'

export const BackgroundRuntime = ManagedRuntime.make(Layer.merge(ContentScriptRegister.Default, Storage.Default))
