import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export function AnimatedCounter({ value, className = '', suffix = '' }) {
  const count = useAnimatedCounter(value);
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
