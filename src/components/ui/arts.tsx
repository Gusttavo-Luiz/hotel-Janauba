import { BedDouble, MapPin, Star, Users } from 'lucide-react';
import { hotel, ratings } from '@/data/hotel';
import { formatScore } from '@/lib/utils';
import type { Room } from '@/types';
import { ArtPanel } from './ArtPanel';

/**
 * Artes exibidas no lugar das fotos ainda não enviadas. Todas usam apenas
 * dados reais do hotel (src/data) e somem quando a foto correspondente recebe `src`.
 */

const iconProps = { className: 'h-5 w-5', strokeWidth: 1.5, 'aria-hidden': true } as const;

export function RoomArt({ room, tone = 'light' }: { room: Room; tone?: 'light' | 'dark' }) {
  return (
    <ArtPanel
      tone={tone}
      className="pt-10"
      icon={room.beds ? <BedDouble {...iconProps} /> : <Users {...iconProps} />}
      figure={room.capacity}
      caption={room.capacity === 1 ? 'hóspede' : 'hóspedes'}
      note={room.beds}
    />
  );
}

export function AddressArt({ tone = 'light', size = 'md' }: { tone?: 'light' | 'dark'; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <ArtPanel
      tone={tone}
      size={size}
      icon={<MapPin {...iconProps} />}
      figure={hotel.address.street.split(', ')[1]}
      caption={hotel.address.street.split(', ')[0]}
      note={`${hotel.address.neighborhood} · ${hotel.address.city}`}
    />
  );
}

export function RatingArt({ tone = 'dark', size = 'sm' }: { tone?: 'light' | 'dark'; size?: 'sm' | 'md' | 'lg' }) {
  const google = ratings.find((r) => r.source === 'Google');
  if (!google) return null;
  return (
    <ArtPanel
      tone={tone}
      size={size}
      icon={<Star {...iconProps} className="h-5 w-5 fill-current" />}
      figure={formatScore(google.score)}
      caption="no Google"
      note={`${google.count} avaliações`}
    />
  );
}
