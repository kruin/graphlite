# Directe GitHub-werkwijze GraphLite

Deze werkwijze volgt het praktische model van 3B: wijzigingen gaan rechtstreeks
via GitHub; er is geen download/ZIP-stap nodig om een wijziging te testen.

## Test

- Publieke testpagina: `https://kruin.github.io/graphlite/test.html`
- Testcode: `viewer-test.js`
- Productiecode blijft: `viewer.js`
- `test.html` gebruikt dezelfde publieke data, styles en configuratie als Main,
  maar laadt `viewer-test.js`.
- Wijzigingen worden eerst in de testcode opgenomen en via GitHub Pages getest.

Voorbeeld:

```text
https://kruin.github.io/graphlite/test.html?item=hond-bijt-man
```

## Promotie naar productie

Na akkoord:

1. kopieer de geteste wijziging van `viewer-test.js` naar `viewer.js`;
2. werk build/source-label en relevante documentatie bij;
3. controleer Main op `https://kruin.github.io/graphlite/`;
4. houd `test.html` beschikbaar voor de volgende wijziging.

## Testmateriaal en tijdsvorm

Een testmateriaalitem is canoniek. Voor `hond-bijt-man` is de basisvorm:

```text
HOND BIJT MAN
```

OTT/OVT/VTT/VVT zijn varianten binnen de tijdsfamilie en worden apart gekozen via
het menu **Tijd**. Een expliciete keuze van het testmateriaalitem reset de eenvoudige
tijdsfamilie naar de standaardtijd van dat item. Oude directe alias-URL's zoals
`hond-heeft-man-gebeten` blijven hun expliciet gevraagde tijdsvorm behouden.

Dit voorkomt dat een eerder lokaal gekozen VTT-vorm wordt aangezien voor de naam
van het testmateriaalitem.


## Huidige status

De directe GitHub-testwerkwijze is ingericht. Productie wordt pas aangepast nadat
`test.html` aantoonbaar via GitHub Pages werkt en inhoudelijk is goedgekeurd.


## Gevalideerde werkwijze

Op 1 november 2026 is de directe GitHub-route voor GraphLite end-to-end gevalideerd:

`wijzigen in GitHub → test.html → akkoord → productie`.

De wijziging rond `hond-bijt-man` en de afzonderlijke tijdvariant is zowel op test
als op productie gecontroleerd en akkoord bevonden. Voor vergelijkbare wijzigingen
is een ZIP/downloadronde daarom niet meer de standaardroute.

