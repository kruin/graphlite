# SOURCE_CHANGES_V2.0.0-rc.6

## Gekozen oplossing

De Bronassen-oplossing is definitief behouden:

- Projectie staat in de bovenbalk.
- Bij `Bron` verschijnt `Assen`.
- LEX, SYNT en LOG zijn daar onafhankelijk combineerbaar.
- De projectie- en askeuzes veranderen viewBox, schaal en boompositie niet.

## Compacte bovenbalk

- Zin, Bijwoord, View en Projectie blijven direct zichtbaar.
- `Assen` verschijnt alleen bij Bron.
- De samenvatting toont op brede schermen ook de gekozen assen; op smalle schermen alleen `Assen`.
- Taal, Help en Config zijn samengebracht in één tijdelijk `Menu` met volledige knopnamen.
- Veldhoogte, padding, tussenruimte en lettergrootte zijn beperkt verkleind, zonder de pulldownopties te verkorten.
- Op smallere schermen verdwijnen alleen de vaste veldlabels; toegankelijke labels en titels blijven bestaan.

## Compatibiliteit

- `source_axes` blijft onderdeel van JSON/configuratie.
- De lokale Bronassen-opslag gebruikt de rc.6-sleutel.
- Syntax blijft de eerste centrale view; FT blijft de tweede; LOG blijft uitsluitend de zuidas.
