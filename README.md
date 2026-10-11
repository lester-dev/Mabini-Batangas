# Discover Mabini — Batangas Tourism Guide

A responsive tourism information website for Mabini, Batangas, built with separate HTML, CSS, and JavaScript files.

## Files
- `index.html` — page structure and content
- `style.css` — responsive layout, colors, image fallbacks, and animation
- `script.js` — search, attraction filters, destination details, trip planner, browser storage, and demo admin tools

## Features
- Tourism homepage headed **“Birthplace of the Philippine Scuba Diving Industry”**
- Searchable attraction cards and category filters
- Destination detail panels with Google Maps search links
- Sample half-day, one-day, and two-day itinerary generator
- History, travel tips, and responsible-tourism guidance
- Browser-based demo attraction manager
- Inline SVG image fallback if an attraction photo fails to load
- Migration of older browser-saved attraction cards to the updated Tingloy, Plaza, and Anilao Beach content

## Updated featured locations
- Anilao dive sites
- Mt. Gulugod Baboy
- Plaza, Mabini
- Mabini coastal resorts
- Tingloy (a nearby municipality, not part of Mabini)
- Anilao Beach

## Run locally
Open `index.html` in a modern browser. Internet access is needed for the remote Unsplash photographs; the website includes a local inline SVG fallback for failed images.

## Publish with GitHub Pages
1. Open the repository's **Settings → Pages**.
2. Under build and deployment, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then save.
4. Wait for GitHub Pages to finish deploying and open the URL displayed in that settings page.

## Important
The admin interface is a front-end demonstration. Changes are stored in the current browser only; the project does not include secure authentication, a shared database, live reservations, or verified real-time prices. Confirm attraction access, fees, schedules, and contact information with local sources before publishing.
