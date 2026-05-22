# ChoDesign Premium Portfolio Website

A fully responsive, futuristic, luxury portfolio website for ChoDesign.

## What changed in this version

- Rebuilt with the provided black/gold futuristic reference style.
- Cleaned up scrolling to avoid the buggy pinned-scroll behavior.
- Uses stable Lenis smooth scrolling without ScrollTrigger pinning.
- Added a realistic Three.js gold geometric hero background.
- Improved card styling, bento layout, glow treatment, and professional hierarchy.
- All **Start Your Order** buttons redirect to:

```txt
https://cracked.st/ChoDesign
```

- Thread cards now use `object-fit: contain` inside fixed bordered frames so the full thread artwork stays visible and does not overflow.
- Updated signatures:
  - 9Tails: `https://i.ibb.co/zWFynDzw/9-TAILSIGG.gif`
  - Atlas: `https://i.ibb.co/bY3gYT9/atlas-sig2.gif`

## Folder structure

```txt
chodesign-atelier-premium/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── data.js
    │   ├── three-scene.js
    │   └── main.js
    └── images/
        └── README.md
```

## Deployment

Upload the full folder to Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static web host.

## Notes

The portfolio images are loaded from the direct ImageBB links inside `assets/js/data.js`.
To host images locally later, download the images into `assets/images/` and replace the `src` values in `data.js`.
