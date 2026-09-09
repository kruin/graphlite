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
      originalInput: 'Jan wast zichzelf.',
      type: 'reflexive',
      inputTense: 'ott',
      anaphorClass: 'reflexive-local',
      upper: Object.freeze({ text: 'Jan wast Jan.', subject: 'JAN', predicate: 'WAST', object: 'JAN', lemma: 'wassen', surfaceOrder: 'v2' }),
      lower: Object.freeze({ text: 'Jan wast zelf.', subject: 'JAN', predicate: 'WAST', object: 'ZELF', lemma: 'wassen', surfaceOrder: 'v2' }),
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
      originalInput: 'Jan slaat Jek omdat die hem beet.',
      type: 'causal-role-flip',
      inputTense: 'ott',
      anaphorClass: 'cross-kernel',
      upper: Object.freeze({ text: 'Jan slaat hond.', subject: 'JAN', predicate: 'SLAAT', object: 'HOND', lemma: 'slaan', surfaceOrder: 'v2' }),
      lower: Object.freeze({ text: 'Hond bijt man.', subject: 'HOND', predicate: 'BIJT', object: 'MAN', lemma: 'bijten', order: 'subject-object-predicate', surfaceOrder: 'subordinate' }),
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
      id: 'jan-beloonde-jek-omdat-die-het-bot-terugbracht',
      title: 'Jan beloonde zijn hond Jek omdat die het bot naar hem terugbracht.',
      originalInput: 'Jan beloonde zijn hond Jek omdat die het bot naar hem terugbracht.',
      type: 'causal-role-flip',
      inputTense: 'ovt',
      anaphorClass: 'cross-kernel',
      deepStructure: Object.freeze({ plurality: 'multiple-kernel-clauses', storedOrder: Object.freeze(['K1', 'K2']), alternativeOrders: Object.freeze([Object.freeze(['K1', 'K2']), Object.freeze(['K2', 'K1'])]) }),
      lexicalOrders: Object.freeze(['main-before-causal', 'causal-before-main']),
      upper: Object.freeze({ text: 'Jan beloont hond.', subject: 'JAN', predicate: 'BELOONT', object: 'HOND', lemma: 'belonen', surfaceOrder: 'v2' }),
      // The default is TERUGBRENGEN: MAN is its goal and antecedent-bearing
      // argument. The APPORTEREN variants use a separate two-place kernel.
      lower: Object.freeze({ text: 'Hond brengt bot naar man.', subject: 'HOND', predicate: 'BRENGT', object: 'MAN', objectContext: 'BOT NAAR', lemma: 'terugbrengen', order: 'subject-object-predicate', surfaceOrder: 'subordinate' }),
      relations: Object.freeze([
        Object.freeze({ upperRole: 'object', lowerRole: 'subject', referent: 'jek' }),
        Object.freeze({ upperRole: 'subject', lowerRole: 'object', referent: 'jan' })
      ]),
      surface: Object.freeze([
        Object.freeze({ label: 'JAN', unit: 'K1', role: 'subject' }),
        Object.freeze({ label: 'BELOONDE', unit: 'K1', role: 'predicate' }),
        Object.freeze({ label: 'ZIJN HOND JEK', words: Object.freeze(['ZIJN', 'HOND', 'JEK']), unit: 'K1', role: 'object' }),
        Object.freeze({ label: 'OMDAT', unit: 'LINK', role: 'connector', connector: true }),
        Object.freeze({ label: 'DIE', unit: 'K2', role: 'subject' }),
        Object.freeze({ label: 'HET BOT NAAR HEM', words: Object.freeze(['HET', 'BOT', 'NAAR', 'HEM']), unit: 'K2', role: 'object' }),
        Object.freeze({ label: 'TERUGBRACHT', unit: 'K2', role: 'predicate' })
      ])
    }),
    Object.freeze({
      id: 'story-jan-sloeg-jek-waarna-hij-hem-ontweek',
      title: 'Jan sloeg Jek omdat die hem beet, waarna hij hem ontweek.',
      originalInput: 'Jan sloeg Jek omdat die hem beet, waarna hij hem ontweek.',
      type: 'story-role-flip',
      inputTense: 'ovt',
      anaphorClass: 'cross-kernel-story',
      deepStructure: Object.freeze({ plurality: 'story', storedOrder: Object.freeze(['K1', 'K2', 'K3']) }),
      upper: Object.freeze({ text: 'Jan slaat hond.', subject: 'JAN', predicate: 'SLAAT', object: 'HOND', lemma: 'slaan', surfaceOrder: 'v2' }),
      lower: Object.freeze({ text: 'Hond bijt man.', subject: 'HOND', predicate: 'BIJT', object: 'MAN', lemma: 'bijten', order: 'subject-object-predicate', surfaceOrder: 'subordinate' }),
      third: Object.freeze({ text: 'Man ontwijkt hond.', subject: 'MAN', predicate: 'ONTWIJKT', object: 'HOND', lemma: 'ontwijken', surfaceOrder: 'subordinate' }),
      relations: Object.freeze([
        Object.freeze({ fromUnit: 'K1', fromRole: 'object', toUnit: 'K2', toRole: 'subject', referent: 'jek' }),
        Object.freeze({ fromUnit: 'K1', fromRole: 'subject', toUnit: 'K2', toRole: 'object', referent: 'jan' }),
        Object.freeze({ fromUnit: 'K2', fromRole: 'subject', toUnit: 'K3', toRole: 'object', referent: 'jek' }),
        Object.freeze({ fromUnit: 'K2', fromRole: 'object', toUnit: 'K3', toRole: 'subject', referent: 'jan' })
      ]),
      surface: Object.freeze([
        Object.freeze({ label: 'JAN', unit: 'K1', role: 'subject' }),
        Object.freeze({ label: 'SLOEG', unit: 'K1', role: 'predicate' }),
        Object.freeze({ label: 'JEK', unit: 'K1', role: 'object' }),
        Object.freeze({ label: 'OMDAT', unit: 'LINK', role: 'connector', connector: true }),
        Object.freeze({ label: 'DIE', unit: 'K2', role: 'subject' }),
        Object.freeze({ label: 'HEM', unit: 'K2', role: 'object' }),
        Object.freeze({ label: 'BEET', unit: 'K2', role: 'predicate' }),
        Object.freeze({ label: 'WAARNA', unit: 'LINK', role: 'connector', connector: true }),
        Object.freeze({ label: 'HIJ', unit: 'K3', role: 'subject' }),
        Object.freeze({ label: 'HEM', unit: 'K3', role: 'object' }),
        Object.freeze({ label: 'ONTWEEK', unit: 'K3', role: 'predicate' })
      ])
    }),
    Object.freeze({
      id: 'ken-uzelf',
      title: 'Ken uzelf.',
      originalInput: 'Ken uzelf.',
      type: 'imperative-reflexive',
      anaphorClass: 'reflexive-local-implicit-subject',
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

  const CAUSAL_VERB_VARIANTS = Object.freeze([
    Object.freeze({ id: 'bijt', words: Object.freeze(['BIJT']), text: 'bijt' }),
    Object.freeze({ id: 'beet', words: Object.freeze(['BEET']), text: 'beet' }),
    Object.freeze({ id: 'heeft-gebeten', words: Object.freeze(['HEEFT', 'GEBETEN']), text: 'heeft gebeten' }),
    Object.freeze({ id: 'gebeten-heeft', words: Object.freeze(['GEBETEN', 'HEEFT']), text: 'gebeten heeft' }),
    Object.freeze({ id: 'had-gebeten', words: Object.freeze(['HAD', 'GEBETEN']), text: 'had gebeten' }),
    Object.freeze({ id: 'gebeten-had', words: Object.freeze(['GEBETEN', 'HAD']), text: 'gebeten had' })
  ]);
  const REWARD_VERB_VARIANTS = Object.freeze([
    Object.freeze({ id: 'terugbrengt', words: Object.freeze(['TERUGBRENGT']), text: 'terugbrengt' }),
    Object.freeze({ id: 'terugbracht', words: Object.freeze(['TERUGBRACHT']), text: 'terugbracht' }),
    Object.freeze({ id: 'heeft-teruggebracht', words: Object.freeze(['HEEFT', 'TERUGGEBRACHT']), text: 'heeft teruggebracht' }),
    Object.freeze({ id: 'teruggebracht-heeft', words: Object.freeze(['TERUGGEBRACHT', 'HEEFT']), text: 'teruggebracht heeft' }),
    Object.freeze({ id: 'had-teruggebracht', words: Object.freeze(['HAD', 'TERUGGEBRACHT']), text: 'had teruggebracht' }),
    Object.freeze({ id: 'teruggebracht-had', words: Object.freeze(['TERUGGEBRACHT', 'HAD']), text: 'teruggebracht had' }),
    Object.freeze({ id: 'apporteerde', words: Object.freeze(['APPORTEERDE']), text: 'apporteerde' }),
    Object.freeze({ id: 'heeft-geapporteerd', words: Object.freeze(['HEEFT', 'GEAPPORTEERD']), text: 'heeft geapporteerd' }),
    Object.freeze({ id: 'geapporteerd-heeft', words: Object.freeze(['GEAPPORTEERD', 'HEEFT']), text: 'geapporteerd heeft' })
  ]);
  const BOT_VARIANTS = Object.freeze([
    Object.freeze({ id: 'het-bot', words: Object.freeze(['HET', 'BOT']), text: 'het bot', ambiguous: false }),
    Object.freeze({ id: 'zijn-bot', words: Object.freeze(['ZIJN', 'BOT']), text: 'zijn bot', ambiguous: true })
  ]);

  const SYNCHRONIZED_TENSE_FORMS = Object.freeze({
    wassen: Object.freeze({ ott:['WAST'], ovt:['WASTE'], vtt:['HEEFT','GEWASSEN'], vvt:['HAD','GEWASSEN'] }),
    slaan: Object.freeze({ ott:['SLAAT'], ovt:['SLOEG'], vtt:['HEEFT','GESLAGEN'], vvt:['HAD','GESLAGEN'] }),
    belonen: Object.freeze({ ott:['BELOONT'], ovt:['BELOONDE'], vtt:['HEEFT','BELOOND'], vvt:['HAD','BELOOND'] }),
    bijten: Object.freeze({ ott:['BIJT'], ovt:['BEET'], vtt:['HEEFT','GEBETEN'], vvt:['HAD','GEBETEN'] }),
    terugbrengen: Object.freeze({ ott:['TERUGBRENGT'], ovt:['TERUGBRACHT'], vtt:['HEEFT','TERUGGEBRACHT'], vvt:['HAD','TERUGGEBRACHT'] }),
    apporteren: Object.freeze({ ott:['APPORTEERT'], ovt:['APPORTEERDE'], vtt:['HEEFT','GEAPPORTEERD'], vvt:['HAD','GEAPPORTEERD'] }),
    ontwijken: Object.freeze({ ott:['ONTWIJKT'], ovt:['ONTWEEK'], vtt:['HEEFT','ONTWEKEN'], vvt:['HAD','ONTWEKEN'] })
  });

  function sentenceCase(value) {
    const text = String(value || '').toLowerCase();
    return text ? text[0].toUpperCase() + text.slice(1) : '';
  }

  function inflectKernelUnit(unit, tense) {
    const words = SYNCHRONIZED_TENSE_FORMS[unit?.lemma]?.[tense];
    if (!words) return unit;
    const perfect = words.length === 2;
    const complements = unit.schema === 'terugbrengen'
      ? `${unit.determiner || 'HET'} ${unit.theme || 'BOT'} NAAR ${unit.goal || unit.object || 'MAN'}`
      : unit.schema === 'apporteren'
        ? `${unit.determiner || 'HET'} ${unit.theme || 'BOT'}`
        : String(unit.object || '');
    const text = perfect
      ? `${sentenceCase(unit.subject)} ${words[0].toLowerCase()} ${complements.toLowerCase()} ${words[1].toLowerCase()}.`
      : `${sentenceCase(unit.subject)} ${words[0].toLowerCase()} ${complements.toLowerCase()}.`;
    return Object.freeze({ ...unit, predicate: words.join(' '), verbWords: Object.freeze(words.slice()), text: text.replace(/\s+\./, '.') });
  }

  function synchronizeSurface(surface, units, tense) {
    const byId = new Map(Object.entries(units));
    const result = [];
    for (const item of surface) {
      if (item.role !== 'predicate' || !byId.has(item.unit)) { result.push(item); continue; }
      const unit = byId.get(item.unit);
      const words = SYNCHRONIZED_TENSE_FORMS[unit?.lemma]?.[tense];
      if (!words) { result.push(item); continue; }
      const make = (label, part) => Object.freeze({ ...item, label, words: undefined, phrase: words.join(' '), phrasePart: part, tenseSynchronized: true });
      if (words.length === 1) { result.push(make(words[0], 1)); continue; }
      if (unit.surfaceOrder === 'v2') {
        result.push(make(words[0], 1));
        const pending = make(words[1], 2);
        result.push(Object.freeze({ ...pending, deferToUnitEnd: true }));
      } else {
        result.push(make(words[0], 1), make(words[1], 2));
      }
    }
    const ordered = [];
    const pending = new Map();
    for (const item of result) {
      if (item.deferToUnitEnd) { pending.set(item.unit, Object.freeze({ ...item, deferToUnitEnd: undefined })); continue; }
      if (item.connector) {
        for (const value of pending.values()) ordered.push(value);
        pending.clear();
      }
      ordered.push(item);
    }
    for (const value of pending.values()) ordered.push(value);
    return Object.freeze(ordered);
  }

  function synchronizeDefinitionTense(definition, tense) {
    if (!['ott','ovt','vtt','vvt'].includes(tense) || definition.type === 'imperative-reflexive') return definition;
    const units = {
      K1: inflectKernelUnit(definition.upper, tense),
      K2: inflectKernelUnit(definition.lower, tense),
      ...(definition.third ? { K3: inflectKernelUnit(definition.third, tense) } : {})
    };
    const surface = synchronizeSurface(definition.surface, units, tense);
    return Object.freeze({
      ...definition, upper: units.K1, lower: units.K2, ...(units.K3 ? { third: units.K3 } : {}),
      surface, synchronizedTense: tense,
      title: `${sentenceCase(surface.map(item => item.label).join(' '))}.`
    });
  }

  function validCausalAnaphorVariant(value) {
    return CAUSAL_ANAPHOR_VARIANTS.some(variant => variant.id === value) ? value : 'die';
  }

  function definitionFor(id, variantId = 'die', verbVariantId = '', botVariantId = 'het-bot', synchronizedTense = '') {
    const requestedId = String(id || '');
    const canonicalId = requestedId === 'story-jan-sloeg-jek-waarna-hij-ontweek'
      ? 'story-jan-sloeg-jek-waarna-hij-hem-ontweek'
      : requestedId;
    const base = DEFINITIONS.find(definition => definition.id === canonicalId) || null;
    if (!base) return base;
    if (base.type !== 'causal-role-flip') return synchronizeDefinitionTense(base, synchronizedTense);
    const variant = CAUSAL_ANAPHOR_VARIANTS.find(item => item.id === validCausalAnaphorVariant(variantId));
    const reward = base.id === 'jan-beloonde-jek-omdat-die-het-bot-terugbracht';
    const verbs = reward ? REWARD_VERB_VARIANTS : CAUSAL_VERB_VARIANTS;
    const defaultVerb = reward ? 'terugbracht' : 'beet';
    const verb = verbs.find(item => item.id === verbVariantId) || verbs.find(item => item.id === defaultVerb);
    const bot = BOT_VARIANTS.find(item => item.id === botVariantId) || BOT_VARIANTS[0];
    const apporteren = reward && /apporteer|geapporteerd/.test(verb.id);
    const objectText = reward ? (apporteren ? bot.text : `${bot.text} naar hem`) : 'hem';
    // Kernel trees retain their default lexical source nodes. Anaphora,
    // inflection, articles and V-cluster choices are LEX realizations only.
    const lower = apporteren
      ? Object.freeze({ text: `Hond apporteert ${bot.text}.`, subject: 'HOND', predicate: 'APPORTEERT', determiner: bot.words[0], theme: bot.words[bot.words.length - 1], lemma: 'apporteren', schema: 'apporteren', order: 'subject-theme-predicate', surfaceOrder: 'subordinate' })
      : reward
        ? Object.freeze({ text: `Hond brengt ${bot.text} naar man.`, subject: 'HOND', predicate: 'BRENGT', determiner: bot.words[0], theme: bot.words[bot.words.length - 1], goal: 'MAN', lemma: 'terugbrengen', schema: 'terugbrengen', order: 'subject-theme-goal-predicate', surfaceOrder: 'subordinate' })
        : Object.freeze({ ...base.lower, verbWords: verb.words });
    const relations = apporteren
      ? Object.freeze(base.relations.slice(0, 1))
      : reward
        ? Object.freeze(base.relations.map((relation, index) => index === 1 ? Object.freeze({ ...relation, lowerRole: 'goal' }) : relation))
        : base.relations;
    const surface = Object.freeze(base.surface.flatMap(item => {
      if (item.unit === 'K2' && item.role === 'subject') return variant.words.map((label, index) => Object.freeze({
        ...item, label, ...(variant.phrase ? { phrase: variant.label, phrasePart: index + 1 } : {})
      }));
      if (item.unit === 'K2' && item.role === 'object' && reward) {
        const nounPhrase = bot.words.map((label, index) => Object.freeze({
          ...item, words: undefined, label, role: index === bot.words.length - 1 ? 'theme' : 'determiner',
          phrase: bot.text.toUpperCase(), phrasePart: index + 1
        }));
        return apporteren ? nounPhrase : [
          ...nounPhrase,
          Object.freeze({ ...item, words: undefined, label: 'NAAR', role: 'preposition' }),
          Object.freeze({ ...item, words: undefined, label: 'HEM', role: 'goal' })
        ];
      }
      if (item.unit === 'K2' && item.role === 'object') return [{ ...item, label: 'HEM' }];
      if (item.unit === 'K2' && item.role === 'predicate') return [{ ...item, label: verb.words.join(' '), words: verb.words }];
      return [item];
    }));
    const subjectText = reward ? 'zijn hond Jek' : 'Jek';
    return synchronizeDefinitionTense(Object.freeze({
      ...base,
      title: reward
        ? `Jan beloonde ${subjectText} omdat ${variant.text} ${objectText} ${verb.text}.`
        : `Jan slaat ${subjectText} omdat ${variant.text} hem ${verb.text}.`,
      anaphorVariant: variant.id, anaphorPhrase: variant.label,
      verbVariant: verb.id, botVariant: reward ? bot.id : null, ambiguityTodo: reward && bot.ambiguous,
      lower, relations, surface
    }), synchronizedTense);
  }

  function buildRecursiveBinaryLayout(schema, options = {}) {
    if (!schema || typeof schema !== 'object') throw new Error('Binaire kernboom mist een schema.');
    const prefix = String(options.prefix || 'kernel').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase();
    const nodes = [];
    const edges = [];
    const seenKeys = new Set();
    const visit = (spec, parent = null, path = 'root') => {
      const children = Array.isArray(spec.children) ? spec.children : [];
      if (children.length > 2) throw new Error(`Niet-binaire vertakking bij ${spec.label || path}: ${children.length} dochters.`);
      const key = String(spec.key || spec.role || path).replace(/[^a-z0-9_-]+/gi, '-').toLowerCase();
      if (seenKeys.has(key)) throw new Error(`Dubbele kernboom-id: ${key}.`);
      seenKeys.add(key);
      if (!Number.isFinite(spec.x) || !Number.isFinite(spec.y)) {
        throw new Error(`Kernboomknoop ${spec.label || key} mist een berekende vrije x/y-positie.`);
      }
      const id = `${prefix}-${key}`;
      const kind = spec.kind || (children.length ? 'cat' : 'leaf');
      const node = {
        id, label: String(spec.label || spec.cat || key).toUpperCase(),
        cat: String(spec.cat || spec.label || '').toUpperCase(), kind,
        x: Number(spec.x), y: Number(spec.y),
        ...(spec.role ? { role: spec.role } : {}),
        ...(spec.implicit ? { implicit: true } : {}),
        ...(kind === 'leaf' ? { source: id } : {})
      };
      nodes.push(node);
      if (parent) edges.push({ from: parent.id, to: node.id, fromX: parent.x, fromY: parent.y, toX: node.x, toY: node.y, type: 'tree' });
      children.forEach((child, index) => visit(child, node, `${path}-${index + 1}`));
      return node;
    };
    const root = visit(schema);
    const uniqueX = new Set(nodes.map(node => node.x));
    const uniqueY = new Set(nodes.map(node => node.y));
    if (uniqueX.size !== nodes.length || uniqueY.size !== nodes.length) {
      throw new Error('Recursieve kernboom schendt de OGN-regel: iedere knoop vereist een eigen x- én y-gridlijn.');
    }
    return {
      node: root, nodes, edges, mirrored: Boolean(options.mirrored), boxes: [],
      box: {
        minX: Math.min(...nodes.map(node => node.x)), maxX: Math.max(...nodes.map(node => node.x)),
        minY: Math.min(...nodes.map(node => node.y)), maxY: Math.max(...nodes.map(node => node.y))
      }
    };
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
    const auxiliaryLabels = new Set(['HEEFT','HAD','IS','WAS']);
    if (!upper && unit.schema === 'apporteren') {
      return buildRecursiveBinaryLayout({
        key:'s', label:'S', x:-1, y:0, children:[
          { key:'subject', label:unit.subject, cat:'NP', role:'subject', x:0, y:1 },
          { key:'vp', label:'VP', x:-5, y:2, children:[
            { key:'theme-np', label:'NP', cat:'NP', role:'theme-phrase', x:-7, y:3, children:[
              { key:'determiner', label:unit.determiner, cat:'DET', role:'determiner', x:-9, y:4 },
              { key:'theme', label:unit.theme, cat:'N', role:'theme', x:-6, y:5 }
            ] },
            ...(Array.isArray(unit.verbWords) && unit.verbWords.length === 2 ? [{
              key:'v-cluster', label:'V-CLUSTER', cat:'V-CLUSTER', role:'predicate', x:3, y:6, children:[
                { key:'v-first', label:unit.verbWords[0], cat:'AUX', role:'auxiliary', x:1, y:7 },
                { key:'v-second', label:unit.verbWords[1], cat:'V', role:'participle', x:5, y:8 }
              ]
            }] : [{ key:'predicate', label:unit.predicate, cat:'V', role:'predicate', x:3, y:6 }])
          ] }
        ]
      }, { prefix, mirrored:true });
    }
    if (!upper && unit.schema === 'terugbrengen') {
      return buildRecursiveBinaryLayout({
        key:'s', label:'S', x:-1, y:0, children:[
          { key:'subject', label:unit.subject, cat:'NP', role:'subject', x:0, y:1 },
          { key:'vp', label:'VP', x:-5, y:2, children:[
            { key:'theme-np', label:'NP', cat:'NP', role:'theme-phrase', x:-8, y:3, children:[
              { key:'determiner', label:unit.determiner, cat:'DET', role:'determiner', x:-10, y:4 },
              { key:'theme', label:unit.theme, cat:'N', role:'theme', x:-7, y:5 }
            ] },
            { key:'vp-shell', label:"VP'", cat:'VP', x:-4, y:6, children:[
              { key:'goal-pp', label:'PP', cat:'PP', role:'goal-phrase', x:-6, y:7, children:[
                { key:'preposition', label:'NAAR', cat:'P', role:'preposition', x:-9, y:8 },
                { key:'goal', label:unit.goal, cat:'NP', role:'goal', x:-3, y:9 }
              ] },
              ...(Array.isArray(unit.verbWords) && unit.verbWords.length === 2 ? [{
                key:'v-cluster', label:'V-CLUSTER', cat:'V-CLUSTER', role:'predicate', x:4, y:10, children:[
                  { key:'v-first', label:unit.verbWords[0], cat:'AUX', role:'auxiliary', x:2, y:11 },
                  { key:'v-second', label:unit.verbWords[1], cat:'V', role:'participle', x:6, y:12 }
                ]
              }] : [{ key:'predicate', label:unit.predicate, cat:'V', role:'predicate', x:4, y:10 }])
            ] }
          ] }
        ]
      }, { prefix, mirrored:true });
    }
    if (Array.isArray(unit.verbWords) && unit.verbWords.length === 2) {
      const [first, second] = unit.verbWords;
      const occupiedX = new Set([coordinates.root, coordinates.subject, coordinates.vp, coordinates.object, coordinates.predicate]);
      let firstX = coordinates.predicate - 2;
      while (occupiedX.has(firstX)) firstX -= 1;
      let secondX = coordinates.predicate + 3;
      while (occupiedX.has(secondX) || secondX === firstX) secondX += 1;
      return buildRecursiveBinaryLayout({
        key: 's', label: 'S', cat: 'S', x: coordinates.root, y: 0, children: [
          { key: 'subject', label: unit.subject, cat: 'NP', role: 'subject', x: coordinates.subject, y: 1 },
          { key: 'vp', label: 'VP', cat: 'VP', x: coordinates.vp, y: 2, children: [
            { key: 'object', label: unit.object, cat: 'NP', role: 'object', x: coordinates.object, y: 3 },
            { key: 'v-cluster', label: 'V-CLUSTER', cat: 'V-CLUSTER', role: 'predicate', x: coordinates.predicate, y: 4, children: [
              { key: 'v-first', label: first, cat: auxiliaryLabels.has(first) ? 'AUX' : 'V', role: auxiliaryLabels.has(first) ? 'auxiliary' : 'participle', x: firstX, y: 5 },
              { key: 'v-second', label: second, cat: auxiliaryLabels.has(second) ? 'AUX' : 'V', role: auxiliaryLabels.has(second) ? 'auxiliary' : 'participle', x: secondX, y: 6 }
            ] }
          ] }
        ]
      }, { prefix, mirrored: coordinates.mirrored });
    }
    // Dutch kernel syntax is S → NP, VP and VP → NP, V. Surface V2 is
    // realized on LEX; it must not rewrite the underlying VP branch order.
    return buildRecursiveBinaryLayout({
      key: 's', label: 'S', cat: 'S', x: coordinates.root, y: 0, children: [
        { key: 'subject', label: unit.subject, cat: unit.implicitSubject ? 'PRON' : 'NP', role: 'subject',
          implicit: !!unit.implicitSubject, x: coordinates.subject, y: 1 },
        { key: 'vp', label: 'VP', cat: 'VP', x: coordinates.vp, y: 2, children: [
          { key: 'object', label: unit.object, cat: 'NP', role: 'object', x: coordinates.object, y: 3 },
          { key: 'predicate', label: unit.predicate, cat: 'V', role: 'predicate', x: coordinates.predicate, y: 4 }
        ] }
      ]
    }, { prefix, mirrored: coordinates.mirrored });
  }

  function orderedVClusterDaughters(layout) {
    const cluster = (layout?.nodes || []).find(node => node.label === 'V-CLUSTER');
    if (!cluster) return [];
    return (layout.edges || [])
      .filter(edge => edge.from === cluster.id)
      .map(edge => layout.nodes.find(node => node.id === edge.to))
      .filter(Boolean);
  }

  function composeUtterance(id, compositionEngine, variantId = 'die', verbVariantId = '', botVariantId = 'het-bot', synchronizedTense = '') {
    const definition = definitionFor(id, variantId, verbVariantId, botVariantId, synchronizedTense);
    if (!definition) throw new Error(`Onbekende uiting: ${id || '(leeg)'}.`);
    if (!compositionEngine?.composeDeclaredPair) throw new Error('Multi-OGN-engine mist compositie van gedeclareerde anafoorkolommen.');
    if (definition.type === 'story-role-flip') return composeStory(definition, compositionEngine);
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
      relations: declarations, gapRows: 5, allowAdditionalSharedColumns: true
    });
    const sentences = [
      { id: 'K1', order: 1, text: definition.upper.text },
      { id: 'K2', order: 2, text: definition.lower.text }
    ];
    const clusterDaughters = new Map(composed.units.map(unit => [unit.id, orderedVClusterDaughters(unit.layout)]));
    const expandedSurface = definition.surface.flatMap(item => {
      const daughters = clusterDaughters.get(item.unit) || [];
      if (item.role === 'predicate' && daughters.length === 2 && item.tenseSynchronized) {
        const daughter = daughters[Math.max(0, Number(item.phrasePart || 1) - 1)];
        return [{ ...item, vClusterDaughterNodeId: daughter?.id }];
      }
      if (item.role === 'predicate' && daughters.length === 2 && !item.tenseSynchronized) {
        const phrase = daughters.map(node => node.label).join(' ');
        return daughters.map((node, part) => ({
          ...item, words: undefined, label: node.label, phrase, phrasePart: part + 1,
          vClusterDaughterNodeId: node.id
        }));
      }
      return item.words?.length
        ? item.words.map((label, part) => ({ ...item, label, phrase: item.label, phrasePart: part + 1 }))
        : [item];
    });
    const lexItems = expandedSurface.map((item, index) => {
      if (item.connector) return { ...item, nodeId: null, unitId: 'LINK', sentenceOrder: 0, wordOrder: index + 1 };
      const unit = composed.units.find(candidate => candidate.id === item.unit);
      const node = item.vClusterDaughterNodeId
        ? unit.layout.nodes.find(candidate => candidate.id === item.vClusterDaughterNodeId)
        : unit.layout.nodes.find(candidate => candidate.role === item.role);
      return { ...item, nodeId: node.id, unitId: item.unit, sentenceOrder: unit.order, wordOrder: index + 1 };
    });
    return {
      ...composed,
      definition,
      demo: { id: definition.id, title: definition.title, sentences },
      lexItems,
      surfaceText: expandedSurface.map(item => item.label).join(' ')
    };
  }

  function shiftRenameLayout(layout, fromPrefix, toPrefix, dy) {
    const rename = id => String(id).replace(fromPrefix, toPrefix);
    const nodes = layout.nodes.map(node => ({ ...node, id: rename(node.id), y: node.y + dy }));
    const edges = layout.edges.map(item => ({ ...item, from: rename(item.from), to: rename(item.to), fromY: item.fromY + dy, toY: item.toY + dy }));
    return { ...layout, node: nodes.find(node => node.label === 'S'), nodes, edges,
      box: { minX: Math.min(...nodes.map(node => node.x)), maxX: Math.max(...nodes.map(node => node.x)), minY: Math.min(...nodes.map(node => node.y)), maxY: Math.max(...nodes.map(node => node.y)) } };
  }

  function composeStory(definition, compositionEngine) {
    const pairDefinition = { ...definition, type: 'causal-role-flip', relations: [
      { upperRole: 'object', lowerRole: 'subject', referent: 'jek' },
      { upperRole: 'subject', lowerRole: 'object', referent: 'jan' }
    ] };
    const upper = buildLayout(pairDefinition, 'upper');
    const lower = buildLayout(pairDefinition, 'lower');
    const pairRelations = pairDefinition.relations.map(relation => {
      const antecedent = upper.nodes.find(node => node.role === relation.upperRole);
      const anaphor = lower.nodes.find(node => node.role === relation.lowerRole);
      return { type: 'coreference', referent: relation.referent, antecedentNodeId: antecedent.id, anaphorNodeId: anaphor.id, antecedentLabel: antecedent.label, anaphorLabel: anaphor.label };
    });
    const pair = compositionEngine.composeDeclaredPair({ upper: { id: 'K1', layout: upper }, lower: { id: 'K2', layout: lower }, relations: pairRelations, gapRows: 5, allowAdditionalSharedColumns: true });
    const thirdRaw = buildLayout({ ...definition, upper: definition.third, type: 'story-normal' }, 'upper');
    const dy = pair.box.maxY + 3 - thirdRaw.box.minY;
    const third = shiftRenameLayout(thirdRaw, `${definition.id}-k1`, `${definition.id}-k3`, dy);
    const units = [...pair.units, { id: 'K3', order: 3, layout: third, shift: { dx: 0, dy } }];
    const unitMap = new Map(units.map(unit => [unit.id, unit]));
    const relations = definition.relations.map(relation => {
      const antecedent = unitMap.get(relation.fromUnit).layout.nodes.find(node => node.role === relation.fromRole);
      const anaphor = unitMap.get(relation.toUnit).layout.nodes.find(node => node.role === relation.toRole);
      return { type: 'coreference', referent: relation.referent, antecedent: { unitId: relation.fromUnit, nodeId: antecedent.id }, anaphor: { unitId: relation.toUnit, nodeId: anaphor.id }, antecedentLabel: antecedent.label, anaphorLabel: anaphor.label };
    });
    const storyClusterDaughters = new Map(units.map(unit => [unit.id, orderedVClusterDaughters(unit.layout)]));
    const expandedSurface = definition.surface.flatMap(item => {
      const daughters = storyClusterDaughters.get(item.unit) || [];
      if (item.role === 'predicate' && daughters.length === 2) {
        if (item.tenseSynchronized) {
          const daughter = daughters[Math.max(0, Number(item.phrasePart || 1) - 1)];
          return [{ ...item, vClusterDaughterNodeId: daughter?.id }];
        }
        const phrase = daughters.map(node => node.label).join(' ');
        return daughters.map((node, part) => ({ ...item, label:node.label, phrase, phrasePart:part + 1, vClusterDaughterNodeId:node.id }));
      }
      return item.words?.length
        ? item.words.map((label, part) => ({ ...item, label, phrase:item.label, phrasePart:part + 1 }))
        : [item];
    });
    const lexItems = expandedSurface.map((item, index) => {
      if (item.connector) return { ...item, nodeId: null, unitId: 'LINK', sentenceOrder: 0, wordOrder: index + 1 };
      const unit = unitMap.get(item.unit);
      const node = item.vClusterDaughterNodeId
        ? unit.layout.nodes.find(candidate => candidate.id === item.vClusterDaughterNodeId)
        : unit.layout.nodes.find(candidate => candidate.role === item.role);
      return { ...item, nodeId: node.id, unitId: item.unit, sentenceOrder: unit.order, wordOrder: index + 1 };
    });
    return { kind: 'utterance-kernel-story', units, relations, definition,
      box: { minX: Math.min(...units.map(unit => unit.layout.box.minX)), maxX: Math.max(...units.map(unit => unit.layout.box.maxX)), minY: Math.min(...units.map(unit => unit.layout.box.minY)), maxY: Math.max(...units.map(unit => unit.layout.box.maxY)) },
      demo: { id: definition.id, title: definition.title, sentences: [definition.upper, definition.lower, definition.third].map((item, index) => ({ id: `K${index + 1}`, order: index + 1, text: item.text })) },
      lexItems, surfaceText: expandedSurface.map(item => item.label).join(' ') };
  }

  return Object.freeze({ DEFINITIONS, CAUSAL_ANAPHOR_VARIANTS, CAUSAL_VERB_VARIANTS, REWARD_VERB_VARIANTS, BOT_VARIANTS, SYNCHRONIZED_TENSE_FORMS, validCausalAnaphorVariant, synchronizeDefinitionTense, definitionFor, buildRecursiveBinaryLayout, buildLayout, orderedVClusterDaughters, composeUtterance });
});
