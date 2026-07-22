# AUTOMATIC_POST_PUSH_RESET_TEST — v2.0.0-rc.13

## Contract

- Geen `choice`-vraag in `publish_checked.bat`.
- Automatische reset alleen na een geslaagde push.
- Geen reset bij `no changes`, lege staging of pushfout.
- Een lokale versiemarker voorkomt herhaald openen voor dezelfde versie.
- Reset- en index-URL gebruiken de waarde uit `VERSION.txt`.
- Releasezipnaam wordt dynamisch uit `VERSION.txt` opgebouwd.

## Statische controles

Uitgevoerd via de releasecontrole en aanvullende zoekcontroles op de BAT.
Een echte GitHub-push is in de bouwomgeving niet uitgevoerd.
