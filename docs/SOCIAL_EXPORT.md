# Graph en Play publiceren

`Config → Opslaan & exporteren` opent direct op de prominente exportkaart.

## Stilstaand beeld

- `LinkedIn-PNG` maakt een witte afbeelding van `1200 × 627` pixels
  (`1,91:1`) voor een beeldbijdrage.
- `Graph als SVG` bewaart de volledige actuele graph als zelfstandig
  vectorbestand voor verdere bewerking of drukwerk.
- De actieve zin staat al boven de graph. Voeg bij de LinkedIn-bijdrage ook
  alternatieve tekst toe.

## Play-video

`Play-video` doorloopt automatisch de volledige gefaseerde Play-reeks. De
video gebruikt `1200 × 628` pixels en een actief vastgelegde `30 fps`.

De browser kiest in deze volgorde:

1. MP4 met H.264;
2. een andere door de browser aangeboden MP4-variant;
3. WebM met VP9 of VP8 als fallback.

De knop heet daarom niet meer `Play als WebM`, maar `Play-video`. Houd het
browservenster actief totdat de download begint.

## Waarom de oude WebM werd afgekeurd

LinkedIn vermeldt WebM als ondersteund formaat, maar controleert óók de
technische videogegevens. De oude canvasrecorder schreef alleen een frame als
de Play-tekening veranderde. De gecontroleerde rc.24-opname bevatte daardoor
slechts 16 frames over ongeveer 11,8 seconden:

```text
gemeten framerate  circa 2,6 fps
vereist            10–60 fps
gemeten bitrate    circa 105 kbps
vereist            192 kbps–30 Mbps
```

De container was dus WebM/VP9, maar de videostroom voldeed niet aan LinkedIns
ondergrenzen. De uitspraak dat conversie nooit nodig was, was daarom te
stellig.

De nieuwe recorder heeft een framepomp die ook tijdens stilstaande fasen ieder
van de 30 frames per seconde expliciet vastlegt. Daarnaast krijgt MP4/H.264
voorrang wanneer de browser dit kan opnemen.

## Uploaden

1. kies `Een bijdrage starten`;
2. kies `Video`;
3. upload het gedownloade `.mp4`- of `.webm`-bestand;
4. voeg een korte toelichting en alternatieve beschrijving toe;
5. controleer de voorvertoning en publiceer.

Als de browser alleen WebM kan maken en LinkedIn dat concrete bestand alsnog
afwijst, converteer het dan naar MP4/H.264 met een vaste framerate. MP4 is dus
de voorkeursuitvoer; WebM is alleen de browserfallback.

Actuele LinkedIn-bronnen:

- <https://www.linkedin.com/help/linkedin/answer/a564109>
- <https://www.linkedin.com/help/linkedin/answer/a548372>
