# Source changes v2.0.0-rc.36

- Config start op `Basis & extra’s`.
- `OGN Basis` is het standaardprofiel.
- De eerste optionele uitbreiding is `Bijwoorden`; deze staat standaard uit.
- Basis filtert featurevoorbeelden en schakelt bijwoorddata, LOG-minors,
  LEX-inserties, profielen, bediening en rendering uit.
- Featuregebonden Help-onderwerpen, configuratievelden en standalone
  editorinhoud volgen dezelfde profielkeuze.
- OPN en Legacy JSON bevatten profielmetadata en laten uitgeschakelde
  featurevelden weg.
- Import van documenten die een uitgeschakelde uitbreiding vereisen stopt
  met een gerichte melding.
- Nieuwe regressiecontrole: `tools/check_feature_profiles.py`.
