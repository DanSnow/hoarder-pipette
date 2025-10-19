import { fakeBrowser } from 'wxt/testing/fake-browser'

fakeBrowser.runtime.connect = () => ({
  name: '',
  // @ts-expect-error mocking
  onDisconnect: {
    addListener: () => {},
  },
  // @ts-expect-error mocking
  onMessage: {
    addListener: () => {},
  },
  disconnect: () => {},
  postMessage: () => {},
})

export { fakeBrowser as browser }

export default fakeBrowser
