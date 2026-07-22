# MOBILE_FULL_VIEW_TEST

Versie: `v2.0.0-rc.17`

## Statische controles

- `viewportModeSelect` bestaat onder Config.
- `mainInterfaceMenu` en `mainInterfaceOptions` bestaan in het zichtbare topmenu.
- Alle vier interfacewaarden zijn aanwezig in `VIEWPORT_TEST_MODES`.
- Topmenu en Config gebruiken dezelfde state en dezelfde setter.
- `projectionStableFrameBox()` bevat geen oude vaste `2180`/`1120`-reserves.
- `stableProjectionViewBox()` gebruikt mobile-specifieke compacte marges.
- Syntax en FT delen nog steeds dezelfde unie-fitbox.
- LEX, SYNT en LOG delen nog steeds dezelfde unie-fitbox.
- `index.html` en `viewer.html` zijn identiek.
- `node --check viewer.js` en `tools/check_release.py` slagen.

## Browsercontrole

Een Chromium/Playwright-navigatiepoging naar zowel localhost als `file://` werd in deze omgeving geblokkeerd met `ERR_BLOCKED_BY_ADMINISTRATOR`. Daarom wordt geen visuele browsermeting geclaimd. De release bevat wel alle statische en structurele controles.

## Handmatige controle op telefoon

1. Open de viewer na cache-reset.
2. Kies `Interface → Automatisch`.
3. Controleer portrait en landscape.
4. Kies daarna `Mobiel staand` en `Mobiel liggend`.
5. Controleer dat boom + LEX + SYNT + LOG de volledige ruimte onder topmenu en Play-balk gebruiken.
6. Controleer Syntax ↔ FT en alle projectiecombinaties op afwezigheid van verspringing.
