# Discover Mabini — Batangas Tourism Guide

A responsive tourism information website for Mabini, Batangas, built with separate HTML, CSS, and JavaScript files.

## Files
- `index.html` — page structure and content
- `style.css` — responsive layout, colors, image fallbacks, and animation
- `script.js` — search, attraction filters, destination details, trip planner, browser storage, and demo admin tools
- `functions/api/chat.js` — server-side Gemini chat endpoint for Cloudflare Pages

## Features
- Tourism homepage headed **“Birthplace of the Philippine Scuba Diving Industry”**
- Searchable attraction cards and category filters
- Destination detail panels with Google Maps search links
- Location-aware half-day, one-day, and two-day itinerary suggestions with local access and booking checks
- History, travel tips, and responsible-tourism guidance
- Browser-based demo attraction manager
- Attraction categories for diving, hiking, beaches, stays, culture, snorkeling, island hopping, food, and viewpoints
- Floating Mabini-focused AI travel assistant with suggested questions and conversation context
- Local photos from `img/` for the hero, feature panels, and destination cards
- Inline SVG image fallback if an attraction photo fails to load
- Migration of older browser-saved attraction cards to the updated destination names and photos

## Updated featured locations
- Anilao dive sites
- Mt. Gulugod Baboy
- Plaza, Mabini
- Mabini coastal resorts
- Masasa Beach, Tingloy (a nearby island destination)
- Anilao Port

## Run locally
Destination photographs are loaded from the local `img/` folder, so keep that folder alongside the website files. Opening `index.html` directly (`file://`) only enables the small local FAQ. To use the full AI and live search locally:

1. Create Gemini and Tavily API keys using the links below.
2. Create a `.dev.vars` file in the repository root (it is ignored by Git) containing:
   ```text
   GEMINI_API_KEY=your-gemini-key
   TAVILY_API_KEY=your-tavily-key
   ```
3. Run `npx wrangler pages dev .` from the repository root and open the local URL Wrangler prints. Do not commit or share `.dev.vars`.

## Publish with Cloudflare Pages and enable chat
The chat uses Google's Gemini 2.5 Flash API for broad multilingual answers and Tavily Search for live web grounding, through a Cloudflare Pages Function. Tavily currently offers 1,000 free search credits per month with no credit card required; each basic search uses 1 credit, so this implementation uses one search credit per customer question. Gemini's free tier and model availability have separate changing limits. Review the current [Tavily credits and pricing](https://docs.tavily.com/guides/api-credits) and [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) before deployment. Neither free tier is unlimited.

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey). Follow Google's [API key security guidance](https://ai.google.dev/gemini-api/docs/api-key) and restrict the key to the Gemini API where the key/project settings allow it.
2. Create a Tavily API key at [Tavily](https://app.tavily.com/).
3. In Cloudflare, create a **Pages** project connected to this Git repository. Use the repository root as the project root, leave the build command blank, and set the build output directory to `.` so Cloudflare deploys the static files and the `functions/` directory.
4. In the Pages project settings, add `GEMINI_API_KEY` and `TAVILY_API_KEY` as encrypted secrets for the production environment. Add them separately for preview deployments only if those previews should have working chat.
5. Deploy or redeploy the project. Open the deployed site and test the “Ask Mabini” chat button.
6. Monitor both providers' usage and configure a Cloudflare rate-limiting rule for `POST /api/chat` before sharing the site widely. Every user question currently makes one live-search request as well as one AI request.

Both API keys are read only by the server function and must never be added to `index.html`, `script.js`, or other public files. Google's free-tier terms may allow submitted prompts and responses to be used to improve its products. The chat UI warns users not to share personal information. Each deployed response is grounded in a fresh Tavily web search, and the interface displays links to the search sources used. The assistant is instructed to reply in the language of the customer's latest message, including Filipino/Tagalog and mixed Filipino-English. It can answer a broad range of questions but cannot guarantee that every search result is correct or that every question has a reliable answer; visitors should verify important information with original sources and local operators. The local guide includes the public-transport connection via Batangas City and the Batangas–Mabini jeepney route, based on the [Wikivoyage Anilao/Mabini travel guide](https://en.wikivoyage.org/wiki/Anilao); route details, departures, and fares should still be reconfirmed locally.

## Important
The admin interface is a front-end demonstration. Changes are stored in the current browser only; the project does not include secure authentication, a shared database, live reservations, or verified real-time prices. AI responses and web results can be wrong or out of date. For travel, verify boat schedules, trail access, operating hours, prices, weather, and availability with local authorities or operators. Itinerary suggestions do not promise these details either.
