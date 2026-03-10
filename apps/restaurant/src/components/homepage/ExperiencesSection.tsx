import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import type { Homepage, DiningExperience } from '@/payload-types'

type Props = {
  data: Homepage
  experiences: DiningExperience[]
  locale: string
}

export async function ExperiencesSection({ data, experiences, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'experiences' })

  if (experiences.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-rose w-24 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-heading text-foreground">
              {data.experiencesHeading || t('title')}
            </h2>
            {(data.experiencesSubtitle || t('subtitle')) && (
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                {data.experiencesSubtitle || t('subtitle')}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Experience cards */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <ScrollReveal key={exp.id}>
              <div className="glass rounded-sm p-6 flex flex-col gap-4 h-full group transition-all duration-300 hover:burgundy-glow">
                {/* Duration + Price row */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-primary text-xs uppercase tracking-widest">
                    {t('duration', { minutes: exp.duration })}
                  </span>
                  {exp.price != null && (
                    <span className="font-heading text-xl text-gold">€{exp.price.toFixed(0)}</span>
                  )}
                </div>

                {/* Divider */}
                <hr className="border-border/40" />

                {/* Name */}
                <h3 className="font-heading text-2xl text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
                  {exp.name}
                </h3>

                {/* Description */}
                {exp.description && (
                  <p className="text-muted text-sm leading-relaxed flex-1">{exp.description}</p>
                )}

                {/* CTA */}
                <div className="mt-auto pt-2">
                  <Link
                    href={`/${locale}/book?experience=${exp.id}`}
                    className="inline-block w-full text-center bg-primary/10 border border-primary/30 text-primary px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest hover:bg-primary hover:text-background transition-all duration-300"
                  >
                    {t('bookExperience')}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  )
}
