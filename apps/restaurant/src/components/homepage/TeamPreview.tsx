import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import type { Homepage, Team, Media } from '@/payload-types'

type Props = {
  data: Homepage
  team: Team[]
  locale: string
}

function getMemberPhotoUrl(photo: Team['photo']): string | null {
  if (typeof photo === 'object' && photo !== null) {
    return (photo as Media).url ?? null
  }
  return null
}

function getMemberPhotoAlt(photo: Team['photo']): string {
  if (typeof photo === 'object' && photo !== null) {
    return (photo as Media).alt ?? ''
  }
  return ''
}

function truncateBio(bio: string | null | undefined, maxLength = 120): string {
  if (!bio) return ''
  if (bio.length <= maxLength) return bio
  return bio.slice(0, maxLength).trimEnd() + '…'
}

export async function TeamPreview({ data, team, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'team' })

  return (
    <section className="py-24 md:py-32 bg-surface/20">
      <Container>
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-rose w-24 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-heading text-foreground">
              {data.teamHeading || t('title')}
            </h2>
            {(data.teamSubtitle || t('subtitle')) && (
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                {data.teamSubtitle || t('subtitle')}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Team grid */}
        {team.length > 0 ? (
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => {
              const photoUrl = getMemberPhotoUrl(member.photo)
              const photoAlt = getMemberPhotoAlt(member.photo)
              const roleLabel =
                t.raw(`roles.${member.role}` as Parameters<typeof t.raw>[0]) ?? member.role

              return (
                <ScrollReveal key={member.id}>
                  <div className="group text-center space-y-4">
                    {/* Photo */}
                    <div className="relative mx-auto w-40 h-40">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={photoAlt || member.name}
                          className="w-full h-full object-cover rounded-full ring-1 ring-border group-hover:ring-primary transition-all duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-full ring-1 ring-border flex items-center justify-center group-hover:ring-primary transition-all duration-500"
                          style={{
                            background:
                              'radial-gradient(ellipse at center, #3d1a2e 0%, #1a0a14 100%)',
                          }}
                        >
                          <span className="text-gold font-heading text-4xl opacity-40">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Decorative ring on hover */}
                      <div className="absolute inset-0 rounded-full ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all duration-500 scale-110" />
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <h3 className="font-heading text-xl text-foreground">{member.name}</h3>
                      <p className="text-gold text-xs uppercase tracking-widest">
                        {String(roleLabel)}
                      </p>
                    </div>

                    {/* Divider */}
                    <hr className="hr-rose w-12 mx-auto" />

                    {/* Bio excerpt */}
                    {member.bio && (
                      <p className="text-muted text-sm leading-relaxed px-2">
                        {truncateBio(member.bio)}
                      </p>
                    )}

                    {/* Specialty */}
                    {member.specialty && (
                      <p className="text-foreground/50 text-xs italic">{member.specialty}</p>
                    )}
                  </div>
                </ScrollReveal>
              )
            })}
          </StaggerChildren>
        ) : (
          <p className="text-muted text-center py-16">{t('subtitle')}</p>
        )}

        {/* Link to full team page */}
        <ScrollReveal delay={200}>
          <div className="text-center mt-14">
            <Link
              href={`/${locale}/team`}
              className="inline-block border border-foreground/30 text-foreground px-10 py-3 rounded-sm text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-colors duration-300"
            >
              {t('title')}
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
