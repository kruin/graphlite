# Lexicon usage-profile test · v2.0.0-rc.37

## Static checks

1. `lexicon-config.html` contains one lemma entry each for `misschien`, `wel`
   and `vaak`.
2. `wel` has at least three `.usage-profile` children.
3. Construction `misschien-wel` has three `.construction-profile` children
   and `data-visible-slots="1"`.
4. Both multiple-insertion examples mark `MISSCHIEN WEL` with
   `data-analysis-status="ask"` and three candidate profiles.
5. `VAAK` is resolved as `frequency-event`, origin `LOG`.
6. `examples-editor.html` imports and exports all profile metadata.
7. `lexicon-editor.html` imports and exports profiles and constructions.

## Viewer test

1. Open the example `DE HOND HEEFT DE MAN MISSCHIEN WEL VAAK GEBETEN`.
2. Verify that a profile question appears.
3. Before choosing, verify that the recommended mixed analysis is drawn.
4. Choose **hele groep direct in LEX**.
5. Verify that `MISSCHIEN WEL` remains one LEX slot but no longer appears as a
   LOG minor; `VAAK` remains a LOG minor.
6. Reload. Verify that the choice persists for this example only.
7. Select the subordinate example. Verify that it asks independently.
8. Open Config and choose **Vraag profielkeuze opnieuw**. Verify that the
   active example asks again.
9. Export OPN and verify effective `usageProfile`, `origin`,
   `originComponents` and `analysisStatus` in `example.lex_insertions`.

## Regression

- Syntax and FT central trees are unchanged.
- `MISSCHIEN WEL` still uses one visible slot.
- `VAAK` remains after the object and before the final verb cluster.
- Config save/restore behavior is unchanged.
