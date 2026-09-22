/**
 * City centroids for aggregate pins.
 * Unknown free-text cities stay off the map — we never guess a pin.
 */

type LatLng = { lat: number; lng: number };

const CITIES: Record<string, LatLng> = {
  "sao paulo": { lat: -23.5505, lng: -46.6333 },
  "rio de janeiro": { lat: -22.9068, lng: -43.1729 },
  "belo horizonte": { lat: -19.9167, lng: -43.9345 },
  brasilia: { lat: -15.7939, lng: -47.8828 },
  salvador: { lat: -12.9777, lng: -38.5016 },
  fortaleza: { lat: -3.7172, lng: -38.5433 },
  curitiba: { lat: -25.4284, lng: -49.2733 },
  manaus: { lat: -3.119, lng: -60.0217 },
  recife: { lat: -8.0476, lng: -34.877 },
  "porto alegre": { lat: -30.0346, lng: -51.2177 },
  goiania: { lat: -16.6869, lng: -49.2648 },
  belem: { lat: -1.4558, lng: -48.4902 },
  guarulhos: { lat: -23.4538, lng: -46.5333 },
  campinas: { lat: -22.9099, lng: -47.0626 },
  "sao luis": { lat: -2.5387, lng: -44.2825 },
  maceio: { lat: -9.6498, lng: -35.7089 },
  "campo grande": { lat: -20.4697, lng: -54.6201 },
  "sao goncalo": { lat: -22.8268, lng: -43.0539 },
  teresina: { lat: -5.0892, lng: -42.8019 },
  "joao pessoa": { lat: -7.1195, lng: -34.845 },
  "sao bernardo do campo": { lat: -23.6914, lng: -46.5646 },
  natal: { lat: -5.7793, lng: -35.2009 },
  osasco: { lat: -23.5329, lng: -46.7916 },
  "santo andre": { lat: -23.6639, lng: -46.5383 },
  florianopolis: { lat: -27.5949, lng: -48.5482 },
  vitoria: { lat: -20.3155, lng: -40.3128 },
  niteroi: { lat: -22.8832, lng: -43.1034 },
  cuiaba: { lat: -15.601, lng: -56.0974 },
  "porto velho": { lat: -8.7612, lng: -63.9004 },
  "rio branco": { lat: -9.9754, lng: -67.8249 },
  macapa: { lat: 0.0356, lng: -51.0705 },
  palmas: { lat: -10.2491, lng: -48.3243 },
  aracaju: { lat: -10.9472, lng: -37.0731 },
  "boa vista": { lat: 2.8235, lng: -60.6758 },
  londrina: { lat: -23.3045, lng: -51.1696 },
  "ribeirao preto": { lat: -21.1775, lng: -47.8103 },
  sorocaba: { lat: -23.5015, lng: -47.4526 },
  santos: { lat: -23.9608, lng: -46.3336 },
  "sao jose dos campos": { lat: -23.2237, lng: -45.9009 },
  joinville: { lat: -26.3045, lng: -48.8487 },
  uberlandia: { lat: -18.9186, lng: -48.2772 },
  contagem: { lat: -19.932, lng: -44.0539 },
};

/** Used only when the case has a state and no city. */
const STATES: Record<string, LatLng> = {
  ac: { lat: -9.9754, lng: -67.8249 },
  acre: { lat: -9.9754, lng: -67.8249 },
  al: { lat: -9.6498, lng: -35.7089 },
  alagoas: { lat: -9.6498, lng: -35.7089 },
  ap: { lat: 0.0356, lng: -51.0705 },
  amapa: { lat: 0.0356, lng: -51.0705 },
  am: { lat: -3.119, lng: -60.0217 },
  amazonas: { lat: -3.119, lng: -60.0217 },
  ba: { lat: -12.9777, lng: -38.5016 },
  bahia: { lat: -12.9777, lng: -38.5016 },
  ce: { lat: -3.7172, lng: -38.5433 },
  ceara: { lat: -3.7172, lng: -38.5433 },
  df: { lat: -15.7939, lng: -47.8828 },
  "distrito federal": { lat: -15.7939, lng: -47.8828 },
  es: { lat: -20.3155, lng: -40.3128 },
  "espirito santo": { lat: -20.3155, lng: -40.3128 },
  go: { lat: -16.6869, lng: -49.2648 },
  goias: { lat: -16.6869, lng: -49.2648 },
  ma: { lat: -2.5387, lng: -44.2825 },
  maranhao: { lat: -2.5387, lng: -44.2825 },
  mt: { lat: -15.601, lng: -56.0974 },
  "mato grosso": { lat: -15.601, lng: -56.0974 },
  ms: { lat: -20.4697, lng: -54.6201 },
  "mato grosso do sul": { lat: -20.4697, lng: -54.6201 },
  mg: { lat: -19.9167, lng: -43.9345 },
  "minas gerais": { lat: -19.9167, lng: -43.9345 },
  pa: { lat: -1.4558, lng: -48.4902 },
  para: { lat: -1.4558, lng: -48.4902 },
  pb: { lat: -7.1195, lng: -34.845 },
  paraiba: { lat: -7.1195, lng: -34.845 },
  pr: { lat: -25.4284, lng: -49.2733 },
  parana: { lat: -25.4284, lng: -49.2733 },
  pe: { lat: -8.0476, lng: -34.877 },
  pernambuco: { lat: -8.0476, lng: -34.877 },
  pi: { lat: -5.0892, lng: -42.8019 },
  piaui: { lat: -5.0892, lng: -42.8019 },
  rj: { lat: -22.9068, lng: -43.1729 },
  "rio de janeiro": { lat: -22.9068, lng: -43.1729 },
  rn: { lat: -5.7793, lng: -35.2009 },
  "rio grande do norte": { lat: -5.7793, lng: -35.2009 },
  rs: { lat: -30.0346, lng: -51.2177 },
  "rio grande do sul": { lat: -30.0346, lng: -51.2177 },
  ro: { lat: -8.7612, lng: -63.9004 },
  rondonia: { lat: -8.7612, lng: -63.9004 },
  rr: { lat: 2.8235, lng: -60.6758 },
  roraima: { lat: 2.8235, lng: -60.6758 },
  sc: { lat: -27.5949, lng: -48.5482 },
  "santa catarina": { lat: -27.5949, lng: -48.5482 },
  sp: { lat: -23.5505, lng: -46.6333 },
  "sao paulo": { lat: -23.5505, lng: -46.6333 },
  se: { lat: -10.9472, lng: -37.0731 },
  sergipe: { lat: -10.9472, lng: -37.0731 },
  to: { lat: -10.2491, lng: -48.3243 },
  tocantins: { lat: -10.2491, lng: -48.3243 },
};

function normalizePlace(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function locateCity(city: string, state: string): LatLng | null {
  const cityKey = normalizePlace(city);
  if (cityKey && CITIES[cityKey]) return CITIES[cityKey];
  if (!cityKey) {
    const stateKey = normalizePlace(state);
    return STATES[stateKey] ?? null;
  }
  return null;
}
