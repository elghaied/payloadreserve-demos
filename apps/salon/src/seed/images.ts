import type { Payload } from 'payload'
import { uploadImage as uploadImageFromUrl } from '@payload-reserve-demos/seed-utils'

// Curated Pexels image URLs (free to use)
const IMAGE_URLS = {
  heroBackground: 'https://images.pexels.com/photos/3997381/pexels-photo-3997381.jpeg?auto=compress&cs=tinysrgb&w=1920',
  aboutSalon: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200',
  facial: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800',
  massage: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800',
  manicure: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=800',
  waxing: 'https://images.pexels.com/photos/3985330/pexels-photo-3985330.jpeg?auto=compress&cs=tinysrgb&w=800',
  specialist1: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600',
  specialist2: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600',
  specialist3: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=600',
  specialist4: 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600',
  gallery1: 'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=800',
  gallery2: 'https://images.pexels.com/photos/3993463/pexels-photo-3993463.jpeg?auto=compress&cs=tinysrgb&w=800',
  gallery3: 'https://images.pexels.com/photos/3985328/pexels-photo-3985328.jpeg?auto=compress&cs=tinysrgb&w=800',
}

export type ImageKey = keyof typeof IMAGE_URLS

export async function uploadImage(
  payload: Payload,
  key: ImageKey,
  alt: string,
): Promise<string> {
  return uploadImageFromUrl(payload, IMAGE_URLS[key], alt, `${key}.jpg`)
}
