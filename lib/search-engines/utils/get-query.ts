export function fromUrlQuery(name: string) {
  return (): string | null => {
    const url = new URL(window.location.href)
    return url.searchParams.get(name)
  }
}
