# always.shannu

An original, responsive birthday experience made by Vijay Kumar for Shannu.

## Experience

- Live birthday lock opening at local midnight on 11 October 2026
- Sealed envelope and constellation opening
- Relationship timeline and animated Mango Tree Resort memory
- Two personal Shannu portraits placed in the birthday note and memory scene
- Ten interactive reasons, six romantic/funny questions, and five balloon wishes
- Questionnaire answers saved locally and sent to Vijay through FormSubmit after Shannu confirms
- Native phone sharing for WhatsApp, Messages, or Gmail, plus a copy-to-clipboard fallback
- In-browser "Happy Birthday, Shannu" melody with personalized lyrics
- Typewritten letter, candle wish, confetti, and fireworks finale
- Keyboard, touch, reduced-motion, desktop, and mobile support

## Preview

Start a static server from this folder:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open the public countdown:

```text
http://127.0.0.1:4173/
```

Private preview for Vijay:

```text
http://127.0.0.1:4173/?preview=vijay
```

The small "Vijay's preview" link on the countdown also accepts `Vijay` as its answer. Do not include the preview query when sharing the final link.

## Deploy

This is a static site with no build step. Deploy the repository root to GitHub Pages, Netlify, or Vercel. Share the generated root URL so the birthday lock remains active.

The Google Fonts, Lucide icons, and confetti effect use public CDNs. The core story, countdown, canvases, quiz, cake, balloons, generated melody, and final reveal work from the three local source files.

The answer email uses FormSubmit. On the first real submission, `vijaykumara2003@gmail.com` receives an activation message that Vijay must approve once. After activation, future submissions are delivered directly.

If FormSubmit is blocked by the visitor's network, the questionnaire provides a prefilled email-app fallback containing all six saved answers and the personal note.