import { getPayload } from 'payload'
import config from '@payload-config'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { Menu, WineList } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

const dietaryLabelMap: Record<string, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'Gluten Free',
  'dairy-free': 'Dairy Free',
  'nut-free': 'Nut Free',
}

function getWinePairingName(pairing: (string | null) | WineList | undefined): string | null {
  if (!pairing) return null
  if (typeof pairing === 'object' && pairing !== null) {
    return (pairing as WineList).name
  }
  return null
}

export default async function MenuPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })
  const t = await getTranslations({ locale, namespace: 'menu' })

  const { docs: courses } = await payload.find({
    collection: 'menu',
    locale: loc,
    limit: 50,
    sort: 'order',
    where: { active: { equals: true } },
  })

  return (
    <main className="min-h-screen py-24 md:py-32">
      <Container>
        {/* Page header */}
        <ScrollReveal>
          <div className="text-center mb-20 space-y-4">
            <p className="text-gold text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-gold w-24 mx-auto" />
            <h1 className="font-heading text-4xl md:text-6xl text-foreground">{t('title')}</h1>
            <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          </div>
        </ScrollReveal>

        {/* Courses */}
        {courses.length === 0 ? (
          <p className="text-muted text-center py-16">{t('subtitle')}</p>
        ) : (
          <div className="space-y-20">
            {courses.map((course: Menu) => (
              <ScrollReveal key={course.id}>
                <section>
                  {/* Course heading */}
                  <div className="text-center mb-10 space-y-3">
                    <h2 className="font-heading text-3xl text-foreground">{course.name}</h2>
                    {course.description && (
                      <p className="text-muted text-sm italic max-w-md mx-auto">
                        {course.description}
                      </p>
                    )}
                    <hr className="hr-rose w-32 mx-auto mt-4" />
                  </div>

                  {/* Dishes */}
                  {course.dishes && course.dishes.length > 0 ? (
                    <div className="max-w-3xl mx-auto space-y-0">
                      {course.dishes.map((dish, idx) => {
                        const wineName = getWinePairingName(dish.winePairing)
                        return (
                          <div
                            key={dish.id ?? `${course.id}-${idx}`}
                            className="group py-6 border-b border-border/40 last:border-b-0"
                          >
                            <div className="flex items-start gap-4">
                              {/* Left: name + badges + description */}
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-heading text-xl text-foreground">
                                    {dish.name}
                                  </h3>
                                  {dish.chefRecommendation && (
                                    <Badge variant="gold" className="text-xs">
                                      {t('chefRecommendation')}
                                    </Badge>
                                  )}
                                  {dish.seasonal && (
                                    <Badge variant="default" className="text-xs">
                                      {t('seasonal')}
                                    </Badge>
                                  )}
                                </div>

                                {dish.description && (
                                  <p className="text-muted text-sm leading-relaxed">
                                    {dish.description}
                                  </p>
                                )}

                                {/* Dietary badges */}
                                {dish.dietary && dish.dietary.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {dish.dietary.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {dietaryLabelMap[tag] ?? tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                {/* Wine pairing */}
                                {wineName && (
                                  <div className="flex items-center gap-1.5 pt-1">
                                    <span className="text-gold text-xs" aria-hidden>
                                      ♦
                                    </span>
                                    <Link
                                      href={`/${locale}/wines`}
                                      className="text-gold text-xs uppercase tracking-wider hover:underline"
                                    >
                                      {t('winePairing')}: {wineName}
                                    </Link>
                                  </div>
                                )}
                              </div>

                              {/* Right: price */}
                              <div className="shrink-0 text-right">
                                <span className="font-heading text-lg text-foreground">
                                  €{dish.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </section>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Footer note */}
        <ScrollReveal delay={200}>
          <div className="text-center mt-20 pt-10 border-t border-border/40 space-y-3">
            <p className="text-muted text-xs uppercase tracking-widest">
              All prices include VAT · Menu changes seasonally
            </p>
            <Link
              href={`/${locale}/booking`}
              className="inline-block border border-primary/40 text-primary px-10 py-3 rounded-sm text-sm uppercase tracking-widest hover:bg-primary hover:text-background transition-all duration-300 mt-4"
            >
              Reserve a Table
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </main>
  )
}
