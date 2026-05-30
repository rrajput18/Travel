# Travelगुरु (TravelGuru) - Modernized Travel Agency Website

Welcome to **Travelगुरु**, a modern, fully responsive, and interactive travel agency website. This project upgrades a legacy desktop layout into a premium, fluid experience optimized across mobile, tablet, laptop, and desktop viewports, while strictly preserving the brand's original light sky-blue and white theme.

🌐 **Live Demo**: [https://travelguru99.netlify.app/](https://travelguru99.netlify.app/)

---

## 🚀 Key Features

### 1. 📱 Fluid Responsive Design
- **Mobile Hamburger Menu**: Header collapses into a logo and a smooth sliding drawer menu on viewports under `768px`. Includes click-outside and link-click auto-dismissal.
- **Modern Auto-Grid Layouts**: Completely refactored layouts (e.g. destination grids and package boxes) to use modern CSS Flexbox and Auto-Fitting Grid layouts.
- **Fluid Sizing**: Implemented layout paddings, font sizes, and container widths that scale dynamically with viewport resizing.

### 2. ⚡ Live API Integrations
Clicking on any popular destination card triggers asynchronous queries to public REST APIs to load real-time facts inside a detail modal:
- **RestCountries API**: Dynamically retrieves the country's capital, languages, currency name & symbol, and total population.
- **Open-Meteo Weather API**: Retrieves real-time local weather temperatures (Celsius) and wind speeds (km/h) for the destination's coordinates.

### 3. 🎫 Dynamic Booking Modal System
- Functional **Book Now** buttons launch a custom modal specifying the package's base price.
- Live cost calculator multiplying base fare by travelers count.
- Minimum travel date validation (restricts booking prior departure dates).
- Client-side mock reservation loader displaying a visual loading spinner (`Confirming Reservation...`) before closing the modal and launching a personalized toast success banner.

### 4. 💫 Micro-Animations & Interactivity
- **Scroll Progress Ring**: Floating back-to-top button with a circular SVG progress track indicating scroll percentage. On click, executes a smooth scroll-to-top.
- **Reveal on Scroll**: Intersection Observer tracking scroll visibility to trigger fade-in animations on sections.
- **Accordion FAQs**: Responsive accordion panel allowing slide-toggle questions and answers (auto-collapses other active panels).

---

## 🛠️ Tech Stack
- **Structure**: Semantic HTML5 markup
- **Styling**: Vanilla CSS3 custom design system (CSS variables, CSS grids/flex, media queries)
- **Logic**: Vanilla ES6+ JavaScript (Fetch API, Promises, async/await, IntersectionObserver, Event Listeners)
- **Icons**: FontAwesome & BoxIcons CDN libraries

---

## 📂 Project Structure

```bash
├── index.html          # Homepage with Hero Search, Testimonials, FAQs, and Newsletter
├── package.html        # Packages list with dynamic Booking Modal triggers
├── Destination.html    # Destination page with API-linked country fact cards
├── About.html          # About Us page highlighting founding year, team & mission
├── script.js           # Core JavaScript controller (drawer, modals, scroll tracking, APIs)
├── style.css           # Global custom stylesheet and responsive layout rules
└── Images/             # Local optimized directory for destination cards assets
```

---

## 💻 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rrajput18/Travel.git
   cd Travel
   ```

2. **Run a Local Development Server**:
   Because the destination cards fetch live data via the `fetch` API, running through a local development server is recommended to prevent CORS or file-protocol schema restrictions in some browsers:
   - Using **Python**:
     ```bash
     python -m http.server 3000
     ```
   - Using **NodeJS** (e.g. `serve` or `live-server`):
     ```bash
     npx serve
     ```

3. **Open the App**:
   Navigate to `http://localhost:3000` in your web browser.

---

## 🎨 Theme Guidelines
The design system enforces a strict light-mode-only palette:
- **Background**: Whitesmoke (`whitesmoke`) & White (`#ffffff`)
- **Primary Text**: Dark Charcoal (`hsl(356, 28%, 10%)`)
- **Accent Theme Color**: Sky-Blue (`rgb(46, 133, 233)`)
- **Footer Background**: Accent Light Blue (`rgb(131, 186, 250)`)
- **Transitions**: Smooth animations configured via `var(--transition)`.
