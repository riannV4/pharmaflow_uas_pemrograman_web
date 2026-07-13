'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { TechMarqueeSection } from '@/components/landing/tech-marquee-section'
import { RolesSection } from '@/components/landing/roles-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  const router = useRouter()
  const { user, getDefaultRoute } = useAuth()

  // Redirect ke halaman default berdasarkan role jika sudah login
  useEffect(() => {
    if (user) {
      router.replace(getDefaultRoute())
    }
  }, [user, router, getDefaultRoute])

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4' }}>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TechMarqueeSection />
      <RolesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
