# RC38 mobile-layouttest

Doel: de README en de graph blijven bruikbaar op een echte telefoon in
portret en landschap, ook wanneer de interface op Desktop wordt geforceerd.

## README

1. Open `README`.
2. De onderwerpen zijn direct zichtbaar; het navigatiepaneel is niet
   ingeklapt.
3. Portret gebruikt onderwerpen boven en tekst onder.
4. Landschap gebruikt onderwerpen links en tekst rechts.
5. Sleep de scheidingsbalk. Beide panelen moeten aantoonbaar groter of kleiner
   worden en zelfstandig blijven scrollen.

## Mobiele MAX

1. Open Main met `Venstervulling = MAX`.
2. In portret vult het asgebied de beschikbare breedte.
3. In landschap vult het asgebied de beschikbare hoogte.
4. Herhaal portret met `Interface = Desktop`: de fysieke telefoonmaat blijft
   leidend voor de MAX-focus.
5. Inhoud buiten het initiële asgebied blijft bereikbaar met pan en zoom.

## Raster

- Linker rastergrens = LEX-as.
- Rechter rastergrens = SYNT-as.
- Onderste rastergrens = LOG-as.
- Er verschijnt geen extra rasterlijn buiten deze grenzen.

Geautomatiseerd:

```text
python tools/check_mobile_layout_rc38.py
node tools/check_mobile_layout_runtime.js http://127.0.0.1:8088/
```
