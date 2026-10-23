# Dhabalogy QR Menu

A phone-only QR menu web app: welcome screen → menu browsing (search, sticky categories, specials feature) → dish details → personal selection list. No build step, no framework; plain HTML, CSS and JavaScript.

## Live site

- Public URL (for the QR code): **https://dhabalogy-menu.vercel.app/**
- Hosting: Vercel project `dhabalogy-menu`, deployed from the GitHub repository `milindbedwa/dhabalogy-menu` (branch `main`). Every push to `main` redeploys automatically.
- Print-ready QR code: `qr/dhabalogy-menu-qr.png` (teal on ivory, error-correction level Q so it survives a logo overlay or light wear).

To publish a menu change: edit `js/menu-data.js`, then

```bash
git add -A && git commit -m "Update menu" && git push
```

## Run it locally

Serve the folder with any static server and open it on a phone, e.g.

```bash
python3 -m http.server 8765
```

then visit `http://<your-computer-ip>:8765/` from a phone on the same Wi-Fi. For production, upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel) and point the QR code at the URL.

Fonts load from Google Fonts (Yatra One for painted-signboard headings, Mukta for body text). If the venue's connection is poor, download both and self-host them in `assets/`.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Markup for the three screens and the bottom sheets |
| `css/styles.css` | All styling, design tokens at the top of the file |
| `js/app.js` | Behaviour: routing, search, scroll-spy, sheets, selection, persistence |
| `js/menu-data.js` | **All menu content.** Edit this file to change dishes, prices, images and seasonal sections |
| `assets/` | Logo (transparent PNG keyed from the posters), artwork crops, favicon |

## Updating the menu

Everything shown comes from `js/menu-data.js`. The file explains its own shape at the top. In short:

- **Change a price**: find the dish and edit `price`.
- **Add a dish**: add `{ name: "…", price: 123 }` to a category's `items` array. Optional fields: `note` (serving note), `sub` (second line), `choices` (stated options), `includes` (thali contents), `image`, `tag`.
- **Hide or show a seasonal section**: flip `visible: true/false` on the entry in `seasonal`. The Navratri feature banner at the top of the menu hides itself automatically when its section is hidden.
- **Reorder categories**: reorder the entries in `categories`.
- **Add a photo**: put the image in `assets/` and set `image: "assets/your-file.jpg"` on the dish. Dishes with an image render as larger featured cards.
- **Change the feature banner**: edit `featureBanner`.

Stable ids are generated from the section id and dish name. Customers' saved selections reference these ids, so renaming a dish simply drops it from any saved selection on their phone.

## What was verified

- Welcome → Explore Menu → category chips → dish sheet → Add → selection bar → selection sheet → quantity edit → remove → clear → back to menu, all working in the browser.
- Selection survives a page refresh (stored in `localStorage` under `dhabalogy.selection.v1`).
- Layout checked at 320 × 568, 390 × 844 and desktop width; no horizontal overflow. The welcome button is visible without scrolling at 320 × 568.
- Prices in the data file match the references, including the eight examples in the brief (Satvik Thali ₹599, Cheela ₹280, Cutlets ₹310, Khichdi ₹280, Malpua ₹350, Kullad Chai ₹40, Kullad Coffee ₹65, Cold Coffee ₹185).

## Flagged for the restaurant (not invented, left as in source)

- **Veg Thali ₹490** is on the printed menu with a photo but no list of contents, so the app shows only the name and price.
- **Mineral Water** is "As per MRP" on the card; it can be selected but is not counted in the subtotal.
- **Navratri posters say "High Protein"**; that nutritional claim is not repeated in the app.
- **Seasonal availability**: both Navratri and Winter sections are visible by default so the owner can see them. Each carries the note "please check availability with your server". Set `visible: false` to retire one.
- **Winter card spelling** is kept as printed (e.g. "Aalan ki Bhaji" and "Aalani ki Bhaji" both appear on the card; "Kali Udar Daal").
- **Obvious print typos were normalised**: Frenche Fries → French Fries, Waffels → Waffles, Pineappe → Pineapple, Margerita → Margarita, Sizzeling → Sizzling. Everything else, including transliterations like "Namkin", "Childa", "Maalpua", is as printed.
- **Chole Bhature and Poori Bhaji** appear in both "Back to School / Nashta" and "Ek Se Bhale Do" on the card, at the same prices; both placements are kept.
- The Hindi note on the Pizza/Pasta panel is shown in English: "Pizza and pasta made in pure desi ghee are available on special request."
- The phone number on the dancers poster is not shown; the address line is.

## Imagery still needed

Only the five Navratri dishes have artwork (cropped from the supplied posters). Everything else uses the branded placeholder (mustard arch + lotus) in the detail sheet and no thumbnail in the list. Good candidates for photography or matching illustrations, in priority order:

1. Veg Thali (₹490) and the Ek Se Bhale Do mini meals
2. Kullad Masala Chai / Kullad Coffee (brand-defining)
3. Dahi Ke Kababjade, Dhaba Kabab, Paneer Bhatti (starters)
4. Dahi Wale Gatte, Ker Sangari, Dhabe Wali Daal (regional mains)
5. Shahi Tukda, Doodh Jalebi, Kesariya Kheer (desserts)

Shoot on brass thalis against the ivory/sky/coral palette, or illustrate in the same painted folk style as the posters, then add the file path to the dish's `image` field.
