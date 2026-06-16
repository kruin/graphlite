(() => {
  'use strict';

  const VERSION = 'v4482';
  const BASE_CELL = 74;
  const ROOT_SIDE_GAP = 1;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CANVAS_GUIDE_TEXT_VISIBLE = false;

  const els = {
    svg: document.getElementById('graphSvg'),
    canvasWrap: document.getElementById('canvasWrap'),
    paneSplitter: document.getElementById('paneSplitter'),
    exampleSelect: document.getElementById('exampleSelect'),
    desktopExampleSelect: document.getElementById('desktopExampleSelect'),
    mobileExampleSelect: document.getElementById('mobileExampleSelect'),
    mainExampleSelect: document.getElementById('mainExampleSelect'),
    openConfigButton: document.getElementById('openConfigButton'),
    closeConfigButton: document.getElementById('closeConfigButton'),
    centralModeSelect: document.getElementById('centralModeSelect'),
    treeChoiceSelect: document.getElementById('treeChoiceSelect'),
    functionalOrderSelect: document.getElementById('functionalOrderSelect'),
    branchOrderSelect: document.getElementById('branchOrderSelect'),
    branchTopSelect: document.getElementById('branchTopSelect'),
    branchMiddleSelect: document.getElementById('branchMiddleSelect'),
    branchOtherSelect: document.getElementById('branchOtherSelect'),
    layoutDensitySelect: document.getElementById('layoutDensitySelect'),
    viewFitSelect: document.getElementById('viewFitSelect'),
    rightMenuWidthSelect: document.getElementById('rightMenuWidthSelect'),
    rightMenuWidthSelectTop: document.getElementById('rightMenuWidthSelectTop'),
    mobileRightMenuWidthSelect: document.getElementById('mobileRightMenuWidthSelect'),
    freeSlotCountSelect: document.getElementById('freeSlotCountSelect'),
    lexFreeSlotCountSelect: document.getElementById('lexFreeSlotCountSelect'),
    lexFreeSlotPlacementSelect: document.getElementById('lexFreeSlotPlacementSelect'),
    lexInsertionContentSelect: document.getElementById('lexInsertionContentSelect'),
    mobileLexInsertionContentSelect: document.getElementById('mobileLexInsertionContentSelect'),
    mobileLexFreeSlotCountSelect: document.getElementById('mobileLexFreeSlotCountSelect'),
    mobileLexFreeSlotPlacementSelect: document.getElementById('mobileLexFreeSlotPlacementSelect'),
    portraitMenuSlotsSelect: document.getElementById('portraitMenuSlotsSelect'),
    mobilePortraitMenuSlotsSelect: document.getElementById('mobilePortraitMenuSlotsSelect'),
    projectionHelp: document.getElementById('projectionHelp'),
    titleLine: document.getElementById('titleLine'),
    metaLine: document.getElementById('metaLine'),
    sentencePreview: document.getElementById('sentencePreview'),
    actionFeedback: document.getElementById('actionFeedback'),
    explainHeading: document.getElementById('explainHeading'),
    explainText: document.getElementById('explainText'),
    showGridInput: document.getElementById('showGridInput'),
    showRelationsInput: document.getElementById('showRelationsInput'),
    showLabelsInput: document.getElementById('showLabelsInput'),
    snapInput: document.getElementById('snapInput'),
    lexRuleSelect: document.getElementById('lexRuleSelect'),
    lexOrderList: document.getElementById('lexOrderList'),
    selectionEmpty: document.getElementById('selectionEmpty'),
    nodeEditor: document.getElementById('nodeEditor'),
    nodeIdField: document.getElementById('nodeIdField'),
    nodeLabelInput: document.getElementById('nodeLabelInput'),
    nodeCatInput: document.getElementById('nodeCatInput'),
    nodeRoleInput: document.getElementById('nodeRoleInput'),
    nodeXInput: document.getElementById('nodeXInput'),
    nodeYInput: document.getElementById('nodeYInput'),
    applyNodeButton: document.getElementById('applyNodeButton'),
    addNodeButton: document.getElementById('addNodeButton'),
    duplicateNodeButton: document.getElementById('duplicateNodeButton'),
    deleteNodeButton: document.getElementById('deleteNodeButton'),
    edgeFromSelect: document.getElementById('edgeFromSelect'),
    edgeToSelect: document.getElementById('edgeToSelect'),
    edgeTypeSelect: document.getElementById('edgeTypeSelect'),
    addEdgeButton: document.getElementById('addEdgeButton'),
    edgeList: document.getElementById('edgeList'),
    fileInput: document.getElementById('fileInput'),
    mobileFileInput: document.getElementById('mobileFileInput'),
    resetExampleButton: document.getElementById('resetExampleButton'),
    fitButton: document.getElementById('fitButton'),
    undoButton: document.getElementById('undoButton'),
    redoButton: document.getElementById('redoButton'),
    downloadJsonButton: document.getElementById('downloadJsonButton'),
    downloadOpnButton: document.getElementById('downloadOpnButton'),
    lexLeftButton: document.getElementById('lexLeftButton'),
    lexRightButton: document.getElementById('lexRightButton'),
    applyLexRuleButton: document.getElementById('applyLexRuleButton'),
    swapRolesButton: document.getElementById('swapRolesButton'),
    growthEnabledInput: document.getElementById('growthEnabledInput'),
    growthStepInput: document.getElementById('growthStepInput'),
    growthStepLabel: document.getElementById('growthStepLabel'),
    growthPrevButton: document.getElementById('growthPrevButton'),
    growthNextButton: document.getElementById('growthNextButton'),
    growthPlayButton: document.getElementById('growthPlayButton'),
    growthResetButton: document.getElementById('growthResetButton'),
    mobileGrowthPrevButton: document.getElementById('mobileGrowthPrevButton'),
    mobileGrowthNextButton: document.getElementById('mobileGrowthNextButton'),
    mobileGrowthPlayButton: document.getElementById('mobileGrowthPlayButton'),
    mobileGrowthResetButton: document.getElementById('mobileGrowthResetButton'),
    mobileGrowthStepLabel: document.getElementById('mobileGrowthStepLabel'),
    mobilePrevButton: document.getElementById('mobilePrevButton'),
    mobileNextButton: document.getElementById('mobileNextButton'),
    mobileFitButton: document.getElementById('mobileFitButton'),
    mobileMenuButton: document.getElementById('mobileMenuButton'),
    mobileCloseButton: document.getElementById('mobileCloseButton'),
    mobileSheet: document.getElementById('mobileSheet'),
    mobileSheetBackdrop: document.getElementById('mobileSheetBackdrop'),
    mobileGrowthButton: document.getElementById('mobileGrowthButton'),
    mobileResetButton: document.getElementById('mobileResetButton'),
    mobileDownloadJsonButton: document.getElementById('mobileDownloadJsonButton')
  };

  let EXAMPLES = [
    {
      id: 'hond-bijt-man',
      title: 'HOND BIJT MAN',
      phase: 'Fase 1+2',
      lexRule: 'hoofdzininvariant',
      sentence: 'HOND BIJT MAN',
      sentenceHtml: '<strong>HOND</strong> BIJT <em>MAN</em>',
      subjectDefault: 'HOND',
      objectDefault: 'MAN',
      predicate: 'BIJT',
      lexItems: [
        { id: 'hond', label: 'HOND', source: 'subject', role: 'subject', thematicRole: 'agens' },
        { id: 'bijt', label: 'BIJT', source: 'predicate', role: 'predicate' },
        { id: 'man', label: 'MAN', source: 'object', role: 'object', thematicRole: 'patiens' }
      ]
    },
    {
      id: 'omdat-hond-man-bijt',
      title: 'OMDAT HOND MAN BIJT',
      phase: 'Fase 3',
      lexRule: 'bijzin-omdat',
      sentence: 'OMDAT HOND MAN BIJT',
      sentenceHtml: 'OMDAT <strong>HOND</strong> <em>MAN</em> BIJT',
      subjectDefault: 'HOND',
      objectDefault: 'MAN',
      predicate: 'BIJT',
      lexItems: [
        { id: 'omdat', label: 'OMDAT', source: null, slot: 'comp' },
        { id: 'hond', label: 'HOND', source: 'subject', role: 'subject', thematicRole: 'agens' },
        { id: 'man', label: 'MAN', source: 'object', role: 'object', thematicRole: 'patiens' },
        { id: 'bijt', label: 'BIJT', source: 'predicate', role: 'predicate' }
      ]
    }
  ];

  const LEX_RULES = [
    { id: 'hoofdzininvariant', label: 'hoofdzin V2: subject/topic – pv/predicaat – object · Wissel' },
    { id: 'bijzin-omdat', label: 'bijzin: Comp/(om)dat + subject + object + predicaat · geen V2' },
    { id: 'perfectum-heeft-vdw', label: 'perfectum V2: subject/topic – pv – object – vdw · Wissel' }
  ];

  const CENTER_MODES = [
    { id: 'syntax', label: 'OPN · syntaxboom' },
    { id: 'functional', label: 'OPN · functionele structuur' }
  ];

  const TREE_CHOICES = [
    { id: 'auto-min', label: 'boomkeuze: auto per voorbeeldtype' },
    { id: 'structure-config', label: 'boomkeuze: structure-config basisboom' }
  ];

  const FUNCTIONAL_ORDERS = [
    { id: 'left-first', label: 'layout: left-first' },
    { id: 'right-first', label: 'layout: right-first' }
  ];

  const BRANCH_ORDERS = [
    { id: 'normal', label: 'standaard: grammaticale volgorde' },
    { id: 'auto-compact', label: 'doel: compact · auto per vertakking' },
    { id: 'auto-align', label: 'doel: align subj/agens + obj/patiens' },
    { id: 'flip-all', label: 'globaal: flip alle vertakkingen' }
  ];

  const BRANCH_CHOICES = [
    { id: 'auto', label: 'auto' },
    { id: 'normal', label: 'normaal' },
    { id: 'flip', label: 'flip' }
  ];


  const LAYOUT_DENSITIES = [
    { id: 'auto', label: 'boomruimte: auto-fit breed/lager' },
    { id: 'compact', label: 'boomruimte: compact/klassiek' },
    { id: 'wide', label: 'boomruimte: breed/lager' },
    { id: 'large', label: 'boomruimte: breed + groter font' }
  ];

  const VIEW_FIT_MODES = [
    { id: 'auto', label: 'venster: automatisch passend' },
    { id: 'fixed', label: 'venster: vast 1500×900' }
  ];

  const RIGHT_MENU_WIDTHS = [
    { id: 'auto', label: 'rechterkolom: auto/rest', minPx: 320, minFraction: 0.34, preferredFraction: 0.42 },
    { id: 'wide', label: 'rechterkolom: breed', minPx: 420, minFraction: 0.42, preferredFraction: 0.50 },
    { id: 'very-wide', label: 'rechterkolom: zeer breed', minPx: 540, minFraction: 0.50, preferredFraction: 0.58 },
    { id: 'max', label: 'rechterkolom: maximaal', minPx: 640, minFraction: 0.58, preferredFraction: 0.66 }
  ];

  const SOUTH_LOGICAL_MODES = ['SOV', 'SVO', 'OVS', 'OSV', 'VSO', 'VOS'];

  const FREE_SLOT_COUNTS = [
    { id: '0', label: 'boomrijen: 0' },
    { id: '1', label: 'boomrijen: 1' },
    { id: '2', label: 'boomrijen: 2' },
    { id: '3', label: 'boomrijen: 3' },
    { id: '4', label: 'boomrijen: 4' },
    { id: '5', label: 'boomrijen: 5' },
    { id: '6', label: 'boomrijen: 6' }
  ];

  const LEX_FREE_SLOT_COUNTS = [
    { id: '0', label: 'LEX-slots: 0' },
    { id: '1', label: 'LEX-slots: 1' },
    { id: '2', label: 'LEX-slots: 2' },
    { id: '3', label: 'LEX-slots: 3' },
    { id: '4', label: 'LEX-slots: 4' },
    { id: '5', label: 'LEX-slots: 5' },
    { id: '6', label: 'LEX-slots: 6' },
    { id: '7', label: 'LEX-slots: 7' },
    { id: '8', label: 'LEX-slots: 8' }
  ];

  const LEX_SLOT_PLACEMENTS = [
    { id: 'after-lex', label: 'onder LEX-woorden', tip: 'Insertieboxen staan onder de huidige LEX-woorden. Veilig voor materiaal dat nog niet tussen bestaande posities hoeft te worden getoond.' },
    { id: 'after-system', label: 'na slot 0/1/2', tip: 'Insertieboxen staan direct na Comp/TOPIC/V2 en vóór gewone basisposities.' },
    { id: 'above-system', label: 'boven slot 0', tip: 'Vrije LEX-slots staan boven de bestaande LEX-asposities.' },
    { id: 'after-surface-1', label: 'tussen positie 1/2', tip: 'Insertiebox op de grens tussen de eerste en tweede LEX-positie.' },
    { id: 'after-surface-2', label: 'tussen positie 2/3', tip: 'Insertiebox op de grens tussen de tweede en derde LEX-positie. Voorbeeld: HOND BIJT VANDAAG MAN.' },
    { id: 'after-surface-3', label: 'tussen positie 3/4', tip: 'Insertiebox op de grens na de derde LEX-positie.' }
  ];

  const LEX_INSERTION_CONTENTS = [
    { id: 'empty', label: 'slot leeg', text: 'INSERTIEPUNT', sub: 'gereserveerd · andere LEX-as', tip: 'Leeg insertiepunt: reserveert alleen plaats op de LEX-as.' },
    { id: 'vandaag', label: 'VANDAAG', text: 'VANDAAG', sub: 'bijwoord · andere LEX-as', tip: 'Voorbeeld: HOND BIJT VANDAAG MAN. VANDAAG grijpt aan op de LEX-as, niet als nieuwe boomknoop.' },
    { id: 'anafoor', label: 'anafoor', text: 'ANAFOOR', sub: 'verwijzing uit andere uiting', tip: 'Voor later: anaforisch element uit een andere zin/uiting.' },
    { id: 'other-lex-axis', label: 'andere LEX-as', text: 'LEX-AS', sub: 'insertie uit andere boom', tip: 'Voor later: materiaal uit de LEX-as van een andere boom.' }
  ];

  const LEX_INSERTION_EXTENSION_TARGETS = [
    { id: 'vp-boundary', label: 'VP-grens V ↔ object', tip: 'Standaard voor VANDAAG: insertie tussen werkwoord en object verlengt de VP-zone/grens, zonder VANDAAG als boomknoop toe te voegen.' },
    { id: 's-boundary', label: 'S-grens subject ↔ VP', tip: 'Verlengt de grens tussen subject en VP. Nuttig als de insertie tussen zinsdelen ligt.' },
    { id: 'object-branch', label: 'tak naar object / NP obj / patiens', tip: 'Verlengt de objecttak; bruikbaar als de insertie vlak vóór het object staat.' },
    { id: 'verb-branch', label: 'tak naar verb / V / pred', tip: 'Verlengt de verb/predicaattak; bruikbaar als de insertie direct aan het verbcluster kleeft.' },
    { id: 'subject-branch', label: 'tak naar subject / NP subj / agens', tip: 'Verlengt de subjecttak; minder gebruikelijk, maar beschikbaar voor tests.' },
    { id: 'arg-boundary', label: 'ARG-STRUCT-grens agens ↔ patiens', tip: 'Functionele variant: verlengt de argumentstructuur tussen agens en patiens.' },
    { id: 'clause-boundary', label: 'CLAUSE-grens pred ↔ ARG-STRUCT', tip: 'Functionele variant: verlengt de grens tussen predicaat en argumentstructuur.' }
  ];

  const PORTRAIT_MENU_SLOT_COUNTS = [
    { id: '0', label: 'onderruimte: 0 menu’s' },
    { id: '1', label: 'onderruimte: 1 menu' },
    { id: '2', label: 'onderruimte: 2 menu’s' }
  ];

  const TOP_MENU_CHOICES = [
    { id: 'projection', label: 'Projectiekeuze', cssClass: 'top-menu-projection', tip: 'Projectiekeuze: Assen, Bron, LEX, SYNTAX-projectie en LOG/FT. Nuttig voor vergelijken van projecties.' },
    { id: 'sentence', label: 'Voorbeeldzin', cssClass: 'top-menu-sentence', tip: 'Voorbeeldzin: kies snel HOND BIJT MAN en varianten. Nuttig voor contrast tussen zinnen.' },
    { id: 'play', label: 'Play/Groei', cssClass: 'top-menu-play', tip: 'Play/Groei: stap voor stap boom, LEX-as en projecties tonen. Nuttig voor didactische uitleg.' },
    { id: 'tools', label: 'Werkknoppen', cssClass: 'top-menu-tools', tip: 'Werkknoppen: FIT, reset, JSON, Docs, Carousel en editors. Nuttig bij bouwen en testen.' }
  ];
  const TOP_MENU_MAX = TOP_MENU_CHOICES.length;

  function southLogicalModeOrder(mode = 'SOV') {
    return ({
      SOV: ['S', 'O', 'V'],
      SVO: ['S', 'V', 'O'],
      OVS: ['O', 'V', 'S'],
      OSV: ['O', 'S', 'V'],
      VSO: ['V', 'S', 'O'],
      VOS: ['V', 'O', 'S']
    })[mode] || ['S', 'O', 'V'];
  }

  function southModeRankMap(mode = state.southLogicalMode || 'SOV') {
    const order = southLogicalModeOrder(mode);
    const rank = new Map();
    order.forEach((item, index) => rank.set(item, index));
    return rank;
  }


  function baseStructureConfig() {
    return {
      syntaxRoot: 's',
      functionalRoot: 'ft-clause',
      syntaxNodes: [
        { id: 's', label: 'S', cat: 'S', kind: 'cat', children: ['np-subj', 'vp'] },
        { id: 'np-subj', label: 'NP', cat: 'NP', kind: 'cat', children: ['subj'] },
        { id: 'subj', label: '{subject}', cat: 'N', kind: 'leaf', role: 'subject', source: 'subject', children: [] },
        { id: 'vp', label: 'VP', cat: 'VP', kind: 'cat', children: ['np-obj', 'v'] },
        { id: 'np-obj', label: 'NP', cat: 'NP', kind: 'cat', children: ['obj'] },
        { id: 'obj', label: '{object}', cat: 'N', kind: 'leaf', role: 'object', source: 'object', children: [] },
        { id: 'v', label: 'V', cat: 'V', kind: 'cat', children: ['pred'] },
        { id: 'pred', label: '{predicate}', cat: 'V', kind: 'leaf', role: 'predicate', source: 'predicate', children: [] }
      ],
      functionalNodes: [
        { id: 'ft-clause', label: 'CLAUSE', cat: 'CLAUSE', kind: 'role-root', role: 'top', children: ['ft-pred', 'ft-argstruct'] },
        { id: 'ft-pred', label: 'PRED', cat: 'PRED', kind: 'role', role: 'pred', children: ['f-root'] },
        { id: 'f-root', label: '{predicate}', cat: 'V', kind: 'leaf', role: 'predicate', source: 'predicate', children: [] },
        { id: 'ft-argstruct', label: 'ARG-STRUCT', cat: 'ARG-STRUCT', kind: 'role', role: 'arguments', children: ['ft-arg1', 'ft-arg2'] },
        { id: 'ft-arg1', label: 'AGENS', cat: 'ROLE', kind: 'role', role: 'agens', children: ['f-subj-np'] },
        { id: 'f-subj-np', label: 'NP', cat: 'NP', kind: 'role', role: 'agens-np', children: ['f-subj'] },
        { id: 'f-subj', label: '{subject}', cat: 'N', kind: 'leaf', role: 'agens', source: 'subject', children: [] },
        { id: 'ft-arg2', label: 'PATIENS', cat: 'ROLE', kind: 'role', role: 'patiens', children: ['f-obj-np'] },
        { id: 'f-obj-np', label: 'NP', cat: 'NP', kind: 'role', role: 'patiens-np', children: ['f-obj'] },
        { id: 'f-obj', label: '{object}', cat: 'N', kind: 'leaf', role: 'patiens', source: 'object', children: [] }
      ],
      lexSlots: [
        { id: 'comp', label: 'slot 0 · Comp/(om)dat' },
        { id: 'topic', label: 'slot 1 · vooropplaatsing/topicalisatie' },
        { id: 'v2', label: 'slot 2 · V2 / persoonsvorm' },
        { id: 'trace', label: 'trace · lege inhoud van gewisseld slot' },
        { id: 'aux', label: 'AUX / pv' }
      ],
      loaded: false
    };
  }

  let STRUCTURE_CONFIG = baseStructureConfig();

  const state = {
    example: EXAMPLES[0],
    projection: 'axes',
    centerMode: 'syntax',
    treeChoice: 'auto-min',
    functionalOrder: 'left-first',
    branchOrder: 'normal',
    branchOverrides: { top: 'auto', middle: 'auto', other: 'auto' },
    layoutDensity: 'auto',
    viewFitMode: 'auto',
    selectedNodeId: null,
    showGrid: true,
    showRelations: true,
    showLabels: true,
    roleSwap: false,
    growthEnabled: false,
    growthStep: 0,
    southLogicalMode: 'SOV',
    freeSlotCount: 2,
    lexFreeSlotCount: 1,
    lexFreeSlotPlacement: 'after-surface-2',
    lexInsertionContent: 'vandaag',
    lexInsertionExtensionTargets: ['vp-boundary'],
    portraitMenuSlots: 0,
    topMenusAbove: [],
    lastSupportedGrowthStep: 0,
    growthTimer: null,
    exampleValidationMessages: [],
    manualViewBox: null,
    viewDrag: null,
    viewClickSuppressed: false,
    activePointers: new Map(),
    pinchGesture: null,
    mobileSheetOpen: false,
    paneSplitManual: false,
    rightMenuWidth: null,
    paneSplitDrag: null,
    canvasPanEnabled: false
  };

  function svgEl(name, attrs = {}, text = '') {
    const el = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === null || value === undefined) continue;
      el.setAttribute(key, String(value));
    }
    if (text !== '') el.textContent = text;
    return el;
  }

  function pathEl(d, attrs = {}) {
    return svgEl('path', { d, fill: 'none', ...attrs });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function roleLabels() {
    const ex = state.example || EXAMPLES[0];
    const subject = ex.subjectDefault || 'HOND';
    const object = ex.objectDefault || 'MAN';
    return {
      subject: state.roleSwap ? object : subject,
      object: state.roleSwap ? subject : object,
      predicate: ex.predicate || 'BIJT'
    };
  }

  function activeLexItems() {
    const roles = roleLabels();
    return (state.example.lexItems || []).map(item => {
      if (item.role === 'subject' || item.source === 'subject') return { ...item, label: roles.subject };
      if (item.role === 'object' || item.source === 'object') return { ...item, label: roles.object };
      if (item.role === 'predicate') return { ...item, label: roles.predicate };
      return { ...item };
    });
  }

  function activeSentenceText() {
    return activeLexItems().map(i => i.label).join(' ');
  }

  function tokenHtml(item) {
    const label = escapeHtml(item.label);
    if (item.role === 'subject') return `<strong>${label}</strong>`;
    if (item.role === 'object') return `<em>${label}</em>`;
    return label;
  }

  function activeSentenceHtml() {
    // v4427: preview follows the editable examples-input.html token list.
    // <strong> marks subject; <em> marks object. This also supports new examples
    // made in examples-editor.html instead of only the two hardcoded patterns.
    return activeLexItems().map(tokenHtml).join(' ');
  }

  const SIMPLE_LEXICON_POLICY = {
    trui: { roles: ['object'], themes: ['patiens'] },
    vrouw: { roles: ['subject'], themes: ['agens'] },
    hond: { roles: ['subject', 'object'], themes: ['agens', 'patiens'] },
    man: { roles: ['subject', 'object'], themes: ['agens', 'patiens'] }
  };

  const SIMPLE_VERB_FRAMES = {
    breit: { subjects: ['vrouw'], objects: ['trui'], participle: 'GEBREID' },
    bijt: { subjects: ['hond', 'kat', 'man', 'vrouw'], objects: ['man', 'hond', 'kat', 'vrouw'], participle: 'GEBETEN' }
  };

  function tokenLexemeId(item) {
    return String(item?.lexeme || item?.label || '').toLowerCase();
  }

  function validateExamplePolicy(ex) {
    const reasons = [];
    const notices = [];
    const tokens = ex.lexItems || [];
    const subject = tokens.find(t => t.role === 'subject');
    const object = tokens.find(t => t.role === 'object');
    const verbToken = tokens.find(t => t.role === 'predicate' || t.role === 'participle');
    const subjId = tokenLexemeId(subject);
    const objId = tokenLexemeId(object);
    const verbId = tokenLexemeId(verbToken);
    const subjPolicy = SIMPLE_LEXICON_POLICY[subjId];
    const objPolicy = SIMPLE_LEXICON_POLICY[objId];
    const frame = SIMPLE_VERB_FRAMES[verbId];
    if (subjPolicy && !subjPolicy.themes.includes('agens')) {
      reasons.push(`${subject.label}: kan niet als agens/subject; ${subject.label} is ${subjPolicy.themes.join('/')}.`);
    }
    if (objPolicy && !objPolicy.themes.includes('patiens')) {
      reasons.push(`${object.label}: kan niet als patiens/object; ${object.label} is ${objPolicy.themes.join('/')}.`);
    }
    if (frame) {
      if (subjId && !frame.subjects.includes(subjId)) reasons.push(`${subject.label}: geen voor-de-hand-liggende agens bij ${verbToken.label}.`);
      if (objId && !frame.objects.includes(objId)) reasons.push(`${object.label}: geen voor-de-hand-liggende patiens bij ${verbToken.label}.`);
    }
    const firstSource = tokens.find(t => t.source);
    if (firstSource?.role === 'object' && objPolicy?.themes?.includes('patiens')) {
      const part = frame?.participle || verbToken?.label || 'gedaan';
      notices.push(`marked/topic: ${object.label} blijft object en patiens; lees als: (Die) ${object.label.toLowerCase()} heeft ${subject?.label?.toLowerCase() || 'agens'} ${String(part).toLowerCase()}.`);
    }
    return { ok: reasons.length === 0, reasons, notices };
  }

  async function loadExamplesFromHtml() {
    try {
      const response = await fetch(`examples-input.html?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) return;
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const cards = [...doc.querySelectorAll('.example-input')];
      const parsed = cards.map((card, idx) => {
        const sentenceEl = card.querySelector('.sentence');
        const subject = sentenceEl?.querySelector('[data-role="subject"]')?.textContent.trim() || 'HOND';
        const object = sentenceEl?.querySelector('[data-role="object"]')?.textContent.trim() || 'MAN';
        const lexItems = [...card.querySelectorAll('.lex-token')].map((token, i) => ({
          id: token.dataset.id || `lex-${i + 1}`,
          label: token.textContent.trim(),
          source: token.dataset.source || null,
          slot: token.dataset.slot || null,
          role: token.dataset.role || null,
          thematicRole: token.dataset.thematicRole || null,
          lexeme: token.dataset.lexeme || null
        }));
        return {
          id: card.dataset.id || `example-${idx + 1}`,
          title: (sentenceEl?.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase(),
          phase: card.dataset.phase || 'Fase',
          lexRule: card.dataset.lexRule || 'hoofdzininvariant',
          sentence: (sentenceEl?.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase(),
          sentenceHtml: sentenceEl?.innerHTML || '',
          subjectDefault: subject.toUpperCase(),
          objectDefault: object.toUpperCase(),
          predicate: (card.dataset.predicate || 'BIJT').toUpperCase(),
          lexItems
        };
      }).filter(ex => ex.id && ex.lexItems.length);
      if (parsed.length) {
        const currentId = state.example?.id;
        const accepted = [];
        const messages = [];
        for (const ex of parsed) {
          const verdict = validateExamplePolicy(ex);
          if (verdict.ok) {
            if (verdict.notices.length) ex.notice = verdict.notices.join(' ');
            accepted.push(ex);
          } else {
            messages.push(`AFGEKEURD ${ex.id}: ${verdict.reasons.join(' ')}`);
          }
        }
        if (messages.length) state.exampleValidationMessages = messages;
        if (accepted.length) {
          EXAMPLES = accepted;
          state.example = EXAMPLES.find(ex => ex.id === currentId) || EXAMPLES[0];
        }
      }
    } catch (err) {
      // Fetch kan mislukken via file://. De ingebouwde fallback blijft dan actief.
    }
  }

  function nodeConfigToTree(nodes, rootId) {
    const byId = new Map(nodes.map(n => [n.id, n]));
    const roles = roleLabels();
    function labelFor(def) {
      let label = String(def.label || def.id);
      label = label.replace(/\{subject\}/gi, roles.subject)
                   .replace(/\{object\}/gi, roles.object)
                   .replace(/\{predicate\}/gi, roles.predicate);
      const projected = def.source ? activeLexItems().find(item => item.source === def.source) : null;
      if (projected) label = projected.label;
      if (def.role === 'subject') label = roles.subject;
      if (def.role === 'object') label = roles.object;
      if (def.role === 'predicate') label = roles.predicate;
      return label;
    }
    function build(id, trail = []) {
      const def = byId.get(id);
      if (!def) return { id, label: id.toUpperCase(), cat: id.toUpperCase(), kind: 'leaf', children: [] };
      if (trail.includes(id)) return { id, label: `${id}↻`, cat: def.cat || def.label || id, kind: 'leaf', children: [] };
      const kind = def.kind || ((def.children || []).length ? 'cat' : 'leaf');
      return {
        id: def.id,
        label: labelFor(def),
        cat: def.cat || def.label || def.id,
        role: def.role || '',
        source: def.source || '',
        kind,
        children: (def.children || []).map(childId => build(childId, [...trail, id]))
      };
    }
    return build(rootId || nodes[0]?.id || 's');
  }

  function parseStructureSection(doc, sectionId) {
    const section = doc.getElementById(sectionId);
    const nodes = [...(section?.querySelectorAll('.node-config') || [])].map(el => ({
      id: el.dataset.id || '',
      label: el.dataset.label || el.textContent.trim() || el.dataset.id || '',
      cat: el.dataset.cat || el.dataset.label || el.dataset.id || '',
      kind: el.dataset.kind || '',
      role: el.dataset.role || '',
      source: el.dataset.source || '',
      children: (el.dataset.children || '').trim().split(/\s+/).filter(Boolean)
    })).filter(n => n.id);
    return { root: section?.dataset.root || nodes[0]?.id || '', nodes };
  }

  async function loadStructureConfig() {
    try {
      const response = await fetch(`structure-config.html?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) return;
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const syntax = parseStructureSection(doc, 'opengraph-syntax-config');
      const functional = parseStructureSection(doc, 'opengraph-functional-config');
      const lexSlots = [...doc.querySelectorAll('#opengraph-lex-config .lex-slot-config')].map(el => ({
        id: el.dataset.id || '',
        label: el.dataset.label || el.textContent.trim()
      })).filter(s => s.id);
      if (syntax.nodes.length) {
        STRUCTURE_CONFIG.syntaxRoot = syntax.root;
        STRUCTURE_CONFIG.syntaxNodes = syntax.nodes;
      }
      if (functional.nodes.length) {
        STRUCTURE_CONFIG.functionalRoot = functional.root;
        STRUCTURE_CONFIG.functionalNodes = functional.nodes;
      }
      if (lexSlots.length) STRUCTURE_CONFIG.lexSlots = lexSlots;
      STRUCTURE_CONFIG.loaded = true;
    } catch (err) {
      // Fallback blijft actief bij file:// of ontbrekende config.
    }
  }

  function itemSurfaceCategory(item) {
    const source = String(item?.source || '').toLowerCase();
    const role = String(item?.role || '').toLowerCase();
    if (source === 'subject' || source === 'object' || role === 'subject' || role === 'object') return 'NP';
    if (source === 'pv' || role === 'aux') return 'AUX';
    if (source === 'vdw' || role === 'participle') return 'VDW';
    if (source === 'predicate' || role === 'predicate') return 'V';
    return String(item?.cat || 'XP').toUpperCase();
  }

  function sourceLabelFallback(source) {
    if (source === 'subject') return '{subject}';
    if (source === 'object') return '{object}';
    if (source === 'predicate') return '{predicate}';
    if (source === 'pv') return '{pv}';
    if (source === 'vdw') return '{vdw}';
    return `{${source}}`;
  }

  function activeSurfaceSourceItems() {
    const seen = new Set();
    return activeLexItems().filter(item => {
      if (!item.source) return false;
      const source = String(item.source);
      if (seen.has(source)) return false;
      seen.add(source);
      return true;
    });
  }

  function surfaceSyntaxSpec() {
    // v4427: auto per voorbeeldtype kiest geen surface-boom. De syntax blijft
    // de basisstructuur die de LEX-as daarna moet realiseren. Wissels zijn dus
    // juist nodig wanneer de voorbeeldzin een andere volgorde heeft dan de
    // basisboom. Voor Nederlandse hoofdzinnen gebruikt de demo een SOV-basis
    // met V2-Wissel: S → NP VP; VP → NP V. Bijzinnen met omdat gebruiken
    // dezelfde SOV-basis zonder V2-Wissel. Perfectum gebruikt een eindcluster
    // waarin PV/AUX lokaal uit de cluster naar slot 2 kan wisselen.
    const items = activeSurfaceSourceItems();
    const bySource = new Map(items.map(item => [String(item.source || ''), item]));
    const makeLeaf = (source, fallbackCat, fallbackRole) => {
      const item = bySource.get(source);
      return {
        id: source,
        label: item?.label || sourceLabelFallback(source),
        cat: fallbackCat,
        role: item?.role || fallbackRole || source,
        source,
        kind: 'leaf',
        children: []
      };
    };
    const phrase = (id, label, cat, child) => ({ id, label, cat, kind: 'cat', children: [child] });
    const subject = phrase('np-subj', 'NP', 'NP', makeLeaf('subject', 'N', 'subject'));
    const object = phrase('np-obj', 'NP', 'NP', makeLeaf('object', 'N', 'object'));
    const predicate = phrase('v', 'V', 'V', makeLeaf('predicate', 'V', 'predicate'));
    const aux = phrase('aux', 'AUX', 'AUX', makeLeaf('pv', 'AUX', 'aux'));
    const participle = phrase('vdw', 'VDW', 'V', makeLeaf('vdw', 'V', 'participle'));
    const hasSubject = bySource.has('subject');
    const hasObject = bySource.has('object');
    const hasPredicate = bySource.has('predicate');
    const hasPv = bySource.has('pv');
    const hasVdw = bySource.has('vdw');
    if (!hasSubject && !hasObject && !hasPredicate && !hasPv && !hasVdw) {
      return nodeConfigToTree(STRUCTURE_CONFIG.syntaxNodes, STRUCTURE_CONFIG.syntaxRoot);
    }

    let vpChildren = [];
    if (hasPv || hasVdw) {
      const clusterChildren = [];
      if (hasVdw) clusterChildren.push(participle);
      if (hasPv) clusterChildren.push(aux);
      const cluster = { id: 'vp-perfectum', label: 'V-CLUSTER', cat: 'VP', kind: 'cat', children: clusterChildren.length ? clusterChildren : [aux] };
      if (hasObject) vpChildren.push(object);
      vpChildren.push(cluster);
    } else {
      if (hasObject) vpChildren.push(object);
      if (hasPredicate) vpChildren.push(predicate);
    }
    const vp = { id: 'vp', label: 'VP', cat: 'VP', kind: 'cat', children: vpChildren };
    const sChildren = [];
    if (hasSubject) sChildren.push(subject);
    if (vp.children.length) sChildren.push(vp);
    return { id: 's', label: 'S', cat: 'S', kind: 'cat', children: sChildren.length ? sChildren : [vp] };
  }

  function activeTreeChoice() {
    return state.treeChoice === 'structure-config' ? 'structure-config' : 'auto-min';
  }

  function treeSpec() {
    if (activeTreeChoice() === 'auto-min') return surfaceSyntaxSpec();
    return nodeConfigToTree(STRUCTURE_CONFIG.syntaxNodes, STRUCTURE_CONFIG.syntaxRoot);
  }

  function functionalSpec() {
    return nodeConfigToTree(STRUCTURE_CONFIG.functionalNodes, STRUCTURE_CONFIG.functionalRoot);
  }

  function cloneTree(node) {
    return { ...node, children: node.children.map(cloneTree) };
  }

  function isLabel(node, label) {
    return node && String(node.label).toLowerCase() === String(label).toLowerCase();
  }

  function unionBox(a, b) {
    return {
      minX: Math.min(a.minX, b.minX),
      maxX: Math.max(a.maxX, b.maxX),
      minY: Math.min(a.minY, b.minY),
      maxY: Math.max(a.maxY, b.maxY)
    };
  }

  function shiftBox(box, dx, dy) {
    return { minX: box.minX + dx, maxX: box.maxX + dx, minY: box.minY + dy, maxY: box.maxY + dy };
  }

  function boxesOverlap(a, b, padding = 0) {
    return a.minX - padding <= b.maxX && b.minX - padding <= a.maxX &&
           a.minY - padding <= b.maxY && b.minY - padding <= a.maxY;
  }

  function cloneLayout(layout) {
    return {
      node: layout.node,
      nodes: layout.nodes.map(n => ({ ...n })),
      edges: layout.edges.map(e => ({ ...e })),
      boxes: layout.boxes.map(b => ({ ...b })),
      box: { ...layout.box }
    };
  }

  function shiftLayout(layout, dx, dy) {
    for (const n of layout.nodes) {
      n.x += dx;
      n.y += dy;
    }
    for (const e of layout.edges) {
      e.fromX += dx;
      e.fromY += dy;
      e.toX += dx;
      e.toY += dy;
    }
    for (const b of layout.boxes) {
      b.minX += dx;
      b.maxX += dx;
      b.minY += dy;
      b.maxY += dy;
      if (typeof b.rootX === 'number') b.rootX += dx;
      if (typeof b.rootY === 'number') b.rootY += dy;
    }
    layout.box = shiftBox(layout.box, dx, dy);
    if (layout.topicalizationSlot) {
      layout.topicalizationSlot.x += dx;
      layout.topicalizationSlot.y += dy;
    }
    if (layout.v2Slot) {
      layout.v2Slot.x += dx;
      layout.v2Slot.y += dy;
    }
    return layout;
  }

  function rightExtent(layout) {
    return Math.max(0, layout.box.maxX);
  }

  function leftExtent(layout) {
    return Math.max(0, -layout.box.minX);
  }

  function isLabel(node, label) {
    return node && String(node.label).toLowerCase() === String(label).toLowerCase();
  }

  function stackedBelowShiftY(upperBox, upperShiftY, lowerBox, extraGap = 0) {
    return upperShiftY + upperBox.maxY + 1 + Math.max(0, extraGap) - lowerBox.minY;
  }

  function layoutBoxFromCells(cells) {
    let box = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    cells.forEach((cell, i) => {
      const b = { minX: cell.x, maxX: cell.x, minY: cell.y, maxY: cell.y };
      box = i === 0 ? b : unionBox(box, b);
    });
    return box;
  }

  function layoutLeaf(node) {
    return {
      node,
      nodes: [{ id: node.id, label: node.label, cat: node.cat, role: node.role || '', source: node.source || '', kind: node.kind, x: 0, y: 0 }],
      edges: [],
      boxes: [{ id: `box-${node.id}`, label: `BOX ${node.label}`, nodeId: node.id, leaf: true, rootX: 0, rootY: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 }],
      box: { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    };
  }

  function occupiedFromPlaced(rootNode, placedLayouts) {
    const occupied = {
      cells: new Set([`0,0`]),
      rootRows: new Set([0]),
      rootCols: new Set([0]),
      rows: new Set([0]),
      cols: new Set([0]),
      boxes: [{ minX: 0, maxX: 0, minY: 0, maxY: 0, rootX: 0, rootY: 0, label: rootNode.label }]
    };
    for (const layout of placedLayouts) {
      for (const n of layout.nodes) {
        occupied.cells.add(`${n.x},${n.y}`);
        occupied.rows.add(n.y);
        occupied.cols.add(n.x);
      }
      for (const b of layout.boxes) {
        occupied.boxes.push(b);
        if (typeof b.rootX === 'number' && typeof b.rootY === 'number') {
          occupied.rootRows.add(b.rootY);
          occupied.rootCols.add(b.rootX);
        }
      }
    }
    return occupied;
  }

  function candidatePositions(side, startY = 1) {
    const dir = side < 0 ? -1 : 1;
    const candidates = [];
    for (let y = startY; y < startY + 18; y++) {
      for (let distance = 1; distance <= 10; distance++) {
        candidates.push({ dx: dir * distance, dy: y });
      }
    }
    return candidates;
  }

  function shiftedRoot(layout, dx, dy) {
    const root = layout.nodes.find(n => n.id === layout.node.id) || layout.nodes[0];
    return { x: root.x + dx, y: root.y + dy };
  }

  function candidateIsFree(layout, dx, dy, occupied, options = {}) {
    const shifted = shiftBox(layout.box, dx, dy);
    if (boxesOverlap(shifted, { minX: 0, maxX: 0, minY: 0, maxY: 0 }, 0)) return false;

    for (const node of layout.nodes) {
      const shiftedX = node.x + dx;
      const shiftedY = node.y + dy;
      const key = `${shiftedX},${shiftedY}`;
      if (occupied.cells.has(key)) return false;
      if (occupied.rows.has(shiftedY)) return false;
      if (occupied.cols.has(shiftedX)) return false;
    }

    for (const box of occupied.boxes) {
      if (boxesOverlap(shifted, box, options.boxPadding ?? 0)) return false;
    }

    // Free OpenGraph placement: do not reuse occupied HOR/VER corridors.
    // This makes the next child box choose a new open row/column rather than a
    // nested side-by-side container position.
    const root = shiftedRoot(layout, dx, dy);
    if (occupied.rootRows.has(root.y)) return false;
    if (occupied.rootCols.has(root.x)) return false;
    return true;
  }

  function placeLayoutFree(layout, side, placedLayouts, parentNode, startY = 1) {
    const occupied = occupiedFromPlaced(parentNode, placedLayouts);
    const candidates = candidatePositions(side, startY);
    for (const c of candidates) {
      if (candidateIsFree(layout, c.dx, c.dy, occupied, { boxPadding: 0 })) {
        return shiftLayout(layout, c.dx, c.dy);
      }
    }

    // Safety fallback: keep moving downward until it is free.
    const dir = side < 0 ? -1 : 1;
    for (let y = startY + 18; y < startY + 80; y++) {
      for (let distance = 1; distance <= 24; distance++) {
        const dx = dir * distance;
        if (candidateIsFree(layout, dx, y, occupied, { boxPadding: 0 })) {
          return shiftLayout(layout, dx, y);
        }
      }
    }
    return shiftLayout(layout, dir, startY);
  }

  function composeLayout(node, placedLayouts) {
    const rootNode = { id: node.id, label: node.label, cat: node.cat, role: node.role || '', source: node.source || '', kind: node.kind, x: 0, y: 0 };
    const nodes = [rootNode];
    const edges = [];
    const childBoxes = [];
    let box = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    for (const child of placedLayouts) {
      const childRoot = child.nodes.find(n => n.id === child.node.id) || child.nodes[0];
      nodes.push(...child.nodes);
      edges.push({ from: node.id, to: child.node.id, fromX: 0, fromY: 0, toX: childRoot.x, toY: childRoot.y }, ...child.edges);
      childBoxes.push(...child.boxes);
      box = unionBox(box, child.box);
    }

    const rootBox = { id: `box-${node.id}`, label: `BOX ${node.label}`, nodeId: node.id, rootX: 0, rootY: 0, minX: box.minX, maxX: box.maxX, minY: box.minY, maxY: box.maxY };
    return { node, nodes, edges, boxes: [rootBox, ...childBoxes], box };
  }

  function preferredFirstSide(options = {}, sidePreference = 0) {
    if (sidePreference === -1 || sidePreference === 1) return sidePreference;
    return options.firstSide === 1 ? 1 : -1;
  }

  function layoutUnary(node, childLayout, sidePreference, options = {}) {
    const side = preferredFirstSide(options, sidePreference);
    const placed = placeLayoutFree(cloneLayout(childLayout), side, [], node, 1);
    return composeLayout(node, [placed]);
  }

  function layoutBinary(node, firstLayout, secondLayout, options = {}, sidePreference = 0) {
    const firstSide = preferredFirstSide(options, sidePreference);
    const first = placeLayoutFree(cloneLayout(firstLayout), firstSide, [], node, 1);
    const extraGap = isLabel(node, 'S') && isLabel(firstLayout.node, 'NP') && isLabel(secondLayout.node, 'VP') ? 1 : 0;

    // v4427: left-first/right-first is part of the placement strategy.
    // It changes the candidate-search direction before placement; it does
    // not mirror an already drawn tree and does not swap grammatical roles.
    // The second complete child box starts below the real bottom of the first
    // placed box, then searches the opposite side for the first free HOR/VER
    // position.
    const startY = Math.max(2, first.box.maxY + 1 + extraGap - secondLayout.box.minY);
    const second = placeLayoutFree(cloneLayout(secondLayout), -firstSide, [first], node, startY);
    return composeLayout(node, [first, second]);
  }

  function layoutNAry(node, childrenLayouts, options = {}, sidePreference = 0) {
    const placed = [];
    const firstSide = preferredFirstSide(options, sidePreference);
    childrenLayouts.forEach((layout, i) => {
      const side = i % 2 === 0 ? firstSide : -firstSide;
      const startY = placed.length ? Math.max(...placed.map(p => p.box.maxY)) + 1 : 1;
      placed.push(placeLayoutFree(cloneLayout(layout), side, placed, node, startY));
    });
    return composeLayout(node, placed);
  }

  function branchClass(node, options = {}) {
    const id = String(node?.id || '').toLowerCase();
    const label = String(node?.label || '').toLowerCase();
    const cat = String(node?.cat || '').toLowerCase();
    const rootIds = [STRUCTURE_CONFIG.syntaxRoot, STRUCTURE_CONFIG.functionalRoot]
      .filter(Boolean)
      .map(v => String(v).toLowerCase());
    if (rootIds.includes(id) || ['s', 'clause'].includes(label) || ['s', 'clause'].includes(cat)) return 'top';
    if (id.includes('vp') || label === 'vp' || cat === 'vp' || id.includes('argstruct') || label.includes('arg-struct') || cat.includes('arg-struct')) return 'middle';
    return 'other';
  }

  function explicitBranchOrder(node, options = {}) {
    if (options.branchOrder === 'normal') return 'normal';
    if (options.branchOrder === 'flip-all') return 'flip';
    const branchType = branchClass(node, options);
    const override = options.branchOverrides?.[branchType] || 'auto';
    if (override === 'normal' || override === 'flip') return override;
    return 'auto';
  }

  function layoutWidth(layout) {
    return layout.box.maxX - layout.box.minX + 1;
  }

  function layoutHeight(layout) {
    return layout.box.maxY - layout.box.minY + 1;
  }

  function scoreCompact(layout) {
    const w = layoutWidth(layout);
    const h = layoutHeight(layout);
    // Area first, then height, then width.  This keeps the old free placement
    // principle but lets every branch locally pick the tighter child order.
    return w * h * 1000 + h * 20 + w;
  }

  function nodeByRoleOrPattern(layout, roleNames, patterns, options = {}) {
    const roles = roleNames.map(v => String(v).toLowerCase());
    const checks = patterns.map(v => String(v).toLowerCase());
    const matchesKind = n => {
      if (options.leaf === true && n.kind !== 'leaf') return false;
      if (options.leaf === false && n.kind === 'leaf') return false;
      return true;
    };
    return layout.nodes.find(n => matchesKind(n) && roles.includes(String(n.role || '').toLowerCase())) ||
      layout.nodes.find(n => matchesKind(n) && checks.some(p => String(n.id || '').toLowerCase().includes(p) || String(n.label || '').toLowerCase().includes(p) || String(n.cat || '').toLowerCase().includes(p)));
  }

  function distX(a, b) {
    if (!a || !b) return 0;
    return Math.abs(a.x - b.x);
  }

  function scoreAlign(layout) {
    // Alignment goal: choose branch flips that bring equivalent vertical
    // corridors nearer together.  In syntax this means NP-subj with subject
    // and NP-obj with object.  In functional this means ARG1/AGENS with
    // subject and ARG2/PATIENS with object.  The score is still penalised by
    // area, so align-mode does not produce needlessly large drawings.
    const subj = nodeByRoleOrPattern(layout, ['subject'], ['subject', 'subj'], { leaf: true });
    const obj = nodeByRoleOrPattern(layout, ['object'], ['object', 'obj'], { leaf: true });
    const subjParent = nodeByRoleOrPattern(layout, ['np-subj', 'agens', 'arg1'], ['np-subj', 'f-subj-np', 'arg1', 'agens'], { leaf: false });
    const objParent = nodeByRoleOrPattern(layout, ['np-obj', 'patiens', 'patient', 'arg2'], ['np-obj', 'f-obj-np', 'arg2', 'patiens', 'patient'], { leaf: false });
    const alignPenalty = distX(subj, subjParent) + distX(obj, objParent);
    return alignPenalty * 10000 + scoreCompact(layout);
  }

  function branchScore(layout, options = {}) {
    return options.branchOrder === 'auto-align' ? scoreAlign(layout) : scoreCompact(layout);
  }

  function composeBranch(node, childLayouts, options = {}, sidePreference = 0) {
    const order = explicitBranchOrder(node, options);
    const normalChildren = childLayouts;
    const flippedChildren = [...childLayouts].reverse();

    function layoutWithChildOrder(childrenForOrder) {
      if (childrenForOrder.length === 2) {
        return layoutBinary(node, cloneLayout(childrenForOrder[0]), cloneLayout(childrenForOrder[1]), options, sidePreference);
      }
      return layoutNAry(node, childrenForOrder.map(cloneLayout), options, sidePreference);
    }

    if (order === 'normal') return layoutWithChildOrder(normalChildren);
    if (order === 'flip') return layoutWithChildOrder(flippedChildren);

    const normalLayout = layoutWithChildOrder(normalChildren);
    const flippedLayout = layoutWithChildOrder(flippedChildren);
    const normalScore = branchScore(normalLayout, options);
    const flippedScore = branchScore(flippedLayout, options);
    return flippedScore < normalScore ? flippedLayout : normalLayout;
  }

  function layoutTree(node, sidePreference = 0, options = {}) {
    const children = node.children || [];
    if (children.length === 0) return layoutLeaf(node);

    const localFirstSide = preferredFirstSide(options, sidePreference);
    if (children.length === 1) {
      const child = layoutTree(children[0], localFirstSide, options);
      return layoutUnary(node, child, localFirstSide, options);
    }

    // v4427: flip is no longer only global.  Every branching node can be
    // decided independently.  Global normal/flip remain available, but the
    // Default is normal/grammatical order. Auto modes can still flip branches
    // distance between syntactic/functionele equivalents such as subject/AGENS
    // and object/PATIENS.
    const childLayouts = children.map(child => layoutTree(child, 0, options));
    return composeBranch(node, childLayouts, options, localFirstSide);
  }

  function normalizeLayout(layout) {
    const dx = -Math.floor((layout.box.minX + layout.box.maxX) / 2);
    return shiftLayout(layout, dx, 0);
  }

  function reservedFreeSlotCount() {
    const n = Number(state.freeSlotCount);
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(6, Math.round(n)));
  }

  function lexFreeSlotCount() {
    const n = Number(state.lexFreeSlotCount);
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(8, Math.round(n)));
  }

  function validLexSlotPlacement(value = state.lexFreeSlotPlacement) {
    const id = String(value || 'after-lex');
    return LEX_SLOT_PLACEMENTS.some(option => option.id === id) ? id : 'after-lex';
  }

  function lexSlotPlacementLabel(id = validLexSlotPlacement()) {
    return LEX_SLOT_PLACEMENTS.find(option => option.id === id)?.label || id;
  }

  function lexSlotPlacementTip(id = validLexSlotPlacement()) {
    return LEX_SLOT_PLACEMENTS.find(option => option.id === id)?.tip || '';
  }

  function validLexInsertionContent(value = state.lexInsertionContent) {
    const id = String(value || 'empty');
    return LEX_INSERTION_CONTENTS.some(option => option.id === id) ? id : 'empty';
  }

  function lexInsertionContentDef(id = validLexInsertionContent()) {
    return LEX_INSERTION_CONTENTS.find(option => option.id === id) || LEX_INSERTION_CONTENTS[0];
  }

  function validLexInsertionTargets(value = state.lexInsertionExtensionTargets) {
    const allowed = new Set(LEX_INSERTION_EXTENSION_TARGETS.map(option => option.id));
    const out = [];
    (Array.isArray(value) ? value : []).forEach(item => {
      const id = String(item || '');
      if (allowed.has(id) && !out.includes(id)) out.push(id);
    });
    return out;
  }

  function lexInsertionTargetLabel(id) {
    return LEX_INSERTION_EXTENSION_TARGETS.find(option => option.id === id)?.label || id;
  }

  function lexInsertionTargetTip(id) {
    return LEX_INSERTION_EXTENSION_TARGETS.find(option => option.id === id)?.tip || '';
  }

  function insertionBranchExtensionRows() {
    return lexFreeSlotCount() > 0 ? Math.max(1, lexFreeSlotCount()) : 0;
  }

  function lexFreeSlotDescriptors() {
    const placement = validLexSlotPlacement();
    const content = lexInsertionContentDef();
    const extensionTargets = validLexInsertionTargets();
    return Array.from({ length: lexFreeSlotCount() }, (_, index) => ({
      id: `lex-insert-${index + 1}`,
      label: `LEX-insertie ${index + 1}`,
      kind: 'lex-axis-insertion-box',
      axis: 'LEX',
      placement,
      content: content.id,
      text: content.text,
      sub: content.sub,
      extension_targets: extensionTargets,
      insertion_grips_tree: false,
      effect: 'extends-selected-branches-or-box-boundaries',
      accepts_future_sources: ['other-lex-axis', 'other-tree', 'anaphoric-element', 'adverbial-headless-clause']
    }));
  }

  function reservedPortraitMenuSlots() {
    const n = Number(state.portraitMenuSlots);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(2, Math.round(n)));
  }

  function addOpnTopicalizationSlot(layout, rootId = null) {
    // v4462: centrale slotboxen blijven weg, maar de boom reserveert wel
    // verticale ruimte onder de wortel. Daardoor wordt de eerste tak langer
    // en ontstaat er zichtbaar plaats voor twee vrije slots (configureerbaar).
    // De feitelijke vulling blijft op de LEX-as: TOPIC/vooropplaatsing en V2/PV.
    const root = layout.nodes.find(n => n.id === rootId) || layout.nodes[0];
    const slotRows = reservedFreeSlotCount();
    if (!root || slotRows <= 0) return layout;

    for (const node of layout.nodes) {
      if (node.id !== root.id) node.y += slotRows;
    }
    for (const edge of layout.edges) {
      if (edge.from !== root.id) edge.fromY += slotRows;
      if (edge.to !== root.id) edge.toY += slotRows;
    }
    for (const box of layout.boxes) {
      if (box.nodeId === root.id) {
        box.maxY += slotRows;
      } else {
        box.minY += slotRows;
        box.maxY += slotRows;
        if (typeof box.rootY === 'number') box.rootY += slotRows;
      }
    }
    layout.box.maxY += slotRows;
    layout.freeSlotReservation = {
      count: slotRows,
      rootId: root.id,
      x: root.x,
      y1: root.y + 1,
      y2: root.y + slotRows
    };
    return layout;
  }

  function descendantIds(layout, rootId) {
    const out = new Set([rootId]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const edge of layout.edges || []) {
        if (out.has(edge.from) && !out.has(edge.to)) {
          out.add(edge.to);
          changed = true;
        }
      }
    }
    return out;
  }

  function recomputeLayoutBox(layout) {
    if (!layout?.nodes?.length) return layout;
    let box = { minX: layout.nodes[0].x, maxX: layout.nodes[0].x, minY: layout.nodes[0].y, maxY: layout.nodes[0].y };
    for (const n of layout.nodes.slice(1)) box = unionBox(box, { minX: n.x, maxX: n.x, minY: n.y, maxY: n.y });
    for (const b of layout.boxes || []) box = unionBox(box, b);
    layout.box = box;
    return layout;
  }

  function shiftSubtreeY(layout, rootNodeId, dy) {
    if (!layout || !rootNodeId || !dy) return layout;
    const ids = descendantIds(layout, rootNodeId);
    const original = new Map(layout.nodes.map(n => [n.id, { x: n.x, y: n.y }]));
    for (const n of layout.nodes) if (ids.has(n.id)) n.y += dy;
    for (const e of layout.edges) {
      if (ids.has(e.from)) e.fromY += dy;
      if (ids.has(e.to)) e.toY += dy;
    }
    for (const b of layout.boxes) {
      const rootInside = ids.has(b.nodeId);
      const containedShifted = [...ids].some(id => {
        const pos = original.get(id);
        return pos && pos.x >= b.minX && pos.x <= b.maxX && pos.y >= b.minY && pos.y <= b.maxY;
      });
      if (rootInside) {
        b.minY += dy;
        b.maxY += dy;
        if (typeof b.rootY === 'number') b.rootY += dy;
      } else if (containedShifted) {
        b.maxY += dy;
      }
    }
    return recomputeLayoutBox(layout);
  }

  function findLayoutNode(layout, target, mode = 'syntax') {
    if (!layout) return null;
    if (target === 'subject-branch') {
      return mode === 'functional'
        ? nodeByRoleOrPattern(layout, ['agens', 'subject'], ['ft-agens', 'agens'], { leaf: false })
        : nodeByRoleOrPattern(layout, ['subject'], ['np-subj', 'subject'], { leaf: false });
    }
    if (target === 'object-branch' || target === 'vp-boundary' || target === 'arg-boundary') {
      return mode === 'functional'
        ? nodeByRoleOrPattern(layout, ['patiens', 'object'], ['ft-patiens', 'patiens'], { leaf: false })
        : nodeByRoleOrPattern(layout, ['object'], ['np-obj', 'object'], { leaf: false });
    }
    if (target === 'verb-branch' || target === 'clause-boundary') {
      return mode === 'functional'
        ? nodeByRoleOrPattern(layout, ['pred', 'predicate'], ['ft-pred', 'pred'], { leaf: false })
        : nodeByRoleOrPattern(layout, ['predicate', 'aux', 'participle'], ['vp-perfectum', 'aux', 'vdw', 'v'], { leaf: false });
    }
    if (target === 's-boundary') return (layout.nodes || []).find(n => String(n.id || '').toLowerCase().includes('vp') || String(n.label || '').toLowerCase() === 'vp');
    return null;
  }

  function applyLexInsertionBranchExtensions(layout, mode = 'syntax') {
    const rows = insertionBranchExtensionRows();
    const targets = validLexInsertionTargets();
    if (!layout || rows <= 0 || !targets.length) return layout;
    const applied = [];
    let offset = 0;
    for (const target of targets) {
      const node = findLayoutNode(layout, target, mode);
      if (!node) continue;
      const dy = rows + offset;
      shiftSubtreeY(layout, node.id, dy);
      applied.push({ target, nodeId: node.id, rows: dy, label: lexInsertionTargetLabel(target) });
      offset += Math.max(0, rows - 1);
    }
    layout.lexInsertionExtensions = applied;
    return recomputeLayoutBox(layout);
  }

  function layoutFirstSide() {
    return state.functionalOrder === 'right-first' ? 1 : -1;
  }

  function branchModeLabel() {
    if (state.branchOrder === 'auto-compact') return 'per-vertakking: compact';
    if (state.branchOrder === 'auto-align') return 'per-vertakking: align';
    if (state.branchOrder === 'flip-all') return 'flip alle vertakkingen';
    return 'normale takvolgorde';
  }

  function getSyntaxLayout() {
    const firstSide = layoutFirstSide();
    return applyLexInsertionBranchExtensions(normalizeLayout(addOpnTopicalizationSlot(layoutTree(cloneTree(treeSpec()), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.syntaxRoot || 's')), 'syntax');
  }

  function layoutFunctionalRoleTree(order = 'left-first') {
    // v4427: dedicated non-binary functional OPN layout with topicalization slot.
    // The root is CLAUSE. It is not a predicate-root tree and not a binary tree.
    // Bottom-up idea: role leaf-box -> role-box -> CLAUSE n-ary box.
    // Placement uses free HOR/VER corridors: every role/root node and every leaf
    // receives a distinct row and a distinct column. left-first/right-first only
    // changes the first search direction and then alternates.
    const firstSide = order === 'right-first' ? 1 : -1;
    const labels = roleLabels();
    const roles = [
      { roleId: 'ft-agens', roleLabel: 'AGENS', role: 'agens', leafId: 'hond', leafLabel: labels.subject, cat: 'N' },
      { roleId: 'ft-pred', roleLabel: 'PRED', role: 'pred', leafId: 'bijt', leafLabel: labels.predicate, cat: 'V' },
      { roleId: 'ft-patiens', roleLabel: 'PATIENS', role: 'patiens', leafId: 'man', leafLabel: labels.object, cat: 'N' }
    ];

    const nodes = [{ id: 'ft-clause', label: 'CLAUSE', cat: 'CLAUSE', role: 'top', kind: 'role-root', x: 0, y: 0 }];
    const edges = [];
    const boxes = [];
    const occupiedRows = new Set([0]);
    const occupiedCols = new Set([0]);
    const occupiedBoxes = [];

    function cellBox(x, y) { return { minX: x, maxX: x, minY: y, maxY: y }; }
    function freeAt(roleBox) {
      for (const b of occupiedBoxes) if (boxesOverlap(roleBox, b, 0)) return false;
      if (occupiedRows.has(roleBox.roleY) || occupiedRows.has(roleBox.leafY)) return false;
      if (occupiedCols.has(roleBox.roleX) || occupiedCols.has(roleBox.leafX)) return false;
      return true;
    }
    function reserve(roleBox) {
      occupiedRows.add(roleBox.roleY);
      occupiedRows.add(roleBox.leafY);
      occupiedCols.add(roleBox.roleX);
      occupiedCols.add(roleBox.leafX);
      occupiedBoxes.push({ minX: roleBox.minX, maxX: roleBox.maxX, minY: roleBox.minY, maxY: roleBox.maxY });
    }
    function findRoleBox(i) {
      const side = (i % 2 === 0 ? firstSide : -firstSide);
      const mirror = side < 0 ? -1 : 1;
      const baseY = 1 + i * 2;
      // Candidate order: first intended side; then wider on that side; then a
      // mirrored fallback. Rows only move down, never reuse an occupied row.
      for (let extraY = 0; extraY <= 20; extraY++) {
        const roleY = baseY + extraY;
        const leafY = roleY + 1;
        for (let d = 1; d <= 18; d++) {
          for (const s of [mirror, -mirror]) {
            const roleX = s * (1 + i + d - 1);
            const leafX = s * (2 + i + d - 1);
            const minX = Math.min(roleX, leafX);
            const maxX = Math.max(roleX, leafX);
            const roleBox = { roleX, roleY, leafX, leafY, minX, maxX, minY: roleY, maxY: leafY };
            if (freeAt(roleBox)) return roleBox;
          }
        }
      }
      const fallbackX = mirror * (i + 2);
      return { roleX: fallbackX, roleY: baseY + 30, leafX: fallbackX + mirror, leafY: baseY + 31, minX: Math.min(fallbackX, fallbackX + mirror), maxX: Math.max(fallbackX, fallbackX + mirror), minY: baseY + 30, maxY: baseY + 31 };
    }

    roles.forEach((item, i) => {
      const b = findRoleBox(i);
      reserve(b);
      nodes.push({ id: item.roleId, label: item.roleLabel, cat: item.roleLabel, role: item.role, kind: 'role', x: b.roleX, y: b.roleY });
      nodes.push({ id: item.leafId, label: item.leafLabel, cat: item.cat, role: item.role, kind: 'leaf', x: b.leafX, y: b.leafY });
      edges.push({ from: 'ft-clause', to: item.roleId, fromX: 0, fromY: 0, toX: b.roleX, toY: b.roleY });
      edges.push({ from: item.roleId, to: item.leafId, fromX: b.roleX, fromY: b.roleY, toX: b.leafX, toY: b.leafY });
      boxes.push({ id: `box-${item.roleId}`, label: `ROLE ${item.roleLabel}`, nodeId: item.roleId, rootX: b.roleX, rootY: b.roleY, minX: b.minX, maxX: b.maxX, minY: b.minY, maxY: b.maxY, roleBox: true });
    });

    let box = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    for (const n of nodes) box = unionBox(box, cellBox(n.x, n.y));
    boxes.unshift({ id: 'box-ft-clause', label: 'BOX CLAUSE', nodeId: 'ft-clause', rootX: 0, rootY: 0, minX: box.minX, maxX: box.maxX, minY: box.minY, maxY: box.maxY, clauseBox: true });
    return { node: { id: 'ft-clause', label: 'CLAUSE', kind: 'role-root' }, nodes, edges, boxes, box };
  }

  function getFunctionalLayout() {
    const firstSide = layoutFirstSide();
    return applyLexInsertionBranchExtensions(normalizeLayout(addOpnTopicalizationSlot(layoutTree(cloneTree(functionalSpec()), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.functionalRoot || 'ft-clause')), 'functional');
  }

  function sortChildrenByRanks(children = [], rankFn) {
    return [...children].sort((a, b) => {
      const ra = rankFn(a);
      const rb = rankFn(b);
      if (ra !== rb) return ra - rb;
      return String(a.id || a.label || '').localeCompare(String(b.id || b.label || ''));
    });
  }

  function southAwareSyntaxSpec(mode = state.southLogicalMode || 'SOV') {
    const tree = cloneTree(treeSpec());
    const rank = southModeRankMap(mode);
    function visit(node) {
      if (!node?.children?.length) return;
      node.children.forEach(visit);
      const label = String(node.label || node.cat || node.id || '').toLowerCase();
      const id = String(node.id || '').toLowerCase();
      if (label === 's' || id === 's') {
        node.children = sortChildrenByRanks(node.children, child => {
          const cid = String(child.id || '').toLowerCase();
          const cl = String(child.label || child.cat || '').toLowerCase();
          const isSubject = cid.includes('np-subj') || (cl === 'np' && String(child.role || '').toLowerCase() === 'subject');
          const isVp = cid.includes('vp') || cl === 'vp';
          if (isSubject) return rank.get('S') ?? 0;
          if (isVp) return Math.min(rank.get('O') ?? 9, rank.get('V') ?? 9);
          return 99;
        });
      }
      if (label === 'vp' || id.includes('vp')) {
        node.children = sortChildrenByRanks(node.children, child => {
          const cid = String(child.id || '').toLowerCase();
          const cl = String(child.label || child.cat || '').toLowerCase();
          const isObject = cid.includes('np-obj') || (cl === 'np' && String(child.role || '').toLowerCase() === 'object');
          const isVerbish = cid.includes('v') || cid.includes('aux') || cid.includes('vdw') || cl === 'v' || cl === 'aux' || cl === 'vdw' || cl === 'vp';
          if (isObject) return rank.get('O') ?? 0;
          if (isVerbish) return rank.get('V') ?? 1;
          return 99;
        });
      }
    }
    visit(tree);
    return tree;
  }

  function southAwareFunctionalSpec(mode = state.southLogicalMode || 'SOV') {
    const tree = cloneTree(functionalSpec());
    const rank = southModeRankMap(mode);
    function visit(node) {
      if (!node?.children?.length) return;
      node.children.forEach(visit);
      const label = String(node.label || node.cat || node.id || '').toLowerCase();
      const id = String(node.id || '').toLowerCase();
      if (label === 'clause' || id.includes('clause')) {
        node.children = sortChildrenByRanks(node.children, child => {
          const cid = String(child.id || '').toLowerCase();
          const cl = String(child.label || child.cat || '').toLowerCase();
          const isPred = cid.includes('pred') || cl === 'pred';
          const isArgs = cid.includes('arg') || cl.includes('arg-struct');
          if (isPred) return rank.get('V') ?? 0;
          if (isArgs) return Math.min(rank.get('S') ?? 9, rank.get('O') ?? 9);
          return 99;
        });
      }
      if (id.includes('arg') || label.includes('arg-struct')) {
        node.children = sortChildrenByRanks(node.children, child => {
          const cid = String(child.id || '').toLowerCase();
          const cl = String(child.label || child.cat || '').toLowerCase();
          const isSubj = cid.includes('agens') || cl === 'agens';
          const isObj = cid.includes('patiens') || cl === 'patiens';
          if (isSubj) return rank.get('S') ?? 0;
          if (isObj) return rank.get('O') ?? 1;
          return 99;
        });
      }
    }
    visit(tree);
    return tree;
  }

  function getSouthAwareSyntaxLayout() {
    const firstSide = layoutFirstSide();
    return applyLexInsertionBranchExtensions(normalizeLayout(addOpnTopicalizationSlot(layoutTree(southAwareSyntaxSpec(), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.syntaxRoot || 's')), 'syntax');
  }

  function getSouthAwareFunctionalLayout() {
    const firstSide = layoutFirstSide();
    return applyLexInsertionBranchExtensions(normalizeLayout(addOpnTopicalizationSlot(layoutTree(southAwareFunctionalSpec(), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.functionalRoot || 'ft-clause')), 'functional');
  }

  function southLogicalItemsFromCentralLayout(layout, origin, projectionKind = 'syntax', order = southLogicalOrder()) {
    const labels = roleLabels();
    const findNode = (which) => {
      if (projectionKind === 'functional') {
        if (which === 'S') return nodeByRoleOrPattern(layout, ['agens', 'subject'], ['agens', 'ft-agens'], { leaf: false }) || nodeByRoleOrPattern(layout, ['agens', 'subject'], ['agens', 'ft-agens']);
        if (which === 'O') return nodeByRoleOrPattern(layout, ['patiens', 'object'], ['patiens', 'ft-patiens'], { leaf: false }) || nodeByRoleOrPattern(layout, ['patiens', 'object'], ['patiens', 'ft-patiens']);
        return nodeByRoleOrPattern(layout, ['pred', 'predicate'], ['pred', 'ft-pred', 'clause'], { leaf: false }) || nodeByRoleOrPattern(layout, ['pred', 'predicate'], ['pred', 'ft-pred', 'clause']);
      }
      if (which === 'S') return nodeByRoleOrPattern(layout, ['subject'], ['np-subj', 'subject'], { leaf: false }) || nodeByRoleOrPattern(layout, ['subject'], ['np-subj', 'subject']);
      if (which === 'O') return nodeByRoleOrPattern(layout, ['object'], ['np-obj', 'object'], { leaf: false }) || nodeByRoleOrPattern(layout, ['object'], ['np-obj', 'object']);
      return nodeByRoleOrPattern(layout, ['predicate', 'aux', 'participle'], ['vp-perfectum', 'aux', 'vdw', 'v'], { leaf: false }) || nodeByRoleOrPattern(layout, ['predicate', 'aux', 'participle'], ['vp-perfectum', 'aux', 'vdw', 'v']);
    };
    const meta = {
      S: { title: 'Subject', word: String(labels.subject || '').toUpperCase() },
      O: { title: 'Object', word: String(labels.object || '').toUpperCase() },
      V: { title: 'Verb', word: String(labels.predicate || '').toUpperCase() }
    };
    return (order || []).map(which => {
      const node = findNode(which);
      return {
        short: which,
        title: meta[which]?.title || which,
        word: meta[which]?.word || which,
        px: node ? px(node.x, origin) : null,
        sourceTopY: node ? py(node.y, origin) + 22 : null
      };
    }).filter(item => Number.isFinite(item.px));
  }

  function isMobileViewport() {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  }

  function isPortraitGridFirstViewport() {
    if (typeof window === 'undefined') return false;
    const mq = window.matchMedia ? window.matchMedia('(orientation: portrait)').matches : false;
    const bySize = (window.innerHeight || 0) >= (window.innerWidth || 1);
    return mq || bySize;
  }

  function isPortraitMobileViewport() {
    // v4482: grid-first and fit-height are no longer mobile-only.
    // The canvas height is based on the actual viewBox on every platform.
    return true;
  }

  function syncPortraitStageMode() {
    const portrait = isPortraitGridFirstViewport();
    document.body?.classList.add('grid-first-all');
    document.documentElement?.classList.add('grid-first-all');
    document.body?.classList.toggle('portrait-grid-first', portrait);
    document.documentElement?.classList.toggle('portrait-grid-first', portrait);
  }

  function syncPortraitMenuSpace() {
    // v4482: de oude numerieke onderruimte blijft op 0. De relevante instelling
    // is nu: welke benoemde menu's mogen boven het grid staan.
    document.documentElement?.style.setProperty('--portrait-menu-reserve', '0px');
    document.documentElement?.style.setProperty('--portrait-menu-slots', '0');
  }

  function validTopMenuIds() {
    return new Set(TOP_MENU_CHOICES.map(choice => choice.id));
  }

  function normalizeTopMenusAbove(value = state.topMenusAbove) {
    const allowed = validTopMenuIds();
    const out = [];
    (Array.isArray(value) ? value : []).forEach(item => {
      const id = String(item || '');
      if (allowed.has(id) && !out.includes(id) && out.length < TOP_MENU_MAX) out.push(id);
    });
    return out;
  }

  function topMenuLabel(id) {
    return TOP_MENU_CHOICES.find(choice => choice.id === id)?.label || id;
  }

  function topMenuTip(id) {
    return TOP_MENU_CHOICES.find(choice => choice.id === id)?.tip || '';
  }

  function validRightMenuMode(value = state.rightMenuMode) {
    const id = String(value || 'wide');
    return RIGHT_MENU_WIDTHS.some(option => option.id === id) ? id : 'wide';
  }

  function rightMenuProfile() {
    return RIGHT_MENU_WIDTHS.find(option => option.id === validRightMenuMode()) || RIGHT_MENU_WIDTHS[1];
  }

  function rightMenuLabel() {
    return rightMenuProfile().label.replace(/^rechterkolom:\s*/i, '');
  }

  function paneSplitterWidth() {
    return isPortraitGridFirstViewport() ? 18 : 12;
  }

  function syncTopMenuPlacement() {
    state.topMenusAbove = normalizeTopMenusAbove();
    const body = document.body;
    const root = document.documentElement;
    if (!body || !root) return;
    TOP_MENU_CHOICES.forEach(choice => {
      body.classList.toggle(choice.cssClass, state.topMenusAbove.includes(choice.id));
      root.classList.toggle(choice.cssClass, state.topMenusAbove.includes(choice.id));
    });
    const value = state.topMenusAbove.length ? state.topMenusAbove.join(' ') : 'none';
    body.dataset.topMenusAbove = value;
    root.dataset.topMenusAbove = value;
  }

  function renderTopMenuChoiceControls() {
    const selected = normalizeTopMenusAbove();
    state.topMenusAbove = selected;
    const selectedSet = new Set(selected);
    const summary = selected.length
      ? `Boven grid: ${selected.map(topMenuLabel).join(' + ')}. Alle ${TOP_MENU_MAX} benoemde menu’s kunnen boven het grid; overige menu’s staan onder het grid.`
      : `Geen menu boven het grid. Alle ${TOP_MENU_MAX} benoemde menu’s kunnen boven het grid; standaard staat alles onder het grid.`;
    document.querySelectorAll('[data-top-menu-choice]').forEach(input => {
      const id = input.getAttribute('data-top-menu-choice');
      const checked = selectedSet.has(id);
      input.checked = checked;
      input.disabled = !checked && selected.length >= TOP_MENU_MAX;
      const label = topMenuLabel(id);
      const tip = topMenuTip(id);
      input.title = `${label}. ${tip} Alle ${TOP_MENU_MAX} benoemde menu’s kunnen boven het grid.`;
      const wrapper = input.closest('label');
      if (wrapper) wrapper.title = input.title;
    });
    document.querySelectorAll('[data-top-menu-count]').forEach(node => {
      node.textContent = `${selected.length}/${TOP_MENU_MAX}`;
    });
    document.querySelectorAll('[data-top-menu-help]').forEach(node => {
      node.textContent = summary;
      node.title = selected.map(topMenuTip).filter(Boolean).join(' ');
    });
  }

  function setTopMenuChoice(id, checked) {
    const allowed = validTopMenuIds();
    if (!allowed.has(id)) return;
    const current = normalizeTopMenusAbove();
    if (checked) {
      if (!current.includes(id)) {
        if (current.length >= TOP_MENU_MAX) {
          if (els.actionFeedback) els.actionFeedback.textContent = `Alle benoemde menu’s kunnen boven het grid.`;
          renderTopMenuChoiceControls();
          return;
        }
        current.push(id);
      }
    } else {
      const index = current.indexOf(id);
      if (index >= 0) current.splice(index, 1);
    }
    state.topMenusAbove = current;
    resetManualViewBox();
    render();
  }

  function workspaceForStage() {
    return els.canvasWrap?.closest?.('.workspace') || null;
  }

  function clampPanePixels(stageWidth, menuWidth, totalWidth) {
    const splitterWidth = paneSplitterWidth();
    const total = Math.max(320, Number(totalWidth) || window.innerWidth || 360);
    const profile = rightMenuProfile();
    const maxMenu = Math.max(170, total - splitterWidth - 120);
    const requestedMinMenu = Math.max(Number(profile.minPx) || 320, Math.round(total * (Number(profile.minFraction) || 0.42)));
    const minMenu = Math.max(150, Math.min(maxMenu, requestedMinMenu));
    const portrait = isPortraitGridFirstViewport();
    const minStage = portrait
      ? Math.min(150, Math.max(92, Math.round(total * 0.24)))
      : Math.min(260, Math.max(120, Math.round(total * 0.18)));
    let stage = Number(stageWidth);
    let menu = Number(menuWidth);
    if (!Number.isFinite(stage) || !Number.isFinite(menu)) {
      menu = Math.min(maxMenu, Math.max(minMenu, Math.round(total * (Number(profile.preferredFraction) || 0.5))));
      stage = total - splitterWidth - menu;
    }
    menu = Math.max(minMenu, Math.min(maxMenu, menu));
    stage = total - splitterWidth - menu;
    if (stage < minStage && maxMenu > minMenu) {
      stage = Math.max(120, Math.min(minStage, total - splitterWidth - minMenu));
      menu = Math.max(minMenu, total - splitterWidth - stage);
    }
    return { stageWidth: Math.round(stage), menuWidth: Math.round(menu), splitterWidth, totalWidth: total };
  }

  function neededStageWidthFromFit(fit, total, minMenu, splitterWidth = paneSplitterWidth()) {
    const portrait = isPortraitGridFirstViewport();
    const maxStage = Math.max(portrait ? 92 : 120, total - splitterWidth - minMenu);
    if (!fit || !Number.isFinite(fit.w) || fit.w <= 0 || !Number.isFinite(fit.h) || fit.h <= 0) {
      return portrait
        ? Math.max(92, Math.min(maxStage, Math.round(total * 0.40)))
        : Math.max(160, maxStage);
    }
    const ratio = Math.max(0.16, fit.h / fit.w);
    const topMenuReserve = Math.min(170, normalizeTopMenusAbove().length * 42);
    const maxHeight = Math.min(880, Math.max(220, (window.innerHeight || 720) - 108 - topMenuReserve));
    const widthForHeight = Math.ceil(maxHeight / ratio);
    if (portrait) {
      // Mobile portrait: het grid krijgt niet automatisch de hele resterende
      // breedte. Bepaal een bruikbare bovengrens voor boom + assen en geef de
      // rest aan de rechterkolom. De grens blijft via splitter verschuifbaar.
      const portraitCap = Math.max(96, Math.round(total * 0.40));
      return Math.max(92, Math.min(maxStage, portraitCap, widthForHeight));
    }
    return Math.max(120, Math.min(maxStage, widthForHeight));
  }

  function syncRightMenuSplit(fit = null) {
    const workspace = workspaceForStage();
    if (!workspace) return null;
    const total = Math.max(320, workspace.clientWidth || window.innerWidth || 360);
    const splitterWidth = paneSplitterWidth();
    const profile = rightMenuProfile();
    const maxMenu = Math.max(170, total - splitterWidth - 120);
    const minMenu = Math.max(150, Math.min(maxMenu, Math.max(Number(profile.minPx) || 320, Math.round(total * (Number(profile.minFraction) || 0.42)))));

    let stageWidth;
    let menuWidth;
    if (state.paneSplitManual && Number.isFinite(Number(state.rightMenuWidth))) {
      menuWidth = Number(state.rightMenuWidth);
      stageWidth = total - splitterWidth - menuWidth;
    } else {
      stageWidth = neededStageWidthFromFit(fit, total, minMenu, splitterWidth);
      menuWidth = total - splitterWidth - stageWidth;
      if (!fit || !Number.isFinite(fit.w)) {
        menuWidth = Math.max(minMenu, Math.round(total * (Number(profile.preferredFraction) || 0.5)));
        stageWidth = total - splitterWidth - menuWidth;
      }
    }

    const clamped = clampPanePixels(stageWidth, menuWidth, total);
    workspace.style.setProperty('--stage-pane-width', `${clamped.stageWidth}px`);
    workspace.style.setProperty('--side-pane-width', `${clamped.menuWidth}px`);
    workspace.style.setProperty('--pane-splitter-width', `${clamped.splitterWidth}px`);
    document.documentElement?.style.setProperty('--stage-pane-width', `${clamped.stageWidth}px`);
    document.documentElement?.style.setProperty('--side-pane-width', `${clamped.menuWidth}px`);
    return clamped;
  }

  function syncMobileCanvasHeight(box = null) {
    syncPortraitStageMode();
    if (!els.canvasWrap) return;
    syncPortraitMenuSpace();
    // v4482: het gridvenster wordt gemaximeerd op de actuele fit-box
    // van boom + assen. Het canvas schaalt dus niet groter dan nodig.
    const fit = box || parseViewBox();
    const validFit = fit && Number.isFinite(fit.w) && fit.w > 0 && Number.isFinite(fit.h) && fit.h > 0;
    const workspace = workspaceForStage();
    const split = syncRightMenuSplit(fit);
    const ratio = validFit ? Math.max(0.16, fit.h / fit.w) : 0.62;
    const stageWidth = split?.stageWidth || Math.min(620, window.innerWidth || 620);
    const bottomReserve = isPortraitGridFirstViewport() ? 92 + 12 : 78;
    const maxAvailable = Math.max(180, Math.min(880, (window.innerHeight || 640) - bottomReserve));
    const needed = Math.ceil(stageWidth * ratio);
    const height = Math.max(140, Math.min(maxAvailable, needed));
    els.canvasWrap.style.setProperty('--mobile-fit-height', `${height}px`);
    els.canvasWrap.style.setProperty('--stage-fit-width', `${Math.ceil(stageWidth)}px`);
    workspace?.style.setProperty('--stage-fit-width', `${Math.ceil(stageWidth)}px`);
  }

  function layoutVisualProfile() {
    const mode = state.layoutDensity || 'auto';
    const mobile = isMobileViewport();
    if (mobile && mode === 'auto') return { cellX: BASE_CELL * 1.08, cellY: BASE_CELL * 0.86, fontScale: 1.04, label: 'mobile auto' };
    if (mode === 'compact') return { cellX: BASE_CELL, cellY: BASE_CELL, fontScale: 1.00, label: 'compact' };
    if (mode === 'wide') return { cellX: BASE_CELL * 1.34, cellY: BASE_CELL * 0.86, fontScale: 1.08, label: 'breed/lager' };
    if (mode === 'large') return { cellX: BASE_CELL * 1.46, cellY: BASE_CELL * 0.82, fontScale: 1.16, label: 'breed + groter font' };
    // Auto: Assen/Bron/LOG krijgen meer horizontale ruimte en minder verticale
    // hoogte; LEX/SYNTAX blijven rustiger omdat zij geen diepe boom tonen.
    if (['axes', 'source', 'log'].includes(state.projection)) {
      return { cellX: BASE_CELL * 1.26, cellY: BASE_CELL * 0.87, fontScale: 1.08, label: 'auto breed/lager' };
    }
    return { cellX: BASE_CELL, cellY: BASE_CELL, fontScale: 1.00, label: 'auto compact' };
  }

  function cellX() { return layoutVisualProfile().cellX; }
  function cellY() { return layoutVisualProfile().cellY; }
  function px(x, origin) { return origin.x + x * cellX(); }
  function py(y, origin) { return origin.y + y * cellY(); }

  function drawGrid(g, width = 2600, height = 1600) {
    const grid = svgEl('g', { class: 'grid' });
    const sx = cellX() / 2;
    const sy = cellY() / 2;
    const minX = -1200;
    const minY = -420;
    for (let x = minX, i = 0; x <= width; x += sx, i++) {
      grid.appendChild(svgEl('line', { x1: x, y1: minY, x2: x, y2: height, class: i % 2 === 0 ? 'grid-line major' : 'grid-line' }));
    }
    for (let y = minY, i = 0; y <= height; y += sy, i++) {
      grid.appendChild(svgEl('line', { x1: minX, y1: y, x2: width, y2: y, class: i % 2 === 0 ? 'grid-line major' : 'grid-line' }));
    }
    grid.appendChild(svgEl('line', { x1: minX, y1: 0, x2: width, y2: 0, class: 'grid-axis' }));
    grid.appendChild(svgEl('line', { x1: 0, y1: minY, x2: 0, y2: height, class: 'grid-axis' }));
    g.appendChild(grid);
  }

  function subtreeBoxArea(box) {
    return (box.maxX - box.minX + 1) * (box.maxY - box.minY + 1);
  }

  function growthSupportedProjection(projection = state.projection) {
    return ['axes', 'source', 'log'].includes(projection);
  }

  function growthActive() {
    return !!state.growthEnabled && growthSupportedProjection(state.projection);
  }

  function setProjection(projection) {
    const next = projection || 'axes';
    if (next !== state.projection) resetManualViewBox();
    if (growthSupportedProjection(state.projection) && state.growthStep > 0) {
      state.lastSupportedGrowthStep = state.growthStep;
    }
    state.projection = next;
    if (!growthSupportedProjection(next)) {
      stopGrowthPlayback();
      return;
    }
    if (state.growthEnabled && state.growthStep === 0 && state.lastSupportedGrowthStep > 0) {
      state.growthStep = Math.min(state.lastSupportedGrowthStep, growthStepMax());
    }
  }

  function activeCentralSpec() {
    if (state.centerMode === 'functional' || state.projection === 'log') return functionalSpec();
    return treeSpec();
  }

  function collectGrowthMetrics(root) {
    const byId = new Map();
    let count = 0;
    function visit(node, depth = 0) {
      count += 1;
      let height = 0;
      for (const child of node.children || []) {
        const childInfo = visit(child, depth + 1);
        height = Math.max(height, childInfo.height + 1);
      }
      const info = { id: node.id, depth, height, node };
      byId.set(node.id, info);
      return info;
    }
    const rootInfo = visit(root, 0);
    return { byId, maxHeight: rootInfo.height, rootId: root.id, count };
  }

  function growthStepMax() {
    if (!growthSupportedProjection()) return 0;
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const structureSteps = metrics.count;
    if (state.projection === 'axes') {
      // v4450: de maximale groeistap moet alle lokale LEX-Wissels tellen.
      // Anders stopt de slider/playback na de eerste Wissel, waardoor bij
      // HOND BIJT MAN de tweede stap (BIJT → slot 2 + t[V]) nooit zichtbaar wordt.
      return structureSteps + orderedLexMovements(activeLexItems()).length + 3;
    }
    return structureSteps + 1;
  }

  function clampGrowthStep(value) {
    const max = growthStepMax();
    const n = Math.max(0, Math.min(max, Number(value) || 0));
    return n;
  }

  function stopGrowthPlayback() {
    if (state.growthTimer) {
      clearInterval(state.growthTimer);
      state.growthTimer = null;
    }
  }

  function setGrowthStep(value, rerender = true) {
    if (!growthSupportedProjection()) {
      stopGrowthPlayback();
      if (rerender) render();
      return;
    }
    state.growthStep = clampGrowthStep(value);
    if (state.growthStep > 0) state.lastSupportedGrowthStep = state.growthStep;
    if (state.growthStep >= growthStepMax()) stopGrowthPlayback();
    if (rerender) render();
  }

  function toggleGrowthPlayback() {
    // v4458: deze functie ontbrak in v4453. Daardoor stopte registerEvents()
    // vóór de eerste init-render bij addEventListener(..., toggleGrowthPlayback),
    // met als gevolg: geen boom bij start en een Play-knop zonder werking.
    if (!growthSupportedProjection()) {
      setProjection('axes');
    }
    const max = growthStepMax();
    state.growthEnabled = true;
    if (state.growthTimer) {
      stopGrowthPlayback();
      render();
      return;
    }
    if (state.growthStep >= max) state.growthStep = 0;
    render();
    state.growthTimer = window.setInterval(() => {
      const currentMax = growthStepMax();
      if (!state.growthEnabled || !growthSupportedProjection()) {
        stopGrowthPlayback();
        render();
        return;
      }
      if (state.growthStep >= currentMax) {
        stopGrowthPlayback();
        render();
        return;
      }
      setGrowthStep(state.growthStep + 1);
    }, 700);
  }

  function orderedGrowthNodes(layout, metrics) {
    // v4451: groei start bij de wortel/topknoop en loopt daarna naar
    // lagere knopen. In v4450 werden bladeren eerst getoond; daardoor kon
    // de presentatie beginnen met één geïsoleerde terminal zoals HOND.
    const byId = new Map(layout.nodes.map((node, sourceIndex) => [node.id, { node, sourceIndex }]));
    const ordered = [];
    const seen = new Set();

    function childSort(a, b) {
      const la = byId.get(a.id)?.node || {};
      const lb = byId.get(b.id)?.node || {};
      const ay = Number.isFinite(la.y) ? la.y : 0;
      const by = Number.isFinite(lb.y) ? lb.y : 0;
      if (ay !== by) return ay - by;
      const ax = Number.isFinite(la.x) ? la.x : 0;
      const bx = Number.isFinite(lb.x) ? lb.x : 0;
      if (ax !== bx) return ax - bx;
      return String(a.id).localeCompare(String(b.id));
    }

    function visit(specNode) {
      if (!specNode || seen.has(specNode.id)) return;
      const entry = byId.get(specNode.id);
      if (entry) {
        ordered.push(entry);
        seen.add(specNode.id);
      }
      [...(specNode.children || [])].sort(childSort).forEach(visit);
    }

    visit(activeCentralSpec());

    // Safety: voeg eventuele layout-knopen toe die niet in de actieve spec
    // voorkomen, bijvoorbeeld extra lokale slots. Die komen pas na de boom.
    for (const entry of byId.values()) {
      if (!seen.has(entry.node.id)) ordered.push(entry);
    }
    return ordered;
  }

  function growthPlanForLayout(layout) {
    if (!growthActive()) return { active: false, current: Infinity, max: 0, nodeStep: new Map(), structureStep: 0, slotStep: 0, lexBaseStep: 0, lexMovementStartStep: 0, lexMovementCount: 0, projectionStep: 0 };
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const orderedNodes = orderedGrowthNodes(layout, metrics);
    const structureStep = Math.max(1, orderedNodes.length);
    const slotStep = structureStep;
    const lexBaseStep = structureStep + 1;
    const lexMovementCount = orderedLexMovements(activeLexItems()).length;
    const lexMovementStartStep = lexBaseStep + 1;
    const projectionStep = lexBaseStep + lexMovementCount + 1;
    const max = state.projection === 'axes' ? projectionStep : structureStep;
    if (state.growthStep > max) state.growthStep = max;
    const nodeStep = new Map();
    orderedNodes.forEach(({ node }, index) => nodeStep.set(node.id, index + 1));
    return { active: true, current: state.growthStep, max, nodeStep, structureStep, slotStep, lexBaseStep, lexMovementStartStep, lexMovementCount, projectionStep };
  }

  function visibleAt(plan, step) {
    return !plan || !plan.active || step <= plan.current;
  }

  function nodeGrowthStep(plan, nodeId) {
    return plan?.nodeStep?.get(nodeId) || 1;
  }

  function boxGrowthStep(plan, box) {
    return nodeGrowthStep(plan, box.nodeId);
  }

  function edgeGrowthStep(plan, edge) {
    return Math.max(nodeGrowthStep(plan, edge.from), nodeGrowthStep(plan, edge.to));
  }

  function growthLabel() {
    if (!growthSupportedProjection()) return 'Groei: niet actief in deze projectie';
    const max = growthStepMax();
    const step = clampGrowthStep(state.growthStep);
    if (!state.growthEnabled) return `Groei uit · max ${max}`;
    if (step === 0) return `stap 0/${max}: raster/titels`;
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const structureStep = metrics.count;
    if (step <= structureStep) return `stap ${step}/${max}: boom groeit knoop voor knoop`;
    if (state.projection === 'axes') {
      const movementCount = orderedLexMovements(activeLexItems()).length;
      const lexBaseStep = structureStep + 1;
      const movementStart = lexBaseStep + 1;
      if (step === lexBaseStep) return `stap ${step}/${max}: LEX-basisprojectie`;
      if (step >= movementStart && step < movementStart + movementCount) {
        const currentMove = step - movementStart + 1;
        return `stap ${step}/${max}: LEX-Wissel ${currentMove}/${movementCount}`;
      }
    }
    return `stap ${step}/${max}: LEX-resultaat en projectiepanelen`;
  }

  function orderedSubtreeBoxes(layout) {
    // v4427: render-order is explicit, not an accidental side effect of the
    // layout recursion or of JavaScript sort stability.  Large background boxes
    // are drawn first.  Equal-sized boxes use a deterministic spatial tie-break:
    // top-to-bottom, then left-to-right, then original layout order.
    return [...layout.boxes]
      .map((box, index) => ({ box, index }))
      .filter(item => !item.box.leaf)
      .sort((a, b) => {
        const areaDiff = subtreeBoxArea(b.box) - subtreeBoxArea(a.box);
        if (areaDiff) return areaDiff;
        const yDiff = a.box.minY - b.box.minY;
        if (yDiff) return yDiff;
        const xDiff = a.box.minX - b.box.minX;
        if (xDiff) return xDiff;
        return a.index - b.index;
      });
  }

  function drawSubtreeBoxes(g, layout, origin, growthPlan = null) {
    const ordered = orderedSubtreeBoxes(layout).filter(({ box }) => visibleAt(growthPlan, boxGrowthStep(growthPlan, box)));
    const rectLayer = svgEl('g', { class: 'subtree-box-rect-layer' });
    const captionLayer = svgEl('g', { class: 'subtree-box-caption-layer' });

    for (const { box } of ordered) {
      const x = px(box.minX - 0.75, origin);
      const y = py(box.minY - 0.55, origin);
      const w = (box.maxX - box.minX + 1.5) * cellX();
      const h = (box.maxY - box.minY + 1.1) * cellY();
      rectLayer.appendChild(svgEl('rect', { x, y, width: w, height: h, rx: 18, class: 'jan-subtree-box' }));
    }

    for (const { box } of ordered) {
      const x = px(box.minX - 0.75, origin);
      const y = py(box.minY - 0.55, origin);
      captionLayer.appendChild(svgEl('text', { x: x + 14, y: y + 24, class: 'jan-box-caption' }, `BOX ${box.label.replace(/^BOX\s+/i, '')}`));
    }

    g.appendChild(rectLayer);
    g.appendChild(captionLayer);
  }

  function drawOpnTopicalizationSlot(g, layout, origin, growthPlan = null) {
    // v4459: centrale slotboxen zijn bewust verwijderd. De zichtbare wissels
    // horen op de LEX-as thuis en worden daar in Play-modus getoond.
    return;
  }

  function drawTreeEdges(g, layout, origin, growthPlan = null) {
    if (!state.showRelations) return;
    for (const edge of layout.edges) {
      if (!visibleAt(growthPlan, edgeGrowthStep(growthPlan, edge))) continue;
      g.appendChild(svgEl('line', {
        x1: px(edge.fromX, origin), y1: py(edge.fromY, origin) + 18,
        x2: px(edge.toX, origin), y2: py(edge.toY, origin) - 18,
        class: 'tree-edge syntax-tree-edge'
      }));
    }
  }

  function orderedTreeNodes(layout) {
    // v4427: actual node rendering is also explicit.  Shapes are drawn before
    // labels.  Within each layer, ties follow spatial order: top-to-bottom,
    // left-to-right, then original layout order.
    return [...layout.nodes]
      .map((node, index) => ({ node, index }))
      .sort((a, b) => {
        const yDiff = a.node.y - b.node.y;
        if (yDiff) return yDiff;
        const xDiff = a.node.x - b.node.x;
        if (xDiff) return xDiff;
        return a.index - b.index;
      });
  }

  function nodeRenderClass(node) {
    return `tree-node ${node.kind === 'leaf' ? 'leaf-node' : (node.kind === 'role' ? 'role-node' : 'cat-node')} ${state.selectedNodeId === node.id ? 'selected' : ''}`;
  }

  function makeSelectable(group, node, selectable) {
    if (selectable) group.addEventListener('click', () => selectNode(node.id));
    return group;
  }

  function drawTreeNodes(g, layout, origin, selectable = true, growthPlan = null) {
    const ordered = orderedTreeNodes(layout).filter(({ node }) => visibleAt(growthPlan, nodeGrowthStep(growthPlan, node.id)));
    const shapeLayer = svgEl('g', { class: 'node-shape-layer' });
    const labelLayer = svgEl('g', { class: 'node-label-layer' });

    for (const { node } of ordered) {
      const cx = px(node.x, origin);
      const cy = py(node.y, origin);
      const group = makeSelectable(svgEl('g', { class: `${nodeRenderClass(node)} node-shape`, 'data-node-id': node.id }), node, selectable);
      if (node.kind === 'leaf') {
        group.appendChild(svgEl('circle', { cx, cy, r: 27, class: 'node-circle' }));
      } else {
        const boxClass = node.kind === 'role-root' ? 'synt-box role-root-box' : (node.kind === 'role' ? 'synt-box role-box' : 'synt-box category-box');
        group.appendChild(svgEl('rect', { x: cx - 52, y: cy - 23, width: 104, height: 46, rx: 13, class: boxClass }));
      }
      shapeLayer.appendChild(group);
    }

    for (const { node } of ordered) {
      const cx = px(node.x, origin);
      const cy = py(node.y, origin);
      const group = makeSelectable(svgEl('g', { class: `${nodeRenderClass(node)} node-label`, 'data-node-id': node.id }), node, selectable);
      if (node.kind === 'leaf') {
        group.appendChild(svgEl('text', { x: cx, y: cy - 2, class: 'node-main-label' }, node.label));
        group.appendChild(svgEl('text', { x: cx, y: cy + 18, class: 'node-sub-label' }, node.cat));
      } else {
        group.appendChild(svgEl('text', { x: cx, y: cy + 5, class: 'box-label' }, node.label));
      }
      labelLayer.appendChild(group);
    }

    g.appendChild(shapeLayer);
    if (state.showLabels) g.appendChild(labelLayer);
  }

  function drawSyntaxTree(g, origin, options = {}) {
    const layout = options.layout ? cloneLayout(options.layout) : getSyntaxLayout();
    const growthPlan = growthPlanForLayout(layout);
    layout.__growthPlan = growthPlan;
    drawSubtreeBoxes(g, layout, origin, growthPlan);
    drawTreeEdges(g, layout, origin, growthPlan);
    drawOpnTopicalizationSlot(g, layout, origin, growthPlan);
    drawTreeNodes(g, layout, origin, options.selectable === true, growthPlan);
    return layout;
  }

  function layoutNodeMap(layout, origin) {
    const map = new Map();
    for (const node of layout.nodes) {
      const entry = { ...node, px: px(node.x, origin), py: py(node.y, origin) };
      map.set(node.id, entry);
      if (node.source && !map.has(node.source)) map.set(node.source, entry);
    }
    if (layout.topicalizationSlot) {
      const slot = layout.topicalizationSlot;
      map.set('opn-topic-slot', { id: slot.id, label: slot.label, kind: 'opn-slot', x: slot.x, y: slot.y, px: px(slot.x, origin), py: py(slot.y, origin) });
    }
    if (layout.v2Slot) {
      const slot = layout.v2Slot;
      map.set('opn-v2-slot', { id: slot.id, label: slot.label, kind: 'opn-slot', x: slot.x, y: slot.y, px: px(slot.x, origin), py: py(slot.y, origin) });
    }
    return map;
  }

  function drawCanvasGuideText(g, x, y, text, className = 'axis-title') {
    // v4450: begeleidende canvas-teksten worden niet getoond in het boomvenster,
    // zodat de boom hoger en rustiger start. De tekst blijft wel beschikbaar
    // in data-guide-text voor latere video-/YT-begeleiding of overlaygebruik.
    if (!g || !text) return;
    const current = g.getAttribute('data-guide-text') || '';
    const next = current ? `${current} | ${text}` : String(text);
    g.setAttribute('data-guide-text', next);
    if (CANVAS_GUIDE_TEXT_VISIBLE) {
      g.appendChild(svgEl('text', { x, y, class: className }, text));
    }
  }

  function drawAxisTitle(g, x, y, text) {
    drawCanvasGuideText(g, x, y, text, 'axis-title');
  }

  function surfaceItemAtPosition(surfacePosition) {
    const items = activeLexItems().filter(item => item.source);
    return items[surfacePosition] || null;
  }

  function surfaceSlotY(surfacePosition, sourceMap = null, y0 = 0) {
    return lexWordOrderY(surfacePosition, y0);
  }

  function lexTopicSlotY(sourceMap = null, y0 = 0, items = state.example?.lexItems || []) {
    return topicSlotY(y0, items);
  }

  function lexV2SlotY(sourceMap = null, y0 = 0, items = state.example?.lexItems || []) {
    return v2SlotY(y0, items);
  }

  function lexSystemSlotCount(items = state.example?.lexItems || []) {
    let count = 0;
    if (hasCompItem(items)) count += 1;
    if (showTopicSlot(items)) count += 1;
    if (showV2Slot(items)) count += 1;
    return count;
  }

  function lexConfiguredFreeSlots(y0, items = state.example?.lexItems || [], contextYs = []) {
    const count = lexFreeSlotCount();
    if (!count) return [];
    const placement = validLexSlotPlacement();
    const systemCount = lexSystemSlotCount(items);
    const maxContextY = contextYs.filter(Number.isFinite).length ? Math.max(...contextYs.filter(Number.isFinite)) : y0 + Math.max(4, items.length + 1) * 64;
    let startY;
    if (placement === 'above-system') startY = y0 - count * 64;
    else if (placement === 'after-system') startY = y0 + systemCount * 64;
    else if (placement === 'after-surface-1') startY = y0 + (systemCount + 1) * 64;
    else if (placement === 'after-surface-2') startY = y0 + (systemCount + 2) * 64;
    else if (placement === 'after-surface-3') startY = y0 + (systemCount + 3) * 64;
    else startY = maxContextY + 64;
    return Array.from({ length: count }, (_, index) => ({
      id: `lex-insert-${index + 1}`,
      label: `LEX-insertie ${index + 1}`,
      caption: lexInsertionContentDef().id === 'vandaag' ? 'extern bijwoord' : `extern/anafoor ${index + 1}`,
      content: lexInsertionContentDef(),
      y: startY + index * 64,
      placement
    }));
  }

  function drawLexConfiguredFreeSlot(g, x, slot) {
    const content = slot.content || lexInsertionContentDef();
    g.appendChild(svgEl('rect', { x: x - 118, y: slot.y - 30, width: 236, height: 60, rx: 17, class: 'lex-free-slot lex-config-free-slot lex-insertion-box' }));
    g.appendChild(svgEl('text', { x, y: slot.y - 38, class: 'slot-caption' }, slot.label));
    g.appendChild(svgEl('text', { x, y: slot.y - 4, class: 'lex-local-label' }, content.text || 'INSERTIEPUNT'));
    g.appendChild(svgEl('text', { x, y: slot.y + 15, class: 'lex-free-slot-sub' }, content.sub || 'andere LEX-as / anafoor'));
  }

  function drawLexTopicSlot(g, x, y) {
    g.appendChild(svgEl('rect', { x: x - 98, y: y - 27, width: 196, height: 54, rx: 16, class: 'lex-free-slot topic-slot' }));
    g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 1 · eerste zinsdeel'));
    g.appendChild(svgEl('text', { x, y: y + 5, class: 'lex-local-label' }, 'TOPIC/XP'));
  }

  function drawLexV2Slot(g, x, y) {
    g.appendChild(svgEl('rect', { x: x - 98, y: y - 27, width: 196, height: 54, rx: 16, class: 'lex-free-slot v2-slot' }));
    g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 2 · V2/PV'));
    g.appendChild(svgEl('text', { x, y: y + 5, class: 'lex-local-label' }, 'vrij slot'));
  }

  function isMainV2Rule(rule = state.example?.lexRule) {
    return rule === 'hoofdzininvariant' || rule === 'perfectum-heeft-vdw';
  }

  function isFiniteVerbForV2(item) {
    if (!item) return false;
    const source = String(item.source || '').toLowerCase();
    const role = String(item.role || '').toLowerCase();
    if (source === 'pv' || role === 'aux') return true;
    return source === 'predicate' && role === 'predicate';
  }

  function topicMovementForItem(item, index) {
    // v4450: in Nederlandse V2-hoofdzinnen bezet het eerste zinsdeel slot 1.
    // Dat geldt ook wanneer dat eerste zinsdeel het subject is. Het eerste
    // lexicale zinsdeel laat dus altijd een trace achter op de oude basispositie.
    if (!isMainV2Rule()) return null;
    if (index !== 0 || !item?.source) return null;
    return { kind: 'topic', slot: 'topic', caption: 'Wissel TOPIC', trace: `t[${item.role || item.source}]` };
  }

  function configuredSourceOrder() {
    const order = [];
    function visit(node) {
      if (!node) return;
      if (node.source && !order.includes(node.source)) order.push(node.source);
      for (const child of node.children || []) visit(child);
    }
    visit(nodeConfigToTree(STRUCTURE_CONFIG.syntaxNodes, STRUCTURE_CONFIG.syntaxRoot));
    return order;
  }

  function activeBasisSourceOrder() {
    const order = [];
    function visit(node) {
      if (!node) return;
      if (node.source && !order.includes(node.source)) order.push(node.source);
      for (const child of node.children || []) visit(child);
    }
    visit(treeSpec());
    return order.length ? order : configuredSourceOrder();
  }

  function surfaceSourceIndex(item, fallbackIndex = 0) {
    if (!item?.source) return fallbackIndex;
    return activeSurfaceSourceItems().findIndex(src => String(src.source) === String(item.source));
  }

  function basisSourceIndex(item, fallbackIndex = 0) {
    if (!item?.source) return fallbackIndex;
    const order = activeBasisSourceOrder();
    const idx = order.findIndex(source => String(source) === String(item.source));
    return idx >= 0 ? idx : fallbackIndex;
  }
  function hasCompItem(items = state.example?.lexItems || []) {
    return !!items.find(item => !item.source && item.slot === 'comp');
  }

  function showTopicSlot(items = state.example?.lexItems || []) {
    return items.findIndex((item, i) => movementForItem(item, i)?.slot === 'topic') >= 0;
  }

  function showV2Slot(items = state.example?.lexItems || []) {
    return items.findIndex((item, i) => movementForItem(item, i)?.slot === 'v2') >= 0;
  }

  function lexSlotBaseOffset(items = state.example?.lexItems || []) {
    let offset = 0;
    if (hasCompItem(items)) offset += 1;
    if (showTopicSlot(items)) offset += 1;
    if (showV2Slot(items)) offset += 1;
    return offset;
  }

  function compSlotY(y0) {
    return y0;
  }

  function topicSlotY(y0, items = state.example?.lexItems || []) {
    return y0 + (hasCompItem(items) ? 64 : 0);
  }

  function v2SlotY(y0, items = state.example?.lexItems || []) {
    return y0 + (hasCompItem(items) ? 64 : 0) + (showTopicSlot(items) ? 64 : 0);
  }

  function lexMovementRank(movement) {
    if (!movement) return 99;
    if (movement.slot === 'topic') return 1;
    if (movement.slot === 'v2') return 2;
    if (movement.slot === 'comp') return 0;
    return 10;
  }

  function orderedLexMovements(items = state.example?.lexItems || []) {
    return items
      .map((item, index) => ({ item, index, movement: movementForItem(item, index) }))
      .filter(entry => entry.item?.source && entry.movement)
      .sort((a, b) => {
        const r = lexMovementRank(a.movement) - lexMovementRank(b.movement);
        if (r) return r;
        const byTarget = (lexSlotIndex(a.item, a.index, items, a.movement) || '').localeCompare(lexSlotIndex(b.item, b.index, items, b.movement) || '', 'nl', { numeric: true });
        if (byTarget) return byTarget;
        return a.index - b.index;
      });
  }

  function movementOrderIndex(item, index, items = state.example?.lexItems || []) {
    return orderedLexMovements(items).findIndex(entry => entry.item === item && entry.index === index);
  }

  function appliedMovementForItem(item, index, items = state.example?.lexItems || [], options = {}) {
    const movement = movementForItem(item, index);
    if (!movement) return null;
    if (typeof options.executedMovementCount !== 'number') return movement;
    const moveIndex = movementOrderIndex(item, index, items);
    return moveIndex >= 0 && moveIndex < options.executedMovementCount ? movement : null;
  }

  function movementForItem(item, index) {
    if (!item?.source) return null;
    // v4427: de voorbeeldzin bepaalt de gevulde LEX-slots. De boom wordt niet
    // omgebouwd naar die surface-volgorde; waar de voorbeeldzin een vrij slot
    // vult, noteert de LEX-as een lokale Wissel. Voor nu zijn de expliciete
    // plaatsingsregels: topic/vooropplaatsing en V2. Niet-verplaatste woorden
    // blijven op hun horizontale bronpositie.
    const topic = topicMovementForItem(item, index);
    if (topic) return topic;
    if (isMainV2Rule() && isFiniteVerbForV2(item)) {
      return { kind: 'v2', slot: 'v2', caption: 'Wissel V2', trace: item.source === 'pv' ? 't[pv]' : 't[V]' };
    }
    return null;
  }

  function sourceAlignedLexY(item, index, y0, sourceMap = null, items = state.example?.lexItems || []) {
    return baseLexY(item, index, y0, sourceMap, items);
  }

  function localTraceY(item, index, y0, items = state.example?.lexItems || []) {
    // v4450: een trace blijft exact op de oude basispositie van het verplaatste item.
    return baseLexY(item, index, y0, null, items);
  }

  function baseLexY(item, index, y0, sourceMap = null, items = state.example?.lexItems || []) {
    // v4450: de basisprojectie wordt niet gecomprimeerd. In Assen blijft de
    // LEX-basisplek exact horizontaal gelijk aan de bronknoop in de boom.
    // Alleen zonder centrale boom/sourceMap valt de LEX-only view terug op
    // een eenvoudige, leesbare rijafstand.
    if (item?.source && sourceMap) {
      const p = sourceMap.get(item.source);
      if (p && Number.isFinite(p.py)) return p.py;
    }
    const baseOffset = lexSlotBaseOffset(items);
    const baseIndex = basisSourceIndex(item, index);
    return y0 + (baseOffset + baseIndex) * 64;
  }

  function projectionAnchorY(item, index, y0, sourceMap = null, items = state.example?.lexItems || []) {
    return baseLexY(item, index, y0, sourceMap, items);
  }

  function lexWordOrderY(index, y0) {
    return y0 + index * 64;
  }

  function sourceOrderIndex(item, fallbackIndex = 0) {
    const source = String(item?.source || '').toLowerCase();
    const role = String(item?.role || '').toLowerCase();
    if (source === 'subject' || role === 'subject') return 0;
    if (source === 'object' || role === 'object') return 1;
    if (source === 'pv' || role === 'aux') return 2;
    if (source === 'predicate' || role === 'predicate') return 2;
    if (source === 'vdw' || role === 'participle') return 3;
    return fallbackIndex;
  }

  function lexTargetY(item, index, y0, sourceMap = null, items = state.example?.lexItems || [], options = {}) {
    if (!item?.source) return item.slot === 'comp' ? compSlotY(y0) : lexWordOrderY(index, y0);
    const movement = appliedMovementForItem(item, index, items, options);
    if (movement?.slot === 'topic') return topicSlotY(y0, items);
    if (movement?.slot === 'v2') return v2SlotY(y0, items);
    return baseLexY(item, index, y0, sourceMap, items);
  }

  function lexItemY(item, index, y0, sourceMap = null, items = state.example?.lexItems || [], options = {}) {
    return lexTargetY(item, index, y0, sourceMap, items, options);
  }

  function lexSlotIndex(item, index, items = [], movementOverride = undefined) {
    const movement = movementOverride === undefined ? movementForItem(item, index) : movementOverride;
    if (item.slot === 'comp') return '0';
    if (movement?.slot === 'topic') return '1';
    if (movement?.slot === 'v2') return '2';
    if (movement?.slot === 'local') return String(index + 1);
    if (item?.source) return `b${basisSourceIndex(item, index) + 1}`;
    const hasComp = items[0]?.slot === 'comp';
    return String(hasComp ? index : index + 1);
  }

  function localAxisMovement(item, index, fromY, toY, items = state.example?.lexItems || [], options = {}) {
    return appliedMovementForItem(item, index, items, options);
  }

  function drawLexTrace(g, x, y, label, caption = 'trace') {
    g.appendChild(svgEl('rect', { x: x - 52, y: y - 22, width: 104, height: 44, rx: 13, class: 'lex-trace-slot' }));
    g.appendChild(svgEl('text', { x, y: y - 28, class: 'slot-caption trace-caption' }, caption));
    g.appendChild(svgEl('text', { x, y: y + 5, class: 'lex-trace-label' }, label));
  }

  function drawLexWissel(g, x, fromY, toY, label) {
    const sideX = x + 110;
    g.appendChild(pathEl(`M ${sideX} ${fromY} C ${sideX + 52} ${fromY} ${sideX + 52} ${toY} ${sideX} ${toY}`, { class: 'lex-wissel-line' }));
    g.appendChild(svgEl('polygon', { points: `${sideX},${toY} ${sideX + 9},${toY - 6} ${sideX + 9},${toY + 6}`, class: 'lex-wissel-arrow' }));
    g.appendChild(svgEl('text', { x: sideX + 58, y: (fromY + toY) / 2, class: 'wissel-label' }, label));
  }


  function movementSummary() {
    const moved = activeLexItems().map((item, index) => movementForItem(item, index)).filter(Boolean);
    const type = state.example?.lexRule || 'voorbeeldzin';
    const choice = activeTreeChoice() === 'auto-min' ? 'auto-type' : 'structure-config';
    return { count: moved.length, type, choice };
  }

  function movementSummaryLabel() {
    const m = movementSummary();
    return `boomkeuze=${m.choice} · type=${m.type} · LEX-wissels=${m.count}`;
  }

  function drawLexAxis(g, x, y0, items, sourceMap = null, options = {}) {
    const horizontalProjectionMode = !!sourceMap && !options.localOnly;
    drawAxisTitle(g, x - 98, y0 - 70, horizontalProjectionMode ? 'LEX-projectie · Wisselregels' : 'LEX-as · lokale plaatsingsregels');

    const itemYs = items.map((item, i) => lexItemY(item, i, y0, sourceMap, items, options));
    const baseYs = items.map((item, i) => baseLexY(item, i, y0, sourceMap, items));
    const projectionYs = items.map((item, i) => projectionAnchorY(item, i, y0, sourceMap, items));
    const topicIndex = isMainV2Rule() ? items.findIndex((item, i) => movementForItem(item, i)?.slot === 'topic') : -1;
    const v2Index = isMainV2Rule() ? items.findIndex((item, i) => movementForItem(item, i)?.slot === 'v2') : -1;
    const topicSlotY = topicIndex >= 0 ? lexTopicSlotY(sourceMap, y0, items) : null;
    const v2SlotY = v2Index >= 0 ? lexV2SlotY(sourceMap, y0, items) : null;
    const configuredSlots = lexConfiguredFreeSlots(y0, items, [...itemYs, ...baseYs, ...projectionYs, ...(topicSlotY === null ? [] : [topicSlotY]), ...(v2SlotY === null ? [] : [v2SlotY])]);
    const axisYs = [...itemYs, ...baseYs, ...projectionYs, ...configuredSlots.map(slot => slot.y), ...(topicSlotY === null ? [] : [topicSlotY]), ...(v2SlotY === null ? [] : [v2SlotY]), y0 - 48, y0 + Math.max(4, items.length + 1) * 64 + 40];
    const axisMinY = Math.min(...axisYs) - 36;
    const axisMaxY = Math.max(...axisYs) + 44;
    g.appendChild(svgEl('line', { x1: x, y1: axisMinY, x2: x, y2: axisMaxY, class: 'lex-axis-line' }));

    const positions = new Map();
    if (topicSlotY !== null && isMainV2Rule()) drawLexTopicSlot(g, x, topicSlotY);
    if (v2SlotY !== null) drawLexV2Slot(g, x, v2SlotY);
    configuredSlots.forEach(slot => drawLexConfiguredFreeSlot(g, x, slot));

    const ruleText = isMainV2Rule()
      ? `Plaatsingsregel: basisprojectie + Wissels naar 0/1/2; configureerbare LEX-insertieboxen (${lexFreeSlotCount()} · ${lexSlotPlacementLabel()}) zijn LEX-as-inserties.`
      : `Plaatsingsregel: resultaat = voorbeeldzin; Comp gebruikt slot 0; configureerbare LEX-insertieboxen (${lexFreeSlotCount()} · ${lexSlotPlacementLabel()}) blijven LEX-as-inserties.`;
    drawCanvasGuideText(g, x + 150, axisMinY + 18, ruleText, 'wissel-label');

    // v4450: geen stippel- of verplaatsingslijnen vanuit de boom naar de LEX-as.
    // De boom levert alleen de basisstructuur; alle zichtbare Wissels en traces
    // worden lokaal op de LEX-as getekend.  Dit voorkomt dat projectielijnen
    // opnieuw als verplaatsingen vanuit de boom gelezen worden.

    items.forEach((item, i) => {
      const p = item.source && sourceMap ? sourceMap.get(item.source) : null;
      const y = lexItemY(item, i, y0, sourceMap, items, options);
      const oldY = baseLexY(item, i, y0, sourceMap, items);
      const movement = localAxisMovement(item, i, oldY, y, items, options);
      positions.set(item.id, { x, y, baseY: oldY, item, sourcePoint: p || null });

      if (movement && item.source) {
        drawLexTrace(g, x, oldY, movement.trace, 'trace · basisprojectie');
        drawLexWissel(g, x, oldY, y, movement.caption);
      }

      if (!item.source && item.slot === 'comp') {
        g.appendChild(svgEl('rect', { x: x - 86, y: y - 28, width: 172, height: 56, rx: 16, class: 'lex-free-slot comp-slot' }));
        g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 0 · Comp/(om)dat'));
      } else if (!item.source) {
        g.appendChild(svgEl('rect', { x: x - 66, y: y - 26, width: 132, height: 52, rx: 14, class: 'lex-local-slot' }));
      } else {
        const cls = movement ? 'lex-slot-box lex-projection-slot moved-slot' : 'lex-slot-box lex-projection-slot';
        g.appendChild(svgEl('rect', { x: x - 62, y: y - 28, width: 124, height: 56, rx: 14, class: cls }));
      }
      g.appendChild(svgEl('text', { x: x - 92, y: y + 5, class: 'lex-index' }, lexSlotIndex(item, i, items, movement)));
      g.appendChild(svgEl('text', { x, y: y + 5, class: item.source ? 'lex-label' : 'lex-local-label' }, item.label));
    });

    return positions;
  }

  function syntaxRules() {
    return stringRulesForSpec(treeSpec(), 'syntax');
  }

  function functionalRules() {
    return stringRulesForSpec(nodeConfigToTree(STRUCTURE_CONFIG.functionalNodes, STRUCTURE_CONFIG.functionalRoot), 'functional');
  }

  function ruleDisplayLabel(node, mode = 'syntax') {
    const roles = roleLabels();
    const base = String(node?.label || node?.id || '')
      .replace(/\{subject\}/gi, mode === 'functional' ? 'AGENS' : roles.subject)
      .replace(/\{object\}/gi, mode === 'functional' ? 'PATIENS' : roles.object)
      .replace(/\{predicate\}/gi, mode === 'functional' ? 'PRED' : roles.predicate)
      .replace(/\{pv\}/gi, 'PV')
      .replace(/\{vdw\}/gi, 'VDW');
    return base;
  }

  function stringRulesForSpec(spec, mode = 'syntax') {
    const rules = [];
    function visit(node) {
      if (!node || !(node.children || []).length) return;
      const lhs = ruleDisplayLabel(node, mode);
      const rhs = (node.children || []).map(child => ruleDisplayLabel(child, mode)).join(' ');
      rules.push(`${lhs} → ${rhs}`);
      for (const child of node.children || []) visit(child);
    }
    visit(spec);
    return rules;
  }

  function projectedRuleRows(spec, layout, origin, mode = 'syntax') {
    const nodeById = new Map((layout?.nodes || []).map(node => [node.id, node]));
    const rows = [];
    function visit(node) {
      if (!node || !(node.children || []).length) return;
      const layoutNode = nodeById.get(node.id);
      if (layoutNode) {
        const lhs = ruleDisplayLabel(node, mode);
        const rhs = (node.children || []).map(child => ruleDisplayLabel(child, mode)).join(' ');
        rows.push({
          id: node.id,
          text: `${lhs} → ${rhs}`,
          x0: px(layoutNode.x, origin),
          y: py(layoutNode.y, origin),
          kind: node.kind || layoutNode.kind || 'cat'
        });
      }
      for (const child of node.children || []) visit(child);
    }
    visit(spec);
    return rows.sort((a, b) => (a.y - b.y) || String(a.id).localeCompare(String(b.id)));
  }

  function drawProjectedRules(g, x, layout, origin, spec, options = {}) {
    if (!layout || !origin || !spec) return;
    const mode = options.mode || 'syntax';
    const title = options.title || (mode === 'functional' ? 'LOG/FT-projectie · regels/rollen' : 'SYNTAX-projectie · regels');
    const cls = mode === 'functional' ? 'log' : 'synt';
    const boxClass = mode === 'functional' ? 'syntax-rule-box projected-rule-box projected-functional-rule-box' : 'syntax-rule-box projected-rule-box';
    const ruleClass = mode === 'functional' ? 'rule-label projected-rule-label projected-functional-rule-label' : 'rule-label projected-rule-label';
    const rows = projectedRuleRows(spec, layout, origin, mode).filter(row => {
      const plan = options.growthPlan || null;
      return !plan?.active || visibleAt(plan, nodeGrowthStep(plan, row.id));
    });
    if (!rows.length) return;
    const maxText = rows.reduce((max, row) => Math.max(max, row.text.length), 0);
    const width = Math.max(mode === 'functional' ? 250 : 210, Math.min(380, maxText * 8.2 + 34));
    const topY = Math.max(28, (rows[0]?.y || 92) - 56);
    const axisTop = Math.max(24, Math.min(...rows.map(row => row.y)) - 46);
    const axisBottom = Math.max(...rows.map(row => row.y)) + 46;
    drawCanvasGuideText(g, x - width / 2, topY, title, 'axis-title');
    g.appendChild(svgEl('line', {
      x1: x,
      y1: axisTop,
      x2: x,
      y2: axisBottom,
      class: `projection-axis-line ${cls}`
    }));
    rows.forEach(row => {
      g.appendChild(svgEl('line', {
        x1: row.x0 + 58,
        y1: row.y,
        x2: x - width / 2,
        y2: row.y,
        class: `projection-line ${cls} orthogonal projected-rule-line`
      }));
      g.appendChild(svgEl('rect', { x: x - width / 2, y: row.y - 26, width, height: 52, rx: 14, class: boxClass }));
      g.appendChild(svgEl('text', { x, y: row.y + 5, class: ruleClass }, row.text));
    });
  }


  function logicalProjectionItemsFromLayout(layout = null, order = null) {
    const sourceLayout = layout || getFunctionalLayout();
    const labels = roleLabels();
    const byKey = {
      S: { short: 'S', title: 'Subject', word: String(labels.subject || '').toUpperCase(), match: ['agens', 'subject'] },
      O: { short: 'O', title: 'Object', word: String(labels.object || '').toUpperCase(), match: ['patiens', 'object'] },
      V: { short: 'V', title: 'Verb', word: String(labels.predicate || '').toUpperCase(), match: ['pred', 'predicate'] }
    };
    Object.values(byKey).forEach(def => {
      const node = (sourceLayout?.nodes || []).find(n => n.kind === 'leaf' && def.match.includes(String(n.role || '').toLowerCase()))
        || (sourceLayout?.nodes || []).find(n => def.match.includes(String(n.role || '').toLowerCase()));
      if (node?.label) def.word = String(node.label).toUpperCase();
    });
    const resolvedOrder = Array.isArray(order) && order.length ? order : ((state.branchOrder === 'flip-all' || state.functionalOrder === 'right-first') ? ['V', 'S', 'O'] : ['S', 'O', 'V']);
    return resolvedOrder.map((key, index) => ({ ...byKey[key], x: index, y: 0 }));
  }

  function southLogicalOrder() {
    return southLogicalModeOrder(state.southLogicalMode || 'SOV');
  }

  function logicalOrderCode(items) {
    return (items || []).map(item => item.short).join('');
  }

  function drawLogicalProjection(g, x1, x2, y, layout = null, options = {}) {
    const requestedOrder = Array.isArray(options.order) && options.order.length ? options.order : null;
    const items = Array.isArray(options.items) && options.items.length ? options.items : logicalProjectionItemsFromLayout(layout, requestedOrder);
    if (!items.length) return;
    const cls = options.cls || 'log';
    const title = options.title || 'LOGICAL-projectie';
    const subtitle = options.subtitle || 'De logische volgorde wordt uit de FT-layout geprojecteerd.';
    const orderCode = logicalOrderCode(items);
    const badgeText = options.badgeText || `LOG · ${orderCode}`;
    const badgeWidth = Math.max(176, 26 + badgeText.length * 10.2);
    const badgeHeight = options.interactive ? 48 : 38;
    const badgeGap = options.interactive ? 54 : 24;
    const badgeY = y - badgeGap - badgeHeight;
    const badgeX = options.badgeAlign === 'center'
      ? ((x1 + x2) / 2) - badgeWidth / 2
      : x1 - badgeWidth - 16;
    drawCanvasGuideText(g, x1, y - 110, `${title} · ${orderCode}`, 'axis-title');
    drawCanvasGuideText(g, x1, y - 86, subtitle, 'rule-label');
    const badgeGroup = svgEl('g', {
      class: options.interactive ? 'logical-badge-group clickable logical-flip-toggle' : 'logical-badge-group',
      'data-action': options.interactive ? 'south-logical-flip' : ''
    });
    if (options.interactive) {
      badgeGroup.appendChild(svgEl('text', {
        x: badgeX + badgeWidth / 2,
        y: badgeY - 12,
        class: 'logical-order-sub logical-flip-hint'
      }, options.tipText || 'tip: klik op ZUID om de volgorde te wisselen'));
    }
    badgeGroup.appendChild(svgEl('rect', {
      x: badgeX,
      y: badgeY,
      width: badgeWidth,
      height: badgeHeight,
      rx: 16,
      class: `logical-order-box logical-order-badge${options.interactive ? ' logical-order-badge-interactive' : ''}`
    }));
    badgeGroup.appendChild(svgEl('text', {
      x: badgeX + badgeWidth / 2,
      y: badgeY + (options.interactive ? 18 : 20),
      class: `logical-order-label${options.interactive ? ' logical-order-badge-label' : ''}`
    }, badgeText));
    if (options.interactive) {
      badgeGroup.appendChild(svgEl('text', {
        x: badgeX + badgeWidth / 2,
        y: badgeY + 34,
        class: 'logical-order-sub logical-order-badge-sub'
      }, 'klik voor volgende optie'));
      badgeGroup.style.cursor = 'pointer';
    }
    g.appendChild(badgeGroup);
    g.appendChild(svgEl('line', {
      x1,
      y1: y,
      x2: x2,
      y2: y,
      class: `logical-axis ${cls}`
    }));
    const step = items.length > 1 ? (x2 - x1) / (items.length - 1) : 0;
    items.forEach((item, index) => {
      const cx = Number.isFinite(item.px) ? item.px : (x1 + step * index);
      if (Number.isFinite(item.sourceTopY)) {
        g.appendChild(svgEl('line', {
          x1: cx,
          y1: item.sourceTopY,
          x2: cx,
          y2: y - 10,
          class: `projection-line ${cls} logical-source-line`
        }));
      }
      g.appendChild(svgEl('line', {
        x1: cx,
        y1: y,
        x2: cx,
        y2: y - 26,
        class: `projection-line ${cls} logical-projection-line`
      }));
      g.appendChild(svgEl('rect', {
        x: cx - 74,
        y: y + 10,
        width: 148,
        height: 48,
        rx: 14,
        class: 'logical-order-box'
      }));
      g.appendChild(svgEl('text', { x: cx, y: y + 28, class: 'logical-order-label' }, `${item.short} · ${item.word}`));
      g.appendChild(svgEl('text', { x: cx, y: y + 45, class: 'logical-order-sub' }, item.title));
    });
  }

  function drawSyntaxRules(g, x, y, layout = null, origin = null, growthPlan = null) {
    if (layout && origin) {
      drawProjectedRules(g, x, layout, origin, treeSpec(), {
        mode: 'syntax',
        title: 'SYNTAX-projectie · regels op boomhoogte',
        growthPlan
      });
      return;
    }
    drawAxisTitle(g, x, y - 60, 'SYNTAX-projectie · regels');
    const rules = syntaxRules();
    rules.forEach((rule, i) => {
      const yy = y + i * 66;
      const width = Math.max(210, Math.min(340, rule.length * 8.2 + 34));
      g.appendChild(svgEl('rect', { x: x - width / 2, y: yy - 26, width, height: 52, rx: 14, class: 'syntax-rule-box projected-rule-box' }));
      g.appendChild(svgEl('text', { x, y: yy + 5, class: 'rule-label projected-rule-label' }, rule));
    });
  }

  function drawFunctionalRules(g, x, layout = null, origin = null, growthPlan = null) {
    if (layout && origin) {
      drawProjectedRules(g, x, layout, origin, functionalSpec(), {
        mode: 'functional',
        title: 'LOG/FT-projectie · regels op boomhoogte',
        growthPlan
      });
      return;
    }
    drawAxisTitle(g, x, 40, 'LOG/FT-projectie · regels/rollen');
    functionalRules().forEach((rule, i) => {
      const yy = 86 + i * 66;
      const width = Math.max(250, Math.min(380, rule.length * 8.2 + 34));
      g.appendChild(svgEl('rect', { x: x - width / 2, y: yy - 26, width, height: 52, rx: 14, class: 'syntax-rule-box projected-rule-box projected-functional-rule-box' }));
      g.appendChild(svgEl('text', { x, y: yy + 5, class: 'rule-label projected-rule-label projected-functional-rule-label' }, rule));
    });
  }

  function activeRelationRows() {
    const useFunctional = state.projection === 'log' || state.centerMode === 'functional';
    const title = useFunctional ? 'LOG/FT · functionele relaties' : 'SYNTAX · boomrelaties';
    const rows = useFunctional ? functionalRules() : syntaxRules();
    return [title, ...rows];
  }

  function drawFunctional(g, origin, options = {}) {
    const layout = options.layout ? cloneLayout(options.layout) : getFunctionalLayout();
    const rootLabel = layout.node?.label || STRUCTURE_CONFIG.functionalRoot || 'CLAUSE';
    const functionalNodes = STRUCTURE_CONFIG.functionalNodes || [];
    const rootDef = functionalNodes.find(n => n.id === STRUCTURE_CONFIG.functionalRoot);
    const roleNames = (rootDef?.children || [])
      .map(id => functionalNodes.find(n => n.id === id)?.label || id)
      .join(' + ') || 'role-boxen';
    if (options.showTitle !== false) drawAxisTitle(g, origin.x - 180, origin.y - 70, `OPN · functionele structuur · ${rootLabel} → ${roleNames} · ${state.functionalOrder}`);
    drawAxisTitle(g, origin.x - 176, origin.y - 48, `v4482 · ${branchModeLabel()} · vrije plaatsing + gereserveerde vrije slots`);
    const growthPlan = growthPlanForLayout(layout);
    layout.__growthPlan = growthPlan;
    drawSubtreeBoxes(g, layout, origin, growthPlan);
    drawTreeEdges(g, layout, origin, growthPlan);
    drawOpnTopicalizationSlot(g, layout, origin, growthPlan);
    drawTreeNodes(g, layout, origin, options.selectable === true, growthPlan);
    return layout;
  }

  function drawAxes() {
    const g = baseSvg('axes-view');
    const origin = { x: 760, y: 72 };
    drawAxisTitle(g, origin.x - 170, origin.y - 76, state.centerMode === 'functional' ? `CENTRAAL · OPN-functioneel · structure-config · ${state.functionalOrder}` : `CENTRAAL · OPN-syntaxboom · ${movementSummaryLabel()}`);

    let sourceMap = null;
    let centralLayout = null;
    const centralKind = state.centerMode === 'functional' ? 'functional' : 'syntax';
    if (state.centerMode === 'functional') {
      centralLayout = drawFunctional(g, origin, { showTitle: false, layout: getSouthAwareFunctionalLayout() });
      sourceMap = layoutNodeMap(centralLayout, origin);
    } else {
      centralLayout = drawSyntaxTree(g, origin, { layout: getSouthAwareSyntaxLayout() });
      sourceMap = layoutNodeMap(centralLayout, origin);
    }
    const southItems = southLogicalItemsFromCentralLayout(centralLayout, origin, centralKind, southLogicalOrder());

    const leftTreePx = px((centralLayout?.box?.minX || 0) - 0.9, origin);
    const westAxisX = Math.max(120, leftTreePx - 168);
    const southAxisY = py((centralLayout?.box?.maxY || 0) + 2.1, origin);
    const southAxisX1 = px((centralLayout?.box?.minX || 0) - 0.75, origin);
    const southAxisX2 = px((centralLayout?.box?.maxX || 0) + 0.75, origin);

    const growthPlan = centralLayout?.__growthPlan;
    const showLexBaseStep = !growthPlan?.active || visibleAt(growthPlan, growthPlan.lexBaseStep);
    const showProjectionPanels = !growthPlan?.active || visibleAt(growthPlan, growthPlan.projectionStep);
    if (showProjectionPanels) {
      drawLexAxis(g, westAxisX, 126, activeLexItems(), sourceMap);
      if (state.centerMode === 'functional') drawFunctionalRules(g, 1240, centralLayout, origin, growthPlan);
      else drawSyntaxRules(g, 1240, 126, centralLayout, origin, growthPlan);
      drawLogicalProjection(g, southAxisX1, southAxisX2, southAxisY, getFunctionalLayout(), {
        cls: 'log',
        title: 'ZUID-as · LOGICAL-projectie',
        subtitle: 'Logische volgorde onder de boom; west-as blijft LEX. Klik op de grotere ZUID-knop om alleen de zuid-as te wijzigen.',
        badgeText: `ZUID · ${state.southLogicalMode || 'SOV'}`,
        order: southLogicalOrder(),
        items: southItems,
        interactive: true,
        tipText: 'tip: SOV → SVO → OVS → OSV → VSO → VOS',
        badgeAlign: 'center'
      });
    } else if (showLexBaseStep) {
      const executedMovementCount = growthPlan?.active
        ? Math.max(0, Math.min(growthPlan.lexMovementCount, growthPlan.current - growthPlan.lexMovementStartStep + 1))
        : undefined;
      drawLexAxis(g, westAxisX, 126, activeLexItems(), sourceMap, { localOnly: true, executedMovementCount });
      drawAxisTitle(g, 1210, 116, 'SYNTAX-projectie verschijnt in de laatste stap');
      drawLogicalProjection(g, southAxisX1, southAxisX2, southAxisY, getFunctionalLayout(), {
        cls: 'log',
        title: 'ZUID-as · LOGICAL-projectie',
        subtitle: 'Onderprojectie wordt mee zichtbaar in de eindfase. Klik op de grotere ZUID-knop om alleen de zuid-as te wijzigen.',
        badgeText: `ZUID · ${state.southLogicalMode || 'SOV'}`,
        order: southLogicalOrder(),
        items: southItems,
        interactive: true,
        tipText: 'tip: SOV → SVO → OVS → OSV → VSO → VOS',
        badgeAlign: 'center'
      });
    } else {
      drawAxisTitle(g, westAxisX - 45, 116, `Groei-presentatie · ${growthLabel()}`);
      drawAxisTitle(g, 1210, 116, 'SYNTAX-projectie verschijnt in de laatste stap');
    }
    els.svg.appendChild(g);
  }

  function drawSource() {
    const g = baseSvg('source-view');
    if (state.centerMode === 'functional') {
      drawFunctional(g, { x: 760, y: 92 });
      drawAxisTitle(g, 520, 70, `BRON · OPN-functioneel · vrije boomrijen + LEX-insertieslots + structure-config · ${state.functionalOrder}`);
    } else {
      drawAxisTitle(g, 490, 58, 'BRON · OPN-syntax-tree · vrije HOR/VER-boxplaatsing + vrije-slotruimte');
      drawSyntaxTree(g, { x: 780, y: 82 });
    }
    els.svg.appendChild(g);
  }

  function drawLex() {
    const g = baseSvg('lex-view');
    drawLexAxis(g, 560, 86, activeLexItems(), null);
    drawCanvasGuideText(g, 700, 70, state.example.lexRule === 'bijzin-omdat' ? 'Regel: bijzin met lokaal Comp-slot · geen V2' : 'Regel: hoofdzin met lokale V2-Wissel op de LEX-as', 'axis-title');
    els.svg.appendChild(g);
  }

  function drawSynt() {
    const g = baseSvg('synt-view');
    const origin = { x: 430, y: 92 };
    const layout = drawSyntaxTree(g, origin);
    const functionalLayout = getFunctionalLayout();
    drawSyntaxRules(g, 1040, 86, layout, origin, layout?.__growthPlan || null);
    drawLogicalProjection(g, 300, 1110, 642, functionalLayout, {
      cls: 'log',
      title: 'LOGICAL-projectie onder de syntaxboom',
      subtitle: 'De logische volgorde komt uit FT/LOG; syntax- en LEX-regels blijven aparte projecties.'
    });
    drawCanvasGuideText(g, 540, 370, 'SYNTAX: regels staan op dezelfde hoogte als hun bronknoop in de boom.', 'rule-label');
    els.svg.appendChild(g);
  }

  function drawLog() {
    const g = baseSvg('log-view');
    const origin = { x: 430, y: 92 };
    const layout = drawFunctional(g, origin);
    drawFunctionalRules(g, 1060, layout, origin, layout?.__growthPlan || null);
    drawLogicalProjection(g, 310, 1120, 666, layout, {
      cls: 'log',
      title: 'FT-projectie · logische volgorde',
      subtitle: 'Flip/layout in FT kan zo verschillende logische volgorden zichtbaar maken, zoals SOV, SVO, OVS, OSV, VSO en VOS, zonder een aparte LEX-herschikking.'
    });
    els.svg.appendChild(g);
  }

  function setSvgPresentationVars() {
    const profile = layoutVisualProfile();
    els.svg.style.setProperty('--og-font-scale', profile.fontScale.toFixed(2));
    els.svg.dataset.layoutDensity = state.layoutDensity || 'auto';
  }

  function viewBoxToString(box) {
    return `${box.x} ${box.y} ${box.w} ${box.h}`;
  }

  function fallbackViewBox() {
    return { x: 0, y: 0, w: 1500, h: 900 };
  }

  function stableGrowthViewBox() {
    if (!growthActive()) return null;
    // v4451: tijdens groei niet opnieuw inzoomen op de paar zichtbare
    // elementen. Anders wordt stap 1 extreem groot weergegeven. Gebruik een
    // stabiel podium totdat de gebruiker zelf pant/zoomt.
    if (state.projection === 'axes') return { x: 30, y: -58, w: 1380, h: 760 };
    if (state.projection === 'source') return { x: 330, y: -58, w: 980, h: 720 };
    if (state.projection === 'log') return { x: 240, y: -58, w: 1040, h: 720 };
    return null;
  }

  function parseViewBox() {
    const raw = (els.svg?.getAttribute('viewBox') || '').trim().split(/\s+/).map(Number);
    if (raw.length === 4 && raw.every(Number.isFinite) && raw[2] > 0 && raw[3] > 0) {
      return { x: raw[0], y: raw[1], w: raw[2], h: raw[3] };
    }
    return fallbackViewBox();
  }

  function setViewBox(box, manual = false) {
    syncMainTopbarLayout();
    if (!els.svg || !box) return;
    const next = {
      x: Number(box.x) || 0,
      y: Number(box.y) || 0,
      w: Math.max(80, Number(box.w) || 1500),
      h: Math.max(80, Number(box.h) || 900)
    };
    els.svg.setAttribute('viewBox', viewBoxToString(next));
    syncMobileCanvasHeight(next);
    if (manual) state.manualViewBox = next;
  }

  function resetManualViewBox() {
    state.manualViewBox = null;
    state.viewDrag = null;
    state.viewClickSuppressed = false;
    els.svg?.classList.remove('is-panning');
    els.canvasWrap?.classList.remove('is-panning');
  }

  function syncMainTopbarLayout() {
    const main = document.body?.classList.contains('main-screen-active');
    if (!main) return;
    const bar = document.querySelector('.main-topbar');
    const root = document.documentElement;
    if (!bar || !root) return;
    const rect = bar.getBoundingClientRect();
    const gap = 6;
    const top = Math.max(0, Math.ceil(rect.bottom + gap));
    root.style.setProperty('--main-grid-top', `${top}px`);
    root.style.setProperty('--main-grid-height', `calc(100dvh - ${top}px)`);
  }

  function canvasAspectRatio() {
    syncMainTopbarLayout();
    const rect = els.canvasWrap?.getBoundingClientRect?.();
    if (!rect || !Number.isFinite(rect.width) || !Number.isFinite(rect.height) || rect.width <= 0 || rect.height <= 0) return null;
    return rect.width / rect.height;
  }

  function expandBoxToAspect(box, aspect = null) {
    if (!box || !Number.isFinite(aspect) || aspect <= 0) return box;
    const centerX = box.x + box.w / 2;
    const centerY = box.y + box.h / 2;
    const boxAspect = box.w / box.h;
    if (!Number.isFinite(boxAspect) || boxAspect <= 0) return box;
    if (Math.abs(boxAspect - aspect) < 0.01) return box;
    if (boxAspect < aspect) {
      const w = box.h * aspect;
      return { x: centerX - w / 2, y: box.y, w, h: box.h };
    }
    const h = box.w / aspect;
    return { x: box.x, y: centerY - h / 2, w: box.w, h };
  }

  function computeAutoFitBox() {
    if (!els.svg) return fallbackViewBox();
    const grids = [...els.svg.querySelectorAll('.grid')];
    const oldDisplays = grids.map(grid => grid.style.display);
    try {
      // FIT moet de getekende boom/projecties volgen, niet het raster.
      grids.forEach(grid => { grid.style.display = 'none'; });
      const bbox = els.svg.getBBox();
      if (!bbox || !Number.isFinite(bbox.width) || !Number.isFinite(bbox.height) || bbox.width <= 0 || bbox.height <= 0) {
        return fallbackViewBox();
      }
      const main = document.body?.classList.contains('main-screen-active');
      const base = Math.max(bbox.width, bbox.height);
      const margin = main
        ? Math.max(10, Math.min(26, base * 0.014))
        : (isMobileViewport()
          ? Math.max(18, Math.min(38, base * 0.024))
          : Math.max(24, Math.min(56, base * 0.028)));
      const fit = {
        x: bbox.x - margin,
        y: bbox.y - margin,
        w: bbox.width + margin * 2,
        h: bbox.height + margin * 2
      };
      return expandBoxToAspect(fit, canvasAspectRatio());
    } catch (_err) {
      return fallbackViewBox();
    } finally {
      grids.forEach((grid, index) => { grid.style.display = oldDisplays[index] || ''; });
    }
  }

  function applyViewBoxFit(force = false) {
    if (!els.svg) return;
    if (force) resetManualViewBox();
    const growthBox = stableGrowthViewBox();
    if (growthBox && !force && !state.manualViewBox) {
      setViewBox(growthBox, false);
      return;
    }
    if (!force && state.manualViewBox) {
      setViewBox(state.manualViewBox, false);
      return;
    }
    if (!force && state.viewFitMode !== 'auto') {
      setViewBox(fallbackViewBox(), false);
      return;
    }
    setViewBox(computeAutoFitBox(), false);
  }

  function runFit() {
    resetManualViewBox();
    const applyManualFit = () => {
      const fitBox = computeAutoFitBox();
      setViewBox(fitBox, true);
    };
    applyManualFit();
    requestAnimationFrame(applyManualFit);
  }

  function baseSvg(className) {
    els.svg.replaceChildren();
    setSvgPresentationVars();
    setViewBox(fallbackViewBox(), false);
    els.svg.classList.toggle('no-grid', !state.showGrid);
    const g = svgEl('g', { class: className });
    if (state.showGrid) drawGrid(g, 1800, 1000);
    drawCanvasGuideText(g, 22, 28, 'gridvenster = vast passend kader · grens naast grid = menu/grid verdelen · FIT = passend kader rond inhoud', 'view-pan-hint');
    return g;
  }

  function render() {
    syncPortraitStageMode();
    syncMainTopbarLayout();
    syncControls();
    if (state.projection === 'source') drawSource();
    else if (state.projection === 'lex') drawLex();
    else if (state.projection === 'synt') drawSynt();
    else if (state.projection === 'log') drawLog();
    else drawAxes();
    applyViewBoxFit(false);
    syncMobileCanvasHeight(parseViewBox());
    renderSideLists();
    renderStatus();
    renderSelection();
  }

  function stabilizeInitialTreeView() {
    // v4458: in de lokale viewer kan de eerste automatische SVG-bbox vóór de
    // eerste paint leeg of onvolledig zijn. Een tweede render na layout/paint
    // voorkomt dat de boom pas verschijnt na handmatig Groei aan/uit.
    if (!els.svg || state.manualViewBox || state.viewDrag) return;
    resetManualViewBox();
    render();
    requestAnimationFrame(() => {
      if (!state.manualViewBox && !state.viewDrag) applyViewBoxFit(true);
    });
  }

  function renderStatus() {
    els.titleLine.textContent = `${activeSentenceText()} · ${state.projectionLabel || projectionLabel()} · ${state.centerMode === 'syntax' ? 'OPN-syntaxboom' : 'OPN-functioneel'}`;
    const noticeText = state.example.notice ? ` · NOTICE=${state.example.notice}` : '';
    els.metaLine.textContent = `${state.example.phase} · ${movementSummaryLabel()} · LEX=${activeSentenceText()} · HTML-input=examples-input.html · lexicon=lexicon-config.html${noticeText}`;
    if (els.sentencePreview) els.sentencePreview.innerHTML = activeSentenceHtml();
    const baseFeedback = state.projection === 'source'
      ? 'Bron toont de gekozen OPN-bron uit structure-config.html. Syntax en functioneel gebruiken bottom-up recursieve box-layout; left/right stuurt beide layouts; takvolgorde kan globaal, compact-auto of align-auto zijn.'
      : 'Faseversie: eerst structure-config, dan voorbeeldzinnen die naar die sources projecteren, dan lokale LEX-regel.';
    const validationMsg = state.exampleValidationMessages?.length ? ` · ${state.exampleValidationMessages[0]}` : '';
    const noticeMsg = state.example.notice ? ` · ${state.example.notice}` : '';
    els.actionFeedback.textContent = state.growthEnabled ? `${baseFeedback} · ${growthLabel()}${noticeMsg}${validationMsg}` : `${baseFeedback}${noticeMsg}${validationMsg}`;
    els.projectionHelp.textContent = helpText();
    els.explainHeading.textContent = `Uitleg · ${activeSentenceText()}`;
    els.explainText.textContent = state.example.id === 'hond-bijt-man'
      ? 'LEX-regel: eerst horizontale basisprojectie, daarna lokale Wissels naar vrije slots. Hoofdzin: eerste zinsdeel → slot 1, persoonsvorm → slot 2; traces blijven op de oude basisplek. FIT kadert alleen het zicht, niet de boom. Centrale slotboxen zijn verwijderd; de eerste tak reserveert lege vrije-slotruimte; wissels zie je alleen op de LEX-as. De ZUID-badge doorloopt de zuid-as-volgorde: SOV, SVO, OVS, OSV, VSO, VOS. De centrale subject/object/verb-vertakkingen draaien mee. Menu’s boven het grid zijn expliciet gekozen: maximaal vier, bijvoorbeeld Voorbeeldzin en Play/Groei.'
      : 'LEX-regel: verplaats alleen naar vrije slots 0/1/2. Niet-verplaatste woorden blijven op hun horizontale basisplek. Traces staan lokaal op de oude plek. In LOG/FT kan de onderprojectie SOV, SVO, OVS, OSV, VSO of VOS tonen.';
  }

  function projectionLabel() {
    return ({ axes: 'OPN/assen', source: 'Bron', lex: 'LEX', synt: 'SYNTAX-projectie', log: 'LOG/FT' })[state.projection] || state.projection;
  }

  function helpText() {
    if (state.projection === 'source') return 'Bron: OPN-syntax en OPN-functioneel worden gelezen uit structure-config.html. Beide gebruiken dezelfde left/right layoutstrategie en reserveren configureerbare lege vrije-slotruimte onder de wortel.';
    if (state.projection === 'lex') return 'LEX: plaatsingsregels per zinstype. Hoofdzin: eerste zinsdeel naar slot 1, persoonsvorm naar slot 2. De ruimte in de centrale boom is leeg; de vulling staat op de LEX-as.';
    if (state.projection === 'synt') return 'SYNTAX-projectie: regels staan op boomhoogte; onder de boom staat nu ook de LOGICAL-projectie uit FT/LOG.';
    if (state.projection === 'log') return 'LOG/FT: functioneel = CLAUSE met aparte PRED-knoop en ARG-STRUCT-subtree; onderaan toont de FT-projectie de logische volgorde (bijv. SOV/SVO/OVS/OSV/VSO/VOS).';
    return 'Assen: centrale OPN-boom; west-as = LEX direct naast de boom; zuid-as = LOGICAL-projectie. Het grid staat standaard bovenaan; in portrait staat het rechter menu naast het grid. Sleep de duidelijke grens of kies de zichtbare instelling Rechterkolom bovenaan om grid/menu te verdelen. Het gridvenster past op boom + assen; canvas-panning staat uit.';
  }

  function renderSideLists() {
    els.lexOrderList.replaceChildren();
    activeLexItems().forEach((item, i) => {
      const row = document.createElement('div');
      row.className = `lex-order-item ${item.source ? '' : 'local'}`;
      row.textContent = `${i + 1}. ${item.label}${item.role ? ' · ' + item.role : ''}${item.source ? '' : ' · lokaal'}`;
      els.lexOrderList.appendChild(row);
    });
    fillEdgeList();
  }

  function fillEdgeList() {
    if (!els.edgeList) return;
    els.edgeList.replaceChildren();
    const rows = activeRelationRows();
    for (const [i, row] of rows.entries()) {
      const div = document.createElement('div');
      div.className = i === 0 ? 'edge-item relation-heading' : 'edge-item';
      div.textContent = row;
      els.edgeList.appendChild(div);
    }
  }

  function fillSelect(select, options, selected) {
    if (!select) return;
    select.replaceChildren();
    for (const opt of options) {
      const el = document.createElement('option');
      el.value = opt.id;
      el.textContent = opt.label || opt.title || opt.id;
      if (opt.id === selected) el.selected = true;
      select.appendChild(el);
    }
  }

  function renderLexInsertionTargetControls() {
    const selected = new Set(validLexInsertionTargets());
    document.querySelectorAll('[data-lex-extension-target]').forEach(input => {
      const id = input.getAttribute('data-lex-extension-target');
      input.checked = selected.has(id);
      const tip = lexInsertionTargetTip(id);
      input.title = `${lexInsertionTargetLabel(id)}. ${tip}`;
      const wrapper = input.closest('label');
      if (wrapper) wrapper.title = input.title;
    });
    const text = selected.size
      ? `Takverlenging: ${[...selected].map(lexInsertionTargetLabel).join(' + ')}. Insertie grijpt aan op de LEX-as; de boom krijgt alleen extra taklengte/boxruimte.`
      : 'Geen takverlenging: insertie blijft alleen op de LEX-as zichtbaar.';
    document.querySelectorAll('[data-lex-extension-help]').forEach(node => {
      node.textContent = text;
      node.title = [...selected].map(lexInsertionTargetTip).join(' ');
    });
  }

  function syncControls() {
    fillSelect(els.exampleSelect, EXAMPLES, state.example.id);
    fillSelect(els.desktopExampleSelect, EXAMPLES, state.example.id);
    fillSelect(els.mobileExampleSelect, EXAMPLES, state.example.id);
    fillSelect(els.mainExampleSelect, EXAMPLES, state.example.id);
    fillSelect(els.centralModeSelect, CENTER_MODES, state.centerMode);
    fillSelect(els.treeChoiceSelect, TREE_CHOICES, activeTreeChoice());
    fillSelect(els.functionalOrderSelect, FUNCTIONAL_ORDERS, state.functionalOrder);
    fillSelect(els.branchOrderSelect, BRANCH_ORDERS, state.branchOrder);
    fillSelect(els.branchTopSelect, BRANCH_CHOICES, state.branchOverrides.top);
    fillSelect(els.branchMiddleSelect, BRANCH_CHOICES, state.branchOverrides.middle);
    fillSelect(els.branchOtherSelect, BRANCH_CHOICES, state.branchOverrides.other);
    fillSelect(els.layoutDensitySelect, LAYOUT_DENSITIES, state.layoutDensity);
    fillSelect(els.viewFitSelect, VIEW_FIT_MODES, state.viewFitMode);
    fillSelect(els.rightMenuWidthSelect, RIGHT_MENU_WIDTHS, validRightMenuMode());
    fillSelect(els.rightMenuWidthSelectTop, RIGHT_MENU_WIDTHS, validRightMenuMode());
    fillSelect(els.mobileRightMenuWidthSelect, RIGHT_MENU_WIDTHS, validRightMenuMode());
    fillSelect(els.freeSlotCountSelect, FREE_SLOT_COUNTS, String(reservedFreeSlotCount()));
    fillSelect(els.lexFreeSlotCountSelect, LEX_FREE_SLOT_COUNTS, String(lexFreeSlotCount()));
    fillSelect(els.mobileLexFreeSlotCountSelect, LEX_FREE_SLOT_COUNTS, String(lexFreeSlotCount()));
    fillSelect(els.lexFreeSlotPlacementSelect, LEX_SLOT_PLACEMENTS, validLexSlotPlacement());
    fillSelect(els.mobileLexFreeSlotPlacementSelect, LEX_SLOT_PLACEMENTS, validLexSlotPlacement());
    fillSelect(els.lexInsertionContentSelect, LEX_INSERTION_CONTENTS, validLexInsertionContent());
    fillSelect(els.mobileLexInsertionContentSelect, LEX_INSERTION_CONTENTS, validLexInsertionContent());
    [els.lexFreeSlotPlacementSelect, els.mobileLexFreeSlotPlacementSelect].forEach(select => { if (select) select.title = lexSlotPlacementTip(); });
    [els.lexInsertionContentSelect, els.mobileLexInsertionContentSelect].forEach(select => { if (select) select.title = lexInsertionContentDef().tip; });
    renderLexInsertionTargetControls();
    renderTopMenuChoiceControls();
    syncPortraitMenuSpace();
    syncTopMenuPlacement();
    if (els.functionalOrderSelect) els.functionalOrderSelect.disabled = false;
    if (els.branchOrderSelect) els.branchOrderSelect.disabled = false;
    fillSelect(els.lexRuleSelect, LEX_RULES, state.example.lexRule);
    if (els.showGridInput) els.showGridInput.checked = state.showGrid;
    if (els.showRelationsInput) els.showRelationsInput.checked = state.showRelations;
    if (els.showLabelsInput) els.showLabelsInput.checked = state.showLabels;
    const growthSupported = growthSupportedProjection();
    const growthMax = growthSupported ? growthStepMax() : 0;
    if (growthSupported) {
      state.growthStep = clampGrowthStep(state.growthStep);
      if (state.growthStep > 0) state.lastSupportedGrowthStep = state.growthStep;
    }
    if (els.growthEnabledInput) {
      els.growthEnabledInput.checked = state.growthEnabled;
      els.growthEnabledInput.disabled = !growthSupported;
    }
    if (els.growthStepInput) {
      els.growthStepInput.min = 0;
      els.growthStepInput.max = growthMax;
      els.growthStepInput.value = growthSupported ? state.growthStep : state.lastSupportedGrowthStep;
      els.growthStepInput.disabled = !state.growthEnabled || !growthSupported;
    }
    if (els.growthStepLabel) els.growthStepLabel.textContent = growthLabel();
    if (els.growthPrevButton) els.growthPrevButton.disabled = !state.growthEnabled || !growthSupported || state.growthStep <= 0;
    if (els.growthNextButton) els.growthNextButton.disabled = !state.growthEnabled || !growthSupported || state.growthStep >= growthMax;
    if (els.growthResetButton) els.growthResetButton.disabled = !state.growthEnabled || !growthSupported;
    const growthPlayText = state.growthTimer ? 'Pauze' : 'Play';
    const growthPrevDisabled = !state.growthEnabled || !growthSupported || state.growthStep <= 0;
    const growthNextDisabled = !state.growthEnabled || !growthSupported || state.growthStep >= growthMax;
    const growthResetDisabled = !state.growthEnabled || !growthSupported;
    if (els.growthPlayButton) {
      els.growthPlayButton.disabled = !growthSupported;
      els.growthPlayButton.textContent = growthPlayText;
    }
    if (els.mobileGrowthPlayButton) {
      els.mobileGrowthPlayButton.disabled = !growthSupported;
      els.mobileGrowthPlayButton.textContent = growthPlayText;
    }
    if (els.mobileGrowthPrevButton) els.mobileGrowthPrevButton.disabled = growthPrevDisabled;
    if (els.mobileGrowthNextButton) els.mobileGrowthNextButton.disabled = growthNextDisabled;
    if (els.mobileGrowthResetButton) els.mobileGrowthResetButton.disabled = growthResetDisabled;
    if (els.mobileGrowthStepLabel) els.mobileGrowthStepLabel.textContent = growthLabel();
    document.querySelectorAll('.projection-tab').forEach(tab => {
      const active = tab.dataset.projection === state.projection;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-mobile-projection]').forEach(button => {
      const active = button.dataset.mobileProjection === state.projection;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (els.mobileMenuButton) els.mobileMenuButton.setAttribute('aria-expanded', String(state.mobileSheetOpen));
    const exampleIndex = Math.max(0, EXAMPLES.findIndex(example => example.id === state.example?.id));
    const noPreviousExample = !EXAMPLES.length || exampleIndex <= 0;
    const noNextExample = !EXAMPLES.length || exampleIndex >= EXAMPLES.length - 1;
    if (els.mobilePrevButton) els.mobilePrevButton.disabled = noPreviousExample;
    if (els.mobileNextButton) els.mobileNextButton.disabled = noNextExample;
  }

  function selectNode(id) {
    state.selectedNodeId = id;
    renderSelection();
    render();
  }

  function renderSelection() {
    const layout = state.centerMode === 'functional' ? getFunctionalLayout() : getSyntaxLayout();
    const node = layout.nodes.find(n => n.id === state.selectedNodeId);
    if (!node) {
      els.selectionEmpty?.classList.remove('hidden');
      els.nodeEditor?.classList.add('hidden');
      return;
    }
    els.selectionEmpty?.classList.add('hidden');
    els.nodeEditor?.classList.remove('hidden');
    if (els.nodeIdField) els.nodeIdField.value = node.id;
    if (els.nodeLabelInput) els.nodeLabelInput.value = node.label;
    fillSelect(els.nodeCatInput, [{ id: node.cat, label: node.cat }], node.cat);
    fillSelect(els.nodeRoleInput, [{ id: node.role || 'syntax', label: node.role || 'syntax' }], node.role || 'syntax');
    if (els.nodeXInput) els.nodeXInput.value = node.x;
    if (els.nodeYInput) els.nodeYInput.value = node.y;
  }

  function download(filename, text, type = 'application/json') {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadJson() {
    const payload = {
      version: VERSION,
      example: state.example.id,
      central_opn: state.centerMode,
      tree_choice: activeTreeChoice(),
      functional_order: state.functionalOrder,
      branch_order: state.branchOrder,
      branch_overrides: state.branchOverrides,
      free_slot_count: reservedFreeSlotCount(),
      lex_free_slot_count: lexFreeSlotCount(),
      lex_free_slot_placement: validLexSlotPlacement(),
      lex_insertion_content: validLexInsertionContent(),
      lex_insertion_extension_targets: validLexInsertionTargets(),
      lex_free_slots: lexFreeSlotDescriptors(),
      lex_free_slot_schema: {
        kind: 'insertion-point',
        target: 'LEX-axis',
        future_sources: ['other-lex-axis', 'other-tree', 'anaphoric-element', 'adverbial-headless-clause'],
        multi_tree_ready: true
      },
      top_menus_above_grid: normalizeTopMenusAbove(),
      right_menu_width: validRightMenuMode(),
      canvas_pan_enabled: !!state.canvasPanEnabled,
      syntax_rules: syntaxRules(),
      structure_config: 'structure-config.html',
      lex: activeLexItems()
    };
    download(`${state.example.id}.${VERSION}.json`, JSON.stringify(payload, null, 2));
  }

  function loadJsonFile(fileInput) {
    const file = fileInput?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || '{}'));
        const nextExample = EXAMPLES.find(example => example.id === payload.example);
        if (nextExample) state.example = nextExample;
        if (payload.central_opn === 'syntax' || payload.central_opn === 'functional') state.centerMode = payload.central_opn;
        if (payload.tree_choice && TREE_CHOICES.some(choice => choice.id === payload.tree_choice)) state.treeChoice = payload.tree_choice;
        if (payload.functional_order === 'left-first' || payload.functional_order === 'right-first') state.functionalOrder = payload.functional_order;
        if (payload.branch_order && BRANCH_ORDERS.some(order => order.id === payload.branch_order)) state.branchOrder = payload.branch_order;
        if (Number.isFinite(Number(payload.free_slot_count))) state.freeSlotCount = Math.max(0, Math.min(6, Number(payload.free_slot_count)));
        if (Number.isFinite(Number(payload.lex_free_slot_count))) state.lexFreeSlotCount = Math.max(0, Math.min(8, Number(payload.lex_free_slot_count)));
        if (payload.lex_free_slot_placement) state.lexFreeSlotPlacement = validLexSlotPlacement(payload.lex_free_slot_placement);
        if (payload.lex_insertion_content) state.lexInsertionContent = validLexInsertionContent(payload.lex_insertion_content);
        if (Array.isArray(payload.lex_insertion_extension_targets)) state.lexInsertionExtensionTargets = validLexInsertionTargets(payload.lex_insertion_extension_targets);
        if (Array.isArray(payload.top_menus_above_grid)) state.topMenusAbove = normalizeTopMenusAbove(payload.top_menus_above_grid);
        if (payload.right_menu_width) state.rightMenuMode = validRightMenuMode(payload.right_menu_width);
        else if (Number.isFinite(Number(payload.portrait_menu_slots))) state.topMenusAbove = [];
        if (payload.branch_overrides && typeof payload.branch_overrides === 'object') {
          for (const key of ['top', 'middle', 'other']) {
            if (['auto', 'normal', 'flip'].includes(payload.branch_overrides[key])) state.branchOverrides[key] = payload.branch_overrides[key];
          }
        }
        resetManualViewBox();
        setMobileSheet(false);
        render();
      } catch (error) {
        if (els.actionFeedback) els.actionFeedback.textContent = `JSON laden mislukt: ${error.message || error}`;
      } finally {
        fileInput.value = '';
      }
    };
    reader.onerror = () => {
      if (els.actionFeedback) els.actionFeedback.textContent = 'JSON laden mislukt: bestand kon niet worden gelezen.';
      fileInput.value = '';
    };
    reader.readAsText(file);
  }


  function downloadOpn() {
    const lines = [
      `opn_version: ${VERSION}`,
      `example: ${state.example.title}`,
      'tree:',
      ...syntaxRules().map(rule => `  ${rule}`),
      `lex: ${activeSentenceText()}`,
      `lex_rule: ${state.example.lexRule}`,
      `placement_rule: ${isMainV2Rule() ? 'LEX-as: eerst horizontale basisprojectie; daarna lokale Wissel naar voorbeeldzinvolgorde; oude basispositie = trace' : 'geen V2-Wissel; Comp-slot 0 indien aanwezig'}`,
      `free_slot_count: ${reservedFreeSlotCount()}`,
      `lex_free_slot_count: ${lexFreeSlotCount()}`,
      `lex_free_slot_placement: ${validLexSlotPlacement()} (${lexSlotPlacementLabel()})`,
      `lex_insertion_content: ${validLexInsertionContent()} (${lexInsertionContentDef().label})`,
      `lex_insertion_extension_targets: ${validLexInsertionTargets().map(lexInsertionTargetLabel).join(', ') || 'geen'}`,
      `lex_free_slots: configureerbare insertieboxen op de LEX-as; future_sources=other-lex-axis, other-tree, anaphor, adverbial-headless-clause`,
      `top_menus_above_grid: ${normalizeTopMenusAbove().map(topMenuLabel).join(', ') || 'geen'}`,
      `right_menu_width: ${validRightMenuMode()} (${rightMenuLabel()})`,
      `canvas_pan: disabled; window fits tree + axes`,
      `free_slots: boomrijen voor open OPN-plaatsing; LEX-inserties zijn aparte as-posities`,
      `tree_choice: ${activeTreeChoice()}`,
      `movement_summary: ${movementSummaryLabel()}`,
      `functional_order: ${state.functionalOrder}`,
      `branch_order: ${state.branchOrder}`,
      `branch_overrides: top=${state.branchOverrides.top}, middle=${state.branchOverrides.middle}, other=${state.branchOverrides.other}`
    ];
    download(`${state.example.id}.${VERSION}.opn`, lines.join('\n'), 'text/plain');
  }

  function panViewByClientDelta(dx, dy) {
    if (!els.svg) return;
    const rect = els.svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const vb = parseViewBox();
    const next = {
      x: vb.x - dx * (vb.w / rect.width),
      y: vb.y - dy * (vb.h / rect.height),
      w: vb.w,
      h: vb.h
    };
    setViewBox(next, true);
  }

  function zoomViewAtClientPoint(clientX, clientY, factor) {
    if (!els.svg) return;
    const rect = els.svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const vb = parseViewBox();
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;
    const anchorX = vb.x + relX * vb.w;
    const anchorY = vb.y + relY * vb.h;
    const w = Math.max(140, Math.min(4500, vb.w * factor));
    const h = Math.max(90, Math.min(3000, vb.h * factor));
    const x = anchorX - relX * w;
    const y = anchorY - relY * h;
    setViewBox({ x, y, w, h }, true);
  }


  function setMobileSheet(open) {
    state.mobileSheetOpen = !!open;
    els.mobileSheet?.classList.toggle('hidden', !state.mobileSheetOpen);
    els.mobileSheetBackdrop?.classList.toggle('hidden', !state.mobileSheetOpen);
    els.mobileMenuButton?.setAttribute('aria-expanded', String(state.mobileSheetOpen));
  }

  function toggleMobileSheet() {
    setMobileSheet(!state.mobileSheetOpen);
  }

  function cycleExample(delta) {
    if (!EXAMPLES.length) return;
    const currentIndex = Math.max(0, EXAMPLES.findIndex(example => example.id === state.example?.id));
    const nextIndex = Math.max(0, Math.min(EXAMPLES.length - 1, currentIndex + delta));
    if (nextIndex === currentIndex) {
      render();
      return;
    }
    state.example = EXAMPLES[nextIndex];
    resetForNewExample();
    render();
  }

  function setMobileProjection(projection) {
    setProjection(projection || 'axes');
    setMobileSheet(false);
    render();
  }

  function toggleMobileGrowth() {
    const supported = growthSupportedProjection();
    if (!supported) {
      setProjection('axes');
      state.growthEnabled = true;
    } else {
      state.growthEnabled = !state.growthEnabled;
      if (!state.growthEnabled) stopGrowthPlayback();
    }
    setMobileSheet(false);
    render();
  }

  function pinchDistance(points) {
    if (points.length < 2) return 0;
    const dx = points[0].clientX - points[1].clientX;
    const dy = points[0].clientY - points[1].clientY;
    return Math.hypot(dx, dy);
  }

  function pinchCenter(points) {
    return {
      clientX: (points[0].clientX + points[1].clientX) / 2,
      clientY: (points[0].clientY + points[1].clientY) / 2
    };
  }

  function startPinchGesture() {
    const points = Array.from(state.activePointers.values());
    if (points.length < 2) return;
    const center = pinchCenter(points);
    state.pinchGesture = {
      startDistance: Math.max(1, pinchDistance(points)),
      startCenter: center,
      startViewBox: parseViewBox()
    };
    state.viewDrag = null;
  }

  function updatePinchGesture(event) {
    const points = Array.from(state.activePointers.values());
    const gesture = state.pinchGesture;
    if (!gesture || points.length < 2 || !els.svg) return;
    const rect = els.svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const center = pinchCenter(points);
    const distance = Math.max(1, pinchDistance(points));
    const factor = gesture.startDistance / distance;
    const start = gesture.startViewBox;
    const relStartX = (gesture.startCenter.clientX - rect.left) / rect.width;
    const relStartY = (gesture.startCenter.clientY - rect.top) / rect.height;
    const relNowX = (center.clientX - rect.left) / rect.width;
    const relNowY = (center.clientY - rect.top) / rect.height;
    const anchorX = start.x + relStartX * start.w;
    const anchorY = start.y + relStartY * start.h;
    const w = Math.max(140, Math.min(4500, start.w * factor));
    const h = Math.max(90, Math.min(3000, start.h * factor));
    setViewBox({ x: anchorX - relNowX * w, y: anchorY - relNowY * h, w, h }, true);
    state.viewClickSuppressed = true;
    event.preventDefault();
  }

  function registerCanvasPan() {
    if (!els.svg) return;
    els.svg.addEventListener('pointerdown', event => {
      if (!state.canvasPanEnabled) {
        if (!event.target?.closest?.('[data-action]')) {
          state.viewDrag = null;
          state.activePointers.clear();
          event.preventDefault();
        }
        return;
      }
      if (event.button !== undefined && event.button !== 0) return;
      if (event.target?.closest?.('input,select,button,a,label,[data-action]')) return;
      state.activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY, pointerType: event.pointerType });
      els.svg.setPointerCapture?.(event.pointerId);
      els.svg.classList.add('is-panning');
      els.canvasWrap?.classList.add('is-panning');
      if (state.activePointers.size >= 2) {
        startPinchGesture();
        state.viewClickSuppressed = true;
      } else {
        const vb = parseViewBox();
        state.viewDrag = {
          pointerId: event.pointerId,
          startClientX: event.clientX,
          startClientY: event.clientY,
          lastClientX: event.clientX,
          lastClientY: event.clientY,
          moved: false,
          startViewBox: vb
        };
      }
      event.preventDefault();
    });

    els.svg.addEventListener('pointermove', event => {
      if (state.activePointers.has(event.pointerId)) {
        state.activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY, pointerType: event.pointerType });
      }
      if (state.activePointers.size >= 2) {
        updatePinchGesture(event);
        return;
      }
      const drag = state.viewDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.lastClientX;
      const dy = event.clientY - drag.lastClientY;
      if (Math.abs(event.clientX - drag.startClientX) + Math.abs(event.clientY - drag.startClientY) > 3) drag.moved = true;
      drag.lastClientX = event.clientX;
      drag.lastClientY = event.clientY;
      panViewByClientDelta(dx, dy);
      event.preventDefault();
    });

    const endDrag = event => {
      const hadPinch = state.activePointers.size >= 2 || !!state.pinchGesture;
      state.activePointers.delete(event.pointerId);
      if (hadPinch) {
        state.viewClickSuppressed = true;
        state.pinchGesture = null;
        const remaining = Array.from(state.activePointers.entries())[0];
        if (remaining) {
          const [pointerId, point] = remaining;
          state.viewDrag = {
            pointerId,
            startClientX: point.clientX,
            startClientY: point.clientY,
            lastClientX: point.clientX,
            lastClientY: point.clientY,
            moved: true,
            startViewBox: parseViewBox()
          };
        } else {
          state.viewDrag = null;
          els.svg.classList.remove('is-panning');
          els.canvasWrap?.classList.remove('is-panning');
        }
        window.setTimeout(() => { state.viewClickSuppressed = false; }, 120);
        event.preventDefault();
        return;
      }
      const drag = state.viewDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      state.viewClickSuppressed = !!drag.moved;
      state.viewDrag = null;
      els.svg.releasePointerCapture?.(event.pointerId);
      els.svg.classList.remove('is-panning');
      els.canvasWrap?.classList.remove('is-panning');
      window.setTimeout(() => { state.viewClickSuppressed = false; }, 0);
      event.preventDefault();
    };
    els.svg.addEventListener('pointerup', endDrag);
    els.svg.addEventListener('pointercancel', endDrag);
    els.svg.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') return;
      endDrag(event);
    });

    els.svg.addEventListener('click', event => {
      const actionEl = event.target?.closest?.('[data-action]');
      if (actionEl && !state.viewClickSuppressed) {
        const action = actionEl.getAttribute('data-action');
        if (action === 'south-logical-flip') {
          event.preventDefault();
          event.stopPropagation();
          toggleSouthLogicalFlip();
          return;
        }
      }
      if (!state.viewClickSuppressed) return;
      event.preventDefault();
      event.stopPropagation();
      state.viewClickSuppressed = false;
    }, true);

    els.svg.addEventListener('wheel', event => {
      if (!state.canvasPanEnabled) return;
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey) return;
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        const factor = Math.exp(Math.sign(event.deltaY) * 0.12);
        zoomViewAtClientPoint(event.clientX, event.clientY, factor);
      } else {
        const dx = -event.deltaX || -event.deltaY;
        panViewByClientDelta(dx, 0);
      }
    }, { passive: false });
  }

  function toggleSouthLogicalFlip() {
    const current = state.southLogicalMode || 'SOV';
    const index = Math.max(0, SOUTH_LOGICAL_MODES.indexOf(current));
    state.southLogicalMode = SOUTH_LOGICAL_MODES[(index + 1) % SOUTH_LOGICAL_MODES.length];
    render();
  }

  function resetForNewExample() {
    stopGrowthPlayback();
    state.growthEnabled = false;
    state.growthStep = 0;
    state.southLogicalMode = 'SOV';
    state.lastSupportedGrowthStep = 0;
    state.roleSwap = false;
    state.selectedNodeId = null;
    resetManualViewBox();
  }

  function registerPaneSplitter() {
    const splitter = els.paneSplitter;
    if (!splitter) return;
    const startDrag = event => {
      if (event.button !== undefined && event.button !== 0) return;
      const workspace = workspaceForStage();
      if (!workspace) return;
      const rect = workspace.getBoundingClientRect();
      state.paneSplitDrag = { pointerId: event.pointerId, rect };
      splitter.setPointerCapture?.(event.pointerId);
      splitter.classList.add('is-dragging');
      document.body?.classList.add('pane-split-dragging');
      event.preventDefault();
    };
    const moveDrag = event => {
      const drag = state.paneSplitDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const workspace = workspaceForStage();
      if (!workspace) return;
      const rect = workspace.getBoundingClientRect();
      const total = Math.max(260, rect.width || drag.rect.width || window.innerWidth || 360);
      const splitterWidth = paneSplitterWidth();
      const rawStage = event.clientX - rect.left;
      const clamped = clampPanePixels(rawStage, total - splitterWidth - rawStage, total);
      state.paneSplitManual = true;
      state.rightMenuWidth = clamped.menuWidth;
      workspace.style.setProperty('--stage-pane-width', `${clamped.stageWidth}px`);
      workspace.style.setProperty('--side-pane-width', `${clamped.menuWidth}px`);
      workspace.style.setProperty('--pane-splitter-width', `${clamped.splitterWidth}px`);
      document.documentElement?.style.setProperty('--stage-pane-width', `${clamped.stageWidth}px`);
      document.documentElement?.style.setProperty('--side-pane-width', `${clamped.menuWidth}px`);
      syncMobileCanvasHeight(parseViewBox());
      event.preventDefault();
    };
    const endDrag = event => {
      const drag = state.paneSplitDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      state.paneSplitDrag = null;
      splitter.releasePointerCapture?.(event.pointerId);
      splitter.classList.remove('is-dragging');
      document.body?.classList.remove('pane-split-dragging');
      event.preventDefault();
    };
    splitter.addEventListener('pointerdown', startDrag);
    splitter.addEventListener('pointermove', moveDrag);
    splitter.addEventListener('pointerup', endDrag);
    splitter.addEventListener('pointercancel', endDrag);
  }

  function setConfigScreen(open) {
    document.body.classList.toggle('config-screen-active', !!open);
    document.body.classList.toggle('main-screen-active', !open);
    els.openConfigButton?.setAttribute('aria-expanded', open ? 'true' : 'false');
    els.closeConfigButton?.setAttribute('aria-expanded', open ? 'true' : 'false');
    window.setTimeout(() => {
      syncMainTopbarLayout();
      try { render(); } catch (_) {}
      if (open) els.closeConfigButton?.focus?.();
      else els.openConfigButton?.focus?.();
    }, 0);
  }

  function registerEvents() {
    document.querySelectorAll('.projection-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        setProjection(tab.dataset.projection || 'axes');
        render();
      });
    });
    els.exampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      resetForNewExample();
      render();
    });
    els.desktopExampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      resetForNewExample();
      render();
    });
    els.mobileExampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      resetForNewExample();
      render();
    });
    els.mainExampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      resetForNewExample();
      render();
    });
    els.openConfigButton?.addEventListener('click', () => setConfigScreen(true));
    els.closeConfigButton?.addEventListener('click', () => setConfigScreen(false));
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.body.classList.contains('config-screen-active')) setConfigScreen(false);
    });
    els.centralModeSelect?.addEventListener('change', event => {
      state.centerMode = event.target.value;
      resetManualViewBox();
      render();
    });
    els.functionalOrderSelect?.addEventListener('change', event => {
      state.functionalOrder = event.target.value === 'right-first' ? 'right-first' : 'left-first';
      resetManualViewBox();
      render();
    });
    els.branchOrderSelect?.addEventListener('change', event => {
      const allowed = new Set(BRANCH_ORDERS.map(opt => opt.id));
      state.branchOrder = allowed.has(event.target.value) ? event.target.value : 'normal';
      resetManualViewBox();
      render();
    });
    const updateBranchOverride = (key, value) => {
      state.branchOverrides[key] = ['auto', 'normal', 'flip'].includes(value) ? value : 'auto';
      resetManualViewBox();
      render();
    };
    els.branchTopSelect?.addEventListener('change', event => updateBranchOverride('top', event.target.value));
    els.branchMiddleSelect?.addEventListener('change', event => updateBranchOverride('middle', event.target.value));
    els.branchOtherSelect?.addEventListener('change', event => updateBranchOverride('other', event.target.value));
    els.layoutDensitySelect?.addEventListener('change', event => { state.layoutDensity = event.target.value || 'auto'; resetManualViewBox(); render(); });
    els.viewFitSelect?.addEventListener('change', event => { state.viewFitMode = event.target.value || 'auto'; resetManualViewBox(); render(); });
    const setRightMenuMode = value => { state.rightMenuMode = validRightMenuMode(value); state.paneSplitManual = false; state.rightMenuWidth = null; resetManualViewBox(); render(); };
    els.rightMenuWidthSelect?.addEventListener('change', event => setRightMenuMode(event.target.value));
    els.rightMenuWidthSelectTop?.addEventListener('change', event => setRightMenuMode(event.target.value));
    els.mobileRightMenuWidthSelect?.addEventListener('change', event => setRightMenuMode(event.target.value));
    els.freeSlotCountSelect?.addEventListener('change', event => { state.freeSlotCount = Math.max(0, Math.min(6, Number(event.target.value) || 0)); resetManualViewBox(); render(); });
    const updateLexFreeSlotCount = event => { state.lexFreeSlotCount = Math.max(0, Math.min(8, Number(event.target.value) || 0)); resetManualViewBox(); render(); };
    const updateLexFreeSlotPlacement = event => { state.lexFreeSlotPlacement = validLexSlotPlacement(event.target.value); resetManualViewBox(); render(); };
    els.lexFreeSlotCountSelect?.addEventListener('change', updateLexFreeSlotCount);
    els.mobileLexFreeSlotCountSelect?.addEventListener('change', updateLexFreeSlotCount);
    els.lexFreeSlotPlacementSelect?.addEventListener('change', updateLexFreeSlotPlacement);
    els.mobileLexFreeSlotPlacementSelect?.addEventListener('change', updateLexFreeSlotPlacement);
    const updateLexInsertionContent = event => { state.lexInsertionContent = validLexInsertionContent(event.target.value); resetManualViewBox(); render(); };
    els.lexInsertionContentSelect?.addEventListener('change', updateLexInsertionContent);
    els.mobileLexInsertionContentSelect?.addEventListener('change', updateLexInsertionContent);
    document.querySelectorAll('[data-lex-extension-target]').forEach(input => {
      input.addEventListener('change', event => {
        const id = event.target?.getAttribute?.('data-lex-extension-target');
        const current = validLexInsertionTargets();
        if (event.target.checked && !current.includes(id)) current.push(id);
        if (!event.target.checked) { const idx = current.indexOf(id); if (idx >= 0) current.splice(idx, 1); }
        state.lexInsertionExtensionTargets = validLexInsertionTargets(current);
        resetManualViewBox();
        render();
      });
    });
    document.querySelectorAll('[data-top-menu-choice]').forEach(input => {
      input.addEventListener('change', event => {
        const id = event.target?.getAttribute?.('data-top-menu-choice');
        setTopMenuChoice(id, !!event.target.checked);
      });
    });
    els.lexRuleSelect?.addEventListener('change', event => {
      const targetExample = event.target.value === 'bijzin-omdat' ? (EXAMPLES.find(e => e.lexRule === 'bijzin-omdat') || EXAMPLES[1]) : (EXAMPLES.find(e => e.lexRule === 'hoofdzininvariant') || EXAMPLES[0]);
      state.example = targetExample;
      resetForNewExample();
      render();
    });
    els.showGridInput?.addEventListener('change', event => { state.showGrid = event.target.checked; render(); });
    els.showRelationsInput?.addEventListener('change', event => { state.showRelations = event.target.checked; render(); });
    els.showLabelsInput?.addEventListener('change', event => { state.showLabels = event.target.checked; render(); });
    els.growthEnabledInput?.addEventListener('change', event => {
      state.growthEnabled = event.target.checked;
      if (!state.growthEnabled) stopGrowthPlayback();
      render();
    });
    els.growthStepInput?.addEventListener('input', event => setGrowthStep(event.target.value));
    els.growthPrevButton?.addEventListener('click', () => { state.growthEnabled = true; setGrowthStep(state.growthStep - 1); });
    els.growthNextButton?.addEventListener('click', () => { state.growthEnabled = true; setGrowthStep(state.growthStep + 1); });
    els.growthResetButton?.addEventListener('click', () => { state.growthEnabled = true; stopGrowthPlayback(); setGrowthStep(0); });
    els.growthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mobileGrowthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mobileGrowthPrevButton?.addEventListener('click', () => { state.growthEnabled = true; setGrowthStep(state.growthStep - 1); });
    els.mobileGrowthNextButton?.addEventListener('click', () => { state.growthEnabled = true; setGrowthStep(state.growthStep + 1); });
    els.mobileGrowthResetButton?.addEventListener('click', () => { state.growthEnabled = true; stopGrowthPlayback(); setGrowthStep(0); });
    els.resetExampleButton?.addEventListener('click', () => { resetForNewExample(); render(); });
    els.fitButton?.addEventListener('click', runFit);
    els.mobileFitButton?.addEventListener('click', runFit);
    els.mobilePrevButton?.addEventListener('click', () => cycleExample(-1));
    els.mobileNextButton?.addEventListener('click', () => cycleExample(1));
    els.mobileMenuButton?.addEventListener('click', toggleMobileSheet);
    els.mobileCloseButton?.addEventListener('click', () => setMobileSheet(false));
    els.mobileSheetBackdrop?.addEventListener('click', () => setMobileSheet(false));
    els.mobileGrowthButton?.addEventListener('click', toggleMobileGrowth);
    els.mobileResetButton?.addEventListener('click', () => { resetForNewExample(); setMobileSheet(false); render(); });
    els.mobileDownloadJsonButton?.addEventListener('click', () => { setMobileSheet(false); downloadJson(); });
    els.fileInput?.addEventListener('change', () => loadJsonFile(els.fileInput));
    els.mobileFileInput?.addEventListener('change', () => loadJsonFile(els.mobileFileInput));
    document.querySelectorAll('[data-mobile-projection]').forEach(button => {
      button.addEventListener('click', () => setMobileProjection(button.dataset.mobileProjection || 'axes'));
    });
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && state.mobileSheetOpen) {
        setMobileSheet(false);
        event.preventDefault();
      }
    });
    els.downloadJsonButton?.addEventListener('click', downloadJson);
    els.downloadOpnButton?.addEventListener('click', downloadOpn);
    els.applyLexRuleButton?.addEventListener('click', () => {
      state.example = state.example.lexRule === 'bijzin-omdat' ? (EXAMPLES.find(e => e.lexRule === 'bijzin-omdat') || EXAMPLES[1]) : (EXAMPLES.find(e => e.lexRule === 'hoofdzininvariant') || EXAMPLES[0]);
      resetForNewExample();
      render();
    });
    els.swapRolesButton?.addEventListener('click', () => {
      state.roleSwap = !state.roleSwap;
      render();
    });
    for (const button of [els.undoButton, els.redoButton, els.addNodeButton, els.duplicateNodeButton, els.deleteNodeButton, els.applyNodeButton, els.addEdgeButton, els.lexLeftButton, els.lexRightButton]) {
      button?.addEventListener('click', () => {
        if (els.actionFeedback) els.actionFeedback.textContent = 'Deze viewer heeft geen losse knoop-/relatie-editor. Gebruik structure-config/lexicon-config voor bronaanpassing.';
      });
    }
    window.addEventListener('keydown', event => {
      if (event.key === '1') setProjection('axes');
      else if (event.key === '2') setProjection('source');
      else if (event.key === '3') setProjection('lex');
      else if (event.key.toLowerCase() === 'g') { state.growthEnabled = !state.growthEnabled; if (!state.growthEnabled) stopGrowthPlayback(); }
      else if (event.key.toLowerCase() === 'n') { state.growthEnabled = true; setGrowthStep(state.growthStep + 1, false); }
      else if (event.key.toLowerCase() === 'p') { state.growthEnabled = true; setGrowthStep(state.growthStep - 1, false); }
      else if (event.key.toLowerCase() === 'f') runFit();
      else if (event.key === 'ArrowLeft') { panViewByClientDelta(60, 0); event.preventDefault(); return; }
      else if (event.key === 'ArrowRight') { panViewByClientDelta(-60, 0); event.preventDefault(); return; }
      else if (event.key === 'ArrowUp') { panViewByClientDelta(0, 60); event.preventDefault(); return; }
      else if (event.key === 'ArrowDown') { panViewByClientDelta(0, -60); event.preventDefault(); return; }
      else return;
      render();
    });
  }

  async function init() {
    document.body.classList.add('main-screen-active');
    document.body.classList.remove('config-screen-active');
    registerEvents();
    registerCanvasPan();
    registerPaneSplitter();
    await loadStructureConfig();
    await loadExamplesFromHtml();
    render();
    requestAnimationFrame(() => requestAnimationFrame(stabilizeInitialTreeView));
    window.addEventListener('load', () => {
      requestAnimationFrame(stabilizeInitialTreeView);
    }, { once: true });
    window.addEventListener('resize', () => {
      syncPortraitStageMode();
      syncMainTopbarLayout();
      resetManualViewBox();
      render();
    });
    window.addEventListener('orientationchange', () => {
      requestAnimationFrame(() => {
        resetManualViewBox();
        render();
      });
    });
    window.__opengraphBoot = { version: VERSION, loaded: true };
    // v4427: lokale ontwikkelviewer gebruikt geen PWA-cache meer.
    // Oude service workers worden actief verwijderd, zodat structure-config/examples-input
    // niet per ongeluk uit een oudere versie blijven komen.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(registrations => Promise.all(registrations.map(reg => reg.unregister())))
        .catch(() => {});
    }
  }

  init();
})();
