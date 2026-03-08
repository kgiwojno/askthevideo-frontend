interface MetricCardProps {
  label: string;
  value: string;
  className?: string;
}

const MetricCard = ({ label, value, className = "" }: MetricCardProps) => (
  <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</p>
  </div>
);

export default MetricCard;
