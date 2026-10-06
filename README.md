# BOLTLOOP — Suppliers App (Hardware)

Expo + TypeScript + Expo Router app built from Figma (iPhone 12 Pro Max 428×926 base).

## Screens
- Dashboard, Inventory, POS, Payment, Reports (bottom tabs)
- Subs: Inventory add/edit (`/inventory/add`), Checkout (`/pos/checkout`), Confirmation (`/pos/confirmation`)

## Fresh store defaults
- Sales / revenue / orders start at 0. Starter inventory only: Hex Bolt M8 ×50 ($12.50, 24 pcs), Claw Hammer 16oz ($18.99, 36 pcs).
- Persistence: AsyncStorage key `boltloop.store.v1`.

## Run on iPhone (Expo Go)
1. `cd boltloop`
2. `npm install`
3. `npx expo start --tunnel`
4. Install **Expo Go** from App Store, scan QR.

## Verify
- `npx tsc --noEmit`
- `npx expo lint`
- `npx expo-doctor`

## Theme
See `constants/theme.ts` — bg `#CAF7E2`, primary `#386150`, accent `#F59E0B`. No hard-coded values in screens.
