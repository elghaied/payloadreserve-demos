import type { Payload } from 'payload'
import { uploadImage as uploadImageUtil } from '@payload-reserve-demos/seed-utils'

export type ImageKey =
  // Hero & About
  | 'heroBackground'
  | 'aboutVenue'
  // Venues
  | 'venueGrandeSalle'
  | 'venueSalonNoir'
  | 'venueGalerie'
  | 'venueStudio'
  | 'venueTerrasse'
  // Artists
  | 'artistLucien'
  | 'artistCamille'
  | 'artistYuki'
  | 'artistReda'
  | 'artistEloise'
  | 'artistMarc'
  // Announcements / Seasons
  | 'announcementJazz'
  | 'announcementNuit'
  | 'seasonSpring'
  | 'seasonSummer'

export const IMAGE_URLS: Record<ImageKey, string> = {
  // Hero & About
  heroBackground: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  aboutVenue: 'https://images.pexels.com/photos/2263410/pexels-photo-2263410.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Venues
  venueGrandeSalle: 'https://images.pexels.com/photos/11547742/pexels-photo-11547742.jpeg?auto=compress&cs=tinysrgb&w=800',
  venueSalonNoir: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
  venueGalerie: 'https://images.pexels.com/photos/3004909/pexels-photo-3004909.jpeg?auto=compress&cs=tinysrgb&w=800',
  venueStudio: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=800',
  venueTerrasse: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Artists
  artistLucien: 'https://images.pexels.com/photos/2531551/pexels-photo-2531551.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistCamille: 'https://images.pexels.com/photos/3756616/pexels-photo-3756616.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistYuki: 'https://images.pexels.com/photos/3776932/pexels-photo-3776932.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistReda: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistEloise: 'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistMarc: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600',
  // Announcements / Seasons
  announcementJazz: 'https://images.pexels.com/photos/442540/pexels-photo-442540.jpeg?auto=compress&cs=tinysrgb&w=800',
  announcementNuit: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
  seasonSpring: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
  seasonSummer: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
}

export async function uploadImage(payload: Payload, key: ImageKey, alt: string) {
  return uploadImageUtil(payload, IMAGE_URLS[key], alt, `${key}.jpg`)
}
