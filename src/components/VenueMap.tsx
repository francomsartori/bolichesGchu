import type { Boliche } from '../lib/types';
import MapView from './MapView';

interface Props {
  boliche: Boliche;
}

export default function VenueMap({ boliche }: Props) {
  const center: [number, number] = boliche.ubicacion
    ? [boliche.ubicacion.lat, boliche.ubicacion.lng]
    : [-33.0096, -58.5173];

  return (
    <div className="h-80 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
      <MapView boliches={[boliche]} center={center} zoom={16} />
    </div>
  );
}
