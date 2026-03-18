'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Animated Admin Panel Mockup ───
// Matches the real payload-reserve admin: calendar → reservation form → status change
// Pure React + CSS, zero external assets

const GOLD = '#c2a14e'
const GOLD_BAR = 'linear-gradient(90deg, #c9a84c, #d4b65c)'

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface CalendarEvent {
  day: number
  label: string
  color: string
  textColor: string
}

const EVENTS: CalendarEvent[] = [
  { day: 9, label: '11:00 AM Brazilian Wax', color: '#b8e6c8', textColor: '#1a5c2e' },
  { day: 13, label: '10:00 PM Brow Shaping', color: '#e0d4f0', textColor: '#5b3a8c' },
  { day: 19, label: '11:00 AM Classic Facial', color: '#fde68a', textColor: '#78600d' },
  { day: 21, label: '03:00 PM Swedish Massage', color: '#bfdbfe', textColor: '#1e40af' },
  { day: 23, label: '01:00 PM Gel Manicure', color: '#b8e6c8', textColor: '#1a5c2e' },
  { day: 24, label: '02:30 PM Gel Manicure', color: '#b8e6c8', textColor: '#1a5c2e' },
  { day: 26, label: '04:00 PM Lash Lift & Tint', color: '#fde68a', textColor: '#78600d' },
]

const TARGET_EVENT = EVENTS[4]

const DAYS_HEADER = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTH_OFFSET = 0
const DAYS_IN_MONTH = 31

const SIDEBAR_ITEMS = [
  { group: 'Collections', items: ['Users', 'Media'] },
  {
    group: 'Salon',
    items: [
      'Service Categories',
      'Services',
      'Resources',
      'Schedules',
      'Reservations',
      'Customers',
    ],
  },
  {
    group: 'Content',
    items: ['Testimonials', 'Galleries', 'Homepage', 'Site Settings'],
  },
]

const NATIVE_W = 880
const NATIVE_H = 550

