import {
  AirVent,
  BedDouble,
  CircleParking,
  Clock,
  ConciergeBell,
  MapPin,
  PawPrint,
  Star,
  Users,
  Wifi,
  HandPlatter,
  type LucideProps,
} from 'lucide-react';
import type { IconName } from '@/types';

const icons = {
  wifi: Wifi,
  parking: CircleParking,
  air: AirVent,
  reception: ConciergeBell,
  roomService: HandPlatter,
  pet: PawPrint,
  clock: Clock,
  users: Users,
  bed: BedDouble,
  mapPin: MapPin,
  star: Star,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" strokeWidth={1.5} {...props} />;
}

/** Ícone oficial do WhatsApp (não disponível no Lucide). */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.45 9.45 0 0 1-1.45-5.04c0-5.23 4.26-9.49 9.5-9.49 2.54 0 4.92.99 6.71 2.79a9.43 9.43 0 0 1 2.78 6.71c0 5.24-4.26 9.48-9.49 9.48zm8.08-17.56A11.36 11.36 0 0 0 12.04.6C5.74.6.62 5.72.62 12.01c0 2.01.53 3.97 1.53 5.7L.53 23.62l6.05-1.59a11.4 11.4 0 0 0 5.46 1.39h.01c6.29 0 11.41-5.12 11.42-11.41 0-3.05-1.19-5.92-3.34-8.07z" />
    </svg>
  );
}
