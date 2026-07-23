# Source changes — v2.0.0

## Status

`v2.0.0` is de definitieve release die volgt op `v2.0.0-rc.25`.

## Functionele bron

De viewerfunctionaliteit van rc.25 is ongewijzigd overgenomen, waaronder:

- Syntax en Functional als centrale views;
- LEX, SYNT en LOG als west-, oost- en zuidprojecties;
- responsieve desktop-, portrait- en landscape-layout;
- direct meegroeien van gekozen projecties;
- compacte Config met toelichting per instelling;
- LEESMIJ/README en JaN-TODO;
- bestaande lokale config-save-werkwijze.

## Veilige lokale Git-update

Toegevoegd:

- `LOCAL_GIT_SAFE_WORKFLOW.md`;
- `prepare_release_clone.bat`;
- `promote_release_clone.bat`;
- `recover_git_bundle.bat`.

De nieuwe werkwijze beschermt `C:\git\graphlite\.git` door een release eerst in een zelfstandige `graphlite-next`-clone te installeren en testen. Voor elke update en promotie wordt een herstelbaar Git-bundle gemaakt. Geen van de scripts voert `git pull`, automatische commits, automatische pushes, force-pushes of automatische verwijdering van bestaande repositories uit.

## Versie

Alle actieve app-, cache-, manifest-, README- en projectstatusverwijzingen zijn bijgewerkt van `v2.0.0-rc.25` naar `v2.0.0`.
