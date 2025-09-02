import { $ } from '~/lib/utils'

export function fromUrlQuery(name: string) {
  return (): string | null => {
    const url = new URL(window.location.href)
    return url.searchParams.get(name)
  }
}

type ClassSelector = `.${string}`
type IdSelector = `#${string}`
type InputSelector = `input${ClassSelector | IdSelector}`

export function fromInput(selector: InputSelector): () => string | null {
  return () => {
    return $(selector)?.value ?? null
  }
}
