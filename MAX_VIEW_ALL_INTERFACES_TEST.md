# MAX_VIEW_ALL_INTERFACES_TEST

Controleer v2.0.0-rc.19 in vier standen:

1. Interface → Automatisch.
2. Interface → Desktop.
3. Interface → Mobiel staand.
4. Interface → Mobiel liggend.

Per stand:

- open Syntax met LEX + SYNT + LOG;
- wissel naar FT;
- schakel projecties afzonderlijk uit en weer aan;
- controleer dat niets wordt afgesneden;
- controleer dat de graph de beschikbare breedte maximaal benut;
- controleer dat de oude lege onderstrook in mobile portrait ontbreekt;
- controleer dat viewBox, x, y en schaal niet springen bij projectiewissels;
- draai een echte telefoon tussen portrait en landscape en controleer dat opnieuw wordt gefit.

Verwacht:

- mobile portrait is smaller/hoger gerangschikt dan landscape;
- mobile landscape is breed/lager;
- Automatisch volgt de werkelijke oriëntatie;
- Desktop gebruikt een strakke volledige fit met minimale veiligheidsrand.
