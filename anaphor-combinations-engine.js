(function attachAnaphorCombinationsEngine(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OGNAnaphorCombinations = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function anaphorCombinationsFactory() {
  'use strict';

  const COMBINATION_SCHEMA = 'ogn-anaphor-combination-v1';
  const RELATION_SCHEMA = 'ogn-referent-anaphor-v1';
  const LEXICAL_INSERTION_SCHEMA = 'ogn-lexical-insertion-v1';
  const LAYOUT_RESOLUTION_SCHEMA = 'ogn-joint-flip-constraints-v1';
  const BRANCH_FLIP_SCHEMA = 'ogn-binary-branch-variants-v1';
  const BRANCH_VARIANTS = Object.freeze(['normal', 'left-right', 'short-long', 'both']);
  const RESERVED_CONTEXT = Object.freeze({
    notation: 'Open Graph Notation',
    representation: 'minimized-tree',
    status: 'p.m.'
  });

  const DEFAULT_LAYOUT_RESOLUTION = Object.freeze({
    schema: LAYOUT_RESOLUTION_SCHEMA,
    mode: 'joint',
    variables: Object.freeze([
      Object.freeze({
        id: 'branch-flips',
        type: 'branch-flip',
        units: Object.freeze(['S1', 'S2']),
        candidates: 'declared-flippable-branches',
        operation: 'binary-placement-variant',
        dimensions: Object.freeze(['left-right', 'short-long']),
        variants: BRANCH_VARIANTS
      }),
      Object.freeze({ id: 's2-shift', type: 'rigid-shift', unitId: 'S2', axes: Object.freeze(['x', 'y']) })
    ]),
    constraints: Object.freeze([
      Object.freeze({ id: 'required-alignments', type: 'relation-alignment', source: 'relations[*].alignment', requiredOnly: true }),
      Object.freeze({ id: 'unit-grid-invariant', type: 'unique-row-and-column', scope: 'per-unit' }),
      Object.freeze({ id: 'preserve-units', type: 'rigid-after-layout', units: Object.freeze(['S1', 'S2']) })
    ]),
    objective: Object.freeze([
      'satisfy-required-relations', 'minimize-flip-count',
      'minimize-changed-dimensions', 'minimize-rigid-shift'
    ]),
    currentSupport: Object.freeze({
      status: 'joint-branch-flip-search-active-context-pro-memorie',
      active: Object.freeze([
        'joint-branch-flip-search', 'four-binary-placement-variants', 'rigid-shift-s2',
        'check-all-relation-alignments', 'render-satisfied-coreferences'
      ]),
      deferred: Object.freeze([])
    }),
    branches: Object.freeze([]),
    firstFixture: Object.freeze({
      id: 'perfectum-vcluster-order',
      nodeId: 'vp-perfectum',
      alternatives: Object.freeze(['aux-vdw', 'vdw-aux'])
    }),
    onConflict: 'report-no-forced-node-move'
  });

  const DEFAULT_COMBINATIONS = Object.freeze([
    Object.freeze({
      schema: COMBINATION_SCHEMA,
      id: 'ik-zie-man-hij-draagt-hoed',
      label: 'Anafoor · Ik zie een man → hij draagt een hoed',
      labelEn: 'Anaphor · Ik zie een man → hij draagt een hoed',
      title: 'Ik zie een man. Man draagt een hoed.',
      surfacePredicateObject: 'draagt een hoed.',
      surfaceTemplate: '{ANAPHOR} draagt een hoed.',
      interpretationId: 'man-hij',
      gapRows: 3,
      sentences: Object.freeze([
        Object.freeze({
          id: 'S1',
          order: 1,
          text: 'Ik zie een man.',
          tree: Object.freeze({
            id: 's1-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 's1-ik', label: 'IK', cat: 'PRON', role: 'subject', source: 's1-ik', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 's1-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 's1-man', label: 'MAN', cat: 'N', role: 'object', source: 's1-man', lexeme: 'man', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 's1-zie', label: 'ZIE', cat: 'V', role: 'predicate', source: 's1-zie', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lex: Object.freeze([
            Object.freeze({ nodeId: 's1-ik', label: 'IK' }),
            Object.freeze({ nodeId: 's1-zie', label: 'ZIE' }),
            Object.freeze({ nodeId: 's1-man', label: 'MAN' })
          ])
        }),
        Object.freeze({
          id: 'S2',
          order: 2,
          text: 'Man draagt een hoed.',
          tree: Object.freeze({
            id: 's2-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 's2-man', label: 'MAN', cat: 'N', role: 'subject', source: 's2-man', lexeme: 'man', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 's2-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 's2-hoed', label: 'HOED', cat: 'N', role: 'object', source: 's2-hoed', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 's2-draagt', label: 'DRAAGT', cat: 'V', role: 'predicate', source: 's2-draagt', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lex: Object.freeze([
            Object.freeze({ nodeId: 's2-man', label: 'MAN', projection: 'anaphor-lexicalization' }),
            Object.freeze({ nodeId: 's2-draagt', label: 'DRAAGT' }),
            Object.freeze({ nodeId: 's2-hoed', label: 'HOED' })
          ])
        })
      ]),
      relations: Object.freeze([
        Object.freeze({
          schema: RELATION_SCHEMA,
          id: 'man-hij',
          type: 'coreference',
          dependencyDirection: 'referent-to-anaphor',
          referent: Object.freeze({ unitId: 'S1', nodeId: 's1-man', lexeme: 'man' }),
          anaphor: Object.freeze({ unitId: 'S2', nodeId: 's2-man', sourceLabel: 'MAN' }),
          lexicalization: Object.freeze({ axis: 'LEX', profile: 'hij' }),
          alignment: Object.freeze({ type: 'shared-column', required: true }),
          line: Object.freeze({ shape: 'straight', direction: 'none' })
        })
      ]),
      layoutResolution: DEFAULT_LAYOUT_RESOLUTION
    }),
    Object.freeze({
      schema: COMBINATION_SCHEMA,
      id: 'ik-zag-man-gisteren-vandaag-was-hij-er-niet-meer',
      label: 'Anafoor · Ik zag de man gisteren → vandaag was hij er niet meer',
      labelEn: 'Anaphor · Ik zag de man gisteren → vandaag was hij er niet meer',
      title: 'Ik zag de man gisteren. Vandaag was man er niet meer.',
      surfacePredicateObject: 'was er niet meer.',
      surfaceTemplate: 'Vandaag was {ANAPHOR} er niet meer.',
      interpretationId: 'man-hij',
      gapRows: 3,
      provenance: Object.freeze({ kind: 'user-supplied', catalogId: 'user-man-temporal' }),
      sentences: Object.freeze([
        Object.freeze({
          id: 'S1',
          order: 1,
          text: 'Ik zag de man gisteren.',
          tree: Object.freeze({
            id: 'tm-s1-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 'tm-s1-ik', label: 'IK', cat: 'PRON', role: 'subject', source: 'tm-s1-ik', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 'tm-s1-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 'tm-s1-man', label: 'MAN', cat: 'N', role: 'object', source: 'tm-s1-man', lexeme: 'man', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 'tm-s1-zag', label: 'ZAG', cat: 'V', role: 'predicate', source: 'tm-s1-zag', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lexInsertions: Object.freeze([
            Object.freeze({
              schema: LEXICAL_INSERTION_SCHEMA,
              id: 'lex-s1-gisteren',
              label: 'GISTEREN',
              axis: 'LEX',
              origin: 'LEX',
              category: 'ADV',
              role: 'time',
              placement: Object.freeze({ position: 'after', anchorNodeId: 'tm-s1-man' })
            })
          ]),
          lex: Object.freeze([
            Object.freeze({ nodeId: 'tm-s1-ik', label: 'IK' }),
            Object.freeze({ nodeId: 'tm-s1-zag', label: 'ZAG' }),
            Object.freeze({ nodeId: 'tm-s1-man', label: 'MAN' }),
            Object.freeze({ insertionId: 'lex-s1-gisteren', label: 'GISTEREN', projection: 'lexical-insertion' })
          ])
        }),
        Object.freeze({
          id: 'S2',
          order: 2,
          text: 'Vandaag was man er niet meer.',
          tree: Object.freeze({
            id: 'tm-s2-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 'tm-s2-man', label: 'MAN', cat: 'N', role: 'subject', source: 'tm-s2-man', lexeme: 'man', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 'tm-s2-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 'tm-s2-was', label: 'WAS', cat: 'V', role: 'predicate', source: 'tm-s2-was', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lexInsertions: Object.freeze([
            Object.freeze({
              schema: LEXICAL_INSERTION_SCHEMA,
              id: 'lex-s2-vandaag',
              label: 'VANDAAG',
              axis: 'LEX',
              origin: 'LEX',
              category: 'ADV',
              role: 'time',
              placement: Object.freeze({ position: 'before', anchorNodeId: 'tm-s2-man', fronted: true })
            }),
            Object.freeze({
              schema: LEXICAL_INSERTION_SCHEMA,
              id: 'lex-s2-er',
              label: 'ER',
              axis: 'LEX',
              origin: 'LEX',
              category: 'ADV',
              role: 'place',
              placement: Object.freeze({ position: 'after', anchorNodeId: 'tm-s2-man' })
            }),
            Object.freeze({
              schema: LEXICAL_INSERTION_SCHEMA,
              id: 'lex-s2-niet-meer',
              label: 'NIET MEER',
              axis: 'LEX',
              origin: 'LEX',
              category: 'ADV',
              role: 'state',
              placement: Object.freeze({ position: 'after', anchorNodeId: 'tm-s2-man' })
            })
          ]),
          lex: Object.freeze([
            Object.freeze({ insertionId: 'lex-s2-vandaag', label: 'VANDAAG', projection: 'lexical-insertion' }),
            Object.freeze({ nodeId: 'tm-s2-was', label: 'WAS' }),
            Object.freeze({ nodeId: 'tm-s2-man', label: 'MAN', projection: 'anaphor-lexicalization' }),
            Object.freeze({ insertionId: 'lex-s2-er', label: 'ER', projection: 'lexical-insertion' }),
            Object.freeze({ insertionId: 'lex-s2-niet-meer', label: 'NIET MEER', projection: 'lexical-insertion' })
          ])
        })
      ]),
      relations: Object.freeze([
        Object.freeze({
          schema: RELATION_SCHEMA,
          id: 'man-hij',
          type: 'coreference',
          dependencyDirection: 'referent-to-anaphor',
          referent: Object.freeze({ unitId: 'S1', nodeId: 'tm-s1-man', lexeme: 'man' }),
          anaphor: Object.freeze({ unitId: 'S2', nodeId: 'tm-s2-man', sourceLabel: 'MAN' }),
          lexicalization: Object.freeze({ axis: 'LEX', profile: 'hij' }),
          alignment: Object.freeze({ type: 'shared-column', required: true }),
          line: Object.freeze({ shape: 'straight', direction: 'none' })
        })
      ]),
      context: RESERVED_CONTEXT,
      layoutResolution: DEFAULT_LAYOUT_RESOLUTION
    }),
    Object.freeze({
      schema: COMBINATION_SCHEMA,
      id: 'boer-bezit-ezel-hij-slaat-hem',
      label: 'Anafoor · Een boer bezit een ezel → hij slaat hem',
      labelEn: 'Anaphor · Een boer bezit een ezel → hij slaat hem',
      title: 'Een boer bezit een ezel. Boer slaat ezel.',
      surfacePredicateObject: 'slaat hem.',
      surfaceTemplate: '{ANAPHOR} slaat {ANAPHOR:ezel-hem}.',
      interpretationId: 'farmer-donkey-resolved',
      gapRows: 3,
      provenance: Object.freeze({
        kind: 'literature-normalization',
        catalogId: 'drt-farmer-donkey',
        url: 'https://www.coli.uni-saarland.de/courses/semantics-22/lectures/ST08-DRT.pdf'
      }),
      sentences: Object.freeze([
        Object.freeze({
          id: 'S1',
          order: 1,
          text: 'Een boer bezit een ezel.',
          tree: Object.freeze({
            id: 'fd-s1-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 'fd-s1-boer', label: 'BOER', cat: 'N', role: 'subject', source: 'fd-s1-boer', lexeme: 'boer', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 'fd-s1-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 'fd-s1-ezel', label: 'EZEL', cat: 'N', role: 'object', source: 'fd-s1-ezel', lexeme: 'ezel', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 'fd-s1-bezit', label: 'BEZIT', cat: 'V', role: 'predicate', source: 'fd-s1-bezit', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lex: Object.freeze([
            Object.freeze({ nodeId: 'fd-s1-boer', label: 'BOER' }),
            Object.freeze({ nodeId: 'fd-s1-bezit', label: 'BEZIT' }),
            Object.freeze({ nodeId: 'fd-s1-ezel', label: 'EZEL' })
          ])
        }),
        Object.freeze({
          id: 'S2',
          order: 2,
          text: 'Boer slaat ezel.',
          tree: Object.freeze({
            id: 'fd-s2-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 'fd-s2-boer', label: 'BOER', cat: 'N', role: 'subject', source: 'fd-s2-boer', lexeme: 'boer', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 'fd-s2-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 'fd-s2-ezel', label: 'EZEL', cat: 'N', role: 'object', source: 'fd-s2-ezel', lexeme: 'ezel', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 'fd-s2-slaat', label: 'SLAAT', cat: 'V', role: 'predicate', source: 'fd-s2-slaat', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lex: Object.freeze([
            Object.freeze({ nodeId: 'fd-s2-boer', label: 'BOER', projection: 'anaphor-lexicalization' }),
            Object.freeze({ nodeId: 'fd-s2-slaat', label: 'SLAAT' }),
            Object.freeze({ nodeId: 'fd-s2-ezel', label: 'EZEL', projection: 'anaphor-lexicalization' })
          ])
        })
      ]),
      relations: Object.freeze([
        Object.freeze({
          schema: RELATION_SCHEMA,
          id: 'boer-hij',
          type: 'coreference',
          dependencyDirection: 'referent-to-anaphor',
          referent: Object.freeze({ unitId: 'S1', nodeId: 'fd-s1-boer', lexeme: 'boer' }),
          anaphor: Object.freeze({ unitId: 'S2', nodeId: 'fd-s2-boer', sourceLabel: 'BOER' }),
          lexicalization: Object.freeze({ axis: 'LEX', profile: 'hij' }),
          alignment: Object.freeze({ type: 'shared-column', required: true }),
          line: Object.freeze({ shape: 'straight', direction: 'none' })
        }),
        Object.freeze({
          schema: RELATION_SCHEMA,
          id: 'ezel-hem',
          type: 'coreference',
          dependencyDirection: 'referent-to-anaphor',
          referent: Object.freeze({ unitId: 'S1', nodeId: 'fd-s1-ezel', lexeme: 'ezel' }),
          anaphor: Object.freeze({ unitId: 'S2', nodeId: 'fd-s2-ezel', sourceLabel: 'EZEL' }),
          lexicalization: Object.freeze({ axis: 'LEX', profile: 'hem' }),
          alignment: Object.freeze({ type: 'shared-column', required: true }),
          line: Object.freeze({ shape: 'straight', direction: 'none' })
        })
      ]),
      layoutResolution: DEFAULT_LAYOUT_RESOLUTION
    }),
    Object.freeze({
      schema: COMBINATION_SCHEMA,
      id: 'boer-slaat-ezel-omdat-hij-hem-bezit',
      label: 'Anafoor · De boer slaat de ezel omdat hij hem bezit',
      labelEn: 'Anaphor · De boer slaat de ezel omdat hij hem bezit',
      title: 'De boer slaat de ezel omdat hij hem bezit.',
      surfacePredicateObject: 'hem bezit.',
      surfaceTemplate: 'omdat {ANAPHOR} {ANAPHOR:ezel-hem} bezit.',
      interpretationId: 'farmer-donkey-causal',
      gapRows: 3,
      provenance: Object.freeze({ kind: 'user-supplied', catalogId: 'user-farmer-donkey-because' }),
      sentences: Object.freeze([
        Object.freeze({
          id: 'S1', order: 1, text: 'De boer slaat de ezel', clauseType: 'main', finiteVerbPlacement: 'v2',
          tree: Object.freeze({
            id: 'bc-s1-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 'bc-s1-boer', label: 'BOER', cat: 'N', role: 'subject', source: 'bc-s1-boer', lexeme: 'boer', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 'bc-s1-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 'bc-s1-ezel', label: 'EZEL', cat: 'N', role: 'object', source: 'bc-s1-ezel', lexeme: 'ezel', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 'bc-s1-slaat', label: 'SLAAT', cat: 'V', role: 'predicate', source: 'bc-s1-slaat', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lex: Object.freeze([
            Object.freeze({ nodeId: 'bc-s1-boer', label: 'BOER' }),
            Object.freeze({ nodeId: 'bc-s1-slaat', label: 'SLAAT' }),
            Object.freeze({ nodeId: 'bc-s1-ezel', label: 'EZEL' })
          ])
        }),
        Object.freeze({
          id: 'S2', order: 2, text: 'omdat boer ezel bezit.', clauseType: 'subordinate', finiteVerbPlacement: 'final',
          tree: Object.freeze({
            id: 'bc-s2-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 'bc-s2-boer', label: 'BOER', cat: 'N', role: 'subject', source: 'bc-s2-boer', lexeme: 'boer', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 'bc-s2-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 'bc-s2-ezel', label: 'EZEL', cat: 'N', role: 'object', source: 'bc-s2-ezel', lexeme: 'ezel', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 'bc-s2-bezit', label: 'BEZIT', cat: 'V', role: 'predicate', source: 'bc-s2-bezit', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lexInsertions: Object.freeze([Object.freeze({
            schema: LEXICAL_INSERTION_SCHEMA, id: 'lex-s2-omdat', label: 'OMDAT', axis: 'LEX', origin: 'LEX', category: 'COMP', role: 'complementizer',
            placement: Object.freeze({ position: 'before', anchorNodeId: 'bc-s2-boer', slot: 0 })
          })]),
          lex: Object.freeze([
            Object.freeze({ insertionId: 'lex-s2-omdat', label: 'OMDAT', projection: 'lexical-insertion' }),
            Object.freeze({ nodeId: 'bc-s2-boer', label: 'BOER', projection: 'anaphor-lexicalization' }),
            Object.freeze({ nodeId: 'bc-s2-ezel', label: 'EZEL', projection: 'anaphor-lexicalization' }),
            Object.freeze({ nodeId: 'bc-s2-bezit', label: 'BEZIT' })
          ])
        })
      ]),
      relations: Object.freeze([
        Object.freeze({
          schema: RELATION_SCHEMA, id: 'boer-hij', type: 'coreference', dependencyDirection: 'referent-to-anaphor',
          referent: Object.freeze({ unitId: 'S1', nodeId: 'bc-s1-boer', lexeme: 'boer' }),
          anaphor: Object.freeze({ unitId: 'S2', nodeId: 'bc-s2-boer', sourceLabel: 'BOER' }),
          lexicalization: Object.freeze({ axis: 'LEX', profile: 'hij' }),
          alignment: Object.freeze({ type: 'shared-column', required: true }), line: Object.freeze({ shape: 'straight', direction: 'none' })
        }),
        Object.freeze({
          schema: RELATION_SCHEMA, id: 'ezel-hem', type: 'coreference', dependencyDirection: 'referent-to-anaphor',
          referent: Object.freeze({ unitId: 'S1', nodeId: 'bc-s1-ezel', lexeme: 'ezel' }),
          anaphor: Object.freeze({ unitId: 'S2', nodeId: 'bc-s2-ezel', sourceLabel: 'EZEL' }),
          lexicalization: Object.freeze({ axis: 'LEX', profile: 'hem' }),
          alignment: Object.freeze({ type: 'shared-column', required: true }), line: Object.freeze({ shape: 'straight', direction: 'none' })
        })
      ]),
      context: RESERVED_CONTEXT,
      layoutResolution: DEFAULT_LAYOUT_RESOLUTION
    }),
    Object.freeze({
      schema: COMBINATION_SCHEMA,
      id: 'man-slaat-hond-omdat-die-hem-heeft-gebeten',
      label: 'Anafoor · De man slaat de hond omdat die hem heeft gebeten',
      labelEn: 'Anaphor · The man hits the dog because it bit him',
      title: 'De man slaat de hond omdat hond man heeft gebeten.',
      surfacePredicateObject: 'hem heeft gebeten.',
      surfaceTemplate: 'omdat {ANAPHOR} {ANAPHOR:man-hem} heeft gebeten.',
      surfaceFromLex: true,
      interpretationId: 'man-dog-causal-perfect',
      gapRows: 3,
      provenance: Object.freeze({ kind: 'user-supplied', catalogId: 'user-man-dog-because-perfect' }),
      sentences: Object.freeze([
        Object.freeze({
          id: 'S1', order: 1, text: 'De man slaat de hond', clauseType: 'main', finiteVerbPlacement: 'v2',
          tree: Object.freeze({
            id: 'mf-s1-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 'mf-s1-man', label: 'MAN', cat: 'N', role: 'subject', source: 'mf-s1-man', lexeme: 'man', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 'mf-s1-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 'mf-s1-hond', label: 'HOND', cat: 'N', role: 'object', source: 'mf-s1-hond', lexeme: 'hond', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 'mf-s1-slaat', label: 'SLAAT', cat: 'V', role: 'predicate', source: 'mf-s1-slaat', kind: 'leaf', children: Object.freeze([]) })
              ]) })
            ])
          }),
          lex: Object.freeze([
            Object.freeze({ nodeId: 'mf-s1-man', label: 'MAN' }),
            Object.freeze({ nodeId: 'mf-s1-slaat', label: 'SLAAT' }),
            Object.freeze({ nodeId: 'mf-s1-hond', label: 'HOND' })
          ])
        }),
        Object.freeze({
          id: 'S2', order: 2, text: 'omdat hond man heeft gebeten.', clauseType: 'subordinate', finiteVerbPlacement: 'final',
          tree: Object.freeze({
            id: 'mf-s2-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 'mf-s2-hond', label: 'HOND', cat: 'N', role: 'subject', source: 'mf-s2-hond', lexeme: 'hond', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 'mf-s2-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
                Object.freeze({ id: 'mf-s2-man', label: 'MAN', cat: 'N', role: 'object', source: 'mf-s2-man', lexeme: 'man', kind: 'leaf', children: Object.freeze([]) }),
                Object.freeze({ id: 'mf-s2-vcluster', label: 'V-CLUSTER', cat: 'V', role: 'predicate', source: 'mf-s2-vcluster', kind: 'cat', children: Object.freeze([
                  Object.freeze({ id: 'mf-s2-heeft', label: 'HEEFT', cat: 'V', role: 'auxiliary', source: 'mf-s2-heeft', kind: 'leaf', children: Object.freeze([]) }),
                  Object.freeze({ id: 'mf-s2-gebeten', label: 'GEBETEN', cat: 'VDW', role: 'participle', source: 'mf-s2-gebeten', kind: 'leaf', children: Object.freeze([]) })
                ]) })
              ]) })
            ])
          }),
          lexInsertions: Object.freeze([Object.freeze({
            schema: LEXICAL_INSERTION_SCHEMA, id: 'lex-mf-s2-omdat', label: 'OMDAT', layer: 'Context', axis: 'LEX', origin: 'LEX', category: 'COMP', role: 'complementizer',
            placement: Object.freeze({ position: 'before', anchorNodeId: 'mf-s2-hond', slot: 0 })
          })]),
          lex: Object.freeze([
            Object.freeze({ insertionId: 'lex-mf-s2-omdat', label: 'OMDAT', projection: 'lexical-insertion' }),
            Object.freeze({ nodeId: 'mf-s2-hond', label: 'HOND', projection: 'anaphor-lexicalization' }),
            Object.freeze({ nodeId: 'mf-s2-man', label: 'MAN', projection: 'anaphor-lexicalization' }),
            Object.freeze({ nodeId: 'mf-s2-heeft', label: 'HEEFT' }),
            Object.freeze({ nodeId: 'mf-s2-gebeten', label: 'GEBETEN' })
          ])
        })
      ]),
      relations: Object.freeze([
        Object.freeze({
          schema: RELATION_SCHEMA, id: 'hond-die', type: 'coreference', dependencyDirection: 'referent-to-anaphor',
          referent: Object.freeze({ unitId: 'S1', nodeId: 'mf-s1-hond', lexeme: 'hond' }),
          anaphor: Object.freeze({ unitId: 'S2', nodeId: 'mf-s2-hond', sourceLabel: 'HOND' }),
          lexicalization: Object.freeze({ axis: 'LEX', profile: 'die' }),
          alignment: Object.freeze({ type: 'shared-column', required: true }), line: Object.freeze({ shape: 'straight', direction: 'none' })
        }),
        Object.freeze({
          schema: RELATION_SCHEMA, id: 'man-hem', type: 'coreference', dependencyDirection: 'referent-to-anaphor',
          referent: Object.freeze({ unitId: 'S1', nodeId: 'mf-s1-man', lexeme: 'man' }),
          anaphor: Object.freeze({ unitId: 'S2', nodeId: 'mf-s2-man', sourceLabel: 'MAN' }),
          lexicalization: Object.freeze({ axis: 'LEX', profile: 'hem' }),
          alignment: Object.freeze({ type: 'shared-column', required: true }), line: Object.freeze({ shape: 'straight', direction: 'none' })
        })
      ]),
      context: RESERVED_CONTEXT,
      layoutResolution: Object.freeze({
        ...DEFAULT_LAYOUT_RESOLUTION,
        branches: Object.freeze([
          Object.freeze({ id: 's1-root', unitId: 'S1', nodeId: 'mf-s1-s', variants: BRANCH_VARIANTS }),
          Object.freeze({ id: 's1-vp', unitId: 'S1', nodeId: 'mf-s1-vp', variants: BRANCH_VARIANTS }),
          Object.freeze({ id: 's2-vcluster', unitId: 'S2', nodeId: 'mf-s2-vcluster', variants: BRANCH_VARIANTS, linearization: 'child-order' })
        ]),
        firstFixture: Object.freeze({
          id: 'perfectum-vcluster-order',
          nodeId: 'mf-s2-vcluster',
          alternatives: Object.freeze(['heeft-gebeten', 'gebeten-heeft'])
        })
      })
    })
  ]);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cleanId(value, fallback) {
    const id = String(value || fallback || '')
      .trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return id || String(fallback || 'anaphor-combination');
  }

  function collectNodes(tree, nodes = new Map()) {
    if (!tree || typeof tree !== 'object') return nodes;
    const id = String(tree.id || '').trim();
    if (!id) throw new Error('Iedere boomknoop in een anafoorcombinatie vereist een id.');
    if (nodes.has(id)) throw new Error(`Dubbele boomknoop-id in anafoorcombinatie: ${id}.`);
    nodes.set(id, tree);
    (Array.isArray(tree.children) ? tree.children : []).forEach(child => collectNodes(child, nodes));
    return nodes;
  }

  function normalizeLexInsertion(value, sentenceId, index, nodes) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${sentenceId}: LEX-insertie ${index + 1} is geen object.`);
    }
    const id = String(value.id || '').trim();
    if (!id) throw new Error(`${sentenceId}: iedere LEX-insertie vereist een eigen id.`);
    if (nodes.has(id)) {
      throw new Error(`${sentenceId}: LEX-insertie ${id} mag geen boomknoop zijn.`);
    }
    if (String(value.nodeId || value.node_id || '').trim()) {
      throw new Error(`${sentenceId}: LEX-insertie ${id} heeft geen nodeId.`);
    }
    const axis = String(value.axis || 'LEX').trim().toUpperCase();
    const origin = String(value.origin || 'LEX').trim().toUpperCase();
    const layer = String(value.layer || 'Context').trim().toLowerCase();
    if (layer !== 'context') {
      throw new Error(`${sentenceId}: iedere insertie behoort tot Context, nooit tot centrale Text.`);
    }
    if (axis !== 'LEX' || origin !== 'LEX') {
      throw new Error(`${sentenceId}: LEX-insertie ${id} vereist axis=LEX en origin=LEX.`);
    }
    const placementInput = value.placement && typeof value.placement === 'object'
      ? value.placement
      : {};
    const position = String(placementInput.position || value.position || '').trim().toLowerCase();
    if (!['before', 'after'].includes(position)) {
      throw new Error(`${sentenceId}: LEX-insertie ${id} vereist placement.position before of after.`);
    }
    const anchorNodeId = String(placementInput.anchorNodeId || value.anchorNodeId || '').trim();
    const anchor = nodes.get(anchorNodeId);
    if (!anchor || anchor.kind !== 'leaf') {
      throw new Error(`${sentenceId}: LEX-insertie ${id} vereist een bestaande lexicale anchorNodeId.`);
    }
    return {
      ...clone(value),
      schema: LEXICAL_INSERTION_SCHEMA,
      id,
      label: String(value.label || value.text || id).trim().toUpperCase(),
      layer: 'Context',
      axis: 'LEX',
      origin: 'LEX',
      ...(value.category ? { category: String(value.category).trim().toUpperCase() } : {}),
      ...(value.role ? { role: String(value.role).trim().toLowerCase() } : {}),
      placement: {
        ...clone(placementInput),
        position,
        anchorNodeId,
        ...(placementInput.fronted === true ? { fronted: true } : {})
      }
    };
  }

  function normalizeSentenceLex(sentence, nodes) {
    const insertionInputs = Array.isArray(sentence.lexInsertions)
      ? sentence.lexInsertions
      : Array.isArray(sentence.lex_insertions) ? sentence.lex_insertions : [];
    const insertions = insertionInputs.map((value, index) => normalizeLexInsertion(value, sentence.id, index, nodes));
    const insertionById = new Map();
    insertions.forEach(insertion => {
      if (insertionById.has(insertion.id)) {
        throw new Error(`${sentence.id}: dubbele LEX-insertie-id ${insertion.id}.`);
      }
      insertionById.set(insertion.id, insertion);
    });
    const usedInsertions = new Set();
    sentence.lex = (Array.isArray(sentence.lex) ? sentence.lex : []).map((value, index) => {
      const item = value && typeof value === 'object' ? clone(value) : {};
      const nodeId = String(item.nodeId || item.node_id || '').trim();
      const insertionId = String(item.insertionId || item.insertion_id || '').trim();
      if (!!nodeId === !!insertionId) {
        throw new Error(`${sentence.id}: LEX-item ${index + 1} vereist precies één nodeId of insertionId.`);
      }
      if (nodeId) {
        const node = nodes.get(nodeId);
        if (!node || node.kind !== 'leaf') {
          throw new Error(`${sentence.id}: LEX-item ${index + 1} verwijst niet naar een lexicale boomknoop.`);
        }
        return { ...item, nodeId, label: String(item.label || node.label || '').trim().toUpperCase() };
      }
      const insertion = insertionById.get(insertionId);
      if (!insertion) {
        throw new Error(`${sentence.id}: LEX-item ${index + 1} verwijst naar een onbekende insertionId ${insertionId}.`);
      }
      if (usedInsertions.has(insertionId)) {
        throw new Error(`${sentence.id}: LEX-insertie ${insertionId} staat meer dan eenmaal op LEX.`);
      }
      usedInsertions.add(insertionId);
      return {
        ...item,
        insertionId,
        label: String(item.label || insertion.label || '').trim().toUpperCase(),
        projection: 'lexical-insertion'
      };
    });
    insertions.forEach(insertion => {
      if (!usedInsertions.has(insertion.id)) {
        throw new Error(`${sentence.id}: LEX-insertie ${insertion.id} ontbreekt in de LEX-oppervlaktevolgorde.`);
      }
    });
    sentence.lexInsertions = insertions;
    delete sentence.lex_insertions;
  }

  function normalizeEndpoint(value, fallbackUnitId, fallbackNodeId) {
    const endpoint = value && typeof value === 'object' ? value : {};
    const nodeId = String(endpoint.nodeId || endpoint.node_id || fallbackNodeId || '').trim();
    const insertionId = String(endpoint.insertionId || endpoint.insertion_id || '').trim();
    if (nodeId && insertionId) {
      throw new Error('Een relatie-endpoint kiest precies één nodeId of insertionId.');
    }
    if (!nodeId && !insertionId) {
      throw new Error('Een relatie-endpoint vereist een nodeId of insertionId.');
    }
    if (insertionId && String(endpoint.axis || 'LEX').trim().toUpperCase() !== 'LEX') {
      throw new Error('Een insertionId-endpoint ligt uitsluitend op de LEX-as.');
    }
    return {
      unitId: String(endpoint.unitId || fallbackUnitId || '').trim(),
      ...(nodeId ? { nodeId } : { kind: 'lexical-insertion', insertionId, axis: 'LEX' }),
      ...(endpoint.lexeme ? { lexeme: String(endpoint.lexeme).trim().toLowerCase() } : {}),
      ...(endpoint.sourceLabel ? { sourceLabel: String(endpoint.sourceLabel).trim().toUpperCase() } : {})
    };
  }

  function resolveSentenceEndpoint(sentence, endpoint, relationLabel) {
    if (endpoint.insertionId) {
      const insertion = (sentence.lexInsertions || []).find(item => item.id === endpoint.insertionId);
      if (!insertion) {
        throw new Error(`${relationLabel}-LEX-insertie bestaat niet: ${endpoint.unitId}:${endpoint.insertionId}.`);
      }
      return insertion;
    }
    const node = collectNodes(sentence.tree).get(endpoint.nodeId);
    if (!node) {
      throw new Error(`${relationLabel}knoop bestaat niet: ${endpoint.unitId}:${endpoint.nodeId}.`);
    }
    return node;
  }

  function planLexInsertionRows(sentence, layout) {
    const insertions = Array.isArray(sentence?.lexInsertions) ? sentence.lexInsertions : [];
    const nodes = Array.isArray(layout?.nodes) ? layout.nodes : [];
    const nodeById = new Map(nodes.map(node => [String(node.id || ''), node]));
    const occupiedRows = new Set(nodes.map(node => String(Number(node.y))));
    const lexOrder = new Map((sentence?.lex || [])
      .map((item, index) => [String(item.insertionId || ''), index])
      .filter(([id]) => id));
    const sorted = [...insertions].sort((first, second) => {
      const firstPosition = String(first.placement?.position || 'after');
      const secondPosition = String(second.placement?.position || 'after');
      if (firstPosition !== secondPosition) return firstPosition === 'before' ? -1 : 1;
      const firstOrder = lexOrder.get(first.id) ?? Number.MAX_SAFE_INTEGER;
      const secondOrder = lexOrder.get(second.id) ?? Number.MAX_SAFE_INTEGER;
      return firstPosition === 'before' ? secondOrder - firstOrder : firstOrder - secondOrder;
    });
    const planned = sorted.map(insertion => {
      const anchor = nodeById.get(String(insertion.placement?.anchorNodeId || ''));
      if (!anchor || !Number.isFinite(Number(anchor.y))) {
        throw new Error(`${sentence?.id || 'OGN'}: LEX-insertie ${insertion.id} mist haar bronanker.`);
      }
      const direction = insertion.placement.position === 'before' ? -1 : 1;
      let y = Number(anchor.y) + direction;
      while (occupiedRows.has(String(y))) y += direction;
      occupiedRows.add(String(y));
      return Object.freeze({
        id: insertion.id,
        insertionId: insertion.id,
        label: insertion.label,
        unitId: String(sentence.id || ''),
        layer: 'Context',
        axis: 'LEX',
        origin: 'LEX',
        position: insertion.placement.position,
        anchorNodeId: insertion.placement.anchorNodeId,
        y
      });
    });
    return Object.freeze(planned.sort((first, second) =>
      (lexOrder.get(first.id) ?? Number.MAX_SAFE_INTEGER) - (lexOrder.get(second.id) ?? Number.MAX_SAFE_INTEGER)));
  }

  function sentenceTail(sentence) {
    const words = String(sentence?.text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= 1) return 'draagt een hoed.';
    const tail = words.slice(1).join(' ');
    return tail.charAt(0).toLocaleLowerCase('nl-NL') + tail.slice(1);
  }

  function normalizeFlipBranches(values, sentenceById) {
    const ids = new Set();
    const endpoints = new Set();
    return (Array.isArray(values) ? values : []).map((value, index) => {
      const input = value && typeof value === 'object' ? value : {};
      const id = cleanId(input.id, `branch-${index + 1}`);
      const unitId = String(input.unitId || input.unit_id || '').trim();
      const nodeId = String(input.nodeId || input.node_id || '').trim();
      const sentence = sentenceById.get(unitId);
      if (!sentence) throw new Error(`Flipkandidaat ${id}: unitId ${unitId || '(leeg)'} bestaat niet.`);
      const branch = collectNodes(sentence.tree).get(nodeId);
      if (!branch) throw new Error(`Flipkandidaat ${id}: vertakking ${unitId}:${nodeId || '(leeg)'} bestaat niet.`);
      if (!Array.isArray(branch.children) || branch.children.length !== 2) {
        throw new Error(`Flipkandidaat ${id}: alleen een binaire vertakking kan links–rechts en kort–lang wisselen.`);
      }
      const variants = [...new Set((Array.isArray(input.variants) && input.variants.length
        ? input.variants : BRANCH_VARIANTS).map(item => String(item || '').trim().toLowerCase()))];
      if (variants.some(variant => !BRANCH_VARIANTS.includes(variant))) {
        throw new Error(`Flipkandidaat ${id}: onbekende flipvariant.`);
      }
      if (!variants.includes('normal')) variants.unshift('normal');
      const endpoint = `${unitId}:${nodeId}`;
      if (ids.has(id)) throw new Error(`Dubbele flipkandidaat-id: ${id}.`);
      if (endpoints.has(endpoint)) throw new Error(`Vertakking ${endpoint} is dubbel als flipkandidaat gedeclareerd.`);
      ids.add(id);
      endpoints.add(endpoint);
      return {
        schema: BRANCH_FLIP_SCHEMA,
        id,
        unitId,
        nodeId,
        variants,
        defaultVariant: 'normal',
        operation: 'binary-placement-variant',
        dimensions: ['left-right', 'short-long'],
        linearization: String(input.linearization || 'none').trim().toLowerCase() === 'child-order'
          ? 'child-order'
          : 'none'
      };
    });
  }

  function normalizeCombination(value, index = 0) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`Anafoorcombinatie ${index + 1} is geen object.`);
    }
    const sentences = Array.isArray(value.sentences) ? clone(value.sentences) : [];
    if (sentences.length !== 2) {
      throw new Error(`Anafoorcombinatie ${value.id || index + 1} vereist precies S1 en S2.`);
    }
    sentences.forEach((sentence, sentenceIndex) => {
      if (!sentence || typeof sentence !== 'object' || !sentence.tree) {
        throw new Error(`Anafoorcombinatie ${value.id || index + 1}: S${sentenceIndex + 1} mist een boom.`);
      }
      sentence.id = String(sentence.id || `S${sentenceIndex + 1}`).trim();
      sentence.order = sentenceIndex + 1;
      sentence.text = String(sentence.text || sentence.id).trim();
      sentence.clauseType = String(sentence.clauseType || 'main').trim().toLowerCase();
      if (!['main', 'subordinate'].includes(sentence.clauseType)) {
        throw new Error(`${sentence.id}: clauseType moet main of subordinate zijn.`);
      }
      sentence.finiteVerbPlacement = String(
        sentence.finiteVerbPlacement || (sentence.clauseType === 'subordinate' ? 'final' : 'v2')
      ).trim().toLowerCase();
      if (!['v2', 'final'].includes(sentence.finiteVerbPlacement)) {
        throw new Error(`${sentence.id}: finiteVerbPlacement moet v2 of final zijn.`);
      }
      if (sentence.clauseType === 'subordinate' && sentence.finiteVerbPlacement !== 'final') {
        throw new Error(`${sentence.id}: een omdat-bijzin behoudt de persoonsvorm aan het einde.`);
      }
      const nodes = collectNodes(sentence.tree);
      normalizeSentenceLex(sentence, nodes);
    });
    if (sentences[0].id !== 'S1' || sentences[1].id !== 'S2') {
      throw new Error('Anafoor-extensie v1 vereist de canonieke unit-id’s S1 en S2 in die volgorde.');
    }

    const sentenceById = new Map(sentences.map(sentence => [sentence.id, sentence]));
    const relationInputs = Array.isArray(value.relations) && value.relations.length
      ? value.relations
      : [value.relation || {}];
    const relations = relationInputs.map((relationValue, relationIndex) => {
      const relationInput = relationValue && typeof relationValue === 'object' ? relationValue : {};
      if (Array.isArray(relationInput.antecedents) || relationInput.type === 'group-coreference') {
        throw new Error('Meervoudige antecedenten vereisen ogn-referent-anaphor-v2; v1 accepteert alleen binaire coreferentielinks.');
      }
      const type = String(relationInput.type || 'coreference').trim();
      if (type !== 'coreference') {
        throw new Error(`Anafoor relations[] accepteert uitsluitend centrale Text-coreferentie; ${type} valt onder Context (p.m.).`);
      }
      const status = String(relationInput.status || 'intended-reading').trim();
      if (!['asserted', 'intended-reading'].includes(status)) {
        throw new Error(`Anafoorrelatie ${relationInput.id || relationIndex + 1}: status ${status} hoort niet in actieve relations[].`);
      }
      const firstEndpointInput = relationInput.referent || relationInput.referent_source;
      const secondEndpointInput = relationInput.anaphor || relationInput.anaphor_source;
      const legacyReferentNodeId = relationInput.antecedentNodeId
        || relationInput.referent_source?.nodeId;
      const legacyAnaphorNodeId = relationInput.referentNodeId
        || relationInput.anaphor_source?.nodeId;
      const referent = normalizeEndpoint(
        firstEndpointInput,
        sentences[0].id,
        legacyReferentNodeId
      );
      const anaphor = normalizeEndpoint(
        secondEndpointInput,
        sentences[1].id,
        legacyAnaphorNodeId
      );
      const referentSentence = sentenceById.get(referent.unitId);
      const anaphorSentence = sentenceById.get(anaphor.unitId);
      if (!referentSentence || !anaphorSentence) throw new Error('Referent en anafoor moeten naar S1 of S2 verwijzen.');
      if (referent.insertionId || anaphor.insertionId) {
        throw new Error('Coreferentie v1 vereist twee structurele boomknopen; LEX-inserties zijn geen anafoorbron.');
      }
      const referentNode = resolveSentenceEndpoint(referentSentence, referent, 'Referent');
      const anaphorNode = resolveSentenceEndpoint(anaphorSentence, anaphor, 'Anafoor');
      if (referent.unitId === anaphor.unitId
          && (referent.nodeId || referent.insertionId) === (anaphor.nodeId || anaphor.insertionId)) {
        throw new Error('De twee relatie-eindpunten mogen niet dezelfde bronknoop zijn.');
      }

      referent.lexeme = String(referent.lexeme || referentNode.lexeme || value.antecedentLexeme || referentNode.label || '')
        .trim().toLowerCase();
      referent.sourceLabel = String(referent.sourceLabel || referentNode.label || '').trim().toUpperCase();
      anaphor.sourceLabel = String(anaphor.sourceLabel || anaphorNode.label || '').trim().toUpperCase();

      const lexicalizationInput = relationInput.lexicalization && typeof relationInput.lexicalization === 'object'
        ? relationInput.lexicalization
        : {};
      const profile = cleanId(lexicalizationInput.profile || lexicalizationInput.profileId || value.anaphorLexicalization, 'hij');
      return {
        schema: RELATION_SCHEMA,
        id: cleanId(relationInput.id, `relation-${relationIndex + 1}`),
        type: 'coreference',
        status,
        dependencyDirection: 'referent-to-anaphor',
        referent,
        anaphor,
        lexicalization: { axis: 'LEX', profile },
        alignment: { type: 'shared-column', required: relationInput.alignment?.required !== false },
        line: { shape: 'straight', direction: 'none' },
        direction: 'none',
        antecedentNodeId: referent.nodeId,
        referentNodeId: anaphor.nodeId,
        antecedentLabel: String(referentNode.label || '').trim().toUpperCase(),
        referentLabel: String(anaphorNode.label || '').trim().toUpperCase()
      };
    });
    const contextInput = value.context && typeof value.context === 'object' && !Array.isArray(value.context)
      ? value.context
      : null;
    if (contextInput && Object.keys(contextInput).some(key => !['notation', 'representation', 'status'].includes(key))) {
      throw new Error('Context is uitsluitend gereserveerd als p.m.; Context-relaties worden nog niet gemodelleerd.');
    }
    if (contextInput && String(contextInput.status || '').trim() !== 'p.m.') {
      throw new Error('Context heeft voorlopig uitsluitend de status p.m.');
    }
    if (contextInput?.notation && String(contextInput.notation).trim() !== RESERVED_CONTEXT.notation) {
      throw new Error('Context is een zelfstandige Open Graph Notation.');
    }
    if (contextInput?.representation && String(contextInput.representation).trim() !== RESERVED_CONTEXT.representation) {
      throw new Error('Context is gereserveerd als geminimaliseerde boom.');
    }
    const relationIds = new Set();
    relations.forEach(relation => {
      if (relationIds.has(relation.id)) throw new Error(`Dubbele anafoorrelatie-id: ${relation.id}.`);
      relationIds.add(relation.id);
    });
    const relation = relations[0];
    if (relation.type !== 'coreference') {
      throw new Error('Anafoor-extensie v1 vereist een binaire coreferentielink als primaire relatie. Andere S1–S2-relaties volgen daarna.');
    }
    const antecedentLexeme = relation.referent.lexeme;
    const surfaceTemplate = String(
      value.surfaceTemplate || `{ANAPHOR} ${String(value.surfacePredicateObject || sentenceTail(sentences[1])).trim()}`
    ).replace(/\s+/g, ' ').trim();
    if (!surfaceTemplate.includes('{ANAPHOR}')) {
      throw new Error(`Anafoorcombinatie ${value.id || index + 1}: surfaceTemplate vereist {ANAPHOR}.`);
    }
    const layoutResolutionInput = value.layoutResolution && typeof value.layoutResolution === 'object'
      ? value.layoutResolution
      : {};
    const cloneListOr = (candidate, fallback) => Array.isArray(candidate) && candidate.length
      ? clone(candidate)
      : clone(fallback);
    const flipBranches = normalizeFlipBranches(
      layoutResolutionInput.branches || layoutResolutionInput.branchCandidates || [],
      sentenceById
    );

    return {
      schema: COMBINATION_SCHEMA,
      id: cleanId(value.id, `anaphor-combination-${index + 1}`),
      label: String(value.label || value.title || `Anafoorcombinatie ${index + 1}`).trim(),
      labelEn: String(value.labelEn || value.label || value.title || `Anaphor combination ${index + 1}`).trim(),
      title: String(value.title || sentences.map(sentence => sentence.text).join(' ')).trim(),
      antecedentLexeme,
      surfacePredicateObject: String(value.surfacePredicateObject || sentenceTail(sentences[1])).trim(),
      surfaceTemplate,
      surfaceFromLex: value.surfaceFromLex === true,
      ...(String(value.interpretationId || '').trim() ? { interpretationId: cleanId(value.interpretationId, 'interpretation-1') } : {}),
      ...(value.provenance && typeof value.provenance === 'object' && !Array.isArray(value.provenance)
        ? { provenance: clone(value.provenance) }
        : {}),
      gapRows: Math.max(1, Math.min(12, Number(value.gapRows) || 3)),
      sentences,
      relations,
      ...(contextInput ? { context: clone(RESERVED_CONTEXT) } : {}),
      relation,
      layoutResolution: {
        schema: LAYOUT_RESOLUTION_SCHEMA,
        mode: 'joint',
        variables: cloneListOr(layoutResolutionInput.variables, DEFAULT_LAYOUT_RESOLUTION.variables),
        constraints: cloneListOr(layoutResolutionInput.constraints, DEFAULT_LAYOUT_RESOLUTION.constraints),
        objective: cloneListOr(layoutResolutionInput.objective, DEFAULT_LAYOUT_RESOLUTION.objective).map(String),
        currentSupport: clone(layoutResolutionInput.currentSupport || DEFAULT_LAYOUT_RESOLUTION.currentSupport),
        branches: flipBranches,
        firstFixture: clone(layoutResolutionInput.firstFixture || DEFAULT_LAYOUT_RESOLUTION.firstFixture),
        onConflict: 'report-no-forced-node-move'
      }
    };
  }

  function normalizeCombinations(values, options = {}) {
    const source = Array.isArray(values) && values.length ? values : DEFAULT_COMBINATIONS;
    const normalized = [];
    const ids = new Set();
    source.forEach((value, index) => {
      const combination = normalizeCombination(value, index);
      if (ids.has(combination.id)) throw new Error(`Dubbele anafoorcombinatie-id: ${combination.id}.`);
      ids.add(combination.id);
      normalized.push(combination);
    });
    if (!normalized.length && options.allowEmpty !== true) return normalizeCombinations(DEFAULT_COMBINATIONS);
    return normalized;
  }

  function toConfigCombination(value, index = 0) {
    const combination = normalizeCombination(value, index);
    return {
      schema: COMBINATION_SCHEMA,
      id: combination.id,
      label: combination.label,
      labelEn: combination.labelEn,
      title: combination.title,
      surfacePredicateObject: combination.surfacePredicateObject,
      surfaceTemplate: combination.surfaceTemplate,
      ...(combination.surfaceFromLex ? { surfaceFromLex: true } : {}),
      ...(combination.interpretationId ? { interpretationId: combination.interpretationId } : {}),
      ...(combination.provenance ? { provenance: clone(combination.provenance) } : {}),
      gapRows: combination.gapRows,
      sentences: clone(combination.sentences),
      relations: combination.relations.map(relation => ({
        schema: RELATION_SCHEMA,
        id: relation.id,
        type: 'coreference',
        status: relation.status,
        dependencyDirection: 'referent-to-anaphor',
        referent: clone(relation.referent),
        anaphor: clone(relation.anaphor),
        lexicalization: clone(relation.lexicalization),
        alignment: clone(relation.alignment),
        line: { shape: 'straight', direction: 'none' }
      })),
      ...(combination.context ? { context: clone(RESERVED_CONTEXT) } : {}),
      layoutResolution: clone(combination.layoutResolution)
    };
  }

  function toConfigList(values) {
    return normalizeCombinations(values).map(toConfigCombination);
  }

  return Object.freeze({
    COMBINATION_SCHEMA,
    RELATION_SCHEMA,
    LEXICAL_INSERTION_SCHEMA,
    LAYOUT_RESOLUTION_SCHEMA,
    BRANCH_FLIP_SCHEMA,
    BRANCH_VARIANTS,
    DEFAULT_LAYOUT_RESOLUTION,
    DEFAULT_COMBINATIONS,
    clone,
    collectNodes,
    planLexInsertionRows,
    normalizeFlipBranches,
    normalizeCombination,
    normalizeCombinations,
    toConfigCombination,
    toConfigList
  });
});
