import { CityLocation, PrayerTimeItem } from '../types';

export const POPULAR_CITIES: CityLocation[] = [
  { city: 'Makkah', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262, timezoneOffset: 3 },
  { city: 'Madinah', country: 'Saudi Arabia', lat: 24.4672, lng: 39.6111, timezoneOffset: 3 },
  { city: 'Jerusalem', country: 'Palestine', lat: 31.7683, lng: 35.2137, timezoneOffset: 3 },
  { city: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezoneOffset: 2 },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, timezoneOffset: 3 },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, timezoneOffset: 4 },
  { city: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezoneOffset: 6 },
  { city: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, timezoneOffset: 5 },
  { city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezoneOffset: 7 },
  { city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, timezoneOffset: 8 },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, timezoneOffset: 1 },
  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, timezoneOffset: -4 },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezoneOffset: -4 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezoneOffset: 10 },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezoneOffset: 2 },
];

export interface CalculationMethod {
  id: string;
  name: string;
  fajrAngle: number;
  ishaAngle: number;
}

export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 'MWL', name: 'Muslim World League (Fajr 18°, Isha 17°)', fajrAngle: 18, ishaAngle: 17 },
  { id: 'ISNA', name: 'Islamic Society of North America (15°, 15°)', fajrAngle: 15, ishaAngle: 15 },
  { id: 'EGYPT', name: 'Egyptian General Authority of Survey (19.5°, 17.5°)', fajrAngle: 19.5, ishaAngle: 17.5 },
  { id: 'UMM_AL_QURA', name: 'Umm Al-Qura University, Makkah (18.5°, 90 min)', fajrAngle: 18.5, ishaAngle: 18 },
  { id: 'KARACHI', name: 'University of Islamic Sciences, Karachi (18°, 18°)', fajrAngle: 18, ishaAngle: 18 },
];

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function radToDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function formatHours(h: number): string {
  let normalized = (h % 24 + 24) % 24;
  const hours = Math.floor(normalized);
  const minutes = Math.floor((normalized - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function calculateQiblaBearing(lat: number, lng: number): number {
  const meccaLat = 21.4225;
  const meccaLng = 39.8262;

  const φ1 = degToRad(lat);
  const φ2 = degToRad(meccaLat);
  const Δλ = degToRad(meccaLng - lng);

  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
  let qibla = radToDeg(Math.atan2(y, x));
  return Math.round((qibla + 360) % 360);
}

export function calculatePrayerTimes(
  date: Date,
  location: CityLocation,
  methodId: string = 'MWL'
): { [key: string]: string } {
  const method = CALCULATION_METHODS.find((m) => m.id === methodId) || CALCULATION_METHODS[0];

  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Approximate Sun declination & Equation of Time
  const B = (360 / 365) * (dayOfYear - 81);
  const bRad = degToRad(B);
  const eot = 9.87 * Math.sin(2 * bRad) - 7.53 * Math.cos(bRad) - 1.5 * Math.sin(bRad); // minutes
  const declination = 23.45 * Math.sin(degToRad((360 / 365) * (dayOfYear - 81))); // degrees

  const latRad = degToRad(location.lat);
  const decRad = degToRad(declination);

  // Solar Noon in UTC hours
  const solarNoonUTC = 12 - location.lng / 15 - eot / 60;
  const solarNoonLocal = solarNoonUTC + location.timezoneOffset;

  // Function for hour angle for given solar elevation angle alpha (below horizon is negative)
  function getHourAngle(alphaDeg: number): number {
    const alphaRad = degToRad(alphaDeg);
    const cosHA = (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1) return 0; // Sun never rises to this altitude
    if (cosHA < -1) return 12; // Sun never sets below this altitude
    return radToDeg(Math.acos(cosHA)) / 15;
  }

  // Sunrise/Sunset angle: -0.833 degrees (accounting for atmospheric refraction and solar radius)
  const sunriseHA = getHourAngle(-0.833);
  const fajrHA = getHourAngle(-method.fajrAngle);
  const ishaHA = getHourAngle(-method.ishaAngle);

  // Asr (Shafi'i: shadow length = object + noon shadow)
  // cot(noon_alt) = tan(|lat - dec|)
  const noonAlt = 90 - Math.abs(location.lat - declination);
  const asrAltDeg = radToDeg(Math.atan(1 / (1 + Math.tan(degToRad(Math.abs(location.lat - declination))))));
  const asrHA = getHourAngle(asrAltDeg);

  const fajrTime = solarNoonLocal - fajrHA;
  const sunriseTime = solarNoonLocal - sunriseHA;
  const dhuhrTime = solarNoonLocal + (4 / 60); // 4 minutes after solar noon to be safe
  const asrTime = solarNoonLocal + asrHA;
  const maghribTime = solarNoonLocal + sunriseHA;
  const ishaTime = solarNoonLocal + ishaHA;

  return {
    Fajr: formatHours(fajrTime),
    Sunrise: formatHours(sunriseTime),
    Dhuhr: formatHours(dhuhrTime),
    Asr: formatHours(asrTime),
    Maghrib: formatHours(maghribTime),
    Isha: formatHours(ishaTime),
  };
}

export function getEstimatedHijriDate(gregorianDate: Date): string {
  // Estimated astronomical conversion
  const hijriMonths = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
  ];

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(gregorianDate);
    const day = parts.find(p => p.type === 'day')?.value || '15';
    const monthNum = parseInt(parts.find(p => p.type === 'month')?.value || '5', 10);
    const year = parts.find(p => p.type === 'year')?.value || '1448';
    const monthName = hijriMonths[(monthNum - 1) % 12] || 'Jumada al-Awwal';
    return `${day} ${monthName} ${year} AH`;
  } catch {
    return `15 Jumada al-Awwal 1448 AH`;
  }
}
