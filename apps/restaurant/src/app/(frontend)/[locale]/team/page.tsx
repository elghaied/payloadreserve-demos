import { getPayload } from 'payload'
import config from '@payload-config'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { Team, Media } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

function getMemberPhotoUrl(photo: Team['photo']): string | null {
  if (typeof photo === 'object' && photo !== null) {
    return (photo as Media).url ?? null
  }
  return null
}

function getMemberPhotoAlt(photo: Team['photo'], fallback: string): string {
  if (typeof photo === 'object' && photo !== null) {
    return (photo as Media).alt ?? fallback
  }
  return fallback
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })
  const t = await getTranslations({ locale, namespace: 'team' })

  const { docs: members } = await payload.find({
    collection: 'team',
    locale: loc,
    limit: 50,
    sort: 'order',
  })

  return (
    <main className="min-h-screen py-24 md:py-32">
      <Container>
        {/* Page header */}
        <ScrollReveal>
          <div className="text-center mb-20 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-rose w-24 mx-auto" />
            <h1 className="font-heading text-4xl md:text-6xl text-foreground">{t('title')}</h1>
            <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          </div>
        </ScrollReveal>

        {/* Team grid */}
        {members.length === 0 ? (
          <p className="text-muted text-center py-16">{t('subtitle')}</p>
        ) : (
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {members.map((member: Team) => {
              const photoUrl = getMemberPhotoUrl(member.photo)
              const photoAlt = getMemberPhotoAlt(member.photo, member.name)
              const roleLabel =
                t.raw(`roles.${member.role}` as Parameters<typeof t.raw>[0]) ?? member.role

              return (
                <ScrollReveal key={member.id}>
                  <article className="group glass rounded-sm overflow-hidden transition-all duration-300 hover:burgundy-glow">
                    {/* Photo */}
                    <div className="relative aspect-square overflow-hidden">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={photoAlt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background:
                              'radial-gradient(ellipse at center, #3d1a2e 0%, #1a0a14 100%)',
                          }}
                        >
                          <span className="text-gold font-heading text-6xl opacity-30">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                      {/* Role badge on image */}
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="surface" className="text-xs backdrop-blur-sm">
                          {String(roleLabel)}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Name */}
                      <div>
                        <h2 className="font-heading text-xl text-foreground">{member.name}</h2>
                        {member.specialty && (
                          <p className="text-gold text-xs uppercase tracking-wider mt-1">
                            {member.specialty}
                          </p>
                        )}
                      </div>

                      <hr className="hr-rose" />

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-muted text-sm leading-relaxed">{member.bio}</p>
                      )}

                      {/* Signature dish */}
                      {member.signatureDish && (
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-widest text-gold">
                            {t('signatureDish')}
                          </p>
                          <p className="text-foreground/80 text-sm italic">
                            {member.signatureDish}
                          </p>
                        </div>
                      )}

                      {/* Awards */}
                      {member.awards && member.awards.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-widest text-gold">
                            {t('awards')}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {member.awards.map((award, idx) => (
                              <Badge key={award.id ?? idx} variant="gold" className="text-xs">
                                {award.title}
                                {award.year ? ` ${award.year}` : ''}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              )
            })}
          </StaggerChildren>
        )}
      </Container>
    </main>
  )
}
