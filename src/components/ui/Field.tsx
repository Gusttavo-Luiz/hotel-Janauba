import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

/** Envolve um campo com rótulo, dica e mensagem de erro acessíveis. */
export function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ml-1 tracking-normal normal-case opacity-70">(opcional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** Atributos ARIA para o controle dentro de <Field>. */
export const fieldAria = (id: string, error?: string, hint?: string) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});
