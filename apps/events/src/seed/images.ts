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
  | 'announcementYuki'
  | 'announcementCine'
  | 'announcementAtelier'
  | 'seasonSpring'
  | 'seasonSummer'
  | 'seasonAutumn'
  | 'seasonWinter'

export const IMAGE_URLS: Record<ImageKey, string> = {
  // Hero & About
  heroBackground: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  aboutVenue: 'https://images.pexels.com/photos/17197524/pexels-photo-17197524.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Venues
  venueGrandeSalle: 'https://images.pexels.com/photos/19658083/pexels-photo-19658083.jpeg?auto=compress&cs=tinysrgb&w=800',
  venueSalonNoir: 'https://images.pexels.com/photos/30617227/pexels-photo-30617227.jpeg?auto=compress&cs=tinysrgb&w=800',
  venueGalerie: 'https://images.pexels.com/photos/3004909/pexels-photo-3004909.jpeg?auto=compress&cs=tinysrgb&w=800',
  venueStudio: 'https://images.pexels.com/photos/8933839/pexels-photo-8933839.jpeg?auto=compress&cs=tinysrgb&w=800',
  venueTerrasse: 'https://images.pexels.com/photos/28976226/pexels-photo-28976226.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Artists
  artistLucien: 'https://images.pexels.com/photos/10254339/pexels-photo-10254339.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistCamille: 'https://images.pexels.com/photos/11782320/pexels-photo-11782320.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistYuki: 'https://images.pexels.com/photos/3776932/pexels-photo-3776932.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistReda: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistEloise: 'https://images.pexels.com/photos/19120556/pexels-photo-19120556.jpeg?auto=compress&cs=tinysrgb&w=600',
  artistMarc: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600',
  // Announcements / Seasons
  announcementJazz: 'https://images.pexels.com/photos/442540/pexels-photo-442540.jpeg?auto=compress&cs=tinysrgb&w=800',
  announcementNuit: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
  announcementYuki: 'https://images.pexels.com/photos/30192982/pexels-photo-30192982.jpeg?auto=compress&cs=tinysrgb&w=800',
  announcementCine: 'https://images.pexels.com/photos/6521574/pexels-photo-6521574.jpeg?auto=compress&cs=tinysrgb&w=800',
  announcementAtelier: 'https://images.pexels.com/photos/8853793/pexels-photo-8853793.jpeg?auto=compress&cs=tinysrgb&w=800',
  seasonSpring: 'https://images.pexels.com/photos/31940358/pexels-photo-31940358.jpeg?auto=compress&cs=tinysrgb&w=800',
  seasonSummer: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
  seasonAutumn: 'https://images.pexels.com/photos/235721/pexels-photo-235721.jpeg?auto=compress&cs=tinysrgb&w=800',
  seasonWinter: 'https://images.pexels.com/photos/29756342/pexels-photo-29756342.jpeg?auto=compress&cs=tinysrgb&w=800',
}

export async function uploadImage(payload: Payload, key: ImageKey, alt: string) {
  return uploadImageUtil(payload, IMAGE_URLS[key], alt, `${key}.jpg`)
}
