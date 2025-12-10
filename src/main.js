import './style.css'
const ready = () => {
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

if (navLinks.length && mobileToggle && navMenu) {
navLinks.forEach(link => {
link.addEventListener('click', () => {
mobileToggle.classList.remove('active')
navMenu.classList.remove('active')
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

if (carouselTrack && slides.length && prevBtn && nextBtn && carouselDots) {
let currentSlide = 0
const totalSlides = slides.length

slides.forEach((_, index) => {
  const dot = document.createElement('button')
  if (index === 0) dot.classList.add('active')
  dot.addEventListener('click', () => goToSlide(index))
  carouselDots.appendChild(dot)
})

const dots = document.querySelectorAll('.carousel-dot')

const updateCarousel = () => {
  slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide))
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide))
}

const goToSlide = index => {
  currentSlide = index
  updateCarousel()
}

const nextSlide = () => {
  currentSlide = (currentSlide + 1) % totalSlides
  updateCarousel()
}

const prevSlide = () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
  updateCarousel()
}

nextBtn.addEventListener('click', nextSlide)
prevBtn.addEventListener('click', prevSlide)

let autoplay = setInterval(nextSlide, 5000)

carouselTrack.addEventListener('mouseenter', () => clearInterval(autoplay))
carouselTrack.addEventListener('mouseleave', () => autoplay = setInterval(nextSlide, 5000))


}

const bookingForm = document.getElementById('bookingForm')

if (bookingForm) {
bookingForm.addEventListener('submit', e => {
e.preventDefault()

  const clientName = document.getElementById('clientName').value.trim()
  const contact = document.getElementById('contact').value.trim()
  const bookingDate = document.getElementById('bookingDate').value
  const bookingTime = document.getElementById('bookingTime').value
  const skinType = document.getElementById('skinType').value
  const makeupStyle = document.getElementById('makeupStyle').value
  const serviceType = document.getElementById('serviceType').value
  const additionalNotes = document.getElementById('additionalNotes').value.trim()

  if (!clientName || !contact || !bookingDate || !bookingTime || !skinType || !makeupStyle || !serviceType) {
    alert('Please fill in all required fields')
    return
  }

 let msg =
'Good day LMR Studio.\n\n' +
'I would like to book a makeup appointment. Here are my details.\n\n' +
'Name: ' + clientName + '\n' +
'Contact: ' + contact + '\n' +
'Date: ' + bookingDate + '\n' +
'Time: ' + bookingTime + '\n' +
'Skin type: ' + skinType + '\n' +
'Makeup style: ' + makeupStyle + '\n' +
'Service: ' + serviceType

if (additionalNotes) {
msg += '\nAdditional notes: ' + additionalNotes
}

msg += '\n\nPlease confirm availability. Thank you.'

  window.open('https://wa.me/22956159805?text=' + encodeURIComponent(msg), '_blank')
  bookingForm.reset()
})


}

const dateInput = document.getElementById('bookingDate')
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0]
}

document.addEventListener('DOMContentLoaded', ready)