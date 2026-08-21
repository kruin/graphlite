(function attachAnaphorLexicalizationEngine(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OGNAnaphorLexicon = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function anaphorLexicalizationFactory() {
  'use strict';

  const DEFAULT_PROFILES = Object.freeze([
    Object.freeze({
      id: 'hij', surface: 'HIJ', category: 'PRON', kind: 'personal-pronoun',
      antecedents: Object.freeze(['man', 'boer']), roles: Object.freeze(['subject']), recommended: true,
      label: 'HIJ · persoonlijk voornaamwoord'
    }),
    Object.freeze({
      id: 'die', surface: 'DIE', category: 'PRON', kind: 'demonstrative-pronoun',
      antecedents: Object.freeze(['man', 'vrouw', 'boer', 'hond']), roles: Object.freeze(['subject']), recommended: false,
      label: 'DIE · aanwijzend voornaamwoord'
    }),
    Object.freeze({
      id: 'die-man', surface: 'DIE MAN', category: 'NP', kind: 'demonstrative-np',
      antecedents: Object.freeze(['man']), roles: Object.freeze(['subject']), recommended: false,
      label: 'DIE MAN · aanwijzende nominale groep'
    }),
    Object.freeze({
      id: 'die-vrouw', surface: 'DIE VROUW', category: 'NP', kind: 'demonstrative-np',
      antecedents: Object.freeze(['vrouw']), roles: Object.freeze(['subject']), recommended: false,
      label: 'DIE VROUW · aanwijzende nominale groep'
    }),
    Object.freeze({
      id: 'hem', surface: 'HEM', category: 'PRON', kind: 'personal-pronoun',
      antecedents: Object.freeze(['ezel', 'man', 'boer']), roles: Object.freeze(['object']), recommended: true,
      label: 'HEM · persoonlijk voornaamwoord als object'
    })
  ]);

  function words(value) {
    if (Array.isArray(value)) return value.map(item => String(item || '').trim()).filter(Boolean);
    return String(value || '').split(/[\s,]+/).map(item => item.trim()).filter(Boolean);
  }

  function componentMetadata(value) {
    const metadata = {};
    String(value || '').split(/\s+/).filter(Boolean).forEach(token => {
      const separator = token.indexOf('=');
      if (separator <= 0) return;
      const key = token.slice(0, separator).trim().toLowerCase();
      const raw = token.slice(separator + 1).trim();
      if (key && raw) metadata[key] = raw;
    });
    return metadata;
  }

  function normalizeProfile(profile = {}) {
    const metadata = componentMetadata(profile.components);
    const id = String(profile.id || metadata.id || '').trim().toLowerCase();
    const surface = String(profile.surface || metadata.surface || id || 'ANAFOOR')
      .replace(/_/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
    const antecedents = words(profile.antecedents || metadata.antecedents).map(item => item.toLowerCase());
    const roles = words(profile.roles || metadata.roles || metadata.role).map(item => item.toLowerCase());
    return Object.freeze({
      id,
      surface,
      category: String(profile.category || metadata.category || 'PRON').trim().toUpperCase(),
      kind: String(profile.kind || metadata.kind || profile.function || 'anaphoric-expression').trim(),
      antecedents: Object.freeze(antecedents),
      roles: Object.freeze(roles),
      recommended: profile.recommended === true || String(profile.recommended || '').toLowerCase() === 'true',
      label: String(profile.label || surface).replace(/\s+/g, ' ').trim(),
      origin: 'LEX',
      function: String(profile.function || 'anaphoric-lexicalization').trim(),
      scope: String(profile.scope || 'coreference').trim()
    });
  }

  function normalizedProfiles(profiles) {
    const input = Array.isArray(profiles) && profiles.length ? profiles : DEFAULT_PROFILES;
    const normalized = input.map(normalizeProfile).filter(profile => profile.id && profile.surface);
    return normalized.length ? normalized : DEFAULT_PROFILES.map(normalizeProfile);
  }

  function appliesTo(profile, antecedentLexeme, role = '') {
    const antecedent = String(antecedentLexeme || '').trim().toLowerCase();
    const accepted = words(profile?.antecedents).map(item => item.toLowerCase());
    const roles = words(profile?.roles).map(item => item.toLowerCase());
    const acceptedRole = String(role || '').trim().toLowerCase();
    return (!accepted.length || accepted.includes('*') || accepted.includes(antecedent))
      && (!acceptedRole || !roles.length || roles.includes('*') || roles.includes(acceptedRole));
  }

  function options(profiles, antecedentLexeme, role = '') {
    return normalizedProfiles(profiles).map(profile => Object.freeze({
      ...profile,
      applicable: appliesTo(profile, antecedentLexeme, role)
    }));
  }

  function resolve(profiles, requestedId, antecedentLexeme, role = '') {
    const available = options(profiles, antecedentLexeme, role);
    const requested = available.find(profile => profile.id === String(requestedId || '').toLowerCase() && profile.applicable);
    const selected = requested
      || available.find(profile => profile.recommended && profile.applicable)
      || available.find(profile => profile.applicable)
      || available[0]
      || normalizeProfile(DEFAULT_PROFILES[0]);
    return Object.freeze({ selected, options: Object.freeze(available) });
  }

  function sentenceCase(surface) {
    const value = String(surface || '').trim().toLocaleLowerCase('nl-NL');
    return value ? value.charAt(0).toLocaleUpperCase('nl-NL') + value.slice(1) : '';
  }

  function surfaceSentence(profile, predicateObject = 'draagt een hoed.') {
    return `${sentenceCase(profile?.surface || 'HIJ')} ${String(predicateObject || '').trim()}`.trim();
  }

  function surfaceFromTemplate(profile, template = '{ANAPHOR}', relationProfiles = {}) {
    const source = String(template || '{ANAPHOR}');
    const markerIndex = source.indexOf('{ANAPHOR}');
    const prefix = markerIndex >= 0 ? source.slice(0, markerIndex) : '';
    const sentenceInitial = !prefix.trim() || /[.!?]\s*$/.test(prefix);
    const anaphor = sentenceInitial
      ? sentenceCase(profile?.surface || 'HIJ')
      : String(profile?.surface || 'HIJ').trim().toLocaleLowerCase('nl-NL');
    return source
      .split('{ANAPHOR}').join(anaphor)
      .replace(/\{ANAPHOR:([a-z0-9_-]+)\}/gi, (_marker, relationId) => {
        const resolved = relationProfiles[String(relationId || '').toLowerCase()];
        return String(resolved?.surface || resolved || relationId).trim().toLocaleLowerCase('nl-NL');
      })
      .replace(/\s+/g, ' ')
      .trim();
  }

  return Object.freeze({
    DEFAULT_PROFILES,
    appliesTo,
    componentMetadata,
    normalizeProfile,
    normalizedProfiles,
    options,
    resolve,
    sentenceCase,
    surfaceFromTemplate,
    surfaceSentence
  });
});
