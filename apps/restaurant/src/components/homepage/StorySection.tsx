import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal } from '@/components/ScrollReveal'
import type { Homepage, Media } from '@/payload-types'

type Props = {
  data: Homepage
  locale: string
}

export async function StorySection({ data, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'story' })

  const storyImage = data.storyImage
  const imageUrl = typeof storyImage === 'object' && storyImage !== null ? storyImage.url : null
  const imageAlt =
    typeof storyImage === 'object' && storyImage !== null ? (storyImage as Media).alt : ''

  const bodyParagraphs = data.storyBody
    ? data.storyBody.split('\n').filter((line) => line.trim().length > 0)
    : []

  return (
    <section className="py-24 md:py-32 bg-surface/30">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Image */}
          <ScrollReveal direction="left">
            <div className="relative">
              {imageUrl ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <img
                    src={imageUrl}
                    alt={imageAlt || (data.storyHeading ?? 'Our Story')}
                    className="object-cover w-full h-full"
                  />
                  {/* Decorative border inset */}
                  <div className="absolute inset-4 border border-foreground/10 rounded-sm pointer-events-none" />
                </div>
              ) : (
                /* Placeholder when no story image */
                <div
                  className="aspect-[4/5] rounded-sm flex items-center justify-center"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, #3d1a2e 0%, #1a0a14 100%)',
                  }}
                >
                  <p className="text-gold font-heading text-6xl opacity-30">✦</p>
                </div>
              )}

              {/* Established tag — decorative offset element */}
              {data.storyEstablished && (
                <div className="absolute -bottom-6 -right-6 glass rounded-sm px-5 py-3 text-center hidden md:block">
                  <p className="text-gold text-xs uppercase tracking-widest mb-1">Established</p>
                  <p className="text-foreground font-heading text-2xl">{data.storyEstablished}</p>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Right: Text content */}
          <ScrollReveal direction="right" delay={150}>
            <div className="space-y-6">
              {/* Small label */}
              <p className="text-gold text-sm uppercase tracking-widest">{t('heading')}</p>

              {/* Decorative divider */}
              <hr className="hr-rose w-16" />

              {/* Heading */}
              {data.storyHeading && (
                <h2 className="text-3xl md:text-4xl font-heading text-foreground leading-tight">
                  {data.storyHeading}
                </h2>
              )}

              {/* Body paragraphs */}
              {bodyParagraphs.length > 0 ? (
                <div className="space-y-4">
                  {bodyParagraphs.map((paragraph, i) => (
                    <p key={i} className="text-muted leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}

              {/* Established — mobile/inline fallback */}
              {data.storyEstablished && (
                <p className="text-gold/70 text-sm font-body tracking-widest md:hidden">
                  {data.storyEstablished}
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
