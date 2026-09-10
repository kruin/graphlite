# Source changes v3.1.0-rc.10 · build 64

- Snapshot openen gebruikt twee expliciete gebruikersstappen: eerst het bestand
  kiezen, daarna via de groen gemarkeerde knop **Open in nieuw venster** het
  nieuwe venster starten. Bestandskiezer en popup hebben daardoor elk hun eigen
  geldige activeringsklik.
- Een lees- of validatiefout sluit het nieuwe venster niet meer onmiddellijk.
  De fout blijft zichtbaar in dat venster, in de hoofdinterface en in de
  browserconsole.
- Een gesloten snapshotvenster en een ontbrekende bestandskiezer krijgen een
  afzonderlijke, begrijpelijke melding.
