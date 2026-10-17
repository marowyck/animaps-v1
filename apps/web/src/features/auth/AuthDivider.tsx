export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" aria-hidden />
      <span className="text-caption text-text-muted">{label}</span>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}
