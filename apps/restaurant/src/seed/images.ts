import type { Payload } from 'payload'
import { uploadImage as uploadImageUtil } from '@payload-reserve-demos/seed-utils'

export type ImageKey =
  | 'heroBackground'
  | 'aboutRestaurant'
  | 'intimateTable'
  | 'classicTable'
  | 'familyTable'
  | 'privateRoom'
  | 'terrace'
  | 'menuStarters'
  | 'menuMains'
  | 'menuDesserts'
  | 'gallery1'
  | 'gallery2'
  | 'gallery3'

export const IMAGE_URLS: Record<ImageKey, string> = {
  heroBackground: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  aboutRestaurant: 'https://images.pexels.com/photos/3338681/pexels-photo-3338681.jpeg?auto=compress&cs=tinysrgb&w=800',
  intimateTable: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800',
  classicTable: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
  familyTable: 'https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=800',
  privateRoom: 'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=800',
  terrace: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
  menuStarters: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=800',
  menuMains: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=800',
  menuDesserts: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=800',
  gallery1: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
  gallery2: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800',
  gallery3: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
}

export async function uploadImage(payload: Payload, key: ImageKey, alt: string) {
  return uploadImageUtil(payload, IMAGE_URLS[key], alt, `${key}.jpg`)
}
