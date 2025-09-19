import type { ComponentProps, HTMLAttributes } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


export type StatusProps = ComponentProps<typeof Badge> & {
  status: 'Paid' | 'Draft' | 'Void' | 'Uncollectible';
};

export const Status = ({ className, status, ...props }: StatusProps) => (
  <Badge
    className={cn('flex items-center justify-center', 'group', status, className)}
    variant="secondary"
    {...props}
  />
);

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>;

export const StatusIndicator = ({
  className,
  ...props
}: StatusIndicatorProps) => (
  <span className="relative flex h-2 w-2" {...props}>
    <span
      className={cn(
        'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
        'group-[.Paid]:bg-emerald-500',
        'group-[.Uncollectible]:bg-red-500',
        'group-[.Draft]:bg-blue-500',
        'group-[.Void]:bg-amber-500',
        'group-[.Open]:bg-fuchsia-600'

        
      )}
    />
    <span
      className={cn(
        'relative inline-flex h-2 w-2 rounded-full',
        'group-[.Paid]:bg-emerald-500',
        'group-[.Uncollectible]:bg-red-500',
        'group-[.Draft]:bg-blue-500',
        'group-[.Void]:bg-amber-500',
         'group-[.Open]:bg-fuchsia-600'
      )}
    />
  </span>
);

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>;

export const StatusLabel = ({
  className,
  children,
  value,
  ...props
}: StatusLabelProps) => (
  <span className={cn('text-muted-foreground', className)} {...props}>
    {children} {value && value}
  </span>
);
