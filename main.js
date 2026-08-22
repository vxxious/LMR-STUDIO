const root = document.documentElement
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')

function getSavedTheme() {
  try {
    return localStorage.getItem('lmr-theme')
  } catch {
    return null
  }
}

function setTheme(theme, persist = false) {
  root.dataset.theme = theme

  const themeToggle = document.getElementById('themeToggle')
  if (themeToggle) {
    const isDark = theme === 'dark'
    themeToggle.setAttribute('aria-pressed', String(isDark))
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`)
  }

  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#0d0b0c' : '#f4efe9')
  if (persist) {
    try {
      localStorage.setItem('lmr-theme', theme)
    } catch {
      // The selected theme still applies for this session if storage is unavailable.
    }
  }
}

function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle')
  setTheme(root.dataset.theme || (systemThemeQuery.matches ? 'dark' : 'light'))

  themeToggle?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true)
  })

  systemThemeQuery.addEventListener('change', event => {
    if (!getSavedTheme()) setTheme(event.matches ? 'dark' : 'light')
  })
}

function initializeNavigation() {
  const navbar = document.getElementById('navbar')
  const mobileToggle = document.getElementById('mobileToggle')
  const navMenu = document.getElementById('navMenu')
  const navShell = navMenu?.closest('.nav-shell') || navMenu
  const navLinks = [...document.querySelectorAll('.nav-link')]

  const normalizePath = path => path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`
  const currentPath = normalizePath(window.location.pathname)
  navLinks.forEach(link => {
    if (!link.getAttribute('href')?.startsWith('/')) return
    const isCurrentPage = normalizePath(new URL(link.href, window.location.origin).pathname) === currentPath
    link.classList.toggle('active', isCurrentPage)
    if (isCurrentPage) link.setAttribute('aria-current', 'page')
  })

  function setMenu(open) {
    mobileToggle?.classList.toggle('active', open)
    navShell?.classList.toggle('active', open)
    mobileToggle?.setAttribute('aria-expanded', String(open))
    mobileToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    document.body.classList.toggle('menu-open', open)
  }

  mobileToggle?.addEventListener('click', () => {
    setMenu(mobileToggle.getAttribute('aria-expanded') !== 'true')
  })

  navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)))

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false)
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1088) setMenu(false)
  })

  const anchorNavLinks = navLinks.filter(link => link.getAttribute('href')?.startsWith('#'))
  const pageSections = [...document.querySelectorAll('main section[id]')]
  if (anchorNavLinks.length && pageSections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visibleSection = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (!visibleSection) return
      anchorNavLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${visibleSection.target.id}`
        link.classList.toggle('active', isActive)
        if (isActive) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }, { rootMargin: '-30% 0px -60%', threshold: [0, 0.2, 0.5] })

    pageSections.forEach(section => sectionObserver.observe(section))
  }

  let frameRequested = false
  const progressBar = document.getElementById('scrollProgress')
  const heroVisual = document.querySelector('[data-parallax]')

  function updateScrollEffects() {
    const scrollTop = window.scrollY
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = scrollableHeight > 0 ? Math.min(scrollTop / scrollableHeight, 1) : 0

    navbar?.classList.toggle('scrolled', scrollTop > 16)
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`

    if (heroVisual && !reducedMotionQuery.matches && scrollTop < window.innerHeight) {
      const parallaxOffset = Math.min(scrollTop * 0.035, 18)
      heroVisual.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`
    }

    frameRequested = false
  }

  function requestScrollUpdate() {
    if (frameRequested) return
    frameRequested = true
    window.requestAnimationFrame(updateScrollEffects)
  }

  updateScrollEffects()
  window.addEventListener('scroll', requestScrollUpdate, { passive: true })
  reducedMotionQuery.addEventListener('change', event => {
    if (event.matches && heroVisual) heroVisual.style.transform = 'none'
    requestScrollUpdate()
  })
}

function initializeReveals() {
  const revealElements = [...document.querySelectorAll('[data-reveal]')]
  if (!revealElements.length) return

  if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.add('is-visible'))
    return
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 })

  revealElements.forEach(element => revealObserver.observe(element))
}

function initializeGallery() {
  const galleryRail = document.getElementById('galleryRail')
  const previousButton = document.getElementById('prevBtn')
  const nextButton = document.getElementById('nextBtn')
  if (!galleryRail || !previousButton || !nextButton) return

  function getScrollDistance() {
    return Math.max(galleryRail.clientWidth * 0.72, 320)
  }

  function scrollGallery(direction) {
    galleryRail.scrollBy({
      left: getScrollDistance() * direction,
      behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
    })
  }

  previousButton.addEventListener('click', () => scrollGallery(-1))
  nextButton.addEventListener('click', () => scrollGallery(1))

  let frameRequested = false
  function updateControls() {
    const maxScroll = galleryRail.scrollWidth - galleryRail.clientWidth
    previousButton.disabled = galleryRail.scrollLeft <= 2
    nextButton.disabled = galleryRail.scrollLeft >= maxScroll - 2
    frameRequested = false
  }

  galleryRail.addEventListener('scroll', () => {
    if (frameRequested) return
    frameRequested = true
    window.requestAnimationFrame(updateControls)
  }, { passive: true })

  window.addEventListener('resize', updateControls)
  updateControls()
}

function initializeLegacyGallery() {
  const carouselTrack = document.getElementById('carouselTrack')
  const previousButton = document.getElementById('prevBtn')
  const nextButton = document.getElementById('nextBtn')
  const dotsContainer = document.getElementById('carouselDots')
  const slides = carouselTrack ? [...carouselTrack.querySelectorAll('.carousel-slide')] : []
  if (!carouselTrack || !previousButton || !nextButton || !slides.length) return

  let currentIndex = Math.max(slides.findIndex(slide => slide.classList.contains('active')), 0)
  const dots = slides.map((_, index) => {
    if (!dotsContainer) return null
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.className = 'carousel-dot'
    dot.setAttribute('aria-label', `View portfolio image ${index + 1}`)
    dot.addEventListener('click', () => showSlide(index))
    dotsContainer.appendChild(dot)
    return dot
  })

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex
      slide.classList.toggle('active', isActive)
      slide.setAttribute('aria-hidden', String(!isActive))
      if (!isActive) slide.querySelector('video')?.pause()
    })
    dots.forEach((dot, dotIndex) => {
      dot?.classList.toggle('active', dotIndex === currentIndex)
      dot?.setAttribute('aria-current', dotIndex === currentIndex ? 'true' : 'false')
    })
  }

  previousButton.addEventListener('click', () => showSlide(currentIndex - 1))
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1))
  carouselTrack.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showSlide(currentIndex - 1)
    if (event.key === 'ArrowRight') showSlide(currentIndex + 1)
  })

  carouselTrack.tabIndex = 0
  showSlide(currentIndex)
}

function getFormValue(id) {
  const field = document.getElementById(id)
  return field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement
    ? field.value.trim()
    : ''
}

function initializeBookingForm() {
  const bookingForm = document.getElementById('bookingForm')
  const dateInput = document.getElementById('bookingDate')

  if (dateInput instanceof HTMLInputElement) {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    dateInput.min = `${year}-${month}-${day}`
  }

  if (!(bookingForm instanceof HTMLFormElement)) return

  bookingForm.addEventListener('submit', event => {
    event.preventDefault()
    if (!bookingForm.reportValidity()) return

    const details = {
      name: getFormValue('clientName'),
      contact: getFormValue('contact'),
      date: getFormValue('bookingDate'),
      time: getFormValue('bookingTime'),
      skinTone: getFormValue('skinType'),
      style: getFormValue('makeupStyle'),
      service: getFormValue('serviceType'),
      notes: getFormValue('additionalNotes'),
    }

    const messageLines = [
      'Hello LMR Studio, I would like to request an appointment.',
      '',
      `Name: ${details.name}`,
      `Contact: ${details.contact}`,
      `Date: ${details.date}`,
      `Time: ${details.time}`,
      `Skin tone: ${details.skinTone}`,
      `Makeup style: ${details.style}`,
      `Service: ${details.service}`,
    ]

    if (details.notes) messageLines.push(`Notes: ${details.notes}`)
    messageLines.push('', 'Please confirm availability and deposit details. Thank you.')

    const whatsappUrl = `https://wa.me/22956159805?text=${encodeURIComponent(messageLines.join('\n'))}`
    window.location.assign(whatsappUrl)
  })
}

function initializeFooter() {
  const year = document.getElementById('currentYear')
  if (year) year.textContent = String(new Date().getFullYear())
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme()
  initializeNavigation()
  initializeReveals()
  initializeGallery()
  initializeLegacyGallery()
  initializeBookingForm()
  initializeFooter()
})
