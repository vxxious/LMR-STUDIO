document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle')
  const navMenu = document.getElementById('navMenu')
  const navLinks = document.querySelectorAll('.nav-link')
  const navbar = document.getElementById('navbar')

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active')
      navMenu.classList.toggle('active')
    })
  }

  if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileToggle) mobileToggle.classList.remove('active')
        if (navMenu) navMenu.classList.remove('active')
      })
    })
  }

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) navbar.classList.add('scrolled')
      else navbar.classList.remove('scrolled')
    })
  }

  const carouselTrack = document.getElementById('carouselTrack')
  const prevBtn = document.getElementById('prevBtn')
  const nextBtn = document.getElementById('nextBtn')
  const carouselDots = document.getElementById('carouselDots')
  const slides = document.querySelectorAll('.carousel-slide')

  if (carouselTrack && prevBtn && nextBtn && carouselDots && slides.length) {
    let currentSlide = 0
    const totalSlides = slides.length

    slides.forEach((_, index) => {
      const dot = document.createElement('button')
      dot.classList.add('carousel-dot')
      if (index === 0) dot.classList.add('active')
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`)
      dot.addEventListener('click', () => goToSlide(index))
      carouselDots.appendChild(dot)
    })

    const dots = document.querySelectorAll('.carousel-dot')

    function updateCarousel() {
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide)
      })
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide)
      })
    }

    function goToSlide(index) {
      currentSlide = index
      updateCarousel()
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides
      updateCarousel()
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
      updateCarousel()
    }

    nextBtn.addEventListener('click', nextSlide)
    prevBtn.addEventListener('click', prevSlide)

    let autoplayInterval = setInterval(nextSlide, 5000)

    carouselTrack.addEventListener('mouseenter', () => clearInterval(autoplayInterval))
    carouselTrack.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(nextSlide, 5000)
    })
  }

  const bookingForm = document.getElementById('bookingForm')

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const clientName = document.getElementById('clientName')?.value.trim() || ''
      const contact = document.getElementById('contact')?.value.trim() || ''
      const bookingDate = document.getElementById('bookingDate')?.value || ''
      const bookingTime = document.getElementById('bookingTime')?.value || ''
      const skinType = document.getElementById('skinType')?.value || ''
      const makeupStyle = document.getElementById('makeupStyle')?.value || ''
      const serviceType = document.getElementById('serviceType')?.value || ''
      const additionalNotes = document.getElementById('additionalNotes')?.value.trim() || ''

      if (!clientName || !contact || !bookingDate || !bookingTime || !skinType || !makeupStyle || !serviceType) {
        alert('Please fill in all required fields')
        return
      }

      let whatsappMessage =
        `Hello LMRSTUDIO, I would like to book an appointment.\n\n` +
        `Name: ${clientName}\n` +
        `Contact: ${contact}\n` +
        `Date: ${bookingDate}\n` +
        `Time: ${bookingTime}\n` +
        `Skin Type: ${skinType}\n` +
        `Makeup Style: ${makeupStyle}\n` +
        `Service Type: ${serviceType}\n`

      if (additionalNotes) whatsappMessage += `Notes: ${additionalNotes}\n`

      whatsappMessage += `\nPlease confirm my booking. Thank you.`

      const encodedMessage = encodeURIComponent(whatsappMessage)
      const whatsappUrl = `https://wa.me/22956159805?text=${encodedMessage}`

      bookingForm.reset()
      window.location.href = whatsappUrl
    })
  }

  const dateInput = document.getElementById('bookingDate')
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0]
    dateInput.setAttribute('min', today)
  }

  const anchors = document.querySelectorAll('a[href^="#"]')
  if (anchors && anchors.length) {
    anchors.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (!target) return
        const navbarHeight = navbar ? navbar.offsetHeight : 0
        const targetPosition = target.offsetTop - navbarHeight
        window.scrollTo({ top: targetPosition, behavior: 'smooth' })
      })
    })
  }

  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.style.opacity = '1'
      entry.target.style.transform = 'translateY(0)'
    })
  }, observerOptions)

  const animatedElements = document.querySelectorAll('.service-card, .pricing-card, .contact-item, .policy-section')
  animatedElements.forEach(el => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    observer.observe(el)
  })
})
