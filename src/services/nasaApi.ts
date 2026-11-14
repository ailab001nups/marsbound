// ==========================================
// MARSBOUND: NASA OPEN API SERVICE WITH RESILIENT FALLBACK
// ==========================================

import {
  NasaApodItem,
  NasaRoverPhotoItem,
  NasaDonkiEvent,
  NasaOsdrStudy,
  NasaRadLabMeasurement,
  ARCHIVED_APOD_COLLECTION,
  ARCHIVED_ROVER_PHOTOS,
  ARCHIVED_DONKI_NOTIFICATIONS,
  ARCHIVED_OSDR_STUDIES,
  ARCHIVED_RADLAB_DATA,
} from '../data/archivedNasaData';
import { DataSourceType } from '../types/game';

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

export interface NasaApiResponse<T> {
  data: T;
  sourceType: DataSourceType;
  attribution: string;
  sourceUrl: string;
  isFallback: boolean;
  timestamp: string;
}

export async function fetchApod(): Promise<NasaApiResponse<NasaApodItem>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${NASA_BASE_URL}/planetary/apod?api_key=${API_KEY}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`NASA APOD API error status: ${res.status}`);
    }

    const json = await res.json();
    return {
      data: {
        date: json.date,
        title: json.title,
        explanation: json.explanation,
        url: json.url,
        hdurl: json.hdurl,
        media_type: 'image',
        copyright: json.copyright || 'NASA / Public Domain',
      },
      sourceType: 'LIVE_NASA',
      attribution: `NASA Astronomy Picture of the Day (${json.date})`,
      sourceUrl: 'https://apod.nasa.gov/',
      isFallback: false,
      timestamp: new Date().toISOString(),
    };
  } catch (_err) {
    // Graceful offline fallback to verified archived APOD
    const fallbackItem = ARCHIVED_APOD_COLLECTION[0];
    return {
      data: fallbackItem,
      sourceType: 'ARCHIVED_NASA',
      attribution: `NASA JPL / Belva Panorama Archive (${fallbackItem.date})`,
      sourceUrl: 'https://apod.nasa.gov/',
      isFallback: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchRoverPhotos(sol: number = 750): Promise<NasaApiResponse<NasaRoverPhotoItem[]>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `${NASA_BASE_URL}/mars-photos/api/v1/rovers/perseverance/photos?sol=${sol}&api_key=${API_KEY}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`NASA Rover Photos error status: ${res.status}`);
    }

    const json = await res.json();
    if (json.photos && json.photos.length > 0) {
      const photos: NasaRoverPhotoItem[] = json.photos.slice(0, 6).map((p: any) => ({
        id: p.id,
        sol: p.sol,
        camera: {
          name: p.camera.name,
          full_name: p.camera.full_name,
        },
        img_src: p.img_src,
        earth_date: p.earth_date,
        rover: {
          name: p.rover.name,
          landing_date: p.rover.landing_date,
          launch_date: p.rover.launch_date,
          status: p.rover.status,
        },
        caption: `Mars 2020 Perseverance Rover - ${p.camera.full_name} Sol ${p.sol}`,
      }));

      return {
        data: photos,
        sourceType: 'LIVE_NASA',
        attribution: `NASA Mars 2020 Perseverance Live Telemetry (Sol ${sol})`,
        sourceUrl: 'https://mars.nasa.gov/mars2020/',
        isFallback: false,
        timestamp: new Date().toISOString(),
      };
    }

    throw new Error('No live photos found for this sol, using archive');
  } catch (_err) {
    return {
      data: ARCHIVED_ROVER_PHOTOS,
      sourceType: 'ARCHIVED_NASA',
      attribution: 'NASA/JPL-Caltech Curated High-Res Mars Archive',
      sourceUrl: 'https://mars.nasa.gov/mars2020/',
      isFallback: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchSpaceWeatherNotifications(): Promise<NasaApiResponse<NasaDonkiEvent[]>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);

    const startStr = pastDate.toISOString().split('T')[0];
    const endStr = today.toISOString().split('T')[0];

    const res = await fetch(
      `${NASA_BASE_URL}/DONKI/notifications?startDate=${startStr}&endDate=${endStr}&type=all&api_key=${API_KEY}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`NASA DONKI error status: ${res.status}`);
    }

    const json = await res.json();
    if (Array.isArray(json) && json.length > 0) {
      const events: NasaDonkiEvent[] = json.slice(0, 5).map((item: any) => ({
        messageType: item.messageType || 'DONKI_EVENT',
        messageID: item.messageID || `ID-${Math.random()}`,
        messageIssueTime: item.messageIssueTime || new Date().toISOString(),
        messageURL: item.messageURL || 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
        eventType: item.messageType?.includes('CME') ? 'CME' : item.messageType?.includes('FLR') ? 'FLR' : 'SEP',
        summary: item.messageBody ? item.messageBody.slice(0, 240) + '...' : 'Space weather observation recorded.',
        simulatedMarsRisk: item.messageBody?.toLowerCase().includes('x-class') ? 'Severe' : 'Moderate',
      }));

      return {
        data: events,
        sourceType: 'LIVE_NASA',
        attribution: 'NASA Space Weather Database Of Notifications, Knowledge, Information (DONKI)',
        sourceUrl: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
        isFallback: false,
        timestamp: new Date().toISOString(),
      };
    }

    throw new Error('No DONKI records returned');
  } catch (_err) {
    return {
      data: ARCHIVED_DONKI_NOTIFICATIONS,
      sourceType: 'ARCHIVED_NASA',
      attribution: 'NASA Goddard Space Flight Center DONKI Verified Database Archive',
      sourceUrl: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
      isFallback: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export function getOsdrStudies(): NasaApiResponse<NasaOsdrStudy[]> {
  return {
    data: ARCHIVED_OSDR_STUDIES,
    sourceType: 'ARCHIVED_NASA',
    attribution: 'NASA Open Science Data Repository (OSDR), Ames Research Center',
    sourceUrl: 'https://osdr.nasa.gov/',
    isFallback: false,
    timestamp: new Date().toISOString(),
  };
}

export function getRadLabData(): NasaApiResponse<NasaRadLabMeasurement[]> {
  return {
    data: ARCHIVED_RADLAB_DATA,
    sourceType: 'ARCHIVED_NASA',
    attribution: 'NASA MSL Curiosity Radiation Assessment Detector (RAD)',
    sourceUrl: 'https://www.nasa.gov/mission_pages/msl/telemetry.html',
    isFallback: false,
    timestamp: new Date().toISOString(),
  };
}
