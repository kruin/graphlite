(() => {
  'use strict';

  const VERSION = 'v4567';
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
    mainAdverbSelect: document.getElementById('mainAdverbSelect'),
    mobileAdverbSelect: document.getElementById('mobileAdverbSelect'),
    openConfigButton: document.getElementById('openConfigButton'),
    closeConfigButton: document.getElementById('closeConfigButton'),
    openHelpButton: document.getElementById('openHelpButton'),
    openHelpFromConfigButton: document.getElementById('openHelpFromConfigButton'),
    closeHelpButton: document.getElementById('closeHelpButton'),
    openConfigFromHelpButton: document.getElementById('openConfigFromHelpButton'),
    centralModeSelect: document.getElementById('centralModeSelect'),
    treeChoiceSelect: document.getElementById('treeChoiceSelect'),
    functionalOrderSelect: document.getElementById('functionalOrderSelect'),
    branchOrderSelect: document.getElementById('branchOrderSelect'),
    branchTopSelect: document.getElementById('branchTopSelect'),
    branchMiddleSelect: document.getElementById('branchMiddleSelect'),
    branchOtherSelect: document.getElementById('branchOtherSelect'),
    layoutDensitySelect: document.getElementById('layoutDensitySelect'),
    viewFitSelect: document.getElementById('viewFitSelect'),
    mainViewFitSelectTop: document.getElementById('mainViewFitSelectTop'),
    mainLayoutDensitySelectTop: document.getElementById('mainLayoutDensitySelectTop'),
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
    mainGrowthPrevButton: document.getElementById('mainGrowthPrevButton'),
    mainGrowthNextButton: document.getElementById('mainGrowthNextButton'),
    mainGrowthPlayButton: document.getElementById('mainGrowthPlayButton'),
    mainResetButton: document.getElementById('mainResetButton'),
    mainGrowthStepLabel: document.getElementById('mainGrowthStepLabel'),
    mainSouthPrevButton: document.getElementById('mainSouthPrevButton'),
    mainSouthNextButton: document.getElementById('mainSouthNextButton'),
    mainSouthModeButton: document.getElementById('mainSouthModeButton'),
    mainProjectionAxesButton: document.getElementById('mainProjectionAxesButton'),
    mainProjectionSourceButton: document.getElementById('mainProjectionSourceButton'),
    mainProjectionLexButton: document.getElementById('mainProjectionLexButton'),
    mainProjectionSyntButton: document.getElementById('mainProjectionSyntButton'),
    mainProjectionLogButton: document.getElementById('mainProjectionLogButton'),
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
    ,
    {
      id: 'omdat-de-hond-de-man-heeft-gebeten',
      title: 'OMDAT DE HOND DE MAN HEEFT GEBETEN',
      phase: 'Perfectum · omdat-bijzin',
      lexRule: 'bijzin-omdat',
      sentence: 'OMDAT DE HOND DE MAN HEEFT GEBETEN',
      sentenceHtml: 'OMDAT <strong>DE HOND</strong> <em>DE MAN</em> HEEFT GEBETEN',
      subjectDefault: 'DE HOND',
      objectDefault: 'DE MAN',
      predicate: 'GEBETEN',
      lexItems: [
        { id: 'omdat', label: 'OMDAT', source: null, slot: 'comp', lexeme: 'omdat' },
        { id: 'subject-hond', label: 'DE HOND', source: 'subject', role: 'subject', thematicRole: 'agens', lexeme: 'hond' },
        { id: 'object-man', label: 'DE MAN', source: 'object', role: 'object', thematicRole: 'patiens', lexeme: 'man' },
        { id: 'pv-heeft', label: 'HEEFT', source: 'pv', role: 'aux', lexeme: 'heeft' },
        { id: 'vdw-bijt', label: 'GEBETEN', source: 'vdw', role: 'participle', lexeme: 'bijt' }
      ]
    }
    ,
    {
      id: 'omdat-vrouw-trui-heeft-gebreid',
      title: 'OMDAT VROUW TRUI HEEFT GEBREID',
      phase: 'Gebruikersinput · omdat+perfectum',
      lexRule: 'bijzin-omdat',
      sentence: 'OMDAT VROUW TRUI HEEFT GEBREID',
      sentenceHtml: 'OMDAT <strong>VROUW</strong> <em>TRUI</em> HEEFT GEBREID',
      subjectDefault: 'VROUW',
      objectDefault: 'TRUI',
      predicate: 'GEBREID',
      lexItems: [
        { id: 'omdat', label: 'OMDAT', source: null, slot: 'comp', lexeme: 'omdat' },
        { id: 'subject-vrouw', label: 'VROUW', source: 'subject', role: 'subject', thematicRole: 'agens', lexeme: 'vrouw' },
        { id: 'object-trui', label: 'TRUI', source: 'object', role: 'object', thematicRole: 'patiens', lexeme: 'trui' },
        { id: 'pv-heeft', label: 'HEEFT', source: 'pv', role: 'aux', lexeme: 'heeft' },
        { id: 'vdw-breit', label: 'GEBREID', source: 'vdw', role: 'participle', lexeme: 'breit' }
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
    { id: 'flat', label: 'boomruimte: platter / minder hoog' },
    { id: 'wide', label: 'boomruimte: breed/lager' },
    { id: 'large', label: 'boomruimte: breed + groter font' }
  ];

  const VIEW_FIT_MODES = [
    { id: 'window', label: 'volledige boom zichtbaar · standaard' },
    { id: 'auto', label: 'volledige boom strak · zonder extra rand' },
    { id: 'scroll', label: 'scroll toegestaan · groot canvas' },
    { id: 'fixed', label: 'vast 1500×900 · debug' }
  ];

  const RIGHT_MENU_WIDTHS = [
    { id: 'auto', label: 'rechterkolom: auto/rest', minPx: 320, minFraction: 0.34, preferredFraction: 0.42 },
    { id: 'wide', label: 'rechterkolom: breed', minPx: 420, minFraction: 0.42, preferredFraction: 0.50 },
    { id: 'very-wide', label: 'rechterkolom: zeer breed', minPx: 540, minFraction: 0.50, preferredFraction: 0.58 },
    { id: 'max', label: 'rechterkolom: maximaal', minPx: 640, minFraction: 0.58, preferredFraction: 0.66 }
  ];

  const SOUTH_LOGICAL_MODES = ['SOV', 'SVO', 'OVS', 'OSV', 'VSO', 'VOS'];
  const SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES = new Set(['OSV', 'VSO', 'VOS']);

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

  const VALID_ADVERB_HOST_BOXES = new Set(['S', 'NP', 'VP', 'V', 'V-CLUSTER', 'PP', 'AP']);

  const ADVERB_PLACEMENT_RULES = [
      {
          "category": "MODALITEIT",
          "examples": [
              "waarschijnlijk",
              "misschien",
              "zeker"
          ],
          "defaultHost": "S",
          "defaultMarking": "functional:clause-scope-default",
          "defaultMeaning": "zinsmodaal: scope over de propositie; lineair ongemarkeerd vaak in het middenveld na de persoonsvorm/het onderwerp, maar vooropplaatsing is ook gewoon mogelijk",
          "defaultLinear": "middle-field-after-finite",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:fronted-v2",
              "meaning": "eerste zinsplaats; hoofdzin met inversie/V2"
          },
          "markedHosts": [
              "VP",
              "V"
          ],
          "markedMarking": "functional:marked-host",
          "markedMeaning": "nauwere/predicaatnabije of contrastieve lezing; niet gebruiken als neutrale default",
          "exceptions": "zeker heeft ook kwantificerende/benaderende waarde ('zeker tien mensen'); classificeer dan niet als MODALITEIT maar als KWANTIFICEREND/FOCUS"
      },
      {
          "category": "TIJD",
          "examples": [
              "gisteren",
              "morgen",
              "nu",
              "straks"
          ],
          "defaultHost": "VP",
          "defaultMarking": "functional:time-middle-default",
          "defaultMeaning": "tijdskader van de gebeurtenis; in het middenveld normaal vóór plaats/wijze/frequentie volgens tendens tijd vóór andere bepalingen",
          "defaultLinear": "middle-field-time-before-place-manner",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:fronted-v2",
              "meaning": "kaderscheppend/topic; bij eerste zinsplaats V2/inversie"
          },
          "markedHosts": [
              "S",
              "V-CLUSTER"
          ],
          "markedMarking": "functional:marked-host",
          "markedMeaning": "S = voorop/kader; V-CLUSTER = zeer predicaatnabij of bij meerwerkwoordconstructies",
          "exceptions": "nu kan ook discourse-/modaliteitswaarde hebben; toen/dan kunnen temporeel of voegwoordelijk zijn"
      },
      {
          "category": "FREQUENTIE",
          "examples": [
              "vaak",
              "soms",
              "altijd",
              "zelden"
          ],
          "defaultHost": "VP",
          "defaultMarking": "functional:frequency-default",
          "defaultMeaning": "frequentie van gebeurtenis/VP; in middenveld, niet in AP/NP",
          "defaultLinear": "middle-field-frequency",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:fronted-v2",
              "meaning": "vooropplaatsing met contrast/kader; V2"
          },
          "markedHosts": [
              "S",
              "V"
          ],
          "markedMarking": "functional:marked-host",
          "markedMeaning": "S = topicale/focusplaatsing; V = zeer predicaatnabij en daarom gemarkeerd",
          "exceptions": "nooit is formeel ook frequentie, maar semantisch negatief; behandel nooit als NEG_FREQ wanneer scope belangrijk is"
      },
      {
          "category": "PLAATS",
          "examples": [
              "daar",
              "hier",
              "buiten",
              "ergens"
          ],
          "defaultHost": "VP",
          "defaultMarking": "functional:place-default",
          "defaultMeaning": "plaats van gebeurtenis; hier/daar staan in het middenveld vaak vroeg, vóór andere bepalingen maar na pronominale elementen",
          "defaultLinear": "early-middle-field-after-pronominals",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:fronted-v2",
              "meaning": "plaats als kader/topic; V2"
          },
          "markedHosts": [
              "S",
              "PP"
          ],
          "markedMarking": "functional:marked-host",
          "markedMeaning": "S = voorop/kader; PP = gekoppeld aan expliciete plaatsgroep of gesplitst voornaamwoordelijk bijwoord",
          "exceptions": "daar/hier kunnen ook deel zijn van voornaamwoordelijke bijwoorden (daarmee, hierop); buiten kan plaatsbepaling, partikel of predicatief zijn"
      },
      {
          "category": "NEGATIE",
          "examples": [
              "niet",
              "nooit",
              "nergens"
          ],
          "defaultHost": "VP",
          "defaultMarking": "functional:neg-scope-default",
          "defaultMeaning": "neutrale zins-/predicaatsnegatie: na object in eenvoudige transitieve hoofdzinnen; vóór eindwerkwoord/V-cluster in meerwerkwoordconstructies. Voor het object is contrastief/partieel.",
          "defaultLinear": "post-object-pre-vcluster",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:marked-fronted-negation",
              "meaning": "alleen voor partiële/contrastieve negatie zoals 'Niet de man...'"
          },
          "markedHosts": [
              "NP",
              "AP",
              "V",
              "V-CLUSTER",
              "S"
          ],
          "markedMarking": "functional:scope-marked",
          "markedMeaning": "NP/AP/V = partiële negatie; S = zinsbreed/contrastief; V-CLUSTER = vóór eindwerkwoord in meerwerkwoordconstructies",
          "exceptions": "NIET heeft een eigen lineaire regel. 'HOND BIJT MAN NIET' is neutraal; 'HOND BIJT NIET MAN' is contrastief/partieel (niet de man maar ...). nooit/nergens hebben eigen negatieve bijwoordklasse"
      },
      {
          "category": "GRAAD",
          "examples": [
              "heel",
              "erg",
              "zeer",
              "nogal"
          ],
          "defaultHost": "AP",
          "defaultMarking": "functional:degree-default",
          "defaultMeaning": "graadwoord hoort direct bij het gewijzigde AP of bij een ander bijwoord; het is meestal geen zelfstandig zinsdeel",
          "defaultLinear": "immediately-before-modified-AP-or-ADV",
          "frontedVariant": {
              "host": "S",
              "marking": "invalid-or-quoted",
              "meaning": "niet als gewone fronting gebruiken, tenzij het hele AP/AdvP voorop staat"
          },
          "markedHosts": [
              "V",
              "VP"
          ],
          "markedMarking": "functional:reclassified-or-marked-host",
          "markedMeaning": "alleen als het woord een andere functie krijgt, bijvoorbeeld erg als adjectief/predicaat of intensivering van predicaat",
          "exceptions": "heel/erg kunnen een ander bijwoord modificeren ('heel hard'); GraphLite heeft daarom later een ADV-MOD-host nodig naast AP"
      },
      {
          "category": "WIJZE",
          "examples": [
              "hard",
              "snel",
              "zachtjes",
              "goed"
          ],
          "defaultHost": "VP",
          "defaultMarking": "functional:manner-default",
          "defaultMeaning": "wijze van de handeling/gebeurtenis; in perfectum typisch bij het eindwerkwoord/V-cluster, niet in het cluster",
          "defaultLinear": "after-objects-before-final-verb-where-available",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:fronted-v2-marked",
              "meaning": "voorop als contrastieve/kaderscheppende wijze; V2"
          },
          "markedHosts": [
              "V",
              "V-CLUSTER",
              "S"
          ],
          "markedMarking": "functional:marked-host",
          "markedMeaning": "V/V-CLUSTER = predicaatnabij; S = sterk gemarkeerde vooropplaatsing",
          "exceptions": "hard/snel/goed kunnen ook adjectief zijn; classificeer alleen als WIJZE wanneer ze een werkwoordelijke handeling modificeren"
      },
      {
          "category": "REDEN_OORZAAK",
          "examples": [
              "daarom",
              "daardoor",
              "zodoende"
          ],
          "defaultHost": "S",
          "defaultMarking": "functional:fronted-v2-or-connective",
          "defaultMeaning": "verband tussen zinnen of reden/oorzaak voor propositie; vaak voorop met V2, maar daardoor kan ook VP-intern oorzaaksmiddel zijn",
          "defaultLinear": "fronted-v2-for-daarom-zodoende; middle-or-front-for-daardoor",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:fronted-v2",
              "meaning": "voegwoordelijk/reden-kader; V2"
          },
          "markedHosts": [
              "VP"
          ],
          "markedMarking": "functional:marked-host",
          "markedMeaning": "oorzaak binnen gebeurtenis/VP",
          "exceptions": "daarom is vooral reden/argumentatief; daardoor is oorzaak/middel en kan dichter bij VP staan; zodoende is formeler en vaak connector"
      },
      {
          "category": "VOORWAARDE_GEVOLG",
          "examples": [
              "anders",
              "dan"
          ],
          "defaultHost": "S",
          "defaultMarking": "functional:fronted-v2-or-connective",
          "defaultMeaning": "voorwaarde/gevolg of discourse-verbinding; voorop vaak V2",
          "defaultLinear": "fronted-v2-when-conditional-connector",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:fronted-v2",
              "meaning": "anders/dan als connector op eerste zinsplaats; V2"
          },
          "markedHosts": [
              "VP",
              "AP"
          ],
          "markedMarking": "functional:reclassified-or-marked-host",
          "markedMeaning": "anders kan wijze/adjectief zijn; dan kan temporeel of vergelijkend zijn",
          "exceptions": "anders en dan zijn polyfunctioneel. Splits: ANDERS_COND, ANDERS_MANNER, DAN_TEMP, DAN_COND, DAN_COMPARATIVE"
      },
      {
          "category": "FOCUSPARTIKEL",
          "examples": [
              "alleen",
              "ook",
              "zelfs",
              "slechts"
          ],
          "defaultHost": "FOCUS_TARGET",
          "defaultMarking": "functional:focus-default",
          "defaultMeaning": "focuspartikel is onderdeel van de gefocuste constituent; niet automatisch zelfstandig zinsdeel. Host is de concrete focusdrager: NP, VP, AP, PP of S",
          "defaultLinear": "directly-before-or-within-focus-constituent",
          "frontedVariant": {
              "host": "S",
              "marking": "functional:fronted-v2-if-whole-focus-is-fronted",
              "meaning": "alleen wanneer de hele gefocuste constituent op eerste zinsplaats staat"
          },
          "markedHosts": [
              "NP",
              "VP",
              "AP",
              "PP",
              "S"
          ],
          "markedMarking": "functional:focus-retargeted",
          "markedMeaning": "scope/focus verschuift naar andere constituent",
          "exceptions": "alleen kan ook bijwoord van modaliteit/slechts zijn; ook/zelfs/al/nog/pas hebben complexe scope en moeten later per target worden gespecificeerd"
      },
      {
          "category": "SCHAKEERPARTIKEL",
          "examples": [
              "toch",
              "maar",
              "nou",
              "eens",
              "even"
          ],
          "defaultHost": "S",
          "defaultMarking": "functional:particle-middle-field",
          "defaultMeaning": "oordeelspartikel/schakeringspartikel; meestal onbeklemtoond in middenveld en niet zelfstandig op eerste zinsplaats",
          "defaultLinear": "middle-field-particle-cluster",
          "frontedVariant": {
              "host": "S",
              "marking": "not-allowed-as-independent-fronted-slot",
              "meaning": "niet als losse vooropplaatsing renderen"
          },
          "markedHosts": [
              "VP"
          ],
          "markedMarking": "functional:marked-particle-scope",
          "markedMeaning": "lokale schakering bij predicaat/gebeurtenis",
          "exceptions": "deze klasse stond nog niet in v4550 maar is nodig voor spreektaal"
      }
  ];


  const LEX_SLOT_PLACEMENTS = [
    { id: 'above-selected-box', label: 'LEX-slot boven geselecteerde box', labelEn: 'LEX slot above selected box', host: 'selected', tip: 'Bijwoord komt als extern LEX-slot op de LEX-as, verticaal net boven de gekozen syntactische categoriebox. Geldig: S, NP, VP, V, V-CLUSTER, PP, AP.' },
    { id: 'above-s', label: 'LEX-slot boven S', labelEn: 'LEX slot above S', host: 'S', tip: 'Zinsbijwoord: extern LEX-slot op de LEX-as, net boven S. De S-ruimte wordt lager gezet waar nodig.' },
    { id: 'above-np', label: 'LEX-slot boven NP', labelEn: 'LEX slot above NP', host: 'NP', tip: 'Phrase/focus-bijwoord: extern LEX-slot op de LEX-as, net boven een NP-box.' },
    { id: 'above-vp', label: 'LEX-slot boven VP', labelEn: 'LEX slot above VP', host: 'VP', tip: 'VP-bijwoord: extern LEX-slot op de LEX-as, net boven de VP-box; de VP-subboom wordt lager gezet om ruimte te maken.' },
    { id: 'above-v', label: 'LEX-slot boven V', labelEn: 'LEX slot above V', host: 'V', tip: 'Wijze/negatie: extern LEX-slot op de LEX-as, net boven de V-box.' },
    { id: 'above-vcluster', label: 'LEX-slot boven V-CLUSTER', labelEn: 'LEX slot above V-CLUSTER', host: 'V-CLUSTER', tip: 'V-cluster-bijwoord: extern LEX-slot op de LEX-as, boven de hele V-clusterbox, niet in de cluster.' },
    { id: 'above-pp', label: 'LEX-slot boven PP', labelEn: 'LEX slot above PP', host: 'PP', tip: 'PP-gerelateerd bijwoord: extern LEX-slot op de LEX-as, net boven de PP-box.' },
    { id: 'above-ap', label: 'LEX-slot boven AP', labelEn: 'LEX slot above AP', host: 'AP', tip: 'Graadwoord: extern LEX-slot op de LEX-as, net boven de AP-box.' }
  ];

  const LEX_INSERTION_CONTENTS = [
    { id: 'empty', label: 'slot leeg', text: 'INSERTIEPUNT', sub: 'gereserveerd · andere LEX-as', subEn: 'reserved · other LEX axis', caption: 'vrij slot', captionEn: 'free slot', tip: 'Leeg insertiepunt: reserveert alleen plaats op de LEX-as.', tipEn: 'Empty insertion point: reserves LEX-axis space only.' },
    { id: 'gisteren', label: 'GISTEREN', text: 'GISTEREN', sub: 'tijd · VP/S-slot', subEn: 'time · VP/S slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'GISTEREN: tijdsbepaling. Plaats boven S of VP; bij vooropplaatsing boven S.', tipEn: 'GISTEREN: time adverb. Place above S or VP; when fronted, above S.' },
    { id: 'morgen', label: 'MORGEN', text: 'MORGEN', sub: 'tijd · VP/S-slot', subEn: 'time · VP/S slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'MORGEN: tijdsbepaling. Plaats boven S of VP; bij vooropplaatsing is een LEX-verplaatsingsregel nodig.', tipEn: 'MORGEN: time adverb. Place above S or VP; fronting requires a LEX movement rule.' },
    { id: 'daar', label: 'DAAR', text: 'DAAR', sub: 'plaats · VP/PP-slot', subEn: 'place · VP/PP slot', caption: 'plaats-slot', captionEn: 'place slot', tip: 'DAAR: plaatsbepaling. Default boven VP; bij expliciete PP-structuur boven PP.', tipEn: 'DAAR: place adverb. Default above VP; above PP when an explicit PP structure is present.' },
    { id: 'daarom', label: 'DAAROM', text: 'DAAROM', sub: 'reden/oorzaak · S-slot', subEn: 'cause/reason · S slot', caption: 'reden-slot', captionEn: 'cause slot', tip: 'DAAROM: reden/oorzaak. Default boven S; gemarkeerd kan het boven VP staan.', tipEn: 'DAAROM: cause/reason. Default above S; marked placement may attach above VP.' },
    { id: 'anders', label: 'ANDERS', text: 'ANDERS', sub: 'voorwaarde/gevolg · S-slot', subEn: 'condition/result · S slot', caption: 'voorwaarde-slot', captionEn: 'condition slot', tip: 'ANDERS: voorwaarde/gevolg. Default boven S; gemarkeerd kan het lager geplaatst worden.', tipEn: 'ANDERS: condition/result. Default above S; marked placement may attach lower.' },
    { id: 'vaak', label: 'VAAK', text: 'VAAK', sub: 'frequentie · VP-slot', subEn: 'frequency · VP slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'VAAK: frequentie. Voorkeur: boven VP; bij V-nabije lezing boven V.', tipEn: 'VAAK: frequency. Preferred: above VP; for a V-near reading above V.' },
    { id: 'soms', label: 'SOMS', text: 'SOMS', sub: 'frequentie · VP-slot', subEn: 'frequency · VP slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'SOMS: frequentie. Reserveer een VP-slot; hoger dan V-nabij, lager dan S-links.', tipEn: 'SOMS: frequency. Reserve a VP slot; higher than V-near, lower than S-left.' },
    { id: 'altijd', label: 'ALTIJD', text: 'ALTIJD', sub: 'frequentie · VP-slot', subEn: 'frequency · VP slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'ALTIJD: frequentie. Plaats bij voorkeur in het VP-domein; niet als NP/AP-intern slot.', tipEn: 'ALTIJD: frequency. Prefer the VP domain; not an NP/AP-internal slot.' },
    { id: 'niet', label: 'NIET', text: 'NIET', sub: 'negatie · V-nabij', subEn: 'negation · V-near', caption: 'NEG-slot', captionEn: 'NEG slot', tip: 'NIET: negatie. Plaats boven V als V-nabije negatie; eventueel boven VP bij bredere scope.', tipEn: 'NIET: negation. Place above V for V-near negation; optionally above VP for broader scope.' },
    { id: 'snel', label: 'SNEL', text: 'SNEL', sub: 'wijze · V-nabij', subEn: 'manner · V-near', caption: 'wijze-slot', captionEn: 'manner slot', tip: 'SNEL: wijze. Plaats dicht bij V/predicaat; in perfectum dicht bij het V-domein.', tipEn: 'SNEL: manner. Place close to V/predicate; in perfect constructions close to the V domain.' },
    { id: 'hard', label: 'HARD', text: 'HARD', sub: 'wijze · V-nabij', subEn: 'manner · V-near', caption: 'wijze-slot', captionEn: 'manner slot', tip: 'HARD: wijze. Plaats boven V of VP; niet boven S als zinsbijwoord.', tipEn: 'HARD: manner. Place above V or VP; not above S as a sentence adverb.' },
    { id: 'zachtjes', label: 'ZACHTJES', text: 'ZACHTJES', sub: 'wijze · V-nabij', subEn: 'manner · V-near', caption: 'wijze-slot', captionEn: 'manner slot', tip: 'ZACHTJES: wijze. Plaats boven V, dicht bij predicaat.', tipEn: 'ZACHTJES: manner. Place above V, close to the predicate.' },
    { id: 'misschien', label: 'MISSCHIEN', text: 'MISSCHIEN', sub: 'zinsbijwoord · S/VP', subEn: 'sentence adverb · S/VP', caption: 'S/VP-slot', captionEn: 'S/VP slot', tip: 'MISSCHIEN: zinsbijwoord. Hoge host: boven S of VP; niet boven V.', tipEn: 'MISSCHIEN: sentence adverb. High host: above S or VP; not above V.' },
    { id: 'waarschijnlijk', label: 'WAARSCHIJNLIJK', text: 'WAARSCHIJNLIJK', sub: 'zinsbijwoord · S/VP', subEn: 'sentence adverb · S/VP', caption: 'S/VP-slot', captionEn: 'S/VP slot', tip: 'WAARSCHIJNLIJK: zinsbijwoord. Plaats boven S of VP; scope is de hele propositie.', tipEn: 'WAARSCHIJNLIJK: sentence adverb. Place above S or VP; scope is the whole proposition.' },
    { id: 'helaas', label: 'HELAAS', text: 'HELAAS', sub: 'zinsbijwoord · S-links', subEn: 'sentence adverb · S-left', caption: 'S-links-slot', captionEn: 'S-left slot', tip: 'HELAAS: zinsbijwoord. Vaak boven S; vooropplaatsing blijft een LEX-regel.', tipEn: 'HELAAS: sentence adverb. Often above S; fronting remains a LEX rule.' },
    { id: 'alleen', label: 'ALLEEN', text: 'ALLEEN', sub: 'focus · phrase-intern', subEn: 'focus · phrase-internal', caption: 'focus-slot', captionEn: 'focus slot', tip: 'ALLEEN: focus. Plaats boven de gefocuste phrase: NP of VP; geen algemene tussenpositie.', tipEn: 'ALLEEN: focus. Place above the focused phrase: NP or VP; not a general between-position.' },
    { id: 'ook', label: 'OOK', text: 'OOK', sub: 'focus/partikel · phrase', subEn: 'focus/particle · phrase', caption: 'focus-slot', captionEn: 'focus slot', tip: 'OOK: focus/partikel. Plaats boven de phrase waarop ook scope heeft; meestal NP of VP.', tipEn: 'OOK: focus/particle. Place above the phrase it scopes over; usually NP or VP.' },
    { id: 'zelfs', label: 'ZELFS', text: 'ZELFS', sub: 'focus · phrase-intern', subEn: 'focus · phrase-internal', caption: 'focus-slot', captionEn: 'focus slot', tip: 'ZELFS: focus. Plaats boven NP of VP waarop het focus legt.', tipEn: 'ZELFS: focus. Place above the NP or VP it focuses.' },
    { id: 'heel', label: 'HEEL', text: 'HEEL', sub: 'graad · AP/AdvP-intern', subEn: 'degree · AP/AdvP-internal', caption: 'graadslot', captionEn: 'degree slot', tip: 'HEEL: graadwoord. Plaats boven AP bij graadlezing, bijvoorbeeld heel groot.', tipEn: 'HEEL: degree word. Place above AP for degree readings, e.g. heel groot.' },
    { id: 'erg', label: 'ERG', text: 'ERG', sub: 'graad · AP/AdvP-intern', subEn: 'degree · AP/AdvP-internal', caption: 'graadslot', captionEn: 'degree slot', tip: 'ERG: graadwoord. Plaats boven AP, of boven V als het een wijze-bijwoord versterkt.', tipEn: 'ERG: degree word. Place above AP, or above V when it strengthens a manner adverb.' },
    { id: 'zeer', label: 'ZEER', text: 'ZEER', sub: 'graad · AP/AdvP-intern', subEn: 'degree · AP/AdvP-internal', caption: 'graadslot', captionEn: 'degree slot', tip: 'ZEER: graadwoord. Plaats boven AP; niet op een algemene LEX-asgrens.', tipEn: 'ZEER: degree word. Place above AP; not on a general LEX-axis boundary.' },
    { id: 'anafoor', label: 'anafoor', text: 'ANAFOOR', sub: 'verwijzing uit andere uiting', subEn: 'reference from another utterance', caption: 'anafoor', captionEn: 'anaphor', tip: 'Voor later: anaforisch element uit een andere zin/uiting.', tipEn: 'For later: anaphoric element from another sentence/utterance.' },
    { id: 'other-lex-axis', label: 'andere LEX-as', text: 'LEX-AS', sub: 'insertie uit andere boom', subEn: 'insertion from another tree', caption: 'andere LEX-as', captionEn: 'other LEX axis', tip: 'Voor later: materiaal uit de LEX-as van een andere boom.', tipEn: 'For later: material from the LEX axis of another tree.' }
  ];

  const LEX_INSERTION_EXTENSION_TARGETS = [
    { id: 'vp-boundary', label: 'VP-grens V ↔ object', tip: 'Insertie tussen werkwoord en object verlengt de VP-zone/grens, zonder de insertie als boomknoop toe te voegen.' },
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
    { id: 'tools', label: 'Werkknoppen', cssClass: 'top-menu-tools', tip: 'Werkknoppen: FIT, reset, JSON, Docs en editors. Nuttig bij bouwen en testen.' },
    { id: 'fit', label: 'Hoofdvenster', cssClass: 'top-menu-fit', tip: 'Hoofdvenster: standaard volledige boom zichtbaar; scroll/strak/vast zijn opties.' }
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


  function southLogicalModeLabel(mode = state.southLogicalMode || 'SOV') {
    return SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(mode) ? `${mode}-!` : mode;
  }

  function southLogicalModeListLabel() {
    return SOUTH_LOGICAL_MODES.map(southLogicalModeLabel).join(', ');
  }

  function movementRequiredModeComment(mode = state.southLogicalMode || 'SOV') {
    const label = southLogicalModeLabel(mode);
    return isEnglish()
      ? `${label}: the box approach cannot produce ${mode} as a base alternative. A movement rule is required to render the LEX axis correctly.`
      : `${label}: de box-aanpak kan ${mode} niet als basisalternatief opleveren. Voor correcte LEX-rendering is een verplaatsingsregel nodig.`;
  }

  function movementRequiredShortComment(mode = state.southLogicalMode || 'SOV') {
    const label = southLogicalModeLabel(mode);
    return isEnglish()
      ? `${label}: box layout cannot produce ${mode}; LEX needs a movement rule.`
      : `${label}: box-layout kan ${mode} niet opleveren; LEX vraagt een verplaatsingsregel.`;
  }

  function southModeRankMap(mode = state.southLogicalMode || 'SOV') {
    const order = southLogicalModeOrder(mode);
    const rank = new Map();
    order.forEach((item, index) => rank.set(item, index));
    return rank;
  }



  let ADVERB_OPTIONS = [
    { id: 'none', label: 'Geen bijwoord', labelEn: 'No adverb', title: 'Geen bijwoord', adverb: null }
  ];

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
    language: (function(){ try { return localStorage.getItem('opengraph_language') === 'en' ? 'en' : 'nl'; } catch (_err) { return 'nl'; } })(),
    projection: 'axes',
    centerMode: 'syntax',
    treeChoice: 'auto-min',
    functionalOrder: 'left-first',
    branchOrder: 'normal',
    branchOverrides: { top: 'auto', middle: 'auto', other: 'auto' },
    layoutDensity: 'auto',
    viewFitMode: 'window',
    selectedNodeId: null,
    showGrid: true,
    showRelations: true,
    showLabels: true,
    roleSwap: false,
    growthEnabled: false,
    growthStep: 0,
    southLogicalMode: 'SOV',
    freeSlotCount: 2,
    lexFreeSlotCount: 0,
    lexFreeSlotPlacement: 'above-vp',
    lexInsertionContent: 'empty',
    selectedAdverbId: 'none',
    lexInsertionExtensionTargets: ['vp-boundary'],
    portraitMenuSlots: 0,
    topMenusAbove: ['fit'],
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

  function activeAdverbOption() {
    return ADVERB_OPTIONS.find(option => option.id === state.selectedAdverbId) || ADVERB_OPTIONS[0];
  }

  function activeAdverbData() {
    const selected = activeAdverbOption();
    if (selected?.adverb) return selected.adverb;
    return state.example?.adverb || null;
  }

  function activeAdverbIsFronted() {
    const adv = activeAdverbData();
    if (!adv?.word) return false;
    const text = `${adv.position || ''} ${adv.placement || ''} ${adv.marking || ''} ${adv.sentence || ''}`.toLowerCase();
    const explicitFronting = /fronted|voorop|slot1|v2/.test(text);
    const host = String(adv.host || adv.defaultHost || '').trim().toUpperCase();
    // v4545: in GraphLite betekent plaatsing "boven S" een extern
    // LEX-slot vóór de hoofdzin. Dat is dus automatisch V2/inversie:
    // BIJWOORD | PV | SUBJECT | OBJECT. Andere hostboxen blijven lokaal.
    return explicitFronting || host === 'S' || validLexSlotPlacement(state.lexFreeSlotPlacement) === 'above-s';
  }

  function activeAdverbStatusLabel() {
    const adv = activeAdverbData();
    if (!adv?.word) return isEnglish() ? 'adverb=none' : 'bijwoord=geen';
    if (activeAdverbIsFronted()) {
      return isEnglish()
        ? `adverb=${adv.word} step 1: inserted on LEX slot 1 before movement; finite verb remains V2`
        : `bijwoord=${adv.word} stap 1: ingevoegd op LEX-slot 1 vóór verplaatsingen; persoonsvorm blijft V2`;
    }
    if (activeAdverbIsNeutralNiet()) {
      return isEnglish()
        ? `adverb=NIET step 1: external LEX insertion after object / before final verb cluster`
        : `bijwoord=NIET stap 1: externe LEX-insertie na object / vóór eindwerkwoordcluster`;
    }
    const host = adv.host || adv.defaultHost || '?';
    const marked = adv.placement === 'marked' ? (isEnglish() ? ', marked' : ', gemarkeerd') : '';
    return isEnglish()
      ? `adverb=${adv.word} step 1: on LEX above ${host}${marked}, before movement rules`
      : `bijwoord=${adv.word} stap 1: op LEX boven ${host}${marked}, vóór verplaatsingsregels`;
  }

  function adverbOptionIsMarked(option) {
    const adv = option?.adverb;
    if (!adv?.word) return false;
    return adv.placement === 'marked' || /marked|gemarkeerd|forced|geforceerd/i.test(String(adv.marking || ''));
  }

  function adverbSameLexicalItem(a, b) {
    if (!a?.word || !b?.word) return false;
    const sameWord = String(a.word).toUpperCase() === String(b.word).toUpperCase();
    const ac = String(a.category || '').toLowerCase();
    const bc = String(b.category || '').toLowerCase();
    return sameWord && (!ac || !bc || ac === bc);
  }

  function findAdverbMarkedToggleTarget() {
    const current = activeAdverbOption();
    const currentAdv = current?.adverb;
    if (!currentAdv?.word) return null;
    const currentMarked = adverbOptionIsMarked(current);
    const candidates = ADVERB_OPTIONS.filter(option => option?.adverb && option.id !== current.id && adverbSameLexicalItem(option.adverb, currentAdv));

    if (!currentMarked) {
      return candidates.find(adverbOptionIsMarked) || null;
    }

    const sameDefaultHost = candidates.filter(option => {
      const adv = option.adverb;
      return String(adv.defaultHost || '').toUpperCase() === String(currentAdv.defaultHost || '').toUpperCase();
    });
    return sameDefaultHost.find(option => !adverbOptionIsMarked(option) && String(option.adverb.host || '').toUpperCase() === String(option.adverb.defaultHost || '').toUpperCase())
      || sameDefaultHost.find(option => !adverbOptionIsMarked(option))
      || candidates.find(option => !adverbOptionIsMarked(option))
      || null;
  }

  function adverbMarkedToggleLabel(target = findAdverbMarkedToggleTarget()) {
    if (!target?.adverb) return '';
    const adv = target.adverb;
    const marked = adverbOptionIsMarked(target);
    return isEnglish()
      ? `click: show ${marked ? 'marked' : 'default'} version above ${adv.host || adv.defaultHost}`
      : `klik: toon ${marked ? 'gemarkeerde' : 'ongemarkeerde'} versie boven ${adv.host || adv.defaultHost}`;
  }

  function toggleAdverbMarkedVariant() {
    const target = findAdverbMarkedToggleTarget();
    if (!target?.id) {
      if (els.actionFeedback) {
        els.actionFeedback.textContent = isEnglish()
          ? 'No marked/default counterpart is available for this adverb.'
          : 'Geen gemarkeerde/ongemarkeerde tegenhanger beschikbaar voor dit bijwoord.';
        els.actionFeedback.className = 'action-feedback neutral';
      }
      return;
    }
    state.selectedAdverbId = target.id;
    applyExampleAdverbDefaults();
    resetManualViewBox();
    if (els.actionFeedback) {
      els.actionFeedback.textContent = isEnglish()
        ? `Adverb variant: ${target.labelEn || target.label || target.id}`
        : `Bijwoordvariant: ${target.label || target.id}`;
      els.actionFeedback.className = 'action-feedback neutral';
    }
    render();
  }

  function predicateLabelForAdverbContext(ex = state.example || EXAMPLES[0]) {
    const basePredicate = ex?.predicate || 'BIJT';
    const adv = activeAdverbData();
    if (!adv?.word || !activeAdverbIsFronted()) return basePredicate;

    // v4545: GISTEREN voorop mag niet automatisch de foutieve LEX-as
    // GISTEREN | BIJT | ... opleveren bij eenvoudige tegenwoordige-tijd-zinnen.
    // De bijwoordkeuze blijft extern aan de basisboom, maar de LEX-as mag de
    // passende persoonsvorm kiezen wanneer die in het mini-lexicon bekend is.
    // Perfectum en bijzinnen worden hier niet aangepast.
    const word = String(adv.word || '').toUpperCase();
    if (word !== 'GISTEREN') return basePredicate;
    if (String(ex?.lexRule || '').includes('bijzin')) return basePredicate;
    if ((ex?.lexItems || []).some(item => String(item.source || '').toLowerCase() === 'pv')) return basePredicate;
    const predicateItem = (ex?.lexItems || []).find(item => String(item.source || '').toLowerCase() === 'predicate' || String(item.role || '').toLowerCase() === 'predicate');
    const lexeme = tokenLexemeId(predicateItem || { label: basePredicate });
    const frame = SIMPLE_VERB_FRAMES[lexeme];
    return frame?.imperfectum?.toUpperCase?.() || basePredicate;
  }

  function roleLabels() {
    const ex = state.example || EXAMPLES[0];
    const subject = ex.subjectDefault || 'HOND';
    const object = ex.objectDefault || 'MAN';
    return {
      subject: state.roleSwap ? object : subject,
      object: state.roleSwap ? subject : object,
      predicate: predicateLabelForAdverbContext(ex)
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
    // v4545: bijwoord is een aparte laag/dropdown; de LEX-preview blijft de gekozen basiszin.
    return activeLexItems().map(tokenHtml).join(' ');
  }

  const SIMPLE_LEXICON_POLICY = {
    trui: { roles: ['object'], themes: ['patiens'] },
    vrouw: { roles: ['subject'], themes: ['agens'] },
    hond: { roles: ['subject', 'object'], themes: ['agens', 'patiens'] },
    man: { roles: ['subject', 'object'], themes: ['agens', 'patiens'] }
  };

  const SIMPLE_VERB_FRAMES = {
    breit: { subjects: ['vrouw'], objects: ['trui'], imperfectum: 'BREIDE', participle: 'GEBREID' },
    bijt: { subjects: ['hond', 'kat', 'man', 'vrouw'], objects: ['man', 'hond', 'kat', 'vrouw'], imperfectum: 'BEET', participle: 'GEBETEN' }
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
        const adverbWord = (card.dataset.adverbWord || card.dataset.adverb || '').trim();
        const adverbHost = (card.dataset.adverbHost || card.dataset.adverbDefaultHost || '').trim().toUpperCase();
        const adverbDefaultHost = (card.dataset.adverbDefaultHost || adverbHost || '').trim().toUpperCase();
        const adverbMarked = String(card.dataset.adverbMarked || card.dataset.markedAdverb || '').toLowerCase() === 'true' || String(card.dataset.adverbPlacement || '').toLowerCase() === 'marked';
        const adverb = adverbWord ? {
          id: String(card.dataset.adverbId || adverbWord).toLowerCase(),
          word: adverbWord.toUpperCase(),
          category: (card.dataset.adverbCategory || '').trim(),
          defaultHost: adverbDefaultHost,
          host: adverbHost || adverbDefaultHost,
          placement: adverbMarked ? 'marked' : 'default',
          marking: card.dataset.adverbMarking || (adverbMarked ? 'functional:marked-host' : 'functional:default-host'),
          scope: card.dataset.adverbScope || ''
        } : null;
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
          adverb,
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

  function makeAdverbOptionFromTableRow(row, index) {
    const cells = [...row.querySelectorAll('td')];
    if (cells.length < 6) return null;
    const id = (cells[0].textContent || `adv-${index + 1}`).trim();
    const sentence = (cells[1].textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
    const category = (cells[2].textContent || '').trim();
    const defaultHost = (cells[3].textContent || '').trim().toUpperCase();
    const host = (cells[4].textContent || defaultHost).trim().toUpperCase();
    const markingText = (cells[5].textContent || 'default').trim();
    const parts = id.toLowerCase().split('-');
    const word = ((parts[1] === 'marked' ? parts[2] : parts[2]) || '').toUpperCase();
    if (!word || !VALID_ADVERB_HOST_BOXES.has(host || defaultHost)) return null;
    const hostLabel = host || defaultHost;
    const isNeutralNegation = /^NIET$/i.test(word) && /NEG/i.test(category) && /neg-scope-default|post-object|MAN\s+NIET/i.test(`${markingText} ${sentence}`);
    const fronted = !isNeutralNegation && (/fronted|voorop|slot\s*1|v2/i.test(markingText) || hostLabel === 'S');
    const marked = !fronted && !isNeutralNegation && /marked|gemarkeerd|forced|geforceerd|scope-marked/i.test(markingText);
    const effectiveMarking = markingText || (fronted ? 'functional:fronted-v2' : (marked ? 'functional:marked-host' : 'functional:default-host'));
    const linear = isNeutralNegation ? 'post-object-pre-vcluster' : '';
    const placementLabel = isNeutralNegation ? 'na object / vóór V-cluster' : (fronted ? `boven ${hostLabel} · V2` : `boven ${hostLabel}${marked ? ' · !' : ''}`);
    const placementLabelEn = isNeutralNegation ? 'after object / before V cluster' : (fronted ? `above ${hostLabel} · V2` : `above ${hostLabel}${marked ? ' · !' : ''}`);
    return {
      id,
      label: `${word} · ${category || 'BIJWOORD'} · ${placementLabel}`,
      labelEn: `${word} · ${category || 'ADVERB'} · ${placementLabelEn}`,
      title: sentence || word,
      adverb: {
        id: word.toLowerCase(),
        word,
        category,
        defaultHost: defaultHost || host,
        host: host || defaultHost,
        position: fronted ? 'fronted' : (isNeutralNegation ? 'linear-slot' : 'hosted'),
        placement: fronted ? 'fronted-v2' : (marked ? 'marked' : (isNeutralNegation ? 'post-object-pre-vcluster' : 'default')),
        marking: effectiveMarking,
        linear,
        sentence
      }
    };
  }

  async function loadAdverbOptionsFromHtml() {
    try {
      const response = await fetch(`examples-adverbs.html?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) return;
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const rows = [...doc.querySelectorAll('tbody tr')];
      const parsed = rows.map(makeAdverbOptionFromTableRow).filter(Boolean);
      if (parsed.length) {
        ADVERB_OPTIONS = [
          { id: 'none', label: 'Geen bijwoord', labelEn: 'No adverb', title: 'Geen bijwoord', adverb: null },
          ...parsed
        ];
        if (!ADVERB_OPTIONS.some(option => option.id === state.selectedAdverbId)) state.selectedAdverbId = 'none';
      }
    } catch (err) {
      // file:// of cache kan fetch blokkeren; de default geen-bijwoord blijft dan actief.
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
    const cloned = {
      ...layout,
      node: layout.node,
      nodes: layout.nodes.map(n => ({ ...n })),
      edges: layout.edges.map(e => ({ ...e })),
      boxes: layout.boxes.map(b => ({ ...b })),
      box: { ...layout.box }
    };
    if (Array.isArray(layout.lexAdverbAxisSlots)) {
      cloned.lexAdverbAxisSlots = layout.lexAdverbAxisSlots.map(slot => ({ ...slot }));
    }
    if (layout.lexAdverbAxisSpace) cloned.lexAdverbAxisSpace = { ...layout.lexAdverbAxisSpace };
    if (layout.topicalizationSlot) cloned.topicalizationSlot = { ...layout.topicalizationSlot };
    if (layout.v2Slot) cloned.v2Slot = { ...layout.v2Slot };
    if (layout.freeSlotReservation) cloned.freeSlotReservation = { ...layout.freeSlotReservation };
    return cloned;
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
    if (Array.isArray(layout.lexAdverbAxisSlots)) {
      for (const slot of layout.lexAdverbAxisSlots) {
        if (Number.isFinite(slot.x)) slot.x += dx;
        if (Number.isFinite(slot.y)) slot.y += dy;
      }
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
    const id = String(value || 'above-vp');
    return LEX_SLOT_PLACEMENTS.some(option => option.id === id) ? id : 'above-vp';
  }

  function hostToLexPlacement(host) {
    const h = String(host || '').trim().toLowerCase();
    if (['vcluster', 'v-cluster', 'v_cluster'].includes(h)) return 'above-vcluster';
    if (['s', 'np', 'vp', 'v', 'pp', 'ap'].includes(h)) return `above-${h}`;
    return 'above-vp';
  }

  function applyExampleAdverbDefaults() {
    const adv = activeAdverbData();
    if (!adv?.word) {
      state.lexFreeSlotCount = 0;
      state.lexInsertionContent = 'empty';
      state.lexFreeSlotPlacement = 'above-vp';
      return;
    }
    state.lexFreeSlotCount = 1;
    state.lexInsertionContent = validLexInsertionContent(adv.id || adv.word.toLowerCase());
    state.lexFreeSlotPlacement = validLexSlotPlacement(hostToLexPlacement(adv.host || adv.defaultHost));
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

  function lexInsertionContentSub(def = lexInsertionContentDef()) {
    return isEnglish() ? (def.subEn || def.sub || '') : (def.sub || '');
  }

  function lexInsertionContentCaption(def = lexInsertionContentDef()) {
    return isEnglish() ? (def.captionEn || def.caption || '') : (def.caption || '');
  }

  function lexInsertionContentTip(def = lexInsertionContentDef()) {
    return isEnglish() ? (def.tipEn || def.tip || '') : (def.tip || '');
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
    if (isEnglish()) return LEX_EXTENSION_LABELS_EN[id]?.[0] || id;
    return LEX_INSERTION_EXTENSION_TARGETS.find(option => option.id === id)?.label || id;
  }

  function lexInsertionTargetTip(id) {
    if (isEnglish()) return LEX_EXTENSION_LABELS_EN[id]?.[1] || '';
    return LEX_INSERTION_EXTENSION_TARGETS.find(option => option.id === id)?.tip || '';
  }

  function lexPlacementIsSyntaxHost(value = validLexSlotPlacement()) {
    return String(value || '').startsWith('above-');
  }

  function insertionBranchExtensionRows() {
    if (lexPlacementIsSyntaxHost()) return 0;
    return lexFreeSlotCount() > 0 ? Math.max(1, lexFreeSlotCount()) : 0;
  }

  function lexFreeSlotDescriptors() {
    const placement = validLexSlotPlacement();
    const content = lexInsertionContentDef();
    const extensionTargets = validLexInsertionTargets();
    return Array.from({ length: lexFreeSlotCount() }, (_, index) => ({
      id: `lex-insert-${index + 1}`,
      label: `LEX-insertie ${index + 1}`,
      kind: lexPlacementIsSyntaxHost(placement) ? 'lex-axis-adverb-slot' : 'lex-axis-insertion-box',
      axis: 'LEX',
      placement,
      host_box: lexPlacementIsSyntaxHost(placement) ? adverbHostLabelFromPlacement(placement, content) : null,
      content: content.id,
      text: content.text,
      sub: lexInsertionContentSub(content),
      extension_targets: extensionTargets,
      insertion_grips_tree: false,
      effect: lexPlacementIsSyntaxHost(placement) ? 'external lexical insertion on LEX axis; host subtree is lowered to reserve vertical space' : 'extends-selected-branches-or-box-boundaries',
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


  function applyLexAdverbAxisSlotSpace(layout) {
    // v4545: "boven VP/S/etc." betekent niet: een bijwoordlabel boven de
    // syntactische box. Het betekent: een extern LEX-slot op de LEX-as,
    // verticaal net boven die box. Om die rij zichtbaar te maken wordt de
    // gekozen host-subboom lager gezet; de insertie zelf komt niet uit de
    // basisboom en wordt niet als boomprojectie getekend.
    const count = lexFreeSlotCount();
    const placement = validLexSlotPlacement();
    if (!layout || count <= 0 || !lexPlacementIsSyntaxHost(placement)) return layout;
    const content = lexInsertionContentDef();
    const host = findAdverbHostNode(layout, placement, content);
    if (!host) return layout;
    const hostLabel = activeAdverbHostLabel(content, placement);
    const visibleSlotCount = Math.max(1, count);
    // v4548: reserveer één extra gridrij. Het bijwoordslot ligt daardoor
    // echt boven de hostbox (V-CLUSTER/NP/VP/etc.) en raakt/overlapt de
    // box niet. De host wordt alleen als hoogteanker gebruikt.
    const reserveRows = visibleSlotCount + 1;
    const beforeBox = hostBoxForNode(layout, host);
    const oldSlotTopY = beforeBox ? beforeBox.minY : host.y;
    shiftSubtreeY(layout, host.id, reserveRows);
    const shiftedHost = (layout.nodes || []).find(n => String(n.id) === String(host.id)) || host;
    const shiftedBox = hostBoxForNode(layout, shiftedHost);
    const slotY0 = shiftedBox ? shiftedBox.minY - reserveRows : oldSlotTopY;
    const slots = [];
    for (let index = 0; index < visibleSlotCount; index += 1) {
      slots.push({
        id: `lex-adverb-axis-slot-${index + 1}`,
        label: visibleSlotCount > 1 ? `stap 1 · LEX-slot boven ${hostLabel} ${index + 1}` : `stap 1 · LEX-slot boven ${hostLabel}`,
        hostId: shiftedHost.id,
        hostLabel,
        x: shiftedHost.x,
        y: slotY0 + index,
        content: content.id,
        text: content.text,
        sub: lexInsertionContentSub(content),
        marked: adverbOptionIsMarked(activeAdverbOption()),
        marking: adverbOptionIsMarked(activeAdverbOption()) ? (activeAdverbData()?.marking || 'functional:marked-host') : (activeAdverbData()?.marking || 'functional:default-host'),
        toggleTargetId: findAdverbMarkedToggleTarget()?.id || '',
        toggleLabel: adverbMarkedToggleLabel()
      });
    }
    layout.lexAdverbAxisSlots = slots;
    layout.lexAdverbAxisSpace = { count: visibleSlotCount, reserveRows, hostId: shiftedHost.id, hostLabel, placement, axis: 'LEX', source: 'external-lexical-insertion' };
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
    const base = addOpnTopicalizationSlot(layoutTree(cloneTree(treeSpec()), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.syntaxRoot || 's');
    return applyLexInsertionBranchExtensions(normalizeLayout(applyLexAdverbAxisSlotSpace(base)), 'syntax');
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
    const mode = state.southLogicalMode || 'SOV';
    // OSV-! is not a possible base alternative in the box approach. A box
    // layout cannot itself yield OSV while VP still groups object and verb.
    // The visible LEX axis would require a separate movement rule. Keep all
    // normal trees/flips untouched; use the stable base tree here and apply only
    // the local OSV visual marker below.
    const spec = mode === 'OSV' ? cloneTree(treeSpec()) : southAwareSyntaxSpec(mode);
    const base0 = addOpnTopicalizationSlot(layoutTree(spec, 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.syntaxRoot || 's');
    const base = applyLexInsertionBranchExtensions(normalizeLayout(applyLexAdverbAxisSlotSpace(base0)), 'syntax');
    return normalizeLayout(applySouthLogicalSyntaxGroupOrder(base, mode));
  }

  function getSouthAwareFunctionalLayout() {
    const firstSide = layoutFirstSide();
    return applyLexInsertionBranchExtensions(normalizeLayout(addOpnTopicalizationSlot(layoutTree(southAwareFunctionalSpec(), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.functionalRoot || 'ft-clause')), 'functional');
  }

  function applySouthLogicalSyntaxGroupOrder(layout, mode = state.southLogicalMode || 'SOV') {
    const order = southLogicalModeOrder(mode);
    if (!layout || !Array.isArray(layout.nodes) || order.length !== 3) return layout;

    const nodeById = new Map(layout.nodes.map(n => [String(n.id || ''), n]));
    const sRoot = nodeById.get('s');
    const vpRoot = nodeById.get('vp');
    const subjRoot = nodeById.get('np-subj');
    const subjLeaf = nodeById.get('subj');
    const objRoot = nodeById.get('np-obj');
    const objLeaf = nodeById.get('obj');
    const verbRoot = nodeById.get('v');
    const verbLeaf = nodeById.get('pred');
    if (!sRoot || !vpRoot || !subjRoot || !subjLeaf || !objRoot || !objLeaf || !verbRoot || !verbLeaf) return layout;

    const originalXs = [subjRoot.x, objRoot.x, verbRoot.x].slice().sort((a, b) => a - b);
    const targetRootX = {};
    order.forEach((key, index) => { targetRootX[key] = originalXs[index]; });

    const offsets = {
      S: subjLeaf.x - subjRoot.x,
      O: objLeaf.x - objRoot.x,
      V: verbLeaf.x - verbRoot.x
    };

    subjRoot.x = targetRootX.S;
    subjLeaf.x = targetRootX.S + offsets.S;
    objRoot.x = targetRootX.O;
    objLeaf.x = targetRootX.O + offsets.O;
    verbRoot.x = targetRootX.V;
    verbLeaf.x = targetRootX.V + offsets.V;

    vpRoot.x = Math.round((objRoot.x + verbRoot.x) / 2);
    sRoot.x = Math.round((subjRoot.x + vpRoot.x) / 2);

    layout.edges.forEach(e => {
      const from = nodeById.get(String(e.from || ''));
      const to = nodeById.get(String(e.to || ''));
      if (from) {
        e.fromX = from.x;
        e.fromY = from.y;
      }
      if (to) {
        e.toX = to.x;
        e.toY = to.y;
      }
    });

    const syntaxNodes = (STRUCTURE_CONFIG.syntaxNodes || []).map(n => ({ id: n.id, children: Array.isArray(n.children) ? [...n.children] : [] }));
    const treeById = new Map(syntaxNodes.map(n => [String(n.id), n]));
    const descendantsCache = new Map();
    function descendantIds(id) {
      if (descendantsCache.has(id)) return descendantsCache.get(id);
      const node = treeById.get(String(id));
      const out = new Set([String(id)]);
      (node?.children || []).forEach(childId => descendantIds(childId).forEach(v => out.add(v)));
      descendantsCache.set(String(id), out);
      return out;
    }
    layout.boxes.forEach(b => {
      const nodeId = String(b.nodeId || '').replace(/^box-/, '');
      const ids = [...descendantIds(nodeId).values()].filter(v => nodeById.has(v));
      if (!ids.length) return;
      const pts = ids.map(v => nodeById.get(v));
      b.minX = Math.min(...pts.map(n => n.x));
      b.maxX = Math.max(...pts.map(n => n.x));
      b.minY = Math.min(...pts.map(n => n.y));
      b.maxY = Math.max(...pts.map(n => n.y));
      const root = nodeById.get(nodeId);
      if (root) {
        b.rootX = root.x;
        b.rootY = root.y;
      }
    });
    layout.box = {
      minX: Math.min(...layout.nodes.map(n => n.x)),
      maxX: Math.max(...layout.nodes.map(n => n.x)),
      minY: Math.min(...layout.nodes.map(n => n.y)),
      maxY: Math.max(...layout.nodes.map(n => n.y))
    };
    return layout;
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
      const syntaxVerbNode = (layout?.nodes || []).find(n => n.kind !== 'leaf' && ['v'].includes(String(n.label || '').toLowerCase()))
        || (layout?.nodes || []).find(n => n.kind !== 'leaf' && ['v'].includes(String(n.cat || '').toLowerCase()))
        || (layout?.nodes || []).find(n => n.kind !== 'leaf' && ['predicate', 'aux', 'participle'].includes(String(n.role || '').toLowerCase()) && !['vp'].includes(String(n.label || '').toLowerCase()) && !['vp'].includes(String(n.cat || '').toLowerCase()) && !String(n.id || '').toLowerCase().includes('vp'))
        || nodeByRoleOrPattern(layout, ['predicate', 'aux', 'participle'], ['aux', 'vdw', 'box-v', '-v', ' v'], { leaf: false })
        || nodeByRoleOrPattern(layout, ['predicate', 'aux', 'participle'], ['aux', 'vdw', 'v']);
      return syntaxVerbNode;
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
    // v4536: grid-first and fit-height are no longer mobile-only.
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
    // v4536: de oude numerieke onderruimte blijft op 0. De relevante instelling
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
    if (isEnglish()) return TOP_MENU_LABELS_EN[id]?.[0] || id;
    return TOP_MENU_CHOICES.find(choice => choice.id === id)?.label || id;
  }

  function topMenuTip(id) {
    if (isEnglish()) return TOP_MENU_LABELS_EN[id]?.[1] || '';
    return TOP_MENU_CHOICES.find(choice => choice.id === id)?.tip || '';
  }

  function validRightMenuMode(value = state.rightMenuMode) {
    const id = String(value || 'wide');
    return RIGHT_MENU_WIDTHS.some(option => option.id === id) ? id : 'wide';
  }

  function rightMenuProfile() {
    return RIGHT_MENU_WIDTHS.find(option => option.id === validRightMenuMode()) || RIGHT_MENU_WIDTHS[1];
  }

  function validViewFitMode(value = state.viewFitMode) {
    const id = String(value || 'window');
    return VIEW_FIT_MODES.some(option => option.id === id) ? id : 'window';
  }

  function syncViewFitModeClasses() {
    const mode = validViewFitMode();
    const body = document.body;
    const root = document.documentElement;
    if (!body || !root) return;
    ['window', 'auto', 'scroll', 'fixed'].forEach(id => {
      body.classList.toggle(`main-window-${id}`, mode === id);
      root.classList.toggle(`main-window-${id}`, mode === id);
    });
    body.dataset.viewFitMode = mode;
    root.dataset.viewFitMode = mode;
  }

  function viewFitLabel() {
    const opt = VIEW_FIT_MODES.find(option => option.id === validViewFitMode());
    return opt?.label || validViewFitMode();
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
    syncViewFitModeClasses();
  }

  function renderTopMenuChoiceControls() {
    const selected = normalizeTopMenusAbove();
    state.topMenusAbove = selected;
    const selectedSet = new Set(selected);
    const summary = selected.length
      ? (isEnglish()
        ? `Above grid: ${selected.map(topMenuLabel).join(' + ')}. All ${TOP_MENU_MAX} named menus can be placed above the grid; the others stay below it.`
        : `Boven grid: ${selected.map(topMenuLabel).join(' + ')}. Alle ${TOP_MENU_MAX} benoemde menu’s kunnen boven het grid; overige menu’s staan onder het grid.`)
      : (isEnglish()
        ? `No menu above the grid. All ${TOP_MENU_MAX} named menus can be placed above the grid; by default everything stays below it.`
        : `Geen menu boven het grid. Alle ${TOP_MENU_MAX} benoemde menu’s kunnen boven het grid; standaard staat alles onder het grid.`);
    document.querySelectorAll('[data-top-menu-choice]').forEach(input => {
      const id = input.getAttribute('data-top-menu-choice');
      const checked = selectedSet.has(id);
      input.checked = checked;
      input.disabled = !checked && selected.length >= TOP_MENU_MAX;
      const label = topMenuLabel(id);
      const tip = topMenuTip(id);
      input.title = isEnglish()
        ? `${label}. ${tip} All ${TOP_MENU_MAX} named menus can be placed above the grid.`
        : `${label}. ${tip} Alle ${TOP_MENU_MAX} benoemde menu’s kunnen boven het grid.`;
      setInputLabelText(input, label);
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
    // v4536: het gridvenster wordt gemaximeerd op de actuele fit-box
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
    if (mode === 'flat') return { cellX: BASE_CELL * 1.48, cellY: BASE_CELL * 0.72, fontScale: 1.04, label: 'platter' };
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

  function populateGridLines(grid, box) {
    if (!grid || !box) return;
    grid.replaceChildren();
    const sx = cellX() / 2;
    const sy = cellY() / 2;
    const minX = Number(box.x);
    const minY = Number(box.y);
    const maxX = minX + Number(box.w);
    const maxY = minY + Number(box.h);
    if (![minX, minY, maxX, maxY, sx, sy].every(Number.isFinite) || sx <= 0 || sy <= 0) return;
    const startX = Math.floor(minX / sx) * sx;
    const startY = Math.floor(minY / sy) * sy;
    let xi = Math.round(startX / sx);
    for (let x = startX; x <= maxX + sx * 0.5; x += sx, xi += 1) {
      grid.appendChild(svgEl('line', { x1: x, y1: minY, x2: x, y2: maxY, class: xi % 2 === 0 ? 'grid-line major' : 'grid-line' }));
    }
    let yi = Math.round(startY / sy);
    for (let y = startY; y <= maxY + sy * 0.5; y += sy, yi += 1) {
      grid.appendChild(svgEl('line', { x1: minX, y1: y, x2: maxX, y2: y, class: yi % 2 === 0 ? 'grid-line major' : 'grid-line' }));
    }
    if (minY <= 0 && maxY >= 0) grid.appendChild(svgEl('line', { x1: minX, y1: 0, x2: maxX, y2: 0, class: 'grid-axis' }));
    if (minX <= 0 && maxX >= 0) grid.appendChild(svgEl('line', { x1: 0, y1: minY, x2: 0, y2: maxY, class: 'grid-axis' }));
  }

  function sizeDynamicGridToBox(box) {
    if (!els.svg || !box) return;
    const gridBox = (isMainScreenActive() && state.lastGridBox) ? state.lastGridBox : box;
    els.svg.querySelectorAll('.grid[data-dynamic-grid="true"]').forEach(grid => {
      populateGridLines(grid, gridBox);
    });
  }

  function drawGrid(g, width = 2600, height = 1600) {
    const grid = svgEl('g', { class: 'grid', 'data-dynamic-grid': 'true' });
    populateGridLines(grid, { x: -1200, y: -420, w: width + 1200, h: height + 420 });
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

  function categoryLabelForNode(node) {
    const label = String(node?.label || '').trim().toUpperCase();
    if (label === 'V-CLUSTER' || label === 'VCLUSTER') return 'V-CLUSTER';
    return String(node?.cat || node?.label || '').trim().toUpperCase();
  }

  function isValidAdverbHostNode(node) {
    if (!node || node.kind === 'leaf' || node.kind === 'role' || node.kind === 'role-root') return false;
    return VALID_ADVERB_HOST_BOXES.has(categoryLabelForNode(node));
  }

  function selectedAdverbHostNode(layout) {
    if (!state.selectedNodeId) return null;
    const node = (layout?.nodes || []).find(n => String(n.id) === String(state.selectedNodeId));
    return isValidAdverbHostNode(node) ? node : null;
  }

  function adverbPlacementRuleForCategory(category) {
    const key = String(category || '').trim().toUpperCase().replace(/[\s/-]+/g, '_');
    return ADVERB_PLACEMENT_RULES.find(rule => rule.category === key) || null;
  }

  function preferredAdverbHostLabel(def = lexInsertionContentDef()) {
    const adv = activeAdverbData();
    const rule = adverbPlacementRuleForCategory(adv?.category || def?.category || '');
    if (rule?.defaultHost && VALID_ADVERB_HOST_BOXES.has(rule.defaultHost)) return rule.defaultHost;
    const id = String(def?.id || adv?.id || '').toLowerCase();
    if (['heel', 'erg', 'zeer'].includes(id)) return 'AP';
    if (['niet', 'snel', 'hard', 'zachtjes'].includes(id)) return 'V';
    if (['vaak', 'soms', 'altijd', 'ook', 'daar'].includes(id)) return 'VP';
    if (['alleen', 'zelfs'].includes(id)) return 'NP';
    if (['gisteren', 'morgen', 'misschien', 'waarschijnlijk', 'helaas', 'daarom', 'anders'].includes(id)) return 'S';
    return 'VP';
  }

  function activeAdverbHostLabel(def = lexInsertionContentDef(), placement = validLexSlotPlacement()) {
    // v4545: de host komt primair uit de gekozen BIJWOORD-optie.
    // Dit voorkomt dat alle plaatsingen via een fallback opnieuw op S landen.
    const adv = activeAdverbData();
    const explicitHost = String(adv?.host || adv?.defaultHost || '').trim().toUpperCase();
    if (VALID_ADVERB_HOST_BOXES.has(explicitHost)) return explicitHost;
    const option = LEX_SLOT_PLACEMENTS.find(item => item.id === placement);
    if (option?.host && VALID_ADVERB_HOST_BOXES.has(option.host)) return option.host;
    return preferredAdverbHostLabel(def);
  }

  function adverbHostLabelFromPlacement(placement = validLexSlotPlacement(), def = lexInsertionContentDef()) {
    return activeAdverbHostLabel(def, placement);
  }

  function hostBoxForNode(layout, node) {
    if (!layout || !node) return null;
    return (layout.boxes || []).find(box => String(box.nodeId) === String(node.id)) || null;
  }

  function findAdverbHostNode(layout, placement = validLexSlotPlacement(), def = lexInsertionContentDef()) {
    if (!layout) return null;
    const placementId = String(placement || '');
    if (placementId === 'above-selected-box') {
      const selected = selectedAdverbHostNode(layout);
      if (selected) return selected;
    }
    const wanted = activeAdverbHostLabel(def, placement);
    const fallback = preferredAdverbHostLabel(def);
    const nodes = orderedTreeNodes(layout).map(item => item.node);
    const vCluster = nodes.find(node => isValidAdverbHostNode(node) && categoryLabelForNode(node) === 'V-CLUSTER');
    // v4548: bij perfectum/werkwoordcluster betekent V-nabije plaatsing
    // eerst: boven de hele V-CLUSTER-box. Niet in de cluster tussen AUX/VDW.
    if (wanted === 'V' && vCluster) return vCluster;
    return nodes.find(node => isValidAdverbHostNode(node) && categoryLabelForNode(node) === wanted)
      || nodes.find(node => isValidAdverbHostNode(node) && categoryLabelForNode(node) === fallback)
      || nodes.find(isValidAdverbHostNode)
      || null;
  }

  function drawHostedAdverbSlots(g, layout, origin, growthPlan = null) {
    // v4545: bijwoord-inserts worden nergens meer boven/op de syntaxboom
    // getekend. Alle zichtbare bijwoordplaatsingen staan op de LEX-as.
    // De layout kan nog wel ruimte reserveren door de host-subboom lager te
    // zetten; de externe insertie zelf wordt in drawLexAxis getekend.
    return;
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
    drawHostedAdverbSlots(g, layout, origin, growthPlan);
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
    if (Array.isArray(layout.lexAdverbAxisSlots) && layout.lexAdverbAxisSlots.length) {
      const slots = layout.lexAdverbAxisSlots.map(slot => ({ ...slot, px: px(slot.x, origin), py: py(slot.y, origin) }));
      map.set('__lexAdverbAxisSlots', { id: '__lexAdverbAxisSlots', kind: 'lex-adverb-axis-slots', slots });
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

  function activeAdverbLinearRule() {
    const adv = activeAdverbData();
    return String(adv?.linear || adv?.linearSlot || adv?.placementRule || '').trim().toLowerCase();
  }

  function activeAdverbIsNeutralNiet() {
    const adv = activeAdverbData();
    const word = String(adv?.word || adv?.id || '').trim().toUpperCase();
    const category = String(adv?.category || '').trim().toUpperCase();
    const marking = String(adv?.marking || '').trim().toLowerCase();
    const linear = activeAdverbLinearRule();
    return (word === 'NIET' || adv?.id === 'niet')
      && category.includes('NEG')
      && !adverbOptionIsMarked(activeAdverbOption())
      && (linear === 'post-object-pre-vcluster' || marking.includes('neg-scope-default'));
  }

  function lexItemRoleName(item) {
    return String(item?.role || item?.source || item?.id || '').trim().toLowerCase();
  }

  function findObjectLexItem(items = state.example?.lexItems || []) {
    return (items || []).find(item => ['object', 'obj', 'patiens', 'patient'].includes(lexItemRoleName(item)))
      || (items || []).find(item => String(item?.source || '').toLowerCase().includes('object'))
      || null;
  }

  function findFinalVerbLexItem(items = state.example?.lexItems || []) {
    return (items || []).find(item => ['vdw', 'participle'].includes(lexItemRoleName(item)))
      || (items || []).find(item => String(item?.source || '').toLowerCase() === 'vdw')
      || null;
  }

  function lexPostObjectNegationSlotY(y0, sourceMap = null, items = state.example?.lexItems || []) {
    // v4552: neutraal NIET is geen gewone hostplaatsing boven VP.
    // Het is een eigen LEX-insertieregel: na object en vóór eindwerkwoord/V-cluster.
    const obj = findObjectLexItem(items);
    const objIndex = obj ? items.findIndex(item => item === obj) : -1;
    const objY = obj && objIndex >= 0
      ? projectedLexItemY(obj, objIndex, y0, sourceMap, items)
      : y0 + Math.max(1, lexSlotBaseOffset(items) + 2) * 64;
    const finalVerb = findFinalVerbLexItem(items);
    if (finalVerb) {
      const finalIndex = items.findIndex(item => item === finalVerb);
      const finalY = projectedLexItemY(finalVerb, finalIndex, y0, sourceMap, items);
      if (Number.isFinite(finalY) && finalY > objY + 32) return Math.round((objY + finalY) / 2);
    }
    return objY + 64;
  }

  function lexConfiguredFreeSlots(y0, items = state.example?.lexItems || [], contextYs = [], sourceMap = null) {
    const count = lexFreeSlotCount();
    if (!count) return [];
    const placement = validLexSlotPlacement();
    const content = lexInsertionContentDef();
    if (activeAdverbIsNeutralNiet()) {
      const slotY = lexPostObjectNegationSlotY(y0, sourceMap, items);
      return [{
        id: 'lex-adverb-negation-slot-1',
        y: slotY,
        label: 'stap 1 · NIET na object / vóór V-cluster',
        hostLabel: 'VP · negatiescope',
        content,
        marked: false,
        marking: activeAdverbData()?.marking || 'functional:neg-scope-default',
        toggleTargetId: findAdverbMarkedToggleTarget()?.id || '',
        toggleLabel: adverbMarkedToggleLabel(),
        axis: 'LEX',
        source: 'external-negation'
      }];
    }
    if (activeAdverbIsFronted() && isMainV2Rule()) {
      const slotY = projectedFrontedAdverbSlotY(y0, sourceMap, items);
      return [{
        id: 'lex-adverb-fronted-slot-1',
        y: slotY,
        label: 'stap 1 · BIJWOORD voorop',
        hostLabel: 'S/V2',
        content,
        marked: adverbOptionIsMarked(activeAdverbOption()),
        marking: activeAdverbData()?.marking || 'functional:fronted-v2',
        toggleTargetId: findAdverbMarkedToggleTarget()?.id || '',
        toggleLabel: adverbMarkedToggleLabel(),
        axis: 'LEX',
        source: 'external-fronted-adverb'
      }];
    }
    if (lexPlacementIsSyntaxHost(placement)) {
      const stored = sourceMap?.get?.('__lexAdverbAxisSlots')?.slots || [];
      if (stored.length) {
        return stored.slice(0, count).map((slot, index) => ({
          id: slot.id || `lex-adverb-axis-slot-${index + 1}`,
          y: slot.py,
          label: slot.label || `stap 1 · LEX-slot boven ${slot.hostLabel || adverbHostLabelFromPlacement(placement, content)}`,
          hostLabel: slot.hostLabel || adverbHostLabelFromPlacement(placement, content),
          content,
          marked: !!slot.marked,
          marking: slot.marking || 'functional:default-host',
          toggleTargetId: slot.toggleTargetId || findAdverbMarkedToggleTarget()?.id || '',
          toggleLabel: slot.toggleLabel || adverbMarkedToggleLabel(),
          axis: 'LEX',
          source: 'external'
        }));
      }
      // Fallback voor LEX-only view zonder centrale boom: toon het slot op de
      // LEX-as, maar zonder verticale hostuitlijning. In de assenweergave wordt
      // sourceMap gevuld en is de plaats wél exact gekoppeld aan de hostbox.
      const hostLabel = adverbHostLabelFromPlacement(placement, content);
      return Array.from({ length: count }, (_unused, index) => ({
        id: `lex-adverb-axis-slot-${index + 1}`,
        y: y0 + 40 + index * 64,
        label: `stap 1 · LEX-slot boven ${hostLabel}`,
        hostLabel,
        content,
        marked: adverbOptionIsMarked(activeAdverbOption()),
        marking: adverbOptionIsMarked(activeAdverbOption()) ? (activeAdverbData()?.marking || 'functional:marked-host') : (activeAdverbData()?.marking || 'functional:default-host'),
        toggleTargetId: findAdverbMarkedToggleTarget()?.id || '',
        toggleLabel: adverbMarkedToggleLabel(),
        axis: 'LEX',
        source: 'external'
      }));
    }
    return [];
  }

  function drawLexConfiguredFreeSlot(g, x, slot) {
    const content = slot.content || lexInsertionContentDef();
    const marked = slot.marked ? (isEnglish() ? ' · marked' : ' · gemarkeerd') : '';
    const toggleLabel = slot.toggleLabel || adverbMarkedToggleLabel();
    const hasToggle = !!slot.toggleTargetId;
    const sub = slot.hostLabel
      ? `extern · LEX-as · vóór Wissels · boven ${slot.hostLabel}${marked}`
      : (lexInsertionContentSub(content) || 'andere LEX-as / anafoor');
    const group = svgEl('g', {
      class: `lex-adverb-axis-slot-node${slot.marked ? ' marked' : ''}${hasToggle ? ' clickable' : ''}`,
      tabindex: hasToggle ? 0 : null,
      role: hasToggle ? 'button' : null,
      'aria-label': hasToggle ? toggleLabel : null
    });
    if (hasToggle) {
      group.addEventListener('click', event => {
        event.stopPropagation();
        toggleAdverbMarkedVariant();
      });
      group.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleAdverbMarkedVariant();
        }
      });
    }
    group.appendChild(svgEl('title', {}, hasToggle ? toggleLabel : sub));
    group.appendChild(svgEl('rect', { x: x - 122, y: slot.y - 30, width: 244, height: 60, rx: 17, class: 'lex-free-slot lex-config-free-slot lex-insertion-box lex-adverb-axis-slot' }));
    group.appendChild(svgEl('text', { x, y: slot.y - 38, class: 'slot-caption' }, slot.label));
    group.appendChild(svgEl('text', { x, y: slot.y - 4, class: 'lex-local-label' }, content.text || 'INSERTIEPUNT'));
    group.appendChild(svgEl('text', { x, y: slot.y + 15, class: 'lex-free-slot-sub' }, sub));
    if (hasToggle) {
      group.appendChild(svgEl('text', { x: x + 94, y: slot.y - 10, class: 'lex-adverb-toggle-marker' }, slot.marked ? '!' : '↯'));
      group.appendChild(svgEl('text', { x, y: slot.y + 31, class: 'lex-adverb-toggle-help' }, toggleLabel));
    }
    g.appendChild(group);
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
    if (activeAdverbIsFronted()) return null;
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
    if (activeAdverbIsFronted() && isMainV2Rule()) return true;
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

  function postV2SlotY(y0, movement, items = state.example?.lexItems || []) {
    const offset = Number(movement?.postV2Index || 0);
    return v2SlotY(y0, items) + (offset + 1) * 64;
  }

  function frontedPostV2Index(item, index, items = activeLexItems()) {
    const rest = (items || []).map((entry, i) => ({ entry, i }))
      .filter(row => row.entry?.source && !isFiniteVerbForV2(row.entry));
    const found = rest.findIndex(row => row.entry === item || row.i === index);
    return found >= 0 ? found : Math.max(0, index);
  }

  function lexMovementRank(movement) {
    if (!movement) return 99;
    if (movement.slot === 'topic') return 1;
    if (movement.slot === 'v2') return 2;
    if (movement.slot === 'post-v2') return 3 + Number(movement.postV2Index || 0) / 10;
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

  function movementForItem(item, index, items = activeLexItems()) {
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
    if (activeAdverbIsFronted() && isMainV2Rule()) {
      const postV2Index = frontedPostV2Index(item, index, items);
      return { kind: 'post-v2', slot: 'post-v2', postV2Index, caption: 'Wissel na V2', trace: `t[${item.role || item.source}]` };
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
    if (movement?.slot === 'post-v2') return postV2SlotY(y0, movement, items);
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
    if (movement?.slot === 'post-v2') return String(3 + Number(movement.postV2Index || 0));
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

  function projectedLexRootY(sourceMap = null) {
    if (!sourceMap) return null;
    const root = sourceMap.get(STRUCTURE_CONFIG.syntaxRoot || 's')
      || sourceMap.get(STRUCTURE_CONFIG.functionalRoot || 'ft-clause')
      || sourceMap.get('s')
      || sourceMap.get('ft-clause');
    return root && Number.isFinite(root.py) ? root.py : null;
  }

  function projectedLexSystemY0(y0, sourceMap = null) {
    // v4536: alleen slot 0 hoort boven S/CLAUSE. De lokale V2-slots
    // 1 en 2 horen onder S/CLAUSE. De bronprojecties blijven exact
    // horizontaal op hun bronknoophoogte.
    const rootY = projectedLexRootY(sourceMap);
    return rootY === null ? y0 : rootY - 64;
  }

  function projectedCompSlotY(y0, sourceMap = null) {
    const rootY = projectedLexRootY(sourceMap);
    return rootY === null ? compSlotY(y0) : rootY - 64;
  }

  function projectedTopicSlotY(y0, sourceMap = null, items = state.example?.lexItems || []) {
    const rootY = projectedLexRootY(sourceMap);
    return rootY === null ? topicSlotY(y0, items) : rootY + 64;
  }

  function projectedFrontedAdverbSlotY(y0, sourceMap = null, items = state.example?.lexItems || []) {
    const rootY = projectedLexRootY(sourceMap);
    // v4545: "boven S" is letterlijk een LEX-slot net boven de S-box.
    // Zonder centrale boom valt de lokale LEX-view terug op slot 1.
    return rootY === null ? topicSlotY(y0, items) : rootY - 64;
  }

  function projectedV2SlotY(y0, sourceMap = null, items = state.example?.lexItems || []) {
    const rootY = projectedLexRootY(sourceMap);
    if (rootY === null) return v2SlotY(y0, items);
    if (activeAdverbIsFronted() && isMainV2Rule()) return rootY + 64;
    return rootY + (showTopicSlot(items) ? 128 : 64);
  }

  function projectedPostV2SlotY(y0, sourceMap = null, movement = null, items = state.example?.lexItems || []) {
    const v2Y = projectedV2SlotY(y0, sourceMap, items);
    return v2Y + (Number(movement?.postV2Index || 0) + 1) * 64;
  }

  function projectedLexItemY(item, index, y0, sourceMap = null, items = state.example?.lexItems || [], options = {}) {
    if (!sourceMap || options.localOnly) return lexItemY(item, index, y0, sourceMap, items, options);
    if (!item?.source) return item.slot === 'comp' ? projectedCompSlotY(y0, sourceMap) : lexWordOrderY(index, y0);
    const movement = appliedMovementForItem(item, index, items, options);
    if (movement?.slot === 'topic') return projectedTopicSlotY(y0, sourceMap, items);
    if (movement?.slot === 'v2') return projectedV2SlotY(y0, sourceMap, items);
    if (movement?.slot === 'post-v2') return projectedPostV2SlotY(y0, sourceMap, movement, items);
    return baseLexY(item, index, y0, sourceMap, items);
  }

  function drawLexAxis(g, x, y0, items, sourceMap = null, options = {}) {
    const horizontalProjectionMode = !!sourceMap && !options.localOnly;
    const systemY0 = sourceMap ? projectedLexSystemY0(y0, sourceMap) : y0;
    drawAxisTitle(g, x - 98, systemY0 - 70, horizontalProjectionMode ? 'LEX-projectie · Wisselregels' : 'LEX-as · lokale plaatsingsregels');

    const itemYs = items.map((item, i) => projectedLexItemY(item, i, y0, sourceMap, items, options));
    const baseYs = items.map((item, i) => baseLexY(item, i, y0, sourceMap, items));
    const projectionYs = items.map((item, i) => projectionAnchorY(item, i, y0, sourceMap, items));
    const frontedAdverb = activeAdverbIsFronted() && isMainV2Rule();
    const topicIndex = isMainV2Rule() ? items.findIndex((item, i) => movementForItem(item, i)?.slot === 'topic') : -1;
    const v2Index = isMainV2Rule() ? items.findIndex((item, i) => movementForItem(item, i)?.slot === 'v2') : -1;
    const topicSlotY = (topicIndex >= 0 || frontedAdverb) ? projectedTopicSlotY(y0, sourceMap, items) : null;
    const v2SlotY = v2Index >= 0 ? projectedV2SlotY(y0, sourceMap, items) : null;
    const configuredSlots = lexConfiguredFreeSlots(systemY0, items, [...itemYs, ...baseYs, ...projectionYs, ...(topicSlotY === null ? [] : [topicSlotY]), ...(v2SlotY === null ? [] : [v2SlotY])], sourceMap);
    const axisYs = [...itemYs, ...baseYs, ...projectionYs, ...configuredSlots.map(slot => slot.y), ...(topicSlotY === null ? [] : [topicSlotY]), ...(v2SlotY === null ? [] : [v2SlotY]), systemY0 - 48, systemY0 + Math.max(4, items.length + 1) * 64 + 40];
    const axisMinY = Math.min(...axisYs) - 36;
    const axisMaxY = Math.max(...axisYs) + 44;
    g.appendChild(svgEl('line', { x1: x, y1: axisMinY, x2: x, y2: axisMaxY, class: 'lex-axis-line' }));

    const positions = new Map();
    // v4547: de afleidingsvolgorde op de LEX-as is expliciet:
    // 1) externe bijwoordinserties op hun hosthoogte;
    // 2) daarna pas LEX-Wissels/V2/topic. Daardoor kan een bijwoord
    //    visueel achterblijven boven de trace van een later verplaatst item.
    configuredSlots.forEach(slot => drawLexConfiguredFreeSlot(g, x, slot));
    if (topicSlotY !== null && isMainV2Rule() && !frontedAdverb) drawLexTopicSlot(g, x, topicSlotY);
    if (v2SlotY !== null) drawLexV2Slot(g, x, v2SlotY);

    const ruleText = isMainV2Rule()
      ? `Plaatsingsregel: eerst bijwoordinsertie op de LEX-as, daarna Wissels naar 0/1/2; configureerbare bijwoordslots / voorop-bijwoord (${lexFreeSlotCount()} · ${lexSlotPlacementLabel()}) staan op de LEX-as; de gekozen hostbox wordt lager gezet om ruimte te maken; bijwoord kan boven een latere trace achterblijven.`
      : `Plaatsingsregel: eerst bijwoordinsertie op de LEX-as, daarna eventuele plaatsingsregels; Comp gebruikt slot 0; configureerbare bijwoordslots / voorop-bijwoord (${lexFreeSlotCount()} · ${lexSlotPlacementLabel()}) staan op de LEX-as; de gekozen hostbox wordt lager gezet om ruimte te maken; bijwoord kan boven een latere trace achterblijven.`;
    drawCanvasGuideText(g, x + 150, axisMinY + 18, ruleText, 'wissel-label');

    // v4450: geen stippel- of verplaatsingslijnen vanuit de boom naar de LEX-as.
    // De boom levert alleen de basisstructuur; alle zichtbare Wissels en traces
    // worden lokaal op de LEX-as getekend.  Dit voorkomt dat projectielijnen
    // opnieuw als verplaatsingen vanuit de boom gelezen worden.

    items.forEach((item, i) => {
      const p = item.source && sourceMap ? sourceMap.get(item.source) : null;
      const y = projectedLexItemY(item, i, y0, sourceMap, items, options);
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
    // v4567: de projectie-as is een echte rechter-as. De regelboxen
    // staan rechts van de as, met een kleine vaste marge. Ze overschrijven
    // de SYNT/LOG-as dus niet meer, maar blijven wel direct aangesloten.
    const axisBoxGap = Number.isFinite(options.axisBoxGap) ? options.axisBoxGap : 22;
    const boxLeft = x + axisBoxGap;
    const boxCenter = boxLeft + width / 2;
    const topY = Math.max(28, (rows[0]?.y || 92) - 56);
    const axisTop = Math.max(24, Math.min(...rows.map(row => row.y)) - 46);
    const axisBottom = Math.max(...rows.map(row => row.y)) + 46;
    drawCanvasGuideText(g, boxLeft, topY, title, 'axis-title');
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
        x2: boxLeft,
        y2: row.y,
        class: `projection-line ${cls} orthogonal projected-rule-line`
      }));
      g.appendChild(svgEl('rect', { x: boxLeft, y: row.y - 26, width, height: 52, rx: 14, class: boxClass }));
      g.appendChild(svgEl('text', { x: boxCenter, y: row.y + 5, class: ruleClass }, row.text));
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

  function southModeWarningText() {
    const mode = state.southLogicalMode || 'SOV';
    if (!SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(mode)) return '';
    return ` ${movementRequiredShortComment(mode)}`;
  }

  function logicalOrderCode(items) {
    const code = (items || []).map(item => item.short).join('');
    return SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(code) ? `${code}-!` : code;
  }

  function layoutLogicalProjectionCenters(items, x1, x2, boxWidth = 148, gap = 18) {
    const half = boxWidth / 2;
    const step = items.length > 1 ? (x2 - x1) / (items.length - 1) : 0;
    const sources = items.map((item, index) => Number.isFinite(item.px) ? item.px : (x1 + step * index));
    if (items.length <= 1) return sources;
    const minSpacing = boxWidth + gap;
    const available = Math.max(boxWidth, x2 - x1);
    if (available < boxWidth + (items.length - 1) * minSpacing) {
      const start = x1 + half;
      const compactStep = items.length > 1 ? Math.max(boxWidth * 0.82, (available - boxWidth) / (items.length - 1)) : 0;
      return items.map((_item, index) => start + compactStep * index);
    }
    const centers = sources.slice();
    centers[0] = Math.max(x1 + half, Math.min(x2 - half, centers[0]));
    for (let i = 1; i < centers.length; i += 1) centers[i] = Math.max(centers[i], centers[i - 1] + minSpacing);
    centers[centers.length - 1] = Math.min(centers[centers.length - 1], x2 - half);
    for (let i = centers.length - 2; i >= 0; i -= 1) centers[i] = Math.min(centers[i], centers[i + 1] - minSpacing);
    centers[0] = Math.max(x1 + half, centers[0]);
    for (let i = 1; i < centers.length; i += 1) centers[i] = Math.max(centers[i], centers[i - 1] + minSpacing);
    return centers;
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
    const badgeY = options.badgeAlign === 'right-below'
      ? y + 76
      : y - badgeGap - badgeHeight;
    const badgeX = options.badgeAlign === 'center'
      ? ((x1 + x2) / 2) - badgeWidth / 2
      : (options.badgeAlign === 'right-below'
        ? x2 - badgeWidth
        : x1 - badgeWidth - 16);
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
      }, options.tipText || 'tip: wissel de LOG-volgorde'));
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
    const sourceCenters = items.map((item, index) => Number.isFinite(item.px) ? item.px : (x1 + step * index));
    const boxCenters = layoutLogicalProjectionCenters(items, x1, x2, 148, 18);
    items.forEach((item, index) => {
      const sourceX = sourceCenters[index];
      const cx = boxCenters[index];
      const boxLeft = cx - 74;
      const boxRight = cx + 74;
      const boxTop = y + 10;
      const joinX = Math.max(boxLeft + 18, Math.min(boxRight - 18, sourceX));
      if (Number.isFinite(item.sourceTopY)) {
        g.appendChild(svgEl('line', {
          x1: sourceX,
          y1: item.sourceTopY,
          x2: sourceX,
          y2: y - 10,
          class: `projection-line ${cls} logical-source-line`
        }));
      }
      g.appendChild(svgEl('line', {
        x1: sourceX,
        y1: y,
        x2: sourceX,
        y2: boxTop - 8,
        class: `projection-line ${cls} logical-projection-line`
      }));
      g.appendChild(svgEl('line', {
        x1: sourceX,
        y1: boxTop - 8,
        x2: joinX,
        y2: boxTop,
        class: `projection-line ${cls} logical-projection-line`
      }));
      g.appendChild(svgEl('rect', {
        x: boxLeft,
        y: boxTop,
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
    const axisBoxGap = 22;
    drawAxisTitle(g, x + axisBoxGap, y - 60, 'SYNTAX-projectie · regels');
    const rules = syntaxRules();
    rules.forEach((rule, i) => {
      const yy = y + i * 66;
      const width = Math.max(210, Math.min(340, rule.length * 8.2 + 34));
      const boxLeft = x + axisBoxGap;
      const boxCenter = boxLeft + width / 2;
      g.appendChild(svgEl('rect', { x: boxLeft, y: yy - 26, width, height: 52, rx: 14, class: 'syntax-rule-box projected-rule-box' }));
      g.appendChild(svgEl('text', { x: boxCenter, y: yy + 5, class: 'rule-label projected-rule-label' }, rule));
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
    const axisBoxGap = 22;
    drawAxisTitle(g, x + axisBoxGap, 40, 'LOG/FT-projectie · regels/rollen');
    functionalRules().forEach((rule, i) => {
      const yy = 86 + i * 66;
      const width = Math.max(250, Math.min(380, rule.length * 8.2 + 34));
      const boxLeft = x + axisBoxGap;
      const boxCenter = boxLeft + width / 2;
      g.appendChild(svgEl('rect', { x: boxLeft, y: yy - 26, width, height: 52, rx: 14, class: 'syntax-rule-box projected-rule-box projected-functional-rule-box' }));
      g.appendChild(svgEl('text', { x: boxCenter, y: yy + 5, class: 'rule-label projected-rule-label projected-functional-rule-label' }, rule));
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
    drawAxisTitle(g, origin.x - 176, origin.y - 48, `v4547 · ${branchModeLabel()} · vrije plaatsing + LEX-bijwoordslots`);
    const growthPlan = growthPlanForLayout(layout);
    layout.__growthPlan = growthPlan;
    drawSubtreeBoxes(g, layout, origin, growthPlan);
    drawTreeEdges(g, layout, origin, growthPlan);
    drawOpnTopicalizationSlot(g, layout, origin, growthPlan);
    drawTreeNodes(g, layout, origin, options.selectable === true, growthPlan);
    drawHostedAdverbSlots(g, layout, origin, growthPlan);
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
    // v4567: projectie-as sluit rechts aan op de boom: niet over de boom,
    // maar ook niet ver zwevend. De regelboxen staan rechts van deze as.
    const centralTreeRightPx = px((centralLayout?.box?.maxX || 0), origin);
    const eastAxisX = centralTreeRightPx + 118;

    const growthPlan = centralLayout?.__growthPlan;
    const showLexBaseStep = !growthPlan?.active || visibleAt(growthPlan, growthPlan.lexBaseStep);
    const showProjectionPanels = !growthPlan?.active || visibleAt(growthPlan, growthPlan.projectionStep);
    if (showProjectionPanels) {
      drawLexAxis(g, westAxisX, 126, activeLexItems(), sourceMap);
      if (state.centerMode === 'functional') drawFunctionalRules(g, eastAxisX, centralLayout, origin, growthPlan);
      else drawSyntaxRules(g, eastAxisX, 126, centralLayout, origin, growthPlan);
      drawLogicalProjection(g, southAxisX1, southAxisX2, southAxisY, getFunctionalLayout(), {
        cls: 'log',
        title: 'LOG-as · LOGICAL-projectie',
        subtitle: `Logische volgorde onder de boom; west-as blijft LEX. Gebruik de volgordeknop om alleen de LOG-volgorde onder de boom te wijzigen.${southModeWarningText()}`,
        badgeText: southLogicalModeLabel(state.southLogicalMode || 'SOV'),
        order: southLogicalOrder(),
        items: southItems,
        interactive: true,
        tipText: 'tip: SOV → SVO → OVS → OSV-! → VSO-! → VOS-!',
        badgeAlign: 'right-below'
      });
    } else if (showLexBaseStep) {
      const executedMovementCount = growthPlan?.active
        ? Math.max(0, Math.min(growthPlan.lexMovementCount, growthPlan.current - growthPlan.lexMovementStartStep + 1))
        : undefined;
      drawLexAxis(g, westAxisX, 126, activeLexItems(), sourceMap, { localOnly: true, executedMovementCount });
      drawAxisTitle(g, eastAxisX, 116, 'SYNTAX-projectie verschijnt in de laatste stap');
      drawLogicalProjection(g, southAxisX1, southAxisX2, southAxisY, getFunctionalLayout(), {
        cls: 'log',
        title: 'LOG-as · LOGICAL-projectie',
        subtitle: `LOG-projectie wordt mee zichtbaar in de eindfase. Gebruik de volgordeknop om alleen de LOG-volgorde onder de boom te wijzigen.${southModeWarningText()}`,
        badgeText: southLogicalModeLabel(state.southLogicalMode || 'SOV'),
        order: southLogicalOrder(),
        items: southItems,
        interactive: true,
        tipText: 'tip: SOV → SVO → OVS → OSV-! → VSO-! → VOS-!',
        badgeAlign: 'right-below'
      });
    } else {
      drawAxisTitle(g, westAxisX - 45, 116, `Groei-presentatie · ${growthLabel()}`);
      drawAxisTitle(g, eastAxisX, 116, 'SYNTAX-projectie verschijnt in de laatste stap');
    }
    els.svg.appendChild(g);
  }

  function drawSource() {
    const g = baseSvg('source-view');
    if (state.centerMode === 'functional') {
      drawFunctional(g, { x: 760, y: 92 });
      drawAxisTitle(g, 520, 70, `BRON · OPN-functioneel · vrije boomrijen + LEX-bijwoordslots + structure-config · ${state.functionalOrder}`);
    } else {
      drawAxisTitle(g, 490, 58, 'BRON · OPN-syntax-tree · vrije HOR/VER-boxplaatsing + vrije-slotruimte');
      drawSyntaxTree(g, { x: 780, y: 82 });
    }
    els.svg.appendChild(g);
  }

  function drawLex() {
    const g = baseSvg('lex-view');
    // v4545: ook in de losse LEX-view moet het bijwoordslot aan de echte
    // hostboxhoogte hangen. Daarvoor wordt de syntaxlayout hier alleen als
    // onzichtbare ankerkaart gebruikt; er wordt niets vanuit de boom geprojecteerd.
    const hiddenLayout = getSyntaxLayout();
    const sourceMap = layoutNodeMap(hiddenLayout, { x: 560, y: 86 });
    drawLexAxis(g, 560, 86, activeLexItems(), sourceMap);
    drawCanvasGuideText(g, 700, 70, state.example.lexRule === 'bijzin-omdat' ? 'Regel: bijzin met lokaal Comp-slot · geen V2' : 'Regel: hoofdzin met lokale V2-Wissel op de LEX-as', 'axis-title');
    els.svg.appendChild(g);
  }

  function drawSynt() {
    const g = baseSvg('synt-view');
    const origin = { x: 430, y: 92 };
    const layout = drawSyntaxTree(g, origin);
    const treeRightPx = px((layout?.box?.maxX || 0), origin);
    const syntAxisX = treeRightPx + 118;
    const functionalLayout = getFunctionalLayout();
    drawSyntaxRules(g, syntAxisX, 86, layout, origin, layout?.__growthPlan || null);
    drawLogicalProjection(g, 300, Math.max(1000, syntAxisX + 330), 642, functionalLayout, {
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
    const treeRightPx = px((layout?.box?.maxX || 0), origin);
    const logRulesX = treeRightPx + 118;
    drawFunctionalRules(g, logRulesX, layout, origin, layout?.__growthPlan || null);
    drawLogicalProjection(g, 310, Math.max(1010, logRulesX + 330), 666, layout, {
      cls: 'log',
      title: 'FT-projectie · logische volgorde',
      subtitle: 'Flip/layout in FT kan basisvolgorden tonen zoals SOV en SVO. OSV-!, VSO-! en VOS-! zijn geen basis-alternatieven: de box-aanpak kan deze volgordes niet opleveren; de LEX-as vraagt dan een verplaatsingsregel.'
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
    // v4567: stabiele groei-viewbox ruimer maken. De onderste LOG/FT-box
    // en de naar rechts verplaatste SYNT-as moeten ook tijdens groei in beeld blijven.
    if (state.projection === 'axes') return { x: -50, y: -150, w: 1780, h: 1120 };
    if (state.projection === 'source') return { x: 150, y: -145, w: 1320, h: 1010 };
    if (state.projection === 'log') return { x: 90, y: -145, w: 1500, h: 1010 };
    return null;
  }

  function parseViewBox() {
    const raw = (els.svg?.getAttribute('viewBox') || '').trim().split(/\s+/).map(Number);
    if (raw.length === 4 && raw.every(Number.isFinite) && raw[2] > 0 && raw[3] > 0) {
      return { x: raw[0], y: raw[1], w: raw[2], h: raw[3] };
    }
    return fallbackViewBox();
  }

  function isMainScreenActive() {
    return !!document.body?.classList.contains('main-screen-active');
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
    els.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    sizeDynamicGridToBox(next);
    syncMobileCanvasHeight(next);
    syncMainOverlayControlPlacement();
    requestAnimationFrame(syncMainOverlayControlPlacement);
    if (manual) state.manualViewBox = next;
  }

  function resetManualViewBox() {
    state.manualViewBox = null;
    state.viewDrag = null;
    state.viewClickSuppressed = false;
    els.svg?.classList.remove('is-panning');
    els.canvasWrap?.classList.remove('is-panning');
  }

  function syncExampleSelectSizing() {
    const labels = (EXAMPLES || []).map(ex => String(ex?.title || ex?.sentence || ex?.id || ''));
    const longest = labels.reduce((max, value) => Math.max(max, value.length), 12);
    const ch = Math.max(12, Math.min(44, longest + 2));
    document.documentElement.style.setProperty('--main-example-select-ch', `${ch}ch`);
  }

  function syncMainTopbarLayout() {
    const main = document.body?.classList.contains('main-screen-active');
    if (!main) return;
    const bar = document.querySelector('.main-topbar');
    const playBar = document.querySelector('.main-play-reset-bar');
    const root = document.documentElement;
    if (!bar || !root) return;
    const rect = bar.getBoundingClientRect();
    const topGap = 4;
    const gridGap = 5;
    const playTop = Math.max(0, Math.ceil(rect.bottom + topGap));
    let gridTop = Math.max(0, Math.ceil(rect.bottom + 6));
    if (playBar) {
      root.style.setProperty('--main-playbar-top', `${playTop}px`);
      const playHeight = Math.max(0, Math.ceil(playBar.getBoundingClientRect().height || playBar.offsetHeight || 0));
      gridTop = Math.max(gridTop, playTop + playHeight + gridGap);
    }
    root.style.setProperty('--main-grid-top', `${gridTop}px`);
    root.style.setProperty('--main-grid-height', `calc(100dvh - ${gridTop}px)`);
  }

  function canvasAspectRatio() {
    syncMainTopbarLayout();
    const rect = els.canvasWrap?.getBoundingClientRect?.();
    if (!rect || !Number.isFinite(rect.width) || !Number.isFinite(rect.height) || rect.width <= 0 || rect.height <= 0) return null;
    return rect.width / rect.height;
  }

  function svgMeetClientMetrics(viewBox = parseViewBox()) {
    const rect = els.canvasWrap?.getBoundingClientRect?.();
    if (!rect || !viewBox || !Number.isFinite(viewBox.w) || !Number.isFinite(viewBox.h) || viewBox.w <= 0 || viewBox.h <= 0 || rect.width <= 0 || rect.height <= 0) return null;
    const scale = Math.min(rect.width / viewBox.w, rect.height / viewBox.h);
    const drawnW = viewBox.w * scale;
    const drawnH = viewBox.h * scale;
    const offsetX = (rect.width - drawnW) / 2;
    const offsetY = (rect.height - drawnH) / 2;
    return {
      host: rect,
      scale,
      left: rect.left + offsetX,
      top: rect.top + offsetY,
      width: drawnW,
      height: drawnH,
      right: rect.left + offsetX + drawnW,
      bottom: rect.top + offsetY + drawnH
    };
  }

  function svgXToClient(xSvg, viewBox = parseViewBox()) {
    const metrics = svgMeetClientMetrics(viewBox);
    if (!metrics || !Number.isFinite(xSvg)) return null;
    return metrics.left + (xSvg - viewBox.x) * metrics.scale;
  }

  function svgYToClient(ySvg, viewBox = parseViewBox()) {
    const metrics = svgMeetClientMetrics(viewBox);
    if (!metrics || !Number.isFinite(ySvg)) return null;
    return metrics.top + (ySvg - viewBox.y) * metrics.scale;
  }

  function syntAxisAnchorBox() {
    if (!els.svg) return null;
    const candidates = [
      '.axes-synt-rules .projection-axis-line.synt',
      '.synt-rule-view .projection-axis-line.synt',
      '.projection-axis-line.synt',
      '.synt-rule-view',
      '.axes-synt-rules'
    ];
    for (const selector of candidates) {
      const node = els.svg.querySelector(selector);
      if (!node) continue;
      try {
        if (node.tagName && node.tagName.toLowerCase() === 'line') {
          const x1 = Number(node.getAttribute('x1'));
          const x2 = Number(node.getAttribute('x2'));
          const y1 = Number(node.getAttribute('y1'));
          const y2 = Number(node.getAttribute('y2'));
          if ([x1, x2, y1, y2].every(Number.isFinite)) {
            return { x: Math.max(x1, x2), y: Math.min(y1, y2), h: Math.abs(y2 - y1), source: selector };
          }
        }
        const b = node.getBBox?.();
        if (b && Number.isFinite(b.x) && Number.isFinite(b.y) && b.width >= 0 && b.height >= 0) {
          return { x: b.x + b.width, y: b.y, h: b.height, source: selector };
        }
      } catch (_err) {
        // Element may be temporarily unavailable during SVG replacement.
      }
    }
    return null;
  }

  function southLogicalBadgeAnchorBox() {
    if (!els.svg) return null;
    const candidates = [
      '.logical-flip-toggle .logical-order-badge-interactive',
      '.logical-order-badge-interactive',
      '.logical-flip-toggle'
    ];
    for (const selector of candidates) {
      const node = els.svg.querySelector(selector);
      if (!node) continue;
      try {
        const b = node.getBBox?.();
        if (b && Number.isFinite(b.x) && Number.isFinite(b.y) && b.width > 0 && b.height > 0) {
          return {
            x: b.x + b.width / 2,
            y: b.y + b.height / 2,
            w: b.width,
            h: b.height,
            source: selector
          };
        }
      } catch (_err) {
        // SVG bbox can be temporarily unavailable while rerendering.
      }
    }
    return null;
  }

  function syncMainOverlayControlPlacement() {
    const controls = document.querySelector('.main-grid-controls');
    const southControl = document.querySelector('.main-south-control');
    const workspace = workspaceForStage();
    const host = els.canvasWrap || workspace;
    if (!workspace || !host || !isMainScreenActive()) return;
    const root = document.documentElement;
    const viewBox = parseViewBox();
    const hostRect = host.getBoundingClientRect();
    const svgRect = svgMeetClientMetrics(viewBox) || { left: hostRect.left, top: hostRect.top, right: hostRect.right, bottom: hostRect.bottom, width: hostRect.width, height: hostRect.height };
    const svgLocalLeft = Math.max(0, svgRect.left - hostRect.left);
    const svgLocalTop = Math.max(0, svgRect.top - hostRect.top);
    const svgLocalRight = Math.min(hostRect.width, svgRect.right - hostRect.left);
    const svgLocalBottom = Math.min(hostRect.height, svgRect.bottom - hostRect.top);

    // v4536: HTML controls are children of the canvas/boomvenster, but the SVG
    // itself uses preserveAspectRatio=meet.  Therefore placement is clamped to
    // the actually drawn grid rectangle, not to the full letterboxed canvas.
    // All overlay coordinates are therefore clamped to the canvas rect, not to
    // the outer workspace. This keeps the right control strip inside the grid
    // window, next to the SYNTAX axis like the LEX strip is inside on the left.
    if (southControl && !southControl.classList.contains('is-hidden')) {
      const southAnchor = southLogicalBadgeAnchorBox();
      const sxClient = southAnchor ? svgXToClient(southAnchor.x, viewBox) : null;
      const syClient = southAnchor ? svgYToClient(southAnchor.y, viewBox) : null;
      const southRect = southControl.getBoundingClientRect();
      if (Number.isFinite(sxClient) && Number.isFinite(syClient)) {
        const halfW = Math.max(48, (southRect.width || 160) / 2);
        const halfH = Math.max(22, (southRect.height || 48) / 2);
        const minLeft = svgLocalLeft + halfW + 6;
        const maxLeft = Math.max(minLeft, svgLocalRight - halfW - 6);
        const minTop = svgLocalTop + halfH + 6;
        const maxTop = Math.max(minTop, svgLocalBottom - halfH - 6);
        const left = Math.round(Math.max(minLeft, Math.min(maxLeft, sxClient - hostRect.left)));
        const top = Math.round(Math.max(minTop, Math.min(maxTop, syClient - hostRect.top)));
        root.style.setProperty('--main-south-left', `${left}px`);
        root.style.setProperty('--main-south-top', `${top}px`);
      } else {
        root.style.removeProperty('--main-south-left');
        root.style.removeProperty('--main-south-top');
      }
    } else {
      root.style.removeProperty('--main-south-left');
      root.style.removeProperty('--main-south-top');
    }

    if (!controls) return;
    const portrait = isPortraitGridFirstViewport();
    if (portrait) {
      root.style.removeProperty('--main-controls-left');
      root.style.removeProperty('--main-controls-top');
      controls.style.removeProperty('--main-controls-left');
      controls.style.removeProperty('--main-controls-top');
      return;
    }
    const anchor = syntAxisAnchorBox();
    const controlsRect = controls.getBoundingClientRect();
    const xClient = anchor ? svgXToClient(anchor.x, viewBox) : null;
    const yClient = anchor ? svgYToClient(anchor.y, viewBox) : null;
    // v4567: harde no-overlap-regel. De HTML-projectiebox begint pas rechts
    // van de werkelijke SVG SYNT/LOG-as. De marge is bewust groter dan de rand,
    // schaduw en touch-hitbox van de HTML-box, zodat de as zichtbaar vrij blijft.
    const axisBoxGapPx = 96;
    const inset = 10;
    const controlW = Math.max(100, controlsRect.width || 104);
    const controlH = Math.max(180, controlsRect.height || 220);
    const windowMinLeft = Math.max(inset, 0 + inset);
    const windowMaxLeft = Math.max(windowMinLeft, hostRect.width - controlW - inset);
    const axisSafeLeft = Number.isFinite(xClient) ? (xClient - hostRect.left + axisBoxGapPx) : windowMaxLeft;
    const left = Math.round(Number.isFinite(xClient)
      ? Math.max(windowMinLeft, axisSafeLeft)
      : Math.max(windowMinLeft, Math.min(windowMaxLeft, axisSafeLeft)));
    const minTop = Math.max(8, svgLocalTop + 8);
    const maxTop = Math.max(minTop, svgLocalBottom - controlH - 10);
    const rawTop = Number.isFinite(yClient) ? (yClient - hostRect.top + 8) : minTop;
    const top = Math.round(Math.max(minTop, Math.min(maxTop, rawTop)));
    root.style.setProperty('--main-controls-left', `${left}px`);
    root.style.setProperty('--main-controls-top', `${top}px`);
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

  function expandFitBoxForMainWindow(fit) {
    if (!fit || !isMainScreenActive()) return fit;
    const mode = validViewFitMode();
    if (mode !== 'window' && mode !== 'auto') return fit;
    const controls = document.querySelector('.main-grid-controls');
    const south = document.querySelector('.main-south-control:not(.is-hidden)');
    const svgRect = els.svg?.getBoundingClientRect?.();
    const current = parseViewBox();
    const unitX = svgRect?.width > 0 && current?.w > 0 ? current.w / svgRect.width : fit.w / Math.max(320, window.innerWidth || 1024);
    const unitY = svgRect?.height > 0 && current?.h > 0 ? current.h / svgRect.height : fit.h / Math.max(240, window.innerHeight || 720);
    const controlsRect = controls?.getBoundingClientRect?.();
    const southRect = south?.getBoundingClientRect?.();
    const portrait = isPortraitGridFirstViewport();
    const extra = { right: 0, bottom: 0, left: 0, top: 0 };

    if (mode === 'window') {
      // v4567: Hoofdvenster = volledige boom zichtbaar. Deze rand hoort bij
      // de standaardfit en geldt voor desktop én mobiel. Hij voorkomt dat de
      // onderste LOG/FT-box of de verplaatste SYNT-as net buiten de viewBox valt.
      // v4567: minder lege gridruimte links van LEX en rechts van
      // projectie/SOV-box. De bbox zelf blijft volledig binnen beeld; alleen de
      // extra bedieningsmarge is teruggebracht.
      extra.left = Math.max(fit.w * 0.018, 18 * unitX);
      extra.top = Math.max(fit.h * 0.034, 30 * unitY);
      if (portrait) {
        const bottomPx = Math.max(148, (controlsRect?.height || 92) + (southRect?.height || 0) + 42);
        extra.right = Math.max(fit.w * 0.045, 34 * unitX);
        extra.bottom = Math.max(fit.h * 0.20, bottomPx * unitY);
      } else {
        // v4567: extra rechterruimte reserveren zodat de projectieknoppenbox
        // rechts van de SYNT-as kan blijven zonder over de as terug te schuiven.
        const rightPx = Math.max(380, (controlsRect?.width || 112) + 300);
        const bottomPx = Math.max(116, (southRect?.height || 0) + 64);
        extra.right = Math.max(fit.w * 0.18, rightPx * unitX);
        extra.bottom = Math.max(fit.h * 0.14, bottomPx * unitY);
      }
    } else {
      // Strakke fit: wel compleet, maar minder rand. Deze optie is niet default.
      extra.left = Math.max(fit.w * 0.010, 10 * unitX);
      extra.top = Math.max(fit.h * 0.016, 16 * unitY);
      // Ook in 'volledige boom strak' voldoende ruimte rechts van de SYNT-as.
      extra.right = Math.max(fit.w * 0.18, 250 * unitX);
      extra.bottom = Math.max(fit.h * 0.055, 46 * unitY);
    }

    const expanded = {
      x: fit.x - extra.left,
      y: fit.y - extra.top,
      w: fit.w + extra.left + extra.right,
      h: fit.h + extra.top + extra.bottom
    };
    // Match de viewBox aan het actuele venster. Daardoor blijft de hele boom
    // zichtbaar zonder clipping, ook als de toolbarhoogte of device-orientatie wijzigt.
    return expandBoxToAspect(expanded, canvasAspectRatio());
  }

  function computeAutoFitBox() {
    if (!els.svg) return fallbackViewBox();
    const ignored = [...els.svg.querySelectorAll('.grid, .view-pan-hint')];
    const oldDisplays = ignored.map(node => node.style.display);
    try {
      // FIT volgt uitsluitend boom + projectie-assen. Raster en hulplabels
      // mogen de fit-box niet breder of hoger maken.
      ignored.forEach(node => { node.style.display = 'none'; });
      const bbox = els.svg.getBBox();
      if (!bbox || !Number.isFinite(bbox.width) || !Number.isFinite(bbox.height) || bbox.width <= 0 || bbox.height <= 0) {
        return fallbackViewBox();
      }
      const main = isMainScreenActive();
      const base = Math.max(bbox.width, bbox.height);
      // v4567: hoofdvenster kreeg te weinig fit-marge; bij meet-scaling kon de
      // onderste box net buiten beeld vallen. Gebruik ook in Main een echte
      // randmarge rondom de volledige SVG-bounding-box.
      const margin = main
        ? Math.max(48, Math.min(96, base * 0.045))
        : (isMobileViewport()
          ? Math.max(18, Math.min(38, base * 0.024))
          : Math.max(24, Math.min(56, base * 0.028)));
      const fit = {
        x: bbox.x - margin,
        y: bbox.y - margin,
        w: bbox.width + margin * 2,
        h: bbox.height + margin * 2
      };
      // v4567: raster volgt de inhoud strakker dan de aspect-viewBox.
      // Daardoor verdwijnt overbodig raster links van LEX en rechts van de
      // projectie/SOV-bediening, terwijl de viewBox nog genoeg ruimte houdt.
      const gridMargin = main
        ? Math.max(18, Math.min(42, base * 0.018))
        : margin;
      state.lastGridBox = {
        x: bbox.x - gridMargin,
        y: bbox.y - gridMargin,
        w: bbox.width + gridMargin * 2,
        h: bbox.height + gridMargin * 2
      };
      // Hoofdvenster gebruikt standaard 'volledige boom zichtbaar'.
      // Niet-Main schermen blijven de gewone aspect-fit gebruiken.
      return main ? expandFitBoxForMainWindow(fit) : expandBoxToAspect(fit, canvasAspectRatio());
    } catch (_err) {
      return fallbackViewBox();
    } finally {
      ignored.forEach((node, index) => { node.style.display = oldDisplays[index] || ''; });
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
    const viewMode = validViewFitMode();
    if (!force && viewMode === 'fixed') {
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
    state.lastGridBox = null;
    setSvgPresentationVars();
    setViewBox(fallbackViewBox(), false);
    els.svg.classList.toggle('no-grid', !state.showGrid);
    const g = svgEl('g', { class: className });
    if (state.showGrid) drawGrid(g, 1800, 1000);
    drawCanvasGuideText(g, 22, 28, 'grid past strak rond boom + assen · geen leeg raster rondom · Config opent instellingen', 'view-pan-hint');
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
    applyLanguage();
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

  function isEnglish() {
    return state.language === 'en';
  }

  function renderStatus() {
    const syntaxModeLabel = isEnglish() ? 'OPN syntax tree' : 'OPN-syntaxboom';
    const functionalModeLabel = isEnglish() ? 'OPN functional structure' : 'OPN-functioneel';
    els.titleLine.textContent = `${activeSentenceText()} · ${state.projectionLabel || projectionLabel()} · ${state.centerMode === 'syntax' ? syntaxModeLabel : functionalModeLabel}`;
    const noticeText = state.example.notice ? ` · NOTICE=${state.example.notice}` : '';
    const adverbText = activeAdverbStatusLabel();
    els.metaLine.textContent = isEnglish()
      ? `${state.example.phase} · ${movementSummaryLabel()} · ${adverbText} · LEX=${activeSentenceText()} · HTML input=examples-input.html · adverbs=examples-adverbs.html · lexicon=lexicon-config.html${noticeText}`
      : `${state.example.phase} · ${movementSummaryLabel()} · ${adverbText} · LEX=${activeSentenceText()} · HTML-input=examples-input.html · bijwoorden=examples-adverbs.html · lexicon=lexicon-config.html${noticeText}`;
    if (els.sentencePreview) els.sentencePreview.innerHTML = activeSentenceHtml();
    const baseFeedback = isEnglish()
      ? (state.projection === 'source'
        ? 'Source shows the selected OPN source from structure-config.html. Syntax and functional views use bottom-up recursive box layout; left/right controls both layouts; branch order can be global, compact-auto or align-auto.'
        : 'Phase view: first the structure config, then sample sentences projected to those sources, then the local LEX placement rule.')
      : (state.projection === 'source'
        ? 'Bron toont de gekozen OPN-bron uit structure-config.html. Syntax en functioneel gebruiken bottom-up recursieve box-layout; left/right stuurt beide layouts; takvolgorde kan globaal, compact-auto of align-auto zijn.'
        : 'Faseversie: eerst structure-config, dan voorbeeldzinnen die naar die sources projecteren, dan lokale LEX-regel.');
    const validationMsg = state.exampleValidationMessages?.length ? ` · ${state.exampleValidationMessages[0]}` : '';
    const noticeMsg = state.example.notice ? ` · ${state.example.notice}` : '';
    const osvMsg = SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(state.southLogicalMode || 'SOV')
      ? ` · ${movementRequiredModeComment(state.southLogicalMode || 'SOV')}`
      : '';
    els.actionFeedback.textContent = state.growthEnabled ? `${baseFeedback} · ${growthLabel()}${noticeMsg}${validationMsg}${osvMsg}` : `${baseFeedback}${noticeMsg}${validationMsg}${osvMsg}`;
    els.projectionHelp.textContent = helpText();
    els.explainHeading.textContent = `${isEnglish() ? 'Explanation' : 'Uitleg'} · ${activeSentenceText()}`;
    els.explainText.textContent = isEnglish()
      ? (state.example.id === 'hond-bijt-man'
        ? 'LEX rule: first draw the horizontal base projection, then local exchanges to free slots. Main clause: first phrase to slot 1, finite verb to slot 2; traces remain at the old base position. FIT frames the view, not the tree. Central slot boxes have been removed; the first branch reserves empty free-slot space; exchanges are visible only on the LEX axis. The order button cycles the LOG order: SOV, SVO, OVS, OSV-!, VSO-!, VOS-!. SOV/SVO/OVS are layout variants. OSV-!, VSO-! and VOS-! are marked because box layout cannot produce these orders; a movement rule is required to render the LEX axis correctly.'
        : 'LEX rule: move only to free slots 0/1/2. Non-moved words remain at their horizontal base position. Traces stay locally at the old position. In LOG/FT, the south projection can show SOV, SVO, OVS, OSV-!, VSO-! or VOS-!. OSV-!, VSO-! and VOS-! are marked: box layout cannot produce these orders; the LEX axis needs a movement rule.')
      : (state.example.id === 'hond-bijt-man'
        ? 'LEX-regel: eerst horizontale basisprojectie, daarna lokale Wissels naar vrije slots. Hoofdzin: eerste zinsdeel → slot 1, persoonsvorm → slot 2; traces blijven op de oude basisplek. FIT kadert alleen het zicht, niet de boom. Centrale slotboxen zijn verwijderd; de eerste tak reserveert lege vrije-slotruimte; wissels zie je alleen op de LEX-as. De volgordeknop doorloopt de LOG-volgorde: SOV, SVO, OVS, OSV-!, VSO-!, VOS-!. SOV/SVO/OVS zijn layoutvarianten. OSV-!, VSO-! en VOS-! zijn gemarkeerd: de box-aanpak kan deze volgordes niet opleveren; voor correcte LEX-rendering is een verplaatsingsregel nodig. Menu’s boven het grid zijn expliciet gekozen: maximaal vier, bijvoorbeeld Voorbeeldzin en Play/Groei.'
        : 'LEX-regel: verplaats alleen naar vrije slots 0/1/2. Niet-verplaatste woorden blijven op hun horizontale basisplek. Traces staan lokaal op de oude plek. In LOG/FT kan de onderprojectie SOV, SVO, OVS, OSV-!, VSO-! of VOS-! tonen. OSV-!, VSO-! en VOS-! zijn gemarkeerd: de box-aanpak kan deze volgordes niet opleveren; de LEX-as vraagt een verplaatsingsregel.');
  }

  function projectionLabel() {
    const labels = isEnglish()
      ? { axes: 'All axes', source: 'Source', lex: 'LEX', synt: 'SYNTAX projection', log: 'LOG/FT' }
      : { axes: 'OPN/assen', source: 'Bron', lex: 'LEX', synt: 'SYNTAX-projectie', log: 'LOG/FT' };
    return labels[state.projection] || state.projection;
  }

  function helpText() {
    if (isEnglish()) {
      if (state.projection === 'source') return 'Source: OPN syntax and OPN functional structures are read from structure-config.html. Both use the same left/right layout strategy and reserve configurable empty free-slot space under the root.';
      if (state.projection === 'lex') return 'LEX: placement rules per sentence type. Main clause: first phrase to slot 1, finite verb to slot 2. The central tree keeps empty space; the filled positions are shown on the LEX axis.';
      if (state.projection === 'synt') return 'SYNTAX projection: rules are placed at tree-node height; the LOGICAL projection from FT/LOG is also shown below the tree.';
      if (state.projection === 'log') return 'LOG/FT: functional view = CLAUSE with separate PRED node and ARG-STRUCT subtree; the lower FT projection shows logical order, for example SOV/SVO/OVS/OSV-!/VSO-!/VOS-!.';
      return 'All: central OPN tree; west axis = LEX next to the tree; south axis = LOGICAL projection. The grid window is fitted to tree + axes; canvas panning is off.';
    }
    if (state.projection === 'source') return 'Bron: OPN-syntax en OPN-functioneel worden gelezen uit structure-config.html. Beide gebruiken dezelfde left/right layoutstrategie en reserveren configureerbare lege vrije-slotruimte onder de wortel.';
    if (state.projection === 'lex') return 'LEX: plaatsingsregels per zinstype. Hoofdzin: eerste zinsdeel naar slot 1, persoonsvorm naar slot 2. Bijwoorden worden als externe LEX-slots op de LEX-as geplaatst, op de hoogte net boven een gekozen syntaxbox.';
    if (state.projection === 'synt') return 'SYNTAX-projectie: regels staan op boomhoogte; onder de boom staat nu ook de LOGICAL-projectie uit FT/LOG.';
    if (state.projection === 'log') return 'LOG/FT: functioneel = CLAUSE met aparte PRED-knoop en ARG-STRUCT-subtree; onderaan toont de FT-projectie de logische volgorde (bijv. SOV/SVO/OVS/OSV-!/VSO-!/VOS-!).';
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

  const SELECT_OPTION_LABELS_EN = {
    centralModeSelect: { syntax: 'OPN syntax tree', functional: 'OPN functional structure' },
    treeChoiceSelect: { 'auto-min': 'tree choice: auto per sample type', 'structure-config': 'tree choice: structure-config base tree' },
    functionalOrderSelect: { 'left-first': 'layout: left-first', 'right-first': 'layout: right-first' },
    branchOrderSelect: { normal: 'default: grammatical order', 'auto-compact': 'goal: compact - auto per branch', 'auto-align': 'goal: align subject/agent + object/patient', 'flip-all': 'global: flip all branches' },
    branchTopSelect: { auto: 'auto', normal: 'normal', flip: 'flip' },
    branchMiddleSelect: { auto: 'auto', normal: 'normal', flip: 'flip' },
    branchOtherSelect: { auto: 'auto', normal: 'normal', flip: 'flip' },
    layoutDensitySelect: { auto: 'tree spacing: auto-fit wide/lower', compact: 'tree spacing: compact/classic', flat: 'tree spacing: flatter / less high', wide: 'tree spacing: wide/lower', large: 'tree spacing: wide + larger font' },
    mainLayoutDensitySelectTop: { auto: 'tree spacing: auto-fit wide/lower', compact: 'tree spacing: compact/classic', flat: 'tree spacing: flatter / less high', wide: 'tree spacing: wide/lower', large: 'tree spacing: wide + larger font' },
    viewFitSelect: { window: 'full tree visible - default', auto: 'full tree tight', scroll: 'scroll allowed - large canvas', fixed: 'fixed 1500x900 - debug' },
    mainViewFitSelectTop: { window: 'full tree visible', auto: 'tight full tree', scroll: 'scroll allowed', fixed: 'fixed/debug' },
    rightMenuWidthSelect: { auto: 'right column: auto/rest', wide: 'right column: wide', 'very-wide': 'right column: very wide', max: 'right column: maximum' },
    rightMenuWidthSelectTop: { auto: 'right column: auto/rest', wide: 'right column: wide', 'very-wide': 'right column: very wide', max: 'right column: maximum' },
    mobileRightMenuWidthSelect: { auto: 'right column: auto/rest', wide: 'right column: wide', 'very-wide': 'right column: very wide', max: 'right column: maximum' },
    freeSlotCountSelect: { 0: 'tree rows: 0', 1: 'tree rows: 1', 2: 'tree rows: 2', 3: 'tree rows: 3', 4: 'tree rows: 4', 5: 'tree rows: 5', 6: 'tree rows: 6' },
    lexFreeSlotCountSelect: { 0: 'LEX slots: 0', 1: 'LEX slots: 1', 2: 'LEX slots: 2', 3: 'LEX slots: 3', 4: 'LEX slots: 4', 5: 'LEX slots: 5', 6: 'LEX slots: 6', 7: 'LEX slots: 7', 8: 'LEX slots: 8' },
    mobileLexFreeSlotCountSelect: { 0: 'LEX slots: 0', 1: 'LEX slots: 1', 2: 'LEX slots: 2', 3: 'LEX slots: 3', 4: 'LEX slots: 4', 5: 'LEX slots: 5', 6: 'LEX slots: 6', 7: 'LEX slots: 7', 8: 'LEX slots: 8' },
    lexFreeSlotPlacementSelect: { 'above-selected-box': 'above selected box', 'above-s': 'above S', 'above-np': 'above NP', 'above-vp': 'above VP', 'above-v': 'above V', 'above-pp': 'above PP', 'above-ap': 'above AP' },
    mobileLexFreeSlotPlacementSelect: { 'above-selected-box': 'above selected box', 'above-s': 'above S', 'above-np': 'above NP', 'above-vp': 'above VP', 'above-v': 'above V', 'above-pp': 'above PP', 'above-ap': 'above AP' },
    lexInsertionContentSelect: { empty: 'empty slot', gisteren: 'GISTEREN', morgen: 'MORGEN', daar: 'DAAR', daarom: 'DAAROM', anders: 'ANDERS', vaak: 'VAAK', soms: 'SOMS', altijd: 'ALTIJD', niet: 'NIET', snel: 'SNEL', hard: 'HARD', zachtjes: 'ZACHTJES', misschien: 'MISSCHIEN', waarschijnlijk: 'WAARSCHIJNLIJK', helaas: 'HELAAS', alleen: 'ALLEEN', ook: 'OOK', zelfs: 'ZELFS', heel: 'HEEL', erg: 'ERG', zeer: 'ZEER', anafoor: 'anaphor', 'other-lex-axis': 'other LEX axis' },
    mobileLexInsertionContentSelect: { empty: 'empty slot', gisteren: 'GISTEREN', morgen: 'MORGEN', daar: 'DAAR', daarom: 'DAAROM', anders: 'ANDERS', vaak: 'VAAK', soms: 'SOMS', altijd: 'ALTIJD', niet: 'NIET', snel: 'SNEL', hard: 'HARD', zachtjes: 'ZACHTJES', misschien: 'MISSCHIEN', waarschijnlijk: 'WAARSCHIJNLIJK', helaas: 'HELAAS', alleen: 'ALLEEN', ook: 'OOK', zelfs: 'ZELFS', heel: 'HEEL', erg: 'ERG', zeer: 'ZEER', anafoor: 'anaphor', 'other-lex-axis': 'other LEX axis' },
    portraitMenuSlotsSelect: { 0: 'bottom space: 0 menus', 1: 'bottom space: 1 menu', 2: 'bottom space: 2 menus' },
    mobilePortraitMenuSlotsSelect: { 0: 'bottom space: 0 menus', 1: 'bottom space: 1 menu', 2: 'bottom space: 2 menus' },
    lexRuleSelect: { hoofdzininvariant: 'main clause V2: subject/topic - finite verb/predicate - object - exchange', 'bijzin-omdat': 'subordinate clause: Comp/(om)dat + subject + object + predicate - no V2', 'perfectum-heeft-vdw': 'perfect V2: subject/topic - finite verb - object - participle - exchange' }
  };

  const TOP_MENU_LABELS_EN = {
    projection: ['Projection choice', 'Projection choice: All, Source, LEX, SYNTAX projection and LOG/FT. Useful for comparing projections.'],
    sentence: ['Sample sentence', 'Sample sentence: quickly choose HOND BIJT MAN and variants. Useful for contrasts between sentences.'],
    play: ['Play/Grow', 'Play/Grow: show tree, LEX axis and projections step by step. Useful for explanation.'],
    tools: ['Work buttons', 'Work buttons: FIT, reset, JSON, Docs and editors. Useful for building and testing.'],
    fit: ['Main window', 'Main window: default is full tree visible; tight/scroll/fixed are secondary options.']
  };

  const LEX_EXTENSION_LABELS_EN = {
    'vp-boundary': ['VP boundary V <-> object', 'Insertion between verb and object lengthens the VP zone/boundary without adding the insertion as a tree node.'],
    's-boundary': ['S boundary subject <-> VP', 'Lengthens the boundary between subject and VP. Useful when the insertion lies between phrase zones.'],
    'object-branch': ['branch to object / NP obj / patient', 'Lengthens the object branch; useful when insertion is directly before the object.'],
    'verb-branch': ['branch to verb / V / pred', 'Lengthens the verb/predicate branch; useful when insertion attaches close to the verb cluster.'],
    'subject-branch': ['branch to subject / NP subj / agent', 'Lengthens the subject branch; less common, but available for testing.'],
    'arg-boundary': ['ARG-STRUCT boundary agent <-> patient', 'Functional variant: lengthens the argument structure between agent and patient.'],
    'clause-boundary': ['CLAUSE boundary pred <-> ARG-STRUCT', 'Functional variant: lengthens the boundary between predicate and argument structure.']
  };

  function localizedOptionLabel(select, opt) {
    if (!select || !isEnglish()) return opt.label || opt.title || opt.id;
    return SELECT_OPTION_LABELS_EN[select.id]?.[String(opt.id)] || opt.labelEn || opt.titleEn || opt.label || opt.title || opt.id;
  }

  function fillSelect(select, options, selected) {
    if (!select) return;
    select.replaceChildren();
    for (const opt of options) {
      const el = document.createElement('option');
      el.value = opt.id;
      const fullLabel = localizedOptionLabel(select, opt);
      el.textContent = fullLabel;
      el.title = fullLabel;
      el.dataset.fullLabel = fullLabel;
      if (opt.id === selected) el.selected = true;
      select.title = selected === opt.id ? fullLabel : (select.title || '');
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
      setInputLabelText(input, lexInsertionTargetLabel(id));
      const wrapper = input.closest('label');
      if (wrapper) wrapper.title = input.title;
    });
    const text = selected.size
      ? (isEnglish()
        ? `Branch extension: ${[...selected].map(lexInsertionTargetLabel).join(' + ')}. Adverb placement uses LEX slots with host height; branch extension is not needed here.`
        : `Takverlenging: ${[...selected].map(lexInsertionTargetLabel).join(' + ')}. Bijwoordplaatsing gebruikt LEX-slots met hosthoogte; takverlenging is hier niet nodig.`)
      : (isEnglish() ? 'No branch extension: the adverb slot is placed first on the LEX axis above its host; later exchanges can leave a trace below it.' : 'Geen takverlenging: bijwoordslot staat eerst op de LEX-as boven de host; latere Wissels kunnen er een trace onder achterlaten.');
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
    fillSelect(els.mainAdverbSelect, ADVERB_OPTIONS, state.selectedAdverbId);
    fillSelect(els.mobileAdverbSelect, ADVERB_OPTIONS, state.selectedAdverbId);
    syncExampleSelectSizing();
    fillSelect(els.centralModeSelect, CENTER_MODES, state.centerMode);
    fillSelect(els.treeChoiceSelect, TREE_CHOICES, activeTreeChoice());
    fillSelect(els.functionalOrderSelect, FUNCTIONAL_ORDERS, state.functionalOrder);
    fillSelect(els.branchOrderSelect, BRANCH_ORDERS, state.branchOrder);
    fillSelect(els.branchTopSelect, BRANCH_CHOICES, state.branchOverrides.top);
    fillSelect(els.branchMiddleSelect, BRANCH_CHOICES, state.branchOverrides.middle);
    fillSelect(els.branchOtherSelect, BRANCH_CHOICES, state.branchOverrides.other);
    state.viewFitMode = validViewFitMode();
    fillSelect(els.layoutDensitySelect, LAYOUT_DENSITIES, state.layoutDensity);
    fillSelect(els.mainLayoutDensitySelectTop, LAYOUT_DENSITIES, state.layoutDensity);
    fillSelect(els.viewFitSelect, VIEW_FIT_MODES, state.viewFitMode);
    fillSelect(els.mainViewFitSelectTop, VIEW_FIT_MODES, state.viewFitMode);
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
    [els.lexInsertionContentSelect, els.mobileLexInsertionContentSelect].forEach(select => { if (select) select.title = lexInsertionContentTip(); });
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
    if (els.mainGrowthPlayButton) {
      els.mainGrowthPlayButton.disabled = !growthSupported;
      els.mainGrowthPlayButton.textContent = growthPlayText;
    }
    if (els.mainGrowthPrevButton) els.mainGrowthPrevButton.disabled = growthPrevDisabled;
    if (els.mainGrowthNextButton) els.mainGrowthNextButton.disabled = growthNextDisabled;
    if (els.mainResetButton) els.mainResetButton.textContent = 'Reset';
    if (els.mainGrowthStepLabel) els.mainGrowthStepLabel.textContent = growthLabel();
    if (els.mainSouthModeButton) {
      els.mainSouthModeButton.textContent = southLogicalModeLabel(state.southLogicalMode || 'SOV');
      els.mainSouthModeButton.title = SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(state.southLogicalMode || 'SOV')
        ? movementRequiredModeComment(state.southLogicalMode || 'SOV')
        : (isEnglish() ? `Next LOG order: ${southLogicalModeListLabel()}` : `Volgende LOG-volgorde: ${southLogicalModeListLabel()}`);
    }
    if (els.mainSouthPrevButton) els.mainSouthPrevButton.title = isEnglish() ? 'Previous LOG order' : 'Vorige LOG-volgorde';
    if (els.mainSouthNextButton) els.mainSouthNextButton.title = isEnglish() ? 'Next LOG order' : 'Volgende LOG-volgorde';
    const mainSouthControl = document.querySelector('.main-south-control');
    const mainSouthVisible = state.projection === 'axes';
    if (mainSouthControl) {
      mainSouthControl.classList.toggle('is-hidden', !mainSouthVisible);
      mainSouthControl.setAttribute('aria-hidden', String(!mainSouthVisible));
    }
    document.querySelectorAll('[data-main-projection]').forEach(button => {
      const active = button.dataset.mainProjection === state.projection;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
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
      `lex_free_slots: configureerbare bijwoordboxen boven syntactische categorieboxen; geldige hosts=S, NP, VP, V, PP, AP`,
      `adverb: ${activeAdverbData()?.word || 'geen'}`,
      `adverb_category: ${activeAdverbData()?.category || 'geen'}`,
      `adverb_host_default: ${activeAdverbData()?.defaultHost || 'geen'}`,
      `adverb_host_actual: ${activeAdverbData()?.host || 'geen'}`,
      `adverb_marking: ${activeAdverbData()?.placement === 'marked' ? (activeAdverbData().marking || 'functional:marked-host') : (activeAdverbData()?.word ? 'functional:default-host' : 'geen')}`,
      `adverb_notation: ${activeAdverbData()?.word ? `LEX-ADV[word=${activeAdverbData().word}, class=${activeAdverbData().category || 'BIJWOORD'}, axis=LEX, defaultHost=${activeAdverbData().defaultHost || '?'}, host=${activeAdverbData().host || activeAdverbData().defaultHost || '?'}, source=external, marking=${activeAdverbData().placement === 'marked' ? (activeAdverbData().marking || 'functional:marked-host') : 'functional:default-host'}]` : 'geen'}`, 
      `top_menus_above_grid: ${normalizeTopMenusAbove().map(topMenuLabel).join(', ') || 'geen'}`,
      `right_menu_width: ${validRightMenuMode()} (${rightMenuLabel()})`,
      `canvas_fit: ${viewFitLabel()}; default = volledige boom zichtbaar`,
      `free_slots: boomrijen voor open OPN-plaatsing; bijwoord-inserts worden boven syntactische categorieboxen getekend`,
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

  function cycleSouthLogicalMode(delta = 1) {
    const current = state.southLogicalMode || 'SOV';
    const index = Math.max(0, SOUTH_LOGICAL_MODES.indexOf(current));
    const nextIndex = (index + delta + SOUTH_LOGICAL_MODES.length) % SOUTH_LOGICAL_MODES.length;
    state.southLogicalMode = SOUTH_LOGICAL_MODES[nextIndex];
    render();
  }

  function toggleSouthLogicalFlip() {
    cycleSouthLogicalMode(1);
  }

  function resetForNewExample() {
    stopGrowthPlayback();
    state.growthEnabled = false;
    state.growthStep = 0;
    state.southLogicalMode = 'SOV';
    state.lastSupportedGrowthStep = 0;
    state.roleSwap = false;
    state.selectedNodeId = null;
    applyExampleAdverbDefaults();
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

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(node => { node.textContent = text; });
  }

  function setHtml(selector, html) {
    document.querySelectorAll(selector).forEach(node => { node.innerHTML = html; });
  }

  function setTitle(selector, text) {
    document.querySelectorAll(selector).forEach(node => { node.title = text; });
  }

  function setInputLabelText(inputOrSelector, text) {
    const inputs = typeof inputOrSelector === 'string' ? document.querySelectorAll(inputOrSelector) : [inputOrSelector].filter(Boolean);
    inputs.forEach(input => {
      const label = input.closest?.('label');
      if (!label) return;
      const kept = [];
      label.childNodes.forEach(node => {
        if (node === input || (node.nodeType === 1 && node.contains?.(input))) kept.push(node);
      });
      label.replaceChildren(...kept, document.createTextNode(` ${text}`));
    });
  }

  function setLabelSpan(selectId, text, title = null) {
    const select = document.getElementById(selectId);
    const label = select?.closest?.('label');
    const span = label?.querySelector?.('span');
    if (span) span.textContent = text;
    if (title && label) label.title = title;
  }

  function setPanelHeading(index, text) {
    const card = document.querySelectorAll('.side-panel .panel-card')[index];
    const h2 = card?.querySelector('h2');
    if (h2) h2.textContent = text;
  }

  function applyConfigLanguageTexts(en) {
    setText('.main-sentence-field span, .desktop-sentence-field span, .mobile-sentence-field span, .toolbar .example-field span', en ? 'Sentence' : 'Zin');
    setText('.main-adverb-field span, .mobile-adverb-field span', en ? 'Adverb' : 'Bijwoord');
    setText('.config-topbar h2', en ? 'All settings' : 'Alle instellingen');
    setText('.config-topbar p', en ? 'Configure adverb LEX slots, layout, main-window fit, export and documentation here. Projection, sentence and Play/Grow live in Main.' : 'Bijwoordslots op de LEX-as, layout, hoofdvenster, export en documentatie staan hier. Projectie, zin en Play/Groei staan in Main.');
    setPanelHeading(0, en ? 'Projection settings' : 'Projectie-instellingen');
    setPanelHeading(1, en ? 'LEX axis - utterance type' : 'LEX-as · uitingtype');
    setPanelHeading(2, en ? 'Relations / rules' : 'Relaties / regels');
    setText('.right-menu-width-callout .inline-help', en ? 'Set the width of the right menu directly. The grid uses only the space needed for tree + axes; the remaining space goes to this column.' : 'Kies hier direct de breedte van het rechter menu. Het grid gebruikt alleen de benodigde ruimte voor boom + assen; de rest gaat naar deze kolom.');
    setText('.side-panel .panel-card:first-child > .sticky-note', en ? 'Grid first. The right column is visible at the top; then choose which menus may appear above the grid.' : 'Grid eerst. Rechterkolom staat nu zichtbaar bovenaan; kies daarna welke menu’s boven het grid mogen staan.');

    setLabelSpan('rightMenuWidthSelectTop', en ? 'Right column visible' : 'Rechterkolom zichtbaar');
    setLabelSpan('centralModeSelect', en ? 'Central OPN' : 'Centraal OPN');
    setLabelSpan('treeChoiceSelect', en ? 'Tree choice' : 'Boomkeuze');
    setLabelSpan('functionalOrderSelect', en ? 'Layout order' : 'Layout order');
    setLabelSpan('branchOrderSelect', en ? 'Branch order' : 'Takvolgorde');
    setLabelSpan('branchTopSelect', en ? 'Top S/CLAUSE' : 'Top S/CLAUSE');
    setLabelSpan('branchMiddleSelect', en ? 'VP / ARG-STRUCT' : 'VP / ARG-STRUCT');
    setLabelSpan('branchOtherSelect', en ? 'Other' : 'Overig');
    setLabelSpan('layoutDensitySelect', en ? 'Tree spacing' : 'Boomruimte');
    setLabelSpan('mainLayoutDensitySelectTop', en ? 'Tree spacing' : 'Boomruimte');
    setLabelSpan('viewFitSelect', en ? 'Main window' : 'Hoofdvenster');
    setLabelSpan('mainViewFitSelectTop', en ? 'Main window' : 'Hoofdvenster');
    setLabelSpan('freeSlotCountSelect', en ? 'Free tree rows' : 'Boom vrije rijen');
    setLabelSpan('lexFreeSlotCountSelect', en ? 'Adverb boxes' : 'Bijwoordboxen');
    setLabelSpan('lexFreeSlotPlacementSelect', en ? 'Host box' : 'Hostbox');
    setLabelSpan('lexInsertionContentSelect', en ? 'Adverb / content' : 'Bijwoord / inhoud');
    document.querySelectorAll('.lex-adverb-insert-field legend').forEach(node => { node.textContent = en ? 'Adverb LEX slot above syntax box' : 'Bijwoordslot op LEX-as'; });
    document.querySelectorAll('.lex-adverb-insert-field .top-menu-choice-help').forEach(node => { node.textContent = en ? 'Choose the adverb and host box. The adverb is drawn as an external LEX slot on the LEX axis, vertically just above S, NP, VP, V, PP or AP; the host subtree is lowered to create space.' : 'Kies het bijwoord en de hostbox. Het bijwoord wordt als extern LEX-slot op de LEX-as getekend, verticaal net boven S, NP, VP, V, PP of AP; de host-subboom schuift lager om ruimte te maken.'; });
    setLabelSpan('lexRuleSelect', en ? 'Utterance-type rule' : 'Uitingtype-regel');

    document.querySelectorAll('.lex-extension-field legend').forEach(node => { node.textContent = en ? 'Branch extension (not for adverbs)' : (node.closest('.mobile-sheet') ? 'Takverlenging' : 'Takverlenging (niet voor bijwoorden)'); });
    document.querySelectorAll('.top-menu-choice-field:not(.lex-extension-field) legend').forEach(node => {
      const count = node.querySelector('[data-top-menu-count]')?.textContent || '0/4';
      node.textContent = en ? 'Menus above grid ' : 'Menu’s boven grid ';
      const span = document.createElement('span');
      span.className = 'top-menu-choice-count';
      span.setAttribute('data-top-menu-count', '');
      span.textContent = count;
      node.appendChild(span);
    });

    setInputLabelText('#showGridInput', en ? 'Grid' : 'Raster');
    setInputLabelText('#showRelationsInput', en ? 'Branches' : 'Taklijnen');
    setInputLabelText('#showLabelsInput', en ? 'Tree labels' : 'Boomlabels');
    setText('#applyLexRuleButton', en ? 'Apply rule' : 'Pas regel toe');
    setText('#relationHelp', en ? 'No separate relation editor. This list follows the active structure: syntax rules for syntax/all, functional roles for LOG/FT.' : 'Geen losse editor-relaties. Deze lijst volgt de actieve structuur: syntaxregels bij syntax/assen, functionele rollen bij LOG/FT.');

    setText('.mobile-sheet-header .intro-kicker', en ? 'Mobile viewer' : 'Mobiele viewer');
    setText('#mobileCloseButton', en ? 'Close' : 'Sluit');
    setText('.mobile-sheet-section[aria-label="Projecties"] h3', en ? 'Projection' : 'Projectie');
    setText('.mobile-sheet-section[aria-label="Snelle acties"] h3', en ? 'Actions' : 'Acties');
    setText('.mobile-sheet-section[aria-label="Menu\'s boven grid"] h3', en ? 'Menus above grid' : 'Menu’s boven grid');
    setText('.mobile-sheet-section[aria-label="LEX vrije slots"] h3', en ? 'LEX free slots' : 'LEX vrije slots');
    setText('.mobile-sheet-section[aria-label="Documentatie"] h3', en ? 'Documentation' : 'Documentatie');
    setLabelSpan('mobileLexFreeSlotCountSelect', en ? 'Count' : 'Aantal');
    setLabelSpan('mobileLexFreeSlotPlacementSelect', en ? 'Position' : 'Positie');
    setLabelSpan('mobileLexInsertionContentSelect', en ? 'Content' : 'Inhoud');
    setText('#mobileGrowthButton', en ? 'Grow on/off' : 'Groei aan/uit');
    setText('#mobileResetButton', en ? 'Reset sample' : 'Reset voorbeeld');
    setText('label[for="mobileFileInput"]', en ? 'Load JSON' : 'JSON laden');
    setText('#mobileDownloadJsonButton', en ? 'Download JSON' : 'Download JSON');
    setText('.mobile-sheet-note', en ? 'Main grid panning is disabled. Use FIT to frame the tree and projection axes.' : 'Sleep met één vinger om te pannen. Knijp met twee vingers om te zoomen. FIT zet de boom en projectie-assen terug passend in beeld.');

    document.querySelectorAll('.text-panel summary').forEach((node, index) => {
      if (index === 0) node.textContent = en ? 'What is included in this Lite version?' : 'Wat zit in deze eerste Lite-versie?';
      if (index === 1) node.textContent = en ? 'Controls' : 'Bediening';
    });
    const details = document.querySelectorAll('.text-panel details');
    if (details[0]) details[0].querySelectorAll('p').forEach((p, i) => {
      if (i === 0) p.textContent = en ? 'This version is a viewer/demo: choose a sample sentence, choose a projection, show growth, load/download JSON and open documentation. Separate node and relation editing has been removed.' : 'Deze versie is een viewer/demo: voorbeeldzin kiezen, projectie kiezen, groei tonen, canvas pannen/zoomen, JSON laden/downloaden en documentatie openen. Losse knoop- en relatie-editing is verwijderd.';
      if (i === 1) p.textContent = en ? 'Not carried over from the Java app: classical graph algorithms such as planarity, Dijkstra, MST, biconnectivity and canonical ordering. They are outside this first JAN language-tree layer.' : 'Niet overgenomen uit de Java-app: klassieke graph-algoritmen zoals planarity, Dijkstra, MST, biconnectivity en canonical ordering. Die horen niet bij deze eerste JAN-taalboomlaag.';
    });
  }

  function applyLanguage() {
    const en = isEnglish();
    document.documentElement.lang = en ? 'en' : 'nl';
    document.body.classList.toggle('lang-en', en);
    document.body.classList.toggle('lang-nl', !en);
    applyConfigLanguageTexts(en);
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.textContent = en ? 'English' : 'Nederlands';
      button.setAttribute('aria-pressed', String(en));
      button.title = en ? 'Click to switch UI/help back to Dutch.' : 'Klik om UI/help naar Engels te wisselen.';
      button.setAttribute('aria-label', button.title);
    });

    setText('.main-sentence-field span, .desktop-sentence-field span, .mobile-sentence-field span, .sentence-card .field span', en ? 'Sentence' : 'Zin');
    setTitle('#openHelpButton, #openHelpFromConfigButton', en ? 'Open the Help screen.' : 'Open het help-scherm.');
    setTitle('#openConfigButton', en ? 'Open the configuration screen with projection, LEX, layout and documentation settings.' : 'Open het configuratiescherm met alle projectie-, LEX-, layout- en documentatie-instellingen.');
    setTitle('#closeConfigButton, #closeHelpButton', en ? 'Back to main view.' : 'Terug naar hoofdbeeld.');
    setText('#closeConfigButton, #closeHelpButton', en ? '← Back to main' : '← Terug naar main');
    setText('#openConfigButton, #openConfigFromHelpButton', 'Config');
    setText('#openHelpButton, #openHelpFromConfigButton', 'Help');

    setText('.config-topbar .intro-kicker', 'Config');
    setText('.config-topbar h2', en ? 'All settings' : 'Alle instellingen');
    setText('.config-topbar p', en ? 'Adverb slots on the LEX axis, layout, main-window fit, export and documentation are configured here. Projection, sentence and Play/Grow live in Main. The Back to main bar stays fixed while this page scrolls.' : 'Bijwoordslots op de LEX-as, layout, hoofdvenster, export en documentatie staan hier. Projectie, zin en Play/Groei staan in Main. De Terug-naar-main-balk blijft vast staan bij scrollen.');
    setText('.help-topbar .intro-kicker', 'Help');
    setText('.help-topbar h2', en ? 'Help' : 'Uitleg');
    setText('.help-topbar p', en ? 'Help contains textual explanation and usage notes.' : 'Help bevat tekstuitleg en gebruiksaanwijzingen.');
    setText('[data-help-boom-title]', en ? 'Tree first' : 'Boom eerst');
    setText('[data-help-boom-text]', en
      ? 'Tree first is the didactic and notational sequence: start with the central open tree as the source; then project to LEX, SYNTAX and LOG/FT. LEX exchanges stay on the LEX axis; adverbs are rendered on the LEX axis; fronted adverbs occupy LEX slot 1 and trigger V2. Dutch sample sentences remain language data.'
      : 'Boom eerst is de didactische en notationele volgorde: begin met de centrale open boom als bron; projecteer daarna naar LEX, SYNTAX en LOG/FT. De LEX-wissels blijven op de LEX-as; bijwoorden staan ook op de LEX-as, als extern slot met hosthoogte. De Nederlandse voorbeeldzinnen blijven taaldata.');
    setText('[data-help-recursion-title]', en ? 'Recursion technique in the tree' : 'Recursie-techniek in de boom');
    setText('[data-help-recursion-text]', en
      ? 'Recursion is the technical drawing method: the viewer builds the layout bottom-up, from leaves to category nodes, subtrees and boxes. This is separate from the didactic step called tree first.'
      : 'Recursie is hier de technische tekenmethode: de viewer bouwt de layout bottom-up, van bladeren naar categorieknopen, subtrees en boxen. Dat is iets anders dan de didactische stap boom eerst.');
    setText('[data-help-adverb-title]', en ? 'Adverb slots on the LEX axis' : 'Bijwoordslots op de LEX-as');
    setHtml('[data-help-adverb-text]', en
      ? '<strong>Adverb placement differs by scope.</strong> Adverbs are no longer placed between boxes. They are rendered above a valid syntactic category box: S, NP, VP, V, PP or AP. Time and modality usually use S/VP; negation and manner use V; degree uses AP; focus uses NP/VP.'
      : '<strong>Bijwoordplaatsing verschilt per scope.</strong> Bijwoorden staan op de LEX-as. Hostplaatsing gebruikt een LEX-slot op hosthoogte; vooropplaatsing gebruikt LEX-slot 1 en activeert V2/inversie. Tijd/modaliteit meestal S/VP; negatie en wijze V; graad AP; focus NP/VP.');
    setText('[data-help-render-title]', en ? 'Render explanation' : 'Render-uitleg');
    setHtml('[data-help-render-text]', en
      ? '<strong>Rendering</strong> means: first compute the central tree and boxes, then draw projections and the LEX axis. Adverb inserts are rendered above valid syntax boxes; the central tree remains unchanged. OSV-!, VSO-! and VOS-! are not base trees: the box approach cannot produce these orders; the LEX axis then requires a movement rule.'
      : '<strong>Renderen</strong> betekent: eerst de centrale boom en boxen berekenen, daarna projecties en LEX-as tekenen. Bijwoord-inserts worden als externe LEX-slots op de LEX-as geplaatst; de host-subboom schuift lager om ruimte te maken. OSV-!, VSO-! en VOS-! zijn geen basisbomen: de box-aanpak kan deze volgordes niet opleveren; de LEX-as vraagt dan een verplaatsingsregel.');

    setText('[data-projection="axes"], [data-main-projection="axes"]', en ? 'All' : 'Alle');
    setText('[data-projection="source"], [data-main-projection="source"], [data-mobile-projection="source"]', en ? 'Source' : 'Bron');
    setText('[data-projection="synt"]', en ? 'SYNTAX projection' : 'SYNTAX-projectie');
    setText('[data-main-projection="synt"]', 'SYN');
    setText('#mainResetButton, #growthResetButton, #mobileGrowthResetButton', en ? 'Reset' : 'Reset');
    if (els.mainGrowthPlayButton) els.mainGrowthPlayButton.textContent = state.growthTimer ? (en ? 'Pause' : 'Pauze') : 'Play';

    document.querySelectorAll('a[href="docs/OpenGraph_Lite_Viewer_EN_v4506.pdf"]').forEach(a => {
      a.textContent = en ? 'English PDF' : 'English PDF';
      a.title = en ? 'Open English PDF documentation' : 'Open Engelstalige PDF-documentatie';
    });
  }

  function setLanguage(language) {
    state.language = language === 'en' ? 'en' : 'nl';
    try { localStorage.setItem('opengraph_language', state.language); } catch (_err) {}
    syncControls();
    applyLanguage();
    renderStatus();
  }

  function toggleLanguage() {
    setLanguage(isEnglish() ? 'nl' : 'en');
  }

  function setAppScreen(screen = 'main') {
    const next = ['main', 'config', 'help'].includes(screen) ? screen : 'main';
    const isMain = next === 'main';
    const isConfig = next === 'config';
    const isHelp = next === 'help';
    document.body.classList.toggle('main-screen-active', isMain);
    document.body.classList.toggle('config-screen-active', isConfig);
    document.body.classList.toggle('help-screen-active', isHelp);
    els.openConfigButton?.setAttribute('aria-expanded', isConfig ? 'true' : 'false');
    els.closeConfigButton?.setAttribute('aria-expanded', isConfig ? 'true' : 'false');
    els.openHelpButton?.setAttribute('aria-expanded', isHelp ? 'true' : 'false');
    els.closeHelpButton?.setAttribute('aria-expanded', isHelp ? 'true' : 'false');
    window.setTimeout(() => {
      syncExampleSelectSizing();
      syncMainTopbarLayout();
      try { render(); } catch (_) {}
      if (isConfig) els.closeConfigButton?.focus?.();
      else if (isHelp) els.closeHelpButton?.focus?.();
      else els.openConfigButton?.focus?.();
    }, 0);
  }

  function setConfigScreen(open) {
    setAppScreen(open ? 'config' : 'main');
  }

  function setHelpScreen(open) {
    setAppScreen(open ? 'help' : 'main');
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
    const updateMainAdverb = event => {
      state.selectedAdverbId = event.target.value || 'none';
      applyExampleAdverbDefaults();
      resetManualViewBox();
      render();
    };
    els.mainAdverbSelect?.addEventListener('change', updateMainAdverb);
    els.mobileAdverbSelect?.addEventListener('change', updateMainAdverb);
    document.getElementById('reloadExamplesButton')?.addEventListener('click', async () => {
      const before = EXAMPLES.length;
      await loadExamplesFromHtml();
      state.example = EXAMPLES.find(e => e.id === state.example?.id) || EXAMPLES[0];
      resetForNewExample();
      render();
      if (els.actionFeedback) {
        els.actionFeedback.textContent = `Voorbeeldzinnen herladen: ${EXAMPLES.length} beschikbaar${EXAMPLES.length !== before ? ` (${before} → ${EXAMPLES.length})` : ''}.`;
        els.actionFeedback.className = 'action-feedback neutral';
      }
    });
    els.openConfigButton?.addEventListener('click', () => setConfigScreen(true));
    els.closeConfigButton?.addEventListener('click', () => setConfigScreen(false));
    els.openConfigFromHelpButton?.addEventListener('click', () => setConfigScreen(true));
    els.openHelpButton?.addEventListener('click', () => setHelpScreen(true));
    els.openHelpFromConfigButton?.addEventListener('click', () => setHelpScreen(true));
    els.closeHelpButton?.addEventListener('click', () => setHelpScreen(false));
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.addEventListener('click', toggleLanguage);
    });
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && (document.body.classList.contains('config-screen-active') || document.body.classList.contains('help-screen-active'))) setAppScreen('main');
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
    const setLayoutDensity = value => { state.layoutDensity = LAYOUT_DENSITIES.some(opt => opt.id === value) ? value : 'auto'; resetManualViewBox(); render(); };
    const setViewFitMode = value => { state.viewFitMode = validViewFitMode(value); resetManualViewBox(); render(); };
    els.layoutDensitySelect?.addEventListener('change', event => setLayoutDensity(event.target.value));
    els.mainLayoutDensitySelectTop?.addEventListener('change', event => setLayoutDensity(event.target.value));
    els.viewFitSelect?.addEventListener('change', event => setViewFitMode(event.target.value));
    els.mainViewFitSelectTop?.addEventListener('change', event => setViewFitMode(event.target.value));
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
    els.growthPrevButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep - 1); });
    els.growthNextButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep + 1); });
    els.growthResetButton?.addEventListener('click', () => { state.growthEnabled = true; stopGrowthPlayback(); setGrowthStep(0); });
    els.growthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mainGrowthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mainGrowthPrevButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep - 1); });
    els.mainGrowthNextButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep + 1); });
    els.mainResetButton?.addEventListener('click', () => { resetForNewExample(); render(); });
    els.mainSouthPrevButton?.addEventListener('click', () => { stopGrowthPlayback(); cycleSouthLogicalMode(-1); });
    els.mainSouthNextButton?.addEventListener('click', () => { stopGrowthPlayback(); cycleSouthLogicalMode(1); });
    els.mainSouthModeButton?.addEventListener('click', () => { stopGrowthPlayback(); cycleSouthLogicalMode(1); });
    document.querySelectorAll('[data-main-projection]').forEach(button => {
      button.addEventListener('click', () => {
        setProjection(button.dataset.mainProjection || 'axes');
        render();
      });
    });
    els.mobileGrowthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mobileGrowthPrevButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep - 1); });
    els.mobileGrowthNextButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep + 1); });
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
    document.body.classList.remove('help-screen-active');
    registerEvents();
    registerCanvasPan();
    registerPaneSplitter();
    await loadStructureConfig();
    await loadExamplesFromHtml();
    await loadAdverbOptionsFromHtml();
    render();
    applyLanguage();
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
