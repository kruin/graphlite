# Bronwijzigingen v3.1.0-rc.10 build 66

## Snapshot hervat exact op de opgeslagen PLAY-stap

- Het interne snapshotvenster meldt zich pas gereed nadat alle asynchrone
  initialisatie, projectconfiguratie en testdata zijn geladen en de eerste
  render is voltooid.
- Een `.ogn`-snapshot bewaart nog steeds het volledige graphmodel, zodat de
  gebruiker verder kan PLAY-en, maar opent uitsluitend met de afzonderlijk
  opgeslagen zichtbare stap.
- Het door de gebruiker geleverde snapshot van **Hond bijt man** op stap 7 van
  15 is als regressiefixture opgenomen.
- Nieuwe releasecontrole `tools/check_snapshot_resume_step.py` bewaakt zowel
  de inhoud van de fixture als de volgorde van boot, overdracht en herstel.
