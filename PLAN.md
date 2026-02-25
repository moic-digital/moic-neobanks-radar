# Implementation Plan: Google Sheets Data Source + Local Images

## Requirements Restatement

1. **Replace hardcoded card data** (`src/data/cards.ts`) with data fetched from a Google Sheets spreadsheet
2. **Replace external logo URLs** (unavatar.io) with local images from the `Imagens/` folder
3. Only update the data fetching approach - no UI/UX changes

## Current State

- **Data**: 42 cards hardcoded in `src/data/cards.ts` (1,407 lines) with manual `logoUrl()` calls to `unavatar.io`
- **Images**: 42 local images in `/Imagens/` folder (unused)
- **Spreadsheet**: Google Sheets at `17TiduyQc48IbZkDK0o5o1Sv4ndTbt_qPGyn6DsFTmaA` (gid `1350568727`)
- **Issue**: Google Sheets returned 401 (unauthorized) on CSV export - sheet is likely private

## Proposed Architecture

### Approach: Build-time CSV Generation + Static Import

Since the Google Sheet is private (401 on direct access), we have two options:

**Option A - Publish the sheet (Recommended):**
1. Publish the Google Sheet to the web (File > Share > Publish to web > CSV)
2. Use a build-time script (`scripts/sync-cards.ts`) that fetches the published CSV URL and generates `src/data/cards.ts`
3. Run `npm run sync` before builds to refresh data

**Option B - Manual CSV export:**
1. Export the sheet as CSV manually and save as `cards.csv`
2. Use a build-time script that reads `cards.csv` and generates `src/data/cards.ts`
3. Run `npm run sync` whenever the CSV is updated

Both options produce the same result: an auto-generated `src/data/cards.ts` file.

## Implementation Phases

### Phase 1: Move Images to `public/` folder
- Copy all images from `Imagens/` to `public/logos/`
- Normalize filenames (lowercase, consistent naming matching card IDs)
- Create a mapping from card `id` to image filename

**Files affected:**
- `public/logos/` (new directory with copied images)

### Phase 2: Create card data generation script
- Create `scripts/sync-cards.ts` that:
  - Reads `cards.csv` (or fetches from published Google Sheets URL)
  - Parses CSV into structured data
  - Maps each card to its local image path (`/logos/{filename}`)
  - Assigns `cardGradient` and `tierColor` (preserved from current data or derived from a mapping)
  - Outputs `src/data/cards.ts` with properly typed data

**Files affected:**
- `scripts/sync-cards.ts` (new)
- `package.json` (add `sync` script)

### Phase 3: Update data layer
- Regenerate `src/data/cards.ts` from the script
- Each card's `logo` field will point to `/logos/{image-file}` instead of `unavatar.io`
- Keep `cardGradient` and `tierColor` as a separate mapping (since they're not in the spreadsheet)

**Files affected:**
- `src/data/cards.ts` (regenerated)
- `src/data/gradients.ts` (new - mapping of card ID to gradient/tierColor)

### Phase 4: Update Next.js config & image loading
- Remove `unavatar.io` and `ui-avatars.com` from `next.config.ts` remote patterns (no longer needed)
- Update `CryptoCard.tsx` fallback behavior for local images

**Files affected:**
- `next.config.ts`
- `src/components/CryptoCard.tsx` (update `onError` fallback)

## Card ID to Image Mapping

Based on analysis of `Imagens/` folder and `cards.csv`:

| Card ID | Image File |
|---------|-----------|
| nexo-card | Nexo.jpg |
| coinbase-card | Coinbase.png |
| binance-card | Binance.jpg |
| Kripicard | Kripicard.jpg |
| cdc-visa | cryptocom.jpg |
| bybit-card | ByBit.jpg |
| kast-card | Kast.jpg |
| gemini-card | gemini.jpg |
| metamask-card | Metamask.jpg |
| etherfi-card | etherfi.jpg |
| wirex-card | wirex.jpg |
| bitpay-card | bitpay.jpg |
| coca-card | cocawallet.png |
| brighty-card | brightyapp.jpg |
| cypher-card | cypher.jpg |
| venmo-card | venmo.png |
| bitrefill-card | birefill.png |
| whitebit-card | whitebit.jpg |
| wayex-card | wayex.jpg |
| gnosis-card | gnosispay.jpg |
| fold-card | fold.jpg |
| bleap-card | bleap.png |
| bitpanda-card | bitpanda.jpg |
| zypto-card | zyptopay.jpg |
| ledger-card | ledger.jpg |
| tuyo-card | tuyo.jpg |
| redotpay-card | redotpay.jpg |
| tria-card | tria.jpg |
| avici-card | avici.jpg |
| oobit-card | oobit.jpg |
| plutus-card | plutus.jpg |
| deblock-card | deblock.jpg |
| ready-lite | ready.jpg |
| tapx-card | tapx.jpg |
| fiat24-card | fiat24.jpg |
| thorwallet-card | THORWalet.jpg |
| safepal-card | safepal.png |
| ur-card | ur.jpg |
| savepay-card | savepay.jpg |
| imtoken-card | imtoken.jpg |
| tokenpocket-card | tokenpocket.jpg |
| bitgetwallet-card | bitgetwallet.jpg |

## Risks

- **HIGH**: Google Sheet is private (401 error). Need to either publish it or use manual CSV export approach
- **MEDIUM**: `cardGradient` and `tierColor` are not in the spreadsheet - need to maintain a separate mapping
- **LOW**: Image filename mismatches - need careful mapping between card IDs and image files

## Questions for User

1. Can you publish the Google Sheet to the web (for automatic fetching), or should we use the manual CSV export approach?
2. The spreadsheet doesn't contain `cardGradient` and `tierColor` values. Should we maintain these as a separate mapping, or remove them and use a default gradient for all cards?

## Estimated Complexity: MEDIUM
- Phase 1 (Images): ~15 min
- Phase 2 (Script): ~30 min
- Phase 3 (Data layer): ~20 min
- Phase 4 (Config): ~10 min