export default function AdminPanelMockup() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [phase, setPhase] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 30 })
  const [cursorVisible, setCursorVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / NATIVE_W)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false

    const runCycle = async () => {
      while (!cancelled) {
        setPhase(0)
        setCursorVisible(false)
        setCursorPos({ x: 50, y: 30 })
        await wait(1800)
        if (cancelled) return

        setCursorVisible(true)
        setPhase(1)
        setCursorPos({ x: 36, y: 72 })
        await wait(1200)
        if (cancelled) return

        setPhase(2)
        await wait(400)
        if (cancelled) return

        setPhase(3)
        await wait(700)
        if (cancelled) return

        setPhase(4)
        setCursorPos({ x: 45, y: 40 })
        await wait(1200)
        if (cancelled) return

        setPhase(5)
        setCursorPos({ x: 42, y: 65.5 })
        await wait(1000)
        if (cancelled) return

        setPhase(6)
        await wait(400)
        if (cancelled) return

        setPhase(7)
        await wait(600)
        if (cancelled) return

        setPhase(8)
        setCursorPos({ x: 28, y: 73.5 })
        await wait(800)
        if (cancelled) return

        setPhase(9)
        await wait(400)
        if (cancelled) return

        setPhase(10)
        await wait(2000)
        if (cancelled) return

        setPhase(11)
        setCursorVisible(false)
        await wait(2200)
        if (cancelled) return
      }
    }

    runCycle()
    return () => {
      cancelled = true
    }
  }, [])

  const showReservation = phase >= 3 && phase <= 10
  const dropdownOpen = phase >= 7 && phase <= 9
  const statusConfirmed = phase >= 10
  const clicking = phase === 2 || phase === 6 || phase === 9

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: NATIVE_H * scale,
      }}
    >
    <div
      style={{
        position: 'relative',
        width: NATIVE_W,
        height: NATIVE_H,
        borderRadius: 10,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 11,
        userSelect: 'none',
        lineHeight: 1.4,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
      }}
    >
      {/* Gold top bar */}
      <div
        style={{
          height: 28,
          background: GOLD_BAR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          fontSize: 9,
          color: '#fff',
          fontWeight: 500,
        }}
      >
        <span>{'\u2190'} Back to Lumi{'\u00e8'}re Salon</span>
        <span style={{ opacity: 0.8 }}>salon.payloadreserve.com</span>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', height: 'calc(100% - 28px)' }}>
        {/* Sidebar */}
        <div
          style={{
            width: 130,
            borderRight: '1px solid #e8e5de',
            padding: '8px 0',
            overflow: 'hidden',
            flexShrink: 0,
            background: '#fdfcfa',
          }}
        >
          <div
            style={{
              padding: '4px 12px 8px',
              fontSize: 10,
              color: '#111',
              fontWeight: 600,
              borderBottom: '1px solid #e8e5de',
              marginBottom: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ color: GOLD, fontSize: 12 }}>+</span>
            <span>Dashboard</span>
            <span style={{ fontSize: 8, color: '#999' }}>{'\u25be'}</span>
          </div>

          {SIDEBAR_ITEMS.map((group) => (
            <div key={group.group} style={{ marginBottom: 4 }}>
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 500,
                  color: '#aaa',
                  padding: '4px 12px 2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {group.group}
              </div>
              {group.items.map((item) => (
                <div
                  key={item}
                  style={{
                    fontSize: 9.5,
                    padding: '3px 12px',
                    color: item === 'Reservations' ? '#111' : '#666',
                    fontWeight: item === 'Reservations' ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Calendar View */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: showReservation ? 0 : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: showReservation ? 'none' : 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                borderBottom: '1px solid #e8e5de',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ToolbarBtn text={'\u2190'} />
                <ToolbarBtn text="Today" />
                <ToolbarBtn text={'\u2192'} />
                <span
                  style={{ fontWeight: 700, fontSize: 13, color: '#111', marginLeft: 4 }}
                >
                  March 2026
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Legend color="#fde68a" label="Pending" />
                <Legend color="#b8e6c8" label="Confirmed" />
                <Legend color="#bfdbfe" label="Completed" />
                <Legend color="#e5e5e5" label="Cancelled" />
                <div style={{ width: 8 }} />
                <ToolbarBtn text="Create New" accent />
                <ViewTab text="Month" active />
                <ViewTab text="Week" />
                <ViewTab text="Day" />
              </div>
            </div>

            <div style={{ padding: '6px 14px', borderBottom: '1px solid #e8e5de' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  border: '1px solid #d4d0c8',
                  borderRadius: 4,
                  padding: '3px 10px',
                  fontSize: 9.5,
                  color: '#555',
                }}
              >
                All Resources <span style={{ fontSize: 8 }}>{'\u25be'}</span>
              </div>
            </div>

            <div style={{ flex: 1, padding: '0 2px 2px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  borderBottom: '2px solid ' + GOLD,
                }}
              >
                {DAYS_HEADER.map((d) => (
                  <div
                    key={d}
                    style={{
                      textAlign: 'center',
                      fontSize: 8,
                      fontWeight: 700,
                      color: '#888',
                      padding: '5px 0',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gridAutoRows: '1fr',
                  flex: 1,
                }}
              >
                {Array.from({ length: 42 }, (_, i) => {
                  const dayNum = i - MONTH_OFFSET + 1
                  const inMonth = dayNum >= 1 && dayNum <= DAYS_IN_MONTH
                  const dayEvents = inMonth ? EVENTS.filter((e) => e.day === dayNum) : []
                  const isToday = dayNum === 17

                  return (
                    <div
                      key={i}
                      style={{
                        borderRight: '1px solid #f0ede6',
                        borderBottom: '1px solid #f0ede6',
                        padding: '2px 3px',
                        minHeight: 38,
                        background: isToday ? '#f0ecdf' : inMonth ? '#fff' : '#fafaf7',
                      }}
                    >
                      {inMonth && (
                        <>
                          <div
                            style={{
                              fontSize: 8.5,
                              color: '#444',
                              fontWeight: isToday ? 700 : 400,
                              marginBottom: 1,
                            }}
                          >
                            {dayNum}
                          </div>
                          {dayEvents.map((ev, j) => (
                            <div
                              key={j}
                              style={{
                                fontSize: 6.5,
                                padding: '1.5px 4px',
                                marginBottom: 1,
                                borderRadius: 3,
                                background: ev.color,
                                color: ev.textColor,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                transition: 'transform 0.2s',
                                transform:
                                  ev === TARGET_EVENT && phase === 2
                                    ? 'scale(0.96)'
                                    : 'none',
                              }}
                            >
                              {ev.label}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Reservation Detail View */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#fff',
              opacity: showReservation ? 1 : 0,
              transform: showReservation ? 'translateX(0)' : 'translateX(30px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              pointerEvents: showReservation ? 'auto' : 'none',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <div style={{ flex: 1, padding: '14px 20px', overflow: 'hidden' }}>
              <div style={{ marginBottom: 4 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>
                  March 23rd 2026, 1:00 PM
                </h2>
                <div style={{ fontSize: 8.5, color: GOLD, marginTop: 2 }}>
                  ID: 69b865db3b78d3903fd8d623
                </div>
              </div>

              <div
                style={{
                  fontSize: 8,
                  color: '#999',
                  marginBottom: 14,
                  display: 'flex',
                  gap: 16,
                }}
              >
                <span>
                  Last Modified:{' '}
                  <span style={{ color: '#666' }}>March 17th 2026, 9:20 PM</span>
                </span>
                <span>
                  Created: <span style={{ color: '#666' }}>March 16th 2026, 9:19 PM</span>
                </span>
              </div>

              <FormField label="Service" value="Gel Manicure" hasLink />
              <FormField label="Resource" value="Isabelle Morel" hasLink />

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 500, color: '#555', marginBottom: 4 }}>
                  Customer <span style={{ color: '#c00' }}>*</span>
                </div>
                <div
                  style={{
                    border: '1px solid #e0ddd5',
                    borderRadius: 4,
                    padding: '7px 10px',
                    background: '#fdfcfa',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#111' }}>
                    Sarah Martin
                  </div>
                  <div style={{ fontSize: 8, color: '#999' }} suppressHydrationWarning>
                    {`0605935574 \u00b7 sarah.martin@email.com`}
                  </div>
                </div>
              </div>

              <FormField label="Start Time" value="Mar 23, 2026 1:00 PM" hasCalendar />
              <FormField label="End Time" value="Mar 23, 2026 1:45 PM" hasCalendar />

              <div style={{ marginBottom: 12, position: 'relative' }}>
                <div style={{ fontSize: 9, fontWeight: 500, color: '#555', marginBottom: 4 }}>
                  Status
                </div>
                <div
                  style={{
                    border: '1px solid #e0ddd5',
                    borderRadius: 4,
                    padding: '6px 10px',
                    background: '#fdfcfa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 10,
                    color: '#111',
                    fontWeight: 500,
                    transition: 'border-color 0.2s',
                    borderColor: dropdownOpen ? GOLD : '#e0ddd5',
                  }}
                >
                  <span>{statusConfirmed ? 'Confirmed' : 'Pending'}</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span
                      style={{ fontSize: 9, color: '#aaa', cursor: 'pointer', lineHeight: 1 }}
                    >
                      {'\u00d7'}
                    </span>
                    <span style={{ fontSize: 8, color: '#aaa' }}>{'\u25be'}</span>
                  </div>
                </div>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: '35%',
                      background: '#fff',
                      border: '1px solid #e0ddd5',
                      borderTop: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      zIndex: 20,
                      animation: 'fadeDown 0.2s ease',
                    }}
                  >
                    <DropdownOption label="Pending" active={!statusConfirmed} />
                    <DropdownOption
                      label="Confirmed"
                      hovered={phase >= 8 && !statusConfirmed}
                      active={statusConfirmed}
                    />
                    <DropdownOption label="Completed" />
                    <DropdownOption label="Cancelled" />
                    <DropdownOption label="No Show" />
                  </div>
                )}
              </div>

              <div style={{ marginTop: 16, borderTop: '1px solid #e8e5de', paddingTop: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>Items</span>
                  <span style={{ fontSize: 10, color: '#aaa' }}>{'\u22ef'}</span>
                </div>
                <div style={{ fontSize: 8.5, color: '#aaa', marginTop: 4 }}>
                  Resources included in this booking. Leave empty for single resource bookings.
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 8,
                    fontSize: 9,
                    color: '#888',
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: '1px solid #ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                    }}
                  >
                    +
                  </span>
                  Add Item
                </div>
              </div>
            </div>

            <div
              style={{
                width: 160,
                borderLeft: '1px solid #e8e5de',
                padding: '14px 12px',
                background: '#fdfcfa',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, gap: 4 }}
              >
                <div
                  style={{
                    padding: '4px 14px',
                    background: '#f3f1ea',
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 600,
                    color: '#555',
                    border: '1px solid #e0ddd5',
                  }}
                >
                  Save
                </div>
                <div
                  style={{
                    padding: '4px 6px',
                    background: '#f3f1ea',
                    borderRadius: 4,
                    fontSize: 9,
                    color: '#999',
                    border: '1px solid #e0ddd5',
                  }}
                >
                  {'\u22ee'}
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontSize: 18,
                  color: '#999',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                {'\u00d7'}
              </div>

              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 500, color: GOLD, marginBottom: 6 }}>
                  Idempotency Key
                </div>
                <div
                  style={{
                    height: 24,
                    background: '#f5f3ed',
                    borderRadius: 4,
                    border: '1px solid #e8e5de',
                    marginBottom: 14,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      border: '1px solid #d4d0c8',
                      background: '#fff',
                    }}
                  />
                  <span style={{ fontSize: 9, color: '#555' }}>Payment Reminder Sent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated cursor */}
      <div
        style={{
          position: 'absolute',
          left: `${cursorPos.x}%`,
          top: `${cursorPos.y}%`,
          width: 18,
          height: 18,
          pointerEvents: 'none',
          zIndex: 100,
          opacity: cursorVisible ? 1 : 0,
          transition:
            'left 1s cubic-bezier(0.25,0.1,0.25,1), top 1s cubic-bezier(0.25,0.1,0.25,1), opacity 0.3s ease',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 3l14 9.5L12 14l-3.5 7.5L5 3z"
            fill="#111"
            stroke="#fff"
            strokeWidth="1.5"
          />
        </svg>
        {clicking && (
          <div
            style={{
              position: 'absolute',
              top: -3,
              left: -3,
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: `2px solid ${GOLD}`,
              animation: 'clickRipple 0.4s ease-out forwards',
            }}
          />
        )}
      </div>

      {phase === 10 && (
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'toastIn 0.3s ease',
            zIndex: 50,
          }}
        >
          <span style={{ color: '#22c55e' }}>{'\u2713'}</span>
          Status updated to Confirmed
        </div>
      )}

      <style>{`
        @keyframes clickRipple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes fadeDown {
          0% { opacity: 0; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(6px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string
  value: string
  hasLink?: boolean
  hasCalendar?: boolean
}

function FormField({ label, value, hasLink, hasCalendar }: FormFieldProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 9, fontWeight: 500, color: '#555', marginBottom: 4 }}>
        {label} <span style={{ color: '#c00' }}>*</span>
      </div>
      <div
        style={{
          border: '1px solid #e0ddd5',
          borderRadius: 4,
          padding: '6px 10px',
          background: '#fdfcfa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 10,
          color: '#111',
        }}
      >
        <span>
          {value}
          {hasLink && (
            <span style={{ fontSize: 8, color: '#c2a14e', marginLeft: 3 }}>{'\u2197'}</span>
          )}
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {hasCalendar && <span style={{ fontSize: 9, color: '#aaa' }}>{'\ud83d\udcc5'}</span>}
          {!hasCalendar && (
            <>
              <span style={{ fontSize: 9, color: '#aaa' }}>{'\u00d7'}</span>
              <span style={{ fontSize: 8, color: '#aaa' }}>{'\u25be'}</span>
              <span style={{ fontSize: 10, color: '#aaa', marginLeft: 2 }}>+</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface ToolbarBtnProps {
  text: string
  accent?: boolean
}

function ToolbarBtn({ text, accent }: ToolbarBtnProps) {
  return (
    <div
      style={{
        padding: '3px 8px',
        borderRadius: 4,
        fontSize: 9,
        fontWeight: accent ? 600 : 400,
        color: accent ? '#fff' : '#555',
        background: accent ? '#c2a14e' : '#f3f1ea',
        border: accent ? 'none' : '1px solid #e0ddd5',
      }}
    >
      {text}
    </div>
  )
}

interface ViewTabProps {
  text: string
  active?: boolean
}

function ViewTab({ text, active }: ViewTabProps) {
  return (
    <div
      style={{
        padding: '3px 8px',
        borderRadius: 4,
        fontSize: 9,
        fontWeight: active ? 600 : 400,
        color: active ? '#fff' : '#555',
        background: active ? '#555' : 'transparent',
      }}
    >
      {text}
    </div>
  )
}

interface LegendProps {
  color: string
  label: string
}

function Legend({ color, label }: LegendProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <div style={{ width: 7, height: 7, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 7.5, color: '#888' }}>{label}</span>
    </div>
  )
}

interface DropdownOptionProps {
  label: string
  active?: boolean
  hovered?: boolean
}

function DropdownOption({ label, active, hovered }: DropdownOptionProps) {
  return (
    <div
      style={{
        padding: '6px 10px',
        fontSize: 10,
        color: '#333',
        fontWeight: active ? 600 : 400,
        background: hovered ? '#f0ecdf' : active ? '#e8e4d8' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      {label}
    </div>
  )
}
