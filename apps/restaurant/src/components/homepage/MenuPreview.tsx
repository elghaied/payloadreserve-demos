import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { Homepage, Menu } from '@/payload-types'

type DishItem = {
  name: string
  description?: string | null
  price: number
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free')[] | null
  seasonal?: boolean | null
  chefRecommendation?: boolean | null
  winePairing?: string | { id: string; name: string } | null
  id?: string | null
  courseName: string
}

type Props = {
  data: Homepage
  menuItems: Menu[]
  locale: string
}

function collectFeaturedDishes(menuItems: Menu[]): DishItem[] {
  const featured: DishItem[] = []
  const others: DishItem[] = []

  for (const course of menuItems) {
    if (!course.dishes) continue
    for (const dish of course.dishes) {
      const entry: DishItem = { ...dish, courseName: course.name }
      if (dish.chefRecommendation) {
        featured.push(entry)
      } else {
        others.push(entry)
      }
    }
  }

  // Prioritise chef recommendations; fill to 8 with others
  const combined = [...featured, ...others]
  return combined.slice(0, 8)
}

const dietaryLabelMap: Record<string, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'Gluten Free',
  'dairy-free': 'Dairy Free',
  'nut-free': 'Nut Free',
}

export async function MenuPreview({ data, menuItems, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'menu' })

  const dishes = collectFeaturedDishes(menuItems)

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-gold text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-gold w-24 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-heading text-foreground">
              {data.menuHeading || t('title')}
            </h2>
            {(data.menuSubtitle || t('subtitle')) && (
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                {data.menuSubtitle || t('subtitle')}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Dishes grid */}
        {dishes.length > 0 ? (
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
            {dishes.map((dish) => (
              <ScrollReveal key={dish.id ?? dish.name} className="bg-background">
                <div className="p-6 h-full flex flex-col gap-3 hover:bg-surface/50 transition-colors duration-300">
                  {/* Course badge */}
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-xs shrink-0">
                      {dish.courseName}
                    </Badge>
                    {dish.chefRecommendation && (
                      <Badge variant="gold" className="text-xs shrink-0">
                        {t('chefRecommendation')}
                      </Badge>
                    )}
                  </div>

                  {/* Dish name */}
                  <h3 className="font-heading text-xl text-foreground leading-snug">{dish.name}</h3>

                  {/* Description */}
                  {dish.description && (
                    <p className="text-muted text-sm leading-relaxed flex-1">{dish.description}</p>
                  )}

                  {/* Footer: dietary + price */}
                  <div className="mt-auto space-y-2 pt-2">
                    {/* Dietary badges */}
                    {dish.dietary && dish.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dish.dietary.map((tag) => (
                          <Badge key={tag} variant="default" className="text-xs">
                            {dietaryLabelMap[tag] ?? tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <span className="font-heading text-lg text-foreground">
                        €{dish.price.toFixed(2)}
                      </span>

                      {/* Wine pairing indicator */}
                      {dish.winePairing && (
                        <span className="text-gold text-xs uppercase tracking-wider flex items-center gap-1">
                          <span aria-hidden>♦</span>
                          {t('winePairing')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>
        ) : (
          <p className="text-muted text-center py-16">{t('subtitle')}</p>
        )}

        {/* CTA link */}
        <ScrollReveal delay={200}>
          <div className="text-center mt-14">
            <Link
              href={data.menuCtaLink ?? `/${locale}/menu`}
              className="inline-block border border-foreground/30 text-foreground px-10 py-3 rounded-sm text-sm uppercase tracking-widest hover:border-gold hover:text-gold transition-colors duration-300"
            >
              {data.menuCtaText || t('viewFullMenu')}
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
