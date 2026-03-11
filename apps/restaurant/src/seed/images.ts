import type { Payload } from 'payload'
import { uploadImage as uploadImageUtil } from '@payload-reserve-demos/seed-utils'

export type ImageKey =
  // Hero & Story
  | 'heroBackground'
  | 'storyRestaurant'
  // Tables (keep for resources)
  | 'intimateTable'
  | 'classicTable'
  | 'familyTable'
  | 'privateRoom'
  | 'terrace'
  // Menu courses
  | 'menuStarters'
  | 'menuMains'
  | 'menuDesserts'
  // Team
  | 'chefHead'
  | 'chefSous'
  | 'chefPastry'
  | 'sommelier'
  | 'maitreD'
  // Spaces
  | 'spaceDining'
  | 'spaceTerrace'
  | 'spaceSalon'
  | 'spaceChefTable'
  | 'spaceCellar'
  // Wine
  | 'wineProgram'
  // Announcements
  | 'announcementSpring'
  | 'announcementJazz'
  | 'announcementChef'
  | 'announcementWine'

export const IMAGE_URLS: Record<ImageKey, string> = {
  // Hero & Story
  heroBackground: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
  storyRestaurant: 'https://images.pexels.com/photos/6662510/pexels-photo-6662510.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Tables
  intimateTable: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800',
  classicTable: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
  familyTable: 'https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=800',
  privateRoom: 'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=800',
  terrace: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Menu
  menuStarters: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=800',
  menuMains: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=800',
  menuDesserts: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Team
  chefHead: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=600',
  chefSous: 'https://images.pexels.com/photos/6036009/pexels-photo-6036009.jpeg?auto=compress&cs=tinysrgb&w=600',
  chefPastry: 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=600',
  sommelier: 'https://images.pexels.com/photos/3727219/pexels-photo-3727219.jpeg?auto=compress&cs=tinysrgb&w=600',
  maitreD: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=600',
  // Spaces (each uses a distinct URL)
  spaceDining: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
  spaceTerrace: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=800',
  spaceSalon: 'https://images.pexels.com/photos/3201922/pexels-photo-3201922.jpeg?auto=compress&cs=tinysrgb&w=800',
  spaceChefTable: 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=800',
  spaceCellar: 'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Wine
  wineProgram: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Announcements (each uses a distinct URL)
  announcementSpring: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
  announcementJazz: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800',
  announcementChef: 'https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg?auto=compress&cs=tinysrgb&w=800',
  announcementWine: 'https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg?auto=compress&cs=tinysrgb&w=800',
}

export async function uploadImage(payload: Payload, key: ImageKey, alt: string) {
  return uploadImageUtil(payload, IMAGE_URLS[key], alt, `${key}.jpg`)
}
