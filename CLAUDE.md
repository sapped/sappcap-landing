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
- [ ] Add client testimonials
- [ ] Create tiered service offerings page
- [ ] Add blog integration from blog.sapp.capital

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