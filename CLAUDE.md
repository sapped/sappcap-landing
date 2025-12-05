# CLAUDE.md - Project Context for AI Assistant

## Project Overview
Sapp Capital Advisors landing page - Commercial Real Estate advisory services

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linting
- `npm run typecheck` - Check TypeScript types

## Current Branch: `uw-redesign`
**Purpose:** Redirect all CTAs to the new underwriting site at https://underwriting.sapp.capital

**Changes Made:**
- Updated all "Get Your Deal Reviewed" / "Claim Your Strategy Session" buttons to "Let's Connect"
- Changed all cal.com/sappcapital links to https://underwriting.sapp.capital
- Updated floating CTA component
- Updated /book redirect
- Removed "Schedule an Appointment" from nav (desktop & mobile)
- Added "Templates" nav item → https://underwriting.sapp.capital/docs/multifamily
- Added "See our model templates" link to Bulletproof Modeling service card

## TODO List

### High Priority
- [ ] **Lead Magnet Implementation** - Create downloadable resource "7 Fatal Modeling Errors That Kill Deals" with email capture form
  - Add email capture modal/popup
  - Create PDF resource
  - Set up email automation
  - Add exit-intent trigger
  - Track conversion rates

### Future Enhancements
- [ ] Add case studies section (anonymized)
- [ ] Implement A/B testing for headlines
- [x] Add client testimonials
- [ ] Create tiered service offerings page
- [ ] Add blog integration from blog.sapp.capital

## Adding Client Testimonials

Source files are stored in OneDrive:
- **Logos:** `/Users/Ed/Library/CloudStorage/OneDrive-SharedLibraries-DemographIQ/SCA - Documents/Workstream Tracker/client logos/`
- **URLs CSV:** Same folder, `client URLs.csv`

### Steps to add a new testimonial:

1. **Add logo to source folder** - Any format (PNG, WEBP, etc.). White-on-transparent works best for dark mode.

2. **Update the CSV** with client name and website URL

3. **Copy logo to project:**
   ```bash
   cp "/Users/Ed/Library/CloudStorage/OneDrive-SharedLibraries-DemographIQ/SCA - Documents/Workstream Tracker/client logos/[logo-file]" public/clients/[client-name]-logo.[ext]
   ```

4. **Add TestimonialCard in `app/page.tsx`** inside the testimonials grid:
   ```tsx
   <FadeIn delay={N00}>
     <TestimonialCard
       quote="The testimonial quote text"
       name="Contact Name"
       title="Their Title"
       company="Company Name"
       logo="/clients/[client-name]-logo.[ext]"
       url="https://their-website.com/"
     />
   </FadeIn>
   ```

5. **Adjust grid columns** if needed:
   - 2 testimonials: `md:grid-cols-2 max-w-4xl`
   - 3 testimonials: `md:grid-cols-3 max-w-6xl`
   - 4+ testimonials: Consider `md:grid-cols-2 lg:grid-cols-4` or stacking rows

## Project Structure
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Dark mode support
- Mobile responsive
- Cal.com integration for booking

## Key Metrics to Track
- Booking conversion rate
- Email capture rate
- Time on page
- Bounce rate
- Mobile vs desktop conversions