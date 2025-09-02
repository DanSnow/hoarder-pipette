import { experimental_toORPCClient as toORPCClient } from '@orpc/hey-api'
import * as sdk from './client/sdk.gen'

export const karakeep = toORPCClient(sdk)
