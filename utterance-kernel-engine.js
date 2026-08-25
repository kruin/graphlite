(function attachUtteranceKernelEngine(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OGNUtteranceKernels = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function utteranceKernelFactory() {
  'use strict';

  const DEFINITIONS = Object.freeze([
    Object.freeze({
      id: 'jan-wast-zichzelf',
      title: 'Jan wast zichzelf.',
      type: 'reflexive',
      upper: Object.freeze({ text: 'Jan wast Jan.', subject: 'JAN', predicate: 'WAST', object: 'JAN' }),
      lower: Object.freeze({ text: 'Jan wast zelf.', subject: 'JAN', predicate: 'WAST', object: 'ZELF' }),
      relations: Object.freeze([
        Object.freeze({ upperRole: 'subject', lowerRole: 'subject', referent: 'jan' }),
        Object.freeze({ upperRole: 'object', lowerRole: 'object', referent: 'jan' })
      ]),
      surface: Object.freeze([
        Object.freeze({ label: 'JAN', unit: 'K1', role: 'subject' }),
        Object.freeze({ label: 'WAST', unit: 'K1', role: 'predicate' }),
        Object.freeze({ label: 'ZICHZELF', unit: 'K2', role: 'object', realization: 'zich + zelf' })
      ])
    }),
    Object.freeze({
      id: 'jan-slaat-jek-omdat-die-hem-beet',
      title: 'Jan slaat Jek omdat die hem beet.',
      type: 'causal-role-flip',
      upper: Object.freeze({ text: 'Jan slaat Jek.', subject: 'JAN', predicate: 'SLAAT', object: 'JEK' }),
      lower: Object.freeze({ text: 'Die hem beet.', subject: 'DIE', predicate: 'BEET', object: 'HEM', order: 'subject-object-predicate' }),
      relations: Object.freeze([
        Object.freeze({ upperRole: 'object', lowerRole: 'subject', referent: 'jek' }),
        Object.freeze({ upperRole: 'subject', lowerRole: 'object', referent: 'jan' })
      ]),
      surface: Object.freeze([
        Object.freeze({ label: 'JAN', unit: 'K1', role: 'subject' }),
        Object.freeze({ label: 'SLAAT', unit: 'K1', role: 'predicate' }),
        Object.freeze({ label: 'JEK', unit: 'K1', role: 'object' }),
        Object.freeze({ label: 'OMDAT', unit: 'LINK', role: 'connector', connector: true }),
        Object.freeze({ label: 'DIE', unit: 'K2', role: 'subject' }),
        Object.freeze({ label: 'HEM', unit: 'K2', role: 'object' }),
        Object.freeze({ label: 'BEET', unit: 'K2', role: 'predicate' })
      ])
    }),
    Object.freeze({
      id: 'ken-uzelf',
      title: 'Ken uzelf.',
      type: 'imperative-reflexive',
      implicitSubject: 'U',
      upper: Object.freeze({ text: 'Ken u.', subject: 'U', predicate: 'KEN', object: 'U', implicitSubject: true }),
      lower: Object.freeze({ text: 'Ken zelf.', subject: 'U', predicate: 'KEN', object: 'ZELF', implicitSubject: true }),
      relations: Object.freeze([
        Object.freeze({ upperRole: 'subject', lowerRole: 'subject', referent: 'u' }),
        Object.freeze({ upperRole: 'object', lowerRole: 'object', referent: 'u' })
      ]),
      surface: Object.freeze([
        Object.freeze({ label: 'KEN', unit: 'K1', role: 'predicate' }),
        Object.freeze({ label: 'UZELF', unit: 'K2', role: 'object', realization: 'u + zelf' })
      ])
    })
  ]);

  const CAUSAL_ANAPHOR_VARIANTS = Object.freeze([
    Object.freeze({ id: 'hij', label: 'HIJ', words: Object.freeze(['HIJ']), text: 'hij', phrase: false }),
    Object.freeze({ id: 'die', label: 'DIE', words: Object.freeze(['DIE']), text: 'die', phrase: false }),
    Object.freeze({ id: 'die-hond', label: 'DIE HOND', words: Object.freeze(['DIE', 'HOND']), text: 'die hond', phrase: true }),
    Object.freeze({ id: 'de-hond', label: 'DE HOND', words: Object.freeze(['DE', 'HOND']), text: 'de hond', phrase: true }),
    Object.freeze({ id: 'jek', label: 'JEK', words: Object.freeze(['JEK']), text: 'Jek', phrase: false })
  ]);

  function validCausalAnaphorVariant(value) {
    return CAUSAL_ANAPHOR_VARIANTS.some(variant => variant.id === value) ? value : 'die';
  }

  function definitionFor(id, variantId = 'die') {
    const base = DEFINITIONS.find(definition => definition.id === String(id || '')) || null;
    if (!base || base.type !== 'causal-role-flip') return base;
    const variant = CAUSAL_ANAPHOR_VARIANTS.find(item => item.id === validCausalAnaphorVariant(variantId));
    const lower = Object.freeze({
      ...base.lower, text: `${variant.text.charAt(0).toUpperCase()}${variant.text.slice(1)} hem beet.`,
      subject: variant.label, subjectPhrase: variant.phrase
    });
    const surface = Object.freeze(base.surface.flatMap(item => item.unit === 'K2' && item.role === 'subject'
      ? variant.words.map((label, index) => Object.freeze({
        ...item, label, ...(variant.phrase ? { phrase: variant.label, phrasePart: index + 1 } : {})
      }))
      : [item]));
    return Object.freeze({
      ...base, title: `Jan slaat Jek omdat ${variant.text} hem beet.`,
      anaphorVariant: variant.id, anaphorPhrase: variant.label, lower, surface
    });
  }

  function buildLayout(definition, side) {
    const unit = side === 'upper' ? definition.upper : definition.lower;
    const prefix = `${definition.id}-${side === 'upper' ? 'k1' : 'k2'}`;
    const upper = side === 'upper';
    // Every binary node must visibly branch to both sides of its parent.
    // A causal role flip mirrors K2: two strictly vertical anaphors exchange
    // subject/object columns, so preserving both lines requires that mirror.
    const coordinates = upper
      ? { subject: -3, root: -2, object: 0, vp: 1, predicate: 2, mirrored: false }
      : definition.type === 'causal-role-flip'
        ? { subject: 0, root: -1, object: -3, vp: -4, predicate: -5, mirrored: true }
        : { subject: -3, root: -1, object: 0, vp: 3, predicate: 4, mirrored: false };
    // Dutch kernel syntax is S → NP, VP and VP → NP, V. Surface V2 is
    // realized on LEX; it must not rewrite the underlying VP branch order.
    const roleY = { subject: 1, object: 3, predicate: 4 };
    const root = { id: `${prefix}-s`, label: 'S', cat: 'S', kind: 'cat', x: coordinates.root, y: 0 };
    const vp = { id: `${prefix}-vp`, label: 'VP', cat: 'VP', kind: 'cat', x: coordinates.vp, y: 2 };
    const subject = {
      id: `${prefix}-subject`, label: unit.subject, cat: unit.implicitSubject ? 'PRON' : 'NP', role: 'subject',
      source: `${prefix}-subject`, kind: 'leaf', implicit: !!unit.implicitSubject, x: coordinates.subject, y: roleY.subject
    };
    const predicate = {
      id: `${prefix}-predicate`, label: unit.predicate, cat: 'V', role: 'predicate',
      source: `${prefix}-predicate`, kind: 'leaf', x: coordinates.predicate, y: roleY.predicate
    };
    const object = {
      id: `${prefix}-object`, label: unit.object, cat: 'NP', role: 'object',
      source: `${prefix}-object`, kind: 'leaf', x: coordinates.object, y: roleY.object
    };
    const nodes = [root, subject, vp, object, predicate];
    const edge = (from, to) => ({ from: from.id, to: to.id, fromX: from.x, fromY: from.y, toX: to.x, toY: to.y, type: 'tree' });
    return {
      node: root,
      nodes,
      edges: [edge(root, subject), edge(root, vp), edge(vp, object), edge(vp, predicate)],
      mirrored: coordinates.mirrored,
      boxes: [],
      box: {
        minX: Math.min(...nodes.map(node => node.x)), maxX: Math.max(...nodes.map(node => node.x)),
        minY: Math.min(...nodes.map(node => node.y)), maxY: Math.max(...nodes.map(node => node.y))
      }
    };
  }

  function composeUtterance(id, compositionEngine, variantId = 'die') {
    const definition = definitionFor(id, variantId);
    if (!definition) throw new Error(`Onbekende uiting: ${id || '(leeg)'}.`);
    if (!compositionEngine?.composeDeclaredPair) throw new Error('Multi-OGN-engine mist compositie van gedeclareerde anafoorkolommen.');
    const upper = buildLayout(definition, 'upper');
    const lower = buildLayout(definition, 'lower');
    const declarations = definition.relations.map(relation => {
      const antecedent = upper.nodes.find(node => node.role === relation.upperRole);
      const anaphor = lower.nodes.find(node => node.role === relation.lowerRole);
      return {
        type: 'coreference', referent: relation.referent,
        antecedentNodeId: antecedent.id, anaphorNodeId: anaphor.id,
        antecedentLabel: antecedent.label, anaphorLabel: anaphor.label
      };
    });
    const composed = compositionEngine.composeDeclaredPair({
      upper: { id: 'K1', layout: upper }, lower: { id: 'K2', layout: lower },
      relations: declarations, gapRows: 2
    });
    const sentences = [
      { id: 'K1', order: 1, text: definition.upper.text },
      { id: 'K2', order: 2, text: definition.lower.text }
    ];
    const lexItems = definition.surface.map((item, index) => {
      if (item.connector) return { ...item, nodeId: null, unitId: 'LINK', sentenceOrder: 0, wordOrder: index + 1 };
      const unit = composed.units.find(candidate => candidate.id === item.unit);
      const node = unit.layout.nodes.find(candidate => candidate.role === item.role);
      return { ...item, nodeId: node.id, unitId: item.unit, sentenceOrder: unit.order, wordOrder: index + 1 };
    });
    return {
      ...composed,
      definition,
      demo: { id: definition.id, title: definition.title, sentences },
      lexItems,
      surfaceText: definition.surface.map(item => item.label).join(' ')
    };
  }

  return Object.freeze({ DEFINITIONS, CAUSAL_ANAPHOR_VARIANTS, validCausalAnaphorVariant, definitionFor, buildLayout, composeUtterance });
});
