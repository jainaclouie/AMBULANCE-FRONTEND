export function PageLoading() {
  return (
    <section className="flex h-screen flex-col items-center justify-center gap-4 text-muted">
      <div className="size-9 animate-spin rounded-full border-4 border-line border-t-brand-teal" />
      Loading...
    </section>
  )
}
