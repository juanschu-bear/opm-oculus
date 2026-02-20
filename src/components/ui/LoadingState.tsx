interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return <div className="text-sm text-white/50 animate-pulse">{message}</div>;
}
