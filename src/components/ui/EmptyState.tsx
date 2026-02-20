interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "No data available." }: EmptyStateProps) {
  return <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">{message}</div>;
}
