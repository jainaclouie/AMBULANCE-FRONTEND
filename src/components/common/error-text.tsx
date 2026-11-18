export function ErrorText({ message }: { message: string }) {
  if (!message) return null;
  return <p className="text-[13px] font-semibold text-crit-fg">{message}</p>
}
