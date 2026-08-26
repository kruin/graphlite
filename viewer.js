(() => {
  'use strict';

  const VERSION = 'v2.0.0-rc.45';
  const OPN_FORMAT_VERSION = '1.0';
  const OPN_DOCUMENT_TYPE = 'opengraph-document';
  const PARADATA_EVENT_LIMIT = 250;
  const BASE_CELL = 74;
  const ROOT_SIDE_GAP = 1;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  // Bovengrens voor de westelijke LEX-laag: brontraces en maximaal vier
  // compacte, gestaffelde bewegingen. De werkelijke reservering wordt
  // hieronder per actieve analyse uit de getekende banen afgeleid.
  const LEX_RENDER_RIGHT_REACH = 180;
  const LEX_RENDER_LEFT_REACH = 96;
  const LEX_CONTENT_REACH = Object.freeze({
    standard: LEX_RENDER_LEFT_REACH,
    'wide-insertion': 124
  });
  // SVG-eenheden schalen mee met het viewport. Zes eenheden houden de goot
  // ook op groot desktop compact, terwijl de runtime-matrix nog steeds een
  // zichtbare, niet-overlappende scheiding afdwingt.
  const LEX_TREE_CLEARANCE = 6;
  const LEX_MOVEMENT_LANE_START = 72;
  const LEX_MOVEMENT_LANE_STEP = 14;
  const LEX_MOVEMENT_CURVE_REACH = 42;
  const LEX_MOVEMENT_LABEL_OFFSET = 35;
  // De assen gebruiken een stabiele theoretische boom-envelop. De werkelijk
  // getekende subtree-boxen worden verderop recursief uit hun inhoud gemeten.
  const SUBTREE_AXIS_ENVELOPE_X_PAD = 0.56;
  const SUBTREE_MEASURE_POLICY = Object.freeze({
    inlineGap: 8,
    blockGap: 8,
    captionInsetX: 14,
    captionBaseline: 24,
    captionTailGap: 10,
    captionFontPx: 13,
    captionLetterSpacingEm: 0.08
  });
  const TREE_NODE_METRICS = Object.freeze({
    max: Object.freeze({ leafRadius: 34, categoryWidth: 124, categoryHeight: 54, cornerRadius: 15 }),
    standard: Object.freeze({ leafRadius: 27, categoryWidth: 104, categoryHeight: 46, cornerRadius: 13 })
  });
  const CANVAS_GUIDE_TEXT_VISIBLE = false;
  const CONFIG_STORAGE_KEY = 'opengraph_saved_config_v1014';
  const CONFIG_LOG_KEY = 'opengraph_local_config_log_v1014';
  const PROJECT_CONFIG_SCHEMA = 'opengraph-project-config';
  const PROJECT_DEFAULT_CONFIG_PATH = 'config/default-config.json';
  const PROJECT_USER_CONFIG_PATH = 'config/user-config.json';
  const INSERTION_AXIS_DEFINITIONS = Object.freeze({
    lex: Object.freeze({ id: 'lex', label: 'LEX', defaultEnabled: false }),
    synt: Object.freeze({ id: 'synt', label: 'SYNT', defaultEnabled: false }),
    log: Object.freeze({ id: 'log', label: 'LOG', defaultEnabled: false })
  });
  const DEFAULT_INSERTION_AXES = Object.freeze(
    Object.fromEntries(Object.values(INSERTION_AXIS_DEFINITIONS).map(axis => [axis.id, axis.defaultEnabled]))
  );
  const PRECONFIG_CANDIDATES = Object.freeze([
    Object.freeze({ id: 'movement', label: 'Verplaatsing per as', labelEn: 'Movement per axis' }),
    Object.freeze({ id: 'empty-positions', label: 'Lege posities en sporen per as', labelEn: 'Empty positions and traces per axis' }),
    Object.freeze({ id: 'axis-routes', label: 'Bron-naar-doel-koppelingen', labelEn: 'Source-to-target axis routes' }),
    Object.freeze({ id: 'host-scope', label: 'Host- en scoperegels', labelEn: 'Host and scope rules' })
  ]);
  const FEATURE_DEFINITIONS = Object.freeze({
    adverbs: Object.freeze({
      id: 'adverbs',
      label: 'Bijwoorden',
      labelEn: 'Adverbs',
      defaultEnabled: false,
      insertionAxes: Object.freeze(['lex', 'log']),
      // Een toepassing declareert alleen welk soort ruimte zij nodig heeft.
      // De renderer vertaalt dat naar maten; de toepassing levert geen x/y.
      layoutDemand: Object.freeze({ lexContent: 'wide-insertion' })
    })
  });
  // Zinsoorten horen bij Language Tree en zijn geen toepassingen. Vraagzin
  // stond vóór deze scheiding ten onrechte in deze lijst.
  // Gereserveerde toepassingen horen bewust niet bij FEATURE_DEFINITIONS:
  // ze krijgen geen state, opslag, export, resources of runtime-entrypoint.
  const RESERVED_APPLICATION_DEFINITIONS = Object.freeze([
    Object.freeze({
      id: 'emphasis',
      label: 'Nadruk',
      labelEn: 'Emphasis',
      description: 'Focus of nadruk, bijvoorbeeld',
      descriptionEn: 'Focus or emphasis, for example',
      example: 'juist díe trui'
    }),
    Object.freeze({
      id: 'incomplete-sentence',
      label: 'Onaffe zin',
      labelEn: 'Incomplete sentence',
      description: 'Definitie en benodigde voorconfig volgen later.',
      descriptionEn: 'Definition and required pre-config will be defined later.'
    })
  ]);
  const DEFAULT_FEATURES = Object.freeze(
    Object.fromEntries(Object.values(FEATURE_DEFINITIONS).map(feature => [feature.id, feature.defaultEnabled]))
  );
  const MAX_README_CAROUSEL_SLIDES = 20;
  const MAX_README_TOPIC_HTML_LENGTH = 50000;
  const MAX_README_EMBEDDED_IMAGE_BYTES = 1250000;
  const MAX_README_EMBEDDED_SOURCE_CHARS = 1800000;
  const MAX_README_EMBEDDED_TOTAL_CHARS = 3200000;
  const README_EMBEDDED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
  const DEFAULT_README_CAROUSELS = new Map();
  const DEFAULT_README_TOPICS = new Map();


  const LANGUAGE_OPTIONS = [
    { id: 'en', label: 'English' },
    { id: 'nl', label: 'Nederlands' },
    { id: 'de', label: 'Deutsch' },
    { id: 'fr', label: 'Français' },
    { id: 'es', label: 'Español' }
  ];
  const LANGUAGE_IDS = new Set(LANGUAGE_OPTIONS.map(option => option.id));
  const DEFAULT_LANGUAGE = 'en';

  function normalizeLanguage(language) {
    return LANGUAGE_IDS.has(language) ? language : DEFAULT_LANGUAGE;
  }

  function languageValue(values) {
    return values[state.language] || values.en || values.nl || '';
  }

  const els = {
    svg: document.getElementById('graphSvg'),
    canvasWrap: document.getElementById('canvasWrap'),
    lexAmbiguityPanel: document.getElementById('lexAmbiguityPanel'),
    lexAmbiguityHeading: document.getElementById('lexAmbiguityHeading'),
    lexAmbiguityText: document.getElementById('lexAmbiguityText'),
    lexAmbiguityOptions: document.getElementById('lexAmbiguityOptions'),
    lexAmbiguityHelp: document.getElementById('lexAmbiguityHelp'),
    clearLexAnalysisButton: document.getElementById('clearLexAnalysisButton'),
    paneSplitter: document.getElementById('paneSplitter'),
    exampleSelect: document.getElementById('exampleSelect'),
    desktopExampleSelect: document.getElementById('desktopExampleSelect'),
    mobileExampleSelect: document.getElementById('mobileExampleSelect'),
    mainExampleSelect: document.getElementById('mainExampleSelect'),
    mainAdverbSelect: document.getElementById('mainAdverbSelect'),
    mainViewSelect: document.getElementById('mainViewSelect'),
    mainProjectionSelect: document.getElementById('mainProjectionSelect'),
    sourceAxisMenu: document.getElementById('sourceAxisMenu'),
    sourceAxisSummary: document.getElementById('sourceAxisSummary'),
    sourceAxisSummaryLabel: document.getElementById('sourceAxisSummaryLabel'),
    mainSentenceMenu: document.getElementById('mainSentenceMenu'),
    mainSentenceSummary: document.getElementById('mainSentenceSummary'),
    mainSentenceOptions: document.getElementById('mainSentenceOptions'),
    mainAdverbMenu: document.getElementById('mainAdverbMenu'),
    mainAdverbSummary: document.getElementById('mainAdverbSummary'),
    mainAdverbOptions: document.getElementById('mainAdverbOptions'),
    mainViewMenu: document.getElementById('mainViewMenu'),
    mainViewSummary: document.getElementById('mainViewSummary'),
    mainViewOptions: document.getElementById('mainViewOptions'),
    languageTreeViewPicker: document.getElementById('languageTreeViewPicker'),
    mainInterfaceMenu: document.getElementById('mainInterfaceMenu'),
    mainInterfaceSummary: document.getElementById('mainInterfaceSummary'),
    mainInterfaceOptions: document.getElementById('mainInterfaceOptions'),
    mainInterfaceHelp: document.getElementById('mainInterfaceHelp'),
    mainLanguageMenu: document.getElementById('mainLanguageMenu'),
    mainLanguageSummary: document.getElementById('mainLanguageSummary'),
    configLanguageMenu: document.getElementById('configLanguageMenu'),
    configLanguageSummary: document.getElementById('configLanguageSummary'),
    helpLanguageMenu: document.getElementById('helpLanguageMenu'),
    helpLanguageSummary: document.getElementById('helpLanguageSummary'),
    mainLanguageNote: document.getElementById('mainLanguageNote'),
    mainActionsMenu: document.getElementById('mainActionsMenu'),
    mainActionsSummary: document.getElementById('mainActionsSummary'),
    mainExtraMenu: document.getElementById('mainExtraMenu'),
    mainExtraSummary: document.getElementById('mainExtraSummary'),
    mainSouthHeading: document.getElementById('mainSouthHeading'),
    mainSouthExplanation: document.getElementById('mainSouthExplanation'),
    mobileViewSelect: document.getElementById('mobileViewSelect'),
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
    lexProjectionColorSelect: document.getElementById('lexProjectionColorSelect'),
    mobileRightMenuWidthSelect: document.getElementById('mobileRightMenuWidthSelect'),
    syntProjectionColorSelect: document.getElementById('syntProjectionColorSelect'),
    logProjectionColorSelect: document.getElementById('logProjectionColorSelect'),
    gridColorSelect: document.getElementById('gridColorSelect'),
    gridLineWeightSelect: document.getElementById('gridLineWeightSelect'),
    gridSizeHorizontalSelect: document.getElementById('gridSizeHorizontalSelect'),
    gridSizeVerticalSelect: document.getElementById('gridSizeVerticalSelect'),
    treeLineColorSelect: document.getElementById('treeLineColorSelect'),
    treeLineWeightSelect: document.getElementById('treeLineWeightSelect'),
    projectionLineWeightSelect: document.getElementById('projectionLineWeightSelect'),
    boxLineWeightSelect: document.getElementById('boxLineWeightSelect'),
    freeSlotCountSelect: document.getElementById('freeSlotCountSelect'),
    projectionBoxDraggableInput: document.getElementById('projectionBoxDraggableInput'),
    southBoxDraggableInput: document.getElementById('southBoxDraggableInput'),
    saveConfigButton: document.getElementById('saveConfigButton'),
    discardConfigButton: document.getElementById('discardConfigButton'),
    downloadConfigLogButton: document.getElementById('downloadConfigLogButton'),
    configSaveStatus: document.getElementById('configSaveStatus'),
    lexFreeSlotCountSelect: document.getElementById('lexFreeSlotCountSelect'),
    lexFreeSlotPlacementSelect: document.getElementById('lexFreeSlotPlacementSelect'),
    lexInsertionContentSelect: document.getElementById('lexInsertionContentSelect'),
    logInsertionIntervalSelect: document.getElementById('logInsertionIntervalSelect'),
    mobileLexInsertionContentSelect: document.getElementById('mobileLexInsertionContentSelect'),
    mobileLexFreeSlotCountSelect: document.getElementById('mobileLexFreeSlotCountSelect'),
    mobileLexFreeSlotPlacementSelect: document.getElementById('mobileLexFreeSlotPlacementSelect'),
    mobileLogInsertionIntervalSelect: document.getElementById('mobileLogInsertionIntervalSelect'),
    portraitMenuSlotsSelect: document.getElementById('portraitMenuSlotsSelect'),
    mobilePortraitMenuSlotsSelect: document.getElementById('mobilePortraitMenuSlotsSelect'),
    projectionHelp: document.getElementById('projectionHelp'),
    titleLine: document.getElementById('titleLine'),
    mainActiveUtterance: document.getElementById('mainActiveUtterance'),
    mainActiveUtteranceLabel: document.getElementById('mainActiveUtteranceLabel'),
    mainActiveUtteranceText: document.getElementById('mainActiveUtteranceText'),
    mainCausalAnaphorChoice: document.getElementById('mainCausalAnaphorChoice'),
    mainCausalAnaphorLabel: document.getElementById('mainCausalAnaphorLabel'),
    mainCausalAnaphorSelect: document.getElementById('mainCausalAnaphorSelect'),
    mainCausalVerbChoice: document.getElementById('mainCausalVerbChoice'),
    mainCausalVerbSelect: document.getElementById('mainCausalVerbSelect'),
    mainBotChoice: document.getElementById('mainBotChoice'),
    mainBotSelect: document.getElementById('mainBotSelect'),
    metaLine: document.getElementById('metaLine'),
    sentencePreview: document.getElementById('sentencePreview'),
    actionFeedback: document.getElementById('actionFeedback'),
    explainHeading: document.getElementById('explainHeading'),
    explainText: document.getElementById('explainText'),
    showGridInput: document.getElementById('showGridInput'),
    showRelationsInput: document.getElementById('showRelationsInput'),
    showLabelsInput: document.getElementById('showLabelsInput'),
    snapInput: document.getElementById('snapInput'),
    sentenceTypeSelect: document.getElementById('sentenceTypeSelect'),
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
    configFileInput: document.getElementById('configFileInput'),
    mobileFileInput: document.getElementById('mobileFileInput'),
    resetExampleButton: document.getElementById('resetExampleButton'),
    fitButton: document.getElementById('fitButton'),
    undoButton: document.getElementById('undoButton'),
    redoButton: document.getElementById('redoButton'),
    downloadJsonButton: document.getElementById('downloadJsonButton'),
    downloadOpnButton: document.getElementById('downloadOpnButton'),
    configDownloadOpnButton: document.getElementById('configDownloadOpnButton'),
    downloadGraphSvgButton: document.getElementById('downloadGraphSvgButton'),
    downloadGraphPngButton: document.getElementById('downloadGraphPngButton'),
    recordPlayWebmButton: document.getElementById('recordPlayWebmButton'),
    graphExportStatus: document.getElementById('graphExportStatus'),
    mobileDownloadOpnButton: document.getElementById('mobileDownloadOpnButton'),
    includeParadataInput: document.getElementById('includeParadataInput'),
    configIncludeParadataInput: document.getElementById('configIncludeParadataInput'),
    mobileIncludeParadataInput: document.getElementById('mobileIncludeParadataInput'),
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
      "id": "hond-bijt-man",
      "title": "HOND BIJT MAN",
      "phase": "Fase 1+2",
      "sentenceType": "main-declarative",
      "lexRule": "hoofdzininvariant",
      "sentence": "HOND BIJT MAN",
      "sentenceHtml": "<strong data-role=\"subject\" data-thematic-role=\"agens\">HOND</strong> BIJT <em data-role=\"object\" data-thematic-role=\"patiens\">MAN</em>",
      "subjectDefault": "HOND",
      "objectDefault": "MAN",
      "predicate": "BIJT",
      "lexItems": [
        {
          "id": "subject-hond",
          "label": "HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "pred-bijt",
          "label": "BIJT",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "bijt"
        },
        {
          "id": "object-man",
          "label": "MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        }
      ]
    },
    {
      "id": "bijt-hond-man-vraag",
      "title": "BIJT HOND MAN?",
      "phase": "Vraagzin · ja/nee",
      "sentenceType": "polar-question",
      "lexRule": "vraagzin-v1",
      "sentence": "BIJT HOND MAN?",
      "sentenceHtml": "BIJT <strong data-role=\"subject\" data-thematic-role=\"agens\">HOND</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">MAN</em>?",
      "subjectDefault": "HOND",
      "objectDefault": "MAN",
      "predicate": "BIJT",
      "lexItems": [
        {
          "id": "pred-bijt-vraag",
          "label": "BIJT",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "bijt"
        },
        {
          "id": "subject-hond-vraag",
          "label": "HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "object-man-vraag",
          "label": "MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        }
      ]
    },
    {
      "id": "dat-hond-man-bijt",
      "title": "DAT HOND MAN BIJT",
      "phase": "Dat-zin · Comp",
      "sentenceType": "subordinate-dat",
      "lexRule": "bijzin-dat",
      "sentence": "DAT HOND MAN BIJT",
      "sentenceHtml": "DAT <strong data-role=\"subject\" data-thematic-role=\"agens\">HOND</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">MAN</em> BIJT",
      "subjectDefault": "HOND",
      "objectDefault": "MAN",
      "predicate": "BIJT",
      "lexItems": [
        {
          "id": "dat",
          "label": "DAT",
          "source": null,
          "slot": "comp",
          "role": null,
          "thematicRole": null,
          "lexeme": "dat"
        },
        {
          "id": "subject-hond-dat",
          "label": "HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "object-man-dat",
          "label": "MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        },
        {
          "id": "pred-bijt-dat",
          "label": "BIJT",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "bijt"
        }
      ]
    },
    {
      "id": "omdat-hond-man-bijt",
      "title": "OMDAT HOND MAN BIJT",
      "phase": "Fase 3",
      "sentenceType": "subordinate-omdat",
      "lexRule": "bijzin-omdat",
      "sentence": "OMDAT HOND MAN BIJT",
      "sentenceHtml": "OMDAT <strong data-role=\"subject\" data-thematic-role=\"agens\">HOND</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">MAN</em> BIJT",
      "subjectDefault": "HOND",
      "objectDefault": "MAN",
      "predicate": "BIJT",
      "lexItems": [
        {
          "id": "omdat",
          "label": "OMDAT",
          "source": null,
          "slot": "comp",
          "role": null,
          "thematicRole": null,
          "lexeme": "omdat"
        },
        {
          "id": "subject-hond",
          "label": "HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "object-man",
          "label": "MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        },
        {
          "id": "pred-bijt",
          "label": "BIJT",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "bijt"
        }
      ]
    },
    {
      "id": "hond-beet-man",
      "title": "HOND BEET MAN",
      "phase": "OVT · onvoltooid verleden tijd",
      "lexRule": "hoofdzininvariant",
      "sentence": "HOND BEET MAN",
      "sentenceHtml": "<strong data-role=\"subject\" data-thematic-role=\"agens\">HOND</strong> BEET <em data-role=\"object\" data-thematic-role=\"patiens\">MAN</em>",
      "subjectDefault": "HOND",
      "objectDefault": "MAN",
      "predicate": "BEET",
      "lexItems": [
        {
          "id": "subject-hond",
          "label": "HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "pred-beet",
          "label": "BEET",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "bijt"
        },
        {
          "id": "object-man",
          "label": "MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        }
      ]
    },
    {
      "id": "omdat-hond-man-beet",
      "title": "OMDAT HOND MAN BEET",
      "phase": "OVT · omdat-bijzin",
      "lexRule": "bijzin-omdat",
      "sentence": "OMDAT HOND MAN BEET",
      "sentenceHtml": "OMDAT <strong data-role=\"subject\" data-thematic-role=\"agens\">HOND</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">MAN</em> BEET",
      "subjectDefault": "HOND",
      "objectDefault": "MAN",
      "predicate": "BEET",
      "lexItems": [
        {
          "id": "omdat",
          "label": "OMDAT",
          "source": null,
          "slot": "comp",
          "role": null,
          "thematicRole": null,
          "lexeme": "omdat"
        },
        {
          "id": "subject-hond",
          "label": "HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "object-man",
          "label": "MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        },
        {
          "id": "pred-beet",
          "label": "BEET",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "bijt"
        }
      ]
    },
    {
      "id": "vrouw-breide-trui",
      "title": "VROUW BREIDE TRUI",
      "phase": "OVT · onvoltooid verleden tijd",
      "lexRule": "hoofdzininvariant",
      "sentence": "VROUW BREIDE TRUI",
      "sentenceHtml": "<strong data-role=\"subject\" data-thematic-role=\"agens\">VROUW</strong> BREIDE <em data-role=\"object\" data-thematic-role=\"patiens\">TRUI</em>",
      "subjectDefault": "VROUW",
      "objectDefault": "TRUI",
      "predicate": "BREIDE",
      "lexItems": [
        {
          "id": "subject-vrouw",
          "label": "VROUW",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "vrouw"
        },
        {
          "id": "pred-breide",
          "label": "BREIDE",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "breit"
        },
        {
          "id": "object-trui",
          "label": "TRUI",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "trui"
        }
      ]
    },
    {
      "id": "omdat-vrouw-trui-breide",
      "title": "OMDAT VROUW TRUI BREIDE",
      "phase": "OVT · omdat-bijzin",
      "lexRule": "bijzin-omdat",
      "sentence": "OMDAT VROUW TRUI BREIDE",
      "sentenceHtml": "OMDAT <strong data-role=\"subject\" data-thematic-role=\"agens\">VROUW</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">TRUI</em> BREIDE",
      "subjectDefault": "VROUW",
      "objectDefault": "TRUI",
      "predicate": "BREIDE",
      "lexItems": [
        {
          "id": "omdat",
          "label": "OMDAT",
          "source": null,
          "slot": "comp",
          "role": null,
          "thematicRole": null,
          "lexeme": "omdat"
        },
        {
          "id": "subject-vrouw",
          "label": "VROUW",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "vrouw"
        },
        {
          "id": "object-trui",
          "label": "TRUI",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "trui"
        },
        {
          "id": "pred-breide",
          "label": "BREIDE",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "breit"
        }
      ]
    },
    {
      "id": "vrouw-breit-trui",
      "title": "VROUW BREIT TRUI",
      "phase": "Lexicon-test",
      "lexRule": "hoofdzininvariant",
      "sentence": "VROUW BREIT TRUI",
      "sentenceHtml": "<strong data-role=\"subject\" data-thematic-role=\"agens\">VROUW</strong> BREIT <em data-role=\"object\" data-thematic-role=\"patiens\">TRUI</em>",
      "subjectDefault": "VROUW",
      "objectDefault": "TRUI",
      "predicate": "BREIT",
      "lexItems": [
        {
          "id": "subject-vrouw",
          "label": "VROUW",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "vrouw"
        },
        {
          "id": "pred-breit",
          "label": "BREIT",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "breit"
        },
        {
          "id": "object-trui",
          "label": "TRUI",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "trui"
        }
      ]
    },
    {
      "id": "omdat-vrouw-trui-breit",
      "title": "OMDAT VROUW TRUI BREIT",
      "phase": "Lexicon-test",
      "lexRule": "bijzin-omdat",
      "sentence": "OMDAT VROUW TRUI BREIT",
      "sentenceHtml": "OMDAT <strong data-role=\"subject\" data-thematic-role=\"agens\">VROUW</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">TRUI</em> BREIT",
      "subjectDefault": "VROUW",
      "objectDefault": "TRUI",
      "predicate": "BREIT",
      "lexItems": [
        {
          "id": "omdat",
          "label": "OMDAT",
          "source": null,
          "slot": "comp",
          "role": null,
          "thematicRole": null,
          "lexeme": "omdat"
        },
        {
          "id": "subject-vrouw",
          "label": "VROUW",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "vrouw"
        },
        {
          "id": "object-trui",
          "label": "TRUI",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "trui"
        },
        {
          "id": "pred-breit",
          "label": "BREIT",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "breit"
        }
      ]
    },
    {
      "id": "trui-breit-vrouw-topic",
      "title": "TRUI BREIT VROUW",
      "phase": "V2 topicalisatie",
      "lexRule": "hoofdzininvariant",
      "sentence": "TRUI BREIT VROUW",
      "sentenceHtml": "<em data-role=\"object\" data-thematic-role=\"patiens\">TRUI</em> BREIT <strong data-role=\"subject\" data-thematic-role=\"agens\">VROUW</strong>",
      "subjectDefault": "VROUW",
      "objectDefault": "TRUI",
      "predicate": "BREIT",
      "lexItems": [
        {
          "id": "object-trui-topic",
          "label": "TRUI",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "trui"
        },
        {
          "id": "pred-breit",
          "label": "BREIT",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "breit"
        },
        {
          "id": "subject-vrouw",
          "label": "VROUW",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "vrouw"
        }
      ]
    },
    {
      "id": "hond-heeft-man-gebeten",
      "title": "HOND HEEFT MAN GEBETEN",
      "phase": "Perfectum",
      "lexRule": "perfectum-heeft-vdw",
      "sentence": "HOND HEEFT MAN GEBETEN",
      "sentenceHtml": "<strong data-role=\"subject\" data-thematic-role=\"agens\">HOND</strong> HEEFT <em data-role=\"object\" data-thematic-role=\"patiens\">MAN</em> GEBETEN",
      "subjectDefault": "HOND",
      "objectDefault": "MAN",
      "predicate": "GEBETEN",
      "lexItems": [
        {
          "id": "subject-hond",
          "label": "HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "pv-heeft",
          "label": "HEEFT",
          "source": "pv",
          "slot": null,
          "role": "aux",
          "thematicRole": null,
          "lexeme": "heeft"
        },
        {
          "id": "object-man",
          "label": "MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        },
        {
          "id": "vdw-bijt",
          "label": "GEBETEN",
          "source": "vdw",
          "slot": null,
          "role": "participle",
          "thematicRole": null,
          "lexeme": "bijt"
        }
      ]
    },
    {
      "id": "omdat-de-hond-de-man-heeft-gebeten",
      "title": "OMDAT DE HOND DE MAN HEEFT GEBETEN",
      "phase": "Perfectum · omdat-bijzin",
      "lexRule": "bijzin-omdat",
      "sentence": "OMDAT DE HOND DE MAN HEEFT GEBETEN",
      "sentenceHtml": "OMDAT <strong data-role=\"subject\" data-thematic-role=\"agens\">DE HOND</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">DE MAN</em> HEEFT GEBETEN",
      "subjectDefault": "DE HOND",
      "objectDefault": "DE MAN",
      "predicate": "GEBETEN",
      "lexItems": [
        {
          "id": "omdat",
          "label": "OMDAT",
          "source": null,
          "slot": "comp",
          "role": null,
          "thematicRole": null,
          "lexeme": "omdat"
        },
        {
          "id": "subject-hond",
          "label": "DE HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "object-man",
          "label": "DE MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        },
        {
          "id": "pv-heeft",
          "label": "HEEFT",
          "source": "pv",
          "slot": null,
          "role": "aux",
          "thematicRole": null,
          "lexeme": "heeft"
        },
        {
          "id": "vdw-bijt",
          "label": "GEBETEN",
          "source": "vdw",
          "slot": null,
          "role": "participle",
          "thematicRole": null,
          "lexeme": "bijt"
        }
      ]
    },
    {
      "id": "omdat-vrouw-trui-heeft-gebreid",
      "title": "OMDAT VROUW TRUI HEEFT GEBREID",
      "phase": "Gebruikersinput · omdat+perfectum",
      "lexRule": "bijzin-omdat",
      "sentence": "OMDAT VROUW TRUI HEEFT GEBREID",
      "sentenceHtml": "OMDAT <strong data-role=\"subject\" data-thematic-role=\"agens\">VROUW</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">TRUI</em> HEEFT GEBREID",
      "subjectDefault": "VROUW",
      "objectDefault": "TRUI",
      "predicate": "GEBREID",
      "lexItems": [
        {
          "id": "omdat",
          "label": "OMDAT",
          "source": null,
          "slot": "comp",
          "role": null,
          "thematicRole": null,
          "lexeme": "omdat"
        },
        {
          "id": "subject-vrouw",
          "label": "VROUW",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "vrouw"
        },
        {
          "id": "object-trui",
          "label": "TRUI",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "trui"
        },
        {
          "id": "pv-heeft",
          "label": "HEEFT",
          "source": "pv",
          "slot": null,
          "role": "aux",
          "thematicRole": null,
          "lexeme": "heeft"
        },
        {
          "id": "vdw-breit",
          "label": "GEBREID",
          "source": "vdw",
          "slot": null,
          "role": "participle",
          "thematicRole": null,
          "lexeme": "breit"
        }
      ]
    },
    {
      "id": "de-hond-heeft-de-man-misschien-wel-vaak-gebeten",
      "title": "DE HOND HEEFT DE MAN MISSCHIEN WEL VAAK GEBETEN",
      "phase": "Meervoudige LEX-insertie",
      "lexRule": "hoofdzininvariant",
      "sentence": "DE HOND HEEFT DE MAN MISSCHIEN WEL VAAK GEBETEN",
      "sentenceHtml": "<strong data-role=\"subject\" data-thematic-role=\"agens\">DE HOND</strong> HEEFT <em data-role=\"object\" data-thematic-role=\"patiens\">DE MAN</em> MISSCHIEN WEL VAAK GEBETEN",
      "subjectDefault": "DE HOND",
      "objectDefault": "DE MAN",
      "predicate": "GEBETEN",
      "lexItems": [
        {
          "id": "subject-hond",
          "label": "DE HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "pv-heeft",
          "label": "HEEFT",
          "source": "pv",
          "slot": null,
          "role": "aux",
          "thematicRole": null,
          "lexeme": "heeft"
        },
        {
          "id": "object-man",
          "label": "DE MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        },
        {
          "id": "vdw-bijt",
          "label": "GEBETEN",
          "source": "vdw",
          "slot": null,
          "role": "participle",
          "thematicRole": null,
          "lexeme": "bijt"
        }
      ],
      "lexInsertions": [
        {
          "id": "misschien-wel",
          "text": "MISSCHIEN WEL",
          "lemma": "misschien wel",
          "construction": "misschien-wel",
          "usageProfile": "mixed-modal-particle",
          "origin": "LOG+LEX",
          "originComponents": "misschien:LOG wel:LEX",
          "analysisStatus": "ask",
          "candidateProfiles": ["mixed-modal-particle", "group-modal-log", "group-lexical-particle"],
          "ambiguityAffects": ["origin", "log-projection", "scope", "components"],
          "host": "V-CLUSTER",
          "defaultHost": "V-CLUSTER",
          "category": "MODALITEIT",
          "marking": "functional:default-host",
          "scope": "propositie",
          "linear": "post-object-pre-vcluster",
          "order": 1,
          "group": "modal-group"
        },
        {
          "id": "vaak",
          "text": "VAAK",
          "lemma": "vaak",
          "usageProfile": "frequency-event",
          "origin": "LOG",
          "analysisStatus": "resolved",
          "host": "V-CLUSTER",
          "defaultHost": "V-CLUSTER",
          "category": "FREQUENTIE",
          "marking": "functional:default-host",
          "scope": "gebeurtenis",
          "linear": "post-object-pre-vcluster",
          "order": 2,
          "group": "frequency-group"
        }
      ]
    },
    {
      "id": "omdat-de-hond-de-man-misschien-wel-vaak-gebeten-heeft",
      "title": "OMDAT DE HOND DE MAN MISSCHIEN WEL VAAK GEBETEN HEEFT",
      "phase": "Meervoudige LEX-insertie · bijzin",
      "lexRule": "bijzin-omdat",
      "sentence": "OMDAT DE HOND DE MAN MISSCHIEN WEL VAAK GEBETEN HEEFT",
      "sentenceHtml": "OMDAT <strong data-role=\"subject\" data-thematic-role=\"agens\">DE HOND</strong> <em data-role=\"object\" data-thematic-role=\"patiens\">DE MAN</em> MISSCHIEN WEL VAAK GEBETEN HEEFT",
      "subjectDefault": "DE HOND",
      "objectDefault": "DE MAN",
      "predicate": "GEBETEN",
      "lexItems": [
        {
          "id": "omdat",
          "label": "OMDAT",
          "source": null,
          "slot": "comp",
          "role": null,
          "thematicRole": null,
          "lexeme": "omdat"
        },
        {
          "id": "subject-hond",
          "label": "DE HOND",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "hond"
        },
        {
          "id": "object-man",
          "label": "DE MAN",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "man"
        },
        {
          "id": "vdw-bijt",
          "label": "GEBETEN",
          "source": "vdw",
          "slot": null,
          "role": "participle",
          "thematicRole": null,
          "lexeme": "bijt"
        },
        {
          "id": "pv-heeft",
          "label": "HEEFT",
          "source": "pv",
          "slot": null,
          "role": "aux",
          "thematicRole": null,
          "lexeme": "heeft"
        }
      ],
      "lexInsertions": [
        {
          "id": "misschien-wel",
          "text": "MISSCHIEN WEL",
          "lemma": "misschien wel",
          "construction": "misschien-wel",
          "usageProfile": "mixed-modal-particle",
          "origin": "LOG+LEX",
          "originComponents": "misschien:LOG wel:LEX",
          "analysisStatus": "ask",
          "candidateProfiles": ["mixed-modal-particle", "group-modal-log", "group-lexical-particle"],
          "ambiguityAffects": ["origin", "log-projection", "scope", "components"],
          "host": "V-CLUSTER",
          "defaultHost": "V-CLUSTER",
          "category": "MODALITEIT",
          "marking": "functional:default-host",
          "scope": "propositie",
          "linear": "post-object-pre-vcluster",
          "order": 1,
          "group": "modal-group"
        },
        {
          "id": "vaak",
          "text": "VAAK",
          "lemma": "vaak",
          "usageProfile": "frequency-event",
          "origin": "LOG",
          "analysisStatus": "resolved",
          "host": "V-CLUSTER",
          "defaultHost": "V-CLUSTER",
          "category": "FREQUENTIE",
          "marking": "functional:default-host",
          "scope": "gebeurtenis",
          "linear": "post-object-pre-vcluster",
          "order": 2,
          "group": "frequency-group"
        }
      ]
    },
    {
      "id": "jan-wast-zichzelf",
      "title": "JAN WAST ZICHZELF",
      "phase": "Uiting · reflexive",
      "sentenceType": "main-declarative",
      "lexRule": "hoofdzininvariant",
      "sentence": "JAN WAST ZICHZELF",
      "sentenceHtml": "JAN WAST ZICHZELF",
      "subjectDefault": "JAN",
      "objectDefault": "ZICHZELF",
      "predicate": "WAST",
      "utteranceType": "reflexive",
      "utteranceKernels": [
        {
          "id": "k1",
          "text": "Jan wast Jan.",
          "predicate": "wassen",
          "agens": "jan",
          "patiens": "jan"
        },
        {
          "id": "k2",
          "text": "Jan wast zelf.",
          "predicate": "wassen",
          "agens": "jan",
          "patiens": "zelf"
        }
      ],
      "utteranceRelations": [
        {
          "type": "coreference",
          "members": [
            "k1.agens",
            "k1.patiens",
            "k2.agens"
          ]
        },
        {
          "type": "reflexive-realization",
          "components": [
            "zich",
            "zelf"
          ],
          "surface": "zichzelf"
        }
      ],
      "implicitSubject": "",
      "lexItems": [
        {
          "id": "subject-jan-wast",
          "label": "JAN",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "jan"
        },
        {
          "id": "pred-wast",
          "label": "WAST",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "wast"
        },
        {
          "id": "object-zichzelf",
          "label": "ZICHZELF",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "zichzelf"
        }
      ]
    },
    {
      "id": "jan-slaat-jek-omdat-die-hem-beet",
      "title": "JAN SLAAT JEK OMDAT DIE HEM BEET",
      "phase": "Uiting · causal-role-flip",
      "sentenceType": "main-declarative",
      "lexRule": "hoofdzininvariant",
      "sentence": "JAN SLAAT JEK OMDAT DIE HEM BEET",
      "sentenceHtml": "JAN SLAAT JEK OMDAT DIE HEM BEET",
      "subjectDefault": "JAN",
      "objectDefault": "JEK",
      "predicate": "SLAAT",
      "utteranceType": "causal-role-flip",
      "utteranceKernels": [
        {
          "id": "k1",
          "text": "Jan slaat hond.",
          "predicate": "slaan",
          "agens": "jan",
          "patiens": "jek"
        },
        {
          "id": "k2",
          "text": "Hond bijt man.",
          "predicate": "bijten",
          "agens": "jek",
          "patiens": "jan"
        }
      ],
      "utteranceRelations": [
        {
          "type": "cause",
          "from": "k2",
          "to": "k1",
          "surface": "omdat"
        },
        {
          "type": "coreference",
          "members": [
            "k1.agens",
            "k2.patiens"
          ],
          "surface": [
            "Jek",
            "die"
          ]
        },
        {
          "type": "coreference",
          "members": [
            "k1.patiens",
            "k2.agens"
          ],
          "surface": [
            "Jan",
            "hem"
          ]
        },
        {
          "type": "role-flip",
          "participants": [
            "jan",
            "jek"
          ]
        }
      ],
      "implicitSubject": "",
      "lexItems": [
        {
          "id": "subject-jan-slaat",
          "label": "JAN",
          "source": "subject",
          "slot": null,
          "role": "subject",
          "thematicRole": "agens",
          "lexeme": "jan"
        },
        {
          "id": "pred-slaat",
          "label": "SLAAT",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "slaat"
        },
        {
          "id": "object-jek",
          "label": "JEK",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "jek"
        },
        {
          "id": "causal-omdat",
          "label": "OMDAT",
          "source": null,
          "slot": null,
          "role": null,
          "thematicRole": null,
          "lexeme": "omdat"
        },
        {
          "id": "anaphor-die",
          "label": "DIE",
          "source": null,
          "slot": null,
          "role": null,
          "thematicRole": null,
          "lexeme": "die"
        },
        {
          "id": "anaphor-hem",
          "label": "HEM",
          "source": null,
          "slot": null,
          "role": null,
          "thematicRole": null,
          "lexeme": "hem"
        },
        {
          "id": "subordinate-beet",
          "label": "BEET",
          "source": null,
          "slot": null,
          "role": null,
          "thematicRole": null,
          "lexeme": "bijt"
        }
      ]
    },
    {
      "id": "ken-uzelf",
      "title": "KEN UZELF",
      "phase": "Uiting · imperative-reflexive",
      "sentenceType": "main-declarative",
      "lexRule": "hoofdzininvariant",
      "sentence": "KEN UZELF",
      "sentenceHtml": "KEN UZELF",
      "subjectDefault": "U",
      "objectDefault": "UZELF",
      "predicate": "KEN",
      "utteranceType": "imperative-reflexive",
      "utteranceKernels": [
        {
          "id": "k1",
          "text": "Ken zelf.",
          "predicate": "kennen",
          "agens": "u",
          "patiens": "zelf"
        },
        {
          "id": "k2",
          "text": "Ken u.",
          "predicate": "kennen",
          "agens": "u",
          "patiens": "u"
        }
      ],
      "utteranceRelations": [
        {
          "type": "implicit-addressee",
          "referent": "u",
          "role": "agens"
        },
        {
          "type": "coreference",
          "members": [
            "k2.agens",
            "k2.patiens"
          ]
        },
        {
          "type": "reflexive-realization",
          "components": [
            "u",
            "zelf"
          ],
          "surface": "uzelf"
        },
        {
          "type": "mood",
          "value": "imperative"
        }
      ],
      "implicitSubject": "U",
      "lexItems": [
        {
          "id": "pred-ken",
          "label": "KEN",
          "source": "predicate",
          "slot": null,
          "role": "predicate",
          "thematicRole": null,
          "lexeme": "ken"
        },
        {
          "id": "object-uzelf",
          "label": "UZELF",
          "source": "object",
          "slot": null,
          "role": "object",
          "thematicRole": "patiens",
          "lexeme": "uzelf"
        }
      ]
    }
  ];

  let ALL_EXAMPLES = EXAMPLES.slice();

  const SENTENCE_TYPES = Object.freeze([
    Object.freeze({ id: 'main-declarative', label: 'Hoofdzin · mededelend', labelEn: 'Main clause · declarative', defaultExample: 'hond-bijt-man' }),
    Object.freeze({ id: 'polar-question', label: 'Vraagzin · ja/nee', labelEn: 'Question · yes/no', defaultExample: 'bijt-hond-man-vraag' }),
    Object.freeze({ id: 'subordinate-dat', label: 'Dat-zin · Comp DAT', labelEn: 'Dat-clause · Comp DAT', defaultExample: 'dat-hond-man-bijt' }),
    Object.freeze({ id: 'subordinate-omdat', label: 'Omdat-zin · Comp OMDAT', labelEn: 'Omdat-clause · Comp OMDAT', defaultExample: 'omdat-hond-man-bijt' })
  ]);

  function sentenceTypeForExample(example = state?.example) {
    const explicit = String(example?.sentenceType || '').trim();
    if (SENTENCE_TYPES.some(type => type.id === explicit)) return explicit;
    const rule = String(example?.lexRule || '');
    const first = String(example?.lexItems?.[0]?.label || '').trim().toUpperCase();
    if (rule === 'vraagzin-v1') return 'polar-question';
    if (rule === 'bijzin-dat' || first === 'DAT') return 'subordinate-dat';
    if (rule === 'bijzin-omdat' || first === 'OMDAT') return 'subordinate-omdat';
    return 'main-declarative';
  }

  const CENTER_MODES = [
    { id: 'syntax', label: 'Syntax' },
    { id: 'ft', label: 'Functional', labelEn: 'Functional' }
  ];

  const PROJECTION_OPTIONS = [
    { id: 'axes', label: 'Alle' },
    { id: 'source', label: 'Bron' },
    { id: 'lex', label: 'LEX' },
    { id: 'synt', label: 'SYNT' },
    { id: 'log', label: 'LOG' }
  ];
  const SOURCE_AXIS_IDS = ['lex', 'synt', 'log'];

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
    { id: 'max', label: 'MAX · groot letterbeeld / lage boom · standaard' },
    { id: 'auto', label: 'boomruimte: auto-fit breed/lager' },
    { id: 'compact', label: 'boomruimte: compact/klassiek' },
    { id: 'flat', label: 'boomruimte: platter / minder hoog' },
    { id: 'wide', label: 'boomruimte: breed/lager' },
    { id: 'large', label: 'boomruimte: breed + groter font' }
  ];

  const GRID_SIZE_OPTIONS = [
    { id: '60', label: '60% · fijn', labelEn: '60% · fine' },
    { id: '80', label: '80% · compact', labelEn: '80% · compact' },
    { id: '100', label: '100% · standaard', labelEn: '100% · default' },
    { id: '125', label: '125% · ruim', labelEn: '125% · spacious' },
    { id: '150', label: '150% · groot', labelEn: '150% · large' },
    { id: '200', label: '200% · extra groot', labelEn: '200% · extra large' }
  ];

  const KERNEL_BRANCH_SPACINGS = [
    { id: 'compact', label: 'compact · standaard', labelEn: 'compact · default', factor: 0.68 },
    { id: 'normal', label: 'normaal', labelEn: 'normal', factor: 1 },
    { id: 'wide', label: 'ruim', labelEn: 'spacious', factor: 1.34 }
  ];

  const KERNEL_BRANCH_FLIP_MODES = [
    { id: 'auto', label: 'auto · structuur', labelEn: 'auto · structure' },
    { id: 'flip', label: 'flip · spiegel links/rechts', labelEn: 'flip · mirror left/right' }
  ];

  const MULTI_OGN_FLIP_HOLD_MODES = [
    { id: 'flash', label: 'flash · 1,2 s', labelEn: 'flash · 1.2 s' },
    { id: 'long', label: 'houd vast · 3 s', labelEn: 'hold · 3 s' },
    { id: 'pause', label: 'pauzeer op Flip · standaard', labelEn: 'pause on Flip · default' }
  ];

  const VIEW_FIT_MODES = [
    { id: 'max', label: 'MAX · volledig venster benut · standaard' },
    { id: 'window', label: 'volledige boom zichtbaar · ruime rand' },
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

  const VIEWPORT_TEST_MODES = [
    { id: 'auto', label: 'Automatisch', labelEn: 'Automatic' },
    { id: 'desktop', label: 'Desktop', labelEn: 'Desktop' },
    { id: 'mobile-portrait', label: 'Mobiel staand', labelEn: 'Mobile portrait' },
    { id: 'mobile-landscape', label: 'Mobiel liggend', labelEn: 'Mobile landscape' }
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

  // Ontwerpvoorraad, bewust niet gekoppeld aan Config, opslag of rendering.
  // Het gebruik van vóór/na/tussen wordt pas na een aparte evaluatie actief.
  const DEFERRED_LEX_OPEN_SLOT_PLACEMENTS = Object.freeze(['before', 'after', 'between']);

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
    { id: 'above-selected-box', label: 'scopehost: geselecteerde box', labelEn: 'scope host: selected box', host: 'selected', tip: 'Secundaire scope-informatie. De LOG-afstand wordt uitsluitend door het gekozen LOG-interval bepaald.' },
    { id: 'above-s', label: 'scopehost: S', labelEn: 'scope host: S', host: 'S', tip: 'Zins-/propositiescope. Deze host bepaalt niet de LOG-afstand of de neutrale LEX-rij.' },
    { id: 'above-np', label: 'scopehost: NP', labelEn: 'scope host: NP', host: 'NP', tip: 'NP-/focusscope. De minorpositie wordt apart op de LOG-as gekozen.' },
    { id: 'above-vp', label: 'scopehost: VP', labelEn: 'scope host: VP', host: 'VP', tip: 'Gebeurtenis-/VP-scope. De LOG-minor maakt de afstand; de VP-subboom schuift niet.' },
    { id: 'above-v', label: 'scopehost: V', labelEn: 'scope host: V', host: 'V', tip: 'V-nabije scope. De LOG-minor maakt de afstand; de V-box schuift niet.' },
    { id: 'above-vcluster', label: 'scopehost: V-CLUSTER', labelEn: 'scope host: V-CLUSTER', host: 'V-CLUSTER', tip: 'Scope over het V-cluster, zonder plaatsing in het cluster. LOG bepaalt de neutrale LEX-rij.' },
    { id: 'above-pp', label: 'scopehost: PP', labelEn: 'scope host: PP', host: 'PP', tip: 'PP-gerelateerde scope. De LOG-minorpositie blijft afzonderlijk configureerbaar.' },
    { id: 'above-ap', label: 'scopehost: AP', labelEn: 'scope host: AP', host: 'AP', tip: 'AP-/graadscope. De LOG-minorpositie blijft afzonderlijk configureerbaar.' }
  ];

  const LEX_INSERTION_CONTENTS = [
    { id: 'empty', label: 'slot leeg', text: 'INSERTIEPUNT', sub: 'gereserveerd · andere LEX-as', subEn: 'reserved · other LEX axis', caption: 'vrij slot', captionEn: 'free slot', tip: 'Leeg insertiepunt: reserveert alleen plaats op de LEX-as.', tipEn: 'Empty insertion point: reserves LEX-axis space only.' },
    { id: 'misschien-wel', label: 'MISSCHIEN WEL', text: 'MISSCHIEN WEL', sub: 'bijwoordgroep · modaliteit', subEn: 'adverb phrase · modality', caption: 'bijwoordgroep', captionEn: 'adverb phrase', tip: 'MISSCHIEN WEL wordt als één beperkte modale bijwoordgroep en één LOG-minor behandeld.', tipEn: 'MISSCHIEN WEL is treated as one bounded modal adverb phrase and one LOG minor.' },
    { id: 'gisteren', label: 'GISTEREN', text: 'GISTEREN', sub: 'tijd · VP/S-slot', subEn: 'time · VP/S slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'GISTEREN: tijdsbepaling. Plaats boven S of VP; bij vooropplaatsing boven S.', tipEn: 'GISTEREN: time adverb. Place above S or VP; when fronted, above S.' },
    { id: 'op-dit-moment', label: 'OP DIT MOMENT', text: 'OP DIT MOMENT', sub: 'bijwoordelijke PP · tijd', subEn: 'adverbial PP · time', caption: 'bijwoordelijke bepaling', captionEn: 'adverbial', tip: 'OP DIT MOMENT is een temporele voorzetselgroep die als één LOG-minor wordt geplaatst.', tipEn: 'OP DIT MOMENT is a temporal prepositional phrase placed as one LOG minor.' },
    { id: 'morgen', label: 'MORGEN', text: 'MORGEN', sub: 'tijd · VP/S-slot', subEn: 'time · VP/S slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'MORGEN: tijdsbepaling. Plaats boven S of VP; bij vooropplaatsing is een LEX-verplaatsingsregel nodig.', tipEn: 'MORGEN: time adverb. Place above S or VP; fronting requires a LEX movement rule.' },
    { id: 'daar', label: 'DAAR', text: 'DAAR', sub: 'plaats · VP/PP-slot', subEn: 'place · VP/PP slot', caption: 'plaats-slot', captionEn: 'place slot', tip: 'DAAR: plaatsbepaling. Default boven VP; bij expliciete PP-structuur boven PP.', tipEn: 'DAAR: place adverb. Default above VP; above PP when an explicit PP structure is present.' },
    { id: 'daarom', label: 'DAAROM', text: 'DAAROM', sub: 'reden/oorzaak · S-slot', subEn: 'cause/reason · S slot', caption: 'reden-slot', captionEn: 'cause slot', tip: 'DAAROM: reden/oorzaak. Default boven S; gemarkeerd kan het boven VP staan.', tipEn: 'DAAROM: cause/reason. Default above S; marked placement may attach above VP.' },
    { id: 'anders', label: 'ANDERS', text: 'ANDERS', sub: 'voorwaarde/gevolg · S-slot', subEn: 'condition/result · S slot', caption: 'voorwaarde-slot', captionEn: 'condition slot', tip: 'ANDERS: voorwaarde/gevolg. Default boven S; gemarkeerd kan het lager geplaatst worden.', tipEn: 'ANDERS: condition/result. Default above S; marked placement may attach lower.' },
    { id: 'vaak', label: 'VAAK', text: 'VAAK', sub: 'frequentie · VP-slot', subEn: 'frequency · VP slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'VAAK: frequentie. Voorkeur: boven VP; bij V-nabije lezing boven V.', tipEn: 'VAAK: frequency. Preferred: above VP; for a V-near reading above V.' },
    { id: 'af-en-toe', label: 'AF EN TOE', text: 'AF EN TOE', sub: 'bijwoordgroep · frequentie', subEn: 'adverb phrase · frequency', caption: 'bijwoordgroep', captionEn: 'adverb phrase', tip: 'AF EN TOE wordt als één frequentiebepaling en één LOG-minor behandeld.', tipEn: 'AF EN TOE is treated as one frequency adverbial and one LOG minor.' },
    { id: 'soms', label: 'SOMS', text: 'SOMS', sub: 'frequentie · VP-slot', subEn: 'frequency · VP slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'SOMS: frequentie. Reserveer een VP-slot; hoger dan V-nabij, lager dan S-links.', tipEn: 'SOMS: frequency. Reserve a VP slot; higher than V-near, lower than S-left.' },
    { id: 'altijd', label: 'ALTIJD', text: 'ALTIJD', sub: 'frequentie · VP-slot', subEn: 'frequency · VP slot', caption: 'extern bijwoord', captionEn: 'external adverb', tip: 'ALTIJD: frequentie. Plaats bij voorkeur in het VP-domein; niet als NP/AP-intern slot.', tipEn: 'ALTIJD: frequency. Prefer the VP domain; not an NP/AP-internal slot.' },
    { id: 'niet', label: 'NIET', text: 'NIET', sub: 'negatie · V-nabij', subEn: 'negation · V-near', caption: 'NEG-slot', captionEn: 'NEG slot', tip: 'NIET: negatie. Plaats boven V als V-nabije negatie; eventueel boven VP bij bredere scope.', tipEn: 'NIET: negation. Place above V for V-near negation; optionally above VP for broader scope.' },
    { id: 'snel', label: 'SNEL', text: 'SNEL', sub: 'wijze · V-nabij', subEn: 'manner · V-near', caption: 'wijze-slot', captionEn: 'manner slot', tip: 'SNEL: wijze. Plaats dicht bij V/predicaat; in perfectum dicht bij het V-domein.', tipEn: 'SNEL: manner. Place close to V/predicate; in perfect constructions close to the V domain.' },
    { id: 'met-veel-aandacht', label: 'MET VEEL AANDACHT', text: 'MET VEEL AANDACHT', sub: 'bijwoordelijke PP · wijze', subEn: 'adverbial PP · manner', caption: 'bijwoordelijke bepaling', captionEn: 'adverbial', tip: 'MET VEEL AANDACHT is een wijze-PP die als één LOG-minor wordt geplaatst.', tipEn: 'MET VEEL AANDACHT is a manner PP placed as one LOG minor.' },
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

  const PROJECTION_COLOR_OPTIONS = [
    { id: 'blue', label: 'blauw', labelEn: 'blue', css: '#2563eb' },
    { id: 'green', label: 'groen', labelEn: 'green', css: '#16a34a' },
    { id: 'purple', label: 'paars', labelEn: 'purple', css: '#7c3aed' },
    { id: 'orange', label: 'oranje', labelEn: 'orange', css: '#f97316' },
    { id: 'teal', label: 'teal', labelEn: 'teal', css: '#0d9488' },
    { id: 'red', label: 'rood', labelEn: 'red', css: '#dc2626' },
    { id: 'slate', label: 'grijsblauw', labelEn: 'slate', css: '#475569' }
  ];

  function projectionColorCss(id, fallback = 'green') {
    return (PROJECTION_COLOR_OPTIONS.find(option => option.id === id)
      || PROJECTION_COLOR_OPTIONS.find(option => option.id === fallback)
      || PROJECTION_COLOR_OPTIONS[0]).css;
  }

  function gridColorCss(id = 'soft-slate') {
    return (GRID_COLOR_OPTIONS.find(option => option.id === id) || GRID_COLOR_OPTIONS[0]).css;
  }

  function validLineWeight(value, fallback = 'normal') {
    return Object.prototype.hasOwnProperty.call(LINE_WEIGHT_PROFILES, value) ? value : fallback;
  }

  function validPlacementMode(value = 'language-tree') {
    return PLACEMENT_MODES.some(mode => mode.id === value) ? value : 'language-tree';
  }

  function placementModeDefinition(value = state?.placementMode) {
    const id = validPlacementMode(value);
    return PLACEMENT_MODES.find(mode => mode.id === id) || PLACEMENT_MODES[0];
  }

  function directPlacementActive() {
    return placementModeDefinition().kind === 'direct';
  }

  function languageTreeActive() {
    return placementModeDefinition().id === 'language-tree';
  }

  function multiOgnAnaphorActive() {
    return placementModeDefinition().id === 'multi-ogn-anaphor';
  }

  const GRID_COLOR_OPTIONS = [
    { id: 'soft-slate', label: 'zacht grijsblauw', labelEn: 'soft slate', css: '#94a3b8' },
    { id: 'slate', label: 'grijsblauw', labelEn: 'slate', css: '#64748b' },
    { id: 'blue-grey', label: 'blauwgrijs', labelEn: 'blue grey', css: '#7891ad' },
    { id: 'neutral', label: 'neutraal grijs', labelEn: 'neutral grey', css: '#9ca3af' }
  ];

  const LINE_WEIGHT_OPTIONS = [
    { id: 'light', label: 'licht', labelEn: 'light' },
    { id: 'normal', label: 'normaal', labelEn: 'normal' },
    { id: 'strong', label: 'zwaar', labelEn: 'strong' }
  ];

  const LINE_WEIGHT_PROFILES = Object.freeze({
    light: Object.freeze({
      grid: 0.48, gridMajor: 0.68, gridOpacity: 0.24, gridMajorOpacity: 0.34,
      projection: 1.15, projectionAxis: 1.38, box: 0.48, tree: 1.45, treeOpacity: 0.7
    }),
    normal: Object.freeze({
      grid: 0.78, gridMajor: 1.05, gridOpacity: 0.38, gridMajorOpacity: 0.54,
      projection: 1.72, projectionAxis: 2.05, box: 0.78, tree: 2.45, treeOpacity: 0.88
    }),
    strong: Object.freeze({
      grid: 1.12, gridMajor: 1.48, gridOpacity: 0.58, gridMajorOpacity: 0.74,
      projection: 2.45, projectionAxis: 2.82, box: 1.16, tree: 3.55, treeOpacity: 1
    })
  });

  const PLACEMENT_MODES = Object.freeze([
    Object.freeze({ id: 'language-tree', label: 'Language Tree', labelEn: 'Language Tree', kind: 'calculated', primary: true }),
    Object.freeze({ id: 'multi-ogn-anaphor', label: 'Anafoor · multi-OGN', labelEn: 'Anaphor · multi-OGN', kind: 'calculated', composition: 'multi-ogn' }),
    Object.freeze({ id: 'greedy-grow', label: 'Greedy Grow', labelEn: 'Greedy Grow', kind: 'direct', strategy: 'compact-four-arm' }),
    Object.freeze({ id: 'random', label: 'Random', labelEn: 'Random', kind: 'direct', strategy: 'random' })
  ]);

  const MULTI_OGN_ANAPHOR_DEMO = Object.freeze({
    id: 'ik-zie-man-hij-draagt-hoed',
    title: 'Ik zie een man. Hij draagt een hoed.',
    descriptionNl: 'S1 en S2 worden afzonderlijk berekend en daarna als complete OGN-eenheden geordend.',
    descriptionEn: 'S1 and S2 are calculated independently and then ordered as complete OGN units.',
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
              Object.freeze({ id: 's1-zie', label: 'ZIE', cat: 'V', role: 'predicate', source: 's1-zie', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 's1-man', label: 'MAN', cat: 'N', role: 'object', source: 's1-man', kind: 'leaf', children: Object.freeze([]) })
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
        text: 'Hij draagt een hoed.',
        tree: Object.freeze({
          id: 's2-s', label: 'S', cat: 'S', kind: 'cat', children: Object.freeze([
            Object.freeze({ id: 's2-hij', label: 'HIJ', cat: 'PRON', role: 'subject', source: 's2-hij', kind: 'leaf', children: Object.freeze([]) }),
            Object.freeze({ id: 's2-vp', label: 'VP', cat: 'VP', kind: 'cat', children: Object.freeze([
              Object.freeze({ id: 's2-draagt', label: 'DRAAGT', cat: 'V', role: 'predicate', source: 's2-draagt', kind: 'leaf', children: Object.freeze([]) }),
              Object.freeze({ id: 's2-hoed', label: 'HOED', cat: 'N', role: 'object', source: 's2-hoed', kind: 'leaf', children: Object.freeze([]) })
            ]) })
          ])
        }),
        lex: Object.freeze([
          Object.freeze({ nodeId: 's2-hij', label: 'HIJ' }),
          Object.freeze({ nodeId: 's2-draagt', label: 'DRAAGT' }),
          Object.freeze({ nodeId: 's2-hoed', label: 'HOED' })
        ])
      })
    ]),
    relation: Object.freeze({
      type: 'coreference',
      direction: 'none',
      antecedentNodeId: 's1-man',
      anaphorNodeId: 's2-hij',
      antecedentLabel: 'MAN',
      anaphorLabel: 'HIJ'
    })
  });

  const DIRECT_TARGET_COUNT_OPTIONS = Object.freeze([
    Object.freeze({ id: '12', label: '12 knopen', labelEn: '12 nodes' }),
    Object.freeze({ id: '31', label: '31 knopen', labelEn: '31 nodes' }),
    Object.freeze({ id: '48', label: '48 knopen', labelEn: '48 nodes' }),
    Object.freeze({ id: '96', label: '96 knopen', labelEn: '96 nodes' })
  ]);
  const DIRECT_INTERVAL_OPTIONS = Object.freeze([
    Object.freeze({ id: '1200', label: 'Langzaam · 1,2 s', labelEn: 'Slow · 1.2 s' }),
    Object.freeze({ id: '650', label: 'Normaal · 0,65 s', labelEn: 'Normal · 0.65 s' }),
    Object.freeze({ id: '300', label: 'Snel · 0,3 s', labelEn: 'Fast · 0.3 s' }),
    Object.freeze({ id: '140', label: 'Zeer snel · 0,14 s', labelEn: 'Very fast · 0.14 s' })
  ]);
  const DIRECT_NODE_SIZE_OPTIONS = Object.freeze([
    Object.freeze({ id: 'small', label: 'Klein', labelEn: 'Small' }),
    Object.freeze({ id: 'normal', label: 'Normaal', labelEn: 'Normal' }),
    Object.freeze({ id: 'large', label: 'Groot', labelEn: 'Large' })
  ]);
  const DIRECT_GRID_MARGIN_OPTIONS = Object.freeze([
    Object.freeze({ id: 'compact', label: 'Compact · 1 cel', labelEn: 'Compact · 1 cell' }),
    Object.freeze({ id: 'normal', label: 'Normaal · 1,5 cel', labelEn: 'Normal · 1.5 cells' }),
    Object.freeze({ id: 'wide', label: 'Ruim · 3 cellen', labelEn: 'Wide · 3 cells' })
  ]);
  const GREEDY_STRATEGY_OPTIONS = Object.freeze([
    Object.freeze({ id: 'compact-four-arm', label: 'Compact · vierarmige referentie', labelEn: 'Compact · four-arm reference' }),
    Object.freeze({ id: 'near-center', label: 'Dicht bij centrum', labelEn: 'Near centre' }),
    Object.freeze({ id: 'ring', label: 'Ring voor ring', labelEn: 'Ring by ring' }),
    Object.freeze({ id: 'quadrant', label: 'Kwadranten spreiden', labelEn: 'Distribute quadrants' }),
    Object.freeze({ id: 'max-turn', label: 'Grootste draai eerst', labelEn: 'Largest turn first' })
  ]);
  const GREEDY_ORIENTATION_OPTIONS = Object.freeze([
    Object.freeze({ id: 'original', label: 'Origineel', labelEn: 'Original' }),
    Object.freeze({ id: 'right', label: '90° rechtsom', labelEn: '90° clockwise' }),
    Object.freeze({ id: 'half', label: '180°', labelEn: '180°' }),
    Object.freeze({ id: 'left', label: '90° linksom', labelEn: '90° counter-clockwise' })
  ]);
  const RANDOM_SEED_POLICY_OPTIONS = Object.freeze([
    Object.freeze({ id: 'advance', label: 'Nieuwe seed bij Reset', labelEn: 'New seed on Reset' }),
    Object.freeze({ id: 'fixed', label: 'Vaste seed herhalen', labelEn: 'Repeat fixed seed' })
  ]);
  const RANDOM_DISTRIBUTION_OPTIONS = Object.freeze([
    Object.freeze({ id: 'uniform-v1.0', label: 'Uniform v1.0', labelEn: 'Uniform v1.0' }),
    Object.freeze({ id: 'impure-repeat-v0.1', label: 'Onzuiver uniform v0.1 · hit-herhaling', labelEn: 'Impure uniform v0.1 · hit repetition' })
  ]);
  const RANDOM_SPREAD_OPTIONS = Object.freeze([
    Object.freeze({ id: 'available', label: 'Ergens in beschikbare ruimte', labelEn: 'Anywhere in available space' }),
    Object.freeze({ id: 'compact', label: 'Compact', labelEn: 'Compact' }),
    Object.freeze({ id: 'balanced', label: 'Gebalanceerd', labelEn: 'Balanced' }),
    Object.freeze({ id: 'wide', label: 'Ruim', labelEn: 'Wide' })
  ]);
  const RANDOM_MAX_DIMENSION_OPTIONS = Object.freeze([
    Object.freeze({ id: 'interface', label: 'Interface · beschikbare ruimte', labelEn: 'Interface · available space' }),
    Object.freeze({ id: 'fixed', label: 'Vast grid · kolommen × rijen', labelEn: 'Fixed grid · columns × rows' }),
    Object.freeze({ id: 'content', label: 'Inhoud · groeiend veld', labelEn: 'Content · growing field' })
  ]);
  const RANDOM_ITERATION_COUNT_OPTIONS = Object.freeze([
    Object.freeze({ id: '1', label: '1 iteratie', labelEn: '1 iteration' }),
    Object.freeze({ id: '3', label: '3 iteraties', labelEn: '3 iterations' }),
    Object.freeze({ id: '10', label: '10 iteraties', labelEn: '10 iterations' }),
    Object.freeze({ id: '25', label: '25 iteraties', labelEn: '25 iterations' }),
    Object.freeze({ id: '50', label: '50 iteraties', labelEn: '50 iterations' }),
    Object.freeze({ id: '100', label: '100 iteraties', labelEn: '100 iterations' })
  ]);
  const RANDOM_AXIS_IMAGE_MODE_OPTIONS = Object.freeze([
    Object.freeze({ id: 'off', label: 'Uit · geen iteratie-effect', labelEn: 'Off · no iteration effect' }),
    Object.freeze({ id: 'occupancy', label: 'Bezettingskans · telling ÷ iteraties', labelEn: 'Occupancy chance · count ÷ iterations' }),
    Object.freeze({ id: 'relative', label: 'Relatief patroon · telling ÷ hoogste telling', labelEn: 'Relative pattern · count ÷ highest count' })
  ]);
  const RANDOM_ITERATION_SEED_STEP = 0x9e3779b9;
  const DIRECT_NODE_RADIUS = Object.freeze({ small: 10, normal: 14, large: 18 });
  const DIRECT_GRID_MARGIN = Object.freeze({ compact: 1, normal: 1.5, wide: 3 });
  const DEFAULT_DIRECT_PLACEMENT_GENERAL = Object.freeze({
    targetCount: 31,
    intervalMs: 650,
    showPath: true,
    showNumbers: true,
    showMetrics: true,
    nodeSize: 'normal',
    gridMargin: 'normal'
  });
  const DEFAULT_GREEDY_GROW_CONFIG = Object.freeze({
    strategy: 'compact-four-arm',
    orientation: 'original'
  });
  const DEFAULT_RANDOM_PLACEMENT_CONFIG = Object.freeze({
    seed: 20260802,
    seedPolicy: 'advance',
    distribution: 'uniform-v1.0',
    spread: 'available',
    maxDimensions: 'interface',
    fixedColumns: 48,
    fixedRows: 48,
    iterationCount: 10,
    axisImageMode: 'occupancy'
  });

  function directOptionId(options, value, fallback) {
    const candidate = String(value ?? '');
    return options.some(option => option.id === candidate) ? candidate : fallback;
  }

  function directOptionLabel(options, value) {
    const option = options.find(item => item.id === String(value));
    if (!option) return String(value ?? '');
    return isEnglish() ? (option.labelEn || option.label) : option.label;
  }

  function normalizeDirectPlacementGeneral(value = {}) {
    return {
      targetCount: Number(directOptionId(DIRECT_TARGET_COUNT_OPTIONS, value.targetCount, String(DEFAULT_DIRECT_PLACEMENT_GENERAL.targetCount))),
      intervalMs: Number(directOptionId(DIRECT_INTERVAL_OPTIONS, value.intervalMs, String(DEFAULT_DIRECT_PLACEMENT_GENERAL.intervalMs))),
      showPath: typeof value.showPath === 'boolean' ? value.showPath : DEFAULT_DIRECT_PLACEMENT_GENERAL.showPath,
      showNumbers: typeof value.showNumbers === 'boolean' ? value.showNumbers : DEFAULT_DIRECT_PLACEMENT_GENERAL.showNumbers,
      showMetrics: typeof value.showMetrics === 'boolean' ? value.showMetrics : DEFAULT_DIRECT_PLACEMENT_GENERAL.showMetrics,
      nodeSize: directOptionId(DIRECT_NODE_SIZE_OPTIONS, value.nodeSize, DEFAULT_DIRECT_PLACEMENT_GENERAL.nodeSize),
      gridMargin: directOptionId(DIRECT_GRID_MARGIN_OPTIONS, value.gridMargin, DEFAULT_DIRECT_PLACEMENT_GENERAL.gridMargin)
    };
  }

  function normalizeGreedyGrowConfig(value = {}) {
    return {
      strategy: directOptionId(GREEDY_STRATEGY_OPTIONS, value.strategy, DEFAULT_GREEDY_GROW_CONFIG.strategy),
      orientation: directOptionId(GREEDY_ORIENTATION_OPTIONS, value.orientation, DEFAULT_GREEDY_GROW_CONFIG.orientation)
    };
  }

  function normalizeRandomPlacementConfig(value = {}) {
    const seedNumber = Number(value.seed);
    const seed = Number.isFinite(seedNumber)
      ? Math.max(1, Math.min(0xffffffff, Math.floor(seedNumber)))
      : DEFAULT_RANDOM_PLACEMENT_CONFIG.seed;
    const legacyAxisMode = value.showAxisPattern === false ? 'off' : DEFAULT_RANDOM_PLACEMENT_CONFIG.axisImageMode;
    return {
      seed,
      seedPolicy: directOptionId(RANDOM_SEED_POLICY_OPTIONS, value.seedPolicy, DEFAULT_RANDOM_PLACEMENT_CONFIG.seedPolicy),
      distribution: directOptionId(RANDOM_DISTRIBUTION_OPTIONS, value.distribution, DEFAULT_RANDOM_PLACEMENT_CONFIG.distribution),
      spread: directOptionId(RANDOM_SPREAD_OPTIONS, value.spread, DEFAULT_RANDOM_PLACEMENT_CONFIG.spread),
      maxDimensions: directOptionId(RANDOM_MAX_DIMENSION_OPTIONS, value.maxDimensions, DEFAULT_RANDOM_PLACEMENT_CONFIG.maxDimensions),
      fixedColumns: Math.max(1, Math.min(10000, Math.floor(Number(value.fixedColumns) || DEFAULT_RANDOM_PLACEMENT_CONFIG.fixedColumns))),
      fixedRows: Math.max(1, Math.min(10000, Math.floor(Number(value.fixedRows) || DEFAULT_RANDOM_PLACEMENT_CONFIG.fixedRows))),
      iterationCount: Number(directOptionId(
        RANDOM_ITERATION_COUNT_OPTIONS,
        value.iterationCount ?? value.repeatCount,
        String(DEFAULT_RANDOM_PLACEMENT_CONFIG.iterationCount)
      )),
      axisImageMode: directOptionId(RANDOM_AXIS_IMAGE_MODE_OPTIONS, value.axisImageMode, legacyAxisMode)
    };
  }

  const TOP_MENU_CHOICES = [
    { id: 'projection', label: 'Projecties', cssClass: 'top-menu-projection', tip: 'Projecties: Alle, Bron, LEX, SYNT en LOG. Nuttig voor vergelijken van named projections.' },
    { id: 'sentence', label: 'Voorbeeldzin', cssClass: 'top-menu-sentence', tip: 'Voorbeeldzin: kies snel HOND BIJT MAN en varianten. Nuttig voor contrast tussen zinnen.' },
    { id: 'play', label: 'Play/Groei', cssClass: 'top-menu-play', tip: 'Play/Groei: stap voor stap boom, LEX-as en projecties tonen. Nuttig voor didactische uitleg.' },
    { id: 'tools', label: 'Werkknoppen', cssClass: 'top-menu-tools', tip: 'Werkknoppen: FIT, reset, OPN, Legacy JSON, Docs en editors. Nuttig bij bouwen en testen.' }
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

  function resolveLogicalInsertionBoundary(order = [], interval = {}) {
    const roles = (order || []).map(value => String(value || '').trim().toUpperCase()).filter(Boolean);
    const after = String(interval?.after || '').trim().toUpperCase();
    const before = String(interval?.before || '').trim().toUpperCase();
    if (after === 'START') return { index: 0, after, before, adjacent: before === roles[0] };
    if (before === 'END') return { index: roles.length, after, before, adjacent: after === roles[roles.length - 1] };
    const afterIndex = roles.indexOf(after);
    const beforeIndex = roles.indexOf(before);
    if (afterIndex >= 0 && beforeIndex === afterIndex + 1) {
      return { index: beforeIndex, after, before, adjacent: true };
    }
    if (afterIndex >= 0) {
      return { index: afterIndex + 1, after, before, adjacent: false };
    }
    if (beforeIndex >= 0) {
      return { index: beforeIndex, after, before, adjacent: false };
    }
    return { index: Math.min(1, roles.length), after, before, adjacent: false };
  }

  function buildLogicalSlotSequence(majorItems = [], insertions = [], intervals = [], options = {}) {
    const majors = (majorItems || []).map(item => typeof item === 'string'
      ? { kind: 'major', short: String(item).toUpperCase(), id: String(item).toUpperCase() }
      : { ...item, kind: 'major', short: String(item.short || item.id || '').toUpperCase() });
    const order = majors.map(item => item.short);
    const intervalMap = new Map((intervals || []).map(interval => [String(interval.id || ''), interval]));
    const defaultMinorWidth = Math.max(1, Number(options.minorWidth) || 1);
    const byBoundary = new Map();
    (insertions || []).forEach((item, index) => {
      const intervalId = String(item.logInterval || item.interval || options.defaultInterval || '');
      const interval = item.intervalDef || intervalMap.get(intervalId) || {
        id: intervalId || 'auto',
        after: item.logAfter || item.after || order[0] || 'START',
        before: item.logBefore || item.before || order[1] || 'END'
      };
      const boundary = resolveLogicalInsertionBoundary(order, interval);
      if (!byBoundary.has(boundary.index)) byBoundary.set(boundary.index, []);
      byBoundary.get(boundary.index).push({
        ...item,
        kind: 'minor',
        interval: interval.id || intervalId || 'auto',
        intervalDef: interval,
        boundary,
        minorIndex: index + 1,
        width: Math.max(1, Number(item.width) || defaultMinorWidth)
      });
    });
    byBoundary.forEach(items => items.sort((a, b) => {
      const byOrder = (Number(a.order) || 0) - (Number(b.order) || 0);
      return byOrder || a.minorIndex - b.minorIndex;
    }));
    const sequence = [];
    let slot = 0;
    const append = item => {
      sequence.push({ ...item, logicalSlot: slot });
      slot += Math.max(1, Number(item.width) || 1);
    };
    for (let boundaryIndex = 0; boundaryIndex <= majors.length; boundaryIndex += 1) {
      (byBoundary.get(boundaryIndex) || []).forEach(append);
      if (boundaryIndex < majors.length) append(majors[boundaryIndex]);
    }
    return sequence;
  }

  function logicalSlotDistance(sequence = [], firstRole = 'S', secondRole = 'O') {
    const first = (sequence || []).find(item => item.kind === 'major' && item.short === firstRole);
    const second = (sequence || []).find(item => item.kind === 'major' && item.short === secondRole);
    if (!first || !second) return null;
    return Math.abs(Number(second.logicalSlot) - Number(first.logicalSlot));
  }



  const NO_ADVERB_OPTION = { id: 'none', label: 'Geen bijwoord', labelEn: 'No adverb', title: 'Geen bijwoord', adverb: null };
  const ADVERB_FALLBACK_ROWS = [
    ['adv-modal-waarschijnlijk-s', 'WAARSCHIJNLIJK BIJT HOND MAN', 'MODALITEIT', 'S', 'S', 'functional:fronted-v2'],
    ['adv-modal-waarschijnlijk-v', 'HOND BIJT WAARSCHIJNLIJK MAN', 'MODALITEIT', 'S', 'V', 'functional:marked-host'],
    ['adv-modal-misschien-s', 'MISSCHIEN BIJT HOND MAN', 'MODALITEIT', 'S', 'S', 'functional:fronted-v2'],
    ['adv-modal-misschien-wel-vcluster', 'DE HOND HEEFT DE MAN MISSCHIEN WEL GEBETEN', 'MODALITEIT', 'V-CLUSTER', 'V-CLUSTER', 'functional:modal-group-default', 'MISSCHIEN WEL'],
    ['adv-time-gisteren-s', 'GISTEREN BEET HOND MAN', 'TIJD', 'VP', 'S', 'functional:fronted-v2'],
    ['adv-time-gisteren-vp', 'HOND BEET GISTEREN MAN', 'TIJD', 'VP', 'VP', 'functional:time-default'],
    ['adv-time-op-dit-moment-vp', 'DE HOND BIJT OP DIT MOMENT DE MAN', 'TIJD', 'VP', 'VP', 'functional:time-phrase-default', 'OP DIT MOMENT'],
    ['adv-freq-vaak-vp', 'HOND BIJT VAAK MAN', 'FREQUENTIE', 'VP', 'VP', 'functional:default-host'],
    ['adv-freq-vaak-s', 'VAAK BIJT HOND MAN', 'FREQUENTIE', 'VP', 'S', 'functional:fronted-v2'],
    ['adv-freq-af-en-toe-vcluster', 'DE HOND HEEFT DE MAN AF EN TOE GEBETEN', 'FREQUENTIE', 'V-CLUSTER', 'V-CLUSTER', 'functional:frequency-group-default', 'AF EN TOE'],
    ['adv-place-daar-vp', 'HOND BIJT DAAR MAN', 'PLAATS', 'VP', 'VP', 'functional:default-host'],
    ['adv-place-daar-s', 'DAAR BIJT HOND MAN', 'PLAATS', 'VP', 'S', 'functional:fronted-v2'],
    ['adv-neg-niet-vp', 'HOND BIJT MAN NIET', 'NEGATIE', 'VP', 'VP', 'functional:neg-scope-default'],
    ['adv-neg-niet-np', 'HOND BIJT NIET MAN MAAR VROUW', 'NEGATIE', 'VP', 'NP', 'functional:scope-marked'],
    ['adv-degree-heel-ap', 'HOND IS HEEL MOOI', 'GRAAD', 'AP', 'AP', 'functional:degree-default'],
    ['adv-degree-heel-advmod', 'VROUW BREIT HEEL HARD TRUI', 'GRAAD', 'AP', 'AP', 'functional:degree-advmod-needed'],
    ['adv-manner-hard-vcluster', 'VROUW HEEFT TRUI HARD GEBREID', 'WIJZE', 'VP', 'V-CLUSTER', 'functional:manner-default'],
    ['adv-manner-hard-s', 'HARD BREIT VROUW TRUI', 'WIJZE', 'VP', 'S', 'functional:fronted-v2-marked'],
    ['adv-manner-met-veel-aandacht-vcluster', 'VROUW HEEFT TRUI MET VEEL AANDACHT GEBREID', 'WIJZE', 'V-CLUSTER', 'V-CLUSTER', 'functional:manner-phrase-default', 'MET VEEL AANDACHT'],
    ['adv-cause-daarom-s', 'DAAROM BIJT HOND MAN', 'REDEN_OORZAAK', 'S', 'S', 'functional:fronted-v2'],
    ['adv-cause-daardoor-vp', 'HOND BIJT DAARDOOR MAN', 'REDEN_OORZAAK', 'VP', 'VP', 'functional:cause-default'],
    ['adv-cond-anders-s', 'ANDERS BIJT HOND MAN', 'VOORWAARDE_GEVOLG', 'S', 'S', 'functional:fronted-v2'],
    ['adv-cond-anders-vp', 'HOND BIJT ANDERS', 'VOORWAARDE_GEVOLG', 'S', 'VP', 'functional:reclassified-manner'],
    ['adv-focus-alleen-np', 'ALLEEN HOND BIJT MAN', 'FOCUSPARTIKEL', 'FOCUS_TARGET', 'NP', 'functional:focus-default'],
    ['adv-focus-ook-np', 'OOK HOND BIJT MAN', 'FOCUSPARTIKEL', 'FOCUS_TARGET', 'NP', 'functional:focus-default']
  ];
  let ADVERB_OPTIONS = [NO_ADVERB_OPTION];

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
      logConfig: {
        authority: 'LOG',
        positionUnit: 'slot',
        majorGap: 1,
        minorWidth: 1,
        expandsMajorGap: true,
        axisSlotPixels: 176,
        lexSlotPixels: 64,
        lexPositionSource: 'LOG',
        lexProjectionOrigin: 'SOURCE-Y',
        lexPlacementMode: 'horizontal-then-move',
        exampleControlsLayout: false,
        playPhases: ['LOG', 'LEX'],
        playSpaceMode: 'none',
        majors: [
          { id: 'S', label: 'Subject', source: 'subject', sources: ['subject'], role: 'subject' },
          { id: 'O', label: 'Object', source: 'object', sources: ['object'], role: 'object' },
          { id: 'V', label: 'Verb', source: 'predicate', sources: ['predicate', 'pv', 'vdw'], role: 'predicate' }
        ],
        intervals: [
          { id: 'before-S', label: 'vóór S', after: 'START', before: 'S' },
          { id: 'S-O', label: 'na S · vóór O', after: 'S', before: 'O' },
          { id: 'O-V', label: 'na O · vóór V', after: 'O', before: 'V' },
          { id: 'after-V', label: 'na V', after: 'V', before: 'END' }
        ],
        classIntervals: {
          DEFAULT: 'S-O',
          MODALITEIT: 'S-O',
          SCHAKEERPARTIKEL: 'S-O',
          FOCUSPARTIKEL: 'S-O',
          TIJD: 'O-V',
          FREQUENTIE: 'O-V',
          PLAATS: 'O-V',
          NEGATIE: 'O-V',
          NEG_FREQ: 'O-V',
          NEG_PLACE: 'O-V',
          GRAAD: 'O-V',
          WIJZE: 'O-V',
          REDEN_OORZAAK: 'before-S',
          VOORWAARDE_GEVOLG: 'before-S'
        }
      },
      loaded: false
    };
  }

  let STRUCTURE_CONFIG = baseStructureConfig();

  const LEXICON_USAGE_PROFILES = new Map();
  const LEXICON_CONSTRUCTIONS = new Map();
  const LEX_ANALYSIS_STORAGE_KEY = 'opengraph_lex_analysis_choices_v2.0.0-rc.45';

  function normalizeInsertionOrigin(value) {
    const origin = String(value || 'LOG').trim().toUpperCase().replace('MIXED', 'LOG+LEX');
    return ['LOG', 'LEX', 'LOG+LEX'].includes(origin) ? origin : 'LOG';
  }

  function wordsFromData(value) {
    if (Array.isArray(value)) return value.map(item => String(item || '').trim()).filter(Boolean);
    return String(value || '').split(/\s+/).map(item => item.trim()).filter(Boolean);
  }

  function seedLexiconUsageFallbacks() {
    const addLemma = (id, lemma, profiles) => {
      const record = { id, lemma, profiles };
      LEXICON_USAGE_PROFILES.set(id, record);
      LEXICON_USAGE_PROFILES.set(lemma, record);
    };
    addLemma('misschien', 'misschien', [
      { id:'modal-proposition', origin:'LOG', function:'modaliteit', scope:'propositie', interval:'S-O', effects:['origin','scope','log-projection'], recommended:true, label:'modale propositie-operator' },
      { id:'discourse-hedge', origin:'LEX', function:'discourse-hedge', scope:'uiting', interval:'before-S', effects:['origin','scope'], recommended:false, label:'discourse-hedge' }
    ]);
    addLemma('wel', 'wel', [
      { id:'particle-local', origin:'LEX', function:'schakeringspartikel', scope:'lokale-groep', interval:'S-O', effects:['origin','grouping'], recommended:true, label:'lokaal partikel' },
      { id:'polarity-operator', origin:'LOG', function:'polariteit', scope:'propositie', interval:'O-V', effects:['origin','scope','log-projection'], recommended:false, label:'polariteitsoperator' },
      { id:'focus-particle', origin:'LEX', function:'focus', scope:'focus-target', interval:'S-O', effects:['scope','grouping'], recommended:false, label:'focuspartikel' }
    ]);
    addLemma('vaak', 'vaak', [
      { id:'frequency-event', origin:'LOG', function:'frequentie', scope:'gebeurtenis', interval:'O-V', effects:['scope','log-projection'], recommended:true, label:'gebeurtenisfrequentie' }
    ]);
    LEXICON_CONSTRUCTIONS.set('misschien-wel', {
      id:'misschien-wel', members:['misschien','wel'], visibleSlots:1, defaultProfile:'mixed-modal-particle',
      profiles:[
        { id:'mixed-modal-particle', origin:'LOG+LEX', components:'misschien:LOG wel:LEX', function:'modale-groep', scope:'propositie', interval:'S-O', effects:['origin','log-projection','components'], recommended:true, label:'misschien=LOG, wel=LEX' },
        { id:'group-modal-log', origin:'LOG', components:'misschien:LOG wel:LOG', function:'modale-operator', scope:'propositie', interval:'S-O', effects:['origin','log-projection','components'], recommended:false, label:'hele groep als LOG-operator' },
        { id:'group-lexical-particle', origin:'LEX', components:'misschien:LEX wel:LEX', function:'lexicale-schakeringsgroep', scope:'lokale-groep', interval:'S-O', effects:['origin','scope','components'], recommended:false, label:'hele groep direct in LEX' }
      ]
    });
  }

  function loadLexAnalysisChoices() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LEX_ANALYSIS_STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (_err) { return {}; }
  }

  function saveLexAnalysisChoices() {
    try { localStorage.setItem(LEX_ANALYSIS_STORAGE_KEY, JSON.stringify(state.lexAnalysisChoices || {})); } catch (_err) {}
  }

  const state = {
    example: EXAMPLES[0],
    preconfig: { insertion: { ...DEFAULT_INSERTION_AXES } },
    features: { ...DEFAULT_FEATURES },
    language: (function(){ try { return normalizeLanguage(localStorage.getItem('opengraph_language')); } catch (_err) { return DEFAULT_LANGUAGE; } })(),
    projection: 'axes',
    sourceAxes: (function(){
      try {
        const raw = localStorage.getItem('opengraph_source_axes_v200rc9');
        const parsed = raw ? JSON.parse(raw) : SOURCE_AXIS_IDS;
        return Array.isArray(parsed)
          ? SOURCE_AXIS_IDS.filter(id => parsed.includes(id))
          : SOURCE_AXIS_IDS.slice();
      } catch (_err) { return SOURCE_AXIS_IDS.slice(); }
    })(),
    projectionBlockUnlocked: false,
    projectionBoxDraggable: (function(){ try { return localStorage.getItem('opengraph_projection_box_draggable') !== '0'; } catch (_err) { return true; } })(),
    projectionBoxManual: (function(){ try { const raw = localStorage.getItem('opengraph_projection_box_manual_v1014'); return raw ? JSON.parse(raw) : null; } catch (_err) { return null; } })(),
    projectionBoxDrag: null,
    lexProjectionColor: (function(){ try { return localStorage.getItem('opengraph_projection_color_lex') || 'blue'; } catch (_err) { return 'blue'; } })(),
    syntProjectionColor: (function(){ try { return localStorage.getItem('opengraph_projection_color_synt') || 'green'; } catch (_err) { return 'green'; } })(),
    logProjectionColor: (function(){ try { return localStorage.getItem('opengraph_projection_color_log') || 'purple'; } catch (_err) { return 'purple'; } })(),
    gridColor: (function(){ try { return localStorage.getItem('opengraph_grid_color') || 'soft-slate'; } catch (_err) { return 'soft-slate'; } })(),
    gridLineWeight: (function(){ try { return localStorage.getItem('opengraph_grid_line_weight') || 'normal'; } catch (_err) { return 'normal'; } })(),
    gridSizeHorizontal: (function(){ try { return localStorage.getItem('opengraph_grid_size_horizontal') || '100'; } catch (_err) { return '100'; } })(),
    gridSizeVertical: (function(){ try { return localStorage.getItem('opengraph_grid_size_vertical') || '100'; } catch (_err) { return '100'; } })(),
    treeLineColor: (function(){ try { return localStorage.getItem('opengraph_tree_line_color') || 'blue'; } catch (_err) { return 'blue'; } })(),
    treeLineWeight: (function(){ try { return localStorage.getItem('opengraph_tree_line_weight') || 'strong'; } catch (_err) { return 'strong'; } })(),
    kernelBranchHorizontal: (function(){ try { return localStorage.getItem('opengraph_kernel_branch_horizontal') || 'compact'; } catch (_err) { return 'compact'; } })(),
    kernelBranchVertical: (function(){ try { return localStorage.getItem('opengraph_kernel_branch_vertical') || 'compact'; } catch (_err) { return 'compact'; } })(),
    kernelBranchFlip: (function(){ try { return localStorage.getItem('opengraph_kernel_branch_flip') || 'auto'; } catch (_err) { return 'auto'; } })(),
    multiOgnFlipHold: (function(){ try { return localStorage.getItem('opengraph_multi_ogn_flip_hold') || 'pause'; } catch (_err) { return 'pause'; } })(),
    causalAnaphorVariant: (function(){ try { return localStorage.getItem('opengraph_causal_anaphor_variant') || 'die'; } catch (_err) { return 'die'; } })(),
    causalVerbVariant: (function(){ try { return localStorage.getItem('opengraph_causal_verb_variant') || ''; } catch (_err) { return ''; } })(),
    botVariant: (function(){ try { return localStorage.getItem('opengraph_bot_variant') || 'het-bot'; } catch (_err) { return 'het-bot'; } })(),
    projectionLineWeight: (function(){ try { return localStorage.getItem('opengraph_projection_line_weight') || 'normal'; } catch (_err) { return 'normal'; } })(),
    boxLineWeight: (function(){ try { return localStorage.getItem('opengraph_box_line_weight') || 'normal'; } catch (_err) { return 'normal'; } })(),
    placementMode: 'language-tree',
    multiOgnExampleId: 'ik-zie-man-hij-draagt-hoed',
    multiOgnPlayEnabled: false,
    multiOgnPlayStep: 5,
    multiOgnPlayTimer: null,
    directPlacementGeneral: { ...DEFAULT_DIRECT_PLACEMENT_GENERAL },
    greedyGrowConfig: { ...DEFAULT_GREEDY_GROW_CONFIG },
    randomPlacementConfig: { ...DEFAULT_RANDOM_PLACEMENT_CONFIG },
    directPlacementState: null,
    directPlacementSeed: 20260802,
    directPlacementIterationBaseSeed: 20260802,
    directPlacementIterationIndex: 0,
    directPlacementTimer: null,
    centerMode: 'syntax',
    treeChoice: 'auto-min',
    functionalOrder: 'left-first',
    branchOrder: 'normal',
    branchOverrides: { top: 'auto', middle: 'auto', other: 'auto' },
    layoutDensity: 'max',
    viewFitMode: 'max',
    selectedNodeId: null,
    showGrid: true,
    showRelations: true,
    showLabels: true,
    roleSwap: false,
    growthEnabled: false,
    growthStep: 0,
    southLogicalMode: 'SOV',
    southBoxDraggable: (function(){ try { return localStorage.getItem('opengraph_south_box_draggable') !== '0'; } catch (_err) { return true; } })(),
    southBoxManual: (function(){ try { const raw = localStorage.getItem('opengraph_south_box_manual_v4578'); return raw ? JSON.parse(raw) : null; } catch (_err) { return null; } })(),
    southBoxDrag: null,
    southBoxClickSuppressed: false,
    freeSlotCount: 2,
    lexFreeSlotCount: 0,
    lexFreeSlotPlacement: 'above-vp',
    lexInsertionContent: 'empty',
    logInsertionInterval: 'auto',
    selectedAdverbId: 'none',
    useExampleLexInsertions: false,
    lexAnalysisChoices: loadLexAnalysisChoices(),
    lexInsertionExtensionTargets: ['vp-boundary'],
    readmeCarousels: {},
    readmeTopicEdits: {},
    portraitMenuSlots: 0,
    topMenusAbove: [],
    lastSupportedGrowthStep: 0,
    growthTimer: null,
    exampleValidationMessages: [],
    maximumContentFit: null,
    manualViewBox: null,
    viewDrag: null,
    viewClickSuppressed: false,
    activePointers: new Map(),
    pinchGesture: null,
    mobileSheetOpen: false,
    paneSplitManual: false,
    rightMenuWidth: null,
    viewportMode: initialViewportMode(),
    helpLayoutMode: (function(){ try { const value = localStorage.getItem('opengraph_help_layout_mode'); return ['auto','stacked','side'].includes(value) ? value : 'auto'; } catch (_err) { return 'auto'; } })(),
    paneSplitDrag: null,
    canvasPanEnabled: true,
    documentMetadata: null,
    paradataEvents: [],
    paradataSessionId: (globalThis.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`),
    paradataStartedAt: new Date().toISOString()
  };

  function insertionAxisEnabled(axisId) {
    return state.preconfig?.insertion?.[axisId] === true;
  }

  function enabledInsertionAxes() {
    return Object.keys(INSERTION_AXIS_DEFINITIONS).filter(insertionAxisEnabled);
  }

  function insertionPreconfigSnapshot() {
    return {
      insertion: Object.fromEntries(
        Object.keys(INSERTION_AXIS_DEFINITIONS).map(axisId => [axisId, insertionAxisEnabled(axisId)])
      )
    };
  }

  function featureInsertionAxes(featureId) {
    const axes = FEATURE_DEFINITIONS[featureId]?.insertionAxes;
    return Array.isArray(axes) ? axes : [];
  }

  function featureRequirementsMet(featureId) {
    return featureInsertionAxes(featureId).every(insertionAxisEnabled);
  }

  function featureEnabled(featureId) {
    return state.features?.[featureId] === true && featureRequirementsMet(featureId);
  }

  function activeLexRenderLeftReach() {
    const fontScale = layoutVisualProfile().fontScale;
    const traceWords = activeLexItems()
      .filter(item => item?.source)
      .map(item => String(item.label || item.role || item.source || 'LEX').toUpperCase());
    for (const spec of activeLexInsertionSpecs()) {
      const content = spec?.content || insertionContentForSpec(spec);
      const word = String(content?.text || content?.label || '').trim().toUpperCase();
      if (word) traceWords.push(word);
    }
    const traceReach = traceWords.reduce(
      (maximum, word) => Math.max(maximum, 14 + measuredTextWidth(`t[${word}]`, 12 * fontScale, 850)),
      0
    );
    // Indexlabels staan op -76; een Comp-slot kan tot -86 reiken.
    let reach = Math.max(LEX_RENDER_LEFT_REACH, 90, Math.ceil(traceReach));
    for (const feature of Object.values(FEATURE_DEFINITIONS)) {
      if (!featureEnabled(feature.id)) continue;
      const demand = feature.layoutDemand?.lexContent;
      reach = Math.max(reach, Number(LEX_CONTENT_REACH[demand] || LEX_RENDER_LEFT_REACH));
    }
    return reach;
  }

  function lexMovementLaneRightReach(lane = 0) {
    const safeLane = Math.max(0, Number(lane) || 0) % 4;
    const sideReach = LEX_MOVEMENT_LANE_START + safeLane * LEX_MOVEMENT_LANE_STEP;
    const curveReach = sideReach + LEX_MOVEMENT_CURVE_REACH;
    const arrowReach = sideReach + 9;
    const label = `LEX ${safeLane + 1}`;
    const labelReach = sideReach
      + LEX_MOVEMENT_LABEL_OFFSET
      + measuredTextWidth(label, 10 * layoutVisualProfile().fontScale, 900) / 2;
    return Math.max(curveReach, arrowReach, labelReach) + 2;
  }

  function activeLexRenderRightReach() {
    const items = activeLexItems();
    // Gewone woordsloten reiken 62 eenheden rechts van de as. Comp en de
    // systeemslots zijn breder; externe inserties zijn met 122 het breedst.
    let reach = 62;
    if (hasCompItem(items)) reach = Math.max(reach, 86);
    if (showTopicSlot(items) || showV2Slot(items)) reach = Math.max(reach, 98);
    if (activeLexInsertionSpecs().length) reach = Math.max(reach, 122);

    const movementCount = Math.min(4, orderedLexMovements(items).length);
    for (let lane = 0; lane < movementCount; lane += 1) {
      reach = Math.max(reach, lexMovementLaneRightReach(lane));
    }
    // Een vooropgeplaatst extern bijwoord kan zelf een baan 0 tekenen.
    if (activeAdverbIsFronted() && activeLexInsertionSpecs().length) {
      reach = Math.max(reach, lexMovementLaneRightReach(0));
    }
    return Math.min(LEX_RENDER_RIGHT_REACH, Math.ceil(reach));
  }

  function exampleRequiresAdverbs(example = {}) {
    return !!example?.adverb?.word
      || (Array.isArray(example?.lexInsertions) && example.lexInsertions.length > 0);
  }

  function refreshExamplesForFeatures(preferredId = state.example?.id) {
    const available = featureEnabled('adverbs')
      ? ALL_EXAMPLES
      : ALL_EXAMPLES.filter(example => !exampleRequiresAdverbs(example));
    EXAMPLES = available.length ? available : ALL_EXAMPLES.slice(0, 1);
    state.example = EXAMPLES.find(example => example.id === preferredId) || EXAMPLES[0];
  }

  function resetAdverbFeatureState() {
    state.selectedAdverbId = 'none';
    state.useExampleLexInsertions = false;
    state.lexFreeSlotCount = 0;
    state.lexInsertionContent = 'empty';
    state.lexFreeSlotPlacement = 'above-vp';
    state.logInsertionInterval = 'auto';
    state.lexAnalysisChoices = {};
    state.documentMetadata = null;
    ADVERB_OPTIONS = [NO_ADVERB_OPTION];
    LEXICON_USAGE_PROFILES.clear();
    LEXICON_CONSTRUCTIONS.clear();
    ['adverbs', 'lexical-profiles', 'adverb-origins'].forEach(topicId => {
      if (state.readmeCarousels) delete state.readmeCarousels[topicId];
      if (state.readmeTopicEdits) delete state.readmeTopicEdits[topicId];
    });
    try { localStorage.removeItem(LEX_ANALYSIS_STORAGE_KEY); } catch (_err) {}
    const ambiguityPanel = document.getElementById('lexAmbiguityPanel');
    if (ambiguityPanel) ambiguityPanel.classList.add('hidden');
  }

  function syncFeatureDocumentationLinks() {
    const profile = featureEnabled('adverbs') ? 'extras' : 'base';
    document.querySelectorAll('a[href*="docs/docs-home.html"]').forEach(link => {
      link.href = `docs/docs-home.html?ogv=${encodeURIComponent(VERSION)}&profile=${profile}`;
    });
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute('href') || '';
      const path = raw.split('?')[0];
      if (!/(?:^|\/)(?:examples-input|examples-editor|lexicon-config|lexicon-editor|structure-config|structure-editor)\.html$/i.test(path)) return;
      link.href = `${path}?ogv=${encodeURIComponent(VERSION)}&profile=${profile}`;
    });
  }

  function syncPreconfigControls() {
    const enabledAxes = enabledInsertionAxes();
    Object.keys(INSERTION_AXIS_DEFINITIONS).forEach(axisId => {
      const input = document.getElementById(`insertionAxis${axisId.toUpperCase()}Input`);
      if (input) input.checked = insertionAxisEnabled(axisId);
      document.body.classList.toggle(`insertion-${axisId}-on`, insertionAxisEnabled(axisId));
      document.body.classList.toggle(`insertion-${axisId}-off`, !insertionAxisEnabled(axisId));
    });
    const status = document.getElementById('preconfigInsertionStatus');
    if (status) {
      const list = enabledAxes.map(axisId => INSERTION_AXIS_DEFINITIONS[axisId].label).join(' + ');
      status.textContent = list
        ? (isEnglish() ? `Insertion enabled on: ${list}.` : `Insertie ingeschakeld op: ${list}.`)
        : (isEnglish() ? 'Insertion disabled on every axis.' : 'Insertie staat op alle assen uit.');
    }
    const presetButton = document.getElementById('insertionLexLogPresetButton');
    if (presetButton) presetButton.disabled = insertionAxisEnabled('lex') && insertionAxisEnabled('log');
    const allOffButton = document.getElementById('insertionAllOffButton');
    if (allOffButton) allOffButton.disabled = enabledAxes.length === 0;
  }

  function applyFeatureVisibility() {
    const adverbsEnabled = featureEnabled('adverbs');
    syncPreconfigControls();
    document.body.classList.toggle('feature-adverbs-on', adverbsEnabled);
    document.body.classList.toggle('feature-adverbs-off', !adverbsEnabled);
    renderReadmeTopicEdits();
    document.querySelectorAll('[data-feature="adverbs"]').forEach(node => {
      node.hidden = !adverbsEnabled;
      node.setAttribute('aria-hidden', String(!adverbsEnabled));
    });
    document.querySelectorAll('[data-feature-absent="adverbs"]').forEach(node => {
      node.hidden = adverbsEnabled;
      node.setAttribute('aria-hidden', String(adverbsEnabled));
    });
    const featureInput = document.getElementById('featureAdverbsInput');
    const adverbRequirementsMet = featureRequirementsMet('adverbs');
    if (featureInput) {
      featureInput.checked = adverbsEnabled;
      featureInput.disabled = !adverbRequirementsMet;
    }
    const featureChoice = featureInput?.closest('.feature-extra-choice');
    if (featureChoice) featureChoice.classList.toggle('requirements-missing', !adverbRequirementsMet);
    const requirementStatus = document.getElementById('featureAdverbsRequirementStatus');
    if (requirementStatus) {
      requirementStatus.textContent = adverbRequirementsMet
        ? (isEnglish() ? 'Pre-config ready: LEX + LOG insertion.' : 'Voorconfig gereed: insertie LEX + LOG.')
        : (isEnglish() ? 'First enable insertion on LEX and LOG in Pre-config.' : 'Schakel eerst insertie op LEX en LOG in bij Voorconfig.');
    }
    const status = document.getElementById('featureProfileStatus');
    if (status) {
      status.textContent = adverbsEnabled
        ? (isEnglish() ? 'Custom profile · Adverbs enabled' : 'Eigen profiel · Bijwoorden ingeschakeld')
        : (isEnglish() ? 'OGN Base active · no applications enabled' : 'OGN Basis actief · geen toepassingen ingeschakeld');
    }
    const logLexDashboardTitle = document.querySelector('[data-config-log-lex-title]');
    if (logLexDashboardTitle) {
      logLexDashboardTitle.textContent = adverbsEnabled ? 'LEX & bijwoorden' : 'LEX';
    }
    syncFeatureDocumentationLinks();
    renderReadmeTopicCarousels();
    syncReadmeCarouselEditorTopics();
    setHelpTopic(
      document.querySelector('.help-topic-panel.is-active')?.getAttribute('data-help-topic')
      || 'readme'
    );
  }

  async function setFeatureEnabled(featureId, enabled, options = {}) {
    if (!FEATURE_DEFINITIONS[featureId]) return false;
    if (enabled && !featureRequirementsMet(featureId)) {
      state.features[featureId] = false;
      applyFeatureVisibility();
      return false;
    }
    state.features[featureId] = !!enabled;
    if (featureId === 'adverbs') {
      if (enabled) {
        ADVERB_OPTIONS = [
          NO_ADVERB_OPTION,
          ...ADVERB_FALLBACK_ROWS.map((record, index) => makeAdverbOptionFromRecord(record, index)).filter(Boolean)
        ];
        if (options.loadResources !== false) {
          await loadLexiconUsageProfiles();
          await loadAdverbOptionsFromHtml();
        }
      } else {
        resetAdverbFeatureState();
      }
      refreshExamplesForFeatures();
      applyExampleAdverbDefaults();
      stopGrowthPlayback();
      state.growthStep = 0;
      state.growthEnabled = false;
      resetManualViewBox();
    }
    applyFeatureVisibility();
    syncControls();
    applyLanguage();
    if (options.render !== false) render();
    return true;
  }

  async function setInsertionAxes(axisIds = [], enabled = true, options = {}) {
    const validAxes = [...new Set(axisIds)].filter(axisId => INSERTION_AXIS_DEFINITIONS[axisId]);
    if (!validAxes.length) return false;
    validAxes.forEach(axisId => {
      state.preconfig.insertion[axisId] = !!enabled;
    });
    for (const featureId of Object.keys(FEATURE_DEFINITIONS)) {
      if (state.features[featureId] && !featureRequirementsMet(featureId)) {
        await setFeatureEnabled(featureId, false, { render: false });
      }
    }
    applyFeatureVisibility();
    syncControls();
    applyLanguage();
    recordParadata('set-insertion-preconfig', { axes: validAxes, enabled: !!enabled });
    if (options.render !== false) render();
    return true;
  }

  recordParadata('session-start', { app_version: VERSION });

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
    if (!featureEnabled('adverbs')) return NO_ADVERB_OPTION;
    return ADVERB_OPTIONS.find(option => option.id === state.selectedAdverbId) || ADVERB_OPTIONS[0];
  }

  function activeAdverbData() {
    if (!featureEnabled('adverbs')) return null;
    const selected = activeAdverbOption();
    if (selected?.adverb) return selected.adverb;
    return state.example?.adverb || null;
  }

  function activeAdverbIsFronted() {
    const adv = activeAdverbData();
    if (!adv?.word) return false;
    const text = `${adv.position || ''} ${adv.placement || ''} ${adv.marking || ''} ${adv.sentence || ''}`.toLowerCase();
    // rc.14: scopehost S is niet hetzelfde als lineaire vooropplaatsing.
    // Alleen een expliciete fronted/V2-markering vervangt het neutrale
    // LOG-einddoel.
    return /fronted|voorop|slot\s*1|slot1|fronted-v2/.test(text);
  }

  function activeAdverbStatusLabel() {
    const adv = activeAdverbData();
    const logicalSpecs = activeLogicalInsertionSpecs();
    const intervalText = [...new Set(logicalSpecs.map(spec => spec.logInterval).filter(Boolean))].join('+') || validLogInsertionInterval();
    if (!adv?.word) {
      if (logicalSpecs.length) {
        const words = [...new Set(logicalSpecs.map(spec => spec.word).filter(Boolean))].join('+');
        return isEnglish()
          ? `LOG minors=${logicalSpecs.length} · ${words} · interval=${intervalText}`
          : `LOG-minors=${logicalSpecs.length} · ${words} · interval=${intervalText}`;
      }
      return isEnglish() ? 'adverb=none' : 'bijwoord=geen';
    }
    if (activeAdverbIsFronted()) {
      return isEnglish()
        ? `adverb=${adv.word} · LOG minor ${intervalText} · final target=fronting/V2`
        : `bijwoord=${adv.word} · LOG-minor ${intervalText} · einddoel=vooropplaatsing/V2`;
    }
    const marked = adv.placement === 'marked' ? (isEnglish() ? ', marked' : ', gemarkeerd') : '';
    return isEnglish()
      ? `adverb=${adv.word} · LOG minor ${intervalText}${marked} → neutral LEX`
      : `bijwoord=${adv.word} · LOG-minor ${intervalText}${marked} → neutrale LEX`;
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

  function exampleLexInsertionsActive(ex = state.example) {
    return featureEnabled('adverbs')
      && !!state.useExampleLexInsertions
      && state.selectedAdverbId === 'none'
      && Array.isArray(ex?.lexInsertions)
      && ex.lexInsertions.length > 0;
  }

  function activeSentenceText() {
    if (exampleLexInsertionsActive() && state.example?.sentence) return state.example.sentence;
    const sentence = activeLexItems().map(i => i.label).join(' ');
    return sentenceTypeForExample() === 'polar-question' ? `${sentence}?` : sentence;
  }

  function tokenHtml(item) {
    const label = escapeHtml(item.label);
    if (item.role === 'subject') return `<strong>${label}</strong>`;
    if (item.role === 'object') return `<em>${label}</em>`;
    return label;
  }

  function activeSentenceHtml() {
    if (exampleLexInsertionsActive() && state.example?.sentenceHtml && !state.roleSwap) return state.example.sentenceHtml;
    const sentence = activeLexItems().map(tokenHtml).join(' ');
    return sentenceTypeForExample() === 'polar-question' ? `${sentence}?` : sentence;
  }

  const SIMPLE_LEXICON_POLICY = {
    trui: { roles: ['object'], themes: ['patiens'] },
    vrouw: { roles: ['subject'], themes: ['agens'] },
    hond: { roles: ['subject', 'object'], themes: ['agens', 'patiens'] },
    man: { roles: ['subject', 'object'], themes: ['agens', 'patiens'] },
    jan: { roles: ['subject', 'object'], themes: ['agens', 'patiens'] },
    jek: { roles: ['subject', 'object'], themes: ['agens', 'patiens'] },
    zichzelf: { roles: ['object'], themes: ['patiens'] },
    uzelf: { roles: ['object'], themes: ['patiens'] }
  };

  const SIMPLE_VERB_FRAMES = {
    breit: { subjects: ['vrouw'], objects: ['trui'], imperfectum: 'BREIDE', participle: 'GEBREID' },
    bijt: { subjects: ['hond', 'kat', 'man', 'vrouw', 'jan', 'jek'], objects: ['man', 'hond', 'kat', 'vrouw', 'jan', 'jek'], imperfectum: 'BEET', participle: 'GEBETEN' },
    wast: { subjects: ['jan', 'man', 'vrouw'], objects: ['jan', 'zichzelf', 'man', 'vrouw'], imperfectum: 'WASTE', participle: 'GEWASSEN' },
    slaat: { subjects: ['jan', 'jek', 'man', 'vrouw'], objects: ['jan', 'jek', 'man', 'vrouw'], imperfectum: 'SLOEG', participle: 'GESLAGEN' },
    ken: { subjects: ['u', 'jan', 'man', 'vrouw'], objects: ['u', 'uzelf', 'jan', 'man', 'vrouw'], imperfectum: 'KENDE', participle: 'GEKEND' }
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

  async function loadLexiconUsageProfiles() {
    LEXICON_USAGE_PROFILES.clear();
    LEXICON_CONSTRUCTIONS.clear();
    if (!featureEnabled('adverbs')) return;
    // Fallback voor file:// of een mislukte fetch; geladen HTML overschrijft per lemma/constructie.
    seedLexiconUsageFallbacks();
    try {
      const response = await fetch(`lexicon-config.html?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) return;
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      doc.querySelectorAll('#opengraph-lexicon-config .lexicon-entry').forEach(entry => {
        const lemma = String(entry.dataset.lemma || entry.dataset.id || '').trim().toLowerCase();
        const id = String(entry.dataset.id || lemma).trim().toLowerCase();
        const profiles = [...entry.querySelectorAll('.usage-profile')].map(profile => ({
          id: String(profile.dataset.id || '').trim(),
          origin: normalizeInsertionOrigin(profile.dataset.origin),
          function: String(profile.dataset.function || '').trim(),
          scope: String(profile.dataset.scope || '').trim(),
          interval: String(profile.dataset.interval || '').trim(),
          effects: wordsFromData(profile.dataset.effects),
          recommended: String(profile.dataset.default || '').toLowerCase() === 'true',
          label: String(profile.textContent || profile.dataset.id || '').replace(/\s+/g, ' ').trim()
        })).filter(profile => profile.id);
        const record = { id, lemma, profiles };
        if (id) LEXICON_USAGE_PROFILES.set(id, record);
        if (lemma) LEXICON_USAGE_PROFILES.set(lemma, record);
      });
      doc.querySelectorAll('#opengraph-lexicon-config .lexicon-construction').forEach(entry => {
        const id = String(entry.dataset.id || '').trim().toLowerCase();
        if (!id) return;
        const profiles = [...entry.querySelectorAll('.construction-profile')].map(profile => ({
          id: String(profile.dataset.id || '').trim(),
          origin: normalizeInsertionOrigin(profile.dataset.origin),
          components: String(profile.dataset.components || '').trim(),
          function: String(profile.dataset.function || '').trim(),
          scope: String(profile.dataset.scope || '').trim(),
          interval: String(profile.dataset.interval || '').trim(),
          effects: wordsFromData(profile.dataset.effects),
          recommended: String(profile.dataset.recommended || '').toLowerCase() === 'true',
          label: String(profile.textContent || profile.dataset.id || '').replace(/\s+/g, ' ').trim()
        })).filter(profile => profile.id);
        LEXICON_CONSTRUCTIONS.set(id, {
          id, members: wordsFromData(entry.dataset.members),
          visibleSlots: Math.max(1, Number(entry.dataset.visibleSlots) || 1),
          defaultProfile: String(entry.dataset.defaultProfile || '').trim(), profiles
        });
      });
    } catch (_err) {
      // De ingebouwde voorbeeldmetadata blijft een geldige fallback.
    }
  }

  function parseUtteranceMetadata(value) {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
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
        const subject = sentenceEl?.querySelector('[data-role="subject"]')?.textContent.trim() || card.dataset.implicitSubject || 'HOND';
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
        const lexInsertions = [...card.querySelectorAll('.lex-insertion')].map((item, insertionIndex) => {
          const text = (item.dataset.text || item.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
          const id = String(item.dataset.id || text || `lex-insertion-${insertionIndex + 1}`).trim().toLowerCase().replace(/\s+/g, '-');
          const host = String(item.dataset.host || item.dataset.defaultHost || 'VP').trim().toUpperCase();
          const defaultHost = String(item.dataset.defaultHost || host || 'VP').trim().toUpperCase();
          return {
            id, text, host, defaultHost,
            category: String(item.dataset.category || 'BIJWOORD').trim(),
            marking: String(item.dataset.marking || 'functional:default-host').trim(),
            scope: String(item.dataset.scope || '').trim(),
            linear: String(item.dataset.linear || item.dataset.linearSlot || '').trim(),
            logInterval: String(item.dataset.logInterval || '').trim(),
            logAfter: String(item.dataset.logAfter || '').trim().toUpperCase(),
            logBefore: String(item.dataset.logBefore || '').trim().toUpperCase(),
            order: Number.isFinite(Number(item.dataset.order)) ? Number(item.dataset.order) : insertionIndex + 1,
            group: String(item.dataset.group || id).trim(),
            lemma: String(item.dataset.lemma || '').trim().toLowerCase(),
            construction: String(item.dataset.construction || '').trim().toLowerCase(),
            usageProfile: String(item.dataset.usageProfile || '').trim(),
            origin: normalizeInsertionOrigin(item.dataset.origin || 'LOG'),
            originComponents: String(item.dataset.originComponents || '').trim(),
            analysisStatus: String(item.dataset.analysisStatus || 'resolved').trim().toLowerCase(),
            candidateProfiles: wordsFromData(item.dataset.candidateProfiles),
            ambiguityAffects: wordsFromData(item.dataset.ambiguityAffects)
          };
        }).filter(item => item.text);
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
          sentenceType: card.dataset.sentenceType || '',
          lexRule: card.dataset.lexRule || 'hoofdzininvariant',
          sentence: (sentenceEl?.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase(),
          sentenceHtml: sentenceEl?.innerHTML || '',
          subjectDefault: subject.toUpperCase(),
          objectDefault: object.toUpperCase(),
          predicate: (card.dataset.predicate || 'BIJT').toUpperCase(),
          utteranceType: card.dataset.utteranceType || '',
          utteranceKernels: parseUtteranceMetadata(card.dataset.utteranceKernels),
          utteranceRelations: parseUtteranceMetadata(card.dataset.utteranceRelations),
          implicitSubject: card.dataset.implicitSubject || '',
          adverb,
          lexInsertions,
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
          ALL_EXAMPLES = accepted;
          refreshExamplesForFeatures(currentId);
        }
      }
    } catch (err) {
      // Fetch kan mislukken via file://. De ingebouwde fallback blijft dan actief.
    }
  }

  function makeAdverbOptionFromRecord(record, index = 0) {
    const [rawId, rawSentence, rawCategory, rawDefaultHost, rawHost, rawMarking, rawWord] = record || [];
    const id = String(rawId || `adv-${index + 1}`).trim();
    const sentence = String(rawSentence || '').replace(/\s+/g, ' ').trim().toUpperCase();
    const category = String(rawCategory || '').trim();
    const defaultHost = String(rawDefaultHost || '').trim().toUpperCase();
    const host = String(rawHost || defaultHost).trim().toUpperCase();
    const markingText = String(rawMarking || 'default').trim();
    const parts = id.toLowerCase().split('-');
    const word = String(rawWord || parts[2] || '').replace(/\s+/g, ' ').trim().toUpperCase();
    if (!word || !VALID_ADVERB_HOST_BOXES.has(host || defaultHost)) return null;
    const hostLabel = host || defaultHost;
    const isNeutralNegation = /^NIET$/i.test(word) && /NEG/i.test(category) && /neg-scope-default|post-object|MAN\s+NIET/i.test(`${markingText} ${sentence}`);
    const fronted = !isNeutralNegation && /fronted|voorop|slot\s*1|fronted-v2/i.test(markingText);
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
        id: word.toLowerCase().replace(/\s+/g, '-'),
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

  function makeAdverbOptionFromTableRow(row, index) {
    const cells = [...row.querySelectorAll('td')];
    if (cells.length < 6) return null;
    const record = cells.slice(0, 6).map(cell => cell.textContent || '');
    record.push(row.dataset.word || '');
    return makeAdverbOptionFromRecord(record, index);
  }

  async function loadAdverbOptionsFromHtml() {
    if (!featureEnabled('adverbs')) {
      ADVERB_OPTIONS = [NO_ADVERB_OPTION];
      return;
    }
    ADVERB_OPTIONS = [
      NO_ADVERB_OPTION,
      ...ADVERB_FALLBACK_ROWS.map((record, index) => makeAdverbOptionFromRecord(record, index)).filter(Boolean)
    ];
    try {
      const response = await fetch(`examples-adverbs.html?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) return;
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const rows = [...doc.querySelectorAll('tbody tr')];
      const parsed = rows.map(makeAdverbOptionFromTableRow).filter(Boolean);
      if (parsed.length) {
        ADVERB_OPTIONS = [
          NO_ADVERB_OPTION,
          ...parsed
        ];
        if (!ADVERB_OPTIONS.some(option => option.id === state.selectedAdverbId)) state.selectedAdverbId = 'none';
      }
    } catch (err) {
      // file:// of cache kan fetch blokkeren; de ingebouwde volledige
      // bijwoordlijst blijft dan actief.
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

  function parseLogConfig(doc) {
    const section = doc.getElementById('opengraph-log-config');
    if (!section) return null;
    const numberOr = (value, fallback) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };
    const boolOr = (value, fallback) => {
      if (String(value).toLowerCase() === 'true') return true;
      if (String(value).toLowerCase() === 'false') return false;
      return fallback;
    };
    const majors = [...section.querySelectorAll('.log-major-config')].map(el => {
      const sources = (el.dataset.sources || el.dataset.source || '').trim().split(/\s+/).filter(Boolean);
      return {
        id: String(el.dataset.id || '').trim().toUpperCase(),
        label: el.dataset.label || el.dataset.id || '',
        source: el.dataset.source || sources[0] || '',
        sources,
        role: el.dataset.role || ''
      };
    }).filter(item => item.id);
    const intervals = [...section.querySelectorAll('.log-interval-config')].map(el => ({
      id: String(el.dataset.id || '').trim(),
      label: el.dataset.label || el.dataset.id || '',
      labelEn: el.dataset.labelEn || el.dataset.label || el.dataset.id || '',
      after: String(el.dataset.after || '').trim().toUpperCase(),
      before: String(el.dataset.before || '').trim().toUpperCase()
    })).filter(item => item.id && (item.after || item.before));
    const classIntervals = {};
    [...section.querySelectorAll('.log-class-config')].forEach(el => {
      const category = String(el.dataset.category || '').trim().toUpperCase().replace(/[\s/-]+/g, '_');
      const interval = String(el.dataset.interval || '').trim();
      if (category && interval) classIntervals[category] = interval;
    });
    return {
      authority: String(section.dataset.authority || 'LOG').trim().toUpperCase(),
      positionUnit: section.dataset.positionUnit || 'slot',
      majorGap: numberOr(section.dataset.majorGap, 1),
      minorWidth: numberOr(section.dataset.minorWidth, 1),
      expandsMajorGap: boolOr(section.dataset.expandsMajorGap, true),
      axisSlotPixels: numberOr(section.dataset.axisSlotPixels, 176),
      lexSlotPixels: numberOr(section.dataset.lexSlotPixels, 64),
      lexPositionSource: String(section.dataset.lexPositionSource || 'LOG').trim().toUpperCase(),
      lexProjectionOrigin: String(section.dataset.lexProjectionOrigin || 'SOURCE-Y').trim().toUpperCase(),
      lexPlacementMode: String(section.dataset.lexPlacementMode || 'horizontal-then-move').trim().toLowerCase(),
      exampleControlsLayout: boolOr(section.dataset.exampleControlsLayout, false),
      playPhases: String(section.dataset.playPhases || 'LOG LEX').trim().toUpperCase().split(/\s+/).filter(Boolean),
      playSpaceMode: String(section.dataset.playSpaceMode || 'none').trim().toLowerCase(),
      majors,
      intervals,
      classIntervals
    };
  }

  async function loadStructureConfig() {
    try {
      const response = await fetch(`structure-config.html?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) return;
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const syntax = parseStructureSection(doc, 'opengraph-syntax-config');
      const functional = parseStructureSection(doc, 'opengraph-functional-config');
      const logConfig = parseLogConfig(doc);
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
      if (logConfig?.majors?.length && logConfig?.intervals?.length) STRUCTURE_CONFIG.logConfig = logConfig;
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
    // basisboom. Hoofdzinnen gebruiken een SOV-basis met V2-Wissel;
    // ja/nee-vragen gebruiken dezelfde basis met V1-Wissel. Dat- en omdat-
    // zinnen schrijven Comp rechtstreeks en gebruiken geen V2. Perfectum is
    // een werkwoordsvorm met eindcluster, geen afzonderlijke zinsoort.
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
    // Category and lexical source need distinct identities. Reusing `vdw`
    // for both produced a self-edge and made recursive measurement ambiguous.
    const participle = phrase('vdw-phrase', 'VDW', 'V', makeLeaf('vdw', 'V', 'participle'));
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

    // Constructive fallback: place the complete subtree beyond every occupied
    // row and column. Never return an unchecked position: A != B must always
    // imply x(A) != x(B) and y(A) != y(B).
    const dir = side < 0 ? -1 : 1;
    const occupiedMinX = Math.min(0, ...occupied.boxes.map(box => Number(box.minX) || 0));
    const occupiedMaxX = Math.max(0, ...occupied.boxes.map(box => Number(box.maxX) || 0));
    const occupiedMaxY = Math.max(0, ...occupied.boxes.map(box => Number(box.maxY) || 0));
    const dy = Math.max(startY + 18, occupiedMaxY + 1 - layout.box.minY);
    const dx = dir < 0
      ? occupiedMinX - 1 - layout.box.maxX
      : occupiedMaxX + 1 - layout.box.minX;
    if (candidateIsFree(layout, dx, dy, occupied, { boxPadding: 0 })) {
      return shiftLayout(layout, dx, dy);
    }
    throw new Error('OGN GRID-INVARIANT: geen vrije HOR/VER-plaats gevonden; layout is niet getekend.');
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
    return assertUniqueNodeGridLines(
      { node, nodes, edges, boxes: [rootBox, ...childBoxes], box },
      `recursieve layout ${node.id || node.label || 'zonder-id'}`
    );
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
    if (!featureEnabled('adverbs')) return 0;
    if (exampleLexInsertionsActive()) return Math.min(8, state.example.lexInsertions.length);
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

  function insertionChoiceKey(spec = {}, example = state.example) {
    return `${String(example?.id || 'example')}::${String(spec.id || spec.text || 'insertion')}`;
  }

  function insertionAnalysisOptions(spec = {}) {
    const candidates = Array.isArray(spec.candidateProfiles) ? spec.candidateProfiles : wordsFromData(spec.candidateProfiles);
    const construction = spec.construction ? LEXICON_CONSTRUCTIONS.get(String(spec.construction).toLowerCase()) : null;
    const lemmaRecord = spec.lemma ? LEXICON_USAGE_PROFILES.get(String(spec.lemma).toLowerCase()) : null;
    const pool = construction?.profiles?.length ? construction.profiles : (lemmaRecord?.profiles || []);
    const filtered = candidates.length ? pool.filter(profile => candidates.includes(profile.id)) : pool;
    if (filtered.length) return filtered.map(profile => ({ ...profile }));
    return [{
      id: spec.usageProfile || 'default',
      origin: normalizeInsertionOrigin(spec.origin || 'LOG'),
      components: spec.originComponents || '',
      function: spec.category || '', scope: spec.scope || '', interval: spec.logInterval || '',
      effects: Array.isArray(spec.ambiguityAffects) ? spec.ambiguityAffects : wordsFromData(spec.ambiguityAffects),
      recommended: true, label: spec.usageProfile || normalizeInsertionOrigin(spec.origin || 'LOG')
    }];
  }

  function resolvedInsertionAnalysis(spec = {}) {
    const options = insertionAnalysisOptions(spec);
    const key = insertionChoiceKey(spec);
    const storedId = state.lexAnalysisChoices?.[key] || '';
    const explicitlyResolved = String(spec.analysisStatus || 'resolved').toLowerCase() === 'resolved';
    const requestedId = storedId || (explicitlyResolved ? spec.usageProfile : '');
    const fallbackId = spec.usageProfile || LEXICON_CONSTRUCTIONS.get(String(spec.construction || '').toLowerCase())?.defaultProfile || '';
    const profile = options.find(item => item.id === requestedId)
      || options.find(item => item.id === fallbackId)
      || options.find(item => item.recommended)
      || options[0];
    const unresolved = !storedId && !explicitlyResolved && options.length > 1
      && (Array.isArray(spec.ambiguityAffects) ? spec.ambiguityAffects.length : wordsFromData(spec.ambiguityAffects).length);
    return {
      ...profile,
      id: profile?.id || fallbackId || 'default',
      origin: normalizeInsertionOrigin(profile?.origin || spec.origin || 'LOG'),
      components: profile?.components || spec.originComponents || '',
      scope: profile?.scope || spec.scope || '',
      interval: profile?.interval || spec.logInterval || '',
      options, key, unresolved, resolvedByUser: !!storedId
    };
  }

  function insertionContentForSpec(spec = {}) {
    const id = String(spec.id || spec.content || '').trim().toLowerCase();
    const known = LEX_INSERTION_CONTENTS.find(option => option.id === id);
    if (known) return known;
    const text = String(spec.text || spec.word || id || 'INSERTIEPUNT').replace(/\s+/g, ' ').trim().toUpperCase();
    return {
      id: id || text.toLowerCase().replace(/\s+/g, '-'),
      label: text,
      text,
      sub: spec.sub || 'lexicale insertiegroep',
      subEn: spec.subEn || 'lexical insertion group',
      caption: spec.caption || 'insertiegroep',
      captionEn: spec.captionEn || 'insertion group',
      tip: spec.tip || 'Externe lexicale insertie op de LEX-as.',
      tipEn: spec.tipEn || 'External lexical insertion on the LEX axis.'
    };
  }

  function activeLexInsertionSpecs() {
    if (!featureEnabled('adverbs') || !insertionAxisEnabled('lex')) return [];
    if (exampleLexInsertionsActive()) {
      return [...state.example.lexInsertions]
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
        .map((spec, index) => {
          const content = insertionContentForSpec(spec);
          const host = String(spec.host || spec.defaultHost || 'VP').trim().toUpperCase();
          const analysis = resolvedInsertionAnalysis(spec);
          return {
            ...spec,
            id: spec.id || `example-insertion-${index + 1}`,
            content,
            host,
            placement: validLexSlotPlacement(hostToLexPlacement(host)),
            order: Number(spec.order) || index + 1,
            usageProfile: analysis.id,
            origin: analysis.origin,
            originComponents: analysis.components,
            analysis,
            logInterval: analysis.interval || spec.logInterval || '',
            scope: analysis.scope || spec.scope || ''
          };
        });
    }
    const count = Number.isFinite(Number(state.lexFreeSlotCount)) ? Math.max(0, Math.min(8, Math.round(Number(state.lexFreeSlotCount)))) : 0;
    if (!count) return [];
    const content = lexInsertionContentDef();
    const placement = validLexSlotPlacement();
    return Array.from({ length: count }, (_unused, index) => ({
      id: `lex-insert-${index + 1}`,
      content,
      host: adverbHostLabelFromPlacement(placement, content),
      placement,
      order: index + 1,
      marking: activeAdverbData()?.marking || 'functional:default-host',
      marked: adverbOptionIsMarked(activeAdverbOption()),
      usageProfile: 'configured-log-minor', origin: 'LOG', analysisStatus: 'resolved'
    }));
  }

  function activeLogConfig() {
    return STRUCTURE_CONFIG.logConfig || baseStructureConfig().logConfig;
  }

  function logLexPlayPhases() {
    const configured = Array.isArray(activeLogConfig().playPhases)
      ? activeLogConfig().playPhases.map(value => String(value || '').trim().toUpperCase()).filter(Boolean)
      : [];
    return configured.join(' ') === 'LOG LEX' ? configured : ['LOG', 'LEX'];
  }

  function logicalAuthorityEnabled() {
    const config = activeLogConfig();
    return String(config.authority || '').toUpperCase() === 'LOG'
      && String(config.lexPositionSource || '').toUpperCase() === 'LOG';
  }

  function horizontalLexProjectionEnabled() {
    const config = activeLogConfig();
    return String(config.lexProjectionOrigin || 'SOURCE-Y').toUpperCase() === 'SOURCE-Y'
      && String(config.lexPlacementMode || 'horizontal-then-move').toLowerCase() === 'horizontal-then-move';
  }

  function logAxisSlotPixels() {
    return Math.max(160, Number(activeLogConfig().axisSlotPixels) || 176);
  }

  function logLexSlotPixels() {
    return Math.max(60, Number(activeLogConfig().lexSlotPixels) || 64);
  }

  function logInsertionIntervalOptions() {
    const intervals = activeLogConfig().intervals || [];
    return [
      { id: 'auto', label: 'automatisch volgens LOG-config', labelEn: 'automatic from LOG config' },
      ...intervals.map(interval => ({
        ...interval,
        labelEn: interval.labelEn || interval.label || interval.id
      }))
    ];
  }

  function validLogInsertionInterval(value = state.logInsertionInterval) {
    const id = String(value || 'auto');
    return logInsertionIntervalOptions().some(option => option.id === id) ? id : 'auto';
  }

  function logInsertionIntervalLabel(value = validLogInsertionInterval()) {
    const option = logInsertionIntervalOptions().find(item => item.id === value);
    return isEnglish() ? (option?.labelEn || option?.label || value) : (option?.label || value);
  }

  function normalizedAdverbCategory(value) {
    return String(value || '').trim().toUpperCase().replace(/[\s/-]+/g, '_');
  }

  function inferredLogIntervalId(spec = {}) {
    const configured = validLogInsertionInterval();
    if (configured !== 'auto') return configured;
    // An explicit sentence-instance landing instruction outranks a broad
    // adverb-class default. Scope remains independent of linear LEX position.
    const explicit = String(spec.logInterval || spec.logicalInterval || '').trim();
    if (activeLogConfig().intervals.some(interval => interval.id === explicit)) return explicit;
    const linear = String(spec.linear || spec.linearSlot || '').trim().toLowerCase();
    if (linear.includes('post-object') || linear.includes('after-object') || linear.includes('pre-vcluster') || linear.includes('before-final-verb')) return 'O-V';
    const category = normalizedAdverbCategory(spec.category || activeAdverbData()?.category);
    const classIntervals = activeLogConfig().classIntervals || {};
    return classIntervals[category] || classIntervals.DEFAULT || 'S-O';
  }

  function activeLogicalInsertionSpecs() {
    if (!insertionAxisEnabled('log')) return [];
    return activeLexInsertionSpecs().filter(spec => normalizeInsertionOrigin(spec.origin) !== 'LEX').map((spec, index) => {
      const content = spec.content || insertionContentForSpec(spec);
      const logInterval = inferredLogIntervalId(spec);
      const exampleMayControlLayout = activeLogConfig().exampleControlsLayout
        && validLogInsertionInterval() === 'auto';
      const intervalDef = exampleMayControlLayout && (spec.logAfter || spec.logBefore)
        ? {
            id: logInterval,
            after: String(spec.logAfter || '').toUpperCase(),
            before: String(spec.logBefore || '').toUpperCase()
          }
        : null;
      return {
        ...spec,
        id: spec.id || `log-minor-${index + 1}`,
        content,
        word: String(spec.text || content.text || content.label || spec.id || 'ADV').toUpperCase(),
        short: `m${index + 1}`,
        title: `bijwoord · ${logInterval}`,
        logInterval,
        intervalDef,
        width: Math.max(1, Number(spec.width) || Number(activeLogConfig().minorWidth) || 1),
        order: Number(spec.order) || index + 1,
        origin: normalizeInsertionOrigin(spec.origin),
        usageProfile: spec.usageProfile || '',
        originComponents: spec.originComponents || ''
      };
    });
  }

  function activeLexPlacementInsertionSpecs() {
    return activeLexInsertionSpecs().map((spec, index) => {
      const content = spec.content || insertionContentForSpec(spec);
      const logInterval = inferredLogIntervalId(spec);
      return {
        ...spec, id: spec.id || `lex-placement-${index + 1}`, content,
        word: String(spec.text || content.text || content.label || spec.id || 'ADV').toUpperCase(),
        short: normalizeInsertionOrigin(spec.origin) === 'LEX' ? `l${index + 1}` : `m${index + 1}`,
        logInterval, width: Math.max(1, Number(spec.width) || 1),
        order: Number(spec.order) || index + 1, origin: normalizeInsertionOrigin(spec.origin)
      };
    });
  }

  function activeLexPlacementSequence(order = southLogicalOrder()) {
    const labels = roleLabels();
    const words = { S: String(labels.subject || 'S').toUpperCase(), O: String(labels.object || 'O').toUpperCase(), V: String(labels.predicate || 'V').toUpperCase() };
    const title = { S: 'Subject', O: 'Object', V: 'Verb' };
    const configuredMajors = activeLogConfig().majors || [];
    const byId = new Map(configuredMajors.map(item => [String(item.id || '').toUpperCase(), item]));
    const majors = (order || []).map(short => {
      const def = byId.get(short) || { id: short, label: title[short] || short, sources: [] };
      return { ...def, id: short, short, title: def.label || title[short] || short, word: words[short] || short, width: Math.max(1, Number(activeLogConfig().majorGap) || 1) };
    });
    return buildLogicalSlotSequence(majors, activeLexPlacementInsertionSpecs(), activeLogConfig().intervals || [], { minorWidth: 1, defaultInterval: activeLogConfig().classIntervals?.DEFAULT || 'S-O' });
  }

  function activeLogicalSlotSequence(order = southLogicalOrder()) {
    const labels = roleLabels();
    const words = {
      S: String(labels.subject || 'S').toUpperCase(),
      O: String(labels.object || 'O').toUpperCase(),
      V: String(labels.predicate || 'V').toUpperCase()
    };
    const title = { S: 'Subject', O: 'Object', V: 'Verb' };
    const configuredMajors = activeLogConfig().majors || [];
    const byId = new Map(configuredMajors.map(item => [String(item.id || '').toUpperCase(), item]));
    const majors = (order || []).map(short => {
      const def = byId.get(short) || { id: short, label: title[short] || short, sources: [] };
      return {
        ...def,
        id: short,
        short,
        title: def.label || title[short] || short,
        word: words[short] || short,
        width: Math.max(1, Number(activeLogConfig().majorGap) || 1)
      };
    });
    return buildLogicalSlotSequence(
      majors,
      activeLogicalInsertionSpecs(),
      activeLogConfig().intervals || [],
      {
        minorWidth: activeLogConfig().minorWidth || 1,
        defaultInterval: activeLogConfig().classIntervals?.DEFAULT || 'S-O'
      }
    );
  }

  function logicalRoleForLexItem(item = {}) {
    const source = String(item.source || '').toLowerCase();
    const role = String(item.role || '').toLowerCase();
    if (source === 'subject' || role === 'subject' || role === 'agens') return 'S';
    if (source === 'object' || role === 'object' || role === 'patiens') return 'O';
    if (['predicate', 'pv', 'vdw'].includes(source) || ['predicate', 'aux', 'participle', 'pred'].includes(role)) return 'V';
    return '';
  }

  function logicalLexPlan(items = activeLexItems(), order = southLogicalOrder()) {
    const sequence = activeLexPlacementSequence(order);
    const sourceItems = (items || []).map((item, index) => ({ item, index, role: logicalRoleForLexItem(item) }))
      .filter(entry => entry.item?.source && entry.role);
    const groups = new Map();
    sourceItems.forEach(entry => {
      if (!groups.has(entry.role)) groups.set(entry.role, []);
      groups.get(entry.role).push(entry);
    });
    const byIndex = new Map();
    const minorRows = [];
    const majorRows = new Map();
    let row = 0;
    sequence.forEach(sequenceItem => {
      if (sequenceItem.kind === 'minor') {
        minorRows.push({ ...sequenceItem, row });
        row += Math.max(1, Number(sequenceItem.width) || 1);
        return;
      }
      majorRows.set(sequenceItem.short, row);
      const group = groups.get(sequenceItem.short) || [];
      group.forEach((entry, groupIndex) => {
        byIndex.set(entry.index, row + groupIndex);
      });
      row += Math.max(1, group.length);
    });
    sourceItems.forEach(entry => {
      if (!byIndex.has(entry.index)) {
        byIndex.set(entry.index, row);
        row += 1;
      }
    });
    return { sequence, byIndex, minorRows, majorRows, rowCount: Math.max(1, row) };
  }

  function applyExampleAdverbDefaults() {
    if (!featureEnabled('adverbs')) {
      state.selectedAdverbId = 'none';
      state.useExampleLexInsertions = false;
      state.lexFreeSlotCount = 0;
      state.lexInsertionContent = 'empty';
      state.lexFreeSlotPlacement = 'above-vp';
      state.logInsertionInterval = 'auto';
      return;
    }
    if (state.selectedAdverbId === 'none' && Array.isArray(state.example?.lexInsertions) && state.example.lexInsertions.length) {
      state.useExampleLexInsertions = true;
      const first = [...state.example.lexInsertions].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))[0];
      const content = insertionContentForSpec(first);
      state.lexFreeSlotCount = Math.min(8, state.example.lexInsertions.length);
      state.lexInsertionContent = validLexInsertionContent(content.id);
      state.lexFreeSlotPlacement = validLexSlotPlacement(hostToLexPlacement(first.host || first.defaultHost || 'VP'));
      return;
    }
    state.useExampleLexInsertions = false;
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
    if (logicalAuthorityEnabled()) return 0;
    if (lexPlacementIsSyntaxHost()) return 0;
    return lexFreeSlotCount() > 0 ? Math.max(1, lexFreeSlotCount()) : 0;
  }

  function lexFreeSlotDescriptors() {
    const extensionTargets = validLexInsertionTargets();
    const logicalSequence = logicalAuthorityEnabled() ? activeLexPlacementSequence() : [];
    return activeLexInsertionSpecs().map((spec, index) => {
      const placement = validLexSlotPlacement(spec.placement || hostToLexPlacement(spec.host));
      const content = spec.content || insertionContentForSpec(spec);
      const logical = logicalSequence.find(item => item.kind === 'minor' && item.id === spec.id)
        || logicalSequence.filter(item => item.kind === 'minor')[index]
        || null;
      return {
        id: spec.id || `lex-insert-${index + 1}`,
        label: logicalAuthorityEnabled() ? `${normalizeInsertionOrigin(spec.origin)}-insertie ${index + 1}` : `LEX-insertie ${index + 1}`,
        kind: logicalAuthorityEnabled()
          ? (normalizeInsertionOrigin(spec.origin) === 'LEX' ? 'direct-lex-insertion' : (normalizeInsertionOrigin(spec.origin) === 'LOG+LEX' ? 'mixed-log-lex-insertion' : 'log-minor-lex-projection'))
          : (lexPlacementIsSyntaxHost(placement) ? 'lex-axis-adverb-slot' : 'lex-axis-insertion-box'),
        axis: logicalAuthorityEnabled() ? (normalizeInsertionOrigin(spec.origin) === 'LEX' ? 'LEX' : (normalizeInsertionOrigin(spec.origin) === 'LOG+LEX' ? 'LOG+LEX→LEX' : 'LOG→LEX')) : 'LEX',
        placement,
        host_box: lexPlacementIsSyntaxHost(placement) ? (spec.host || adverbHostLabelFromPlacement(placement, content)) : null,
        content: content.id, text: content.text, sub: lexInsertionContentSub(content),
        category: spec.category || null, scope: spec.scope || null, linear: spec.linear || null, usage_profile: spec.usageProfile || null, origin: normalizeInsertionOrigin(spec.origin), origin_components: spec.originComponents || null,
        logical_interval: logical?.logInterval || null,
        logical_slot: Number.isFinite(logical?.logicalSlot) ? logical.logicalSlot : null,
        order: Number(spec.order) || index + 1, group: spec.group || spec.id || null,
        extension_targets: extensionTargets,
        insertion_grips_tree: false,
        effect: logicalAuthorityEnabled()
          ? (normalizeInsertionOrigin(spec.origin) === 'LEX' ? 'direct lexical insertion reserves a LEX row without a LOG minor' : (normalizeInsertionOrigin(spec.origin) === 'LOG+LEX' ? 'mixed group uses one visible LEX slot and a LOG component' : 'LOG minor expands the logical distance and projects to the corresponding neutral LEX row'))
          : (lexPlacementIsSyntaxHost(placement)
            ? 'external lexical insertion on LEX axis; host subtree is lowered to reserve vertical space'
            : 'extends-selected-branches-or-box-boundaries'),
        accepts_future_sources: ['other-lex-axis', 'other-tree', 'anaphoric-element', 'adverbial-headless-clause']
      };
    });
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

  function gridLineKey(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? String(Math.round(numeric * 1e9) / 1e9) : 'NaN';
  }

  function nodeGridLineConflicts(layout) {
    const conflicts = [];
    const rows = new Map();
    const columns = new Map();
    for (const node of layout?.nodes || []) {
      const id = String(node?.id || node?.label || 'knoop-zonder-id');
      if (!Number.isFinite(Number(node?.x)) || !Number.isFinite(Number(node?.y))) {
        conflicts.push({ axis: 'coordinate', first: id, second: id, value: 'NaN' });
        continue;
      }
      const columnKey = gridLineKey(node.x);
      const rowKey = gridLineKey(node.y);
      if (columns.has(columnKey)) conflicts.push({ axis: 'vertical', first: columns.get(columnKey), second: id, value: columnKey });
      else columns.set(columnKey, id);
      if (rows.has(rowKey)) conflicts.push({ axis: 'horizontal', first: rows.get(rowKey), second: id, value: rowKey });
      else rows.set(rowKey, id);
    }
    return conflicts;
  }

  function assertUniqueNodeGridLines(layout, context = 'OGN-layout') {
    const conflicts = nodeGridLineConflicts(layout);
    if (!conflicts.length) return layout;
    const details = conflicts
      .map(conflict => `${conflict.first} / ${conflict.second}: ${conflict.axis} ${conflict.value}`)
      .join('; ');
    throw new Error(`OGN GRID-INVARIANT geschonden in ${context}: gridlijnhergebruik. A != B vereist x(A) != x(B) en y(A) != y(B). ${details}`);
  }

  function freeSubtreeShiftY(layout, rootNodeId, requestedDy = 1) {
    const ids = descendantIds(layout, rootNodeId);
    const movingRows = (layout?.nodes || []).filter(node => ids.has(node.id)).map(node => Number(node.y));
    const fixedRows = new Set((layout?.nodes || []).filter(node => !ids.has(node.id)).map(node => gridLineKey(node.y)));
    const start = Math.max(1, Math.ceil(Number(requestedDy) || 1));
    const limit = start + Math.max(64, (layout?.nodes?.length || 1) * 8);
    for (let dy = start; dy <= limit; dy += 1) {
      if (movingRows.every(row => !fixedRows.has(gridLineKey(row + dy)))) return dy;
    }
    throw new Error(`OGN GRID-INVARIANT: subtree ${rootNodeId} kan niet naar unieke horizontale gridlijnen worden verplaatst.`);
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


  function insertionLinearZone(spec = {}) {
    const linear = String(spec.linear || spec.linearSlot || '').trim().toLowerCase();
    if (linear === 'post-object-pre-vcluster') return 'na object · vóór V-CLUSTER';
    return '';
  }

  function applyLexAdverbAxisSlotSpace(layout) {
    // rc.14: LOG is de plaatsingsbron. Bijwoorden vergroten voortaan het
    // gekozen LOG-interval en krijgen daarna dezelfde afgeleide LEX-rij.
    // Een syntactische hostbox wordt dus niet meer omlaag geschoven.
    if (logicalAuthorityEnabled()) {
      layout.logSlotAuthority = {
        authority: 'LOG',
        lexPositionSource: 'LOG',
        lexProjectionOrigin: activeLogConfig().lexProjectionOrigin || 'SOURCE-Y',
        lexPlacementMode: activeLogConfig().lexPlacementMode || 'horizontal-then-move',
        interval: validLogInsertionInterval()
      };
      return layout;
    }
    const specs = activeLexInsertionSpecs().filter(spec => lexPlacementIsSyntaxHost(spec.placement));
    if (!layout || !specs.length) return layout;
    const groupsByHost = new Map();
    for (const spec of specs) {
      const content = spec.content || insertionContentForSpec(spec);
      const placement = validLexSlotPlacement(spec.placement || hostToLexPlacement(spec.host || 'VP'));
      const host = findAdverbHostNode(layout, placement, content);
      if (!host) continue;
      if (!groupsByHost.has(host.id)) groupsByHost.set(host.id, { hostId: host.id, initialY: host.y, specs: [] });
      groupsByHost.get(host.id).specs.push({ ...spec, content, placement });
    }
    const groups = [...groupsByHost.values()].sort((a, b) => a.initialY - b.initialY);
    const slots = [];
    const spaces = [];
    for (const group of groups) {
      const host = (layout.nodes || []).find(node => String(node.id) === String(group.hostId));
      if (!host) continue;
      const orderedSpecs = [...group.specs].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      const visibleSlotCount = orderedSpecs.length;
      const slotStepRows = Math.max(1, Math.ceil((72 / Math.max(1, cellY())) * 2) / 2);
      const reserveRows = Math.ceil(0.5 + Math.max(0, visibleSlotCount - 1) * slotStepRows + 1.5);
      const beforeBox = hostBoxForNode(layout, host);
      const oldSlotTopY = beforeBox ? beforeBox.minY : host.y;
      const safeReserveRows = freeSubtreeShiftY(layout, host.id, reserveRows);
      shiftSubtreeY(layout, host.id, safeReserveRows);
      const shiftedHost = (layout.nodes || []).find(node => String(node.id) === String(host.id)) || host;
      const shiftedBox = hostBoxForNode(layout, shiftedHost);
      const slotY0 = (shiftedBox ? shiftedBox.minY - safeReserveRows : oldSlotTopY) + 0.5;
      orderedSpecs.forEach((spec, index) => {
        const content = spec.content || insertionContentForSpec(spec);
        const hostLabel = activeAdverbHostLabel(content, spec.placement);
        const linearZone = insertionLinearZone(spec);
        slots.push({
          id: spec.id || `lex-adverb-axis-slot-${slots.length + 1}`,
          label: `stap 1 · insertie ${index + 1}${linearZone ? ` · ${linearZone}` : ` boven ${hostLabel}`}`,
          hostId: shiftedHost.id, hostLabel, linearZone,
          x: shiftedHost.x, y: slotY0 + index * slotStepRows,
          content: content.id, contentDef: content, text: content.text, sub: lexInsertionContentSub(content),
          marked: !!spec.marked, marking: spec.marking || 'functional:default-host',
          toggleTargetId: '', toggleLabel: ''
        });
      });
      spaces.push({ count: visibleSlotCount, reserveRows: safeReserveRows, slotStepRows, hostId: shiftedHost.id, hostLabel: activeAdverbHostLabel(orderedSpecs[0]?.content, orderedSpecs[0]?.placement), axis: 'LEX', source: 'external-lexical-insertion' });
    }
    layout.lexAdverbAxisSlots = slots;
    layout.lexAdverbAxisSpace = spaces;
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
      const dy = freeSubtreeShiftY(layout, node.id, rows + offset);
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
    return assertUniqueNodeGridLines(
      applyLexInsertionBranchExtensions(normalizeLayout(applyLexAdverbAxisSlotSpace(base)), 'syntax'),
      'Syntax'
    );
  }

  function multiOgnSentenceLayout(sentence) {
    // De eerste multi-OGN-versie is bewust deterministisch. Iedere zin wordt
    // met dezelfde vaste Language Tree-strategie berekend; pas daarna mag de
    // compositie-engine de complete tweede eenheid star verschuiven.
    const layout = normalizeLayout(layoutTree(cloneTree(sentence.tree), 0, {
      firstSide: -1,
      branchOrder: 'normal',
      branchOverrides: { top: 'normal', middle: 'normal', other: 'normal' }
    }));
    return assertUniqueNodeGridLines(layout, `multi-OGN ${sentence.id} vóór compositie`);
  }

  function activeUtteranceDefinition() {
    return globalThis.OGNUtteranceKernels?.definitionFor?.(state.multiOgnExampleId, state.causalAnaphorVariant, state.causalVerbVariant, state.botVariant) || null;
  }

  function activeMultiOgnDemo() {
    return activeUtteranceDefinition() || MULTI_OGN_ANAPHOR_DEMO;
  }

  function multiOgnAnaphorComposition() {
    const engine = globalThis.OGNMultiComposition;
    const utterance = activeUtteranceDefinition();
    if (utterance) return globalThis.OGNUtteranceKernels.composeUtterance(utterance.id, engine, state.causalAnaphorVariant, state.causalVerbVariant, state.botVariant);
    if (!engine?.composePair) throw new Error('Multi-OGN-compositie-engine ontbreekt.');
    const [s1, s2] = MULTI_OGN_ANAPHOR_DEMO.sentences;
    const composed = engine.composePair({
      upper: { id: s1.id, layout: multiOgnSentenceLayout(s1) },
      lower: { id: s2.id, layout: multiOgnSentenceLayout(s2) },
      relation: MULTI_OGN_ANAPHOR_DEMO.relation,
      gapRows: MULTI_OGN_ANAPHOR_DEMO.gapRows
    });
    composed.units.forEach(unit => assertUniqueNodeGridLines(unit.layout, `multi-OGN ${unit.id} na compositie`));
    return {
      ...composed,
      demo: MULTI_OGN_ANAPHOR_DEMO,
      lexItems: MULTI_OGN_ANAPHOR_DEMO.sentences.flatMap(sentence => sentence.lex.map((item, index) => ({
        ...item,
        unitId: sentence.id,
        sentenceOrder: sentence.order,
        wordOrder: index + 1
      })))
    };
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
      const maxRow = Math.max(0, ...occupiedRows);
      const maxAbsColumn = Math.max(0, ...[...occupiedCols].map(value => Math.abs(Number(value) || 0)));
      const roleX = mirror * (maxAbsColumn + 1);
      const leafX = mirror * (maxAbsColumn + 2);
      const roleY = maxRow + 1;
      const leafY = maxRow + 2;
      const fallback = { roleX, roleY, leafX, leafY, minX: Math.min(roleX, leafX), maxX: Math.max(roleX, leafX), minY: roleY, maxY: leafY };
      if (freeAt(fallback)) return fallback;
      throw new Error('OGN GRID-INVARIANT: geen vrije Functional HOR/VER-corridor gevonden.');
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
    return assertUniqueNodeGridLines(
      applyLexInsertionBranchExtensions(normalizeLayout(addOpnTopicalizationSlot(layoutTree(cloneTree(functionalSpec()), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.functionalRoot || 'ft-clause')), 'functional'),
      'Functional'
    );
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
    return assertUniqueNodeGridLines(normalizeLayout(applySouthLogicalSyntaxGroupOrder(base, mode)), `Syntax · LOG-volgorde ${mode}`);
  }

  function getSouthAwareFunctionalLayout() {
    const firstSide = layoutFirstSide();
    return assertUniqueNodeGridLines(
      applyLexInsertionBranchExtensions(normalizeLayout(addOpnTopicalizationSlot(layoutTree(southAwareFunctionalSpec(), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.functionalRoot || 'ft-clause')), 'functional'),
      `Functional · LOG-volgorde ${state.southLogicalMode || 'SOV'}`
    );
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
    const sequence = activeLogicalSlotSequence(order);
    return sequence.map(item => {
      if (item.kind === 'minor') return item;
      const node = findNode(item.short);
      return {
        ...item,
        sourcePx: node ? px(node.x, origin) : null,
        sourceTopY: node ? py(node.y, origin) + 22 : null
      };
    });
  }

  function queryParamValue(...names) {
    try {
      const params = new URLSearchParams(window.location.search || '');
      for (const name of names) {
        const value = params.get(name);
        if (value) return String(value).trim();
      }
    } catch (_err) {}
    return '';
  }

  function validViewportMode(value = state?.viewportMode) {
    const id = String(value || '').toLowerCase();
    return VIEWPORT_TEST_MODES.some(option => option.id === id) ? id : 'auto';
  }

  function initialViewportMode() {
    const fromUrl = queryParamValue('viewport', 'device');
    if (VIEWPORT_TEST_MODES.some(option => option.id === String(fromUrl).toLowerCase())) return String(fromUrl).toLowerCase();
    return 'auto';
  }

  function activeViewportMode() {
    return validViewportMode(state?.viewportMode || 'auto');
  }

  function syncViewportTestClasses() {
    const mode = activeViewportMode();
    const mobilePortrait = mode === 'mobile-portrait';
    const mobileLandscape = mode === 'mobile-landscape';
    const mobileTest = mobilePortrait || mobileLandscape;
    const handheldLandscape = isHandheldLandscapeViewport();
    const root = document.documentElement;
    const body = document.body;
    [root, body].forEach(node => {
      if (!node) return;
      VIEWPORT_TEST_MODES.forEach(option => node.classList.toggle(`viewport-${option.id}`, mode === option.id));
      node.classList.toggle('viewport-mobile-test', mobileTest);
      node.classList.toggle('viewport-mobile-portrait-test', mobilePortrait);
      node.classList.toggle('viewport-mobile-landscape-test', mobileLandscape);
      node.classList.toggle('viewport-handheld-landscape', handheldLandscape);
      node.dataset.viewportMode = mode;
    });
    const width = mobilePortrait ? 390 : (mobileLandscape ? 844 : 0);
    const height = mobilePortrait ? 844 : (mobileLandscape ? 390 : 0);
    if (mobileTest) {
      root.style.setProperty('--viewport-test-width', `${width}px`);
      root.style.setProperty('--viewport-test-height', `${height}px`);
      root.style.setProperty('--viewport-test-label', mobilePortrait ? '"mobile portrait"' : '"mobile landscape"');
    } else {
      root.style.removeProperty('--viewport-test-width');
      root.style.removeProperty('--viewport-test-height');
      root.style.removeProperty('--viewport-test-label');
    }
  }

  function isPhysicalHandheldViewport() {
    if (typeof window === 'undefined') return false;
    const viewport = window.visualViewport;
    const width = Number(viewport?.width || window.innerWidth || 0);
    const height = Number(viewport?.height || window.innerHeight || 0);
    const compactSide = Math.min(width || Infinity, height || Infinity) <= 760;
    const touch = Number(window.navigator?.maxTouchPoints || 0) > 0;
    const coarsePointer = !!window.matchMedia?.('(pointer: coarse)')?.matches;
    const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(String(window.navigator?.userAgent || ''));
    return compactSide && (touch || coarsePointer || mobileUserAgent);
  }

  function isHandheldLandscapeViewport() {
    const forced = activeViewportMode();
    if (forced === 'mobile-landscape') return true;
    if (forced === 'mobile-portrait') return false;
    const viewport = window.visualViewport;
    const width = Number(viewport?.width || window.innerWidth || 0);
    const height = Number(viewport?.height || window.innerHeight || 0);
    return isPhysicalHandheldViewport() && width > height;
  }

  function isMobileViewport() {
    const forced = activeViewportMode();
    if (forced === 'mobile-portrait' || forced === 'mobile-landscape') return true;
    if (forced === 'desktop') return false;
    return !!window.matchMedia?.('(max-width: 760px)')?.matches || isPhysicalHandheldViewport();
  }

  function isPortraitGridFirstViewport() {
    if (typeof window === 'undefined') return false;
    const forced = activeViewportMode();
    if (forced === 'mobile-portrait') return true;
    if (forced === 'mobile-landscape' || forced === 'desktop') return false;
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

  function validLayoutDensity(value = state.layoutDensity) {
    const id = String(value || 'max');
    return LAYOUT_DENSITIES.some(option => option.id === id) ? id : 'max';
  }

  function validGridSize(value) {
    return GRID_SIZE_OPTIONS.some(option => option.id === String(value)) ? String(value) : '100';
  }

  function gridSizeScale(value) {
    return Number(validGridSize(value)) / 100;
  }

  function validKernelBranchSpacing(value) {
    const id = String(value || 'compact');
    return KERNEL_BRANCH_SPACINGS.some(option => option.id === id) ? id : 'compact';
  }

  function kernelBranchScale(value) {
    return KERNEL_BRANCH_SPACINGS.find(option => option.id === validKernelBranchSpacing(value))?.factor || 0.68;
  }

  function validKernelBranchFlip(value) {
    return value === 'flip' ? 'flip' : 'auto';
  }

  function validMultiOgnFlipHold(value) {
    const id = String(value || 'pause');
    return MULTI_OGN_FLIP_HOLD_MODES.some(option => option.id === id) ? id : 'pause';
  }

  function validViewFitMode(value = state.viewFitMode) {
    const id = String(value || 'max');
    return VIEW_FIT_MODES.some(option => option.id === id) ? id : 'max';
  }

  function syncViewFitModeClasses() {
    const mode = validViewFitMode();
    const body = document.body;
    const root = document.documentElement;
    if (!body || !root) return;
    ['max', 'window', 'auto', 'scroll', 'fixed'].forEach(id => {
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
    const mode = validLayoutDensity();
    const mobile = isMobileViewport();
    const landscapeHandheld = isHandheldLandscapeViewport();
    if (mode === 'max') {
      if (landscapeHandheld) {
        // v2.0.0-rc.45: landschap heeft veel breedte maar weinig hoogte.
        // Maak de projectie daarom werkelijk platter in plaats van een hoge
        // portretlayout met cover-zoom af te snijden. Font en knopen behouden
        // hun leesbare maat; vooral de horizontale/verticale celafstand wordt
        // aangepast.
        return { cellX: BASE_CELL * 1.78, cellY: BASE_CELL * 0.55, fontScale: 1.42, label: 'MAX mobiel landschap' };
      }
      return mobile
        ? { cellX: BASE_CELL * 1.38, cellY: BASE_CELL * 0.78, fontScale: 1.42, label: 'MAX mobiel' }
        : { cellX: BASE_CELL * 1.48, cellY: BASE_CELL * 0.72, fontScale: 1.70, label: 'MAX desktop' };
    }
    if (mobile && mode === 'auto') return { cellX: BASE_CELL * 1.08, cellY: BASE_CELL * 0.86, fontScale: 1.04, label: 'mobile auto' };
    if (mode === 'compact') return { cellX: BASE_CELL, cellY: BASE_CELL, fontScale: 1.00, label: 'compact' };
    if (mode === 'flat') return { cellX: BASE_CELL * 1.48, cellY: BASE_CELL * 0.72, fontScale: 1.04, label: 'platter' };
    if (mode === 'wide') return { cellX: BASE_CELL * 1.34, cellY: BASE_CELL * 0.86, fontScale: 1.08, label: 'breed/lager' };
    if (mode === 'large') return { cellX: BASE_CELL * 1.46, cellY: BASE_CELL * 0.82, fontScale: 1.16, label: 'breed + groter font' };
    // Auto: alle centrale views en named-projection views gebruiken exact
    // dezelfde celmaten. LEX, SYNT en LOG mogen de centrale boom niet laten
    // verspringen of herschalen wanneer alleen de projectie-overlay wisselt.
    return { cellX: BASE_CELL * 1.26, cellY: BASE_CELL * 0.87, fontScale: 1.08, label: 'auto stabiele centrale boom' };
  }

  function cellX() { return layoutVisualProfile().cellX * gridSizeScale(state.gridSizeHorizontal); }
  function cellY() { return layoutVisualProfile().cellY * gridSizeScale(state.gridSizeVertical); }
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
    // Rasterlijnen blijven binnen de projectie-assen. floor() tekende steeds
    // nog één lijn buiten LEX/SYNT/LOG en maakte het raster zichtbaar groter
    // dan het eigenlijke asgebied.
    const startX = Math.ceil(minX / sx) * sx;
    const startY = Math.ceil(minY / sy) * sy;
    let xi = Math.round(startX / sx);
    for (let x = startX; x <= maxX + 0.01; x += sx, xi += 1) {
      grid.appendChild(svgEl('line', { x1: x, y1: minY, x2: x, y2: maxY, class: xi % 2 === 0 ? 'grid-line major' : 'grid-line' }));
    }
    let yi = Math.round(startY / sy);
    for (let y = startY; y <= maxY + 0.01; y += sy, yi += 1) {
      grid.appendChild(svgEl('line', { x1: minX, y1: y, x2: maxX, y2: y, class: yi % 2 === 0 ? 'grid-line major' : 'grid-line' }));
    }
    if (minY <= 0 && maxY >= 0) grid.appendChild(svgEl('line', { x1: minX, y1: 0, x2: maxX, y2: 0, class: 'grid-axis' }));
    if (minX <= 0 && maxX >= 0) grid.appendChild(svgEl('line', { x1: 0, y1: minY, x2: 0, y2: maxY, class: 'grid-axis' }));
  }

  function renderedAxisLineBox(selector) {
    const node = els.svg?.querySelector?.(selector);
    if (!node) return null;
    try {
      const box = node.getBBox?.();
      if (!box || ![box.x, box.y, box.width, box.height].every(Number.isFinite)) return null;
      return {
        x: Number(box.x),
        y: Number(box.y),
        w: Number(box.width),
        h: Number(box.height)
      };
    } catch (_err) {
      return null;
    }
  }

  function projectionAxisGridBox(fallback = null) {
    if (directPlacementActive() || multiOgnAnaphorActive()) return fallback;
    if (!isMainScreenActive() || !['axes', 'source', 'lex', 'synt', 'log'].includes(state.projection)) return fallback;
    let context = null;
    try {
      context = canonicalProjectionContext(null, { drawCentral: false });
    } catch (_err) {}

    const fallbackBox = fallback && [fallback.x, fallback.y, fallback.w, fallback.h].every(Number.isFinite)
      ? { x: Number(fallback.x), y: Number(fallback.y), w: Number(fallback.w), h: Number(fallback.h) }
      : fallbackViewBox();
    const lex = renderedAxisLineBox('.lex-axis-line');
    const synt = renderedAxisLineBox('.projection-axis-line.synt');
    const log = renderedAxisLineBox('.logical-axis.log');
    const origin = context?.origin || stableCentralViewOrigin();
    const centralBox = context?.centralLayout?.box || {};
    const theoreticalTop = py(Number(centralBox.minY || 0) - 3.45, origin);
    const theoreticalLeft = Number(context?.westAxisX);
    const theoreticalRight = Number(context?.eastAxisX);
    const theoreticalBottom = Number(context?.southAxisY);

    const left = lex
      ? lex.x
      : (Number.isFinite(theoreticalLeft) ? theoreticalLeft : fallbackBox.x);
    const right = synt
      ? synt.x + synt.w
      : (Number.isFinite(theoreticalRight) ? theoreticalRight : fallbackBox.x + fallbackBox.w);
    const topCandidates = [
      lex?.y,
      synt?.y,
      Number.isFinite(theoreticalTop) ? theoreticalTop : null
    ].filter(Number.isFinite);
    const top = topCandidates.length ? Math.min(...topCandidates) : fallbackBox.y;
    const bottom = log
      ? log.y + log.h
      : (Number.isFinite(theoreticalBottom)
        ? theoreticalBottom
        : Math.max(lex ? lex.y + lex.h : top, synt ? synt.y + synt.h : top, fallbackBox.y + fallbackBox.h));

    if (![left, right, top, bottom].every(Number.isFinite) || right - left < 80 || bottom - top < 80) {
      return fallbackBox;
    }
    return { x: left, y: top, w: right - left, h: bottom - top };
  }

  function stableProjectionAxisFocusBox(fallback = null) {
    try {
      const origin = stableCentralViewOrigin();
      const layouts = [getSouthAwareSyntaxLayout(), getSouthAwareFunctionalLayout()];
      const boxes = layouts.map(layout => layout?.box).filter(Boolean);
      if (!boxes.length) return fallback;
      const union = {
        minX: Math.min(...boxes.map(box => Number(box.minX || 0))),
        minY: Math.min(...boxes.map(box => Number(box.minY || 0))),
        maxX: Math.max(...boxes.map(box => Number(box.maxX || 0))),
        maxY: Math.max(...boxes.map(box => Number(box.maxY || 0)))
      };
      const westAxis = Math.min(...layouts.map(layout => westLexAxisX(layout, origin)));
      // Deze focus wordt uitsluitend door handheldMaximumViewBox gebruikt.
      // Ook landschap en een geforceerde Desktop-interface op een telefoon
      // moeten de volledige LEX-inhoud links en regelboxen rechts bevatten.
      const left = westAxis - activeLexRenderLeftReach();
      const eastAxisRight = px(union.maxX, origin) + 118;
      // v2.0.0-rc.45: in portret hoort niet alleen de groene SYNT-as, maar
      // ook de volledige regelbox rechts ervan in de eerste MAX-fit. Gebruik
      // de unie van Syntax en Functional zodat een viewwissel niet verspringt.
      const syntaxRuleRight = projectedRuleRightEdge(
        layouts[0],
        treeSpec(),
        origin,
        'syntax'
      );
      const functionalRuleRight = projectedRuleRightEdge(
        layouts[1],
        functionalSpec(),
        origin,
        'functional'
      );
      const right = Math.max(eastAxisRight, syntaxRuleRight, functionalRuleRight);
      const top = py(union.minY - 3.45, origin);
      const bottom = py(union.maxY + 2.1, origin);
      if (![left, right, top, bottom].every(Number.isFinite) || right - left < 80 || bottom - top < 80) {
        return fallback;
      }
      return { x: left, y: top, w: right - left, h: bottom - top };
    } catch (_err) {
      return fallback;
    }
  }

  function sizeDynamicGridToBox(box) {
    if (!els.svg || !box) return;
    const fallback = (isMainScreenActive() && state.lastGridBox) ? state.lastGridBox : box;
    const gridBox = projectionAxisGridBox(fallback) || fallback;
    if (isMainScreenActive()) state.lastGridBox = { ...gridBox };
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

  function treeNodeRenderMetrics() {
    return validLayoutDensity() === 'max' ? TREE_NODE_METRICS.max : TREE_NODE_METRICS.standard;
  }

  let subtreeMeasureContext = null;

  function measuredTextWidth(text, fontPx, weight = 800, letterSpacingEm = 0) {
    const value = String(text || '');
    if (!value) return 0;
    let width = value.length * fontPx * 0.62;
    try {
      if (!subtreeMeasureContext) {
        subtreeMeasureContext = document.createElement('canvas').getContext('2d');
      }
      if (subtreeMeasureContext) {
        subtreeMeasureContext.font = `${weight} ${fontPx}px system-ui, -apple-system, "Segoe UI", sans-serif`;
        const measured = subtreeMeasureContext.measureText(value).width;
        if (Number.isFinite(measured) && measured > 0) width = measured;
      }
    } catch (_err) {}
    return width + Math.max(0, value.length - 1) * fontPx * Math.max(0, letterSpacingEm);
  }

  function unionPixelBounds(first, second) {
    if (!first) return second ? { ...second } : null;
    if (!second) return { ...first };
    const x = Math.min(first.x, second.x);
    const y = Math.min(first.y, second.y);
    const right = Math.max(first.x + first.w, second.x + second.w);
    const bottom = Math.max(first.y + first.h, second.y + second.h);
    return { x, y, w: right - x, h: bottom - y };
  }

  function treeNodeIntrinsicBounds(node, origin) {
    const metrics = treeNodeRenderMetrics();
    const fontScale = layoutVisualProfile().fontScale;
    const cx = px(Number(node?.x || 0), origin);
    const cy = py(Number(node?.y || 0), origin);
    let halfWidth;
    let halfHeight;

    if (node?.kind === 'leaf') {
      const labelWidth = state.showLabels
        ? Math.max(
          measuredTextWidth(node.label, 18 * fontScale, 900),
          measuredTextWidth(node.cat, 12 * fontScale, 800)
        )
        : 0;
      halfWidth = Math.max(metrics.leafRadius, labelWidth / 2 + 4);
      halfHeight = metrics.leafRadius;
    } else {
      const fontPx = (node?.kind === 'role' || node?.kind === 'role-root' ? 15 : 16) * fontScale;
      const labelWidth = state.showLabels ? measuredTextWidth(node?.label, fontPx, 900, 0.02) : 0;
      halfWidth = Math.max(metrics.categoryWidth / 2, labelWidth / 2 + 10);
      halfHeight = metrics.categoryHeight / 2;
    }

    return {
      x: cx - halfWidth,
      y: cy - halfHeight,
      w: halfWidth * 2,
      h: halfHeight * 2
    };
  }

  function measureSubtreeBoxes(layout, origin) {
    const nodes = new Map((layout?.nodes || []).map(node => [String(node.id), node]));
    const boxes = new Map(
      (layout?.boxes || [])
        .filter(box => !box.leaf)
        .map(box => [String(box.nodeId), box])
    );
    const children = new Map();
    for (const edge of layout?.edges || []) {
      const parentId = String(edge.from);
      const childId = String(edge.to);
      if (!children.has(parentId)) children.set(parentId, []);
      children.get(parentId).push(childId);
    }

    const geometry = new Map();
    const visualBounds = new Map();
    const visiting = new Set();

    function visit(nodeId) {
      const id = String(nodeId);
      if (visualBounds.has(id)) return visualBounds.get(id);
      if (visiting.has(id)) return null;
      visiting.add(id);

      let content = nodes.has(id) ? treeNodeIntrinsicBounds(nodes.get(id), origin) : null;
      for (const childId of children.get(id) || []) {
        content = unionPixelBounds(content, visit(childId));
      }

      const box = boxes.get(id);
      let visual = content;
      if (box && content) {
        const policy = SUBTREE_MEASURE_POLICY;
        const caption = `BOX ${String(box.label || '').replace(/^BOX\s+/i, '')}`;
        const captionWidth = measuredTextWidth(
          caption,
          policy.captionFontPx * layoutVisualProfile().fontScale,
          800,
          policy.captionLetterSpacingEm
        );
        const x = content.x - policy.inlineGap;
        const y = content.y - policy.blockGap;
        const neededRight = Math.max(
          content.x + content.w + policy.inlineGap,
          x + policy.captionInsetX + captionWidth + policy.captionTailGap
        );
        const neededBottom = Math.max(
          content.y + content.h + policy.blockGap,
          y + policy.captionBaseline + policy.blockGap
        );
        visual = {
          x,
          y,
          w: neededRight - x,
          h: neededBottom - y
        };
        geometry.set(id, {
          ...visual,
          caption,
          captionX: x + policy.captionInsetX,
          captionY: y + policy.captionBaseline
        });
      }

      visiting.delete(id);
      if (visual) visualBounds.set(id, visual);
      return visual;
    }

    const rootId = layout?.node?.id || layout?.nodes?.[0]?.id;
    if (rootId !== undefined) visit(rootId);
    for (const id of nodes.keys()) visit(id);
    return geometry;
  }

  function normalizedSourceAxes(value = state.sourceAxes) {
    const selected = new Set(Array.isArray(value) ? value : []);
    return SOURCE_AXIS_IDS.filter(id => selected.has(id));
  }

  function sourceAxisSet() {
    return new Set(normalizedSourceAxes());
  }

  function activeProjectionAxisSet() {
    if (state.projection === 'axes') return new Set(SOURCE_AXIS_IDS);
    if (SOURCE_AXIS_IDS.includes(state.projection)) return new Set([state.projection]);
    return sourceAxisSet();
  }

  function sourceAxesShortLabel() {
    const selected = normalizedSourceAxes().map(id => id === 'synt' ? 'SYNT' : id.toUpperCase());
    if (!selected.length) return isEnglish() ? 'none' : 'geen';
    if (selected.length === SOURCE_AXIS_IDS.length) return isEnglish() ? 'all' : 'alle';
    return selected.join('+');
  }

  function setSourceAxes(next, options = {}) {
    const previous = normalizedSourceAxes();
    state.sourceAxes = normalizedSourceAxes(next);
    try { localStorage.setItem('opengraph_source_axes_v200rc9', JSON.stringify(state.sourceAxes)); } catch (_err) {}
    if (options.activateSource !== false) state.projection = 'source';
    if (previous.join(',') !== state.sourceAxes.join(',')) recordParadata('set-visible-projections', { visible: state.sourceAxes });
  }

  function applyProjectionAxes(next) {
    const normalized = normalizedSourceAxes(next);
    setSourceAxes(normalized, { activateSource: false });
    if (!normalized.length) setProjection('source');
    else if (normalized.length === SOURCE_AXIS_IDS.length) setProjection('axes');
    else if (normalized.length === 1) setProjection(normalized[0]);
    else setProjection('source');
  }

  function toggleSourceAxis(id) {
    if (!SOURCE_AXIS_IDS.includes(id)) return;
    const selected = activeProjectionAxisSet();
    if (selected.has(id)) selected.delete(id); else selected.add(id);
    applyProjectionAxes([...selected]);
  }

  function growthSupportedProjection(projection = state.projection) {
    return languageTreeActive() && ['axes', 'source', 'log'].includes(projection);
  }

  function growthActive() {
    return !!state.growthEnabled && growthSupportedProjection(state.projection);
  }

  function setProjection(projection) {
    const next = projection || 'axes';
    const previousProjection = state.projection;
    // v2.0.0-rc.14: alle named-projection views delen exact dezelfde
    // viewport. Een projectiewissel mag daarom een handmatige pan/zoom niet
    // wissen en mag de centrale boom horizontaal noch verticaal verplaatsen.
    if (growthSupportedProjection(state.projection) && state.growthStep > 0) {
      state.lastSupportedGrowthStep = state.growthStep;
    }
    state.projection = next;
    if (next === 'axes' && state.projectionBlockUnlocked && !state.growthTimer) {
      state.growthEnabled = false;
      state.growthStep = 0;
    }
    if (!growthSupportedProjection(next)) {
      stopGrowthPlayback();
      return;
    }
    if (state.growthEnabled && state.growthStep === 0 && state.lastSupportedGrowthStep > 0) {
      state.growthStep = Math.min(state.lastSupportedGrowthStep, growthStepMax());
    }
    if (previousProjection !== state.projection) recordParadata('set-projection-mode', { from: previousProjection, to: state.projection });
  }

  function activeCentralSpec() {
    if (state.centerMode === 'ft') return functionalSpec();
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
    const movementCount = orderedLexMovements(activeLexItems()).length;
    const phaseCount = logLexPlayPhases().length;
    // rc.18: na de centrale boom volgen drie expliciete projectiefasen:
    // 1 LOG-as, 2 lege LEX-ruimte reserveren, 3 inhoud op LEX plaatsen.
    // Daarna volgen eventuele LEX-Wissels en ten slotte SYNT/panelen.
    if (state.projection === 'axes') return structureSteps + movementCount + phaseCount + 1;
    if (state.projection === 'log') return structureSteps + 1;
    if (state.projection === 'source') {
      const selected = sourceAxisSet();
      if (selected.has('lex') || selected.has('synt')) return structureSteps + movementCount + phaseCount + 1;
      if (selected.has('log')) return structureSteps + 1;
      return structureSteps;
    }
    return structureSteps;
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

  function stopDirectPlacementPlayback() {
    if (state.directPlacementTimer) {
      clearInterval(state.directPlacementTimer);
      state.directPlacementTimer = null;
    }
  }

  function stopMultiOgnPlayback() {
    if (state.multiOgnPlayTimer) {
      clearTimeout(state.multiOgnPlayTimer);
      state.multiOgnPlayTimer = null;
    }
  }

  function multiOgnPlayPlan(composition = multiOgnAnaphorComposition()) {
    const definition = composition?.definition || activeUtteranceDefinition() || {};
    const hasFlip = definition.type === 'causal-role-flip' || definition.type === 'story-role-flip';
    const plan = [{ id: 'grid' }];
    (composition?.units || []).forEach(unit => {
      plan.push({ id: 'tree', unitId: unit.id, beforeFlip: hasFlip && unit.id === 'K2' });
      if (hasFlip && unit.id === 'K2') plan.push({ id: 'flip', unitId: unit.id });
      plan.push({ id: 'lex', unitId: unit.id });
    });
    plan.push({ id: 'relations' }, { id: 'lex-complete' });
    return plan;
  }

  function multiOgnPlayMax(composition = null) {
    try { return multiOgnPlayPlan(composition || multiOgnAnaphorComposition()).length - 1; }
    catch (_error) { return 5; }
  }

  function multiOgnPlayOperation(composition = null) {
    const plan = multiOgnPlayPlan(composition || multiOgnAnaphorComposition());
    const phase = Math.max(0, Math.min(plan.length - 1, Number(state.multiOgnPlayStep) || 0));
    return { ...plan[phase], phase, max: plan.length - 1 };
  }

  function multiOgnPlayLabel() {
    const operation = multiOgnPlayOperation();
    const labels = {
      grid: isEnglish() ? 'grid / title' : 'raster / titel',
      tree: `${operation.unitId} · ${isEnglish() ? (operation.beforeFlip ? 'tree before Flip' : 'calculate tree') : (operation.beforeFlip ? 'boom vóór Flip' : 'boom berekenen')}`,
      flip: `FLIP ${operation.unitId} · ${isEnglish() ? 'mirror role branches' : 'roltakken spiegelen'}`,
      lex: `LEX ${operation.unitId} · ${isEnglish() ? 'source → realized word and order' : 'bron → gerealiseerd woord en volgorde'}`,
      relations: isEnglish() ? 'align vertical anaphors' : 'verticale anaforen uitlijnen',
      'lex-complete': isEnglish() ? 'LEX · complete realized utterance' : 'LEX · volledige gerealiseerde uiting'
    };
    const pausedOnFlip = operation.id === 'flip' && validMultiOgnFlipHold(state.multiOgnFlipHold) === 'pause'
      && !state.multiOgnPlayTimer && state.multiOgnPlayEnabled;
    const pauseLabel = pausedOnFlip
      ? (isEnglish() ? ' · PAUSED ON FLIP · Play/→ continues' : ' · PAUZE OP FLIP · Play/→ gaat verder')
      : '';
    return `${isEnglish() ? 'step' : 'stap'} ${operation.phase}/${operation.max}: ${labels[operation.id]}${pauseLabel}`;
  }

  function setMultiOgnPlayStep(value, rerender = true) {
    const max = multiOgnPlayMax();
    state.multiOgnPlayEnabled = true;
    state.multiOgnPlayStep = Math.max(0, Math.min(max, Number(value) || 0));
    if (state.multiOgnPlayStep >= max) stopMultiOgnPlayback();
    if (rerender) render();
  }

  function toggleMultiOgnPlayback() {
    if (state.multiOgnPlayTimer) {
      stopMultiOgnPlayback();
      render();
      return;
    }
    state.multiOgnPlayEnabled = true;
    const max = multiOgnPlayMax();
    if (state.multiOgnPlayStep >= max) state.multiOgnPlayStep = 0;
    render();
    const scheduleNext = delay => {
      state.multiOgnPlayTimer = window.setTimeout(() => {
        state.multiOgnPlayTimer = null;
        if (!multiOgnAnaphorActive()) {
          stopMultiOgnPlayback();
          return;
        }
        const nextStep = Math.min(max, state.multiOgnPlayStep + 1);
        setMultiOgnPlayStep(nextStep);
        if (nextStep >= max) return;
        const holdMode = validMultiOgnFlipHold(state.multiOgnFlipHold);
        const nextOperation = multiOgnPlayOperation();
        if (nextOperation.id === 'flip' && holdMode === 'pause') {
          render();
          return;
        }
        scheduleNext(nextOperation.id === 'flip' && holdMode === 'long' ? 3000 : 1200);
      }, delay);
    };
    scheduleNext(multiOgnPlayOperation().id === 'flip' && validMultiOgnFlipHold(state.multiOgnFlipHold) === 'long' ? 3000 : 1200);
    render();
  }

  function placementEngine() {
    const engine = placementModeDefinition().id === 'random'
      ? globalThis.OGNRandomPlacement
      : globalThis.OGNGreedyGrow;
    if (!engine || typeof engine.createState !== 'function' || typeof engine.placeNext !== 'function') {
      throw new Error('De directe OGN-engine is niet geladen.');
    }
    return engine;
  }

  function activeDirectMethodConfig(modeId = placementModeDefinition().id) {
    return modeId === 'random'
      ? normalizeRandomPlacementConfig(state.randomPlacementConfig)
      : normalizeGreedyGrowConfig(state.greedyGrowConfig);
  }

  function directRenderedPoints(direct = ensureDirectPlacementState(), modeId = placementModeDefinition().id) {
    if (!direct) return [];
    const orientation = modeId === 'greedy-grow'
      ? normalizeGreedyGrowConfig(state.greedyGrowConfig).orientation
      : 'original';
    return direct.points.map(point => {
      if (orientation === 'right') return { ...point, x: -point.y, y: point.x };
      if (orientation === 'half') return { ...point, x: -point.x, y: -point.y };
      if (orientation === 'left') return { ...point, x: point.y, y: -point.x };
      return { ...point };
    });
  }

  function directNodeRadius() {
    const general = normalizeDirectPlacementGeneral(state.directPlacementGeneral);
    return DIRECT_NODE_RADIUS[general.nodeSize] || DIRECT_NODE_RADIUS.normal;
  }

  function directGridMargin() {
    const general = normalizeDirectPlacementGeneral(state.directPlacementGeneral);
    return DIRECT_GRID_MARGIN[general.gridMargin] || DIRECT_GRID_MARGIN.normal;
  }

  function randomPlacementDimensions(
    config = normalizeRandomPlacementConfig(state.randomPlacementConfig),
    general = normalizeDirectPlacementGeneral(state.directPlacementGeneral)
  ) {
    if (config.maxDimensions === 'fixed') {
      return {
        maxColumns: Math.max(general.targetCount, config.fixedColumns),
        maxRows: Math.max(general.targetCount, config.fixedRows),
        source: 'fixed'
      };
    }
    if (config.maxDimensions !== 'interface') return { maxColumns: null, maxRows: null, source: 'content' };
    const rect = els.svg?.getBoundingClientRect?.();
    const width = rect?.width > 0 ? rect.width : Math.max(320, Number(window.innerWidth) || 1280);
    const height = rect?.height > 0 ? rect.height : Math.max(240, (Number(window.innerHeight) || 900) - 96);
    const visualRatio = Math.max(0.2, Math.min(5, width / height));
    const coordinateRatio = Math.max(0.1, Math.min(10, visualRatio / ((cellX() / 2) / (cellY() / 2))));
    const minimum = Math.max(1, general.targetCount);
    const maxColumns = coordinateRatio >= 1
      ? Math.ceil(minimum * coordinateRatio)
      : minimum;
    const maxRows = coordinateRatio >= 1
      ? minimum
      : Math.ceil(minimum / coordinateRatio);
    return {
      maxColumns: Math.max(minimum, Math.min(10000, maxColumns)),
      maxRows: Math.max(minimum, Math.min(10000, maxRows)),
      source: 'interface'
    };
  }

  let randomAxisPatternCache = null;

  function randomSeedForIteration(baseSeed, iterationIndex = 0) {
    const base = (Math.floor(Number(baseSeed)) >>> 0) || DEFAULT_RANDOM_PLACEMENT_CONFIG.seed;
    const index = Math.max(0, Math.floor(Number(iterationIndex) || 0));
    return ((base + Math.imul(index, RANDOM_ITERATION_SEED_STEP)) >>> 0) || DEFAULT_RANDOM_PLACEMENT_CONFIG.seed;
  }

  function randomIterationProgress() {
    const config = normalizeRandomPlacementConfig(state.randomPlacementConfig);
    const total = Math.max(1, config.iterationCount);
    const index = Math.max(0, Math.min(total - 1, Math.floor(Number(state.directPlacementIterationIndex) || 0)));
    return { index, number: index + 1, total };
  }

  function randomCompletedIterationCount(direct = state.directPlacementState) {
    const progress = randomIterationProgress();
    const currentComplete = !!direct
      && direct.strategy === 'random'
      && direct.points.length >= direct.targetCount;
    return Math.max(0, Math.min(progress.total, progress.index + (currentComplete ? 1 : 0)));
  }

  function setRandomIteration(iterationIndex = 0, options = {}) {
    const progress = randomIterationProgress();
    const index = Math.max(0, Math.min(progress.total - 1, Math.floor(Number(iterationIndex) || 0)));
    state.directPlacementIterationIndex = index;
    state.directPlacementSeed = randomSeedForIteration(state.directPlacementIterationBaseSeed, index);
    state.directPlacementState = null;
    const direct = ensureDirectPlacementState(true);
    if (options.complete && direct) {
      while (placementEngine().placeNext(direct)) {}
    }
    return direct;
  }

  function resetRandomIterationSeries(options = {}) {
    const config = normalizeRandomPlacementConfig(state.randomPlacementConfig);
    const previousBase = (Math.floor(Number(state.directPlacementIterationBaseSeed)) >>> 0) || config.seed;
    state.directPlacementIterationBaseSeed = options.advanceBase && config.seedPolicy === 'advance'
      ? randomSeedForIteration(previousBase, 1)
      : config.seed;
    state.directPlacementIterationIndex = 0;
    state.directPlacementSeed = randomSeedForIteration(state.directPlacementIterationBaseSeed, 0);
  }

  function advanceRandomIteration() {
    if (validPlacementMode(state.placementMode) !== 'random') return false;
    const progress = randomIterationProgress();
    if (progress.number >= progress.total) return false;
    setRandomIteration(progress.index + 1);
    return true;
  }

  function randomSeriesHistory(
    runCount,
    config = normalizeRandomPlacementConfig(state.randomPlacementConfig),
    general = normalizeDirectPlacementGeneral(state.directPlacementGeneral),
    dimensions = randomPlacementDimensions(config, general)
  ) {
    const engine = globalThis.OGNRandomPlacement;
    const xCounts = new Map();
    const yCounts = new Map();
    const completedRuns = [];
    if (!engine?.createState || !engine?.placeNext) return { xCounts, yCounts, completedRuns };
    const total = Math.max(0, Math.min(config.iterationCount, Math.floor(Number(runCount) || 0)));
    const baseSeed = (Math.floor(Number(state.directPlacementIterationBaseSeed)) >>> 0) || config.seed;
    for (let runIndex = 0; runIndex < total; runIndex += 1) {
      const run = engine.createState({
        targetCount: general.targetCount,
        intervalMs: general.intervalMs,
        seed: randomSeedForIteration(baseSeed, runIndex),
        spread: config.spread,
        distribution: config.distribution,
        priorHitsX: xCounts,
        priorHitsY: yCounts,
        maxColumns: dimensions.maxColumns,
        maxRows: dimensions.maxRows
      });
      while (engine.placeNext(run)) {}
      run.points.slice(1).forEach(point => {
        xCounts.set(point.x, (xCounts.get(point.x) || 0) + 1);
        yCounts.set(point.y, (yCounts.get(point.y) || 0) + 1);
      });
      completedRuns.push(run);
    }
    return { xCounts, yCounts, completedRuns };
  }

  function randomAxisPattern() {
    const config = normalizeRandomPlacementConfig(state.randomPlacementConfig);
    const general = normalizeDirectPlacementGeneral(state.directPlacementGeneral);
    if (config.axisImageMode === 'off') return null;
    const baseSeed = (Math.floor(Number(state.directPlacementIterationBaseSeed)) >>> 0) || config.seed;
    const activeDirect = validPlacementMode(state.placementMode) === 'random' ? state.directPlacementState : null;
    const completedIterationCount = randomCompletedIterationCount(activeDirect);
    const dimensions = activeDirect
      ? { maxColumns: activeDirect.maxColumns, maxRows: activeDirect.maxRows }
      : randomPlacementDimensions(config, general);
    const key = JSON.stringify({
      seed: baseSeed,
      distribution: config.distribution,
      spread: config.spread,
      maxDimensions: config.maxDimensions,
      fixedColumns: config.fixedColumns,
      fixedRows: config.fixedRows,
      maxColumns: dimensions.maxColumns,
      maxRows: dimensions.maxRows,
      targetCount: general.targetCount,
      iterationCount: config.iterationCount,
      completedIterationCount,
      axisImageMode: config.axisImageMode
    });
    if (randomAxisPatternCache?.key === key) return randomAxisPatternCache.value;
    const history = randomSeriesHistory(completedIterationCount, config, general, dimensions);
    const { xCounts, yCounts } = history;
    const value = {
      configuredIterationCount: config.iterationCount,
      completedIterationCount,
      axisImageMode: config.axisImageMode,
      observationsPerAxis: completedIterationCount * Math.max(0, general.targetCount - 1),
      x: [...xCounts.entries()].map(([coordinate, count]) => ({ coordinate, count })).sort((a, b) => a.coordinate - b.coordinate),
      y: [...yCounts.entries()].map(([coordinate, count]) => ({ coordinate, count })).sort((a, b) => a.coordinate - b.coordinate),
      maxCount: Math.max(1, ...xCounts.values(), ...yCounts.values())
    };
    randomAxisPatternCache = { key, value };
    return value;
  }

  function ensureDirectPlacementState(force = false) {
    if (!directPlacementActive()) return null;
    const mode = placementModeDefinition();
    const config = activeDirectMethodConfig(mode.id);
    const general = normalizeDirectPlacementGeneral(state.directPlacementGeneral);
    const strategy = mode.id === 'random' ? 'random' : config.strategy;
    const seedMismatch = mode.id === 'random' && state.directPlacementState?.seed !== state.directPlacementSeed;
    const spreadMismatch = mode.id === 'random' && state.directPlacementState?.spread !== config.spread;
    const distributionMismatch = mode.id === 'random' && state.directPlacementState?.distribution !== config.distribution;
    const dimensions = mode.id === 'random' ? randomPlacementDimensions(config, general) : {};
    const dimensionsMismatch = mode.id === 'random' && (
      state.directPlacementState?.maxColumns !== dimensions.maxColumns
      || state.directPlacementState?.maxRows !== dimensions.maxRows
    );
    if (
      force
      || !state.directPlacementState
      || state.directPlacementState.strategy !== strategy
      || state.directPlacementState.targetCount !== general.targetCount
      || state.directPlacementState.intervalMs !== general.intervalMs
      || seedMismatch
      || spreadMismatch
      || distributionMismatch
      || dimensionsMismatch
    ) {
      const history = mode.id === 'random' && config.distribution === 'impure-repeat-v0.1'
        ? randomSeriesHistory(state.directPlacementIterationIndex, config, general, dimensions)
        : { xCounts: new Map(), yCounts: new Map() };
      state.directPlacementState = placementEngine().createState({
        strategy,
        targetCount: general.targetCount,
        intervalMs: general.intervalMs,
        seed: state.directPlacementSeed,
        spread: mode.id === 'random' ? config.spread : undefined,
        distribution: mode.id === 'random' ? config.distribution : undefined,
        priorHitsX: mode.id === 'random' ? history.xCounts : undefined,
        priorHitsY: mode.id === 'random' ? history.yCounts : undefined,
        maxColumns: dimensions.maxColumns,
        maxRows: dimensions.maxRows
      });
    }
    return state.directPlacementState;
  }

  function directPlacementLabel() {
    const direct = ensureDirectPlacementState();
    if (!direct) return '';
    const mode = placementModeDefinition();
    const step = Math.max(0, direct.points.length - 1);
    const max = Math.max(0, direct.targetCount - 1);
    const method = mode.id === 'random' ? 'Random' : 'Greedy Grow';
    if (mode.id === 'random') {
      const iteration = randomIterationProgress();
      return isEnglish()
        ? `${method} · iteration ${iteration.number}/${iteration.total} · node ${step}/${max}`
        : `${method} · iteratie ${iteration.number}/${iteration.total} · knoop ${step}/${max}`;
    }
    return isEnglish()
      ? `${method} · direct · node ${step}/${max}`
      : `${method} · direct · knoop ${step}/${max}`;
  }

  function resetDirectPlacement(options = {}) {
    stopDirectPlacementPlayback();
    if (placementModeDefinition().id === 'random') resetRandomIterationSeries({ advanceBase: !!options.newSeed });
    state.directPlacementState = null;
    ensureDirectPlacementState(true);
    resetManualViewBox();
  }

  function directPlacementNext(rerender = true) {
    let direct = ensureDirectPlacementState();
    if (!direct) return null;
    let placed = placementEngine().placeNext(direct);
    if (!placed && placementModeDefinition().id === 'random' && advanceRandomIteration()) {
      direct = ensureDirectPlacementState();
      placed = direct ? placementEngine().placeNext(direct) : null;
    }
    if (!placed) stopDirectPlacementPlayback();
    if (rerender) render();
    return placed;
  }

  function directPlacementPrevious(rerender = true) {
    stopDirectPlacementPlayback();
    let direct = ensureDirectPlacementState();
    let removed = direct ? placementEngine().undoLast(direct) : null;
    if (!removed && placementModeDefinition().id === 'random') {
      const iteration = randomIterationProgress();
      if (iteration.index > 0) {
        direct = setRandomIteration(iteration.index - 1, { complete: true });
        removed = direct ? { iterationBoundary: true, iterationIndex: iteration.index - 1 } : null;
      }
    }
    if (rerender) render();
    return removed;
  }

  function toggleDirectPlacementPlayback() {
    let direct = ensureDirectPlacementState();
    if (!direct) return;
    if (state.directPlacementTimer) {
      stopDirectPlacementPlayback();
      render();
      return;
    }
    const randomComplete = placementModeDefinition().id === 'random'
      && randomIterationProgress().number >= randomIterationProgress().total
      && direct.points.length >= direct.targetCount;
    if (direct.points.length >= direct.targetCount && (placementModeDefinition().id !== 'random' || randomComplete)) {
      resetDirectPlacement({ newSeed: placementModeDefinition().id === 'random' });
      direct = ensureDirectPlacementState();
    }
    const first = directPlacementNext(false);
    if (!first) {
      render();
      return;
    }
    state.directPlacementTimer = window.setInterval(() => {
      const placed = directPlacementNext(false);
      if (!placed) {
        stopDirectPlacementPlayback();
        render();
        return;
      }
      render();
    }, direct.intervalMs);
    render();
  }

  function setPlacementMode(value) {
    const next = validPlacementMode(value);
    const previous = validPlacementMode(state.placementMode);
    if (next === previous) {
      closeMainChoiceMenus();
      render();
      return;
    }
    stopGrowthPlayback();
    stopDirectPlacementPlayback();
    stopMultiOgnPlayback();
    state.placementMode = next;
    state.growthEnabled = false;
    state.growthStep = 0;
    state.multiOgnPlayEnabled = false;
    state.multiOgnPlayStep = 999;
    state.projectionBlockUnlocked = false;
    state.selectedNodeId = null;
    state.documentMetadata = null;
    state.directPlacementState = null;
    if (next === 'random') resetRandomIterationSeries();
    if (directPlacementActive()) ensureDirectPlacementState(true);
    resetManualViewBox();
    recordParadata('set-placement-mode', { from: previous, to: next, kind: placementModeDefinition().kind });
    closeMainChoiceMenus();
    render();
  }

  function toggleActivePlacementPlayback() {
    if (directPlacementActive()) toggleDirectPlacementPlayback();
    else if (multiOgnAnaphorActive()) toggleMultiOgnPlayback();
    else if (languageTreeActive()) toggleGrowthPlayback();
  }

  function activePlacementPrevious() {
    if (directPlacementActive()) directPlacementPrevious(true);
    else if (multiOgnAnaphorActive()) { stopMultiOgnPlayback(); setMultiOgnPlayStep(state.multiOgnPlayStep - 1); }
    else if (languageTreeActive()) { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep - 1); }
  }

  function activePlacementNext() {
    if (directPlacementActive()) { stopDirectPlacementPlayback(); directPlacementNext(true); }
    else if (multiOgnAnaphorActive()) { stopMultiOgnPlayback(); setMultiOgnPlayStep(state.multiOgnPlayStep + 1); }
    else if (languageTreeActive()) { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep + 1); }
  }

  function activePlacementReset() {
    if (multiOgnAnaphorActive()) {
      stopMultiOgnPlayback();
      setMultiOgnPlayStep(0);
      return;
    }
    if (directPlacementActive()) {
      resetDirectPlacement({ newSeed: placementModeDefinition().id === 'random' });
      render();
      return;
    }
    if (!languageTreeActive()) return;
    applyProjectionAxes(SOURCE_AXIS_IDS);
    resetForNewExample();
    render();
  }

  function setGrowthStep(value, rerender = true) {
    if (!growthSupportedProjection()) {
      stopGrowthPlayback();
      if (rerender) render();
      return;
    }
    state.growthStep = clampGrowthStep(value);
    const maxStep = growthStepMax();
    if (state.growthStep > 0) state.lastSupportedGrowthStep = state.growthStep;
    // De eindlaag mag alleen op precies de laatste stap ontgrendeld zijn.
    // Bij één stap terug verdwijnt zij dus direct; daarna worden LEX, ruimte,
    // LOG en boom in exact omgekeerde opbouwvolgorde afgebroken.
    state.projectionBlockUnlocked = maxStep > 0 && state.growthStep >= maxStep;
    if (state.growthStep >= maxStep) stopGrowthPlayback();
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
    state.projectionBlockUnlocked = false;
    render();
    state.growthTimer = window.setInterval(() => {
      const currentMax = growthStepMax();
      if (!state.growthEnabled || !growthSupportedProjection()) {
        stopGrowthPlayback();
        render();
        return;
      }
      if (state.growthStep >= currentMax) {
        if (currentMax > 0) state.projectionBlockUnlocked = true;
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
    if (!growthActive()) return { active: false, current: Infinity, max: 0, nodeStep: new Map(), structureStep: 0, logStep: 0, lexBaseStep: 0, lexMovementStartStep: 0, lexMovementCount: 0, projectionStep: 0 };
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const orderedNodes = orderedGrowthNodes(layout, metrics);
    const structureStep = Math.max(1, orderedNodes.length);
    const playPhases = logLexPlayPhases();
    const phaseStep = phase => structureStep + playPhases.indexOf(phase) + 1;
    const logStep = phaseStep('LOG');
    const lexBaseStep = phaseStep('LEX');
    const lexMovementCount = orderedLexMovements(activeLexItems()).length;
    const lexMovementStartStep = structureStep + playPhases.length + 1;
    const projectionStep = structureStep + playPhases.length + lexMovementCount + 1;
    let max = structureStep;
    if (state.projection === 'axes') {
      max = projectionStep;
    } else if (state.projection === 'log') {
      max = logStep;
    } else if (state.projection === 'source') {
      const selected = sourceAxisSet();
      if (selected.has('lex') || selected.has('synt')) max = projectionStep;
      else if (selected.has('log')) max = logStep;
    }
    if (state.growthStep > max) state.growthStep = max;
    const nodeStep = new Map();
    orderedNodes.forEach(({ node }, index) => nodeStep.set(node.id, index + 1));
    return { active: true, current: state.growthStep, max, nodeStep, structureStep, logStep, lexBaseStep, lexMovementStartStep, lexMovementCount, projectionStep };
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
    if (!growthSupportedProjection()) return 'Groei n.v.t.';
    const max = growthStepMax();
    const step = clampGrowthStep(state.growthStep);
    if (!state.growthEnabled) return `Groei uit · max ${max}`;
    if (step === 0) return `stap 0/${max}: raster/titels`;
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const structureStep = metrics.count;
    if (step <= structureStep) return `stap ${step}/${max}: boom groeit knoop voor knoop`;
    const movementCount = orderedLexMovements(activeLexItems()).length;
    const playPhases = logLexPlayPhases();
    const phaseStep = phase => structureStep + playPhases.indexOf(phase) + 1;
    const logStep = phaseStep('LOG');
    const lexBaseStep = phaseStep('LEX');
    const movementStart = structureStep + playPhases.length + 1;
    if (step === logStep) return `${step}/${max} · 1/2 LOG`;
    if (step === lexBaseStep) return `${step}/${max} · 2/2 horizontale LEX-projectie`;
    if (step >= movementStart && step < movementStart + movementCount) {
      const currentMove = step - movementStart + 1;
      return `stap ${step}/${max}: LEX-Wissel ${currentMove}/${movementCount}`;
    }
    return `stap ${step}/${max}: resultaat en projectiepanelen`;
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
    const measured = measureSubtreeBoxes(layout, origin);
    const rectLayer = svgEl('g', { class: 'subtree-box-rect-layer' });
    const captionLayer = svgEl('g', { class: 'subtree-box-caption-layer' });

    for (const { box } of ordered) {
      const boxGeometry = measured.get(String(box.nodeId));
      if (!boxGeometry) continue;
      rectLayer.appendChild(svgEl('rect', {
        x: boxGeometry.x,
        y: boxGeometry.y,
        width: boxGeometry.w,
        height: boxGeometry.h,
        rx: 18,
        class: 'jan-subtree-box',
        'data-box-node-id': box.nodeId,
        'data-measure-mode': 'recursive-content',
        'data-required-width': Math.round(boxGeometry.w * 100) / 100,
        'data-required-height': Math.round(boxGeometry.h * 100) / 100
      }));
    }

    for (const { box } of ordered) {
      const boxGeometry = measured.get(String(box.nodeId));
      if (!boxGeometry) continue;
      captionLayer.appendChild(svgEl('text', {
        x: boxGeometry.captionX,
        y: boxGeometry.captionY,
        class: 'jan-box-caption',
        'data-box-node-id': box.nodeId
      }, boxGeometry.caption));
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
        class: 'tree-edge syntax-tree-edge',
        'data-from-node-id': edge.from,
        'data-to-node-id': edge.to
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
    // rc.14: bijwoord-minors staan op LOG en projecteren vandaar naar LEX.
    // Een scopehost tekent geen syntaxknoop en reserveert geen boomruimte.
    return;
  }

  function drawTreeNodes(g, layout, origin, selectable = true, growthPlan = null, renderMetrics = null) {
    assertUniqueNodeGridLines(layout, 'renderlaag');
    const ordered = orderedTreeNodes(layout).filter(({ node }) => visibleAt(growthPlan, nodeGrowthStep(growthPlan, node.id)));
    const shapeLayer = svgEl('g', { class: 'node-shape-layer' });
    const labelLayer = svgEl('g', { class: 'node-label-layer' });
    const metrics = renderMetrics || treeNodeRenderMetrics();
    const { leafRadius, categoryWidth, categoryHeight } = metrics;

    for (const { node } of ordered) {
      const cx = px(node.x, origin);
      const cy = py(node.y, origin);
      const group = makeSelectable(svgEl('g', { class: `${nodeRenderClass(node)} node-shape`, 'data-node-id': node.id }), node, selectable);
      if (node.kind === 'leaf') {
        group.appendChild(svgEl('circle', { cx, cy, r: leafRadius, class: 'node-circle' }));
      } else {
        const boxClass = node.kind === 'role-root' ? 'synt-box role-root-box' : (node.kind === 'role' ? 'synt-box role-box' : 'synt-box category-box');
        group.appendChild(svgEl('rect', {
          x: cx - categoryWidth / 2,
          y: cy - categoryHeight / 2,
          width: categoryWidth,
          height: categoryHeight,
          rx: metrics.cornerRadius,
          class: boxClass
        }));
      }
      shapeLayer.appendChild(group);
    }

    for (const { node } of ordered) {
      const cx = px(node.x, origin);
      const cy = py(node.y, origin);
      const group = makeSelectable(svgEl('g', { class: `${nodeRenderClass(node)} node-label`, 'data-node-id': node.id }), node, selectable);
      if (node.kind === 'leaf') {
        group.appendChild(svgEl('text', { x: cx, y: cy - 2, class: 'node-main-label' }, node.label));
        group.appendChild(svgEl('text', {
          x: cx, y: cy + (renderMetrics ? Math.max(11, Math.round(leafRadius * 0.62)) : 18),
          class: 'node-sub-label'
        }, node.cat));
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
    if (featureEnabled('adverbs')) drawHostedAdverbSlots(g, layout, origin, growthPlan);
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

  function drawGraphSentence(g, layout, origin = stableCentralViewOrigin()) {
    if (!g || !layout?.box) return;
    const sentence = activeSentenceText();
    if (!sentence) return;
    const centerX = px((Number(layout.box.minX || 0) + Number(layout.box.maxX || 0)) / 2, origin);
    const treeTopY = py(Number(layout.box.minY || 0), origin);
    // De strook direct boven de boom blijft vrij voor een eventuele noord-as.
    // De zin staat daar nog boven en hoort dus niet bij een named projection.
    const sentenceY = treeTopY - 112;
    const width = Math.min(1120, Math.max(360, sentence.length * 15 + 64));
    const group = svgEl('g', {
      class: 'graph-sentence-heading',
      'data-north-axis-clearance': '64'
    });
    group.appendChild(svgEl('rect', {
      x: centerX - width / 2,
      y: sentenceY - 30,
      width,
      height: 48,
      rx: 15,
      class: 'graph-sentence-box'
    }));
    group.appendChild(svgEl('text', {
      x: centerX,
      y: sentenceY + 2,
      class: 'graph-sentence-text'
    }, sentence));
    g.appendChild(group);
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
    const specs = activeLexInsertionSpecs();
    if (!specs.length) return [];
    if (logicalAuthorityEnabled()) {
      const plan = logicalLexPlan(items);
      const baseOriginY = logicalLexBaseOriginY(y0, sourceMap, items);
      const fronted = activeAdverbIsFronted() && isMainV2Rule() && plan.minorRows.length === 1;
      return plan.minorRows.map((minor, index) => {
        const origin = normalizeInsertionOrigin(minor.origin || 'LOG');
        const baseY = baseOriginY + minor.row * logLexSlotPixels();
        const targetY = fronted ? projectedTopicSlotY(y0, sourceMap, items) : baseY;
        return {
          id: minor.id || `log-minor-${index + 1}`,
          y: targetY,
          baseY,
          label: `${origin} ${minor.short || `m${index + 1}`} · ${minor.logInterval || minor.interval}`,
          hostLabel: '',
          linearZone: origin === 'LEX'
            ? `direct LEX-slot ${minor.logicalSlot} · ${minor.logInterval || minor.interval}`
            : `${origin}-slot ${minor.logicalSlot} · ${minor.logInterval || minor.interval}`,
          content: minor.content || insertionContentForSpec(minor),
          marked: !!minor.marked,
          marking: minor.marking || 'logical:minor-slot',
          toggleTargetId: minor.toggleTargetId || '',
          toggleLabel: minor.toggleLabel || '',
          axis: 'LEX',
          source: origin,
          usageProfile: minor.usageProfile || '',
          originComponents: minor.originComponents || '',
          logicalSlot: minor.logicalSlot,
          logInterval: minor.logInterval || minor.interval,
          movement: fronted ? 'Wissel BIJWOORD → slot 1' : ''
        };
      });
    }
    const single = specs.length === 1 ? specs[0] : null;
    const singleContent = single?.content || (single ? insertionContentForSpec(single) : null);
    if (single && activeAdverbIsNeutralNiet()) {
      const slotY = lexPostObjectNegationSlotY(y0, sourceMap, items);
      return [{ id: 'lex-adverb-negation-slot-1', y: slotY, label: 'stap 1 · NIET na object / vóór V-cluster', hostLabel: 'VP · negatiescope', content: singleContent, marked: false, marking: activeAdverbData()?.marking || 'functional:neg-scope-default', toggleTargetId: findAdverbMarkedToggleTarget()?.id || '', toggleLabel: adverbMarkedToggleLabel(), axis: 'LEX', source: 'external-negation' }];
    }
    if (single && activeAdverbIsFronted() && isMainV2Rule()) {
      const slotY = projectedFrontedAdverbSlotY(y0, sourceMap, items);
      return [{ id: 'lex-adverb-fronted-slot-1', y: slotY, label: 'stap 1 · BIJWOORD voorop', hostLabel: 'S/V2', content: singleContent, marked: adverbOptionIsMarked(activeAdverbOption()), marking: activeAdverbData()?.marking || 'functional:fronted-v2', toggleTargetId: findAdverbMarkedToggleTarget()?.id || '', toggleLabel: adverbMarkedToggleLabel(), axis: 'LEX', source: 'external-fronted-adverb' }];
    }
    const stored = sourceMap?.get?.('__lexAdverbAxisSlots')?.slots || [];
    if (stored.length) {
      return stored.map((slot, index) => ({
        id: slot.id || `lex-adverb-axis-slot-${index + 1}`, y: slot.py,
        label: slot.label || `stap 1 · LEX-insertie ${index + 1}`,
        hostLabel: slot.hostLabel || '', linearZone: slot.linearZone || '',
        content: slot.contentDef || insertionContentForSpec({ id: slot.content, text: slot.text, sub: slot.sub }),
        marked: !!slot.marked, marking: slot.marking || 'functional:default-host',
        toggleTargetId: slot.toggleTargetId || '', toggleLabel: slot.toggleLabel || '', axis: 'LEX', source: 'external'
      }));
    }
    return specs.map((spec, index) => ({
      id: spec.id || `lex-adverb-axis-slot-${index + 1}`, y: y0 + 40 + index * 72,
      label: `stap 1 · LEX-insertie ${index + 1}`,
      hostLabel: spec.host || adverbHostLabelFromPlacement(spec.placement, spec.content),
      linearZone: insertionLinearZone(spec), content: spec.content || insertionContentForSpec(spec),
      marked: !!spec.marked, marking: spec.marking || 'functional:default-host',
      toggleTargetId: '', toggleLabel: '', axis: 'LEX', source: 'external'
    }));
  }

  function lexConfiguredOpenSlots(y0, occupiedYs = []) {
    void y0;
    void occupiedYs;
    return [];
  }

  function drawLexOpenSlot(g, x, slot) {
    const label = isEnglish() ? `free position E${slot.index}` : `vrije plek E${slot.index}`;
    const detail = isEnglish()
      ? 'Additional empty LEX position; no content, source, or placement rule is attached.'
      : 'Extra lege LEX-plek; er is geen inhoud, bron of plaatsingsregel aan gekoppeld.';
    const group = svgEl('g', {
      class: 'lex-open-slot-group',
      'data-slot-kind': slot.kind,
      'data-slot-placement': slot.placement
    });
    group.appendChild(svgEl('title', {}, detail));
    group.appendChild(svgEl('rect', { x: x - 90, y: slot.y - 23, width: 180, height: 46, rx: 14, class: 'lex-free-slot lex-open-slot' }));
    group.appendChild(svgEl('text', { x, y: slot.y - 30, class: 'slot-caption lex-open-slot-caption' }, label));
    group.appendChild(svgEl('text', { x, y: slot.y + 5, class: 'lex-local-label lex-open-slot-label' }, isEnglish() ? 'OPEN' : 'VRIJ'));
    g.appendChild(group);
  }

  function drawLexConfiguredFreeSlot(g, x, slot) {
    const content = slot.content || lexInsertionContentDef();
    const marked = slot.marked ? (isEnglish() ? ' · marked' : ' · gemarkeerd') : '';
    const toggleLabel = slot.toggleLabel || adverbMarkedToggleLabel();
    const hasToggle = !!slot.toggleTargetId;
    const detail = slot.source === 'LOG'
      ? `afgeleid uit LOG · ${slot.logInterval || 'minor-slot'}${slot.movement ? ' · daarna Wissel' : ''}${marked}`
      : slot.source === 'LOG+LEX'
        ? `gemengde bron LOG+LEX · ${slot.originComponents || 'één zichtbare groep'}${marked}`
        : slot.source === 'LEX'
          ? `directe LEX-insertie · geen LOG-minor${marked}`
          : slot.linearZone
      ? `extern · LEX-as · ${slot.linearZone} · vóór Wissels${marked}`
      : slot.hostLabel
        ? `extern · LEX-as · vóór Wissels · boven ${slot.hostLabel}${marked}`
        : (lexInsertionContentSub(content) || 'andere LEX-as / anafoor');
    const sub = slot.source === 'LOG'
      ? `LOG · ${slot.logInterval || 'minor'}${slot.movement ? ' → Wissel' : ''}${marked}`
      : slot.source === 'LOG+LEX'
        ? `LOG+LEX · één groep${marked}`
        : slot.source === 'LEX'
          ? `LEX · geen LOG-minor${marked}`
          : slot.linearZone
            ? `LEX · ${slot.linearZone}${marked}`
            : slot.hostLabel
              ? `LEX · boven ${slot.hostLabel}${marked}`
              : (lexInsertionContentSub(content) || 'LEX-insertie');
    const toggleHelp = slot.marked
      ? (isEnglish() ? 'click: default' : 'klik: default')
      : (isEnglish() ? 'click: marked' : 'klik: gemarkeerd');
    if (slot.movement && Number.isFinite(slot.baseY) && Math.abs(slot.baseY - slot.y) > 1) {
      drawLexTrace(g, x, slot.baseY, `t[${content.text || 'ADV'}]`, 'trace · LOG-basis');
      drawLexWissel(g, x, slot.baseY, slot.y, slot.movement);
    }
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
    group.appendChild(svgEl('title', {}, hasToggle ? `${detail}. ${toggleLabel}` : detail));
    group.appendChild(svgEl('rect', { x: x - 122, y: slot.y - 30, width: 244, height: 60, rx: 17, class: 'lex-free-slot lex-config-free-slot lex-insertion-box lex-adverb-axis-slot' }));
    group.appendChild(svgEl('text', { x, y: slot.y - 38, class: 'slot-caption' }, slot.label));
    group.appendChild(svgEl('text', { x, y: slot.y - 4, class: 'lex-local-label' }, content.text || 'INSERTIEPUNT'));
    group.appendChild(svgEl('text', { x, y: slot.y + 15, class: 'lex-free-slot-sub' }, sub));
    if (hasToggle) {
      group.appendChild(svgEl('text', { x: x + 94, y: slot.y - 10, class: 'lex-adverb-toggle-marker' }, slot.marked ? '!' : '↯'));
      group.appendChild(svgEl('text', { x, y: slot.y + 31, class: 'lex-adverb-toggle-help' }, toggleHelp));
    }
    g.appendChild(group);
  }

  function drawLexTopicSlot(g, x, y) {
    g.appendChild(svgEl('rect', { x: x - 98, y: y - 27, width: 196, height: 54, rx: 16, class: 'lex-free-slot topic-slot' }));
    g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 1 · eerste zinsdeel'));
    g.appendChild(svgEl('text', { x, y: y + 5, class: 'lex-local-label' }, 'positie-1-doel'));
  }

  function drawLexV2Slot(g, x, y) {
    g.appendChild(svgEl('rect', { x: x - 98, y: y - 27, width: 196, height: 54, rx: 16, class: 'lex-free-slot v2-slot' }));
    g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 2 · V2/PV'));
    g.appendChild(svgEl('text', { x, y: y + 5, class: 'lex-local-label' }, 'V2-doel'));
  }

  function drawLexV1Slot(g, x, y) {
    g.appendChild(svgEl('rect', { x: x - 98, y: y - 27, width: 196, height: 54, rx: 16, class: 'lex-free-slot v2-slot' }));
    g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 1 · V1/PV · vraagzin'));
    g.appendChild(svgEl('text', { x, y: y + 5, class: 'lex-local-label' }, 'V1-doel'));
  }

  function isMainV2Rule(rule = state.example?.lexRule) {
    return rule === 'hoofdzininvariant' || rule === 'perfectum-heeft-vdw';
  }

  function isQuestionV1Rule(rule = state.example?.lexRule) {
    return rule === 'vraagzin-v1';
  }

  function isFiniteVerbForV2(item) {
    if (!item) return false;
    const source = String(item.source || '').toLowerCase();
    const role = String(item.role || '').toLowerCase();
    if (source === 'pv' || role === 'aux') return true;
    return source === 'predicate' && role === 'predicate';
  }

  function topicMovementForItem(item, index) {
    // Het eerste zinsdeel van een hoofdzin bezet de eerste lineaire positie.
    // Bij een gewoon subject is dit positieplaatsing, geen topicalisatie; een
    // vooropgeplaatst niet-subject (TRUI in TRUI BREIT VROUW) is wel TOPIC.
    if (!isMainV2Rule()) return null;
    if (activeAdverbIsFronted()) return null;
    if (index !== 0 || !item?.source) return null;
    const source = String(item.source || '').toLowerCase();
    const role = String(item.role || '').toLowerCase();
    if (source === 'subject' || role === 'subject') {
      return { kind: 'subject-position', slot: 'topic', caption: 'Plaats subject → positie 1', trace: `t[${item.role || item.source}]` };
    }
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

  function showV1Slot(items = state.example?.lexItems || []) {
    return items.findIndex((item, i) => movementForItem(item, i)?.slot === 'v1') >= 0;
  }

  function lexSlotBaseOffset(items = state.example?.lexItems || []) {
    let offset = 0;
    if (hasCompItem(items)) offset += 1;
    if (showTopicSlot(items)) offset += 1;
    if (showV1Slot(items) || showV2Slot(items)) offset += 1;
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

  function v1SlotY(y0, items = state.example?.lexItems || []) {
    return y0 + (hasCompItem(items) ? 64 : 0);
  }

  function lexMovementRank(movement) {
    if (!movement) return 99;
    if (movement.slot === 'topic') return 1;
    if (movement.slot === 'v1') return 1;
    if (movement.slot === 'v2') return 2;
    if (movement.slot === 'comp') return 0;
    return 10;
  }

  function logicalPlacementMovementForItem(item, index, items = state.example?.lexItems || []) {
    if (!logicalAuthorityEnabled() || !item?.source) return null;
    // Een LOG-rij is eerst plannings-/reserveringsinformatie. Zij is geen
    // zelfstandige toestemming om een bronknoop van zijn horizontale
    // bronhoogte te halen. Alleen een expliciete Language-Tree-regel (zoals
    // positie 1, TOPIC, V1 of V2) maakt van dat plan een zichtbare
    // LEX-Wissel omhoog. In HOND BIJT MAN gaat HOND naar positie 1, BIJT naar
    // V2 en blijft alleen MAN exact bronuitgelijnd.
    const explicit = movementForItem(item, index, items);
    if (!explicit) return null;
    const logicalRow = logicalLexPlan(items).byIndex.get(index);
    if (!Number.isFinite(logicalRow)) return null;
    const word = String(item.label || item.role || item.source || 'LEX').toUpperCase();
    return {
      kind: 'log-placement',
      slot: 'logical',
      logicalRow,
      caption: 'Wissel LOG → LEX',
      trace: `t[${word}]`
    };
  }

  function orderedLexMovements(items = state.example?.lexItems || []) {
    // Eén bronwoord krijgt hoogstens één zichtbare LEX-verplaatsing. LOG
    // reserveert mogelijke doelrijen, maar alleen een expliciete
    // Language-Tree-regel mag een bronwoord werkelijk verplaatsen.
    return items
      .map((item, index) => {
        const logical = logicalPlacementMovementForItem(item, index, items);
        const explicit = movementForItem(item, index, items);
        return {
          item,
          index,
          stage: 'combined',
          logical,
          explicit,
          movement: explicit || logical
        };
      })
      .filter(entry => entry.item?.source && entry.movement)
      .sort((a, b) => {
        const aRank = a.explicit ? lexMovementRank(a.explicit) : 20 + Number(a.logical?.logicalRow || 0);
        const bRank = b.explicit ? lexMovementRank(b.explicit) : 20 + Number(b.logical?.logicalRow || 0);
        return aRank - bRank || a.index - b.index;
      });
  }

  function movementOrderIndex(item, index, _stage, items = state.example?.lexItems || []) {
    return orderedLexMovements(items).findIndex(entry => entry.item === item && entry.index === index);
  }

  function appliedMovementForItem(item, index, items = state.example?.lexItems || [], options = {}) {
    const movement = movementForItem(item, index, items);
    if (!movement) return null;
    if (typeof options.executedMovementCount !== 'number') return movement;
    const moveIndex = movementOrderIndex(item, index, 'combined', items);
    return moveIndex >= 0 && moveIndex < options.executedMovementCount ? movement : null;
  }

  function appliedLogicalPlacementForItem(item, index, items = state.example?.lexItems || [], options = {}) {
    const movement = logicalPlacementMovementForItem(item, index, items);
    if (!movement) return null;
    if (typeof options.executedMovementCount !== 'number') return movement;
    const moveIndex = movementOrderIndex(item, index, 'combined', items);
    return moveIndex >= 0 && moveIndex < options.executedMovementCount ? movement : null;
  }

  function movementForItem(item, index, items = activeLexItems()) {
    if (!item?.source) return null;
    // LOG kan LEX-ruimte reserveren. Alleen de expliciete plaatsingsregels
    // topic/vooropplaatsing, V1 en V2 voeren een zichtbare Wissel omhoog uit;
    // overige bronitems blijven op hun horizontale bronhoogte.
    const topic = topicMovementForItem(item, index);
    if (topic) return topic;
    if (isQuestionV1Rule() && isFiniteVerbForV2(item)) {
      return { kind: 'v1', slot: 'v1', caption: 'Wissel V1', trace: item.source === 'pv' ? 't[pv]' : 't[V]' };
    }
    if (isMainV2Rule() && isFiniteVerbForV2(item)) {
      return { kind: 'v2', slot: 'v2', caption: 'Wissel V2', trace: item.source === 'pv' ? 't[pv]' : 't[V]' };
    }
    // Downward/post-V2 is voorlopig niet actief. Een voorop geplaatste
    // insertie verplaatst de overige bronwoorden daarom niet naar lagere rijen.
    return null;
  }

  function sourceAlignedLexY(item, index, y0, sourceMap = null, items = state.example?.lexItems || []) {
    return projectionAnchorY(item, index, y0, sourceMap, items);
  }

  function localTraceY(item, index, y0, items = state.example?.lexItems || [], sourceMap = null) {
    // De eerste trace blijft exact op de horizontale bronprojectie staan.
    return projectionAnchorY(item, index, y0, sourceMap, items);
  }

  function logicalLexBaseOriginY(y0, sourceMap = null, items = state.example?.lexItems || []) {
    const step = logLexSlotPixels();
    const rootY = projectedLexRootY(sourceMap);
    if (rootY !== null) {
      const rowsBelowRoot = 1 + (showTopicSlot(items) ? 1 : 0) + ((showV1Slot(items) || showV2Slot(items)) ? 1 : 0);
      return rootY + rowsBelowRoot * step;
    }
    return y0 + lexSlotBaseOffset(items) * step;
  }

  function baseLexY(item, index, y0, sourceMap = null, items = state.example?.lexItems || []) {
    if (!item?.source) {
      return item?.slot === 'comp'
        ? (sourceMap ? projectedCompSlotY(y0, sourceMap) : compSlotY(y0))
        : lexWordOrderY(index, y0);
    }
    if (logicalAuthorityEnabled() && item?.source) {
      const plan = logicalLexPlan(items);
      const row = plan.byIndex.get(index);
      if (Number.isFinite(row)) return logicalLexBaseOriginY(y0, sourceMap, items) + row * logLexSlotPixels();
    }
    // Zonder LOG-doel blijft de bronprojectie horizontaal. Zonder centrale
    // bronboom valt de losse LEX-view terug op een leesbare bronvolgorde.
    if (item?.source && sourceMap) {
      const p = sourceMap.get(item.source);
      if (p && Number.isFinite(p.py)) return p.py;
    }
    const baseOffset = lexSlotBaseOffset(items);
    const baseIndex = basisSourceIndex(item, index);
    return y0 + (baseOffset + baseIndex) * 64;
  }

  function projectionAnchorY(item, index, y0, sourceMap = null, items = state.example?.lexItems || []) {
    if (!item?.source) {
      return item?.slot === 'comp'
        ? (sourceMap ? projectedCompSlotY(y0, sourceMap) : compSlotY(y0))
        : lexWordOrderY(index, y0);
    }
    if (horizontalLexProjectionEnabled() && sourceMap) {
      const sourcePoint = sourceMap.get(item.source);
      if (sourcePoint && Number.isFinite(sourcePoint.py)) return sourcePoint.py;
    }
    const baseOffset = lexSlotBaseOffset(items);
    const baseIndex = basisSourceIndex(item, index);
    return y0 + (baseOffset + baseIndex) * 64;
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
    const sourceY = projectionAnchorY(item, index, y0, sourceMap, items);
    const logicalPlacement = appliedLogicalPlacementForItem(item, index, items, options);
    const neutralY = logicalPlacement
      ? baseLexY(item, index, y0, sourceMap, items)
      : sourceY;
    const movement = appliedMovementForItem(item, index, items, options);
    let targetY = neutralY;
    if (movement?.slot === 'topic') targetY = topicSlotY(y0, items);
    if (movement?.slot === 'v1') targetY = v1SlotY(y0, items);
    if (movement?.slot === 'v2') targetY = v2SlotY(y0, items);
    // Upward wordt altijd gemeten vanaf de zichtbaar geprojecteerde bronknoop.
    // Een door LOG gereserveerde rij mag een lager doel dus nooit legitimeren.
    return targetY < sourceY ? targetY : sourceY;
  }

  function lexItemY(item, index, y0, sourceMap = null, items = state.example?.lexItems || [], options = {}) {
    return lexTargetY(item, index, y0, sourceMap, items, options);
  }

  function lexSlotIndex(item, index, items = [], movementOverride = undefined) {
    const movement = movementOverride === undefined ? movementForItem(item, index) : movementOverride;
    if (item.slot === 'comp') return '0';
    if (movement?.slot === 'topic') return '1';
    if (movement?.slot === 'v1') return '1';
    if (movement?.slot === 'v2') return '2';
    if (movement?.slot === 'local') return String(index + 1);
    if (logicalAuthorityEnabled() && item?.source) {
      const logicalRow = logicalLexPlan(items).byIndex.get(index);
      if (Number.isFinite(logicalRow)) return `L${logicalRow}`;
    }
    if (item?.source) return `b${basisSourceIndex(item, index) + 1}`;
    const hasComp = items[0]?.slot === 'comp';
    return String(hasComp ? index : index + 1);
  }

  function localAxisMovement(item, index, fromY, toY, items = state.example?.lexItems || [], options = {}) {
    return {
      logical: appliedLogicalPlacementForItem(item, index, items, options),
      explicit: appliedMovementForItem(item, index, items, options),
      fromY,
      toY
    };
  }

  function drawLexTrace(g, x, y, label, caption = 'trace') {
    const group = svgEl('g', { class: 'lex-trace-marker' });
    group.appendChild(svgEl('title', {}, `${caption}: ${label}`));
    group.appendChild(svgEl('line', {
      x1: x - 14,
      y1: y,
      x2: x + 14,
      y2: y,
      class: 'lex-trace-tick'
    }));
    group.appendChild(svgEl('text', { x: x - 14, y: y + 5, class: 'lex-trace-label' }, label));
    g.appendChild(group);
  }

  function drawLexWissel(g, x, fromY, toY, label, lane = 0) {
    // Downward en same-row zijn in het actieve profiel niet beschikbaar.
    if (!(toY < fromY - 1)) return;
    const safeLane = Math.max(0, lane);
    const sideX = x + LEX_MOVEMENT_LANE_START + (safeLane % 4) * LEX_MOVEMENT_LANE_STEP;
    const displayDirection = 'up';
    const directionLabel = isEnglish() ? 'earlier/up on LEX' : 'eerder/omhoog op LEX';
    const directionCaveat = isEnglish()
      ? 'Active profile: upward display switches only.'
      : 'Actief profiel: uitsluitend zichtbare Wissels omhoog.';
    const group = svgEl('g', {
      class: 'lex-wissel-movement',
      'data-movement-label': label,
      'data-display-direction': displayDirection
    });
    group.appendChild(svgEl('title', {}, `${label} · ${directionLabel}. ${directionCaveat}`));
    group.appendChild(pathEl(`M ${sideX} ${fromY} C ${sideX + LEX_MOVEMENT_CURVE_REACH} ${fromY} ${sideX + LEX_MOVEMENT_CURVE_REACH} ${toY} ${sideX} ${toY}`, { class: 'lex-wissel-line' }));
    group.appendChild(svgEl('polygon', { points: `${sideX},${toY} ${sideX + 9},${toY - 6} ${sideX + 9},${toY + 6}`, class: 'lex-wissel-arrow' }));
    group.appendChild(svgEl('text', {
      x: sideX + LEX_MOVEMENT_LABEL_OFFSET,
      y: (fromY + toY) / 2 + 4,
      class: 'lex-wissel-step-label'
    }, `LEX ${safeLane + 1}`));
    g.appendChild(group);
  }


  function movementSummary() {
    const items = activeLexItems();
    const moved = orderedLexMovements(items);
    const explicit = items.map((item, index) => movementForItem(item, index, items)).filter(Boolean);
    const type = sentenceTypeForExample();
    const choice = activeTreeChoice() === 'auto-min' ? 'auto-type' : 'structure-config';
    return { count: moved.length, explicitCount: explicit.length, type, choice };
  }

  function movementSummaryLabel() {
    const m = movementSummary();
    return `boomkeuze=${m.choice} · type=${m.type} · LEX-verplaatsingen=${m.count}`;
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
    return rootY === null ? topicSlotY(y0, items) : rootY - 64;
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
    return rootY;
  }

  function projectedV1SlotY(y0, sourceMap = null, items = state.example?.lexItems || []) {
    const rootY = projectedLexRootY(sourceMap);
    return rootY === null ? v1SlotY(y0, items) : rootY;
  }

  function projectedLexItemY(item, index, y0, sourceMap = null, items = state.example?.lexItems || [], options = {}) {
    if (!item?.source) return item.slot === 'comp' ? projectedCompSlotY(y0, sourceMap) : lexWordOrderY(index, y0);
    const sourceY = projectionAnchorY(item, index, y0, sourceMap, items);
    const logicalPlacement = appliedLogicalPlacementForItem(item, index, items, options);
    const neutralY = logicalPlacement
      ? baseLexY(item, index, y0, sourceMap, items)
      : sourceY;
    const movement = appliedMovementForItem(item, index, items, options);
    let targetY = neutralY;
    if (movement?.slot === 'topic') targetY = projectedTopicSlotY(y0, sourceMap, items);
    if (movement?.slot === 'v1') targetY = projectedV1SlotY(y0, sourceMap, items);
    if (movement?.slot === 'v2') targetY = projectedV2SlotY(y0, sourceMap, items);
    // Hard actief contract: een Wissel mag uitsluitend omhoog vanaf de
    // zichtbare bronhoogte; een LOG-reservering verandert die grens niet.
    return targetY < sourceY ? targetY : sourceY;
  }

  function drawLexAxis(g, x, y0, items, sourceMap = null, options = {}) {
    const horizontalProjectionMode = !!sourceMap && horizontalLexProjectionEnabled();
    const systemY0 = sourceMap ? projectedLexSystemY0(y0, sourceMap) : y0;

    const itemYs = items.map((item, i) => projectedLexItemY(item, i, y0, sourceMap, items, options));
    const baseYs = items.map((item, i) => baseLexY(item, i, y0, sourceMap, items));
    const projectionYs = items.map((item, i) => projectionAnchorY(item, i, y0, sourceMap, items));
    const frontedAdverb = activeAdverbIsFronted() && isMainV2Rule();
    const topicIndex = isMainV2Rule() ? items.findIndex((item, i) => movementForItem(item, i)?.slot === 'topic') : -1;
    const v1Index = isQuestionV1Rule() ? items.findIndex((item, i) => movementForItem(item, i)?.slot === 'v1') : -1;
    const v2Index = isMainV2Rule() ? items.findIndex((item, i) => movementForItem(item, i)?.slot === 'v2') : -1;
    const topicSlotY = (topicIndex >= 0 || frontedAdverb) ? projectedTopicSlotY(y0, sourceMap, items) : null;
    const v1SlotY = v1Index >= 0 ? projectedV1SlotY(y0, sourceMap, items) : null;
    const v2SlotY = v2Index >= 0 ? projectedV2SlotY(y0, sourceMap, items) : null;
    const configuredSlots = lexConfiguredFreeSlots(systemY0, items, [...itemYs, ...baseYs, ...projectionYs, ...(topicSlotY === null ? [] : [topicSlotY]), ...(v1SlotY === null ? [] : [v1SlotY]), ...(v2SlotY === null ? [] : [v2SlotY])], sourceMap);
    const occupiedYs = [...itemYs, ...baseYs, ...projectionYs, ...configuredSlots.map(slot => slot.y), ...(topicSlotY === null ? [] : [topicSlotY]), ...(v1SlotY === null ? [] : [v1SlotY]), ...(v2SlotY === null ? [] : [v2SlotY])];
    const openSlots = lexConfiguredOpenSlots(systemY0, occupiedYs);
    const axisYs = [...occupiedYs, ...openSlots.map(slot => slot.y), systemY0 - 48, systemY0 + Math.max(4, items.length + 1) * 64 + 40];
    const axisMinY = Math.min(...axisYs) - 36;
    const axisMaxY = Math.max(...axisYs) + 44;
    drawAxisTitle(g, x - 98, axisMinY - 28, logicalAuthorityEnabled()
      ? 'LEX-projectie · bronhoogte → alleen een expliciete Wissel mag verplaatsen'
      : (horizontalProjectionMode ? 'LEX-projectie · projectiemerkers + Wisselregels' : 'LEX-as · lokale plaatsingsregels'));
    g.appendChild(svgEl('line', {
      x1: x,
      y1: axisMinY,
      x2: x,
      y2: axisMaxY,
      class: 'lex-axis-line',
      'data-render-right-reach': activeLexRenderRightReach(),
      'data-tree-clearance': LEX_TREE_CLEARANCE
    }));

    const positions = new Map();
    // LOG levert doelrijen. De inhoud verschijnt eerst op de exact
    // horizontale bronprojectie en verhuist daarna uitsluitend langs LEX.
    openSlots.forEach(slot => drawLexOpenSlot(g, x, slot));
    configuredSlots.forEach(slot => drawLexConfiguredFreeSlot(g, x, slot));
    const topicOccupied = topicIndex >= 0
      && appliedMovementForItem(items[topicIndex], topicIndex, items, options)?.slot === 'topic';
    const v2Occupied = v2Index >= 0
      && appliedMovementForItem(items[v2Index], v2Index, items, options)?.slot === 'v2';
    const v1Occupied = v1Index >= 0
      && appliedMovementForItem(items[v1Index], v1Index, items, options)?.slot === 'v1';
    if (topicSlotY !== null && isMainV2Rule() && !frontedAdverb && !topicOccupied) {
      drawLexTopicSlot(g, x, topicSlotY);
    }
    if (v1SlotY !== null && !v1Occupied) drawLexV1Slot(g, x, v1SlotY);
    if (v2SlotY !== null && !v2Occupied) drawLexV2Slot(g, x, v2SlotY);

    const ruleText = logicalAuthorityEnabled()
      ? (featureEnabled('adverbs')
        ? `Bronknoop → horizontale bronhoogte. LOG reserveert ruimte; alleen een expliciete positie-1-, topic-, V1- of V2-regel mag momenteel omhoog verplaatsen. ${lexFreeSlotCount()} minor(s) vergroten de logische afstand (${logInsertionIntervalLabel()}).`
        : 'Bronknoop → horizontale bronhoogte. LOG reserveert ruimte; alleen een expliciete positie-1-, topic-, V1- of V2-regel mag momenteel omhoog verplaatsen.')
      : (isMainV2Rule()
        ? 'Projectie: bronknopen → blauwe projectiemerkers. Daarna Wissels naar lege plekken 0/1/2.'
        : 'Projectie: bronknopen → blauwe projectiemerkers. Daarna plaatsingsregels; Comp gebruikt slot 0.');
    drawCanvasGuideText(g, x + 150, axisMinY + 18, ruleText, 'wissel-label');

    // De bronprojectie zelf blijft horizontaal. LOG en eventuele expliciete
    // regels bepalen samen één einddoel, dus nooit twee pijlen per bronwoord.

    items.forEach((item, i) => {
      const p = item.source && sourceMap ? sourceMap.get(item.source) : null;
      const y = projectedLexItemY(item, i, y0, sourceMap, items, options);
      const projectionY = projectionAnchorY(item, i, y0, sourceMap, items);
      const logicalY = baseLexY(item, i, y0, sourceMap, items);
      const movements = localAxisMovement(item, i, projectionY, y, items, options);
      const logicalMovement = movements.logical;
      const explicitMovement = movements.explicit;
      const appliedPlacement = explicitMovement || logicalMovement;
      const visiblyMoved = !!appliedPlacement && Math.abs(projectionY - y) > 1;
      positions.set(item.id, {
        x,
        y,
        projectionY,
        logicalY,
        baseY: logicalY,
        item,
        sourcePoint: p || null
      });

      if (horizontalProjectionMode && options.showProjectionLines !== false && p && Number.isFinite(p.px) && Number.isFinite(p.py) && item.source) {
        const startX = p.px - 62;
        const endX = x + 62;
        g.appendChild(svgEl('path', {
          d: `M ${startX} ${p.py} H ${endX}`,
          fill: 'none',
          class: 'projection-line lex lex-source-projection-line',
          'data-axis-marker': 'projection-marker'
        }));
      }

      if (visiblyMoved && item.source) {
        const word = String(item.label || item.role || item.source || 'LEX').toUpperCase();
        const movementLabel = explicitMovement?.caption || 'Plaats LOG → LEX';
        const movementLane = Math.max(0, movementOrderIndex(item, i, 'combined', items));
        drawLexTrace(g, x, projectionY, `t[${word}]`, 'horizontale bronprojectie');
        drawLexWissel(g, x, projectionY, y, movementLabel, movementLane);
      }

      if (!item.source && item.slot === 'comp') {
        g.appendChild(svgEl('rect', { x: x - 86, y: y - 28, width: 172, height: 56, rx: 16, class: 'lex-free-slot comp-slot' }));
        g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 0 · Comp/(om)dat'));
      } else if (!item.source) {
        g.appendChild(svgEl('rect', { x: x - 66, y: y - 26, width: 132, height: 52, rx: 14, class: 'lex-local-slot' }));
      } else {
        const cls = visiblyMoved ? 'lex-slot-box lex-projection-slot moved-slot' : 'lex-slot-box lex-projection-slot';
        g.appendChild(svgEl('rect', { x: x - 62, y: y - 28, width: 124, height: 56, rx: 14, class: cls }));
      }
      const hasPendingLogicalMove = !!logicalPlacementMovementForItem(item, i, items) && !logicalMovement;
      const staysAtSourceHeight = horizontalProjectionMode && item.source && !movementForItem(item, i, items);
      const slotLabel = (hasPendingLogicalMove || staysAtSourceHeight) ? 'H' : lexSlotIndex(item, i, items, explicitMovement);
      g.appendChild(svgEl('text', { x: x - 76, y: y + 5, class: 'lex-index' }, slotLabel));
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

  function projectedRuleBoxWidth(spec, layout, origin, mode = 'syntax') {
    const rows = projectedRuleRows(spec, layout, origin, mode);
    const maxText = rows.reduce((max, row) => Math.max(max, String(row.text || '').length), 0);
    return Math.max(mode === 'functional' ? 250 : 210, Math.min(380, maxText * 8.2 + 34));
  }

  function stableEastProjectionAxisX(origin) {
    const layouts = [getSouthAwareSyntaxLayout(), getSouthAwareFunctionalLayout()];
    const maxX = Math.max(
      ...layouts
        .map(candidate => Number(candidate?.box?.maxX))
        .filter(Number.isFinite)
    );
    return Number.isFinite(maxX) ? px(maxX, origin) + 118 : px(4, origin) + 118;
  }

  function projectedRuleRightEdge(layout, spec, origin, mode = 'syntax') {
    if (!layout?.box || !spec || !origin) return -Infinity;
    const eastAxisX = stableEastProjectionAxisX(origin);
    const axisBoxGap = 22;
    return eastAxisX + axisBoxGap + projectedRuleBoxWidth(spec, layout, origin, mode);
  }

  function drawProjectedRules(g, x, layout, origin, spec, options = {}) {
    if (!layout || !origin || !spec) return;
    const mode = options.mode || 'syntax';
    const title = options.title || (mode === 'functional' ? 'Functional · functionele regels/rollen' : 'SYNT-projectie · regels');
    const cls = mode === 'functional' ? 'synt functional' : 'synt';
    const boxClass = mode === 'functional' ? 'syntax-rule-box projected-rule-box projected-functional-rule-box' : 'syntax-rule-box projected-rule-box';
    const ruleClass = mode === 'functional' ? 'rule-label projected-rule-label projected-functional-rule-label' : 'rule-label projected-rule-label';
    const rows = projectedRuleRows(spec, layout, origin, mode).filter(row => {
      const plan = options.growthPlan || null;
      return !plan?.active || visibleAt(plan, nodeGrowthStep(plan, row.id));
    });
    if (!rows.length) return;
    const width = projectedRuleBoxWidth(spec, layout, origin, mode);
    // v4571: de projectie-as is een echte rechter-as. De regelboxen
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
    const resolvedOrder = Array.isArray(order) && order.length ? order : ((state.branchOrder === 'flip-all' || state.functionalOrder === 'right-first') ? ['V', 'S', 'O'] : ['S', 'O', 'V']);
    const sequence = activeLogicalSlotSequence(resolvedOrder);
    const roleMatches = {
      S: ['agens', 'subject'],
      O: ['patiens', 'object'],
      V: ['pred', 'predicate']
    };
    return sequence.map(item => {
      if (item.kind === 'minor') return item;
      const matches = roleMatches[item.short] || [];
      const node = (sourceLayout?.nodes || []).find(n => n.kind === 'leaf' && matches.includes(String(n.role || '').toLowerCase()))
        || (sourceLayout?.nodes || []).find(n => matches.includes(String(n.role || '').toLowerCase()));
      return node?.label ? { ...item, word: String(node.label).toUpperCase() } : item;
    });
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
    const code = (items || []).filter(item => item.kind !== 'minor').map(item => item.short).join('');
    return SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(code) ? `${code}-!` : code;
  }

  function logicalSequenceCode(items) {
    return (items || []).map(item => item.kind === 'minor' ? (item.short || `m${item.minorIndex || ''}`) : item.short).join('–');
  }

  function logicalDistanceSummary(items) {
    const distances = [
      ['S', 'O'],
      ['O', 'V']
    ].map(([from, to]) => {
      const distance = logicalSlotDistance(items, from, to);
      return distance === null ? '' : `d(${from},${to})=${distance}`;
    }).filter(Boolean);
    return distances.join(' · ');
  }

  function layoutLogicalProjectionCenters(items, fallbackX1, fallbackX2) {
    const fallbackStep = items.length > 1 ? (fallbackX2 - fallbackX1) / (items.length - 1) : 0;
    const centers = items.map((item, index) => {
      const sourceX = Number(item.sourcePx);
      return Number.isFinite(sourceX) ? sourceX : (fallbackX1 + fallbackStep * index);
    });
    const majorIndexes = items
      .map((item, index) => item.kind === 'minor' ? -1 : index)
      .filter(index => index >= 0 && Number.isFinite(Number(items[index].sourcePx)));

    items.forEach((item, index) => {
      if (item.kind !== 'minor') return;
      const previousIndex = [...majorIndexes].reverse().find(majorIndex => majorIndex < index);
      const nextIndex = majorIndexes.find(majorIndex => majorIndex > index);
      const previous = Number.isInteger(previousIndex) ? items[previousIndex] : null;
      const next = Number.isInteger(nextIndex) ? items[nextIndex] : null;
      if (previous && next) {
        const previousSlot = Number(previous.logicalSlot);
        const nextSlot = Number(next.logicalSlot);
        const ratio = nextSlot === previousSlot ? .5 : (Number(item.logicalSlot) - previousSlot) / (nextSlot - previousSlot);
        centers[index] = Number(previous.sourcePx) + ratio * (Number(next.sourcePx) - Number(previous.sourcePx));
      } else if (previous) {
        centers[index] = Number(previous.sourcePx) + (Number(item.logicalSlot) - Number(previous.logicalSlot)) * logAxisSlotPixels();
      } else if (next) {
        centers[index] = Number(next.sourcePx) - (Number(next.logicalSlot) - Number(item.logicalSlot)) * logAxisSlotPixels();
      }
    });
    return centers;
  }

  function drawLogicalProjection(g, x1, x2, y, layout = null, options = {}) {
    const requestedOrder = Array.isArray(options.order) && options.order.length ? options.order : null;
    const rawItems = Array.isArray(options.items) && options.items.length ? options.items : logicalProjectionItemsFromLayout(layout, requestedOrder);
    const items = rawItems.map((item, index) => ({
      ...item,
      logicalSlot: Number.isFinite(Number(item.logicalSlot)) ? Number(item.logicalSlot) : index
    }));
    if (!items.length) return;
    const cls = options.cls || 'log';
    const title = options.title || 'LOG-projectie';
    const subtitle = options.subtitle || 'LOG-slots bepalen de geplande afstand en beschikbare LEX-plaatsen; zij verplaatsen geen bronknoop.';
    const orderCode = logicalOrderCode(items);
    const sequenceCode = logicalSequenceCode(items);
    const distanceSummary = logicalDistanceSummary(items);
    const centers = layoutLogicalProjectionCenters(items, x1, x2);
    const axisX1 = Math.min(...centers);
    const axisX2 = Math.max(...centers);
    const badgeText = options.badgeText || `LOG · ${orderCode}`;
    const badgeWidth = Math.max(176, 26 + badgeText.length * 10.2);
    const badgeHeight = options.interactive ? 48 : 38;
    const badgeGap = options.interactive ? 54 : 24;
    const badgeY = options.badgeAlign === 'right-below'
      ? y + 76
      : y - badgeGap - badgeHeight;
    const badgeX = options.badgeAlign === 'center'
      ? ((axisX1 + axisX2) / 2) - badgeWidth / 2
      : (options.badgeAlign === 'right-below'
        ? axisX2 - badgeWidth
        : axisX1 - badgeWidth - 16);
    drawCanvasGuideText(g, axisX1, y - 110, `${title} · ${sequenceCode}`, 'axis-title');
    drawCanvasGuideText(g, axisX1, y - 86, `${subtitle}${distanceSummary ? ` · ${distanceSummary}` : ''}`, 'rule-label');
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
      x1: axisX1,
      y1: y,
      x2: axisX2,
      y2: y,
      class: `logical-axis ${cls}`
    }));
    items.forEach((item, index) => {
      const isMinor = item.kind === 'minor';
      const sourceX = Number(item.sourcePx);
      const cx = centers[index];
      const boxWidth = isMinor ? 164 : 148;
      const boxHeight = isMinor ? 56 : 48;
      const boxLeft = cx - boxWidth / 2;
      // Majors blijven direct onder hun bron en krijgen dus een zuiver
      // verticale projectie. Minors staan één compacte rij lager, zodat
      // ingevoegde slots niet over de major-boxen heen schrijven.
      const boxTop = y + (isMinor ? 70 : 10);
      if (!isMinor && Number.isFinite(sourceX) && Number.isFinite(item.sourceTopY)) {
        g.appendChild(svgEl('path', {
          d: `M ${sourceX} ${item.sourceTopY} V ${y}`,
          class: `projection-line ${cls} logical-source-line`,
          fill: 'none'
        }));
      }
      g.appendChild(svgEl('line', {
        x1: cx,
        y1: y,
        y2: boxTop,
        x2: cx,
        class: `projection-line ${cls} logical-projection-line`
      }));
      g.appendChild(svgEl('rect', {
        x: boxLeft,
        y: boxTop,
        width: boxWidth,
        height: boxHeight,
        rx: 14,
        class: `logical-order-box${isMinor ? ' logical-minor-box' : ' logical-major-box'}`
      }));
      const originTag = isMinor && normalizeInsertionOrigin(item.origin) === 'LOG+LEX' ? 'LOG+LEX' : '';
      g.appendChild(svgEl('text', { x: cx, y: boxTop + 18, class: 'logical-order-label' }, `${item.short} · ${item.word}${originTag ? ` · ${originTag}` : ''}`));
      g.appendChild(svgEl('text', { x: cx, y: boxTop + 35, class: 'logical-order-sub' },
        isMinor
          ? `minor · ${item.logInterval || item.interval} · slot ${item.logicalSlot}`
          : `major · slot ${item.logicalSlot}`));
    });
  }

  function drawSyntaxRules(g, x, y, layout = null, origin = null, growthPlan = null) {
    if (layout && origin) {
      drawProjectedRules(g, x, layout, origin, treeSpec(), {
        mode: 'syntax',
        title: 'SYNT-projectie · regels op boomhoogte',
        growthPlan
      });
      return;
    }
    const axisBoxGap = 22;
    drawAxisTitle(g, x + axisBoxGap, y - 60, 'SYNT-projectie · regels');
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
        title: 'Functional · functionele regels op bronhoogte',
        growthPlan
      });
      return;
    }
    const axisBoxGap = 22;
    drawAxisTitle(g, x + axisBoxGap, 40, 'Functional · functionele regels/rollen');
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
    if (state.projection === 'log') {
      const sequence = activeLogicalSlotSequence();
      const order = logicalSequenceCode(sequence);
      const rows = [
        `LOG · zuidas · ${southLogicalModeLabel(state.southLogicalMode || 'SOV')}`,
        `LOG → ${order}`,
        logicalDistanceSummary(sequence)
      ];
      if (featureEnabled('adverbs')) {
        rows[2] += ` · interval ${logInsertionIntervalLabel()}`;
        rows.push('LOG-majors en -minors plannen LEX-plaatsen; alleen een expliciete Language-Tree-regel verplaatst een bronknoop.');
      } else {
        rows.push('De LOG-majors S/O/V plannen LEX-plaatsen maar verplaatsen geen bronknoop.');
      }
      return rows;
    }
    const useFunctional = state.centerMode === 'ft';
    const title = useFunctional ? 'Functional · functionele rollen' : 'SYNT · syntaxregels';
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
    if (options.showTitle !== false) drawAxisTitle(g, origin.x - 180, origin.y - 70, `Functional · functionele structuur · ${rootLabel} → ${roleNames} · ${state.functionalOrder}`);
    drawAxisTitle(g, origin.x - 176, origin.y - 48, featureEnabled('adverbs')
      ? `v4547 · ${branchModeLabel()} · vrije plaatsing + LEX-bijwoordslots`
      : `${branchModeLabel()} · vrije plaatsing`);
    const growthPlan = growthPlanForLayout(layout);
    layout.__growthPlan = growthPlan;
    drawSubtreeBoxes(g, layout, origin, growthPlan);
    drawTreeEdges(g, layout, origin, growthPlan);
    drawOpnTopicalizationSlot(g, layout, origin, growthPlan);
    drawTreeNodes(g, layout, origin, options.selectable === true, growthPlan);
    if (featureEnabled('adverbs')) drawHostedAdverbSlots(g, layout, origin, growthPlan);
    return layout;
  }

  function westLexAxisX(layoutOrBox, origin) {
    const layout = Array.isArray(layoutOrBox?.nodes) ? layoutOrBox : null;
    const layoutBox = layout?.box || layoutOrBox;
    const rootId = String(layout?.node?.id || layout?.nodes?.[0]?.id || '');
    const measuredRoot = layout && rootId
      ? measureSubtreeBoxes(layout, origin).get(rootId)
      : null;
    const treeBoxLeft = Number.isFinite(measuredRoot?.x)
      ? measuredRoot.x
      : px(Number(layoutBox?.minX || 0) - SUBTREE_AXIS_ENVELOPE_X_PAD, origin);
    return treeBoxLeft - activeLexRenderRightReach() - LEX_TREE_CLEARANCE;
  }

  function canonicalProjectionContext(g, options = {}) {
    const origin = stableCentralViewOrigin();
    const drawCentral = options.drawCentral !== false;
    let sourceMap = null;
    let centralLayout = null;
    const centralKind = state.centerMode === 'ft' ? 'functional' : 'syntax';
    if (state.centerMode === 'ft') {
      centralLayout = drawCentral
        ? drawFunctional(g, origin, { showTitle: false, layout: getSouthAwareFunctionalLayout() })
        : getSouthAwareFunctionalLayout();
      sourceMap = layoutNodeMap(centralLayout, origin);
    } else {
      centralLayout = drawCentral
        ? drawSyntaxTree(g, origin, { layout: getSouthAwareSyntaxLayout() })
        : getSouthAwareSyntaxLayout();
      sourceMap = layoutNodeMap(centralLayout, origin);
    }
    const southItems = southLogicalItemsFromCentralLayout(centralLayout, origin, centralKind, southLogicalOrder());
    const westAxisX = westLexAxisX(centralLayout, origin);
    const southAxisY = py((centralLayout?.box?.maxY || 0) + 2.1, origin);
    const logicalSlots = southItems.map(item => Number(item.logicalSlot)).filter(Number.isFinite);
    const logicalSpan = Math.max(1, Math.max(...logicalSlots) - Math.min(...logicalSlots)) * logAxisSlotPixels();
    const centralTreeCenterPx = px(((centralLayout?.box?.minX || 0) + (centralLayout?.box?.maxX || 0)) / 2, origin);
    const southAxisX1 = centralTreeCenterPx - logicalSpan / 2;
    const southAxisX2 = centralTreeCenterPx + logicalSpan / 2;
    // Syntax en Functional delen één oostas op de rechterrand van hun
    // gezamenlijke layout-envelop. Vooral in landschap voorkomt dit dat de
    // smallere Syntaxboom een smal raster in een breed stabiel frame krijgt.
    const eastAxisX = stableEastProjectionAxisX(origin);
    return { origin, sourceMap, centralLayout, centralKind, southItems, westAxisX, eastAxisX, southAxisX1, southAxisX2, southAxisY };
  }

  function stableCentralViewOrigin() {
    return { x: 760, y: 72 };
  }

  function projectionStableFrameBox() {
    // v2.0.0-rc.14: één gezamenlijk frame voor beide centrale views én alle
    // projectiekeuzes. Het frame is de unie van Syntax en Functional. Daardoor blijven
    // schaal, x-positie en y-positie identiek bij Alle/Bron/LEX/SYNT/LOG en
    // ook wanneer de centrale view tussen Syntax en Functional wisselt.
    const origin = stableCentralViewOrigin();
    const layouts = [getSouthAwareSyntaxLayout(), getSouthAwareFunctionalLayout()];
    const boxes = layouts.map(layout => layout?.box).filter(Boolean);
    const union = boxes.length ? {
      minX: Math.min(...boxes.map(box => Number(box.minX || 0))),
      minY: Math.min(...boxes.map(box => Number(box.minY || 0))),
      maxX: Math.max(...boxes.map(box => Number(box.maxX || 0))),
      maxY: Math.max(...boxes.map(box => Number(box.maxY || 0)))
    } : { minX: -3, minY: 0, maxX: 4, maxY: 6 };
    const leftTreePx = px(union.minX - 0.9, origin);
    const rightTreePx = px(union.maxX + 0.9, origin);
    const topTreePx = py(union.minY - 1.6, origin);
    const bottomTreePx = py(union.maxY + 2.1, origin);
    const westAxisX = Math.min(...layouts.map(layout => westLexAxisX(layout, origin)));
    const eastAxisX = rightTreePx + 118;
    const southAxisY = py(union.maxY + 2.1, origin);
    const logicalSequence = activeLogicalSlotSequence();
    const logicalSlots = logicalSequence.map(item => Number(item.logicalSlot)).filter(Number.isFinite);
    const logicalSpan = Math.max(1, Math.max(...logicalSlots) - Math.min(...logicalSlots)) * logAxisSlotPixels();
    const treeCenterPx = px((union.minX + union.maxX) / 2, origin);
    const logicalLeft = treeCenterPx - logicalSpan / 2;
    const logicalRight = treeCenterPx + logicalSpan / 2;
    const left = Math.min(-120, westAxisX - 260, leftTreePx - 300, logicalLeft - 260);
    const top = Math.min(-180, topTreePx - 120);
    const right = Math.max(2180, eastAxisX + 650, rightTreePx + 760, logicalRight + 260);
    const bottom = Math.max(1120, southAxisY + 340, bottomTreePx + 360);
    return { x: left, y: top, w: right - left, h: bottom - top };
  }

  function maximumProjectionFrameBox() {
    // Compacte, maar projectie-onafhankelijke unie voor desktop-MAX. Anders
    // dan het historische stabiliteitskader reserveert dit alleen ruimte voor
    // de centrale Syntax / Functional-unie, LEX, SYNT-regelboxen, LOG en een smalle
    // strook voor de HTML-projectiebediening.
    const origin = stableCentralViewOrigin();
    const layouts = [getSouthAwareSyntaxLayout(), getSouthAwareFunctionalLayout()];
    const boxes = layouts.map(layout => layout?.box).filter(Boolean);
    const union = boxes.length ? {
      minX: Math.min(...boxes.map(box => Number(box.minX || 0))),
      minY: Math.min(...boxes.map(box => Number(box.minY || 0))),
      maxX: Math.max(...boxes.map(box => Number(box.maxX || 0))),
      maxY: Math.max(...boxes.map(box => Number(box.maxY || 0)))
    } : { minX: -3, minY: 0, maxX: 4, maxY: 6 };
    const leftTreePx = px(union.minX - 0.9, origin);
    const topTreePx = py(union.minY - 1.6, origin);
    const bottomTreePx = py(union.maxY + 2.1, origin);
    const westAxisX = Math.min(...layouts.map(layout => westLexAxisX(layout, origin)));
    const southAxisY = py(union.maxY + 2.1, origin);
    const syntaxRuleRight = projectedRuleRightEdge(layouts[0], treeSpec(), origin, 'syntax');
    const functionalRuleRight = projectedRuleRightEdge(
      layouts[1],
      nodeConfigToTree(STRUCTURE_CONFIG.functionalNodes, STRUCTURE_CONFIG.functionalRoot),
      origin,
      'functional'
    );
    const logicalSequence = activeLogicalSlotSequence();
    const logicalSlots = logicalSequence.map(item => Number(item.logicalSlot)).filter(Number.isFinite);
    const logicalSpan = Math.max(1, Math.max(...logicalSlots) - Math.min(...logicalSlots)) * logAxisSlotPixels();
    const treeCenterPx = px((union.minX + union.maxX) / 2, origin);
    const logicalLeft = treeCenterPx - logicalSpan / 2;
    const logicalRight = treeCenterPx + logicalSpan / 2;
    const left = Math.min(-12, westAxisX - activeLexRenderLeftReach(), leftTreePx - 100, logicalLeft - 96);
    const top = Math.min(-150, topTreePx - 150);
    const right = Math.max(1580, syntaxRuleRight, functionalRuleRight, logicalRight + 150) + 72;
    const bottom = Math.max(910, southAxisY + 150, bottomTreePx + 140);
    return { x: left, y: top, w: right - left, h: bottom - top };
  }

  function stableProjectionViewBox() {
    // Het viewport is expres onafhankelijk van de zichtbare overlay. Gebruik
    // vaste marges voor de Projecties-box en LOG-actiebox, zodat DOM-metingen
    // van verborgen knoppen geen verticale of horizontale sprong veroorzaken.
    const frame = projectionStableFrameBox();
    const base = Math.max(frame.w, frame.h);
    const margin = Math.max(48, Math.min(96, base * 0.045));
    const portrait = isPortraitGridFirstViewport();
    const fit = {
      x: frame.x - margin,
      y: frame.y - margin,
      w: frame.w + margin * 2,
      h: frame.h + margin * 2
    };
    const extra = portrait
      ? { left: fit.w * 0.018, top: fit.h * 0.034, right: fit.w * 0.045, bottom: fit.h * 0.20 }
      : { left: fit.w * 0.018, top: fit.h * 0.034, right: fit.w * 0.18, bottom: fit.h * 0.14 };
    const expanded = {
      x: fit.x - extra.left,
      y: fit.y - extra.top,
      w: fit.w + extra.left + extra.right,
      h: fit.h + extra.top + extra.bottom
    };
    // Geen tweede aanpassing aan de actuele canvas-aspectratio: die ratio kan
    // tijdens het omschakelen kort verschillen door de rechterkolom. De SVG
    // schaalt dit vaste viewBox zelf passend in het beschikbare venster.
    return expanded;
  }

  function appendStableProjectionFitFrame(g) {
    if (!g) return;
    const b = projectionStableFrameBox();
    g.appendChild(svgEl('rect', {
      x: b.x,
      y: b.y,
      width: b.w,
      height: b.h,
      class: 'projection-stability-frame',
      fill: 'transparent',
      opacity: '0',
      'pointer-events': 'none',
      'aria-hidden': 'true'
    }));
  }

  function drawSingleProjection(kind) {
    const g = baseSvg(`${kind}-projection-view selected-projection-view`);
    const ctx = canonicalProjectionContext(g, { drawCentral: true });
    drawGraphSentence(g, ctx.centralLayout, ctx.origin);
    const growthPlan = ctx.centralLayout?.__growthPlan;
    if (kind === 'lex') {
      drawAxisTitle(g, ctx.westAxisX - 40, 40, 'LEX · geselecteerde named projection op vaste west-aspositie');
      drawLexAxis(g, ctx.westAxisX, 126, activeLexItems(), ctx.sourceMap);
    } else if (kind === 'synt') {
      if (state.centerMode === 'ft') drawFunctionalRules(g, ctx.eastAxisX, ctx.centralLayout, ctx.origin, null);
      else drawSyntaxRules(g, ctx.eastAxisX, 126, ctx.centralLayout, ctx.origin, null);
    } else if (kind === 'log' && (!growthPlan?.active || visibleAt(growthPlan, growthPlan.logStep))) {
      drawLogicalProjection(g, ctx.southAxisX1, ctx.southAxisX2, ctx.southAxisY, getFunctionalLayout(), {
        cls: 'log',
        title: 'LOG · geselecteerde named projection op vaste zuidaspositie',
        subtitle: featureEnabled('adverbs')
          ? `LOG ordent majors en bijwoord-minors op vaste slots en plant LEX-plaatsen; alleen een expliciete regel verplaatst een bronknoop.${southModeWarningText()}`
          : `LOG ordent S/O/V-majors op vaste slots en plant LEX-plaatsen zonder een bronknoop te verplaatsen.${southModeWarningText()}`,
        badgeText: southLogicalModeLabel(state.southLogicalMode || 'SOV'),
        order: southLogicalOrder(),
        items: ctx.southItems,
        interactive: true,
        tipText: 'tip: SOV → SVO → OVS → OSV-! → VSO-! → VOS-!',
        badgeAlign: 'right-below'
      });
    } else if (kind === 'log') {
      drawAxisTitle(g, ctx.southAxisX1, ctx.southAxisY - 60, `LOG verschijnt in fase 1/2 · ${growthLabel()}`);
    }
    appendStableProjectionFitFrame(g);
    els.svg.appendChild(g);
  }

  function drawAxes() {
    const g = baseSvg('axes-view');
    const origin = { x: 760, y: 72 };
    drawAxisTitle(g, origin.x - 170, origin.y - 76, state.centerMode === 'ft' ? `CENTRAAL · Functional · functionele structuur · ${state.functionalOrder}` : `CENTRAAL · OPN-syntaxboom · ${movementSummaryLabel()}`);

    const ctx = canonicalProjectionContext(g, { drawCentral: true });
    const { sourceMap, centralLayout, southItems, westAxisX, eastAxisX, southAxisX1, southAxisX2, southAxisY } = ctx;
    drawGraphSentence(g, centralLayout, ctx.origin);

    const growthPlan = centralLayout?.__growthPlan;
    const drawLogPhase = subtitle => {
      drawLogicalProjection(g, southAxisX1, southAxisX2, southAxisY, getFunctionalLayout(), {
        cls: 'log',
        title: 'LOG · zuidas',
        subtitle,
        badgeText: southLogicalModeLabel(state.southLogicalMode || 'SOV'),
        order: southLogicalOrder(),
        items: southItems,
        interactive: true,
        tipText: 'tip: SOV → SVO → OVS → OSV-! → VSO-! → VOS-!',
        badgeAlign: 'right-below'
      });
    };
    const drawAllNamedProjections = (plan = null) => {
      drawLexAxis(g, westAxisX, 126, activeLexItems(), sourceMap);
      if (state.centerMode === 'ft') drawFunctionalRules(g, eastAxisX, centralLayout, origin, plan);
      else drawSyntaxRules(g, eastAxisX, 126, centralLayout, origin, plan);
      drawLogPhase(featureEnabled('adverbs')
        ? `Majors en minors staan op vaste LOG-slots; elke minor vergroot de gereserveerde LEX-afstand. Bronknopen blijven zonder expliciete Wissel op bronhoogte.${southModeWarningText()}`
        : `De majors S, O en V staan op vaste LOG-slots en reserveren LEX-ruimte. Bronknopen blijven zonder expliciete Wissel op bronhoogte.${southModeWarningText()}`);
    };
    if (!growthPlan?.active || state.projectionBlockUnlocked) {
      // Projecties > Alle betekent: centrale view met alle named projections.
      // Bron blijft de centrale bronview zonder projectie-assen.
      drawAllNamedProjections(growthPlan?.active ? growthPlan : null);
      appendStableProjectionFitFrame(g);
      els.svg.appendChild(g);
      return;
    }
    const showLogStep = !growthPlan?.active || visibleAt(growthPlan, growthPlan.logStep);
    const showLexBaseStep = !growthPlan?.active || visibleAt(growthPlan, growthPlan.lexBaseStep);
    const showProjectionPanels = !growthPlan?.active || visibleAt(growthPlan, growthPlan.projectionStep);
    if (showProjectionPanels) {
      drawAllNamedProjections(growthPlan);
    } else if (showLexBaseStep) {
      const executedMovementCount = growthPlan?.active
        ? Math.max(0, Math.min(growthPlan.lexMovementCount, growthPlan.current - growthPlan.lexMovementStartStep + 1))
        : undefined;
      drawLexAxis(g, westAxisX, 126, activeLexItems(), sourceMap, { executedMovementCount });
      drawAxisTitle(g, eastAxisX, 116, 'SYNT-projectie verschijnt in de laatste stap');
      drawLogPhase(`Fase 2/2: bronknopen projecteren horizontaal naar LEX; alleen expliciete Language-Tree-regels verplaatsen daarna een knoop langs de as.${southModeWarningText()}`);
    } else if (showLogStep) {
      drawAxisTitle(g, westAxisX - 45, 116, 'LEX verschijnt na LOG');
      drawAxisTitle(g, eastAxisX, 116, 'SYNT-projectie verschijnt in de laatste stap');
      drawLogPhase(featureEnabled('adverbs')
        ? `Fase 1/2: plaats majors en minors eerst op de LOG-as.${southModeWarningText()}`
        : `Fase 1/2: plaats de majors S, O en V eerst op de LOG-as.${southModeWarningText()}`);
    } else {
      drawAxisTitle(g, westAxisX - 45, 116, `Groei-presentatie · ${growthLabel()}`);
      drawAxisTitle(g, eastAxisX, 116, 'SYNT-projectie verschijnt in de laatste stap');
    }
    appendStableProjectionFitFrame(g);
    els.svg.appendChild(g);
  }

  function drawSource() {
    const g = baseSvg('source-view');
    const ctx = canonicalProjectionContext(g, { drawCentral: true });
    drawGraphSentence(g, ctx.centralLayout, ctx.origin);
    const origin = ctx.origin || stableCentralViewOrigin();
    const selectedAxes = sourceAxisSet();
    const growthPlan = ctx.centralLayout?.__growthPlan;
    const axesText = selectedAxes.size ? ` + ${sourceAxesShortLabel()}` : '';
    if (state.centerMode === 'ft') {
      drawAxisTitle(g, origin.x - 240, origin.y - 78, `BRON${axesText} · OPN-functioneel · structure-config · ${state.functionalOrder}`);
    } else {
      drawAxisTitle(g, origin.x - 270, origin.y - 78, `BRON${axesText} · OPN-syntax-tree · vrije HOR/VER-boxplaatsing + vrije-slotruimte`);
    }
    if (selectedAxes.has('lex') && (!growthPlan?.active || visibleAt(growthPlan, growthPlan.lexBaseStep))) {
      drawLexAxis(g, ctx.westAxisX, 126, activeLexItems(), ctx.sourceMap, {
        executedMovementCount: growthPlan?.active
          ? Math.max(0, Math.min(growthPlan.lexMovementCount, growthPlan.current - growthPlan.lexMovementStartStep + 1))
          : undefined
      });
    }
    if (selectedAxes.has('synt') && (!growthPlan?.active || visibleAt(growthPlan, growthPlan.projectionStep))) {
      if (state.centerMode === 'ft') drawFunctionalRules(g, ctx.eastAxisX, ctx.centralLayout, ctx.origin, null);
      else drawSyntaxRules(g, ctx.eastAxisX, 126, ctx.centralLayout, ctx.origin, null);
    }
    if (selectedAxes.has('log') && (!growthPlan?.active || visibleAt(growthPlan, growthPlan.logStep))) {
      drawLogicalProjection(g, ctx.southAxisX1, ctx.southAxisX2, ctx.southAxisY, getFunctionalLayout(), {
        cls: 'log',
        title: 'LOG · zuidas bij Bron',
        subtitle: featureEnabled('adverbs')
          ? `Gekozen bronas: LOG-majors + minors op vaste afstand; LEX volgt deze basis vóór eventuele Wissels.${southModeWarningText()}`
          : `Gekozen bronas: de LOG-majors S/O/V staan op vaste afstand; LEX volgt deze basis vóór eventuele Wissels.${southModeWarningText()}`,
        badgeText: southLogicalModeLabel(state.southLogicalMode || 'SOV'),
        order: southLogicalOrder(),
        items: ctx.southItems,
        interactive: true,
        tipText: 'tip: SOV → SVO → OVS → OSV-! → VSO-! → VOS-!',
        badgeAlign: 'right-below'
      });
    }
    appendStableProjectionFitFrame(g);
    els.svg.appendChild(g);
  }

  function drawLex() {
    drawSingleProjection('lex');
  }

  function drawIsolatedSyntaxRules(g) {
    const origin = { x: 460, y: 92 };
    const layout = getSyntaxLayout();
    const rows = projectedRuleRows(treeSpec(), layout, origin, 'syntax');
    const axisX = 170;
    const axisBoxGap = 22;
    const boxLeft = axisX + axisBoxGap;
    const maxText = rows.reduce((max, row) => Math.max(max, row.text.length), 0);
    const width = Math.max(250, Math.min(430, maxText * 8.6 + 42));
    const boxCenter = boxLeft + width / 2;
    const axisTop = rows.length ? Math.max(56, Math.min(...rows.map(row => row.y)) - 48) : 80;
    const axisBottom = rows.length ? Math.max(...rows.map(row => row.y)) + 48 : 360;
    g.appendChild(svgEl('text', { x: boxLeft, y: axisTop - 34, class: 'axis-title synt-isolated-title' }, 'SYNT · actieve syntaxregels'));
    g.appendChild(svgEl('text', { x: boxLeft, y: axisTop - 12, class: 'rule-label synt-isolated-subtitle' }, 'regels op bronhoogte · centrale boom verborgen'));
    g.appendChild(svgEl('line', {
      x1: axisX, y1: axisTop, x2: axisX, y2: axisBottom,
      class: 'projection-axis-line synt synt-isolated-axis'
    }));
    rows.forEach((row, index) => {
      const yy = row.y;
      const sourceLabel = String(row.text || '').split('→')[0].trim();
      g.appendChild(svgEl('line', {
        x1: axisX - 12, y1: yy, x2: boxLeft - 8, y2: yy,
        class: 'projection-line synt synt-isolated-tick'
      }));
      g.appendChild(svgEl('text', { x: axisX - 20, y: yy + 4, class: 'rule-label synt-isolated-source-label' }, sourceLabel));
      g.appendChild(svgEl('rect', {
        x: boxLeft, y: yy - 26, width, height: 52, rx: 14,
        class: 'syntax-rule-box projected-rule-box synt-isolated-rule-box'
      }));
      g.appendChild(svgEl('text', {
        x: boxCenter, y: yy + 5,
        class: 'rule-label projected-rule-label synt-isolated-rule-label'
      }, row.text));
      if (index > 0 && Math.abs(yy - rows[index - 1].y) < 8) {
        g.appendChild(svgEl('text', { x: boxLeft + width + 16, y: yy + 5, class: 'rule-label synt-isolated-stack-note' }, 'zelfde hoogte'));
      }
    });
    const noteY = axisBottom + 44;
    g.appendChild(svgEl('rect', { x: boxLeft, y: noteY - 22, width: Math.min(width, 430), height: 44, rx: 12, class: 'syntax-rule-box synt-isolated-note-box' }));
    g.appendChild(svgEl('text', { x: boxLeft + Math.min(width, 430) / 2, y: noteY - 4, class: 'rule-label synt-isolated-note' }, 'complexe regelsets: groepeer per categorie; actieve regel bovenaan'));
    g.appendChild(svgEl('text', { x: boxLeft + Math.min(width, 430) / 2, y: noteY + 13, class: 'rule-label synt-isolated-note' }, 'alternatieven later als uitklapbare regels onder dezelfde categorie'));
    drawCanvasGuideText(g, 320, 370, 'SYNT: geïsoleerd, regels op bronhoogte; boom alleen als verborgen hoogteanker.', 'rule-label');
  }

  function drawSynt() {
    drawSingleProjection('synt');
  }

  function drawLog() {
    drawSingleProjection('log');
  }

  function applyProjectionColors() {
    const root = document.documentElement;
    const gridProfile = LINE_WEIGHT_PROFILES[validLineWeight(state.gridLineWeight)];
    const treeProfile = LINE_WEIGHT_PROFILES[validLineWeight(state.treeLineWeight, 'strong')];
    const projectionProfile = LINE_WEIGHT_PROFILES[validLineWeight(state.projectionLineWeight)];
    const boxProfile = LINE_WEIGHT_PROFILES[validLineWeight(state.boxLineWeight)];
    root.style.setProperty('--lex', projectionColorCss(state.lexProjectionColor, 'blue'));
    root.style.setProperty('--synt', projectionColorCss(state.syntProjectionColor, 'green'));
    root.style.setProperty('--log', projectionColorCss(state.logProjectionColor, 'purple'));
    root.style.setProperty('--og-grid-color', gridColorCss(state.gridColor));
    root.style.setProperty('--og-grid-line-width', String(gridProfile.grid));
    root.style.setProperty('--og-grid-major-line-width', String(gridProfile.gridMajor));
    root.style.setProperty('--og-grid-line-opacity', String(gridProfile.gridOpacity));
    root.style.setProperty('--og-grid-major-line-opacity', String(gridProfile.gridMajorOpacity));
    root.style.setProperty('--og-tree-line-color', projectionColorCss(state.treeLineColor, 'blue'));
    root.style.setProperty('--og-tree-line-width', String(treeProfile.tree));
    root.style.setProperty('--og-tree-line-opacity', String(treeProfile.treeOpacity));
    root.style.setProperty('--og-projection-line-width', String(projectionProfile.projection));
    root.style.setProperty('--og-projection-axis-width', String(projectionProfile.projectionAxis));
    root.style.setProperty('--og-box-line-width', String(boxProfile.box));
  }

  function setSvgPresentationVars() {
    const profile = layoutVisualProfile();
    els.svg.style.setProperty('--og-font-scale', profile.fontScale.toFixed(2));
    els.svg.dataset.layoutDensity = validLayoutDensity();
  }

  function viewBoxToString(box) {
    return `${box.x} ${box.y} ${box.w} ${box.h}`;
  }

  function fallbackViewBox() {
    return { x: 0, y: 0, w: 1500, h: 900 };
  }

  function stableGrowthViewBox() {
    if (!growthActive()) return null;
    if (validViewFitMode() === 'max') {
      if (state.maximumContentFit) {
        return handheldMaximumViewBox(state.maximumContentFit);
      }
      return computeMaximumContentFitBox();
    }
    // v2.0.0-rc.14: Groei gebruikt hetzelfde frame als de gewone projectie-
    // views. Voorheen hadden Alle/Bron/LOG eigen hard-coded viewBoxes, terwijl
    // LEX/SYNT auto-fit gebruikten; dat veroorzaakte de zichtbare sprong.
    return stableProjectionViewBox();
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

  function clearViewportGestureState() {
    // v2.0.0-rc.14: bij wissel tussen landscape/portrait mogen oude touch-pointers
    // en pinch-state niet blijven hangen. Anders lijkt portrait na zoom in
    // landscape bevroren.
    state.viewDrag = null;
    state.pinchGesture = null;
    state.activePointers?.clear?.();
    state.viewClickSuppressed = false;
    els.svg?.classList.remove('is-panning');
    els.canvasWrap?.classList.remove('is-panning');
  }

  function resetManualViewBox() {
    state.manualViewBox = null;
    clearViewportGestureState();
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
    // v2.0.0-rc.45: in handheld-landscape reserveert het SVG zelf ruimte
    // voor menu en Play. Gebruik daarom de werkelijk tekenbare SVG-maat en
    // niet de buitenste telefoonframe/canvas-wrap-maat.
    const svgRect = els.svg?.getBoundingClientRect?.();
    const rect = (svgRect?.width > 0 && svgRect?.height > 0)
      ? svgRect
      : els.canvasWrap?.getBoundingClientRect?.();
    if (!rect || !Number.isFinite(rect.width) || !Number.isFinite(rect.height) || rect.width <= 0 || rect.height <= 0) return null;
    return rect.width / rect.height;
  }

  function svgMeetClientMetrics(viewBox = parseViewBox()) {
    const svgRect = els.svg?.getBoundingClientRect?.();
    const rect = (svgRect?.width > 0 && svgRect?.height > 0)
      ? svgRect
      : els.canvasWrap?.getBoundingClientRect?.();
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


  function lexAxisAnchorBox() {
    if (!els.svg) return null;
    const candidates = [
      '.axes-lex-rules .projection-axis-line.lex',
      '.lex-rule-view .projection-axis-line.lex',
      '.projection-axis-line.lex',
      '.lex-rule-view',
      '.axes-lex-rules'
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
            return { x: Math.min(x1, x2), y: Math.max(y1, y2), h: Math.abs(y2 - y1), source: selector };
          }
        }
        const b = node.getBBox?.();
        if (b && Number.isFinite(b.x) && Number.isFinite(b.y) && b.width >= 0 && b.height >= 0) {
          return { x: b.x + b.width / 2, y: b.y + b.height, h: b.height, source: selector };
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


  function logicalAxisAnchorBox() {
    if (!els.svg) return null;
    const candidates = [
      '.logical-axis',
      '.logical-projection .logical-axis',
      '.axes-log-rules .logical-axis'
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
            return { x1: Math.min(x1, x2), x2: Math.max(x1, x2), y: (y1 + y2) / 2, source: selector };
          }
        }
        const b = node.getBBox?.();
        if (b && Number.isFinite(b.x) && Number.isFinite(b.y) && b.width >= 0 && b.height >= 0) {
          return { x1: b.x, x2: b.x + b.width, y: b.y + b.height / 2, source: selector };
        }
      } catch (_err) {
        // Element may be temporarily unavailable during SVG replacement.
      }
    }
    return null;
  }


  function mainProjectionBlockVisible() {
    const max = growthStepMax();
    return !!state.projectionBlockUnlocked || (!!state.growthEnabled && !state.growthTimer && max > 0 && state.growthStep >= max);
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

    if (controls) {
      const showProjectionBlock = mainProjectionBlockVisible();
      controls.classList.toggle('is-hidden', !showProjectionBlock);
      controls.setAttribute('aria-hidden', String(!showProjectionBlock));
      const portrait = isPortraitGridFirstViewport();
      if (!showProjectionBlock) {
      root.removeProperty?.('--main-controls-left');
      root.style.removeProperty('--main-controls-left');
      root.style.removeProperty('--main-controls-top');
      controls.style.removeProperty('--main-controls-left');
      controls.style.removeProperty('--main-controls-top');
    } else if (portrait) {
      root.removeProperty?.('--main-controls-left');
      root.style.removeProperty('--main-controls-left');
      root.style.removeProperty('--main-controls-top');
      controls.style.removeProperty('--main-controls-left');
      controls.style.removeProperty('--main-controls-top');
    } else {
      const controlsRect = controls.getBoundingClientRect();
      const controlW = Math.max(118, controlsRect.width || 116);
      const controlH = Math.max(180, controlsRect.height || 220);
      const minLeft = Math.max(8, svgLocalLeft + 8);
      const maxLeft = Math.max(minLeft, svgLocalRight - controlW - 10);
      const minTop = Math.max(8, svgLocalTop + 10);
      const maxTop = Math.max(minTop, svgLocalBottom - controlH - 10);
      let controlsLeft = null;
      let controlsTop = null;
      if (state.projectionBoxManual && Number.isFinite(state.projectionBoxManual.left) && Number.isFinite(state.projectionBoxManual.top)) {
        controlsLeft = state.projectionBoxManual.left;
        controlsTop = state.projectionBoxManual.top;
      } else {
        // v2.0.0-rc.14: Projecties-box heeft een stabiele schermpositie.
        // Niet meer ankeren aan een wisselende SYNT-as; alleen handmatig slepen verplaatst de box.
        controlsLeft = maxLeft;
        controlsTop = minTop;
      }
      controlsLeft = Math.round(Math.max(minLeft, Math.min(maxLeft, controlsLeft)));
      controlsTop = Math.round(Math.max(minTop, Math.min(maxTop, controlsTop)));
      root.style.setProperty('--main-controls-left', `${controlsLeft}px`);
      root.style.setProperty('--main-controls-top', `${controlsTop}px`);
      controls.classList.toggle('is-draggable', !!state.projectionBoxDraggable);
      controls.setAttribute('title', state.projectionBoxDraggable
        ? (isEnglish() ? 'Drag this Projections box. Double-click empty space to reset its position.' : 'Sleep deze Projecties-box. Dubbelklik op lege ruimte om de positie te resetten.')
        : (isEnglish() ? 'Projections box is fixed by Config.' : 'Projecties-box is vastgezet via Config.'));
      }
    }

    if (southControl && !southControl.classList.contains('is-hidden')) {
      const southRect = southControl.getBoundingClientRect();
      // v4578: use the real rendered taalactiebox size. The old fallback
      // (84px high) was much taller than the compact SOV box and placed the
      // box visibly above the LOG-as on first load. The SVG LOG-as y remains
      // the original southAxisY; only this HTML overlay is centered on it.
      const southW = Math.max(58, southRect.width || 92);
      const southH = Math.max(28, southRect.height || 34);
      const minSouthLeft = svgLocalLeft + 8;
      const maxSouthLeft = Math.max(minSouthLeft, svgLocalRight - southW - 8);
      const minSouthTop = svgLocalTop + 8;
      const maxSouthTop = Math.max(minSouthTop, svgLocalBottom - southH - 8);
      let southLeft = null;
      let southTop = null;
      if (state.southBoxManual && Number.isFinite(state.southBoxManual.left) && Number.isFinite(state.southBoxManual.top)) {
        southLeft = state.southBoxManual.left;
        southTop = state.southBoxManual.top;
      } else {
        const logAnchor = logicalAxisAnchorBox();
        const logStartClient = logAnchor ? svgXToClient(logAnchor.x1, viewBox) : null;
        const logYClient = logAnchor ? svgYToClient(logAnchor.y, viewBox) : null;
        // v4577: default as in the reference image: directly left of the LOG axis,
        // vertically centered on that axis. The action box does not sit on the crossing;
        // it labels/controls the LOG-axis from its left edge.
        const axisGap = 8;
        southLeft = Number.isFinite(logStartClient)
          ? (logStartClient - hostRect.left - southW - axisGap)
          : (svgLocalLeft + 10);
        southTop = Number.isFinite(logYClient)
          ? (logYClient - hostRect.top - southH / 2)
          : (svgLocalBottom - southH - 12);
      }
      southLeft = Math.round(Math.max(minSouthLeft, Math.min(maxSouthLeft, southLeft)));
      southTop = Math.round(Math.max(minSouthTop, Math.min(maxSouthTop, southTop)));
      root.style.setProperty('--main-south-left', `${southLeft}px`);
      root.style.setProperty('--main-south-top', `${southTop}px`);
      southControl.classList.toggle('is-draggable', !!state.southBoxDraggable);
      southControl.setAttribute('title', state.southBoxDraggable
        ? (isEnglish() ? 'Drag this language action box. Default: centered on the original LOG axis height.' : 'Sleep deze taalactiebox. Default: op de oorspronkelijke hoogte van de LOG-as.')
        : (isEnglish() ? 'Language action box is fixed by Config.' : 'Taalactiebox is vastgezet via Config.'));
    } else {
      root.style.removeProperty('--main-south-left');
      root.style.removeProperty('--main-south-top');
    }
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

  function handheldMaximumViewBox(fit) {
    const forced = activeViewportMode();
    const handheld = forced === 'mobile-portrait'
      || forced === 'mobile-landscape'
      || isPhysicalHandheldViewport();
    const aspect = canvasAspectRatio();
    if (!handheld || !fit || !Number.isFinite(aspect) || aspect <= 0) {
      return expandBoxToAspect(fit, aspect);
    }
    if (multiOgnAnaphorActive()) return expandBoxToAspect(fit, aspect);
    // Gebruik de Syntax/Functional-unie als focus. Daardoor blijft MAX op
    // mobiel even groot en op dezelfde plaats bij een viewwissel, terwijl het
    // getekende raster zelf exact op de actuele assen blijft eindigen.
    const axes = stableProjectionAxisFocusBox(fit);
    if (!axes) return expandBoxToAspect(fit, aspect);
    // MAX focust op het volledige asgebied. In een smal telefoonscherm kunnen
    // labels buiten de assen daardoor buiten beeld vallen; pan/zoom maakt ze
    // bereikbaar. De opties 'volledige boom zichtbaar' blijven beschikbaar.
    const padX = Math.max(12, cellX() * 0.12);
    const padY = Math.max(12, cellY() * 0.20);
    const focus = {
      x: axes.x - padX,
      y: axes.y - padY,
      w: axes.w + padX * 2,
      h: axes.h + padY * 2
    };
    // v2.0.0-rc.45: ook in landschap is MAX een contain-fit. De voormalige
    // cover-zoom vulde wel de breedte, maar sneed de rastertop en de volledige
    // LOG-as af. De plattere landschapscellen hierboven benutten de breedte
    // zonder semantische projecties buiten het scherm te plaatsen.
    return expandBoxToAspect(focus, aspect);
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
      // v4571: Hoofdvenster = volledige boom zichtbaar. Deze rand hoort bij
      // de standaardfit en geldt voor desktop én mobiel. Hij voorkomt dat de
      // onderste LOG-box of de verplaatste SYNT-as net buiten de viewBox valt.
      // v4571: minder lege gridruimte links van LEX en rechts van
      // projectie/SOV-box. De bbox zelf blijft volledig binnen beeld; alleen de
      // extra bedieningsmarge is teruggebracht.
      extra.left = Math.max(fit.w * 0.018, 18 * unitX);
      extra.top = Math.max(fit.h * 0.034, 30 * unitY);
      if (portrait) {
        const bottomPx = Math.max(148, (controlsRect?.height || 92) + (southRect?.height || 0) + 42);
        extra.right = Math.max(fit.w * 0.045, 34 * unitX);
        extra.bottom = Math.max(fit.h * 0.20, bottomPx * unitY);
      } else {
        // v4571: extra rechterruimte reserveren zodat de projectieknoppenbox
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

  function computeMaximumContentFitBox() {
    if (!els.svg) return null;
    const ignored = [...els.svg.querySelectorAll('.grid, .view-pan-hint, .projection-stability-frame')];
    const oldDisplays = ignored.map(node => node.style.display);
    try {
      // MAX gebruikt alleen de werkelijk getekende boom en projecties. Het
      // oude stabiliteitskader was bijna tweemaal zo groot als die inhoud en
      // maakte daardoor vooral desktoptekst onleesbaar klein.
      ignored.forEach(node => { node.style.display = 'none'; });
      const projectionView = languageTreeActive() && ['axes', 'source', 'lex', 'synt', 'log'].includes(state.projection);
      const maximumFrame = isMainScreenActive() && projectionView
        ? maximumProjectionFrameBox()
        : null;
      const bbox = maximumFrame
        ? { x: maximumFrame.x, y: maximumFrame.y, width: maximumFrame.w, height: maximumFrame.h }
        : els.svg.getBBox();
      if (!bbox || !Number.isFinite(bbox.x) || !Number.isFinite(bbox.y)
          || !Number.isFinite(bbox.width) || !Number.isFinite(bbox.height)
          || bbox.width <= 0 || bbox.height <= 0) return null;
      const base = Math.max(bbox.width, bbox.height);
      const margin = isMobileViewport()
        ? Math.max(20, Math.min(42, base * 0.024))
        : Math.max(16, Math.min(34, base * 0.018));
      const fit = {
        x: bbox.x - margin,
        y: bbox.y - margin,
        w: bbox.width + margin * 2,
        h: bbox.height + margin * 2
      };
      state.lastGridBox = { ...fit };
      if (!growthActive() || !state.maximumContentFit) {
        state.maximumContentFit = { ...fit };
      }
      return handheldMaximumViewBox(fit);
    } catch (_err) {
      return null;
    } finally {
      ignored.forEach((node, index) => { node.style.display = oldDisplays[index] || ''; });
    }
  }

  function computeAutoFitBox() {
    if (!els.svg) return fallbackViewBox();
    if (isMainScreenActive() && validViewFitMode() === 'max') {
      const maximumFit = computeMaximumContentFitBox();
      if (maximumFit) return maximumFit;
    }
    // v2.0.0-rc.14: alle projectie-views gebruiken één geometrisch viewport,
    // onafhankelijk van welke overlay zichtbaar is. Dit sluit auto-fit-
    // verschillen uit en voorkomt elke horizontale of verticale verspringing.
    if (isMainScreenActive() && languageTreeActive() && ['axes', 'source', 'lex', 'synt', 'log'].includes(state.projection)) {
      const frame = projectionStableFrameBox();
      const gridMargin = Math.max(18, Math.min(42, Math.max(frame.w, frame.h) * 0.018));
      state.lastGridBox = {
        x: frame.x - gridMargin,
        y: frame.y - gridMargin,
        w: frame.w + gridMargin * 2,
        h: frame.h + gridMargin * 2
      };
      return stableProjectionViewBox();
    }
    const ignored = [...els.svg.querySelectorAll('.grid, .view-pan-hint')];
    const oldDisplays = ignored.map(node => node.style.display);
    try {
      // FIT volgt uitsluitend boom + named projections. Raster en hulplabels
      // mogen de fit-box niet breder of hoger maken.
      ignored.forEach(node => { node.style.display = 'none'; });
      const bbox = els.svg.getBBox();
      if (!bbox || !Number.isFinite(bbox.width) || !Number.isFinite(bbox.height) || bbox.width <= 0 || bbox.height <= 0) {
        return fallbackViewBox();
      }
      const main = isMainScreenActive();
      const base = Math.max(bbox.width, bbox.height);
      // v4571: hoofdvenster kreeg te weinig fit-marge; bij meet-scaling kon de
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
      // v4571: raster volgt de inhoud strakker dan de aspect-viewBox.
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
    // Handmatige pan/zoom blijft bij een projectie- of viewwissel exact staan.
    if (!force && state.manualViewBox) {
      setViewBox(state.manualViewBox, false);
      return;
    }
    const growthBox = stableGrowthViewBox();
    if (growthBox && !force) {
      setViewBox(growthBox, false);
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
    recordParadata('fit-view', {});
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
    drawCanvasGuideText(g, 22, 28, 'grid past strak rond centrale view/projecties · geen leeg raster rondom · Config opent instellingen', 'view-pan-hint');
    return g;
  }

  function applyMultiOgnPlaybackVisibility(group, composition) {
    const plan = multiOgnPlayPlan(composition);
    const max = plan.length - 1;
    const phase = state.multiOgnPlayEnabled
      ? Math.max(0, Math.min(max, Number(state.multiOgnPlayStep) || 0)) : max;
    const operation = plan[phase];
    group.setAttribute('data-play-step', String(phase));
    group.setAttribute('data-play-max', String(max));
    group.setAttribute('data-play-operation', operation.id);
    group.setAttribute('data-play-unit', operation.unitId || '');
    const treeStep = new Map(composition.units.map(unit => [unit.id,
      plan.findIndex(item => item.id === 'tree' && item.unitId === unit.id)]));
    const relationsStep = plan.findIndex(item => item.id === 'relations');
    for (const layer of Array.from(group.children || [])) {
      if (layer.classList.contains('multi-ogn-unit-frame-layer')) {
        Array.from(layer.children || []).forEach(element => {
          const unitId = element.getAttribute('data-ogn-unit');
          element.setAttribute('visibility', !unitId || phase >= (treeStep.get(unitId) || 1) ? 'visible' : 'hidden');
        });
      } else if (layer.classList.contains('multi-ogn-tree-edge-layer')
                 || layer.classList.contains('multi-ogn-tree-node-layer')) {
        Array.from(layer.children || []).forEach(unit => {
          unit.setAttribute('visibility', phase >= (treeStep.get(unit.getAttribute('data-ogn-unit')) || 1)
            ? 'visible' : 'hidden');
        });
      } else if (layer.classList.contains('multi-ogn-coreference')) {
        layer.setAttribute('visibility', phase >= relationsStep ? 'visible' : 'hidden');
      } else if (layer.classList.contains('multi-ogn-shared-lex')) {
        layer.setAttribute('visibility', operation.id === 'lex' || operation.id === 'lex-complete' ? 'visible' : 'hidden');
        Array.from(layer.children || []).forEach(element => {
          const lexUnit = element.getAttribute('data-lex-unit');
          if (lexUnit) element.setAttribute('visibility', operation.id === 'lex-complete' || lexUnit === operation.unitId ? 'visible' : 'hidden');
        });
      } else if (layer.classList.contains('utterance-lex-movement-layer')) {
        layer.setAttribute('visibility', operation.id === 'lex' ? 'visible' : 'hidden');
      } else if (layer.classList.contains('multi-ogn-relation-note')) {
        layer.setAttribute('visibility', phase >= relationsStep ? 'visible' : 'hidden');
      }
    }
  }

  function drawMultiOgnAnaphor() {
    if (activeUtteranceDefinition()) return drawUtteranceKernelComposition();
    const composition = multiOgnAnaphorComposition();
    const g = baseSvg('multi-ogn-anaphor-view');
    const origin = { x: 760, y: 112 };
    const unitById = new Map(composition.units.map(unit => [unit.id, unit]));
    const nodePoint = (unitId, nodeId) => {
      const node = unitById.get(unitId)?.layout?.nodes?.find(candidate => candidate.id === nodeId);
      return node ? { ...node, px: px(node.x, origin), py: py(node.y, origin) } : null;
    };
    const axisX = px(composition.box.minX, origin) - Math.max(190, cellX() * 1.85);
    const axisTop = py(composition.box.minY, origin) - Math.max(52, cellY() * 0.9);
    const axisBottom = py(composition.box.maxY, origin) + Math.max(54, cellY() * 0.9);
    const treeRight = px(composition.box.maxX, origin) + Math.max(90, cellX() * 0.75);
    const titleY = axisTop - Math.max(76, cellY() * 1.25);
    const framePadX = Math.max(54, cellX() * 0.48);
    const framePadY = Math.max(36, cellY() * 0.56);

    drawAxisTitle(g, axisX - 72, titleY, isEnglish()
      ? 'ANAPHOR · MULTI-OGN · two independently calculated trees'
      : 'ANAFOOR · MULTI-OGN · twee afzonderlijk berekende bomen');
    drawCanvasGuideText(g, axisX - 72, titleY + 28, isEnglish()
      ? 'Composition: keep both OGN units rigid → S1 above S2 → align MAN and HIJ on one declared column.'
      : 'Compositie: beide OGN’s star houden → S1 boven S2 → MAN en HIJ op één gedeclareerde kolom uitlijnen.', 'rule-label');

    const frameLayer = svgEl('g', { class: 'multi-ogn-unit-frame-layer' });
    composition.units.forEach(unit => {
      const box = unit.layout.box;
      const x = px(box.minX, origin) - framePadX;
      const y = py(box.minY, origin) - framePadY;
      const width = px(box.maxX, origin) - px(box.minX, origin) + framePadX * 2;
      const height = py(box.maxY, origin) - py(box.minY, origin) + framePadY * 2;
      const sentence = composition.demo.sentences.find(item => item.id === unit.id);
      frameLayer.appendChild(svgEl('rect', {
        x, y, width, height, rx: 22,
        class: 'multi-ogn-unit-frame',
        'data-ogn-unit': unit.id,
        'data-grid-invariant-scope': 'per-ogn'
      }));
      frameLayer.appendChild(svgEl('text', { x: x + 18, y: y + 26, class: 'multi-ogn-unit-label' }, `${unit.id} · OGN ${unit.order}`));
      frameLayer.appendChild(svgEl('text', { x: x + 18, y: y + 50, class: 'multi-ogn-sentence-label' }, sentence?.text || unit.id));
    });
    g.appendChild(frameLayer);

    const lexLayer = svgEl('g', {
      class: 'multi-ogn-shared-lex',
      'data-lex-order': 'S1-before-S2',
      'data-composition-role': 'shared-lex-axis'
    });
    lexLayer.appendChild(svgEl('text', { x: axisX - 78, y: axisTop - 24, class: 'axis-title multi-ogn-lex-title' }, 'LEX · SEQUENTIE {S1, S2}'));
    lexLayer.appendChild(svgEl('line', {
      x1: axisX, y1: axisTop, x2: axisX, y2: axisBottom,
      class: 'multi-ogn-lex-axis lex-axis-line'
    }));
    let previousUnit = '';
    const leafRadius = treeNodeRenderMetrics().leafRadius;
    composition.lexItems.forEach((item, index) => {
      const point = nodePoint(item.unitId, item.nodeId);
      if (!point) throw new Error(`LEX-bronknoop ontbreekt: ${item.nodeId}`);
      if (state.showRelations) {
        lexLayer.appendChild(svgEl('path', {
          d: `M ${axisX + 62} ${point.py} H ${point.px - leafRadius}`,
          class: 'projection-line lex multi-ogn-lex-projection',
          'data-source-node-id': item.nodeId,
          'data-ogn-unit': item.unitId
        }));
      }
      lexLayer.appendChild(svgEl('rect', {
        x: axisX - 60, y: point.py - 24, width: 120, height: 48, rx: 13,
        class: 'multi-ogn-lex-item lex-slot-box',
        'data-node-id': item.nodeId,
        'data-lex-index': index + 1,
        'data-sentence-order': item.sentenceOrder
      }));
      lexLayer.appendChild(svgEl('text', { x: axisX, y: point.py + 5, class: 'lex-label multi-ogn-lex-label' }, item.label));
      if (previousUnit !== item.unitId) {
        lexLayer.appendChild(svgEl('text', { x: axisX - 78, y: point.py + 5, class: 'multi-ogn-lex-unit-label' }, item.unitId));
        previousUnit = item.unitId;
      }
    });
    g.appendChild(lexLayer);

    const treeEdgeLayer = svgEl('g', { class: 'multi-ogn-tree-edge-layer' });
    composition.units.forEach(unit => {
      const unitGroup = svgEl('g', {
        class: 'multi-ogn-unit multi-ogn-tree-edges',
        'data-ogn-unit': unit.id,
        'data-calculation-order': unit.order
      });
      drawTreeEdges(unitGroup, unit.layout, origin, null);
      treeEdgeLayer.appendChild(unitGroup);
    });
    g.appendChild(treeEdgeLayer);

    const relation = composition.relation;
    const antecedent = nodePoint(relation.antecedent.unitId, relation.antecedent.nodeId);
    const anaphor = nodePoint(relation.anaphor.unitId, relation.anaphor.nodeId);
    if (!antecedent || !anaphor || Math.abs(antecedent.px - anaphor.px) > 0.01) {
      throw new Error('MAN en HIJ liggen niet op exact dezelfde verticale gridlijn.');
    }
    if (state.showRelations) {
      const coreferenceGroup = svgEl('g', {
        class: 'multi-ogn-coreference',
        'data-relation': 'coreference',
        'data-antecedent': relation.antecedent.nodeId,
        'data-anaphor': relation.anaphor.nodeId,
        'data-directed': 'false',
        'data-grid-scope': 'cross-ogn-declared'
      });
      coreferenceGroup.appendChild(svgEl('title', {}, isEnglish()
        ? 'MAN is the antecedent; HIJ is the anaphor. Both expressions are coreferential. The line has no direction.'
        : 'MAN is het antecedent; HIJ is de anafoor. Beide uitdrukkingen zijn coreferentieel. De lijn heeft geen richting.'));
      coreferenceGroup.appendChild(svgEl('line', {
        x1: antecedent.px,
        y1: antecedent.py + leafRadius,
        x2: anaphor.px,
        y2: anaphor.py - leafRadius,
        class: 'multi-ogn-coreference-line'
      }));
      g.appendChild(coreferenceGroup);
    }

    const treeNodeLayer = svgEl('g', { class: 'multi-ogn-tree-node-layer' });
    composition.units.forEach(unit => {
      const unitGroup = svgEl('g', {
        class: 'multi-ogn-unit multi-ogn-tree-nodes',
        'data-ogn-unit': unit.id,
        'data-rigid-shift-x': unit.shift.dx,
        'data-rigid-shift-y': unit.shift.dy
      });
      drawTreeNodes(unitGroup, unit.layout, origin, false, null);
      treeNodeLayer.appendChild(unitGroup);
    });
    g.appendChild(treeNodeLayer);
    g.querySelectorAll(`[data-node-id="${relation.antecedent.nodeId}"]`).forEach(node => node.classList.add('coreference-antecedent'));
    g.querySelectorAll(`[data-node-id="${relation.anaphor.nodeId}"]`).forEach(node => node.classList.add('coreference-anaphor'));

    drawCanvasGuideText(g, axisX - 72, axisBottom + 42, isEnglish()
      ? 'MAN = antecedent · HIJ = anaphor · same referent · straight line, no arrow'
      : 'MAN = antecedent · HIJ = anafoor · dezelfde referent · rechte lijn, geen pijl', 'rule-label multi-ogn-relation-note');
    state.lastGridBox = {
      x: axisX - 118,
      y: titleY - 44,
      w: treeRight - axisX + 168,
      h: axisBottom - titleY + 132
    };
    applyMultiOgnPlaybackVisibility(g, composition);
    els.svg.appendChild(g);
  }

  function drawUtteranceKernelComposition() {
    const composition = multiOgnAnaphorComposition();
    const definition = composition.definition;
    const g = baseSvg('multi-ogn-anaphor-view utterance-kernel-view');
    g.setAttribute('data-utterance-id', definition.id);
    g.setAttribute('data-kernel-count', String(composition.units.length));
    if (definition.anaphorVariant) g.setAttribute('data-anaphor-variant', definition.anaphorVariant);
    const horizontalSpacing = validKernelBranchSpacing(state.kernelBranchHorizontal);
    const verticalSpacing = validKernelBranchSpacing(state.kernelBranchVertical);
    const flipMode = validKernelBranchFlip(state.kernelBranchFlip);
    const flipSign = flipMode === 'flip' ? -1 : 1;
    const hasLocalRoleFlip = definition.type === 'causal-role-flip' || definition.type === 'story-role-flip';
    const playPlan = multiOgnPlayPlan(composition);
    const playMax = playPlan.length - 1;
    const playPhase = state.multiOgnPlayEnabled ? Math.max(0, Math.min(playMax, Number(state.multiOgnPlayStep) || 0)) : playMax;
    const playOperation = playPlan[playPhase];
    const showK2BeforeLocalFlip = hasLocalRoleFlip && playOperation.id === 'tree' && playOperation.unitId === 'K2';
    const showK2FlipReveal = hasLocalRoleFlip && playOperation.id === 'flip' && playOperation.unitId === 'K2';
    const horizontalScale = kernelBranchScale(horizontalSpacing);
    const verticalScale = kernelBranchScale(verticalSpacing);
    g.setAttribute('data-grid-size-horizontal', validGridSize(state.gridSizeHorizontal));
    g.setAttribute('data-grid-size-vertical', validGridSize(state.gridSizeVertical));
    g.setAttribute('data-branch-horizontal', horizontalSpacing);
    g.setAttribute('data-branch-vertical', verticalSpacing);
    g.setAttribute('data-branch-flip', flipMode);
    g.setAttribute('data-branch-horizontal-scale', String(horizontalScale));
    g.setAttribute('data-branch-vertical-scale', String(verticalScale));
    const origin = { x: 760, y: 112 };
    const scaledLayout = (layout, unitId, forceLocalMirror = null) => {
      const localMirror = forceLocalMirror === null
        ? showK2BeforeLocalFlip && unitId === 'K2'
        : Boolean(forceLocalMirror) && unitId === 'K2';
      const rootX = layout.nodes.find(node => node.label === 'S')?.x || 0;
      const mapX = value => (localMirror ? 2 * rootX - value : value) * horizontalScale * flipSign;
      const nodes = layout.nodes.map(node => ({ ...node, x: mapX(node.x), y: node.y * verticalScale }));
      const edges = layout.edges.map(edge => ({
        ...edge, fromX: mapX(edge.fromX), fromY: edge.fromY * verticalScale,
        toX: mapX(edge.toX), toY: edge.toY * verticalScale
      }));
      return {
        ...layout, nodes, edges, mirrored: localMirror ? !layout.mirrored : layout.mirrored,
        box: { minX: Math.min(...nodes.map(node => node.x)), maxX: Math.max(...nodes.map(node => node.x)),
          minY: Math.min(...nodes.map(node => node.y)), maxY: Math.max(...nodes.map(node => node.y)) }
      };
    };
    const unitById = new Map(composition.units.map(unit => [unit.id, { ...unit, layout: scaledLayout(unit.layout, unit.id) }]));
    const k2BeforeFlipLayout = showK2FlipReveal
      ? scaledLayout(composition.units.find(unit => unit.id === 'K2').layout, 'K2', true)
      : null;
    const displayBox = {
      minX: (flipSign < 0 ? -composition.box.maxX : composition.box.minX) * horizontalScale,
      maxX: (flipSign < 0 ? -composition.box.minX : composition.box.maxX) * horizontalScale,
      minY: composition.box.minY * verticalScale, maxY: composition.box.maxY * verticalScale
    };
    const nodePoint = (unitId, nodeId) => {
      const node = unitById.get(unitId)?.layout?.nodes?.find(candidate => candidate.id === nodeId);
      return node ? { ...node, px: px(node.x, origin), py: py(node.y, origin) } : null;
    };
    const axisX = px(displayBox.minX, origin) - Math.max(150, cellX() * horizontalScale * 1.65);
    const axisTop = py(displayBox.minY, origin) - Math.max(52, cellY() * verticalScale * 0.9);
    const axisBottom = py(displayBox.maxY, origin) + Math.max(54, cellY() * verticalScale * 0.9);
    const titleY = axisTop - Math.max(76, cellY() * 1.25);
    const framePadX = Math.max(34, cellX() * horizontalScale * 0.45);
    const framePadY = Math.max(28, cellY() * verticalScale * 0.48);
    const fullNodeMetrics = treeNodeRenderMetrics();
    const kernelNodeMetrics = {
      leafRadius: Math.min(fullNodeMetrics.leafRadius, Math.max(16, cellY() * verticalScale * 0.43)),
      categoryWidth: Math.min(fullNodeMetrics.categoryWidth || 68, Math.max(54, cellX() * horizontalScale * 1.1)),
      categoryHeight: Math.min(fullNodeMetrics.categoryHeight || 34, Math.max(26, cellY() * verticalScale * 0.72)),
      cornerRadius: Math.min(fullNodeMetrics.cornerRadius || 10, 10)
    };
    const leafRadius = kernelNodeMetrics.leafRadius;
    g.setAttribute('data-free-node-rendering', 'slanted');
    g.setAttribute('data-node-radius', String(leafRadius));
    g.setAttribute('data-local-flip-target', hasLocalRoleFlip ? 'K2' : 'none');
    const flipStep = playPlan.findIndex(item => item.id === 'flip');
    g.setAttribute('data-local-flip-applied', hasLocalRoleFlip && playPhase >= flipStep ? 'true' : 'false');

    drawAxisTitle(g, axisX - 72, titleY, isEnglish()
      ? `${composition.units.length > 2 ? 'STORY' : 'UTTERANCE'} · ${composition.units.length} KERNEL CLAUSES · ${definition.title}`
      : `${composition.units.length > 2 ? 'STORY' : 'UITING'} · ${composition.units.length} KERNZINNEN · ${definition.title}`);
    drawCanvasGuideText(g, axisX - 72, titleY + 28, isEnglish()
      ? 'K1 above K2 · declared anaphors align vertically · LEX shows the realized utterance.'
      : 'K1 boven K2 · gedeclareerde anaforen staan verticaal · LEX toont de gerealiseerde uiting.', 'rule-label');
    if (hasLocalRoleFlip) {
      drawCanvasGuideText(g, axisX - 72, titleY + 50, isEnglish()
        ? (showK2BeforeLocalFlip ? 'BEFORE FLIP: K2 keeps its own branch orientation.' : playPhase >= flipStep ? 'FLIP HITS K2: its S and VP role branches mirror; node identities and syntax stay unchanged.' : 'K2 will flip because JAN and JEK exchange roles; both reference lines must remain vertical.')
        : (showK2BeforeLocalFlip ? 'VÓÓR FLIP: K2 behoudt eerst zijn eigen takrichting.' : playPhase >= flipStep ? 'FLIP SLAAT TOE OP K2: de roltakken onder S en VP spiegelen; knoopidentiteit en syntaxis blijven gelijk.' : 'K2 zal flippen omdat JAN en JEK van rol wisselen; beide verwijslijnen moeten verticaal blijven.'),
      'rule-label utterance-flip-explanation');
    }

    const frameLayer = svgEl('g', { class: 'multi-ogn-unit-frame-layer' });
    composition.units.forEach(unit => {
      const displayLayout = unitById.get(unit.id).layout;
      const box = displayLayout.box;
      const x = px(box.minX, origin) - framePadX;
      const y = py(box.minY, origin) - framePadY;
      const width = px(box.maxX, origin) - px(box.minX, origin) + framePadX * 2;
      const height = py(box.maxY, origin) - py(box.minY, origin) + framePadY * 2;
      const sentence = composition.demo.sentences.find(candidate => candidate.id === unit.id);
      frameLayer.appendChild(svgEl('rect', {
        x, y, width, height, rx: 22, class: 'multi-ogn-unit-frame utterance-kernel-frame',
        'data-ogn-unit': unit.id, 'data-grid-invariant-scope': 'per-ogn',
        'data-local-flip-state': unit.id === 'K2' && hasLocalRoleFlip ? (playPhase >= flipStep ? 'applied' : 'before') : 'not-required',
        'data-branch-orientation': Boolean(displayLayout.mirrored) !== (flipSign < 0) ? 'mirrored' : 'normal'
      }));
      frameLayer.appendChild(svgEl('text', { x: x + 18, y: y + 26, class: 'multi-ogn-unit-label' }, `${unit.id} · ${isEnglish() ? 'KERNEL CLAUSE' : 'KERNZIN'}`));
      frameLayer.appendChild(svgEl('text', { x: x + 18, y: y + 50, class: 'multi-ogn-sentence-label' }, sentence?.text || unit.id));
    });
    g.appendChild(frameLayer);

    const lexLayer = svgEl('g', {
      class: 'multi-ogn-shared-lex utterance-surface-lex',
      'data-composition-role': 'shared-lex-axis', 'data-lex-order': 'utterance-surface'
    });
    lexLayer.appendChild(svgEl('text', { x: axisX - 78, y: axisTop - 24, class: 'axis-title multi-ogn-lex-title' }, isEnglish() ? 'LEX · UTTERANCE' : 'LEX · UITING'));
    lexLayer.appendChild(svgEl('line', { x1: axisX, y1: axisTop, x2: axisX, y2: axisBottom, class: 'multi-ogn-lex-axis lex-axis-line' }));

    const lexSlotTop = axisTop + 34;
    const lexSlotBottom = axisBottom - 34;
    const lexSlotSpan = Math.max(0, lexSlotBottom - lexSlotTop);
    let previousUnit = '';
    const lexTargets = [];
    composition.lexItems.forEach((item, index) => {
      const nextUnit = composition.lexItems.slice(index + 1).find(candidate => !candidate.connector)?.unitId;
      const lexUnit = item.connector ? (nextUnit || previousUnit || 'LINK') : item.unitId;
      const point = item.connector ? null : nodePoint(item.unitId, item.nodeId);
      if (!item.connector && !point) throw new Error(`LEX-bronknoop ontbreekt: ${item.nodeId}`);
      const itemY = composition.lexItems.length <= 1 ? (lexSlotTop + lexSlotBottom) / 2
        : lexSlotTop + (lexSlotSpan * index) / (composition.lexItems.length - 1);
      lexLayer.appendChild(svgEl('rect', {
        x: axisX - 60, y: itemY - 24, width: 120, height: 48, rx: 13,
        class: `multi-ogn-lex-item lex-slot-box${item.connector ? ' utterance-connector' : ''}`,
        'data-node-id': item.nodeId || '', 'data-lex-index': index + 1,
        'data-sentence-order': item.sentenceOrder, 'data-surface-label': item.label,
        'data-lex-unit': lexUnit
      }));
      lexLayer.appendChild(svgEl('text', { x: axisX, y: itemY + 5, class: 'lex-label multi-ogn-lex-label', 'data-lex-unit': lexUnit }, item.label));
      if (!item.connector && previousUnit !== item.unitId) {
        lexLayer.appendChild(svgEl('text', { x: axisX - 78, y: itemY + 5, class: 'multi-ogn-lex-unit-label', 'data-lex-unit': lexUnit }, item.unitId));
        previousUnit = item.unitId;
      }
      if (point) lexTargets.push({ ...item, point, itemY, lexUnit, index });
    });
    g.appendChild(lexLayer);

    const lexMovementLayer = svgEl('g', {
      class: 'utterance-lex-movement-layer', 'data-lex-unit': playOperation.unitId || '',
      'aria-label': isEnglish() ? 'LEX source-to-utterance movements' : 'LEX-verplaatsingen van bron naar uiting'
    });
    if (playOperation.id === 'lex') {
      lexTargets
        .filter(target => target.lexUnit === playOperation.unitId)
        .filter(target => Math.abs(target.itemY - target.point.py) > 1)
        .forEach((target, movementIndex) => {
        const movementX = axisX + 72 + (movementIndex % 4) * 11;
        const movingUp = target.itemY < target.point.py;
        lexMovementLayer.appendChild(svgEl('path', {
          d: `M ${movementX} ${target.point.py} V ${target.itemY}`,
          class: 'utterance-lex-movement', 'data-source-node-id': target.nodeId,
          'data-source-label': target.point.label, 'data-realized-label': target.label,
          'data-target-word-order': target.wordOrder ?? target.index + 1,
          'data-movement-scope': 'lex-axis', 'data-axis-x': movementX,
          'data-from-y': target.point.py, 'data-to-y': target.itemY,
          'data-position-changed': 'true'
        }));
        lexMovementLayer.appendChild(svgEl('circle', {
          cx: movementX, cy: target.point.py, r: 4.5, class: 'utterance-lex-source-trace',
          'data-movement-index': movementIndex + 1
        }));
        lexMovementLayer.appendChild(svgEl('polygon', {
          points: movingUp
            ? `${movementX},${target.itemY} ${movementX - 6},${target.itemY + 10} ${movementX + 6},${target.itemY + 10}`
            : `${movementX},${target.itemY} ${movementX - 6},${target.itemY - 10} ${movementX + 6},${target.itemY - 10}`,
          class: 'utterance-lex-arrowhead', 'data-movement-index': movementIndex + 1
        }));
        lexMovementLayer.appendChild(svgEl('text', {
          x: movementX + 12, y: target.itemY - 9, class: 'utterance-lex-movement-label'
        }, `${target.point.label} → ${target.label} · ${isEnglish() ? 'position' : 'positie'} ${target.wordOrder ?? target.index + 1}`));
      });
    }
    g.appendChild(lexMovementLayer);

    // PLAY step 3 deliberately shows both geometries at once. The faded K2 is
    // the immediately preceding, unflipped state; the solid tree is the chosen
    // flipped result. Motion guides make the left/right exchange observable
    // even when the next frame is displayed without CSS animation.
    if (k2BeforeFlipLayout) {
      const flipRevealLayer = svgEl('g', {
        class: 'utterance-flip-reveal-layer',
        'data-play-operation': 'flip-k2-left-right',
        'aria-label': isEnglish() ? 'Flip K2 shown: before and after' : 'Flip K2 zichtbaar: vóór en na'
      });
      const ghostEdges = svgEl('g', { class: 'utterance-flip-before-edges', 'data-flip-state': 'before' });
      if (state.showRelations) {
        for (const edge of k2BeforeFlipLayout.edges) {
          ghostEdges.appendChild(svgEl('line', {
            x1: px(edge.fromX, origin), y1: py(edge.fromY, origin),
            x2: px(edge.toX, origin), y2: py(edge.toY, origin),
            class: 'tree-edge utterance-flip-ghost-edge',
            'data-from-node-id': edge.from, 'data-to-node-id': edge.to
          }));
        }
      }
      flipRevealLayer.appendChild(ghostEdges);
      const ghostNodes = svgEl('g', { class: 'utterance-flip-before-nodes', 'data-flip-state': 'before' });
      drawTreeNodes(ghostNodes, k2BeforeFlipLayout, origin, false, null, kernelNodeMetrics);
      flipRevealLayer.appendChild(ghostNodes);

      const afterLayout = unitById.get('K2').layout;
      const beforeById = new Map(k2BeforeFlipLayout.nodes.map(node => [node.id, node]));
      const motionLayer = svgEl('g', { class: 'utterance-flip-motion-layer' });
      afterLayout.nodes.forEach(afterNode => {
        const beforeNode = beforeById.get(afterNode.id);
        if (!beforeNode || Math.abs(beforeNode.x - afterNode.x) < 0.01) return;
        motionLayer.appendChild(svgEl('line', {
          x1: px(beforeNode.x, origin), y1: py(beforeNode.y, origin),
          x2: px(afterNode.x, origin), y2: py(afterNode.y, origin),
          class: 'utterance-flip-motion', 'data-node-id': afterNode.id
        }));
      });
      flipRevealLayer.appendChild(motionLayer);
      const badgeX = px(afterLayout.box.minX, origin) - framePadX + 18;
      const badgeY = py(afterLayout.box.minY, origin) - framePadY - 15;
      flipRevealLayer.appendChild(svgEl('text', {
        x: badgeX, y: badgeY, class: 'utterance-flip-badge'
      }, isEnglish() ? 'FLIP K2 · LEFT/RIGHT · faded=before · solid=after' : 'FLIP K2 · LINKS/RECHTS · vaag=vóór · vol=na'));
      g.appendChild(flipRevealLayer);
    }

    const edgeLayer = svgEl('g', { class: 'multi-ogn-tree-edge-layer' });
    composition.units.forEach(unit => {
      const unitGroup = svgEl('g', { class: 'multi-ogn-unit multi-ogn-tree-edges', 'data-ogn-unit': unit.id, 'data-calculation-order': unit.order });
      if (state.showRelations) {
        for (const edge of unitById.get(unit.id).layout.edges) {
          const fromX = px(edge.fromX, origin);
          const fromY = py(edge.fromY, origin);
          const toX = px(edge.toX, origin);
          const toY = py(edge.toY, origin);
          const deltaX = toX - fromX;
          const deltaY = toY - fromY;
          if (Math.abs(deltaX) < 0.01 || Math.abs(deltaY) < 0.01) {
            throw new Error(`OpenGraph free-node-tak ${edge.from} → ${edge.to} mag niet horizontaal of verticaal zijn.`);
          }
          const length = Math.hypot(deltaX, deltaY);
          const inset = Math.min(leafRadius * 0.45, length * 0.18);
          const ratio = inset / length;
          unitGroup.appendChild(svgEl('line', {
            x1: fromX + deltaX * ratio, y1: fromY + deltaY * ratio,
            x2: toX - deltaX * ratio, y2: toY - deltaY * ratio,
            class: 'tree-edge syntax-tree-edge utterance-free-node-edge',
            'data-from-node-id': edge.from, 'data-to-node-id': edge.to,
            'data-free-node-edge': 'slanted'
          }));
        }
      }
      edgeLayer.appendChild(unitGroup);
    });
    g.appendChild(edgeLayer);

    if (state.showRelations && !showK2BeforeLocalFlip) {
      composition.relations.forEach((relation, index) => {
        const antecedent = nodePoint(relation.antecedent.unitId, relation.antecedent.nodeId);
        const anaphor = nodePoint(relation.anaphor.unitId, relation.anaphor.nodeId);
        if (!antecedent || !anaphor || Math.abs(antecedent.px - anaphor.px) > 0.01) {
          throw new Error(`Anafoorrelatie ${index + 1} ligt niet op één verticale gridlijn.`);
        }
        const group = svgEl('g', {
          class: 'multi-ogn-coreference utterance-coreference', 'data-relation': 'coreference',
          'data-antecedent': relation.antecedent.nodeId, 'data-anaphor': relation.anaphor.nodeId,
          'data-referent': relation.referent, 'data-directed': 'false', 'data-grid-scope': 'cross-ogn-declared'
        });
        group.appendChild(svgEl('title', {}, `${relation.antecedentLabel} ↔ ${relation.anaphorLabel} · ${relation.referent}`));
        group.appendChild(svgEl('line', {
          x1: antecedent.px, y1: antecedent.py + leafRadius,
          x2: anaphor.px, y2: anaphor.py - leafRadius,
          class: 'multi-ogn-coreference-line utterance-coreference-line'
        }));
        g.appendChild(group);
      });
    }

    const nodeLayer = svgEl('g', { class: 'multi-ogn-tree-node-layer' });
    composition.units.forEach(unit => {
      const unitGroup = svgEl('g', {
        class: 'multi-ogn-unit multi-ogn-tree-nodes', 'data-ogn-unit': unit.id,
        'data-rigid-shift-x': unit.shift.dx, 'data-rigid-shift-y': unit.shift.dy
      });
      drawTreeNodes(unitGroup, unitById.get(unit.id).layout, origin, false, null, kernelNodeMetrics);
      if (showK2FlipReveal && unit.id === 'K2' && k2BeforeFlipLayout) {
        const beforeById = new Map(k2BeforeFlipLayout.nodes.map(node => [node.id, node]));
        unitById.get(unit.id).layout.nodes.forEach(node => {
          const before = beforeById.get(node.id);
          if (!before || Math.abs(before.x - node.x) < 0.01) return;
          unitGroup.querySelectorAll(`[data-node-id="${node.id}"]`).forEach(element => {
            element.classList.add('utterance-flip-active-node');
            element.setAttribute('data-flip-node', 'active');
            element.setAttribute('aria-label', `${node.label} · ${isEnglish() ? 'node moved by Flip' : 'knoop verplaatst door Flip'}`);
          });
        });
      }
      if (definition.type === 'causal-role-flip' && unit.id === 'K2') {
        const subjectNode = unit.layout.nodes.find(node => node.role === 'subject');
        unitGroup.querySelectorAll(`[data-node-id="${subjectNode.id}"]`).forEach(element => {
          element.classList.add('utterance-configurable-node');
          element.setAttribute('data-node-config', 'causal-subject');
          element.setAttribute('data-action', 'utterance-config-node');
          element.setAttribute('data-node-config-value', definition.anaphorVariant);
          element.setAttribute('role', 'button');
          element.setAttribute('tabindex', '0');
          element.setAttribute('aria-label', isEnglish()
            ? 'Change LEX realization of HOND: HIJ, DIE, DIE HOND, DE HOND or JEK'
            : 'Wijzig LEX-realisatie van HOND: HIJ, DIE, DIE HOND, DE HOND of JEK');
          element.appendChild(svgEl('title', {}, isEnglish()
            ? 'Click or press Enter: change the referring subject'
            : 'Klik of druk op Enter: wijzig het verwijzende subject'));
        });
      }
      unit.layout.nodes.filter(node => node.implicit).forEach(node => {
        unitGroup.querySelectorAll(`[data-node-id="${node.id}"]`).forEach(element => {
          element.classList.add('utterance-implicit-subject');
          element.setAttribute('data-implicit-subject', 'true');
        });
      });
      nodeLayer.appendChild(unitGroup);
    });
    g.appendChild(nodeLayer);
    composition.relations.forEach(relation => {
      g.querySelectorAll(`[data-node-id="${relation.antecedent.nodeId}"]`).forEach(node => node.classList.add('coreference-antecedent'));
      g.querySelectorAll(`[data-node-id="${relation.anaphor.nodeId}"]`).forEach(node => node.classList.add('coreference-anaphor'));
    });

    const relationText = composition.relations.map(relation => `${relation.antecedentLabel} ↔ ${relation.anaphorLabel}`).join(' · ');
    drawCanvasGuideText(g, axisX - 72, axisBottom + 42,
      `${relationText}${definition.implicitSubject ? ` · ${isEnglish() ? 'implicit subject' : 'impliciet subject'}=${definition.implicitSubject}` : ''}`,
      'rule-label multi-ogn-relation-note');
    const treeRight = px(displayBox.maxX, origin) + Math.max(70, cellX() * horizontalScale * 0.75);
    state.lastGridBox = { x: axisX - 118, y: titleY - 44, w: treeRight - axisX + 168, h: axisBottom - titleY + 132 };
    applyMultiOgnPlaybackVisibility(g, composition);
    els.svg.appendChild(g);
  }

  function drawDirectPlacement() {
    const engine = placementEngine();
    const direct = ensureDirectPlacementState();
    const mode = placementModeDefinition();
    const renderedPoints = directRenderedPoints(direct, mode.id);
    if (!direct || !engine.validate(direct.points) || !engine.validate(renderedPoints)) {
      throw new Error('Directe OGN-plaatsing schendt de unieke rij/kolomregel.');
    }
    const general = normalizeDirectPlacementGeneral(state.directPlacementGeneral);
    const methodConfig = activeDirectMethodConfig(mode.id);
    const g = baseSvg(`direct-placement-view direct-${mode.id}`);
    const stepX = cellX() / 2;
    const stepY = cellY() / 2;
    const axisPattern = mode.id === 'random' ? randomAxisPattern() : null;
    const activeBounds = engine.bounds(renderedPoints);
    const fixedArea = mode.id === 'random' && ['interface', 'fixed'].includes(methodConfig.maxDimensions)
      ? direct.placementArea
      : null;
    const bounds = {
      ...activeBounds,
      minX: Math.min(
        activeBounds.minX,
        axisPattern?.x.length ? axisPattern.x[0].coordinate : activeBounds.minX,
        fixedArea?.minX ?? activeBounds.minX
      ),
      maxX: Math.max(
        activeBounds.maxX,
        axisPattern?.x.length ? axisPattern.x[axisPattern.x.length - 1].coordinate : activeBounds.maxX,
        fixedArea?.maxX ?? activeBounds.maxX
      ),
      minY: Math.min(
        activeBounds.minY,
        axisPattern?.y.length ? axisPattern.y[0].coordinate : activeBounds.minY,
        fixedArea?.minY ?? activeBounds.minY
      ),
      maxY: Math.max(
        activeBounds.maxY,
        axisPattern?.y.length ? axisPattern.y[axisPattern.y.length - 1].coordinate : activeBounds.maxY,
        fixedArea?.maxY ?? activeBounds.maxY
      )
    };
    const margin = directGridMargin();
    const gridBox = {
      x: (bounds.minX - margin) * stepX,
      y: (bounds.minY - margin) * stepY,
      w: Math.max(6 * stepX, (bounds.maxX - bounds.minX + (2 * margin)) * stepX),
      h: Math.max(6 * stepY, (bounds.maxY - bounds.minY + (2 * margin)) * stepY)
    };
    state.lastGridBox = { ...gridBox };
    const grid = g.querySelector('.grid');
    if (grid) populateGridLines(grid, gridBox);

    if (axisPattern) {
      const patternGroup = svgEl('g', { class: 'direct-axis-pattern' });
      const westX = gridBox.x - Math.max(10, stepX * 0.16);
      const southY = gridBox.y + gridBox.h + Math.max(10, stepY * 0.2);
      patternGroup.appendChild(svgEl('line', {
        x1: westX,
        x2: westX,
        y1: gridBox.y,
        y2: gridBox.y + gridBox.h,
        class: 'direct-axis-hit-axis direct-axis-hit-axis-west'
      }));
      patternGroup.appendChild(svgEl('line', {
        x1: gridBox.x,
        x2: gridBox.x + gridBox.w,
        y1: southY,
        y2: southY,
        class: 'direct-axis-hit-axis direct-axis-hit-axis-south'
      }));
      const axisDenominator = axisPattern.axisImageMode === 'relative'
        ? axisPattern.maxCount
        : axisPattern.configuredIterationCount;
      const appendHitSpot = (axis, item, cx, cy) => {
        const ratio = Math.max(0, Math.min(1, item.count / Math.max(1, axisDenominator)));
        const cumulativeRatio = Math.max(0, Math.min(
          1,
          item.count / Math.max(1, axisPattern.configuredIterationCount)
        ));
        const sizeWeight = Math.sqrt(ratio);
        const colorWeight = Math.sqrt(cumulativeRatio);
        const spot = svgEl('circle', {
          cx,
          cy,
          r: 4 + (sizeWeight * 5.5),
          class: `direct-axis-hit-spot direct-axis-hit-${axis}`,
          'data-hit-count': item.count,
          'data-axis-coordinate': item.coordinate,
          'data-hit-ratio': ratio.toFixed(4),
          'data-cumulative-ratio': cumulativeRatio.toFixed(4),
          'fill-opacity': 0.24 + (colorWeight * 0.76),
          'stroke-width': 1.2 + (colorWeight * 3.2)
        });
        const axisLabel = axis === 'west' ? 'WEST' : 'SOUTH';
        spot.appendChild(svgEl('title', {}, isEnglish()
          ? `${axisLabel} · coordinate ${item.coordinate} · ${item.count} projection hit${item.count === 1 ? '' : 's'}`
          : `${axisLabel} · coördinaat ${item.coordinate} · ${item.count} projectie-hit${item.count === 1 ? '' : 's'}`));
        patternGroup.appendChild(spot);
      };
      axisPattern.y.forEach(item => {
        appendHitSpot('west', item, westX, item.coordinate * stepY);
      });
      axisPattern.x.forEach(item => {
        appendHitSpot('south', item, item.coordinate * stepX, southY);
      });
      patternGroup.appendChild(svgEl('text', {
        x: westX - 10,
        y: gridBox.y - 8,
        'text-anchor': 'end',
        class: 'direct-axis-pattern-label direct-axis-pattern-label-west'
      }, isEnglish()
        ? `WEST · PROJECTION HITS · ${axisPattern.completedIterationCount}/${axisPattern.configuredIterationCount} ROUNDS`
        : `WEST · PROJECTIE-HITS · ${axisPattern.completedIterationCount}/${axisPattern.configuredIterationCount} RONDES`));
      patternGroup.appendChild(svgEl('text', {
        x: gridBox.x,
        y: southY + stepY + 14,
        class: 'direct-axis-pattern-label direct-axis-pattern-label-south'
      }, isEnglish()
        ? `SOUTH · PROJECTION HITS · ${axisPattern.completedIterationCount}/${axisPattern.configuredIterationCount} ROUNDS`
        : `SOUTH · PROJECTIE-HITS · ${axisPattern.completedIterationCount}/${axisPattern.configuredIterationCount} RONDES`));
      g.appendChild(patternGroup);
    }

    const pixelPoints = renderedPoints.map(point => ({
      ...point,
      px: point.x * stepX,
      py: point.y * stepY
    }));
    if (general.showPath && pixelPoints.length > 1) {
      g.appendChild(svgEl('path', {
        d: pixelPoints.map((point, index) => `${index ? 'L' : 'M'} ${point.px} ${point.py}`).join(' '),
        class: 'direct-placement-path'
      }));
    }

    const nodes = svgEl('g', { class: 'direct-placement-nodes' });
    pixelPoints.forEach((point, index) => {
      const group = svgEl('g', {
        class: `direct-placement-node${index === pixelPoints.length - 1 ? ' is-current' : ''}`,
        transform: `translate(${point.px} ${point.py})`
      });
      group.appendChild(svgEl('circle', { r: directNodeRadius() }));
      if (general.showNumbers) group.appendChild(svgEl('text', { x: 0, y: 0 }, String(point.index)));
      nodes.appendChild(group);
    });
    g.appendChild(nodes);

    const titleY = gridBox.y - Math.max(42, stepY * 0.8);
    const strategyOption = mode.id === 'random'
      ? RANDOM_SPREAD_OPTIONS.find(option => option.id === methodConfig.spread)
      : GREEDY_STRATEGY_OPTIONS.find(option => option.id === methodConfig.strategy);
    const strategyLabel = isEnglish() ? strategyOption?.labelEn : strategyOption?.label;
    const iteration = mode.id === 'random' ? randomIterationProgress() : null;
    g.appendChild(svgEl('text', { x: gridBox.x, y: titleY, class: 'axis-title direct-placement-title' },
      mode.id === 'random'
        ? `RANDOM · ${isEnglish() ? 'ITERATION' : 'ITERATIE'} ${iteration.number}/${iteration.total} · DIRECT OGN`
        : 'GREEDY GROW · DIRECT OGN'));
    const repeatCaption = axisPattern
      ? (isEnglish()
        ? ` · ${axisPattern.completedIterationCount}/${axisPattern.configuredIterationCount} completed rounds · ${axisPattern.observationsPerAxis} projection hits per axis`
        : ` · ${axisPattern.completedIterationCount}/${axisPattern.configuredIterationCount} voltooide rondes · ${axisPattern.observationsPerAxis} projectie-hits per as`)
      : '';
    const caption = isEnglish()
      ? `${strategyLabel || ''} · ${direct.points.length} nodes${repeatCaption} · each new node immediately occupies one unused row and column`
      : `${strategyLabel || ''} · ${direct.points.length} knopen${repeatCaption} · iedere nieuwe knoop bezet direct één ongebruikte rij en kolom`;
    g.appendChild(svgEl('text', { x: gridBox.x, y: titleY + 24, class: 'direct-placement-caption' }, caption));
    els.svg.appendChild(g);
  }

  function pendingLexAnalysis() {
    const raw = Array.isArray(state.example?.lexInsertions) ? state.example.lexInsertions : [];
    for (const spec of raw) {
      const analysis = resolvedInsertionAnalysis(spec);
      if (analysis.unresolved) return { spec, analysis };
    }
    return null;
  }

  function chooseLexAnalysis(spec, profileId) {
    const key = insertionChoiceKey(spec);
    state.lexAnalysisChoices[key] = profileId;
    saveLexAnalysisChoices();
    recordParadata('resolve-lexical-profile', { example: state.example?.id, insertion: spec.id, profile: profileId });
    resetManualViewBox();
    render();
  }

  function renderLexAmbiguityPrompt() {
    const panel = els.lexAmbiguityPanel;
    if (!panel || !els.lexAmbiguityOptions) return;
    if (!languageTreeActive()) { panel.classList.add('hidden'); panel.setAttribute('aria-hidden', 'true'); return; }
    const pending = pendingLexAnalysis();
    if (!pending) { panel.classList.add('hidden'); panel.setAttribute('aria-hidden', 'true'); return; }
    const { spec, analysis } = pending;
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
    const word = String(spec.text || spec.id || 'insertie').toUpperCase();
    els.lexAmbiguityHeading.textContent = isEnglish() ? `How is “${word}” used here?` : `Hoe wordt “${word}” hier gebruikt?`;
    els.lexAmbiguityText.textContent = isEnglish()
      ? 'The alternatives change origin, LOG projection or scope. The suggested profile is drawn provisionally.'
      : 'De alternatieven veranderen oorsprong, LOG-projectie of scope. Het voorgestelde profiel wordt voorlopig getekend.';
    els.lexAmbiguityHelp.textContent = isEnglish()
      ? 'Your choice applies only to this sentence instance and does not rewrite the global lexicon.'
      : 'Je keuze geldt alleen voor deze zinsinstantie en herschrijft het globale lexicon niet.';
    els.lexAmbiguityOptions.replaceChildren();
    analysis.options.forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = option.recommended ? 'recommended' : '';
      const origin = normalizeInsertionOrigin(option.origin);
      button.textContent = `${option.label || option.id} · ${origin}`;
      button.title = `${option.function || ''}${option.scope ? ` · scope=${option.scope}` : ''}`;
      button.addEventListener('click', () => chooseLexAnalysis(spec, option.id));
      els.lexAmbiguityOptions.appendChild(button);
    });
  }

  function render() {
    try {
      applyProjectionColors();
      syncPortraitStageMode();
      syncMainTopbarLayout();
      syncControls();
      if (directPlacementActive()) drawDirectPlacement();
      else if (multiOgnAnaphorActive()) drawMultiOgnAnaphor();
      else if (state.projection === 'source') drawSource();
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
      syncPlacementModeUi();
      renderLexAmbiguityPrompt();
    } catch (err) {
      console.error('OpenGraph render failed', err);
      try {
        if (els.svg) {
          const g = baseSvg('render-fallback-view');
          drawAxisTitle(g, 120, 84, 'Render fallback · Syntax tree');
          drawSyntaxTree(g, { x: 760, y: 92 });
          els.svg.appendChild(g);
          applyViewBoxFit(true);
        }
      } catch (fallbackErr) {
        console.error('OpenGraph fallback render failed', fallbackErr);
      }
    }
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
    // Dutch has a complete dedicated UI/help layer. Other languages use English fallback.
    return state.language !== 'nl';
  }

  function renderStatus() {
    if (els.mainActiveUtteranceLabel) {
      els.mainActiveUtteranceLabel.textContent = isEnglish() ? 'Utterance' : 'Uiting';
    }
    if (els.mainActiveUtteranceText) {
      els.mainActiveUtteranceText.textContent = multiOgnAnaphorActive()
        ? activeMultiOgnDemo().title : activeSentenceText();
    }
    if (els.mainCausalAnaphorLabel) els.mainCausalAnaphorLabel.textContent = isEnglish() ? 'Anaphor' : 'Anafoor';
    if (els.mainCausalAnaphorChoice) {
      els.mainCausalAnaphorChoice.hidden = !multiOgnAnaphorActive()
        || activeUtteranceDefinition()?.type !== 'causal-role-flip';
    }
    const activeDefinition = activeUtteranceDefinition();
    if (els.mainCausalVerbChoice) els.mainCausalVerbChoice.hidden = !activeDefinition?.verbVariant;
    if (els.mainBotChoice) els.mainBotChoice.hidden = !activeDefinition?.botVariant;
    if (els.mainActiveUtterance) els.mainActiveUtterance.hidden = directPlacementActive();
    if (multiOgnAnaphorActive()) {
      const composition = multiOgnAnaphorComposition();
      const lower = composition.units[1];
      if (composition.definition) {
        const relationText = composition.relations.map(relation => `${relation.antecedentLabel} ↔ ${relation.anaphorLabel}`).join(' · ');
        els.titleLine.textContent = `${isEnglish() ? 'Utterance' : 'Uiting'} · ${composition.definition.title}`;
        els.metaLine.textContent = isEnglish()
          ? `K1 above K2 · ${composition.relations.length} vertical anaphor lines · surface LEX=${composition.surfaceText}`
          : `K1 boven K2 · ${composition.relations.length} verticale anafoorlijnen · LEX-uiting=${composition.surfaceText}`;
        if (els.sentencePreview) els.sentencePreview.textContent = composition.definition.title;
        if (els.actionFeedback) { els.actionFeedback.textContent = relationText; els.actionFeedback.className = 'action-feedback neutral'; }
        if (els.projectionHelp) els.projectionHelp.textContent = isEnglish()
          ? 'Each kernel clause is an independent OGN. Only declared anaphor columns are shared.'
          : 'Elke kernzin is een zelfstandige OGN. Alleen gedeclareerde anafoorkolommen worden gedeeld.';
        if (els.explainHeading) els.explainHeading.textContent = `${isEnglish() ? 'Explanation' : 'Uitleg'} · ${composition.definition.title}`;
        if (els.explainText) els.explainText.textContent = `${composition.demo.sentences.map(sentence => `${sentence.id}: ${sentence.text}`).join(' · ')} · ${relationText}`;
        return;
      }
      els.titleLine.textContent = isEnglish()
        ? 'Anaphor · multi-OGN · Ik zie een man. Hij draagt een hoed.'
        : 'Anafoor · multi-OGN · Ik zie een man. Hij draagt een hoed.';
      els.metaLine.textContent = isEnglish()
        ? `S1 and S2 calculated independently · rigid S2 shift Δx=${lower.shift.dx}, Δy=${lower.shift.dy} · one shared LEX axis`
        : `S1 en S2 afzonderlijk berekend · starre S2-verschuiving Δx=${lower.shift.dx}, Δy=${lower.shift.dy} · één gezamenlijke LEX-as`;
      if (els.sentencePreview) els.sentencePreview.textContent = MULTI_OGN_ANAPHOR_DEMO.title;
      if (els.actionFeedback) {
        els.actionFeedback.textContent = isEnglish()
          ? 'MAN is the antecedent and HIJ the anaphor. They are coreferential: one straight vertical line, without an arrow or direction.'
          : 'MAN is het antecedent en HIJ de anafoor. Ze zijn coreferentieel: één rechte verticale lijn, zonder pijl of richting.';
        els.actionFeedback.className = 'action-feedback neutral';
      }
      if (els.projectionHelp) els.projectionHelp.textContent = isEnglish()
        ? 'The no-shared-row/column invariant is validated per OGN. Across OGNs, only the declared MAN–HIJ column may coincide.'
        : 'De regel zonder gedeelde rij/kolom wordt per OGN gevalideerd. Tussen OGN’s mag alleen de gedeclareerde MAN–HIJ-kolom samenvallen.';
      if (els.explainHeading) els.explainHeading.textContent = isEnglish()
        ? 'Explanation · multi-OGN coreference'
        : 'Uitleg · multi-OGN-coreferentie';
      if (els.explainText) els.explainText.textContent = isEnglish()
        ? 'First calculate each tree as a complete OGN. Then place S1 above S2 and translate the complete S2 rigidly until HIJ shares MAN’s grid column.'
        : 'Bereken eerst elke boom als complete OGN. Plaats daarna S1 boven S2 en verschuif de complete S2 star totdat HIJ de gridkolom van MAN deelt.';
      return;
    }
    if (directPlacementActive()) {
      const direct = ensureDirectPlacementState();
      const mode = placementModeDefinition();
      const general = normalizeDirectPlacementGeneral(state.directPlacementGeneral);
      const field = placementEngine().bounds(directRenderedPoints(direct, mode.id));
      const axisPattern = mode.id === 'random' ? randomAxisPattern() : null;
      const iteration = mode.id === 'random' ? randomIterationProgress() : null;
      const repeatStatus = axisPattern
        ? (isEnglish()
          ? ` · ${axisPattern.completedIterationCount}/${axisPattern.configuredIterationCount} completed rounds · ${axisPattern.observationsPerAxis} projection hits/axis · ${axisPattern.axisImageMode}`
          : ` · ${axisPattern.completedIterationCount}/${axisPattern.configuredIterationCount} voltooide rondes · ${axisPattern.observationsPerAxis} projectie-hits/as · ${axisPattern.axisImageMode}`)
        : '';
      els.titleLine.textContent = mode.id === 'random'
        ? (isEnglish()
          ? `Random · ${directOptionLabel(RANDOM_DISTRIBUTION_OPTIONS, direct.distribution)} · iteration ${iteration.number}/${iteration.total} · seed ${direct.seed}`
          : `Random · ${directOptionLabel(RANDOM_DISTRIBUTION_OPTIONS, direct.distribution)} · iteratie ${iteration.number}/${iteration.total} · seed ${direct.seed}`)
        : (isEnglish() ? 'Greedy Grow · direct OGN placement' : 'Greedy Grow · directe OGN-plaatsing');
      els.metaLine.textContent = general.showMetrics
        ? (isEnglish()
          ? `${direct.points.length} nodes · field ${field.width} × ${field.height} · perimeter ${field.perimeter}${repeatStatus} · no future placement plan`
          : `${direct.points.length} knopen · veld ${field.width} × ${field.height} · omtrek ${field.perimeter}${repeatStatus} · geen toekomstig plaatsingsplan`)
        : (isEnglish()
          ? `${direct.points.length} nodes · no future placement plan`
          : `${direct.points.length} knopen · geen toekomstig plaatsingsplan`);
      els.sentencePreview.textContent = isEnglish()
        ? 'OGN illustration; Language Tree remains the primary calculated application.'
        : 'OGN-illustratie; Language Tree blijft de primaire berekende toepassing.';
      if (els.actionFeedback) {
        els.actionFeedback.textContent = mode.id === 'random'
          ? (isEnglish()
            ? 'Use ←, → or Play. After every completed round, projection hits are added to the WEST and SOUTH axis spots.'
            : 'Gebruik ←, → of Play. Na iedere voltooide ronde worden de projectie-hits aan de WEST- en SOUTH-asspots toegevoegd.')
          : (isEnglish()
            ? 'Use ←, → or Play. Every step writes the selected free position immediately.'
            : 'Gebruik ←, → of Play. Iedere stap schrijft de gekozen vrije plaats onmiddellijk.');
        els.actionFeedback.className = 'action-feedback neutral';
      }
      return;
    }
    const syntaxModeLabel = isEnglish() ? 'OPN syntax tree' : 'OPN-syntaxboom';
    const functionalModeLabel = isEnglish() ? 'Functional structure' : 'Functional functionele structuur';
    els.titleLine.textContent = `${activeSentenceText()} · ${state.projectionLabel || projectionLabel()} · ${state.centerMode === 'syntax' ? syntaxModeLabel : functionalModeLabel}`;
    const noticeText = state.example.notice ? ` · NOTICE=${state.example.notice}` : '';
    const logicalSequence = activeLogicalSlotSequence();
    const directLexCount = activeLexInsertionSpecs().filter(spec => normalizeInsertionOrigin(spec.origin) === 'LEX').length;
    const logStatus = `LOG=${logicalSequenceCode(logicalSequence)} · ${logicalDistanceSummary(logicalSequence)}${directLexCount ? ` · direct-LEX=${directLexCount}` : ''}`;
    const featureStatus = featureEnabled('adverbs') ? ` · ${activeAdverbStatusLabel()}` : '';
    els.metaLine.textContent = isEnglish()
      ? `${state.example.phase} · ${movementSummaryLabel()}${featureStatus} · ${logStatus} → planned possible LEX positions · sentence validation=${activeSentenceText()}${noticeText}`
      : `${state.example.phase} · ${movementSummaryLabel()}${featureStatus} · ${logStatus} → geplande mogelijke LEX-plaatsen · zinsvalidatie=${activeSentenceText()}${noticeText}`;
    if (els.sentencePreview) els.sentencePreview.innerHTML = activeSentenceHtml();
    const baseFeedback = isEnglish()
      ? (state.projection === 'source'
        ? 'Source shows the selected OPN source from structure-config.html. At Source, LEX, SYNT and LOG axes can be combined independently. The View menu switches between the Syntax view and the Functional view (functional CLAUSE roles). Syntax and Functional views use bottom-up recursive box layout; left/right controls both layouts; branch order can be global, compact-auto or align-auto.'
        : (featureEnabled('adverbs')
          ? 'Derivation: structure config → lexical usage profile → LOG minors and/or direct LEX insertions → explicit upward topic/V1/V2 switches only. A source node without such a rule remains at source height.'
          : 'Derivation: structure config → LOG majors → explicit upward topic/V1/V2 switches only. A source node without such a rule remains at source height.'))
      : (state.projection === 'source'
        ? 'Bron toont de gekozen OPN-bron uit structure-config.html; LEX-, SYNT- en LOG-as zijn daar onafhankelijk combineerbaar. Het View-menu wisselt tussen de Syntax-view en de Functional-view (functionele CLAUSE/rollen). Syntax en Functional gebruiken bottom-up recursieve box-layout; left/right stuurt beide layouts; takvolgorde kan globaal, compact-auto of align-auto zijn.'
        : (featureEnabled('adverbs')
          ? 'Afleiding: structure-config → lexicaal gebruiksprofiel → LOG-minors en/of directe LEX-inserties → uitsluitend expliciete topic-/V1-/V2-Wissels omhoog. Een bronknoop zonder zo’n regel blijft op bronhoogte.'
          : 'Afleiding: structure-config → LOG-majors → uitsluitend expliciete topic-/V1-/V2-Wissels omhoog. Een bronknoop zonder zo’n regel blijft op bronhoogte.'));
    const validationMsg = state.exampleValidationMessages?.length ? ` · ${state.exampleValidationMessages[0]}` : '';
    const noticeMsg = state.example.notice ? ` · ${state.example.notice}` : '';
    const osvMsg = SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(state.southLogicalMode || 'SOV')
      ? ` · ${movementRequiredModeComment(state.southLogicalMode || 'SOV')}`
      : '';
    els.actionFeedback.textContent = state.growthEnabled ? `${baseFeedback} · ${growthLabel()}${noticeMsg}${validationMsg}${osvMsg}` : `${baseFeedback}${noticeMsg}${validationMsg}${osvMsg}`;
    els.projectionHelp.textContent = helpText();
    els.explainHeading.textContent = `${isEnglish() ? 'Explanation' : 'Uitleg'} · ${activeSentenceText()}`;
    els.explainText.textContent = featureEnabled('adverbs')
      ? (isEnglish()
        ? `LOG supplies semantic placement for LOG profiles. Current LOG sequence: ${logicalSequenceCode(logicalSequence)} (${logicalDistanceSummary(logicalSequence)}). Every LOG minor increases the reserved distance between its bounding majors by one slot. Reservation alone never moves a source node; only an explicit upward topic/V1/V2 rule draws one move and one source trace.`
        : `LOG levert de semantische plaatsing voor LOG-profielen. Huidige LOG-sequentie: ${logicalSequenceCode(logicalSequence)} (${logicalDistanceSummary(logicalSequence)}). Iedere LOG-minor vergroot de gereserveerde afstand tussen zijn begrenzende majors met één slot. Reservering alleen verplaatst nooit een bronknoop; uitsluitend een expliciete topic-/V1-/V2-regel tekent één Wissel omhoog en één brontrace.`)
      : (isEnglish()
        ? `Current LOG sequence: ${logicalSequenceCode(logicalSequence)} (${logicalDistanceSummary(logicalSequence)}). The S/O/V majors reserve LEX rows. Reservation alone never moves a source node; only an explicit upward topic/V1/V2 rule does.`
        : `Huidige LOG-sequentie: ${logicalSequenceCode(logicalSequence)} (${logicalDistanceSummary(logicalSequence)}). De majors S/O/V reserveren LEX-rijen. Reservering alleen verplaatst nooit een bronknoop; uitsluitend een expliciete topic-/V1-/V2-regel omhoog doet dat.`);
  }

  function projectionLabel() {
    const labels = isEnglish()
      ? { axes: 'All', source: 'Source', lex: 'LEX', synt: 'SYNT', log: 'LOG' }
      : { axes: 'Alle', source: 'Bron', lex: 'LEX', synt: 'SYNT', log: 'LOG' };
    if (state.projection === 'source' && normalizedSourceAxes().length) {
      return `${labels.source} + ${sourceAxesShortLabel()}`;
    }
    return labels[state.projection] || state.projection;
  }

  function helpText() {
    if (isEnglish()) {
      if (state.projection === 'source') return `Source: the Syntax and Functional structures are read from structure-config.html. Selected axes at Source: ${sourceAxesShortLabel()}. LEX, SYNT and LOG can be combined without moving or rescaling the central view.`;
      if (state.projection === 'lex') return featureEnabled('adverbs')
        ? 'LEX: west named projection. Every source projects horizontally at source height. The active profile permits only explicit upward topic/V1/V2 switches, direct insertions, and Comp.'
        : 'LEX: west named projection. Every lexical source projects horizontally at source height. The active profile permits only explicit upward topic/V1/V2 switches and Comp.';
      if (state.projection === 'synt') return 'SYNT: isolated syntax-rule set. Rules are placed at their source height; the central tree is only used as a hidden height anchor.';
      if (state.projection === 'log') return featureEnabled('adverbs')
        ? 'LOG: south named projection. S, O and V are majors. Only insertions with a LOG or LOG+LEX profile appear as minors; direct LEX profiles remain absent from this axis.'
        : 'LOG: south named projection. S, O and V are majors on fixed slots and plan LEX positions without moving source nodes.';
      return 'All: central view selected by the View menu. LEX, SYNT and LOG use named projections with their own projection markers and selection rules.';
    }
    if (state.projection === 'source') return `Bron: de Syntax- en Functional-structuren worden gelezen uit structure-config.html. Gekozen assen bij Bron: ${sourceAxesShortLabel()}. LEX, SYNT en LOG kunnen gecombineerd worden zonder de centrale view te verplaatsen of te herschalen.`;
    if (state.projection === 'lex') return featureEnabled('adverbs')
      ? 'LEX: westelijke named projection. Iedere bron projecteert horizontaal op bronhoogte. Het actieve profiel staat alleen expliciete topic-/V1-/V2-Wissels omhoog, directe inserties en Comp toe.'
      : 'LEX: westelijke named projection. Iedere lexicale bron projecteert horizontaal op bronhoogte. Het actieve profiel staat alleen expliciete topic-/V1-/V2-Wissels omhoog en Comp toe.';
    if (state.projection === 'synt') return 'SYNT: geïsoleerde syntax-regelset. Regels staan op bronhoogte; de centrale boom dient alleen als verborgen hoogteanker.';
    if (state.projection === 'log') return featureEnabled('adverbs')
      ? 'LOG: named projection op de zuidas. S, O en V zijn majors. Alleen inserties met een LOG- of LOG+LEX-profiel verschijnen als minor; directe LEX-profielen ontbreken op deze as.'
      : 'LOG: named projection op de zuidas. S, O en V zijn majors op vaste slots en plannen LEX-plaatsen zonder bronknopen te verplaatsen.';
    return 'Alle: centrale view via View-menu. LEX, SYNT en LOG gebruiken named projections met eigen projectiemerkers en selectieregels.';
  }

  function renderSideLists() {
    els.lexOrderList.replaceChildren();
    if (multiOgnAnaphorActive()) {
      const composition = multiOgnAnaphorComposition();
      composition.lexItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'lex-order-item';
        row.textContent = `${index + 1}. ${item.label} · ${item.unitId}`;
        els.lexOrderList.appendChild(row);
      });
      if (els.edgeList) {
        els.edgeList.replaceChildren();
        [
          ...(composition.definition
            ? [isEnglish() ? 'Kernel clause relations' : 'Relaties tussen kernzinnen', ...composition.relations.map(relation => `${relation.antecedentLabel} ↔ ${relation.anaphorLabel} · ${relation.referent}`)]
            : [isEnglish() ? 'Cross-OGN relation' : 'Relatie tussen OGN’s', isEnglish() ? 'MAN · antecedent' : 'MAN · antecedent', isEnglish() ? 'HIJ · anaphor' : 'HIJ · anafoor', isEnglish() ? 'coreferential · undirected line' : 'coreferentieel · ongerichte lijn'])
        ].forEach((text, index) => {
          const row = document.createElement('div');
          row.className = index === 0 ? 'edge-item relation-heading' : 'edge-item';
          row.textContent = text;
          els.edgeList.appendChild(row);
        });
      }
      return;
    }
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
    centralModeSelect: { syntax: 'Syntax tree', ft: 'Functional · functional structure (CLAUSE)' },
    mainViewSelect: { syntax: 'Syntax', ft: 'Functional' },
    mainProjectionSelect: { axes: 'All', source: 'Source', lex: 'LEX', synt: 'SYNT', log: 'LOG' },
    mobileViewSelect: { syntax: 'Syntax tree', ft: 'Functional · functional structure' },
    treeChoiceSelect: { 'auto-min': 'tree choice: auto per sample type', 'structure-config': 'tree choice: structure-config base tree' },
    functionalOrderSelect: { 'left-first': 'layout: left-first', 'right-first': 'layout: right-first' },
    branchOrderSelect: { normal: 'default: grammatical order', 'auto-compact': 'goal: compact - auto per branch', 'auto-align': 'goal: align subject/agent + object/patient', 'flip-all': 'global: flip all branches' },
    branchTopSelect: { auto: 'auto', normal: 'normal', flip: 'flip' },
    branchMiddleSelect: { auto: 'auto', normal: 'normal', flip: 'flip' },
    branchOtherSelect: { auto: 'auto', normal: 'normal', flip: 'flip' },
    layoutDensitySelect: { max: 'MAX - large text / low tree - default', auto: 'tree spacing: auto-fit wide/lower', compact: 'tree spacing: compact/classic', flat: 'tree spacing: flatter / less high', wide: 'tree spacing: wide/lower', large: 'tree spacing: wide + larger font' },
    mainLayoutDensitySelectTop: { max: 'MAX - large text / low tree - default', auto: 'tree spacing: auto-fit wide/lower', compact: 'tree spacing: compact/classic', flat: 'tree spacing: flatter / less high', wide: 'tree spacing: wide/lower', large: 'tree spacing: wide + larger font' },
    viewFitSelect: { max: 'MAX - use full window - default', window: 'full tree visible - roomy border', auto: 'full tree tight', scroll: 'scroll allowed - large canvas', fixed: 'fixed 1500x900 - debug' },
    mainViewFitSelectTop: { max: 'MAX - use full window', window: 'full tree visible', auto: 'tight full tree', scroll: 'scroll allowed', fixed: 'fixed/debug' },
    rightMenuWidthSelect: { auto: 'right column: auto/rest', wide: 'right column: wide', 'very-wide': 'right column: very wide', max: 'right column: maximum' },
    rightMenuWidthSelectTop: { auto: 'right column: auto/rest', wide: 'right column: wide', 'very-wide': 'right column: very wide', max: 'right column: maximum' },
    mobileRightMenuWidthSelect: { auto: 'right column: auto/rest', wide: 'right column: wide', 'very-wide': 'right column: very wide', max: 'right column: maximum' },
    lexProjectionColorSelect: { blue: 'blue', green: 'green', purple: 'purple', orange: 'orange', teal: 'teal', red: 'red', slate: 'slate' },
    syntProjectionColorSelect: { blue: 'blue', green: 'green', purple: 'purple', orange: 'orange', teal: 'teal', red: 'red', slate: 'slate' },
    logProjectionColorSelect: { blue: 'blue', green: 'green', purple: 'purple', orange: 'orange', teal: 'teal', red: 'red', slate: 'slate' },
    gridColorSelect: { 'soft-slate': 'soft slate', slate: 'slate', 'blue-grey': 'blue grey', neutral: 'neutral grey' },
    gridLineWeightSelect: { light: 'light', normal: 'normal', strong: 'strong' },
    gridSizeHorizontalSelect: { '60': '60% · fine', '80': '80% · compact', '100': '100% · default', '125': '125% · spacious', '150': '150% · large', '200': '200% · extra large' },
    gridSizeVerticalSelect: { '60': '60% · fine', '80': '80% · compact', '100': '100% · default', '125': '125% · spacious', '150': '150% · large', '200': '200% · extra large' },
    treeLineWeightSelect: { light: 'light', normal: 'normal', strong: 'strong' },
    multiTreeLineWeightSelect: { light: 'light', normal: 'normal', strong: 'strong' },
    multiTreeBranchHorizontalSelect: { compact: 'compact · default', normal: 'normal', wide: 'spacious' },
    multiTreeBranchVerticalSelect: { compact: 'compact · default', normal: 'normal', wide: 'spacious' },
    multiTreeBranchFlipSelect: { auto: 'auto · structure', flip: 'flip · mirror left/right' },
    mainCausalAnaphorSelect: { hij: 'hij', die: 'die', 'die-hond': 'die hond', 'de-hond': 'de hond', jek: 'Jek' },
    multiCausalAnaphorSelect: { hij: 'hij', die: 'die', 'die-hond': 'die hond', 'de-hond': 'de hond', jek: 'Jek' },
    projectionLineWeightSelect: { light: 'light', normal: 'normal', strong: 'strong' },
    boxLineWeightSelect: { light: 'light', normal: 'normal', strong: 'strong' },
    freeSlotCountSelect: { 0: 'tree rows: 0', 1: 'tree rows: 1', 2: 'tree rows: 2', 3: 'tree rows: 3', 4: 'tree rows: 4', 5: 'tree rows: 5', 6: 'tree rows: 6' },
    lexFreeSlotCountSelect: { 0: 'LOG minors: 0', 1: 'LOG minors: 1', 2: 'LOG minors: 2', 3: 'LOG minors: 3', 4: 'LOG minors: 4', 5: 'LOG minors: 5', 6: 'LOG minors: 6', 7: 'LOG minors: 7', 8: 'LOG minors: 8' },
    mobileLexFreeSlotCountSelect: { 0: 'LOG minors: 0', 1: 'LOG minors: 1', 2: 'LOG minors: 2', 3: 'LOG minors: 3', 4: 'LOG minors: 4', 5: 'LOG minors: 5', 6: 'LOG minors: 6', 7: 'LOG minors: 7', 8: 'LOG minors: 8' },
    lexFreeSlotPlacementSelect: { 'above-selected-box': 'scope host: selected box', 'above-s': 'scope host: S', 'above-np': 'scope host: NP', 'above-vp': 'scope host: VP', 'above-v': 'scope host: V', 'above-vcluster': 'scope host: V cluster', 'above-pp': 'scope host: PP', 'above-ap': 'scope host: AP' },
    mobileLexFreeSlotPlacementSelect: { 'above-selected-box': 'scope host: selected box', 'above-s': 'scope host: S', 'above-np': 'scope host: NP', 'above-vp': 'scope host: VP', 'above-v': 'scope host: V', 'above-vcluster': 'scope host: V cluster', 'above-pp': 'scope host: PP', 'above-ap': 'scope host: AP' },
    lexInsertionContentSelect: { empty: 'empty slot', gisteren: 'GISTEREN', morgen: 'MORGEN', daar: 'DAAR', daarom: 'DAAROM', anders: 'ANDERS', vaak: 'VAAK', soms: 'SOMS', altijd: 'ALTIJD', niet: 'NIET', snel: 'SNEL', hard: 'HARD', zachtjes: 'ZACHTJES', misschien: 'MISSCHIEN', waarschijnlijk: 'WAARSCHIJNLIJK', helaas: 'HELAAS', alleen: 'ALLEEN', ook: 'OOK', zelfs: 'ZELFS', heel: 'HEEL', erg: 'ERG', zeer: 'ZEER', anafoor: 'anaphor', 'other-lex-axis': 'other LEX axis' },
    mobileLexInsertionContentSelect: { empty: 'empty slot', gisteren: 'GISTEREN', morgen: 'MORGEN', daar: 'DAAR', daarom: 'DAAROM', anders: 'ANDERS', vaak: 'VAAK', soms: 'SOMS', altijd: 'ALTIJD', niet: 'NIET', snel: 'SNEL', hard: 'HARD', zachtjes: 'ZACHTJES', misschien: 'MISSCHIEN', waarschijnlijk: 'WAARSCHIJNLIJK', helaas: 'HELAAS', alleen: 'ALLEEN', ook: 'OOK', zelfs: 'ZELFS', heel: 'HEEL', erg: 'ERG', zeer: 'ZEER', anafoor: 'anaphor', 'other-lex-axis': 'other LEX axis' },
    portraitMenuSlotsSelect: { 0: 'bottom space: 0 menus', 1: 'bottom space: 1 menu', 2: 'bottom space: 2 menus' },
    mobilePortraitMenuSlotsSelect: { 0: 'bottom space: 0 menus', 1: 'bottom space: 1 menu', 2: 'bottom space: 2 menus' },
    sentenceTypeSelect: { 'main-declarative': 'Main clause · declarative', 'polar-question': 'Question · yes/no', 'subordinate-dat': 'Dat-clause · Comp DAT', 'subordinate-omdat': 'Omdat-clause · Comp OMDAT' }
  };

  const TOP_MENU_LABELS_EN = {
    projection: ['Projection choice', 'Projection choice: All, Source, LEX, SYNT and LOG. Useful for comparing projections.'],
    sentence: ['Sample sentence', 'Sample sentence: quickly choose HOND BIJT MAN and variants. Useful for contrasts between sentences.'],
    play: ['Play/Grow', 'Play/Grow: show tree, LEX axis and projections step by step. Useful for explanation.'],
    tools: ['Work buttons', 'Work buttons: FIT, reset, OPN, Legacy JSON, Docs and editors. Useful for building and testing.']
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
    if (!select) return isEnglish() ? (opt.labelEn || opt.titleEn || opt.label || opt.title || opt.id) : (opt.label || opt.title || opt.id);
    if (!isEnglish()) return opt.label || opt.title || opt.id;
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

  function fillCompactChoiceMenu(container, options, selected, hiddenSelect, onChoose) {
    if (!container) return;
    container.replaceChildren();
    for (const opt of options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'compact-choice-option';
      const label = localizedOptionLabel(hiddenSelect, opt);
      button.textContent = label;
      const active = opt.id === selected;
      button.classList.toggle('active', active);
      button.setAttribute('role', 'option');
      button.dataset.optionId = opt.id;
      button.setAttribute('aria-selected', String(active));
      button.title = label;
      button.addEventListener('click', () => onChoose(opt.id));
      container.appendChild(button);
    }
  }

  function closeMainChoiceMenus(except = null) {
    [els.mainSentenceMenu, els.mainAdverbMenu, els.mainViewMenu, els.mainInterfaceMenu, els.sourceAxisMenu, els.mainExtraMenu, els.mainLanguageMenu, els.mainActionsMenu].forEach(menu => {
      if (menu && menu !== except) menu.open = false;
    });
  }

  function syncPlacementModeUi() {
    const mode = placementModeDefinition();
    const direct = mode.kind === 'direct';
    const languageTree = mode.id === 'language-tree';
    const multiOgn = mode.id === 'multi-ogn-anaphor';
    document.body?.classList.toggle('placement-direct-active', direct);
    document.body?.classList.toggle('placement-language-tree-active', languageTree);
    document.body?.classList.toggle('placement-multi-ogn-active', multiOgn);
    document.querySelectorAll('[data-placement-mode]').forEach(button => {
      const active = button.dataset.placementMode === mode.id;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (els.languageTreeViewPicker) els.languageTreeViewPicker.hidden = !languageTree;
    if (els.mainViewSummary) {
      els.mainViewSummary.textContent = isEnglish() ? (mode.labelEn || mode.label) : mode.label;
      els.mainViewSummary.title = isEnglish()
        ? 'Language Tree and Anaphor · multi-OGN are calculated; Greedy Grow and Random place nodes directly.'
        : 'Language Tree en Anafoor · multi-OGN zijn berekend; Greedy Grow en Random plaatsen knopen direct.';
    }
    if (els.mainSentenceMenu) els.mainSentenceMenu.hidden = !(languageTree || multiOgn);
    if (els.mainAdverbMenu) els.mainAdverbMenu.hidden = !languageTree || !featureEnabled('adverbs');
    if (els.sourceAxisMenu) els.sourceAxisMenu.hidden = !languageTree;
    if (els.mainExtraMenu) els.mainExtraMenu.hidden = !languageTree;
    const subtitle = document.querySelector('.header-subtitle');
    if (subtitle) {
      if (multiOgn && activeUtteranceDefinition()) {
        subtitle.textContent = isEnglish()
          ? 'Utterance: two kernel clauses, vertical anaphor connections, and one realized LEX axis.'
          : 'Uiting: twee kernzinnen, verticale anafoorverbindingen en één gerealiseerde LEX-as.';
      } else if (multiOgn) {
        subtitle.textContent = isEnglish()
          ? 'Calculated multi-OGN: S1 above S2, one shared LEX axis and a vertical undirected MAN–HIJ coreference line.'
          : 'Berekende multi-OGN: S1 boven S2, één gezamenlijke LEX-as en een verticale ongerichte MAN–HIJ-coreferentielijn.';
      } else if (direct) {
        const label = isEnglish() ? (mode.labelEn || mode.label) : mode.label;
        subtitle.textContent = isEnglish()
          ? `${label}: direct OGN illustration. Language Tree remains the primary calculated application.`
          : `${label}: directe OGN-illustratie. Language Tree blijft de primaire berekende toepassing.`;
      } else {
        subtitle.textContent = isEnglish()
          ? 'Top menu with Sentence, Syntax / Functional, Interface, Projections, LOG order, Language, README and Config.'
          : 'Topmenu met Zin, Syntax / Functional, Interface, Projecties, LOG-volgorde, Taal, LEESMIJ en Config.';
      }
    }
    if (document.body?.classList.contains('config-screen-active')) {
      syncConfigMethodScope();
      activateConfigTab(configMethodScope ? 'direct' : activeConfigTab);
    }
  }

  function renderMainChoiceMenus() {
    if (els.mainSentenceSummary) {
      const utteranceMenu = multiOgnAnaphorActive();
      els.mainSentenceSummary.textContent = utteranceMenu ? (isEnglish() ? 'Utterance' : 'Uiting') : (isEnglish() ? 'Sentence' : 'Zin');
      els.mainSentenceSummary.title = utteranceMenu
        ? (isEnglish() ? 'Choose a linked kernel-clause utterance' : 'Kies een uiting met verknoopte kernzinnen')
        : (isEnglish() ? 'Choose the sample sentence' : 'Kies de voorbeeldzin');
    }
    if (featureEnabled('adverbs') && els.mainAdverbSummary) {
      els.mainAdverbSummary.textContent = isEnglish() ? 'Adverb' : 'Bijwoord';
      els.mainAdverbSummary.title = isEnglish() ? 'Choose an adverb' : 'Kies een bijwoord';
    }
    syncPlacementModeUi();
    if (els.mainInterfaceSummary) {
      els.mainInterfaceSummary.textContent = isEnglish() ? 'Interface' : 'Interface';
      els.mainInterfaceSummary.title = isEnglish() ? 'Choose automatic, desktop, mobile portrait or mobile landscape' : 'Kies automatisch, desktop, mobiel staand of mobiel liggend';
    }
    if (els.mainInterfaceHelp) els.mainInterfaceHelp.textContent = isEnglish()
      ? 'Automatic follows the actual screen. Mobile portrait and mobile landscape are also available as test views on desktop.'
      : 'Automatisch volgt het echte scherm. Mobiel staand en mobiel liggend zijn ook op desktop als testweergave beschikbaar.';
    if (els.sourceAxisSummaryLabel) {
      els.sourceAxisSummaryLabel.textContent = isEnglish() ? 'Projections' : 'Projecties';
    }
    if (els.mainActionsSummary) {
      els.mainActionsSummary.textContent = 'Menu';
      els.mainActionsSummary.title = isEnglish() ? 'Open the complete main menu' : 'Open het volledige hoofdmenu';
    }
    if (els.mainExtraSummary) {
      els.mainExtraSummary.textContent = isEnglish() ? 'LOG order' : 'LOG-volgorde';
      els.mainExtraSummary.title = isEnglish() ? 'Choose the LOG order' : 'Kies de LOG-volgorde';
    }
    if (els.mainSouthHeading) els.mainSouthHeading.textContent = isEnglish() ? 'LOG order' : 'LOG-volgorde';
    if (els.mainSouthExplanation) {
      els.mainSouthExplanation.textContent = isEnglish()
        ? 'Changes the LOG order and reserved LEX rows. It never moves a source node by itself; only an explicit Language Tree rule may do that.'
        : 'Wijzigt de LOG-volgorde en de gereserveerde LEX-rijen. Dit verplaatst nooit vanzelf een bronknoop; alleen een expliciete Language-Tree-regel mag dat doen.';
    }
    const multiOptions = [
      { id: MULTI_OGN_ANAPHOR_DEMO.id, title: MULTI_OGN_ANAPHOR_DEMO.title, label: MULTI_OGN_ANAPHOR_DEMO.title },
      ...(globalThis.OGNUtteranceKernels?.DEFINITIONS || []).map(definition => ({ id: definition.id, title: definition.title, label: definition.title }))
    ];
    const multiActive = multiOgnAnaphorActive();
    fillCompactChoiceMenu(els.mainSentenceOptions, multiActive ? multiOptions : EXAMPLES, multiActive ? state.multiOgnExampleId : state.example.id, multiActive ? null : els.mainExampleSelect, id => {
      if (multiActive) {
        stopMultiOgnPlayback();
        state.multiOgnPlayEnabled = false;
        state.multiOgnPlayStep = 999;
        state.multiOgnExampleId = id;
        const matchingExample = EXAMPLES.find(example => example.id === id);
        if (matchingExample) state.example = matchingExample;
        state.documentMetadata = null;
        resetManualViewBox();
        recordParadata('select-multi-ogn-utterance', { example: id });
      } else {
        state.example = EXAMPLES.find(example => example.id === id) || EXAMPLES[0];
        resetForNewExample();
        if (globalThis.OGNUtteranceKernels?.definitionFor?.(id)) {
          state.multiOgnExampleId = id;
          setPlacementMode('multi-ogn-anaphor');
          return;
        }
      }
      closeMainChoiceMenus();
      render();
    });
    if (featureEnabled('adverbs')) {
      fillCompactChoiceMenu(els.mainAdverbOptions, ADVERB_OPTIONS, state.selectedAdverbId, els.mainAdverbSelect, id => {
        state.selectedAdverbId = id || 'none';
        state.useExampleLexInsertions = state.selectedAdverbId === 'none';
        applyExampleAdverbDefaults();
        resetManualViewBox();
        closeMainChoiceMenus();
        render();
      });
    } else if (els.mainAdverbOptions) {
      els.mainAdverbOptions.replaceChildren();
    }
    fillCompactChoiceMenu(els.mainViewOptions, CENTER_MODES, state.centerMode, els.mainViewSelect, id => {
      state.centerMode = (id === 'ft' || id === 'functional') ? 'ft' : 'syntax';
      closeMainChoiceMenus();
      render();
    });
    fillCompactChoiceMenu(els.mainInterfaceOptions, VIEWPORT_TEST_MODES, validViewportMode(state.viewportMode), null, id => {
      state.viewportMode = validViewportMode(id);
      applyHelpLayoutMode();
      syncViewportTestClasses();
      resetManualViewBox();
      closeMainChoiceMenus();
      render();
    });
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
    const text = featureEnabled('adverbs')
      ? (selected.size
        ? (isEnglish()
          ? `Legacy branch extension: ${[...selected].map(lexInsertionTargetLabel).join(' + ')}. Under LOG authority this is metadata only; adverb distance comes from LOG minors.`
          : `Oude takverlenging: ${[...selected].map(lexInsertionTargetLabel).join(' + ')}. Onder LOG-autoriteit is dit alleen metadata; bijwoordafstand komt uit LOG-minors.`)
        : (isEnglish()
          ? 'No branch extension. LOG minors determine planned adverb distance; they do not move source nodes.'
          : 'Geen takverlenging. LOG-minors bepalen de geplande bijwoordafstand; zij verplaatsen geen bronknopen.'))
      : (selected.size
        ? (isEnglish() ? `Branch extension: ${[...selected].map(lexInsertionTargetLabel).join(' + ')}.` : `Takverlenging: ${[...selected].map(lexInsertionTargetLabel).join(' + ')}.`)
        : (isEnglish() ? 'No branch extension.' : 'Geen takverlenging.'));
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
    if (featureEnabled('adverbs')) {
      fillSelect(els.mainAdverbSelect, ADVERB_OPTIONS, state.selectedAdverbId);
      fillSelect(els.mobileAdverbSelect, ADVERB_OPTIONS, state.selectedAdverbId);
    } else {
      els.mainAdverbSelect?.replaceChildren();
      els.mobileAdverbSelect?.replaceChildren();
    }
    syncExampleSelectSizing();
    fillSelect(els.centralModeSelect, CENTER_MODES, state.centerMode);
    fillSelect(els.mainViewSelect, CENTER_MODES, state.centerMode);
    fillSelect(els.mobileViewSelect, CENTER_MODES, state.centerMode);
    fillSelect(els.mainProjectionSelect, PROJECTION_OPTIONS, state.projection);
    renderMainChoiceMenus();
    document.querySelectorAll('[data-source-axis]').forEach(button => {
      const active = activeProjectionAxisSet().has(button.dataset.sourceAxis);
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    fillSelect(els.treeChoiceSelect, TREE_CHOICES, activeTreeChoice());
    fillSelect(els.functionalOrderSelect, FUNCTIONAL_ORDERS, state.functionalOrder);
    fillSelect(els.branchOrderSelect, BRANCH_ORDERS, state.branchOrder);
    fillSelect(els.branchTopSelect, BRANCH_CHOICES, state.branchOverrides.top);
    fillSelect(els.branchMiddleSelect, BRANCH_CHOICES, state.branchOverrides.middle);
    fillSelect(els.branchOtherSelect, BRANCH_CHOICES, state.branchOverrides.other);
    state.layoutDensity = validLayoutDensity();
    state.viewFitMode = validViewFitMode();
    state.viewportMode = validViewportMode(state.viewportMode);
    syncViewportTestClasses();
    fillSelect(els.layoutDensitySelect, LAYOUT_DENSITIES, state.layoutDensity);
    fillSelect(els.mainLayoutDensitySelectTop, LAYOUT_DENSITIES, state.layoutDensity);
    fillSelect(els.viewFitSelect, VIEW_FIT_MODES, state.viewFitMode);
    fillSelect(els.mainViewFitSelectTop, VIEW_FIT_MODES, state.viewFitMode);
    fillSelect(els.rightMenuWidthSelect, RIGHT_MENU_WIDTHS, validRightMenuMode());
    fillSelect(els.rightMenuWidthSelectTop, RIGHT_MENU_WIDTHS, validRightMenuMode());
    fillSelect(els.mobileRightMenuWidthSelect, RIGHT_MENU_WIDTHS, validRightMenuMode());
    fillSelect(els.lexProjectionColorSelect, PROJECTION_COLOR_OPTIONS, state.lexProjectionColor);
    fillSelect(els.syntProjectionColorSelect, PROJECTION_COLOR_OPTIONS, state.syntProjectionColor);
    fillSelect(els.logProjectionColorSelect, PROJECTION_COLOR_OPTIONS, state.logProjectionColor);
    fillSelect(els.gridColorSelect, GRID_COLOR_OPTIONS, state.gridColor);
    fillSelect(els.gridLineWeightSelect, LINE_WEIGHT_OPTIONS, validLineWeight(state.gridLineWeight));
    fillSelect(els.gridSizeHorizontalSelect, GRID_SIZE_OPTIONS, validGridSize(state.gridSizeHorizontal));
    fillSelect(els.gridSizeVerticalSelect, GRID_SIZE_OPTIONS, validGridSize(state.gridSizeVertical));
    fillSelect(document.getElementById('multiGridSizeHorizontalSelect'), GRID_SIZE_OPTIONS, validGridSize(state.gridSizeHorizontal));
    fillSelect(document.getElementById('multiGridSizeVerticalSelect'), GRID_SIZE_OPTIONS, validGridSize(state.gridSizeVertical));
    fillSelect(els.treeLineColorSelect, PROJECTION_COLOR_OPTIONS, state.treeLineColor);
    fillSelect(els.treeLineWeightSelect, LINE_WEIGHT_OPTIONS, validLineWeight(state.treeLineWeight, 'strong'));
    fillSelect(document.getElementById('multiTreeLineColorSelect'), PROJECTION_COLOR_OPTIONS, state.treeLineColor);
    fillSelect(document.getElementById('multiTreeLineWeightSelect'), LINE_WEIGHT_OPTIONS, validLineWeight(state.treeLineWeight, 'strong'));
    fillSelect(document.getElementById('multiTreeLayoutDensitySelect'), LAYOUT_DENSITIES, state.layoutDensity);
    fillSelect(document.getElementById('multiTreeBranchHorizontalSelect'), KERNEL_BRANCH_SPACINGS, validKernelBranchSpacing(state.kernelBranchHorizontal));
    fillSelect(document.getElementById('multiTreeBranchVerticalSelect'), KERNEL_BRANCH_SPACINGS, validKernelBranchSpacing(state.kernelBranchVertical));
    fillSelect(document.getElementById('multiTreeBranchFlipSelect'), KERNEL_BRANCH_FLIP_MODES, validKernelBranchFlip(state.kernelBranchFlip));
    fillSelect(document.getElementById('multiOgnFlipHoldSelect'), MULTI_OGN_FLIP_HOLD_MODES, validMultiOgnFlipHold(state.multiOgnFlipHold));
    const causalVariants = (globalThis.OGNUtteranceKernels?.CAUSAL_ANAPHOR_VARIANTS || [])
      .map(variant => ({ id: variant.id, label: variant.text, labelEn: variant.text }));
    fillSelect(els.mainCausalAnaphorSelect, causalVariants, state.causalAnaphorVariant);
    fillSelect(document.getElementById('multiCausalAnaphorSelect'), causalVariants, state.causalAnaphorVariant);
    const activeDefinition = activeUtteranceDefinition();
    const verbSource = activeDefinition?.id === 'jan-beloonde-jek-omdat-die-het-bot-terugbracht'
      ? globalThis.OGNUtteranceKernels?.REWARD_VERB_VARIANTS
      : globalThis.OGNUtteranceKernels?.CAUSAL_VERB_VARIANTS;
    const verbVariants = (verbSource || []).map(item => ({ id: item.id, label: item.text, labelEn: item.text }));
    fillSelect(els.mainCausalVerbSelect, verbVariants, activeDefinition?.verbVariant || state.causalVerbVariant);
    const botVariants = (globalThis.OGNUtteranceKernels?.BOT_VARIANTS || []).map(item => ({ id: item.id, label: item.text, labelEn: item.text }));
    fillSelect(els.mainBotSelect, botVariants, state.botVariant);
    fillSelect(els.projectionLineWeightSelect, LINE_WEIGHT_OPTIONS, validLineWeight(state.projectionLineWeight));
    fillSelect(els.boxLineWeightSelect, LINE_WEIGHT_OPTIONS, validLineWeight(state.boxLineWeight));
    syncDirectConfigControls();
    fillSelect(els.freeSlotCountSelect, FREE_SLOT_COUNTS, String(reservedFreeSlotCount()));
    if (featureEnabled('adverbs')) {
      fillSelect(els.lexFreeSlotCountSelect, LEX_FREE_SLOT_COUNTS, String(lexFreeSlotCount()));
      fillSelect(els.mobileLexFreeSlotCountSelect, LEX_FREE_SLOT_COUNTS, String(lexFreeSlotCount()));
      fillSelect(els.lexFreeSlotPlacementSelect, LEX_SLOT_PLACEMENTS, validLexSlotPlacement());
      fillSelect(els.mobileLexFreeSlotPlacementSelect, LEX_SLOT_PLACEMENTS, validLexSlotPlacement());
      fillSelect(els.lexInsertionContentSelect, LEX_INSERTION_CONTENTS, validLexInsertionContent());
      fillSelect(els.mobileLexInsertionContentSelect, LEX_INSERTION_CONTENTS, validLexInsertionContent());
      fillSelect(els.logInsertionIntervalSelect, logInsertionIntervalOptions(), validLogInsertionInterval());
      fillSelect(els.mobileLogInsertionIntervalSelect, logInsertionIntervalOptions(), validLogInsertionInterval());
    } else {
      [
        els.lexFreeSlotCountSelect, els.mobileLexFreeSlotCountSelect,
        els.lexFreeSlotPlacementSelect, els.mobileLexFreeSlotPlacementSelect,
        els.lexInsertionContentSelect, els.mobileLexInsertionContentSelect,
        els.logInsertionIntervalSelect, els.mobileLogInsertionIntervalSelect
      ].forEach(select => select?.replaceChildren());
    }
    [els.lexFreeSlotPlacementSelect, els.mobileLexFreeSlotPlacementSelect].forEach(select => { if (select) select.title = lexSlotPlacementTip(); });
    [els.lexInsertionContentSelect, els.mobileLexInsertionContentSelect].forEach(select => { if (select) select.title = lexInsertionContentTip(); });
    renderLexInsertionTargetControls();
    renderTopMenuChoiceControls();
    syncPortraitMenuSpace();
    syncTopMenuPlacement();
    if (els.functionalOrderSelect) els.functionalOrderSelect.disabled = false;
    if (els.branchOrderSelect) els.branchOrderSelect.disabled = false;
    fillSelect(els.sentenceTypeSelect, SENTENCE_TYPES, sentenceTypeForExample());
    if (els.showGridInput) els.showGridInput.checked = state.showGrid;
    if (els.showRelationsInput) els.showRelationsInput.checked = state.showRelations;
    if (els.showLabelsInput) els.showLabelsInput.checked = state.showLabels;
    if (els.projectionBoxDraggableInput) els.projectionBoxDraggableInput.checked = !!state.projectionBoxDraggable;
    if (els.southBoxDraggableInput) els.southBoxDraggableInput.checked = !!state.southBoxDraggable;
    const directState = directPlacementActive() ? ensureDirectPlacementState() : null;
    const multiOgnPlayback = multiOgnAnaphorActive();
    const growthSupported = !!directState || multiOgnPlayback || growthSupportedProjection();
    const growthMax = directState ? Math.max(0, directState.targetCount - 1)
      : multiOgnPlayback ? multiOgnPlayMax() : (growthSupported ? growthStepMax() : 0);
    const activeGrowthStep = directState ? Math.max(0, directState.points.length - 1)
      : multiOgnPlayback ? state.multiOgnPlayStep : state.growthStep;
    const activeGrowthEnabled = directState || multiOgnPlayback ? true : state.growthEnabled;
    const activeGrowthTimer = directState ? state.directPlacementTimer
      : multiOgnPlayback ? state.multiOgnPlayTimer : state.growthTimer;
    const activeGrowthLabel = directState ? directPlacementLabel()
      : multiOgnPlayback ? multiOgnPlayLabel() : growthLabel();
    const randomProgress = directState && placementModeDefinition().id === 'random'
      ? randomIterationProgress()
      : null;
    const directCanPrevious = !!directState && (activeGrowthStep > 0 || (randomProgress?.index || 0) > 0);
    const directCanNext = !!directState && (
      activeGrowthStep < growthMax
      || (!!randomProgress && randomProgress.number < randomProgress.total)
    );
    if (!directState && !multiOgnPlayback && growthSupported) {
      state.growthStep = clampGrowthStep(state.growthStep);
      if (state.growthStep > 0) state.lastSupportedGrowthStep = state.growthStep;
    }
    if (els.growthEnabledInput) {
      els.growthEnabledInput.checked = activeGrowthEnabled;
      els.growthEnabledInput.disabled = !!directState || multiOgnPlayback || !growthSupported;
    }
    if (els.growthStepInput) {
      els.growthStepInput.min = 0;
      els.growthStepInput.max = growthMax;
      els.growthStepInput.value = growthSupported ? activeGrowthStep : state.lastSupportedGrowthStep;
      els.growthStepInput.disabled = !!directState || multiOgnPlayback || !activeGrowthEnabled || !growthSupported;
    }
    if (els.growthStepLabel) els.growthStepLabel.textContent = activeGrowthLabel;
    if (els.growthPrevButton) els.growthPrevButton.disabled = !activeGrowthEnabled || !growthSupported || (directState ? !directCanPrevious : activeGrowthStep <= 0);
    if (els.growthNextButton) els.growthNextButton.disabled = !activeGrowthEnabled || !growthSupported || (directState ? !directCanNext : activeGrowthStep >= growthMax);
    if (els.growthResetButton) els.growthResetButton.disabled = !activeGrowthEnabled || !growthSupported;
    const growthPlayText = activeGrowthTimer ? (isEnglish() ? 'Pause' : 'Pauze') : 'Play';
    const growthPrevDisabled = !activeGrowthEnabled || !growthSupported || (directState ? !directCanPrevious : activeGrowthStep <= 0);
    const growthNextDisabled = !activeGrowthEnabled || !growthSupported || (directState ? !directCanNext : activeGrowthStep >= growthMax);
    const growthResetDisabled = !activeGrowthEnabled || !growthSupported;
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
    if (els.mainGrowthStepLabel) {
      els.mainGrowthStepLabel.textContent = activeGrowthLabel;
      els.mainGrowthStepLabel.title = activeGrowthLabel;
    }
    if (els.mainSouthModeButton) {
      els.mainSouthModeButton.textContent = southLogicalModeLabel(state.southLogicalMode || 'SOV');
      els.mainSouthModeButton.title = SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(state.southLogicalMode || 'SOV')
        ? movementRequiredModeComment(state.southLogicalMode || 'SOV')
        : (isEnglish() ? `Next LOG order: ${southLogicalModeListLabel()}` : `Volgende LOG-volgorde: ${southLogicalModeListLabel()}`);
    }
    if (els.mainSouthPrevButton) els.mainSouthPrevButton.title = isEnglish() ? 'Previous LOG order' : 'Vorige LOG-volgorde';
    if (els.mainSouthNextButton) els.mainSouthNextButton.title = isEnglish() ? 'Next LOG order' : 'Volgende LOG-volgorde';
    const mainSouthControl = document.querySelector('[data-south-logical-control]');
    if (mainSouthControl) {
      const hidden = !!directState || multiOgnAnaphorActive();
      mainSouthControl.classList.toggle('is-hidden', hidden);
      mainSouthControl.setAttribute('aria-hidden', hidden ? 'true' : 'false');
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
    if (els.mobileGrowthStepLabel) {
      els.mobileGrowthStepLabel.textContent = activeGrowthLabel;
      els.mobileGrowthStepLabel.title = activeGrowthLabel;
    }
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
    if (!languageTreeActive()) {
      els.selectionEmpty?.classList.remove('hidden');
      els.nodeEditor?.classList.add('hidden');
      return;
    }
    const layout = state.centerMode === 'ft' ? getFunctionalLayout() : getSyntaxLayout();
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

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function download(filename, text, type = 'application/json') {
    downloadBlob(filename, new Blob([text], { type }));
  }

  let graphExportBusy = false;

  function graphExportFileStem(kind) {
    const sourceId = multiOgnAnaphorActive() ? activeMultiOgnDemo().id : (state.example?.id || 'opengraph');
    const exampleId = String(sourceId)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'opengraph';
    return `${exampleId}.${VERSION}.${kind}`;
  }

  function graphExportViewBox(aspect = null) {
    const fitted = validStoredViewBox(state.maximumContentFit);
    const current = validStoredViewBox(parseViewBox());
    const box = fitted || current || fallbackViewBox();
    return expandBoxToAspect({ ...box }, aspect);
  }

  function collectStandaloneSvgStyles() {
    const blocks = [];
    for (const sheet of Array.from(document.styleSheets || [])) {
      try {
        const rules = Array.from(sheet.cssRules || []).map(rule => rule.cssText).join('\n');
        if (rules) blocks.push(rules);
      } catch (_err) {
        // Een eventuele cross-origin stylesheet mag de lokale SVG-export niet blokkeren.
      }
    }
    return blocks.join('\n');
  }

  function inlineStandaloneSvgPresentation(sourceRoot, cloneRoot) {
    const properties = [
      'color',
      'fill',
      'fill-opacity',
      'stroke',
      'stroke-opacity',
      'stroke-width',
      'stroke-dasharray',
      'stroke-dashoffset',
      'stroke-linecap',
      'stroke-linejoin',
      'opacity',
      'font-family',
      'font-size',
      'font-style',
      'font-weight',
      'letter-spacing',
      'text-anchor',
      'dominant-baseline',
      'paint-order',
      'filter',
      'clip-path',
      'shape-rendering',
      'vector-effect'
    ];
    const sources = [sourceRoot, ...sourceRoot.querySelectorAll('*')];
    const clones = [cloneRoot, ...cloneRoot.querySelectorAll('*')];
    sources.forEach((source, index) => {
      const target = clones[index];
      if (!target || !source.tagName) return;
      try {
        const computed = getComputedStyle(source);
        properties.forEach(property => {
          const value = computed.getPropertyValue(property);
          if (value) target.style.setProperty(property, value);
        });
      } catch (_err) {
        // Ingebedde stylesheet blijft de fallback als computed style ontbreekt.
      }
    });
  }

  function standaloneSvgText(options = {}) {
    if (!els.svg) throw new Error('Graph-SVG ontbreekt.');
    const width = Math.max(1, Math.round(Number(options.width) || 1200));
    const height = Math.max(1, Math.round(Number(options.height) || 627));
    const box = validStoredViewBox(options.viewBox) || graphExportViewBox(width / height);
    const clone = els.svg.cloneNode(true);
    clone.id = 'opengraph-export';
    clone.classList.remove('is-panning');
    clone.setAttribute('xmlns', SVG_NS);
    clone.setAttribute('width', String(width));
    clone.setAttribute('height', String(height));
    clone.setAttribute('viewBox', viewBoxToString(box));
    clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    clone.removeAttribute('tabindex');
    clone.removeAttribute('title');
    // Computed presentation maakt de uitvoer ook zelfstandig als een browser
    // cssRules van een lokale file://-stylesheet niet uitleesbaar maakt.
    inlineStandaloneSvgPresentation(els.svg, clone);

    const rootStyle = getComputedStyle(document.documentElement);
    for (const [name, fallback] of [
      ['--lex', '#2563eb'],
      ['--synt', '#16a34a'],
      ['--log', '#7c3aed'],
      ['--og-font-scale', els.svg.style.getPropertyValue('--og-font-scale') || '1']
    ]) {
      clone.style.setProperty(name, rootStyle.getPropertyValue(name).trim() || fallback);
    }

    clone.querySelectorAll('.projection-stability-frame').forEach(node => node.remove());

    const title = document.createElementNS(SVG_NS, 'title');
    title.textContent = activeSentenceText();
    const style = document.createElementNS(SVG_NS, 'style');
    style.textContent = options.styleText || collectStandaloneSvgStyles();
    const background = document.createElementNS(SVG_NS, 'rect');
    background.setAttribute('x', String(box.x));
    background.setAttribute('y', String(box.y));
    background.setAttribute('width', String(box.w));
    background.setAttribute('height', String(box.h));
    background.setAttribute('fill', '#ffffff');
    background.setAttribute('class', 'graph-export-background');
    clone.insertBefore(background, clone.firstChild);
    clone.insertBefore(style, background);
    clone.insertBefore(title, style);

    const serializer = new window.XMLSerializer();
    return `<?xml version="1.0" encoding="UTF-8"?>\n${serializer.serializeToString(clone)}`;
  }

  function setGraphExportBusy(value) {
    graphExportBusy = !!value;
    [els.downloadGraphSvgButton, els.downloadGraphPngButton, els.recordPlayWebmButton].forEach(button => {
      if (button) button.disabled = graphExportBusy;
    });
  }

  function setGraphExportStatus(nl, en = nl, isError = false) {
    if (!els.graphExportStatus) return;
    els.graphExportStatus.dataset.statusNl = String(nl || '');
    els.graphExportStatus.dataset.statusEn = String(en || nl || '');
    els.graphExportStatus.textContent = isEnglish()
      ? els.graphExportStatus.dataset.statusEn
      : els.graphExportStatus.dataset.statusNl;
    els.graphExportStatus.classList.toggle('is-error', !!isError);
  }

  function refreshGraphExportStatusLanguage() {
    if (!els.graphExportStatus) return;
    const key = isEnglish() ? 'statusEn' : 'statusNl';
    if (els.graphExportStatus.dataset[key]) {
      els.graphExportStatus.textContent = els.graphExportStatus.dataset[key];
    }
  }

  function downloadGraphSvg() {
    if (graphExportBusy) return;
    try {
      const box = graphExportViewBox();
      const ratio = box.w / box.h;
      const width = 1600;
      const height = Math.max(1, Math.round(width / ratio));
      const svgText = standaloneSvgText({ width, height, viewBox: box });
      downloadBlob(
        `${graphExportFileStem('graph')}.svg`,
        new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
      );
      recordParadata('export-graph-svg', { width, height, example: state.example?.id });
      setGraphExportStatus(
        'SVG gedownload: zelfstandig vectorbestand met de volledige graph.',
        'SVG downloaded: self-contained vector file with the complete graph.'
      );
    } catch (err) {
      console.error('OpenGraph SVG export failed', err);
      setGraphExportStatus(
        'SVG-export is mislukt. Probeer de graph opnieuw passend te zetten.',
        'SVG export failed. Fit the graph and try again.',
        true
      );
    }
  }

  function loadSvgImage(svgText) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('De SVG kon niet naar een afbeelding worden omgezet.'));
      };
      image.src = url;
    });
  }

  async function drawStandaloneSvgOnCanvas(canvas, svgText) {
    const image = await loadSvgImage(svgText);
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas-context ontbreekt.');
    context.save();
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.restore();
  }

  function canvasPngBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('PNG-encoder gaf geen bestand terug.'));
      }, 'image/png');
    });
  }

  async function downloadGraphPng() {
    if (graphExportBusy) return;
    setGraphExportBusy(true);
    setGraphExportStatus(
      'LinkedIn-PNG wordt opgebouwd…',
      'Building LinkedIn PNG…'
    );
    try {
      const width = 1200;
      const height = 627;
      const box = graphExportViewBox(width / height);
      const svgText = standaloneSvgText({ width, height, viewBox: box });
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      await drawStandaloneSvgOnCanvas(canvas, svgText);
      const blob = await canvasPngBlob(canvas);
      downloadBlob(`${graphExportFileStem('linkedin-1200x627')}.png`, blob);
      recordParadata('export-graph-png', { width, height, platform: 'linkedin', example: state.example?.id });
      setGraphExportStatus(
        'LinkedIn-PNG gedownload (1200 × 627). Upload dit als afbeelding bij een bijdrage.',
        'LinkedIn PNG downloaded (1200 × 627). Upload it as the image in a post.'
      );
    } catch (err) {
      console.error('OpenGraph PNG export failed', err);
      setGraphExportStatus(
        'PNG-export is mislukt. Deze browser kon de SVG niet naar PNG omzetten.',
        'PNG export failed. This browser could not convert the SVG to PNG.',
        true
      );
    } finally {
      setGraphExportBusy(false);
    }
  }

  function animationFrame() {
    return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function waitMilliseconds(milliseconds) {
    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
  }

  const PLAY_VIDEO_FRAME_RATE = 30;

  function playRecordingFormatCandidates() {
    return [
      { mimeType: 'video/mp4;codecs=avc1.424028', extension: 'mp4', label: 'MP4/H.264' },
      { mimeType: 'video/mp4;codecs=avc1.4D4028', extension: 'mp4', label: 'MP4/H.264' },
      { mimeType: 'video/mp4', extension: 'mp4', label: 'MP4' },
      { mimeType: 'video/webm;codecs=vp9', extension: 'webm', label: 'WebM/VP9' },
      { mimeType: 'video/webm;codecs=vp8', extension: 'webm', label: 'WebM/VP8' },
      { mimeType: 'video/webm', extension: 'webm', label: 'WebM' }
    ];
  }

  function createPlayMediaRecorder(stream) {
    if (!window.MediaRecorder) throw new Error('MediaRecorder ontbreekt.');
    for (const format of playRecordingFormatCandidates()) {
      if (MediaRecorder.isTypeSupported && !MediaRecorder.isTypeSupported(format.mimeType)) continue;
      try {
        const recorder = new MediaRecorder(stream, {
          mimeType: format.mimeType,
          videoBitsPerSecond: 4000000
        });
        const actualMimeType = recorder.mimeType || format.mimeType;
        const extension = actualMimeType.toLowerCase().includes('mp4') ? 'mp4' : format.extension;
        return {
          recorder,
          mimeType: actualMimeType,
          extension,
          label: extension === 'mp4' ? 'MP4/H.264' : format.label
        };
      } catch (_unsupportedFormat) {
        // Probeer de volgende container/codec die deze browser aanbiedt.
      }
    }
    const recorder = new MediaRecorder(stream, { videoBitsPerSecond: 4000000 });
    const actualMimeType = recorder.mimeType || 'video/webm';
    const extension = actualMimeType.toLowerCase().includes('mp4') ? 'mp4' : 'webm';
    return {
      recorder,
      mimeType: actualMimeType,
      extension,
      label: extension === 'mp4' ? 'MP4' : 'WebM'
    };
  }

  function canvasRecordingFrameSource(canvas) {
    let stream = canvas.captureStream(0);
    let track = stream.getVideoTracks?.()[0];
    if (track && typeof track.requestFrame === 'function') {
      return {
        stream,
        requestFrame: () => {
          if (track.readyState !== 'ended') track.requestFrame();
        },
        mode: 'request-frame'
      };
    }

    stream.getTracks?.().forEach(item => item.stop());
    stream = canvas.captureStream(PLAY_VIDEO_FRAME_RATE);
    track = stream.getVideoTracks?.()[0];
    const context = canvas.getContext('2d');
    let lightPixel = false;
    return {
      stream,
      requestFrame: () => {
        if (!context || track?.readyState === 'ended') return;
        lightPixel = !lightPixel;
        context.save();
        context.fillStyle = lightPixel ? '#ffffff' : '#fefefe';
        context.fillRect(canvas.width - 1, canvas.height - 1, 1, 1);
        context.restore();
      },
      mode: 'canvas-touch'
    };
  }

  function startCanvasRecordingFramePump(requestFrame, frameRate = PLAY_VIDEO_FRAME_RATE) {
    requestFrame();
    const timer = window.setInterval(requestFrame, Math.round(1000 / frameRate));
    return () => window.clearInterval(timer);
  }

  async function recordPlayWebm() {
    if (graphExportBusy) return;
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
      setGraphExportStatus(
        'Deze browser kan Play niet opnemen. Gebruik een actuele Chrome-, Edge- of Firefox-versie.',
        'This browser cannot record Play. Use a current Chrome, Edge, or Firefox version.',
        true
      );
      return;
    }

    const snapshot = {
      projection: state.projection,
      sourceAxes: [...state.sourceAxes],
      growthEnabled: state.growthEnabled,
      growthStep: state.growthStep,
      lastSupportedGrowthStep: state.lastSupportedGrowthStep,
      projectionBlockUnlocked: state.projectionBlockUnlocked,
      manualViewBox: validStoredViewBox(state.manualViewBox),
      maximumContentFit: validStoredViewBox(state.maximumContentFit)
    };
    const width = 1200;
    const height = 628;
    const frameBox = graphExportViewBox(width / height);
    const styleText = collectStandaloneSvgStyles();
    let recorder = null;
    let stream = null;
    let stopFramePump = null;
    let completedBlob = null;
    let recordingOutput = null;

    setGraphExportBusy(true);
    stopGrowthPlayback();
    try {
      state.projection = 'axes';
      state.sourceAxes = SOURCE_AXIS_IDS.slice();
      state.growthEnabled = true;
      state.growthStep = 0;
      state.lastSupportedGrowthStep = 0;
      state.projectionBlockUnlocked = false;
      state.manualViewBox = null;
      render();
      await animationFrame();

      const maxStep = growthStepMax();
      if (maxStep <= 0) throw new Error('Deze view heeft geen Play-stappen.');

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      await drawStandaloneSvgOnCanvas(canvas, standaloneSvgText({
        width,
        height,
        viewBox: frameBox,
        styleText
      }));

      const frameSource = canvasRecordingFrameSource(canvas);
      stream = frameSource.stream;
      recordingOutput = createPlayMediaRecorder(stream);
      recorder = recordingOutput.recorder;
      const chunks = [];
      const stopped = new Promise((resolve, reject) => {
        recorder.addEventListener('dataavailable', event => {
          if (event.data?.size) chunks.push(event.data);
        });
        recorder.addEventListener('stop', () => {
          resolve(new Blob(chunks, { type: recorder.mimeType || recordingOutput.mimeType || 'video/webm' }));
        }, { once: true });
        recorder.addEventListener('error', event => {
          reject(event.error || new Error('MediaRecorder-fout.'));
        }, { once: true });
      });

      recorder.start(250);
      stopFramePump = startCanvasRecordingFramePump(frameSource.requestFrame);
      await waitMilliseconds(900);
      for (let step = 1; step <= maxStep; step += 1) {
        state.growthStep = step;
        state.lastSupportedGrowthStep = step;
        state.projectionBlockUnlocked = step >= maxStep;
        render();
        await animationFrame();
        await drawStandaloneSvgOnCanvas(canvas, standaloneSvgText({
          width,
          height,
          viewBox: frameBox,
          styleText
        }));
        setGraphExportStatus(
          `Play-opname: stap ${step} van ${maxStep}…`,
          `Recording Play: step ${step} of ${maxStep}…`
        );
        await waitMilliseconds(step === maxStep ? 1200 : 700);
      }
      stopFramePump?.();
      stopFramePump = null;
      recorder.stop();
      completedBlob = await stopped;
      if (!completedBlob.size) throw new Error('De video-opname is leeg.');
      downloadBlob(`${graphExportFileStem('play-linkedin')}.${recordingOutput.extension}`, completedBlob);
      recordParadata('export-play-video', {
        width,
        height,
        frame_rate: PLAY_VIDEO_FRAME_RATE,
        steps: maxStep,
        mime_type: completedBlob.type,
        container: recordingOutput.extension,
        capture_mode: frameSource.mode,
        platform: 'linkedin',
        example: state.example?.id
      });
    } catch (err) {
      console.error('OpenGraph Play recording failed', err);
      if (recorder?.state && recorder.state !== 'inactive') {
        try { recorder.stop(); } catch (_stopError) {}
      }
      setGraphExportStatus(
        'Play-video is mislukt. Laat het browservenster actief en probeer opnieuw.',
        'Play video failed. Keep the browser window active and try again.',
        true
      );
    } finally {
      stopFramePump?.();
      stream?.getTracks?.().forEach(track => track.stop());
      state.projection = snapshot.projection;
      state.sourceAxes = snapshot.sourceAxes;
      state.growthEnabled = snapshot.growthEnabled;
      state.growthStep = snapshot.growthStep;
      state.lastSupportedGrowthStep = snapshot.lastSupportedGrowthStep;
      state.projectionBlockUnlocked = snapshot.projectionBlockUnlocked;
      state.manualViewBox = snapshot.manualViewBox;
      state.maximumContentFit = snapshot.maximumContentFit;
      render();
      setGraphExportBusy(false);
      if (completedBlob?.size) {
        const outputName = recordingOutput?.extension === 'mp4' ? 'MP4/H.264' : 'WebM';
        setGraphExportStatus(
          `Play-video als ${outputName} met ${PLAY_VIDEO_FRAME_RATE} fps gedownload. Upload als video, niet als document.`,
          `Play video downloaded as ${outputName} at ${PLAY_VIDEO_FRAME_RATE} fps. Upload it as a video, not as a document.`
        );
      }
    }
  }

  function jsonClone(value, fallback = null) {
    try { return JSON.parse(JSON.stringify(value)); } catch (_err) { return fallback; }
  }

  function validStoredViewBox(value) {
    if (!value || typeof value !== 'object') return null;
    const x = Number(value.x), y = Number(value.y), w = Number(value.w), h = Number(value.h);
    if (![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) return null;
    return { x, y, w, h };
  }

  function recordParadata(action, details = {}) {
    if (!Array.isArray(state.paradataEvents)) state.paradataEvents = [];
    state.paradataEvents.push({
      time: new Date().toISOString(),
      action: String(action || 'unknown'),
      details: jsonClone(details, {})
    });
    if (state.paradataEvents.length > PARADATA_EVENT_LIMIT) {
      state.paradataEvents.splice(0, state.paradataEvents.length - PARADATA_EVENT_LIMIT);
    }
  }

  function defaultDocumentMetadata() {
    const now = new Date().toISOString();
    const multiOgn = multiOgnAnaphorActive();
    return {
      document_id: globalThis.crypto?.randomUUID?.() || `opn-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: multiOgn ? activeMultiOgnDemo().title : (state.example?.title || state.example?.sentence || 'OpenGraph-document'),
      language: state.language || 'nl',
      created_at: now,
      source: multiOgn
        ? { kind: 'viewer-multi-ogn-example', example_id: activeMultiOgnDemo().id }
        : { kind: 'viewer-example', example_id: state.example?.id || null }
    };
  }

  function ensureDocumentMetadata() {
    if (!state.documentMetadata || typeof state.documentMetadata !== 'object') {
      state.documentMetadata = defaultDocumentMetadata();
    }
    return state.documentMetadata;
  }

  function serializeLayoutGraph(layout, view, rules) {
    assertUniqueNodeGridLines(layout, `OPN-export ${view}`);
    return {
      view,
      root_id: layout?.node?.id || null,
      nodes: (layout?.nodes || []).map(node => ({
        id: node.id,
        label: node.label,
        category: node.cat || null,
        role: node.role || null,
        kind: node.kind || null,
        x: Number(node.x),
        y: Number(node.y)
      })),
      edges: (layout?.edges || []).map(edge => ({
        from: edge.from,
        to: edge.to,
        type: edge.type || 'tree'
      })),
      rules: [...(rules || [])]
    };
  }

  function currentExampleSnapshot() {
    const ex = state.example || EXAMPLES[0];
    return {
      id: ex.id,
      title: ex.title,
      phase: ex.phase || null,
      sentence: activeSentenceText(),
      sentence_html: activeSentenceHtml(),
      subject_default: ex.subjectDefault || null,
      object_default: ex.objectDefault || null,
      predicate: roleLabels().predicate,
      sentence_type: sentenceTypeForExample(ex),
      lex_rule: ex.lexRule || null,
      ...(ex.utteranceType || ex.utteranceKernels?.length ? {
        utterance_type: ex.utteranceType || null,
        utterance_kernels: jsonClone(ex.utteranceKernels || [], []),
        utterance_relations: jsonClone(ex.utteranceRelations || [], []),
        ...(ex.implicitSubject ? { implicit_subject: ex.implicitSubject } : {})
      } : {}),
      ...(featureEnabled('adverbs') ? {
        lex_insertions: Array.isArray(ex.lexInsertions) ? ex.lexInsertions.map(spec => {
          const analysis = resolvedInsertionAnalysis(spec);
          return { ...jsonClone(spec, {}), usageProfile: analysis.id, origin: analysis.origin, originComponents: analysis.components, scope: analysis.scope || spec.scope || '', analysisStatus: analysis.unresolved ? 'ask' : 'resolved' };
        }) : []
      } : {}),
      lex_items: activeLexItems()
    };
  }

  function buildUtteranceKernelOpnDocument(composition, includeParadata = true) {
    const baseMetadata = ensureDocumentMetadata();
    const now = new Date().toISOString();
    const example = EXAMPLES.find(candidate => candidate.id === composition.definition.id);
    const units = composition.units.map(unit => ({
      id: unit.id,
      order: unit.order,
      sentence: composition.demo.sentences.find(sentence => sentence.id === unit.id)?.text || unit.id,
      calculated_independently: true,
      rigid_shift: { dx: unit.shift.dx, dy: unit.shift.dy },
      graph: serializeLayoutGraph(unit.layout, unit.id, [])
    }));
    const relations = composition.relations.map(relation => ({
      type: 'coreference', direction: 'none', line: 'straight-vertical-no-arrow',
      referent: relation.referent,
      antecedent: jsonClone(relation.antecedent, null),
      anaphor: jsonClone(relation.anaphor, null)
    }));
    return {
      opn: 'Open Graph Notation', document_type: OPN_DOCUMENT_TYPE, opn_version: OPN_FORMAT_VERSION,
      metadata: {
        ...jsonClone(baseMetadata, {}), title: composition.definition.title,
        language: state.language || baseMetadata.language || 'nl', modified_at: now,
        schema: 'data-metadata-paradata', profile: 'multi-ogn',
        extras: ['multi-ogn-anaphor', 'utterance-kernels'],
        generator: { name: 'OpenGraph Lite Viewer', version: VERSION }
      },
      data: {
        example: {
          id: composition.definition.id, title: composition.definition.title,
          utterance_type: composition.definition.type,
          ...(composition.definition.anaphorVariant ? {
            anaphor_variant: composition.definition.anaphorVariant,
            anaphor_phrase: composition.definition.anaphorPhrase
          } : {}),
          utterance_kernels: jsonClone(example?.utteranceKernels || [], []),
          utterance_relations: jsonClone(example?.utteranceRelations || [], []),
          ...(composition.definition.implicitSubject ? { implicit_subject: composition.definition.implicitSubject } : {}),
          sentences: composition.demo.sentences.map(sentence => ({ id: sentence.id, order: sentence.order, text: sentence.text }))
        },
        composition: {
          schema: composition.schema, kind: composition.units.length > 2 ? 'utterance-kernel-story' : 'utterance-kernel-pair',
          order: composition.units.map(unit => unit.id), calculation: 'independent-before-composition',
          rigid_shift_only: true, grid_invariant_scope: 'per-ogn',
          cross_ogn_exception: 'declared-coreference-columns-only', gap_rows: composition.gapRows,
          units, relation: relations[0], relations,
          shared_lex_axis: {
            axis: 'west', order: 'utterance-surface',
            items: composition.lexItems.map(item => ({
              node_id: item.nodeId, label: item.label, unit_id: item.unitId,
              sentence_order: item.sentenceOrder, word_order: item.wordOrder,
              ...(item.connector ? { connector: true } : {}),
              ...(item.realization ? { realization: item.realization } : {}),
              ...(item.phrase ? { phrase: item.phrase, phrase_part: item.phrasePart } : {})
            }))
          }
        }
      },
      paradata: includeParadata ? {
        included: true, privacy: 'local-export-only',
        session: { id: state.paradataSessionId, started_at: state.paradataStartedAt, exported_at: now },
        workspace: {
          placement_mode: 'multi-ogn-anaphor', utterance_id: composition.definition.id,
          manual_viewbox: state.manualViewBox ? jsonClone(state.manualViewBox, null) : null,
          display: { grid: !!state.showGrid, relations: !!state.showRelations, labels: !!state.showLabels, layout_density: state.layoutDensity, view_fit: state.viewFitMode }
        },
        events: jsonClone(state.paradataEvents, [])
      } : { included: false }
    };
  }

  function buildMultiOgnOpnDocument(includeParadata = true) {
    const composition = multiOgnAnaphorComposition();
    if (composition.definition) return buildUtteranceKernelOpnDocument(composition, includeParadata);
    const baseMetadata = ensureDocumentMetadata();
    const now = new Date().toISOString();
    const units = composition.units.map(unit => {
      const sentence = composition.demo.sentences.find(item => item.id === unit.id);
      return {
        id: unit.id,
        order: unit.order,
        sentence: sentence?.text || unit.id,
        calculated_independently: true,
        rigid_shift: { dx: unit.shift.dx, dy: unit.shift.dy },
        graph: serializeLayoutGraph(unit.layout, unit.id, [])
      };
    });
    return {
      opn: 'Open Graph Notation',
      document_type: OPN_DOCUMENT_TYPE,
      opn_version: OPN_FORMAT_VERSION,
      metadata: {
        ...jsonClone(baseMetadata, {}),
        title: MULTI_OGN_ANAPHOR_DEMO.title,
        language: state.language || baseMetadata.language || 'nl',
        modified_at: now,
        schema: 'data-metadata-paradata',
        profile: 'multi-ogn',
        extras: ['multi-ogn-anaphor'],
        generator: { name: 'OpenGraph Lite Viewer', version: VERSION }
      },
      data: {
        example: {
          id: MULTI_OGN_ANAPHOR_DEMO.id,
          title: MULTI_OGN_ANAPHOR_DEMO.title,
          sentences: composition.demo.sentences.map(sentence => ({ id: sentence.id, order: sentence.order, text: sentence.text }))
        },
        composition: {
          schema: composition.schema,
          order: composition.units.map(unit => unit.id),
          calculation: 'independent-before-composition',
          rigid_shift_only: true,
          grid_invariant_scope: 'per-ogn',
          cross_ogn_exception: 'declared-coreference-column-only',
          gap_rows: composition.gapRows,
          units,
          relation: {
            type: 'coreference',
            direction: 'none',
            line: 'straight-vertical-no-arrow',
            antecedent: jsonClone(composition.relation.antecedent, null),
            anaphor: jsonClone(composition.relation.anaphor, null)
          },
          shared_lex_axis: {
            axis: 'west',
            order: 'S1-before-S2',
            items: composition.lexItems.map(item => ({
              node_id: item.nodeId,
              label: item.label,
              unit_id: item.unitId,
              sentence_order: item.sentenceOrder,
              word_order: item.wordOrder
            }))
          }
        }
      },
      paradata: includeParadata ? {
        included: true,
        privacy: 'local-export-only',
        session: { id: state.paradataSessionId, started_at: state.paradataStartedAt, exported_at: now },
        workspace: {
          placement_mode: 'multi-ogn-anaphor',
          manual_viewbox: state.manualViewBox ? jsonClone(state.manualViewBox, null) : null,
          display: {
            grid: !!state.showGrid,
            relations: !!state.showRelations,
            labels: !!state.showLabels,
            layout_density: state.layoutDensity,
            view_fit: state.viewFitMode
          }
        },
        events: jsonClone(state.paradataEvents, [])
      } : { included: false }
    };
  }

  function buildOpnDocument(includeParadata = true) {
    if (multiOgnAnaphorActive()) return buildMultiOgnOpnDocument(includeParadata);
    const baseMetadata = ensureDocumentMetadata();
    const now = new Date().toISOString();
    const adverbsEnabled = featureEnabled('adverbs');
    const adverb = adverbsEnabled ? activeAdverbData() : null;
    const syntaxLayout = getSyntaxLayout();
    const ftLayout = getFunctionalLayout();
    const markedLog = SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(state.southLogicalMode);
    const logicalSequence = activeLogicalSlotSequence();
    const serializedLogicalSequence = logicalSequence.map(item => ({
      id: item.id || null,
      kind: item.kind,
      short: item.short || null,
      word: item.word || null,
      logical_slot: Number(item.logicalSlot),
      width: Math.max(1, Number(item.width) || 1),
      interval: item.kind === 'minor' ? (item.logInterval || item.interval || null) : null
    }));
    const document = {
      opn: 'Open Graph Notation',
      document_type: OPN_DOCUMENT_TYPE,
      opn_version: OPN_FORMAT_VERSION,
      metadata: {
        ...jsonClone(baseMetadata, {}),
        title: baseMetadata.title || state.example?.title || 'OpenGraph-document',
        language: state.language || baseMetadata.language || 'nl',
        modified_at: now,
        schema: 'data-metadata-paradata',
        profile: adverbsEnabled ? 'custom' : 'base',
        extras: adverbsEnabled ? ['adverbs'] : [],
        preconfig: insertionPreconfigSnapshot(),
        generator: { name: 'OpenGraph Lite Viewer', version: VERSION }
      },
      data: {
        example: currentExampleSnapshot(),
        graphs: {
          syntax: serializeLayoutGraph(syntaxLayout, 'syntax', syntaxRules()),
          ft: serializeLayoutGraph(ftLayout, 'ft', functionalRules())
        },
        projections: {
          lex: {
            axis: 'west',
            position_source: logicalAuthorityEnabled() ? 'LOG' : 'legacy-LEX',
            projection_origin: activeLogConfig().lexProjectionOrigin || 'SOURCE-Y',
            placement_mode: activeLogConfig().lexPlacementMode || 'horizontal-then-move',
            sentence: activeSentenceText(),
            rule: state.example?.lexRule || null,
            items: activeLexItems(),
            logical_sequence: serializedLogicalSequence,
            ...(adverbsEnabled ? {
              free_slot_count: lexFreeSlotCount(),
              free_slot_placement: validLexSlotPlacement(),
              insertion_content: validLexInsertionContent(),
              insertion_extension_targets: validLexInsertionTargets(),
              free_slots: lexFreeSlotDescriptors(),
              adverb: adverb ? jsonClone(adverb, null) : null
            } : {})
          },
          synt: {
            axis: 'east',
            rules: syntaxRules()
          },
          log: {
            axis: 'south',
            authority: logicalAuthorityEnabled() ? 'LOG' : 'legacy',
            order: state.southLogicalMode,
            marked: markedLog,
            position_unit: activeLogConfig().positionUnit || 'slot',
            ...(adverbsEnabled ? { insertion_interval: validLogInsertionInterval() } : {}),
            sequence: serializedLogicalSequence,
            distances: {
              S_O: logicalSlotDistance(logicalSequence, 'S', 'O'),
              O_V: logicalSlotDistance(logicalSequence, 'O', 'V'),
              S_V: logicalSlotDistance(logicalSequence, 'S', 'V')
            },
            lex_position_source: activeLogConfig().lexPositionSource || 'LOG',
            lex_projection_origin: activeLogConfig().lexProjectionOrigin || 'SOURCE-Y',
            lex_placement_mode: activeLogConfig().lexPlacementMode || 'horizontal-then-move',
            example_controls_layout: !!activeLogConfig().exampleControlsLayout,
            play_phases: logLexPlayPhases(),
            play_space_mode: activeLogConfig().playSpaceMode || 'reserve-empty-lex-rows'
          }
        },
        notation: {
          tree_choice: activeTreeChoice(),
          functional_order: state.functionalOrder,
          branch_order: state.branchOrder,
          branch_overrides: jsonClone(state.branchOverrides, { top: 'auto', middle: 'auto', other: 'auto' }),
          role_swap: !!state.roleSwap,
          free_slot_count: reservedFreeSlotCount()
        }
      },
      paradata: includeParadata ? {
        included: true,
        privacy: 'local-export-only',
        session: {
          id: state.paradataSessionId,
          started_at: state.paradataStartedAt,
          exported_at: now
        },
        workspace: {
          placement_mode: 'language-tree',
          central_view: state.centerMode,
          projection_mode: state.projection,
          visible_projections: normalizedSourceAxes(),
          manual_viewbox: state.manualViewBox ? jsonClone(state.manualViewBox, null) : null,
          growth: { enabled: !!state.growthEnabled, step: state.growthStep },
          display: {
            grid: !!state.showGrid,
            relations: !!state.showRelations,
            labels: !!state.showLabels,
            layout_density: state.layoutDensity,
            view_fit: state.viewFitMode
          }
        },
        events: jsonClone(
          adverbsEnabled
            ? state.paradataEvents
            : state.paradataEvents.filter(event => !/adverb|bijwoord/i.test(`${event?.action || ''} ${JSON.stringify(event?.details || {})}`)),
          []
        )
      } : { included: false }
    };
    return document;
  }

  function legacyJsonPayload() {
    if (multiOgnAnaphorActive()) {
      const composition = multiOgnAnaphorComposition();
      return {
        version: VERSION,
        profile: 'multi-ogn',
        extras: ['multi-ogn-anaphor'],
        placement_mode: 'multi-ogn-anaphor',
        example: activeMultiOgnDemo().id,
        composition: {
          schema: composition.schema,
          units: composition.units.map(unit => ({ id: unit.id, order: unit.order, shift: unit.shift, layout: unit.layout })),
          relation: composition.relation,
          ...(composition.definition ? { kind: 'utterance-kernel-pair', relations: composition.relations } : {}),
          lex_items: composition.lexItems
        }
      };
    }
    const payload = {
      version: VERSION,
      profile: featureEnabled('adverbs') ? 'custom' : 'base',
      extras: featureEnabled('adverbs') ? ['adverbs'] : [],
      preconfig: insertionPreconfigSnapshot(),
      example: state.example.id,
      central_opn: state.centerMode,
      projection: state.projection,
      source_axes: normalizedSourceAxes(),
      tree_choice: activeTreeChoice(),
      functional_order: state.functionalOrder,
      branch_order: state.branchOrder,
      branch_overrides: state.branchOverrides,
      free_slot_count: reservedFreeSlotCount(),
      log_sequence: activeLogicalSlotSequence().map(item => ({
        id: item.id || null,
        kind: item.kind,
        short: item.short || null,
        logical_slot: Number(item.logicalSlot),
        interval: item.kind === 'minor' ? (item.logInterval || item.interval || null) : null
      })),
      top_menus_above_grid: normalizeTopMenusAbove(),
      right_menu_width: validRightMenuMode(),
      canvas_pan_enabled: !!state.canvasPanEnabled,
      syntax_rules: syntaxRules(),
      structure_config: 'structure-config.html',
      lex: activeLexItems()
    };
    if (featureEnabled('adverbs')) {
      payload.lex_free_slot_count = lexFreeSlotCount();
      payload.lex_free_slot_placement = validLexSlotPlacement();
      payload.lex_insertion_content = validLexInsertionContent();
      payload.log_insertion_interval = validLogInsertionInterval();
      payload.lex_insertion_extension_targets = validLexInsertionTargets();
      payload.lex_free_slots = lexFreeSlotDescriptors();
    }
    return payload;
  }

  function downloadJson() {
    const exampleId = multiOgnAnaphorActive() ? activeMultiOgnDemo().id : state.example.id;
    recordParadata('export-legacy-json', { example: exampleId });
    download(`${exampleId}.${VERSION}.legacy.json`, JSON.stringify(legacyJsonPayload(), null, 2));
  }

  function includeParadataForExport() {
    if (els.configIncludeParadataInput) return els.configIncludeParadataInput.checked;
    if (els.mobileIncludeParadataInput) return els.mobileIncludeParadataInput.checked;
    return els.includeParadataInput?.checked !== false;
  }

  function syncParadataExportCheckboxes(value) {
    [els.includeParadataInput, els.configIncludeParadataInput, els.mobileIncludeParadataInput].forEach(input => {
      if (input) input.checked = !!value;
    });
  }

  function downloadOpn() {
    const includeParadata = includeParadataForExport();
    const exampleId = multiOgnAnaphorActive() ? activeMultiOgnDemo().id : state.example.id;
    recordParadata('export-opn', { example: exampleId, paradata_included: includeParadata });
    const payload = buildOpnDocument(includeParadata);
    download(`${exampleId}.${VERSION}.opn`, JSON.stringify(payload, null, 2), 'application/vnd.opengraph.opn+json');
  }

  function importedExampleFromData(exampleData) {
    if (!exampleData || typeof exampleData !== 'object') return null;
    const id = String(exampleData.id || 'imported-opn').trim() || 'imported-opn';
    const lexItems = Array.isArray(exampleData.lex_items)
      ? exampleData.lex_items.map(item => ({ ...item }))
      : [];
    if (!lexItems.length) return null;
    return {
      id,
      title: String(exampleData.title || exampleData.sentence || id),
      phase: exampleData.phase || 'OPN-import',
      sentenceType: exampleData.sentence_type || '',
      lexRule: exampleData.lex_rule || 'hoofdzininvariant',
      sentence: String(exampleData.sentence || lexItems.map(item => item.label).join(' ')),
      sentenceHtml: String(exampleData.sentence_html || lexItems.map(item => escapeHtml(item.label)).join(' ')),
      subjectDefault: exampleData.subject_default || lexItems.find(item => item.role === 'subject' || item.source === 'subject')?.label || 'HOND',
      objectDefault: exampleData.object_default || lexItems.find(item => item.role === 'object' || item.source === 'object')?.label || 'MAN',
      predicate: exampleData.predicate || lexItems.find(item => item.role === 'predicate' || item.source === 'predicate')?.label || 'BIJT',
      utteranceType: exampleData.utterance_type || '',
      utteranceKernels: Array.isArray(exampleData.utterance_kernels) ? exampleData.utterance_kernels.map(item => ({ ...item })) : [],
      utteranceRelations: Array.isArray(exampleData.utterance_relations) ? exampleData.utterance_relations.map(item => ({ ...item })) : [],
      implicitSubject: exampleData.implicit_subject || '',
      lexInsertions: Array.isArray(exampleData.lex_insertions) ? exampleData.lex_insertions.map(item => ({ ...item })) : [],
      lexItems
    };
  }

  function installImportedExample(example) {
    if (!example) return false;
    const index = ALL_EXAMPLES.findIndex(item => item.id === example.id);
    if (index >= 0) ALL_EXAMPLES[index] = example;
    else ALL_EXAMPLES.push(example);
    refreshExamplesForFeatures(example.id);
    return true;
  }

  function declaredInsertionAxes(preconfig = {}) {
    const insertion = preconfig?.insertion;
    if (!insertion || typeof insertion !== 'object') return [];
    return Object.keys(INSERTION_AXIS_DEFINITIONS).filter(axisId => insertion[axisId] === true);
  }

  function missingInsertionAxes(requiredAxes = []) {
    return [...new Set(requiredAxes)].filter(axisId => INSERTION_AXIS_DEFINITIONS[axisId] && !insertionAxisEnabled(axisId));
  }

  function insertionRequirementMessage(missingAxes = [], documentKind = 'OPN') {
    const labels = missingAxes.map(axisId => INSERTION_AXIS_DEFINITIONS[axisId].label).join(' + ');
    return isEnglish()
      ? `This ${documentKind} document requires insertion on ${labels}. Enable it first in Config · Pre-config.`
      : `Dit ${documentKind}-document vereist insertie op ${labels}. Schakel die eerst in via Config · Voorconfig.`;
  }

  function validateImportedUtteranceComposition(composition) {
    const engine = globalThis.OGNMultiComposition;
    const units = Array.isArray(composition?.units) ? composition.units : [];
    if (units.length < 2 || units.some((unit, index) => unit?.id !== `K${index + 1}`)) {
      throw new Error('Een uiting/story vereist opeenvolgende kernzinnen K1, K2 …');
    }
    const layouts = units.map(unit => unit.graph || unit.layout || {});
    if (!layouts.every(layout => engine.validateUnit(layout))) {
      throw new Error('Een geïmporteerde kernzin schendt de unieke rij-/kolomregel.');
    }
    for (let left = 0; left < layouts.length; left += 1) for (let right = left + 1; right < layouts.length; right += 1) {
      if (engine.sharedCoordinates(layouts[left], layouts[right], 'y').length) {
        throw new Error(`K${left + 1} en K${right + 1} mogen geen horizontale gridlijn delen.`);
      }
    }
    const relations = Array.isArray(composition.relations) ? composition.relations : [];
    if (!relations.length) throw new Error('De uiting mist gedeclareerde verticale anafoorrelaties.');
    const pairs = new Set();
    for (const relation of relations) {
      const antecedentId = relation.antecedent?.nodeId || relation.antecedent?.node_id;
      const anaphorId = relation.anaphor?.nodeId || relation.anaphor?.node_id;
      const antecedentUnit = relation.antecedent?.unitId || relation.antecedent?.unit_id || 'K1';
      const anaphorUnit = relation.anaphor?.unitId || relation.anaphor?.unit_id || 'K2';
      const antecedentIndex = units.findIndex(unit => unit.id === antecedentUnit);
      const anaphorIndex = units.findIndex(unit => unit.id === anaphorUnit);
      const antecedent = layouts[antecedentIndex]?.nodes.find(node => node.id === antecedentId);
      const anaphor = layouts[anaphorIndex]?.nodes.find(node => node.id === anaphorId);
      if (relation.type !== 'coreference' || relation.direction !== 'none'
          || !antecedent || !anaphor || Number(antecedent.x) !== Number(anaphor.x)
          || !(Number(anaphor.y) > Number(antecedent.y))) {
        throw new Error('Iedere geïmporteerde anafoor moet verticaal en ongericht van K1 naar K2 lopen.');
      }
      pairs.add(`${antecedentId}\u0000${anaphorId}`);
    }
    if (units.length === 2) {
      const shared = engine.sharedCoordinates(layouts[0], layouts[1], 'x');
      if (shared.length !== pairs.size || shared.some(item => !pairs.has(`${item.first}\u0000${item.second}`))) {
        throw new Error('Alleen gedeclareerde anafoorkolommen mogen door de kernzinnen worden gedeeld.');
      }
    }
    return true;
  }

  function validateImportedMultiOgnComposition(composition) {
    const engine = globalThis.OGNMultiComposition;
    if (!engine?.validateUnit || !engine?.sharedCoordinates) throw new Error('Multi-OGN-compositie-engine ontbreekt.');
    if (!composition || composition.schema !== engine.SCHEMA) throw new Error('Onbekend multi-OGN-compositieschema.');
    if (composition.kind === 'utterance-kernel-pair' || composition.kind === 'utterance-kernel-story') return validateImportedUtteranceComposition(composition);
    const units = Array.isArray(composition.units) ? composition.units : [];
    if (units.length !== 2 || units[0]?.id !== 'S1' || units[1]?.id !== 'S2') {
      throw new Error('De eerste multi-OGN-versie vereist exact S1 gevolgd door S2.');
    }
    const layoutOf = unit => unit.graph || unit.layout || {};
    if (!units.every(unit => engine.validateUnit(layoutOf(unit)))) {
      throw new Error('Een geïmporteerde OGN-eenheid schendt de unieke rij/kolomregel.');
    }
    const relation = composition.relation || {};
    const antecedentId = relation.antecedent?.nodeId || relation.antecedent?.node_id;
    const anaphorId = relation.anaphor?.nodeId || relation.anaphor?.node_id;
    if (relation.type !== 'coreference' || relation.direction !== 'none'
        || antecedentId !== 's1-man' || anaphorId !== 's2-hij') {
      throw new Error('De eerste multi-OGN-versie vereist de ongerichte coreferentie MAN–HIJ.');
    }
    const upper = layoutOf(units[0]);
    const lower = layoutOf(units[1]);
    const antecedent = upper.nodes.find(node => node.id === antecedentId);
    const anaphor = lower.nodes.find(node => node.id === anaphorId);
    if (!antecedent || !anaphor || Number(antecedent.x) !== Number(anaphor.x) || !(Number(anaphor.y) > Number(antecedent.y))) {
      throw new Error('De MAN–HIJ-relatie moet exact verticaal lopen met S2 onder S1.');
    }
    if (engine.sharedCoordinates(upper, lower, 'y').length) {
      throw new Error('S1 en S2 mogen geen horizontale gridlijn delen.');
    }
    const sharedColumns = engine.sharedCoordinates(upper, lower, 'x');
    if (sharedColumns.length !== 1 || sharedColumns[0].first !== antecedentId || sharedColumns[0].second !== anaphorId) {
      throw new Error('Alleen de gedeclareerde MAN–HIJ-kolom mag tussen OGN’s worden gedeeld.');
    }
    return true;
  }

  function applyImportedMultiOgn(payload, filename = '') {
    const composition = payload?.data?.composition || payload?.composition;
    validateImportedMultiOgnComposition(composition);
    const importedId = payload?.data?.example?.id || payload?.example || MULTI_OGN_ANAPHOR_DEMO.id;
    if (['utterance-kernel-pair','utterance-kernel-story'].includes(composition.kind) && !globalThis.OGNUtteranceKernels?.definitionFor?.(importedId)) {
      throw new Error(`Onbekende uiting in multi-OGN-import: ${importedId}.`);
    }
    state.multiOgnExampleId = ['utterance-kernel-pair','utterance-kernel-story'].includes(composition.kind) ? importedId : MULTI_OGN_ANAPHOR_DEMO.id;
    if (['utterance-kernel-pair','utterance-kernel-story'].includes(composition.kind)) {
      state.causalAnaphorVariant = globalThis.OGNUtteranceKernels?.validCausalAnaphorVariant?.(
        payload?.data?.example?.anaphor_variant
      ) || 'die';
      try { localStorage.setItem('opengraph_causal_anaphor_variant', state.causalAnaphorVariant); } catch (_err) {}
    }
    const importedExample = EXAMPLES.find(example => example.id === importedId);
    if (importedExample) state.example = importedExample;
    stopGrowthPlayback();
    stopDirectPlacementPlayback();
    stopMultiOgnPlayback();
    state.placementMode = 'multi-ogn-anaphor';
    state.growthEnabled = false;
    state.growthStep = 0;
    state.multiOgnPlayEnabled = false;
    state.multiOgnPlayStep = 999;
    state.projectionBlockUnlocked = false;
    state.directPlacementState = null;
    state.selectedNodeId = null;
    state.manualViewBox = null;
    const paradata = payload.paradata || {};
    const display = paradata.workspace?.display || {};
    if (typeof display.grid === 'boolean') state.showGrid = display.grid;
    if (typeof display.relations === 'boolean') state.showRelations = display.relations;
    if (typeof display.labels === 'boolean') state.showLabels = display.labels;
    if (LAYOUT_DENSITIES.some(option => option.id === display.layout_density)) state.layoutDensity = display.layout_density;
    if (VIEW_FIT_MODES.some(option => option.id === display.view_fit)) state.viewFitMode = display.view_fit;
    state.documentMetadata = jsonClone(payload.metadata, null) || defaultDocumentMetadata();
    state.paradataEvents = Array.isArray(paradata.events) ? jsonClone(paradata.events, []).slice(-PARADATA_EVENT_LIMIT) : [];
    state.paradataSessionId = globalThis.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    state.paradataStartedAt = new Date().toISOString();
    recordParadata(payload?.data ? 'open-opn-multi-ogn' : 'import-legacy-multi-ogn', {
      filename,
      opn_version: payload.opn_version || null
    });
  }

  function applyLegacyPayload(payload) {
    if (payload?.placement_mode === 'multi-ogn-anaphor' || payload?.composition?.schema === 'ogn-multi-composition-v1') {
      applyImportedMultiOgn(payload);
      return;
    }
    const legacyRequiresAdverbs = Number(payload?.lex_free_slot_count) > 0
      || !!payload?.lex_insertion_content && payload.lex_insertion_content !== 'empty'
      || (Array.isArray(payload?.log_sequence) && payload.log_sequence.some(item => item?.kind === 'minor'));
    const legacyRequiredInsertionAxes = new Set(declaredInsertionAxes(payload?.preconfig));
    if (legacyRequiresAdverbs) {
      legacyRequiredInsertionAxes.add('lex');
      legacyRequiredInsertionAxes.add('log');
    }
    const missingAxes = missingInsertionAxes([...legacyRequiredInsertionAxes]);
    if (missingAxes.length) throw new Error(insertionRequirementMessage(missingAxes, 'legacy'));
    if (!featureEnabled('adverbs') && legacyRequiresAdverbs) {
      throw new Error(isEnglish()
        ? 'This legacy document requires the disabled Adverbs application. Enable it in Config · Applications first.'
        : 'Dit legacy-document vereist de uitgeschakelde toepassing Bijwoorden. Schakel die eerst in via Config · Toepassingen.');
    }
    state.logInsertionInterval = 'auto';
    const nextExample = EXAMPLES.find(example => example.id === payload.example);
    if (nextExample) state.example = nextExample;
    if (payload.central_opn === 'syntax') state.centerMode = 'syntax';
    else if (payload.central_opn === 'ft' || payload.central_opn === 'functional') state.centerMode = 'ft';
    if (PROJECTION_OPTIONS.some(option => option.id === payload.projection)) state.projection = payload.projection;
    if (Array.isArray(payload.source_axes)) setSourceAxes(payload.source_axes, { activateSource: false });
    if (payload.tree_choice && TREE_CHOICES.some(choice => choice.id === payload.tree_choice)) state.treeChoice = payload.tree_choice;
    if (payload.functional_order === 'left-first' || payload.functional_order === 'right-first') state.functionalOrder = payload.functional_order;
    if (payload.branch_order && BRANCH_ORDERS.some(order => order.id === payload.branch_order)) state.branchOrder = payload.branch_order;
    if (Number.isFinite(Number(payload.free_slot_count))) state.freeSlotCount = Math.max(0, Math.min(6, Number(payload.free_slot_count)));
    // Oude vrije-positievelden worden compatibel gelezen maar bewust genegeerd:
    // vóór/na/tussen zijn in het actieve profiel niet beschikbaar.
    if (featureEnabled('adverbs')) {
      if (Number.isFinite(Number(payload.lex_free_slot_count))) state.lexFreeSlotCount = Math.max(0, Math.min(8, Number(payload.lex_free_slot_count)));
      if (payload.lex_free_slot_placement) state.lexFreeSlotPlacement = validLexSlotPlacement(payload.lex_free_slot_placement);
      if (payload.lex_insertion_content) state.lexInsertionContent = validLexInsertionContent(payload.lex_insertion_content);
      if (payload.log_insertion_interval) state.logInsertionInterval = validLogInsertionInterval(payload.log_insertion_interval);
      if (Array.isArray(payload.lex_insertion_extension_targets)) state.lexInsertionExtensionTargets = validLexInsertionTargets(payload.lex_insertion_extension_targets);
    }
    if (Array.isArray(payload.top_menus_above_grid)) state.topMenusAbove = normalizeTopMenusAbove(payload.top_menus_above_grid);
    if (payload.right_menu_width) state.rightMenuMode = validRightMenuMode(payload.right_menu_width);
    else if (Number.isFinite(Number(payload.portrait_menu_slots))) state.topMenusAbove = [];
    if (payload.branch_overrides && typeof payload.branch_overrides === 'object') {
      for (const key of ['top', 'middle', 'other']) {
        if (['auto', 'normal', 'flip'].includes(payload.branch_overrides[key])) state.branchOverrides[key] = payload.branch_overrides[key];
      }
    }
    state.documentMetadata = null;
    resetManualViewBox();
    recordParadata('import-legacy-json', { source_version: payload.version || null });
  }

  function opnDocumentRequiresAdverbs(payload = {}) {
    const data = payload.data || {};
    const projections = data.projections || {};
    const lex = projections.lex || {};
    const log = projections.log || {};
    const extras = Array.isArray(payload.metadata?.extras) ? payload.metadata.extras : [];
    const insertions = Array.isArray(data.example?.lex_insertions) ? data.example.lex_insertions : [];
    const logSequence = Array.isArray(log.sequence) ? log.sequence : [];
    return extras.includes('adverbs')
      || !!lex.adverb
      || insertions.length > 0
      || logSequence.some(item => item?.kind === 'minor');
  }

  function opnDocumentRequiredInsertionAxes(payload = {}) {
    const required = new Set(declaredInsertionAxes(payload.metadata?.preconfig));
    const data = payload.data || {};
    const projections = data.projections || {};
    const lex = projections.lex || {};
    const synt = projections.synt || {};
    const log = projections.log || {};
    if (opnDocumentRequiresAdverbs(payload)
      || Array.isArray(data.example?.lex_insertions)
      || ['free_slot_count', 'free_slots', 'insertion_content', 'adverb'].some(key => key in lex)) {
      required.add('lex');
    }
    if (opnDocumentRequiresAdverbs(payload)
      || 'insertion_interval' in log
      || (Array.isArray(log.sequence) && log.sequence.some(item => item?.kind === 'minor'))) {
      required.add('log');
    }
    if (Array.isArray(synt.insertions) && synt.insertions.length) required.add('synt');
    return [...required];
  }

  function applyOpnDocument(payload, filename = '') {
    const missingAxes = missingInsertionAxes(opnDocumentRequiredInsertionAxes(payload));
    if (missingAxes.length) throw new Error(insertionRequirementMessage(missingAxes, 'OPN'));
    if (!featureEnabled('adverbs') && opnDocumentRequiresAdverbs(payload)) {
      throw new Error(isEnglish()
        ? 'This OPN document requires the disabled Adverbs application. Enable it in Config · Applications first.'
        : 'Dit OPN-document vereist de uitgeschakelde toepassing Bijwoorden. Schakel die eerst in via Config · Toepassingen.');
    }
    if (payload?.data?.composition?.schema === 'ogn-multi-composition-v1') {
      applyImportedMultiOgn(payload, filename);
      return;
    }
    state.placementMode = 'language-tree';
    state.logInsertionInterval = 'auto';
    const data = payload.data || {};
    const notation = data.notation || {};
    const projections = data.projections || {};
    const lex = projections.lex || {};
    const log = projections.log || {};
    const paradata = payload.paradata || {};
    const workspace = paradata.workspace || {};
    const display = workspace.display || {};

    const importedExample = importedExampleFromData(data.example);
    if (importedExample) {
      if (lex.adverb && typeof lex.adverb === 'object') importedExample.adverb = jsonClone(lex.adverb, null);
      installImportedExample(importedExample);
    }
    state.selectedAdverbId = 'none';
    // Herstel voorbeeldgebonden externe LEX-insertiegroepen na round-trip.
    // Zonder deze stap zouden lex_insertions wel in het document staan, maar
    // na import als generieke lege slots verschijnen.
    applyExampleAdverbDefaults();

    // Een OPN-document zonder paradata opent in de vaste standaardworkspace.
    state.centerMode = 'syntax';
    state.projection = 'axes';
    setSourceAxes(SOURCE_AXIS_IDS, { activateSource: false });
    state.growthEnabled = false;
    state.growthStep = 0;
    state.manualViewBox = null;

    if (notation.tree_choice && TREE_CHOICES.some(choice => choice.id === notation.tree_choice)) state.treeChoice = notation.tree_choice;
    if (notation.functional_order === 'left-first' || notation.functional_order === 'right-first') state.functionalOrder = notation.functional_order;
    if (notation.branch_order && BRANCH_ORDERS.some(order => order.id === notation.branch_order)) state.branchOrder = notation.branch_order;
    if (notation.branch_overrides && typeof notation.branch_overrides === 'object') {
      for (const key of ['top', 'middle', 'other']) {
        if (['auto', 'normal', 'flip'].includes(notation.branch_overrides[key])) state.branchOverrides[key] = notation.branch_overrides[key];
      }
    }
    state.roleSwap = !!notation.role_swap;
    if (Number.isFinite(Number(notation.free_slot_count))) state.freeSlotCount = Math.max(0, Math.min(6, Number(notation.free_slot_count)));
    // Oude additional_open_slot_* velden blijven importeerbaar, maar hebben
    // geen runtime-effect zolang de plaatsingswijzen zijn uitgesteld.

    if (featureEnabled('adverbs')) {
      if (Number.isFinite(Number(lex.free_slot_count))) state.lexFreeSlotCount = Math.max(0, Math.min(8, Number(lex.free_slot_count)));
      if (lex.free_slot_placement) state.lexFreeSlotPlacement = validLexSlotPlacement(lex.free_slot_placement);
      if (lex.insertion_content) state.lexInsertionContent = validLexInsertionContent(lex.insertion_content);
      if (Array.isArray(lex.insertion_extension_targets)) state.lexInsertionExtensionTargets = validLexInsertionTargets(lex.insertion_extension_targets);
    }
    if (log.order && SOUTH_LOGICAL_MODES.includes(log.order)) state.southLogicalMode = log.order;
    if (featureEnabled('adverbs') && log.insertion_interval) state.logInsertionInterval = validLogInsertionInterval(log.insertion_interval);

    state.centerMode = (workspace.central_view === 'ft' || workspace.central_view === 'functional') ? 'ft' : 'syntax';
    if (PROJECTION_OPTIONS.some(option => option.id === workspace.projection_mode)) state.projection = workspace.projection_mode;
    if (Array.isArray(workspace.visible_projections)) setSourceAxes(workspace.visible_projections, { activateSource: false });
    state.growthEnabled = !!workspace.growth?.enabled;
    state.growthStep = clampGrowthStep(workspace.growth?.step || 0);
    if (typeof display.grid === 'boolean') state.showGrid = display.grid;
    if (typeof display.relations === 'boolean') state.showRelations = display.relations;
    if (typeof display.labels === 'boolean') state.showLabels = display.labels;
    if (LAYOUT_DENSITIES.some(option => option.id === display.layout_density)) state.layoutDensity = display.layout_density;
    if (VIEW_FIT_MODES.some(option => option.id === display.view_fit)) state.viewFitMode = display.view_fit;
    state.manualViewBox = validStoredViewBox(workspace.manual_viewbox);

    state.documentMetadata = jsonClone(payload.metadata, null) || defaultDocumentMetadata();
    state.paradataEvents = Array.isArray(paradata.events) ? jsonClone(paradata.events, []).slice(-PARADATA_EVENT_LIMIT) : [];
    state.paradataSessionId = globalThis.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    state.paradataStartedAt = new Date().toISOString();
    recordParadata('open-opn', { filename, opn_version: payload.opn_version || null });
  }

  function loadJsonFile(fileInput) {
    const file = fileInput?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || '{}'));
        const isOpn = payload?.document_type === OPN_DOCUMENT_TYPE || (payload?.data && payload?.metadata && payload?.opn_version);
        if (isOpn) applyOpnDocument(payload, file.name || '');
        else applyLegacyPayload(payload);
        setMobileSheet(false);
        render();
        if (els.actionFeedback) {
          els.actionFeedback.textContent = isOpn ? 'OPN-document geladen.' : 'Oud JSON-bestand geladen en gemigreerd.';
          els.actionFeedback.className = 'action-feedback neutral';
        }
      } catch (error) {
        if (els.actionFeedback) els.actionFeedback.textContent = `OPN/JSON laden mislukt: ${error.message || error}`;
      } finally {
        fileInput.value = '';
      }
    };
    reader.onerror = () => {
      if (els.actionFeedback) els.actionFeedback.textContent = 'OPN/JSON laden mislukt: bestand kon niet worden gelezen.';
      fileInput.value = '';
    };
    reader.readAsText(file);
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
        if (!event.target?.closest?.('[data-action],[data-node-config]')) {
          state.viewDrag = null;
          state.activePointers.clear();
          event.preventDefault();
        }
        return;
      }
      if (event.button !== undefined && event.button !== 0) return;
      if (event.target?.closest?.('input,select,button,a,label,[data-action],[data-node-config]')) return;
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
    recordParadata('set-log-order', { from: current, to: state.southLogicalMode, marked: SOUTH_LOGICAL_MOVEMENT_REQUIRED_MODES.has(state.southLogicalMode) });
    render();
  }

  function toggleSouthLogicalFlip() {
    cycleSouthLogicalMode(1);
  }

  function resetForNewExample() {
    stopGrowthPlayback();
    state.growthEnabled = false;
    state.growthStep = 0;
    state.projectionBlockUnlocked = false;
    state.southLogicalMode = 'SOV';
    state.logInsertionInterval = 'auto';
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

  const CONFIG_TAB_DEFINITIONS = [
    { id: 'general-ui', nl: 'Interface & weergave', en: 'Interface & display' },
    { id: 'preconfig', nl: 'Voorconfig', en: 'Pre-config' },
    { id: 'features', nl: 'Uitbreidingen', en: 'Extensions' },
    { id: 'multi-ogn', nl: 'Anafoor · multi-OGN', en: 'Anaphor · multi-OGN' },
    { id: 'direct', nl: 'Direct · gedeeld', en: 'Direct · shared' },
    { id: 'readme-carousels', nl: 'LEESMIJ-items', en: 'README topics' },
    { id: 'overview', nl: 'Overzicht', en: 'Overview' },
    { id: 'jan', nl: 'JaN · TODO', en: 'JaN · TODO' },
    { id: 'files', nl: 'Bestanden & export', en: 'Files & export' },
    { id: 'view', nl: 'Boom & projecties', en: 'Tree & projections' },
    { id: 'log-lex', nl: 'LOG & LEX', en: 'LOG & LEX' },
    { id: 'examples', nl: 'Voorbeelden', en: 'Examples' },
    { id: 'advanced', nl: 'Compatibiliteit', en: 'Compatibility' }
  ];
  const CONFIG_SCOPE_DEFINITIONS = Object.freeze([
    Object.freeze({ id: 'general', groupNl: 'Algemeen', groupEn: 'General', nl: 'Algemeen', en: 'General' }),
    Object.freeze({ id: 'language-tree', groupNl: 'Calculated', groupEn: 'Calculated', nl: 'Language Tree', en: 'Language Tree' }),
    Object.freeze({ id: 'multi-ogn-anaphor', groupNl: 'Calculated', groupEn: 'Calculated', nl: 'Anafoor · multi-OGN', en: 'Anaphor · multi-OGN' }),
    Object.freeze({ id: 'direct-shared', groupNl: 'Direct', groupEn: 'Direct', nl: 'Gedeeld', en: 'Shared' }),
    Object.freeze({ id: 'greedy-grow', groupNl: 'Direct', groupEn: 'Direct', nl: 'Greedy Grow', en: 'Greedy Grow' }),
    Object.freeze({ id: 'random', groupNl: 'Direct', groupEn: 'Direct', nl: 'Random', en: 'Random' })
  ]);
  const CONFIG_SCOPE_TABS = Object.freeze({
    general: Object.freeze(['general-ui', 'readme-carousels', 'overview', 'files']),
    'language-tree': Object.freeze(['preconfig', 'features', 'view', 'log-lex', 'examples', 'jan', 'advanced']),
    'multi-ogn-anaphor': Object.freeze(['multi-ogn']),
    'direct-shared': Object.freeze(['direct']),
    'greedy-grow': Object.freeze(['direct']),
    random: Object.freeze(['direct'])
  });
  let activeConfigTab = 'general-ui';
  let activeConfigScope = 'general';
  let configScopeManual = false;
  let activeDirectConfigMenu = 'general';
  let configMethodScope = '';
  let lastFullConfigTab = 'general-ui';
  let lastFullConfigScope = 'general';
  let readmeCarouselEditorTopicId = 'readme';
  let readmeCarouselEditorSlideIndex = 0;
  let readmeCarouselDefaultsCaptured = false;
  let readmeTopicDefaultsCaptured = false;
  let readmePendingSlideFile = null;
  const projectConfigStatus = {
    defaultLoaded: false,
    userLoaded: false,
    browserLoaded: false,
    messageNl: '',
    messageEn: ''
  };

  function directMethodConfigScope() {
    const mode = validPlacementMode(state.placementMode);
    return mode === 'greedy-grow' || mode === 'random' ? mode : '';
  }

  function syncConfigMethodScope() {
    if (configScopeManual && document.body?.classList.contains('config-screen-active')) {
      syncConfigScopeUi();
      return;
    }
    const nextScope = directMethodConfigScope();
    if (nextScope && !configMethodScope) {
      lastFullConfigTab = activeConfigTab;
      lastFullConfigScope = activeConfigScope;
    }
    if (!nextScope && configMethodScope) {
      activeConfigTab = lastFullConfigTab;
      activeConfigScope = lastFullConfigScope;
    }
    configMethodScope = nextScope;
    if (nextScope) activeConfigScope = nextScope;
    document.body?.classList.toggle('config-direct-method-only', !!nextScope);
    if (nextScope) {
      activeConfigTab = 'direct';
      activeDirectConfigMenu = nextScope;
    } else {
      activeDirectConfigMenu = 'general';
    }
    const tabList = document.querySelector('.config-tab-list');
    if (tabList) tabList.hidden = !!nextScope;
    syncConfigScopeUi();
    const topbar = document.querySelector('.config-topbar');
    if (topbar) {
      const method = placementModeDefinition(nextScope || 'language-tree');
      topbar.setAttribute('aria-label', nextScope
        ? `${method.label} Config`
        : (isEnglish() ? 'Configuration controls' : 'Configuratiescherm bediening'));
    }
  }

  function configTabsForScope(scopeId = activeConfigScope) {
    return CONFIG_SCOPE_TABS[scopeId] || CONFIG_SCOPE_TABS.general;
  }

  function syncConfigScopeUi() {
    const definition = CONFIG_SCOPE_DEFINITIONS.find(scope => scope.id === activeConfigScope) || CONFIG_SCOPE_DEFINITIONS[0];
    if (document.body) document.body.dataset.configScope = activeConfigScope;
    const scopeNav = document.querySelector('.config-scope-nav');
    if (scopeNav) {
      scopeNav.hidden = !!configMethodScope;
      scopeNav.setAttribute('aria-hidden', String(!!configMethodScope));
    }
    document.querySelectorAll('[data-config-scope-button]').forEach(button => {
      const active = button.dataset.configScopeButton === activeConfigScope;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const allowedTabs = new Set(configTabsForScope());
    document.querySelectorAll('[data-config-tab-button]').forEach(button => {
      button.hidden = !allowedTabs.has(button.dataset.configTabButton) || !!configMethodScope;
    });
    const tabList = document.querySelector('.config-tab-list');
    if (tabList) tabList.hidden = !!configMethodScope;
    const topbar = document.querySelector('.config-topbar');
    if (topbar) {
      const scopeLabel = isEnglish() ? definition.en : definition.nl;
      const groupLabel = isEnglish() ? definition.groupEn : definition.groupNl;
      topbar.setAttribute('aria-label', `${groupLabel} · ${scopeLabel} Config`);
    }
  }

  function activateConfigScope(scopeId = 'general', focusScope = false, manual = true) {
    const validScope = CONFIG_SCOPE_DEFINITIONS.some(scope => scope.id === scopeId) ? scopeId : 'general';
    configScopeManual = !!manual;
    if (!['greedy-grow', 'random'].includes(validScope)) {
      lastFullConfigScope = validScope;
      configMethodScope = '';
      document.body?.classList.remove('config-direct-method-only');
    } else {
      if (!configMethodScope) {
        lastFullConfigTab = activeConfigTab;
        lastFullConfigScope = activeConfigScope;
      }
      configMethodScope = validScope;
      document.body?.classList.add('config-direct-method-only');
    }
    activeConfigScope = validScope;
    activeDirectConfigMenu = validScope === 'greedy-grow' || validScope === 'random' ? validScope : 'general';
    syncConfigScopeUi();
    const allowed = configTabsForScope(validScope);
    const requested = allowed.includes(activeConfigTab) ? activeConfigTab : allowed[0];
    activateConfigTab(requested);
    if (focusScope) document.querySelector(`[data-config-scope-button="${validScope}"]`)?.focus?.();
  }

  function activateDirectConfigMenu(methodId = 'general') {
    const validIds = ['general', 'greedy-grow', 'random'];
    const forcedMethod = configMethodScope || '';
    const validId = forcedMethod || (validIds.includes(methodId) ? methodId : 'general');
    activeDirectConfigMenu = validId;
    document.querySelectorAll('[data-direct-config-panel]').forEach(panel => {
      const active = panel.dataset.directConfigPanel === validId;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
    syncDirectConfigControls();
  }

  function syncDirectConfigControls() {
    const general = normalizeDirectPlacementGeneral(state.directPlacementGeneral);
    const greedy = normalizeGreedyGrowConfig(state.greedyGrowConfig);
    const random = normalizeRandomPlacementConfig(state.randomPlacementConfig);
    const setChecked = (id, value) => { const input = document.getElementById(id); if (input) input.checked = !!value; };
    setChecked('directShowPathInput', general.showPath);
    setChecked('directShowNumbersInput', general.showNumbers);
    setChecked('directShowMetricsInput', general.showMetrics);
    fillSelect(document.getElementById('directTargetCountSelect'), DIRECT_TARGET_COUNT_OPTIONS, String(general.targetCount));
    fillSelect(document.getElementById('directIntervalSelect'), DIRECT_INTERVAL_OPTIONS, String(general.intervalMs));
    fillSelect(document.getElementById('directNodeSizeSelect'), DIRECT_NODE_SIZE_OPTIONS, general.nodeSize);
    fillSelect(document.getElementById('directGridMarginSelect'), DIRECT_GRID_MARGIN_OPTIONS, general.gridMargin);
    fillSelect(document.getElementById('greedyStrategySelect'), GREEDY_STRATEGY_OPTIONS, greedy.strategy);
    fillSelect(document.getElementById('greedyOrientationSelect'), GREEDY_ORIENTATION_OPTIONS, greedy.orientation);
    fillSelect(document.getElementById('randomSeedPolicySelect'), RANDOM_SEED_POLICY_OPTIONS, random.seedPolicy);
    fillSelect(document.getElementById('randomDistributionSelect'), RANDOM_DISTRIBUTION_OPTIONS, random.distribution);
    fillSelect(document.getElementById('randomSpreadSelect'), RANDOM_SPREAD_OPTIONS, random.spread);
    fillSelect(document.getElementById('randomMaxDimensionsSelect'), RANDOM_MAX_DIMENSION_OPTIONS, random.maxDimensions);
    fillSelect(document.getElementById('randomSpeedSelect'), DIRECT_INTERVAL_OPTIONS, String(general.intervalMs));
    fillSelect(document.getElementById('randomIterationCountSelect'), RANDOM_ITERATION_COUNT_OPTIONS, String(random.iterationCount));
    fillSelect(document.getElementById('randomAxisImageModeSelect'), RANDOM_AXIS_IMAGE_MODE_OPTIONS, random.axisImageMode);
    const seedInput = document.getElementById('randomSeedInput');
    if (seedInput && document.activeElement !== seedInput) seedInput.value = String(random.seed);
    const fixedColumnsInput = document.getElementById('randomFixedColumnsInput');
    const fixedRowsInput = document.getElementById('randomFixedRowsInput');
    if (fixedColumnsInput && document.activeElement !== fixedColumnsInput) {
      fixedColumnsInput.value = String(random.fixedColumns);
      fixedColumnsInput.min = String(general.targetCount);
    }
    if (fixedRowsInput && document.activeElement !== fixedRowsInput) {
      fixedRowsInput.value = String(random.fixedRows);
      fixedRowsInput.min = String(general.targetCount);
    }
    const fixedGridFields = document.getElementById('randomFixedGridFields');
    if (fixedGridFields) fixedGridFields.hidden = random.maxDimensions !== 'fixed';
  }

  function resetDirectStateForConfig(methodId) {
    if (validPlacementMode(state.placementMode) !== methodId) return;
    stopDirectPlacementPlayback();
    if (methodId === 'random') resetRandomIterationSeries();
    state.directPlacementState = null;
    ensureDirectPlacementState(true);
    resetManualViewBox();
    render();
  }

  function activateConfigTab(tabId = 'general-ui', focusTab = false) {
    const requestedId = configMethodScope ? 'direct' : tabId;
    const allowedTabs = configTabsForScope();
    const validId = CONFIG_TAB_DEFINITIONS.some(tab => tab.id === requestedId) && allowedTabs.includes(requestedId)
      ? requestedId
      : allowedTabs[0];
    activeConfigTab = validId;
    document.querySelectorAll('[data-config-tab-button]').forEach(button => {
      const active = button.dataset.configTabButton === validId;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focusTab) button.focus();
    });
    document.querySelectorAll('[data-config-tab-panel]').forEach(panel => {
      const active = panel.dataset.configTabPanel === validId;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
    if (validId === 'readme-carousels') syncReadmeCarouselEditorTopics();
    if (validId === 'direct') activateDirectConfigMenu(configMethodScope || 'general');
    syncConfigScopeUi();
  }

  function setupConfigTabs() {
    const sidePanel = document.querySelector('.side-panel');
    if (!sidePanel || sidePanel.dataset.configTabsReady === '1') return;

    const treeCard = sidePanel.querySelector(':scope > .panel-card:first-child');
    const opnCard = sidePanel.querySelector(':scope > .opn-document-card');
    const graphExportCard = sidePanel.querySelector(':scope > .graph-export-card');
    const examplesCard = sidePanel.querySelector(':scope > .examples-config-card');
    const lexCard = sidePanel.querySelector(':scope > .lex-card');
    const relationCard = sidePanel.querySelector(':scope > .relation-card');
    if (!treeCard || !opnCard || !graphExportCard || !examplesCard || !lexCard || !relationCard) return;

    treeCard.dataset.configCard = 'tree';
    lexCard.dataset.configCard = 'lex';
    relationCard.dataset.configCard = 'relations';
    opnCard.dataset.configCard = 'opn';
    graphExportCard.dataset.configCard = 'graph-export';
    examplesCard.dataset.configCard = 'examples';

    const tabList = document.createElement('nav');
    tabList.className = 'config-tab-list';
    tabList.setAttribute('role', 'tablist');
    tabList.setAttribute('aria-label', 'Config-onderdelen');

    const scopeNav = document.createElement('nav');
    scopeNav.className = 'config-scope-nav';
    scopeNav.setAttribute('aria-label', 'Config: algemeen of per toepassing');
    const scopeGroups = [
      { id: 'general', nl: 'Algemeen', en: 'General', scopes: ['general'] },
      { id: 'calculated', nl: 'Calculated', en: 'Calculated', scopes: ['language-tree', 'multi-ogn-anaphor'] },
      { id: 'direct', nl: 'Direct', en: 'Direct', scopes: ['direct-shared', 'greedy-grow', 'random'] }
    ];
    scopeGroups.forEach(group => {
      const wrapper = document.createElement('div');
      wrapper.className = 'config-scope-group';
      wrapper.dataset.configScopeGroup = group.id;
      const label = document.createElement('strong');
      label.className = 'config-scope-group-label';
      label.dataset.labelNl = group.nl;
      label.dataset.labelEn = group.en;
      label.textContent = group.nl;
      wrapper.appendChild(label);
      group.scopes.forEach(scopeId => {
        const definition = CONFIG_SCOPE_DEFINITIONS.find(scope => scope.id === scopeId);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'config-scope-button';
        button.dataset.configScopeButton = scopeId;
        button.dataset.labelNl = definition.nl;
        button.dataset.labelEn = definition.en;
        button.textContent = definition.nl;
        button.addEventListener('click', () => activateConfigScope(scopeId));
        wrapper.appendChild(button);
      });
      scopeNav.appendChild(wrapper);
    });

    const panels = new Map();
    CONFIG_TAB_DEFINITIONS.forEach(tab => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'config-tab-button';
      button.dataset.configTabButton = tab.id;
      button.dataset.labelNl = tab.nl;
      button.dataset.labelEn = tab.en;
      button.id = `config-tab-${tab.id}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', `config-panel-${tab.id}`);
      button.addEventListener('click', () => activateConfigTab(tab.id));
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const current = CONFIG_TAB_DEFINITIONS.findIndex(item => item.id === activeConfigTab);
        const next = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? CONFIG_TAB_DEFINITIONS.length - 1
            : (current + (event.key === 'ArrowRight' ? 1 : -1) + CONFIG_TAB_DEFINITIONS.length) % CONFIG_TAB_DEFINITIONS.length;
        activateConfigTab(CONFIG_TAB_DEFINITIONS[next].id, true);
        event.preventDefault();
      });
      tabList.appendChild(button);

      const panel = document.createElement('section');
      panel.className = 'config-tab-panel';
      panel.dataset.configTabPanel = tab.id;
      panel.id = `config-panel-${tab.id}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', button.id);
      panels.set(tab.id, panel);
    });

    const maxCallout = document.createElement('div');
    maxCallout.className = 'config-max-callout';
    maxCallout.innerHTML = '<strong class="config-max-badge">MAX</strong><span data-config-max-text></span>';

    const generalUiCard = document.createElement('section');
    generalUiCard.className = 'panel-card config-general-ui-card';
    generalUiCard.dataset.configCard = 'general-ui';
    generalUiCard.innerHTML = `
      <div class="help-lang-nl">
        <h2>Algemeen · interface en weergave</h2>
        <p class="inline-help">Alleen instellingen die buiten één toepassing staan. Hier staat niets van Language Tree, Anafoor · multi-OGN, Greedy Grow of Random.</p>
      </div>
      <div class="help-lang-en">
        <h2>General · interface and display</h2>
        <p class="inline-help">Only settings that are independent of a single application. Nothing from Language Tree, Anaphor · multi-OGN, Greedy Grow or Random is shown here.</p>
      </div>`;
    const generalViewGrid = document.createElement('div');
    generalViewGrid.className = 'config-primary-view-grid config-general-view-grid';
    generalViewGrid.setAttribute('aria-label', 'Algemene interface-instellingen');

    const primaryViewGrid = document.createElement('div');
    primaryViewGrid.className = 'config-primary-view-grid';
    primaryViewGrid.setAttribute('aria-label', 'Language Tree-beeldinstellingen');
    const helpLayoutLabel = document.createElement('label');
    helpLayoutLabel.className = 'select-field';
    helpLayoutLabel.innerHTML = `<span><span class="help-lang-nl">LEESMIJ-indeling</span><span class="help-lang-en">README layout</span></span><select id="helpLayoutModeSelect"><option value="auto">Automatic</option><option value="stacked">List above text</option><option value="side">List left, text right</option></select><small class="config-item-help"><span class="help-lang-nl">Automatisch gebruikt links-rechts alleen op mobiel liggend; elders staat de lijst boven de tekst.</span><span class="help-lang-en">Automatic uses side-by-side only on mobile landscape; elsewhere the list is above the text.</span></small>`;
    [els.layoutDensitySelect, els.freeSlotCountSelect].forEach(select => {
      const label = select?.closest?.('label');
      if (label) primaryViewGrid.appendChild(label);
    });
    const viewFitLabel = els.viewFitSelect?.closest?.('label');
    if (viewFitLabel) generalViewGrid.appendChild(viewFitLabel);
    generalViewGrid.appendChild(helpLayoutLabel);
    generalUiCard.appendChild(generalViewGrid);
    const lineStyleField = treeCard.querySelector('.line-style-field');
    if (lineStyleField) generalUiCard.appendChild(lineStyleField);
    const generalDisplayChecks = document.createElement('div');
    generalDisplayChecks.className = 'check-grid config-general-display-checks';
    const showGridLabel = treeCard.querySelector('#showGridInput')?.closest?.('label');
    if (showGridLabel) generalDisplayChecks.appendChild(showGridLabel);
    if (generalDisplayChecks.children.length) generalUiCard.appendChild(generalDisplayChecks);
    const helpLayoutSelect = helpLayoutLabel.querySelector('select');
    helpLayoutSelect.value = state.helpLayoutMode;
    helpLayoutSelect.addEventListener('change', event => {
      state.helpLayoutMode = ['auto','stacked','side'].includes(event.target.value) ? event.target.value : 'auto';
      try { localStorage.setItem('opengraph_help_layout_mode', state.helpLayoutMode); } catch (_err) {}
      applyHelpLayoutMode();
      appendConfigLog('change-help-layout', { helpLayoutMode: state.helpLayoutMode });
      markConfigDirty('LEESMIJ-indeling');
    });

    const treeHeading = treeCard.querySelector(':scope > h2');
    treeHeading?.insertAdjacentElement('afterend', maxCallout);
    maxCallout.insertAdjacentElement('afterend', primaryViewGrid);

    const logSettingsCard = document.createElement('section');
    logSettingsCard.className = 'panel-card config-log-settings-card';
    logSettingsCard.dataset.configCard = 'log-settings';
    const logSettingsHeading = document.createElement('h2');
    logSettingsCard.appendChild(logSettingsHeading);
    const adverbField = treeCard.querySelector('.lex-adverb-insert-field');
    if (adverbField) logSettingsCard.appendChild(adverbField);

    const advancedCard = document.createElement('section');
    advancedCard.className = 'panel-card config-advanced-card';
    advancedCard.dataset.configCard = 'advanced';
    const advancedHeading = document.createElement('h2');
    advancedCard.appendChild(advancedHeading);
    ['.lex-extension-field'].forEach(selector => {
      const field = treeCard.querySelector(selector);
      if (field) advancedCard.appendChild(field);
    });

    const saveCard = document.createElement('section');
    saveCard.className = 'panel-card config-file-settings-card config-global-save-card';
    saveCard.dataset.configCard = 'save';
    const saveField = treeCard.querySelector('.config-save-field');
    if (saveField) saveCard.appendChild(saveField);
    const saveSlot = document.createElement('div');
    saveSlot.className = 'config-global-save-slot';
    saveSlot.appendChild(saveCard);

    const oldViewGrid = treeCard.querySelector('.view-config-grid');
    if (oldViewGrid && !oldViewGrid.children.length) oldViewGrid.remove();

    const overviewCard = document.createElement('section');
    overviewCard.className = 'panel-card config-overview-dashboard';
    overviewCard.id = 'config-overview';
    overviewCard.innerHTML = `<h2><span class="help-lang-nl">Config-overzicht</span><span class="help-lang-en">Configuration overview</span></h2>
      <p class="inline-help"><span class="help-lang-nl">Dit overzicht bevat uitsluitend algemene onderdelen. Kies Language Tree, Anafoor · multi-OGN of Direct in de balk erboven voor een toepassing.</span><span class="help-lang-en">This overview contains only general sections. Choose Language Tree, Anaphor · multi-OGN or Direct in the bar above for an application.</span></p>
      <div class="config-dashboard">
        <button type="button" data-config-scope="general" data-config-jump="general-ui"><strong>Algemeen · Interface & weergave</strong><span>Toepassingsonafhankelijke interface, raster en presentatie.</span></button>
        <button type="button" data-config-scope="general" data-config-jump="readme-carousels"><strong>Algemeen · LEESMIJ-items</strong><span>Tonen, tekst, beelden en onderschriften per item.</span></button>
        <button type="button" data-config-scope="general" data-config-jump="files"><strong>Algemeen · Bestanden</strong><span>Projectconfig, OPN en algemene export.</span></button>
      </div>`;
    overviewCard.querySelectorAll('[data-config-jump]').forEach(button => button.addEventListener('click', () => {
      activateConfigScope(button.dataset.configScope || 'general');
      activateConfigTab(button.dataset.configJump);
    }));

    const directConfigCard = document.createElement('section');
    directConfigCard.className = 'panel-card direct-config-card';
    directConfigCard.id = 'config-direct-placement';
    directConfigCard.innerHTML = `
      <section id="direct-config-panel-general" class="direct-config-method-panel" role="group" aria-label="Algemene directe Config" data-direct-config-panel="general">
        <div class="direct-config-choice-grid">
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Knopen per run</span><span class="help-lang-en">Nodes per run</span></span><select id="directTargetCountSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Bepaalt hoeveel knopen één complete Greedy- of Random-run schrijft; het verandert niet het aantal iteraties.</span><span class="help-lang-en">Sets how many nodes one complete Greedy or Random run writes; it does not change the iteration count.</span></small></details></div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Play-snelheid</span><span class="help-lang-en">Play speed</span></span><select id="directIntervalSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Wachttijd tussen zichtbare stappen. Snelheid verandert nooit de gekozen knoopposities.</span><span class="help-lang-en">Delay between visible steps. Speed never changes the selected node positions.</span></small></details></div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Knoopgrootte</span><span class="help-lang-en">Node size</span></span><select id="directNodeSizeSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Alleen de zichtbare cirkelmaat; gridcoördinaten en plaatsingskeuze blijven gelijk.</span><span class="help-lang-en">Only the visible circle size; grid coordinates and placement choices remain unchanged.</span></small></details></div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Rastermarge</span><span class="help-lang-en">Grid margin</span></span><select id="directGridMarginSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Extra zichtbare rasterruimte rond het gebruikte veld; dit maakt geen nieuwe plaatsingsplekken.</span><span class="help-lang-en">Extra visible grid space around the used field; it does not create new placement positions.</span></small></details></div>
        </div>
        <div class="direct-config-choice-grid direct-config-toggle-grid">
          <div class="direct-config-toggle-field"><label><input id="directShowPathInput" type="checkbox"/> <span class="help-lang-nl">Groeipad tonen</span><span class="help-lang-en">Show growth path</span></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Verbindt alleen reeds geschreven knopen in schrijfvolgorde; er wordt geen toekomstig pad berekend.</span><span class="help-lang-en">Connects only nodes already written in write order; no future path is calculated.</span></small></details></div>
          <div class="direct-config-toggle-field"><label><input id="directShowNumbersInput" type="checkbox"/> <span class="help-lang-nl">Knoopnummers tonen</span><span class="help-lang-en">Show node numbers</span></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Toont de schrijfindex in de knoop; plaatsing en volgorde veranderen niet.</span><span class="help-lang-en">Shows the write index inside the node; placement and order do not change.</span></small></details></div>
          <div class="direct-config-toggle-field"><label><input id="directShowMetricsInput" type="checkbox"/> <span class="help-lang-nl">Veldmaten en omtrek tonen</span><span class="help-lang-en">Show field size and perimeter</span></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Toont diagnostische maten van het actuele veld; dit is geen bewijs van een wereldwijd optimale omtrek.</span><span class="help-lang-en">Shows diagnostic measurements of the current field; this is not proof of a globally optimal perimeter.</span></small></details></div>
        </div>
        <p class="config-item-help"><span class="help-lang-nl">Deze instellingen gelden gelijk voor Greedy Grow en Random. Eén Random-iteratie gebruikt het hier gekozen aantal knopen.</span><span class="help-lang-en">These settings apply equally to Greedy Grow and Random. One Random iteration uses the node count selected here.</span></p>
        <div class="direct-config-actions"><button id="resetDirectGeneralConfigButton" type="button"><span class="help-lang-nl">Herstel algemene standaard</span><span class="help-lang-en">Restore general defaults</span></button></div>
      </section>
      <section id="direct-config-panel-greedy" class="direct-config-method-panel" role="group" aria-label="Greedy Grow Config" data-direct-config-panel="greedy-grow" hidden>
        <div class="direct-config-choice-grid">
          <div class="direct-config-field direct-config-wide"><label class="select-field"><span><span class="help-lang-nl">Zoekstrategie</span><span class="help-lang-en">Search strategy</span></span><select id="greedyStrategySelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Bepaalt in welke volgorde vrije kandidaten worden onderzocht. De eerste geldige kandidaat wordt direct geschreven.</span><span class="help-lang-en">Sets the order in which free candidates are examined. The first valid candidate is written immediately.</span></small></details></div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Oriëntatie</span><span class="help-lang-en">Orientation</span></span><select id="greedyOrientationSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Draait het complete resultaat voor weergave; de groeivolgorde zelf blijft gelijk.</span><span class="help-lang-en">Rotates the complete result for display; the growth order itself stays unchanged.</span></small></details></div>
        </div>
      </section>
      <section id="direct-config-panel-random" class="direct-config-method-panel" role="group" aria-label="Random Config" data-direct-config-panel="random" hidden>
        <div class="direct-config-choice-grid">
          <div class="direct-config-field"><label class="select-field"><span>Seed</span><input id="randomSeedInput" type="number" min="1" max="4294967295" step="1" inputmode="numeric"/></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Startcode voor reproduceerbare Random. <code>20260802</code> is alleen de herkenbare datum 2 augustus 2026; een groter getal geeft niet meer toeval en maakt Play niet sneller. Dezelfde seed, versie, instellingen en gridgrootte geven dezelfde reeks.</span><span class="help-lang-en">Starting code for reproducible Random. <code>20260802</code> is merely the memorable date 2 August 2026; a larger number is not more random and does not make Play faster. The same seed, version, settings and grid size produce the same sequence.</span></small></details></div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Resetbeleid</span><span class="help-lang-en">Reset policy</span></span><select id="randomSeedPolicySelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl"><em>Vaste seed</em> herhaalt dezelfde iteratieset. <em>Nieuwe seed</em> schuift bij Reset reproduceerbaar naar een andere startcode.</span><span class="help-lang-en"><em>Fixed seed</em> repeats the same iteration set. <em>New seed</em> advances reproducibly to another starting code on Reset.</span></small></details></div>
          <div class="direct-config-field direct-config-wide"><label class="select-field"><span><span class="help-lang-nl">Random-model</span><span class="help-lang-en">Random model</span></span><select id="randomDistributionSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl"><em>Uniform v1.0</em> geeft iedere vrije coördinaat dezelfde kans. <em>Onzuiver uniform v0.1</em> mengt 20% voorkeur voor asplekken die in voltooide eerdere rondes vaker zijn geraakt; ronde 1 is nog uniform.</span><span class="help-lang-en"><em>Uniform v1.0</em> gives every free coordinate the same chance. <em>Impure uniform v0.1</em> mixes in a 20% preference for axis positions hit more often in completed earlier rounds; round 1 is still uniform.</span></small></details></div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Plaatsing</span><span class="help-lang-en">Placement</span></span><select id="randomSpreadSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl"><em>Ergens</em> gebruikt de hele beschikbare rechthoek. Compact, Gebalanceerd en Ruim beperken of vergroten de actuele zoekzone.</span><span class="help-lang-en"><em>Anywhere</em> uses the full available rectangle. Compact, Balanced and Wide restrict or enlarge the current search zone.</span></small></details></div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Gridgrootte</span><span class="help-lang-en">Grid size</span></span><select id="randomMaxDimensionsSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl"><em>Interface</em> volgt de beschikbare beeldverhouding, <em>Vast grid</em> gebruikt opgegeven kolommen en rijen, en <em>Inhoud</em> laat het veld meegroeien. Dit verandert de speelruimte, niet het aantal knopen.</span><span class="help-lang-en"><em>Interface</em> follows the available aspect ratio, <em>Fixed grid</em> uses configured columns and rows, and <em>Content</em> lets the field grow. This changes the available area, not the node count.</span></small></details></div>
          <div id="randomFixedGridFields" class="random-fixed-grid-fields" hidden>
            <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Vaste kolommen</span><span class="help-lang-en">Fixed columns</span></span><input id="randomFixedColumnsInput" type="number" min="1" max="10000" step="1" inputmode="numeric"/></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Aantal verticale gridlijnen. Minder dan het aantal knopen wordt automatisch verhoogd tot dat minimum.</span><span class="help-lang-en">Number of vertical grid lines. A value below the node count is automatically raised to that minimum.</span></small></details></div>
            <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Vaste rijen</span><span class="help-lang-en">Fixed rows</span></span><input id="randomFixedRowsInput" type="number" min="1" max="10000" step="1" inputmode="numeric"/></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Aantal horizontale gridlijnen. Minder dan het aantal knopen wordt automatisch verhoogd tot dat minimum.</span><span class="help-lang-en">Number of horizontal grid lines. A value below the node count is automatically raised to that minimum.</span></small></details></div>
          </div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Snelheid</span><span class="help-lang-en">Speed</span></span><select id="randomSpeedSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Milliseconden tussen twee zichtbare knoopplaatsingen. Alleen de animatie verandert; seed en posities blijven gelijk.</span><span class="help-lang-en">Milliseconds between two visible node placements. Only the animation changes; seed and positions remain unchanged.</span></small></details></div>
          <div class="direct-config-field"><label class="select-field"><span><span class="help-lang-nl">Hoe vaak · volledige iteraties</span><span class="help-lang-en">How often · complete iterations</span></span><select id="randomIterationCountSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Aantal complete rondes voor Play, Next/Previous en het opgebouwde asbeeld. Het aantal knopen per ronde staat bij Algemeen.</span><span class="help-lang-en">Number of complete rounds used by Play, Next/Previous and the accumulated axis image. Nodes per round are configured under General.</span></small></details></div>
          <div class="direct-config-field direct-config-wide"><label class="select-field"><span><span class="help-lang-nl">Impact op west- en zuidas</span><span class="help-lang-en">Impact on west and south axes</span></span><select id="randomAxisImageModeSelect"></select></label><details class="config-control-explanation"><summary><span class="help-lang-nl">Uitleg</span><span class="help-lang-en">Explanation</span></summary><small><span class="help-lang-nl">Alleen de weergave van voltooide projectie-hits: uit, bezettingskans of relatief patroon. Deze keuze verandert de Random-plaatsing niet.</span><span class="help-lang-en">Only controls the display of completed projection hits: off, occupancy chance or relative pattern. This choice does not change Random placement.</span></small></details></div>
        </div>
      </section>`;

    const updateGeneral = (key, value, label) => {
      state.directPlacementGeneral = normalizeDirectPlacementGeneral({ ...state.directPlacementGeneral, [key]: value });
      appendConfigLog('change-direct-general', { key, value: state.directPlacementGeneral[key] });
      markConfigDirty(label);
      if (['targetCount', 'intervalMs'].includes(key) && directPlacementActive()) {
        resetDirectStateForConfig(validPlacementMode(state.placementMode));
      } else if (directPlacementActive()) render();
      syncDirectConfigControls();
    };
    directConfigCard.querySelector('#directTargetCountSelect')?.addEventListener('change', event => updateGeneral('targetCount', Number(event.target.value), 'Direct · knopen per run'));
    directConfigCard.querySelector('#directIntervalSelect')?.addEventListener('change', event => updateGeneral('intervalMs', Number(event.target.value), 'Direct · Play-snelheid'));
    directConfigCard.querySelector('#directShowPathInput')?.addEventListener('change', event => updateGeneral('showPath', event.target.checked, 'Direct · groeipad'));
    directConfigCard.querySelector('#directShowNumbersInput')?.addEventListener('change', event => updateGeneral('showNumbers', event.target.checked, 'Direct · knoopnummers'));
    directConfigCard.querySelector('#directShowMetricsInput')?.addEventListener('change', event => updateGeneral('showMetrics', event.target.checked, 'Direct · diagnostiek'));
    directConfigCard.querySelector('#directNodeSizeSelect')?.addEventListener('change', event => updateGeneral('nodeSize', event.target.value, 'Direct · knoopgrootte'));
    directConfigCard.querySelector('#directGridMarginSelect')?.addEventListener('change', event => updateGeneral('gridMargin', event.target.value, 'Direct · rastermarge'));
    const updateGreedy = (key, value, label) => {
      state.greedyGrowConfig = normalizeGreedyGrowConfig({ ...state.greedyGrowConfig, [key]: value });
      appendConfigLog('change-greedy-grow-config', { key, value: state.greedyGrowConfig[key] });
      markConfigDirty(label);
      if (key === 'orientation' && validPlacementMode(state.placementMode) === 'greedy-grow') render();
      else resetDirectStateForConfig('greedy-grow');
      syncDirectConfigControls();
    };
    directConfigCard.querySelector('#greedyStrategySelect')?.addEventListener('change', event => updateGreedy('strategy', event.target.value, 'Greedy Grow · strategie'));
    directConfigCard.querySelector('#greedyOrientationSelect')?.addEventListener('change', event => updateGreedy('orientation', event.target.value, 'Greedy Grow · oriëntatie'));
    const updateRandom = (key, value, label) => {
      state.randomPlacementConfig = normalizeRandomPlacementConfig({ ...state.randomPlacementConfig, [key]: value });
      if (key === 'seed') state.directPlacementSeed = state.randomPlacementConfig.seed;
      appendConfigLog('change-random-placement-config', { key, value: state.randomPlacementConfig[key] });
      markConfigDirty(label);
      if (['seed', 'distribution', 'spread', 'maxDimensions', 'fixedColumns', 'fixedRows', 'iterationCount'].includes(key)) resetDirectStateForConfig('random');
      else if (validPlacementMode(state.placementMode) === 'random') render();
      syncDirectConfigControls();
    };
    directConfigCard.querySelector('#randomSeedInput')?.addEventListener('change', event => updateRandom('seed', Number(event.target.value), 'Random · seed'));
    directConfigCard.querySelector('#randomSeedPolicySelect')?.addEventListener('change', event => updateRandom('seedPolicy', event.target.value, 'Random · resetbeleid'));
    directConfigCard.querySelector('#randomDistributionSelect')?.addEventListener('change', event => updateRandom('distribution', event.target.value, 'Random · model'));
    directConfigCard.querySelector('#randomSpreadSelect')?.addEventListener('change', event => updateRandom('spread', event.target.value, 'Random · plaatsing'));
    directConfigCard.querySelector('#randomMaxDimensionsSelect')?.addEventListener('change', event => updateRandom('maxDimensions', event.target.value, 'Random · gridgrootte'));
    directConfigCard.querySelector('#randomFixedColumnsInput')?.addEventListener('change', event => updateRandom('fixedColumns', Number(event.target.value), 'Random · vaste kolommen'));
    directConfigCard.querySelector('#randomFixedRowsInput')?.addEventListener('change', event => updateRandom('fixedRows', Number(event.target.value), 'Random · vaste rijen'));
    directConfigCard.querySelector('#randomSpeedSelect')?.addEventListener('change', event => updateGeneral('intervalMs', Number(event.target.value), 'Random · snelheid'));
    directConfigCard.querySelector('#randomIterationCountSelect')?.addEventListener('change', event => updateRandom('iterationCount', Number(event.target.value), 'Random · aantal iteraties'));
    directConfigCard.querySelector('#randomAxisImageModeSelect')?.addEventListener('change', event => updateRandom('axisImageMode', event.target.value, 'Random · impact op asbeeld'));
    directConfigCard.querySelector('#resetDirectGeneralConfigButton')?.addEventListener('click', () => {
      state.directPlacementGeneral = { ...DEFAULT_DIRECT_PLACEMENT_GENERAL };
      appendConfigLog('reset-direct-general-config', state.directPlacementGeneral);
      markConfigDirty('Direct · algemene standaard');
      if (directPlacementActive()) resetDirectStateForConfig(validPlacementMode(state.placementMode));
      syncDirectConfigControls();
    });
    syncDirectConfigControls();

    const preconfigCard = document.createElement('section');
    preconfigCard.className = 'panel-card config-preconfig-card';
    preconfigCard.id = 'config-preconfig';
    preconfigCard.innerHTML = `
      <div class="help-lang-nl">
        <h2>Language Tree · voorconfig</h2>
        <p class="inline-help">Deze voorconfig schakelt infrastructuur van Language Tree in, maar voegt zelf nog geen taalinhoud toe. Uitbreidingen van Language Tree gebruiken daarna alleen wat hier gereedstaat.</p>
      </div>
      <div class="help-lang-en">
        <h2>Language Tree · pre-config</h2>
        <p class="inline-help">This pre-config enables Language Tree infrastructure without adding linguistic content. Language Tree extensions then use only what is enabled here.</p>
      </div>
      <fieldset class="preconfig-capability-list">
        <legend><span class="help-lang-nl">Insertie per as</span><span class="help-lang-en">Insertion per axis</span></legend>
        <p class="preconfig-intro help-lang-nl">Elke as staat onafhankelijk aan of uit. Bijwoorden gebruikt de combinatie LEX + LOG; SYNT blijft beschikbaar voor een latere toepassing.</p>
        <p class="preconfig-intro help-lang-en">Each axis is enabled independently. Adverbs uses the LEX + LOG combination; SYNT is available for a future application.</p>
        <div class="preconfig-axis-grid">
          ${Object.values(INSERTION_AXIS_DEFINITIONS).map(axis => `
            <label class="preconfig-axis-choice" for="insertionAxis${axis.label}Input">
              <input data-insertion-axis="${axis.id}" id="insertionAxis${axis.label}Input" type="checkbox"/>
              <span><strong>${axis.label}</strong><small class="help-lang-nl">Insertie op de ${axis.label}-as</small><small class="help-lang-en">Insertion on the ${axis.label} axis</small></span>
            </label>`).join('')}
        </div>
        <div class="preconfig-actions">
          <button id="insertionLexLogPresetButton" type="button"><span class="help-lang-nl">LEX + LOG aan</span><span class="help-lang-en">Enable LEX + LOG</span></button>
          <button id="insertionAllOffButton" type="button"><span class="help-lang-nl">Alle insertie uit</span><span class="help-lang-en">Disable all insertion</span></button>
        </div>
        <div class="preconfig-status" id="preconfigInsertionStatus" role="status"></div>
      </fieldset>
      <section class="preconfig-candidates" aria-labelledby="preconfigCandidatesHeading">
        <h3 id="preconfigCandidatesHeading"><span class="help-lang-nl">Volgende voorconfig-kandidaten</span><span class="help-lang-en">Next pre-config candidates</span></h3>
        <p><span class="help-lang-nl">Ontwerpvoorraad; ook in rc.45 nog niet schakelbaar.</span><span class="help-lang-en">Design backlog; still not switchable in rc.45.</span></p>
        <ul>${PRECONFIG_CANDIDATES.map(candidate => `<li><span class="help-lang-nl">${candidate.label}</span><span class="help-lang-en">${candidate.labelEn}</span></li>`).join('')}</ul>
      </section>`;
    preconfigCard.querySelectorAll('[data-insertion-axis]').forEach(input => {
      input.addEventListener('change', async event => {
        const axisId = event.target.dataset.insertionAxis;
        const enabled = !!event.target.checked;
        event.target.disabled = true;
        await setInsertionAxes([axisId], enabled);
        event.target.disabled = false;
        appendConfigLog('change-insertion-axis', { axis: axisId, enabled });
        markConfigDirty(`${String(axisId || '').toUpperCase()}-insertie`);
      });
    });
    preconfigCard.querySelector('#insertionLexLogPresetButton')?.addEventListener('click', async event => {
      event.currentTarget.disabled = true;
      await setInsertionAxes(['lex', 'log'], true);
      appendConfigLog('enable-insertion-preset', { axes: ['lex', 'log'] });
      markConfigDirty('LEX + LOG-insertie');
    });
    preconfigCard.querySelector('#insertionAllOffButton')?.addEventListener('click', async event => {
      event.currentTarget.disabled = true;
      await setInsertionAxes(Object.keys(INSERTION_AXIS_DEFINITIONS), false);
      appendConfigLog('disable-all-insertion', { axes: Object.keys(INSERTION_AXIS_DEFINITIONS) });
      markConfigDirty(isEnglish() ? 'all insertion disabled' : 'alle insertie uit');
    });

    const featuresCard = document.createElement('section');
    featuresCard.className = 'panel-card config-features-card';
    featuresCard.id = 'config-features';
    featuresCard.innerHTML = `
      <div class="help-lang-nl">
        <h2>Language Tree · basisprofiel en uitbreidingen</h2>
        <p class="inline-help">Het Language-Tree-basisprofiel bevat de gewone taalboom, LEX/SYNT/LOG met S/O/V-majors en voorbeeldzinnen zonder extra inserties. Dit is niet de algemene OGN-kern. Een uitgewerkte uitbreiding wordt pas beschikbaar wanneer haar voorconfig gereed is; een gereserveerde uitbreiding heeft nog geen werking.</p>
      </div>
      <div class="help-lang-en">
        <h2>Language Tree · base profile and extensions</h2>
        <p class="inline-help">The Language Tree base profile contains the ordinary language tree, LEX/SYNT/LOG with S/O/V majors, and samples without extra insertions. It is not the general OGN core. An implemented extension becomes available only after its pre-config is ready; a reserved extension has no behaviour yet.</p>
      </div>
      <div class="feature-profile-status" id="featureProfileStatus" role="status"></div>
      <fieldset class="feature-extra-list">
        <legend><span class="help-lang-nl">Extra’s</span><span class="help-lang-en">Extras</span></legend>
        <label class="feature-extra-choice" for="featureAdverbsInput">
          <input id="featureAdverbsInput" type="checkbox"/>
          <span>
            <strong><span class="help-lang-nl">Bijwoorden</span><span class="help-lang-en">Adverbs</span></strong>
            <small class="help-lang-nl">Voorbeeldzinnen, LOG-minors, directe LEX-inserties, gebruiksprofielen, bediening en documentatie.</small>
            <small class="help-lang-en">Sample sentences, LOG minors, direct LEX insertions, usage profiles, controls, and documentation.</small>
            <small class="feature-requirement-status" id="featureAdverbsRequirementStatus"></small>
          </span>
        </label>
      </fieldset>
      <section class="reserved-applications" aria-labelledby="reservedApplicationsHeading">
        <h3 id="reservedApplicationsHeading"><span class="help-lang-nl">Gereserveerde toepassingen</span><span class="help-lang-en">Reserved applications</span></h3>
        <p><span class="help-lang-nl">De namen en plaats in Config liggen vast. Deze items zijn nog niet schakelbaar en voegen niets toe aan voorbeelden, inserties, documentatie, opslag, export of rendering.</span><span class="help-lang-en">Their names and position in Config are fixed. These items cannot be enabled yet and add nothing to samples, insertions, documentation, storage, export, or rendering.</span></p>
        <div class="reserved-application-list">
          ${RESERVED_APPLICATION_DEFINITIONS.map(application => `
            <label class="feature-extra-choice reserved-application-choice">
              <input aria-disabled="true" data-reserved-application="${application.id}" disabled type="checkbox"/>
              <span>
                <strong><span class="help-lang-nl">${application.label}</span><span class="help-lang-en">${application.labelEn}</span></strong>
                <small class="help-lang-nl">${application.description}${application.example ? ` <code>${application.example}</code>.` : ''}</small>
                <small class="help-lang-en">${application.descriptionEn}${application.example ? ` <code>${application.example}</code>.` : ''}</small>
                <small class="reserved-application-status"><span class="help-lang-nl">Gereserveerd · nog niet actief</span><span class="help-lang-en">Reserved · not active yet</span></small>
              </span>
            </label>`).join('')}
        </div>
      </section>`;
    featuresCard.querySelector('#featureAdverbsInput')?.addEventListener('change', async event => {
      const enabled = !!event.target.checked;
      event.target.disabled = true;
      await setFeatureEnabled('adverbs', enabled);
      event.target.disabled = !featureRequirementsMet('adverbs');
      appendConfigLog('change-feature-adverbs', { enabled });
      markConfigDirty(isEnglish() ? 'Adverbs application' : 'Toepassing Bijwoorden');
    });

    const readmeCarouselCard = document.createElement('section');
    readmeCarouselCard.className = 'panel-card config-readme-carousel-card';
    readmeCarouselCard.id = 'config-readme-carousels';
    readmeCarouselCard.innerHTML = `
      <div class="help-lang-nl">
        <h2>LEESMIJ-items bewerken</h2>
        <p class="inline-help">Bepaal per item of het wordt getoond en pas navigatietitel en inhoud aan. De inhoud gebruikt beperkte, veilige HTML. Daaronder beheer je de eigen carousel. Wijzigingen zijn direct zichtbaar in LEESMIJ en worden bewaard met <strong>Ja · bewaar config</strong>.</p>
      </div>
      <div class="help-lang-en">
        <h2>Edit README topics</h2>
        <p class="inline-help">Choose whether each topic is shown and edit its navigation title and content. Content accepts limited, safe HTML. Manage its carousel below. Changes appear in README immediately and are stored with <strong>Yes · save config</strong>.</p>
      </div>
      <label class="select-field readme-carousel-topic-field" for="readmeCarouselTopicSelect">
        <span><span class="help-lang-nl">LEESMIJ-item</span><span class="help-lang-en">README topic</span></span>
        <select id="readmeCarouselTopicSelect"></select>
      </label>
      <fieldset class="readme-topic-fields">
        <legend><span class="help-lang-nl">Item</span><span class="help-lang-en">Topic</span></legend>
        <label for="readmeTopicVisibilitySelect">
          <span><span class="help-lang-nl">Item tonen</span><span class="help-lang-en">Show topic</span></span>
          <select id="readmeTopicVisibilitySelect">
            <option value="yes">Ja / Yes</option>
            <option value="no">Nee / No</option>
          </select>
        </label>
        <label for="readmeTopicLabelNlInput">
          <span><span class="help-lang-nl">Navigatietitel NL</span><span class="help-lang-en">Navigation title NL</span></span>
          <input id="readmeTopicLabelNlInput" maxlength="180" type="text"/>
        </label>
        <label for="readmeTopicLabelEnInput">
          <span><span class="help-lang-nl">Navigatietitel EN</span><span class="help-lang-en">Navigation title EN</span></span>
          <input id="readmeTopicLabelEnInput" maxlength="180" type="text"/>
        </label>
        <label class="readme-topic-html-field" for="readmeTopicHtmlNlInput">
          <span><span class="help-lang-nl">Itemtekst NL · veilige HTML</span><span class="help-lang-en">Topic content NL · safe HTML</span></span>
          <textarea id="readmeTopicHtmlNlInput" maxlength="${MAX_README_TOPIC_HTML_LENGTH}" rows="9" spellcheck="true"></textarea>
        </label>
        <label class="readme-topic-html-field" for="readmeTopicHtmlEnInput">
          <span><span class="help-lang-nl">Itemtekst EN · veilige HTML</span><span class="help-lang-en">Topic content EN · safe HTML</span></span>
          <textarea id="readmeTopicHtmlEnInput" maxlength="${MAX_README_TOPIC_HTML_LENGTH}" rows="9" spellcheck="true"></textarea>
        </label>
        <small class="readme-topic-html-help"><span class="help-lang-nl">Wijzigingen worden toegepast wanneer je het veld verlaat. Toegestaan: koppen, alinea’s, lijsten, nadruk, code en veilige links. Scripts, formulieren, styles en ingesloten frames worden verwijderd.</span><span class="help-lang-en">Changes apply when you leave the field. Allowed: headings, paragraphs, lists, emphasis, code, and safe links. Scripts, forms, styles, and embedded frames are removed.</span></small>
      </fieldset>
      <h3 class="readme-carousel-editor-heading"><span class="help-lang-nl">Slides van dit item</span><span class="help-lang-en">Slides for this topic</span></h3>
      <div class="readme-carousel-editor-nav">
        <button id="readmeCarouselPrevButton" type="button" aria-label="Vorige slide">←</button>
        <strong id="readmeCarouselSlideCounter" aria-live="polite">0 / 0</strong>
        <button id="readmeCarouselNextButton" type="button" aria-label="Volgende slide">→</button>
      </div>
      <div class="readme-carousel-editor-preview" id="readmeCarouselEditorPreview"></div>
      <fieldset class="readme-carousel-slide-fields">
        <legend><span class="help-lang-nl">Actieve slide</span><span class="help-lang-en">Active slide</span></legend>
        <label for="readmeCarouselImageInput">
          <span><span class="help-lang-nl">Beeldpad of https-URL</span><span class="help-lang-en">Image path or https URL</span></span>
          <input data-readme-carousel-field="src" id="readmeCarouselImageInput" type="text" placeholder="images/readme/voorbeeld.png"/>
        </label>
        <label for="readmeCarouselShapeSelect">
          <span><span class="help-lang-nl">Beeldvorm</span><span class="help-lang-en">Image shape</span></span>
          <select data-readme-carousel-field="shape" id="readmeCarouselShapeSelect">
            <option value="wide">Breed · 16:10</option>
            <option value="narrow">Smal · portret</option>
          </select>
        </label>
        <label for="readmeCarouselAltNlInput">
          <span>Alt-tekst NL</span>
          <input data-readme-carousel-field="altNl" id="readmeCarouselAltNlInput" type="text"/>
        </label>
        <label for="readmeCarouselAltEnInput">
          <span>Alt text EN</span>
          <input data-readme-carousel-field="altEn" id="readmeCarouselAltEnInput" type="text"/>
        </label>
        <label for="readmeCarouselCaptionNlInput">
          <span><span class="help-lang-nl">Onderschrift NL</span><span class="help-lang-en">Caption NL</span></span>
          <input data-readme-carousel-field="captionNl" id="readmeCarouselCaptionNlInput" maxlength="1200" type="text"/>
        </label>
        <label for="readmeCarouselCaptionEnInput">
          <span><span class="help-lang-nl">Onderschrift EN</span><span class="help-lang-en">Caption EN</span></span>
          <input data-readme-carousel-field="captionEn" id="readmeCarouselCaptionEnInput" maxlength="1200" type="text"/>
        </label>
      </fieldset>
      <div class="readme-carousel-editor-actions">
        <button id="readmeCarouselAddButton" type="button"><span class="help-lang-nl">+ Slide</span><span class="help-lang-en">+ Slide</span></button>
        <button id="readmeCarouselRemoveButton" type="button"><span class="help-lang-nl">Verwijder actieve slide</span><span class="help-lang-en">Remove active slide</span></button>
        <button id="readmeCarouselResetButton" type="button"><span class="help-lang-nl">Herstel item · tekst + slides</span><span class="help-lang-en">Reset topic · content + slides</span></button>
      </div>
      <p class="readme-carousel-editor-status" id="readmeCarouselEditorStatus" role="status"></p>`;
    readmeCarouselCard.querySelector('#readmeCarouselTopicSelect')?.addEventListener('change', event => {
      readmeCarouselEditorTopicId = event.target.value || 'readme';
      readmeCarouselEditorSlideIndex = 0;
      renderReadmeCarouselEditor();
    });
    readmeCarouselCard.querySelector('#readmeTopicVisibilitySelect')?.addEventListener('change', event => {
      updateReadmeTopicEditField('visible', event.target.value);
    });
    ['labelNl', 'labelEn', 'htmlNl', 'htmlEn'].forEach(field => {
      const suffix = field[0].toUpperCase() + field.slice(1);
      readmeCarouselCard.querySelector(`#readmeTopic${suffix}Input`)?.addEventListener('change', event => {
        updateReadmeTopicEditField(field, event.target.value);
      });
    });
    readmeCarouselCard.querySelector('#readmeCarouselPrevButton')?.addEventListener('click', () => {
      const slides = readmeCarouselSlidesForTopic(readmeCarouselEditorTopicId);
      if (!slides.length) return;
      readmeCarouselEditorSlideIndex = (readmeCarouselEditorSlideIndex - 1 + slides.length) % slides.length;
      renderReadmeCarouselEditor();
    });
    readmeCarouselCard.querySelector('#readmeCarouselNextButton')?.addEventListener('click', () => {
      const slides = readmeCarouselSlidesForTopic(readmeCarouselEditorTopicId);
      if (!slides.length) return;
      readmeCarouselEditorSlideIndex = (readmeCarouselEditorSlideIndex + 1) % slides.length;
      renderReadmeCarouselEditor();
    });
    readmeCarouselCard.querySelectorAll('[data-readme-carousel-field]').forEach(control => {
      const eventName = control.tagName === 'SELECT' ? 'change' : 'input';
      control.addEventListener(eventName, event => updateReadmeCarouselSlideField(event.target.dataset.readmeCarouselField, event.target.value));
    });
    readmeCarouselCard.querySelector('#readmeCarouselAddButton')?.addEventListener('click', addReadmeCarouselSlide);
    readmeCarouselCard.querySelector('#readmeCarouselRemoveButton')?.addEventListener('click', removeReadmeCarouselSlide);
    readmeCarouselCard.querySelector('#readmeCarouselResetButton')?.addEventListener('click', resetReadmeTopicConfiguration);

    const projectConfigCard = document.createElement('section');
    projectConfigCard.className = 'panel-card config-project-layers-card';
    projectConfigCard.dataset.configCard = 'project-config';
    projectConfigCard.innerHTML = `
      <div class="help-lang-nl">
        <h2>Config in de projectzip</h2>
        <p class="inline-help">De viewer laadt eerst <a href="${PROJECT_DEFAULT_CONFIG_PATH}" target="_blank" rel="noopener">de standaardconfig</a> en legt daarna <a href="${PROJECT_USER_CONFIG_PATH}" target="_blank" rel="noopener">jouw projectconfig</a> eroverheen. De bestanden blijven naast elkaar bestaan. Een al lokaal bewaarde browsersnapshot wordt als laatste toegepast.</p>
      </div>
      <div class="help-lang-en">
        <h2>Config in the project zip</h2>
        <p class="inline-help">The viewer loads <a href="${PROJECT_DEFAULT_CONFIG_PATH}" target="_blank" rel="noopener">the default config</a> first, then overlays <a href="${PROJECT_USER_CONFIG_PATH}" target="_blank" rel="noopener">your project config</a>. Both files remain available. A browser-local saved snapshot is applied last.</p>
      </div>
      <ol class="project-config-precedence">
        <li><code>${PROJECT_DEFAULT_CONFIG_PATH}</code> · <span class="help-lang-nl">meegeleverde standaard</span><span class="help-lang-en">bundled default</span></li>
        <li><code>${PROJECT_USER_CONFIG_PATH}</code> · <span class="help-lang-nl">jouw overschrijvingen</span><span class="help-lang-en">your overrides</span></li>
        <li><span class="help-lang-nl">lokaal bewaarde browser-Config</span><span class="help-lang-en">browser-local saved Config</span> · <span class="help-lang-nl">alleen op dit apparaat</span><span class="help-lang-en">this device only</span></li>
      </ol>
      <div class="button-row project-config-actions">
        <button class="primary" id="writeProjectUserConfigButton" type="button"><span class="help-lang-nl">Schrijf huidige Config naar project</span><span class="help-lang-en">Write current Config to project</span></button>
        <button id="downloadProjectUserConfigButton" type="button"><span class="help-lang-nl">Download user-config</span><span class="help-lang-en">Download user config</span></button>
      </div>
      <p class="top-menu-choice-help project-config-layer-status" id="projectConfigLayerStatus" role="status"></p>
      <p class="top-menu-choice-help"><span class="help-lang-nl"><strong>Direct schrijven</strong> werkt wanneer de viewer via <code>start_local_viewer.bat</code> draait. Bij een gewone webversie download je het bestand en plaats je het handmatig in <code>config/</code>.</span><span class="help-lang-en"><strong>Direct writing</strong> works when the viewer runs through <code>start_local_viewer.bat</code>. On a regular web version, download the file and place it in <code>config/</code> manually.</span></p>`;
    projectConfigCard.querySelector('#writeProjectUserConfigButton')?.addEventListener('click', writeProjectUserConfig);
    projectConfigCard.querySelector('#downloadProjectUserConfigButton')?.addEventListener('click', downloadProjectUserConfig);

    const readmeSlideFileCard = document.createElement('section');
    readmeSlideFileCard.className = 'panel-card config-readme-slide-file-card';
    readmeSlideFileCard.dataset.configCard = 'readme-slide-file';
    readmeSlideFileCard.innerHTML = `
      <div class="help-lang-nl">
        <h2>Afbeelding als LEESMIJ-slide invoegen</h2>
        <p class="inline-help">Kies een lokaal PNG-, JPEG-, WebP- of GIF-bestand. Config sluit het beeld in bij de gekozen carousel; een los beeldpad is niet nodig. Maximaal 1,25 MB per bestand. Bewerk daarna alt-tekst en onderschrift bij LEESMIJ-items.</p>
      </div>
      <div class="help-lang-en">
        <h2>Insert image as README slide</h2>
        <p class="inline-help">Choose a local PNG, JPEG, WebP, or GIF file. Config embeds it in the selected carousel, so no separate image path is needed. Maximum 1.25 MB per file. Then edit alt text and caption under README topics.</p>
      </div>
      <div class="readme-slide-file-grid">
        <label for="readmeSlideFileTopicSelect">
          <span><span class="help-lang-nl">LEESMIJ-item</span><span class="help-lang-en">README topic</span></span>
          <select id="readmeSlideFileTopicSelect"></select>
        </label>
        <label for="readmeSlideFileShapeSelect">
          <span><span class="help-lang-nl">Beeldvorm</span><span class="help-lang-en">Image shape</span></span>
          <select id="readmeSlideFileShapeSelect">
            <option value="wide">Breed · 16:10</option>
            <option value="narrow">Smal · portret</option>
          </select>
        </label>
        <label class="readme-slide-file-picker" for="readmeSlideFileInput">
          <span><span class="help-lang-nl">Afbeeldingsbestand</span><span class="help-lang-en">Image file</span></span>
          <input accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif" id="readmeSlideFileInput" type="file"/>
        </label>
      </div>
      <div class="button-row readme-slide-file-actions">
        <button class="primary" disabled id="readmeSlideFileInsertButton" type="button"><span class="help-lang-nl">Voeg toe als slide</span><span class="help-lang-en">Insert as slide</span></button>
        <button disabled id="readmeSlideFileEditButton" type="button"><span class="help-lang-nl">Bewerk ingevoegde slide</span><span class="help-lang-en">Edit inserted slide</span></button>
      </div>
      <p class="top-menu-choice-help readme-slide-file-status" id="readmeSlideFileStatus" role="status"><span class="help-lang-nl">Nog geen bestand gekozen.</span><span class="help-lang-en">No file selected yet.</span></p>`;
    const readmeSlideFileInput = readmeSlideFileCard.querySelector('#readmeSlideFileInput');
    const readmeSlideFileInsertButton = readmeSlideFileCard.querySelector('#readmeSlideFileInsertButton');
    readmeSlideFileInput?.addEventListener('change', event => {
      readmePendingSlideFile = event.target.files?.[0] || null;
      if (readmeSlideFileInsertButton) readmeSlideFileInsertButton.disabled = !readmePendingSlideFile;
      const editButton = document.getElementById('readmeSlideFileEditButton');
      if (editButton) editButton.disabled = true;
      if (readmePendingSlideFile) {
        setReadmeSlideFileStatus(
          `Gekozen: ${readmePendingSlideFile.name} · ${Math.ceil(readmePendingSlideFile.size / 1024)} kB.`,
          `Selected: ${readmePendingSlideFile.name} · ${Math.ceil(readmePendingSlideFile.size / 1024)} kB.`
        );
      } else {
        setReadmeSlideFileStatus('Nog geen bestand gekozen.', 'No file selected yet.');
      }
    });
    readmeSlideFileCard.querySelector('#readmeSlideFileTopicSelect')?.addEventListener('change', event => {
      readmeCarouselEditorTopicId = event.target.value || readmeCarouselEditorTopicId;
      readmeCarouselEditorSlideIndex = 0;
    });
    readmeSlideFileInsertButton?.addEventListener('click', insertReadmeSlideFile);
    readmeSlideFileCard.querySelector('#readmeSlideFileEditButton')?.addEventListener('click', () => {
      activateConfigTab('readme-carousels');
      syncReadmeCarouselEditorTopics();
    });

    const janCard = document.createElement('section');
    janCard.className = 'panel-card config-jan-card';
    janCard.id = 'config-jan';
    janCard.innerHTML = `<div class="help-lang-nl"><h2>JaN · Just another Notation</h2><p><code>S:np-VP</code>, nadrukkelijk niet <code>S:NP-VP</code>.</p><p>Onderzoeksnotatie: <code>S+ np-VP</code>. Eerst voor binaire bomen; later voor niet-binaire, meertakkige bomen.</p><p>TODO: <code>heeft gebeten</code> ↔ <code>gebeten heeft</code>.</p></div><div class="help-lang-en"><h2>JaN · Just another Notation</h2><p><code>S:np-VP</code>, explicitly not <code>S:NP-VP</code>.</p><p>Research notation: <code>S+ np-VP</code>. Binary trees first; non-binary multi-branching trees later.</p><p>TODO: <code>heeft gebeten</code> ↔ <code>gebeten heeft</code>.</p></div>`;

    const multiOgnCard = document.createElement('section');
    multiOgnCard.className = 'panel-card config-multi-ogn-card';
    multiOgnCard.id = 'config-multi-ogn-anaphor';
    multiOgnCard.innerHTML = `
      <div class="help-lang-nl">
        <h2>Anafoor · multi-OGN</h2>
        <p class="inline-help">Het oorspronkelijke voorbeeld <strong>Ik zie een man. Hij draagt een hoed.</strong> blijft beschikbaar. Kies daarnaast in het hoofdmenu <strong>Uiting</strong> een van de drie uitingen; iedere uiting toont twee kernzinnen onder elkaar en gedeclareerde verticale anaforen. <strong>Play</strong> bouwt achtereenvolgens K1, K2, verticale anaforen en de gezamenlijke LEX-uiting op; vorige, volgende en Reset blijven beschikbaar.</p>
        <ol>
          <li>S1 en S2 worden ieder afzonderlijk als geldige OGN berekend.</li>
          <li>De complete bomen blijven star; S1 staat boven S2.</li>
          <li>De complete S2 verschuift totdat MAN en HIJ exact één gridkolom delen.</li>
          <li>De gezamenlijke LEX-as ordent S1 vóór S2.</li>
          <li>MAN (antecedent) en HIJ (anafoor) krijgen één rechte ongerichte coreferentielijn zonder pijl.</li>
        </ol>
        <p class="config-item-help"><strong>Invariant:</strong> unieke rijen en kolommen worden per afzonderlijke OGN gecontroleerd. Alleen gedeclareerde anafoorkolommen mogen tussen de twee OGN’s samenvallen: MAN–HIJ in de oorspronkelijke demo, of HOND–HOND én JAN–MAN in de causale kernzinbomen. DIE/HIJ en HEM verschijnen uitsluitend op LEX.</p>
        <p class="config-item-help"><strong>Waar?</strong> De onderste kernzin K2: HOND BIJT MAN. <strong>Wanneer?</strong> Zodra HOND en JAN/MAN tussen K1 en K2 van subject/object wisselen én beide bronverbindingen verticaal moeten blijven. <strong>Waarom?</strong> Zonder automatische spiegeling kruisen hun referentkolommen; met Flip blijven HOND–HOND en JAN–MAN recht. Boomstructuur en LEX-woordvolgorde veranderen niet.</p>
      </div>
      <div class="help-lang-en">
        <h2>Anaphor · multi-OGN</h2>
        <p class="inline-help">The original example <strong>Ik zie een man. Hij draagt een hoed.</strong> remains available. The main <strong>Utterance</strong> menu also offers three utterances; each displays two vertically stacked kernel clauses and declared vertical anaphor connections. <strong>Play</strong> successively reveals K1, K2, vertical anaphors, and the shared realized LEX utterance; Previous, Next, and Reset remain available.</p>
        <ol>
          <li>S1 and S2 are each calculated independently as a valid OGN.</li>
          <li>The complete trees remain rigid; S1 is above S2.</li>
          <li>The complete S2 shifts until MAN and HIJ share exactly one grid column.</li>
          <li>The shared LEX axis orders S1 before S2.</li>
          <li>MAN (antecedent) and HIJ (anaphor) receive one straight undirected coreference line without an arrow.</li>
        </ol>
        <p class="config-item-help"><strong>Invariant:</strong> unique rows and columns are validated per individual OGN. Only declared anaphor columns may coincide across both OGNs: MAN–HIJ in the original demonstration, or HOND–HOND and JAN–MAN in the causal kernel trees. DIE/HIJ and HEM appear only on LEX.</p>
        <p class="config-item-help"><strong>Where?</strong> The lower kernel clause K2: HOND BIJT MAN. <strong>When?</strong> When HOND and JAN/MAN exchange subject/object roles between K1 and K2 while both source links must remain vertical. <strong>Why?</strong> Without automatic mirroring their reference columns cross; Flip keeps HOND–HOND and JAN–MAN straight without changing tree structure or LEX word order.</p>
      </div>
      <fieldset class="multi-ogn-tree-layout-field">
        <legend><span class="help-lang-nl">Boomstructuur en layout</span><span class="help-lang-en">Tree structure and layout</span></legend>
        <p class="config-item-help"><span class="help-lang-nl"><strong>Play per kernzin:</strong> raster → K1-boom → LEX K1 (bron → woord → positie) → K2-boom vóór Flip → zichtbare Flip → LEX K2 → eventueel K3-boom en LEX K3 → verticale anaforen → volledige LEX-uiting. Alleen een echte positiewijziging krijgt een verticale pijl op de LEX-as; een woord op bronhoogte krijgt geen pijl. Vanuit de boom wordt geen verplaatsingslijn getekend.</span><span class="help-lang-en"><strong>Play per kernel clause:</strong> grid → K1 tree → LEX K1 (source → word → position) → K2 tree before Flip → visible Flip → LEX K2 → optional K3 tree and LEX K3 → vertical anaphors → complete LEX utterance. Only an actual position change gets a vertical arrow on the LEX axis; a word remaining at source height gets no arrow. No movement line is drawn from the tree.</span></p>
        <label class="field mini-field"><span><span class="help-lang-nl">Causale anafoor</span><span class="help-lang-en">Causal anaphor</span></span><select id="multiCausalAnaphorSelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">Rastermaat horizontaal</span><span class="help-lang-en">Horizontal grid size</span></span><select id="multiGridSizeHorizontalSelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">Rastermaat verticaal</span><span class="help-lang-en">Vertical grid size</span></span><select id="multiGridSizeVerticalSelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">Boomkleur</span><span class="help-lang-en">Tree color</span></span><select id="multiTreeLineColorSelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">Boomlijnen</span><span class="help-lang-en">Tree lines</span></span><select id="multiTreeLineWeightSelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">Boomruimte</span><span class="help-lang-en">Tree spacing</span></span><select id="multiTreeLayoutDensitySelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">Vertakking horizontaal</span><span class="help-lang-en">Horizontal branches</span></span><select id="multiTreeBranchHorizontalSelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">Vertakking verticaal</span><span class="help-lang-en">Vertical branches</span></span><select id="multiTreeBranchVerticalSelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">Flip · links/rechts</span><span class="help-lang-en">Flip · left/right</span></span><select id="multiTreeBranchFlipSelect"></select></label>
        <label class="field mini-field"><span><span class="help-lang-nl">PLAY · Flip-houdtijd</span><span class="help-lang-en">PLAY · Flip hold</span></span><select id="multiOgnFlipHoldSelect"></select></label>
        <p class="config-item-help"><span class="help-lang-nl"><strong>Pauzeer op Flip</strong> is standaard: de verplaatste knopen flitsen en PLAY wacht. Klik <strong>Play</strong> of <strong>→</strong> om verder te gaan. Alternatieven zijn flash (1,2 s) en houd vast (3 s).</span><span class="help-lang-en"><strong>Pause on Flip</strong> is the default: moved nodes flash and PLAY waits. Click <strong>Play</strong> or <strong>→</strong> to continue. Alternatives are flash (1.2 s) and hold (3 s).</span></p>
        <p class="config-item-help"><span class="help-lang-nl"><strong>Klikbare knoop:</strong> klik in K2 op bronknoop HOND om de LEX-realisatie rechtstreeks te wisselen tussen HIJ, DIE, DIE HOND, DE HOND en JEK. De bronknoop blijft HOND. De twee rastermaten veranderen de echte gridcel afzonderlijk in breedte en hoogte.</span><span class="help-lang-en"><strong>Clickable node:</strong> click source node HOND in K2 to switch its LEX realization between HIJ, DIE, DIE HOND, DE HOND, and JEK. The source node remains HOND. The two grid sizes independently change the actual cell width and height.</span></p>
        <p class="config-item-help"><span class="help-lang-nl"><strong>Flip</strong> spiegelt de zichtbare takken, maar verandert noch de structuur <code>S → NP, VP</code> / <code>VP → NP, V</code>, noch de LEX-woordvolgorde of verticale anaforen.</span><span class="help-lang-en"><strong>Flip</strong> mirrors the visible branches without changing <code>S → NP, VP</code> / <code>VP → NP, V</code> structure, LEX word order, or vertical anaphors.</span></p>
        <p class="config-item-help"><span class="help-lang-nl"><strong>Reikwijdte:</strong> Flip bestaat alleen in Language Tree en Anafoor/multiple Language Trees. LEX is het ultieme resultaat: de gerealiseerde uiting. De flipsolver kiest alleen toegestane boomgeometrie.</span><span class="help-lang-en"><strong>Scope:</strong> Flip exists only in Language Tree and Anaphor/multiple Language Trees. LEX is the ultimate result: the realized utterance. The flip solver only chooses permitted tree geometry.</span></p>
        <p class="config-item-help"><span class="help-lang-nl"><strong>TODO:</strong> <em>zijn bot</em> kan het bot van Jan of van Jek betekenen; de solver mag dit niet stilzwijgend beslissen. <em>Het bot</em> is de ondubbelzinnige standaard.</span><span class="help-lang-en"><strong>TODO:</strong> <em>zijn bot</em> may mean Jan's or Jek's bone; the solver must not silently decide. <em>Het bot</em> is the unambiguous default.</span></p>
      </fieldset>`;

    panels.get('general-ui').appendChild(generalUiCard);
    panels.get('preconfig').appendChild(preconfigCard);
    panels.get('features').appendChild(featuresCard);
    panels.get('multi-ogn').appendChild(multiOgnCard);
    panels.get('direct').appendChild(directConfigCard);
    panels.get('readme-carousels').appendChild(readmeCarouselCard);
    panels.get('overview').appendChild(overviewCard);
    panels.get('jan').appendChild(janCard);
    panels.get('files').append(projectConfigCard, readmeSlideFileCard, graphExportCard, opnCard);
    panels.get('view').appendChild(treeCard);
    panels.get('log-lex').append(logSettingsCard, lexCard, relationCard);
    panels.get('examples').appendChild(examplesCard);
    panels.get('advanced').appendChild(advancedCard);
    const CONFIG_ITEM_HELP = {
      centralModeSelect: ['Kiest de centrale Syntax- of Functional-view.', 'Chooses the central Syntax or Functional view.'],
      treeChoiceSelect: ['Kiest welke bronboom als centrale structuur wordt gebruikt.', 'Chooses the source tree used as the central structure.'],
      functionalOrderSelect: ['Wijzigt alleen de takvolgorde in Functional.', 'Changes branch order in Functional only.'],
      branchOrderSelect: ['Bepaalt de standaard links/rechts-volgorde van vertakkingen.', 'Sets the default left/right order of branches.'],
      layoutDensitySelect: ['Bepaalt de structurele ruimte tussen knopen; verandert de zin niet.', 'Sets structural spacing between nodes; it does not change the sentence.'],
      viewFitSelect: ['Bepaalt hoeveel van het beschikbare scherm door de volledige view wordt benut.', 'Determines how much of the available screen the complete view uses.'],
      freeSlotCountSelect: ['Reserveert vrije structurele rijen voor Comp, topic en V2.', 'Reserves free structural rows for Comp, topic and V2.'],
      lexFreeSlotCountSelect: ['Aantal zichtbare lexicale insertiegroepen; meerwoordgroepen kunnen één slot gebruiken.', 'Number of visible lexical insertion groups; multiword groups can use one slot.'],
      logInsertionIntervalSelect: ['Kiest de neutrale LOG-zone; een expliciete zinsplaats heeft voorrang.', 'Chooses the neutral LOG zone; an explicit sentence position takes priority.'],
      lexFreeSlotPlacementSelect: ['Legt scope/host vast, los van de lineaire LEX-plaats.', 'Records scope/host independently of linear LEX position.'],
      lexInsertionContentSelect: ['Kiest de inhoud van de actieve insertie.', 'Chooses the content of the active insertion.'],
      showGridInput: ['Toont of verbergt het raster; knoopposities blijven gelijk.', 'Shows or hides the grid; node positions remain unchanged.'],
      gridColorSelect: ['Kleur van het raster tussen de buitenste actieve assen.', 'Color of the grid between the outer active axes.'],
      gridLineWeightSelect: ['Zwaarte van gewone en hoofdrasterlijnen.', 'Weight of regular and major grid lines.'],
      gridSizeHorizontalSelect: ['Breedte van iedere echte rastercel; knopen en projecties schalen mee.', 'Width of each actual grid cell; nodes and projections scale with it.'],
      gridSizeVerticalSelect: ['Hoogte van iedere echte rastercel; knopen en projecties schalen mee.', 'Height of each actual grid cell; nodes and projections scale with it.'],
      multiGridSizeHorizontalSelect: ['Horizontale rastermaat, gedeeld met de algemene configuratie.', 'Horizontal grid size, shared with the general configuration.'],
      multiGridSizeVerticalSelect: ['Verticale rastermaat, gedeeld met de algemene configuratie.', 'Vertical grid size, shared with the general configuration.'],
      treeLineColorSelect: ['Kleur van de takken van de boomstructuur.', 'Color of tree-structure branches.'],
      treeLineWeightSelect: ['Zwaarte en zichtbaarheid van de boomtakken; standaard zwaar.', 'Weight and visibility of tree branches; strong by default.'],
      multiTreeLineColorSelect: ['Kleur van beide afzonderlijke kernzinbomen.', 'Color of both independent kernel-clause trees.'],
      multiCausalAnaphorSelect: ['Kiest hij, die, die hond, de hond of Jek; klik ook rechtstreeks op de subjectknoop in K2.', 'Chooses hij, die, die hond, de hond, or Jek; the K2 subject node is also directly clickable.'],
      multiTreeLineWeightSelect: ['Zwaarte van de boomtakken: licht, normaal of zwaar.', 'Tree-branch weight: light, normal, or strong.'],
      multiTreeLayoutDensitySelect: ['Ruimte tussen knopen en afzonderlijke kernzinbomen.', 'Spacing between nodes and independent kernel-clause trees.'],
      multiTreeBranchHorizontalSelect: ['Breedte van de links/rechts-vertakkingen: compact, normaal of ruim.', 'Width of left/right branches: compact, normal, or spacious.'],
      multiTreeBranchVerticalSelect: ['Hoogte van de vertakkingen en afstand tussen kernzinnen: compact, normaal of ruim.', 'Branch height and spacing between kernel clauses: compact, normal, or spacious.'],
      multiTreeBranchFlipSelect: ['Spiegelt beide bomen links/rechts; syntactische structuur, woordvolgorde en verticale anaforen blijven gelijk.', 'Mirrors both trees left/right; syntactic structure, word order, and vertical anaphors remain unchanged.'],
      multiOgnFlipHoldSelect: ['PLAY blijft bij Flip 1,2 s, 3 s of tot een expliciete vervolgklik staan.', 'PLAY remains on Flip for 1.2 s, 3 s, or until an explicit continue action.'],
      projectionLineWeightSelect: ['Zwaarte van bron-naar-aslijnen en de named projection-assen.', 'Weight of source-to-axis lines and named projection axes.'],
      boxLineWeightSelect: ['Zwaarte van structurele, LEX-, SYNT- en LOG-boxcontouren.', 'Weight of structural, LEX, SYNT and LOG box outlines.'],
      showRelationsInput: ['Toont of verbergt tak- en projectielijnen.', 'Shows or hides branch and projection lines.'],
      showLabelsInput: ['Toont of verbergt zichtbare boomlabels.', 'Shows or hides visible tree labels.']
    };
    Object.entries(CONFIG_ITEM_HELP).forEach(([id, texts]) => {
      const control = document.getElementById(id);
      const label = control?.closest?.('label');
      if (!label || label.querySelector('.config-item-help')) return;
      const small = document.createElement('small');
      small.className = 'config-item-help';
      small.innerHTML = `<span class="help-lang-nl">${texts[0]}</span><span class="help-lang-en">${texts[1]}</span>`;
      label.appendChild(small);
    });
    sidePanel.replaceChildren(scopeNav, tabList, saveSlot, ...panels.values());
    sidePanel.dataset.configTabsReady = '1';
    activateConfigScope(activeConfigScope, false, false);
    applyFeatureVisibility();
    syncProjectConfigStatus();
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
    setText('.main-sentence-field span, .desktop-sentence-field span, .toolbar .example-field span', en ? 'Sentence' : 'Zin');
    setText('.mobile-sentence-field span', en ? 'Sentences' : 'Zinnen');
    setText('.main-adverb-field span', en ? 'Adv.' : 'Bijw.');
    setText('.main-view-field span', 'View');
    setText('.main-projection-field span', en ? 'Proj.' : 'Proj.');
    setText('.mobile-adverb-field span', en ? 'Adverbs' : 'Bijwoorden');
    setText('.config-topbar h2', en ? 'Configuration by context' : 'Config per context');
    setText('.config-topbar p', en ? 'General and each application are separate. Only the settings of the selected context are shown.' : 'Algemeen en iedere toepassing zijn gescheiden. Alleen de instellingen van de gekozen context worden getoond.');
    document.querySelectorAll('[data-config-tab-button]').forEach(button => {
      button.textContent = en ? button.dataset.labelEn : button.dataset.labelNl;
    });
    document.querySelectorAll('.config-scope-group-label').forEach(label => {
      label.textContent = en ? label.dataset.labelEn : label.dataset.labelNl;
    });
    document.querySelectorAll('[data-config-scope-button]').forEach(button => {
      button.textContent = en ? button.dataset.labelEn : button.dataset.labelNl;
    });
    document.querySelector('.config-scope-nav')?.setAttribute(
      'aria-label',
      en ? 'Configuration: general or by application' : 'Config: algemeen of per toepassing'
    );
    const readmeShapeSelect = document.getElementById('readmeCarouselShapeSelect');
    if (readmeShapeSelect) {
      const wide = readmeShapeSelect.querySelector('option[value="wide"]');
      const narrow = readmeShapeSelect.querySelector('option[value="narrow"]');
      if (wide) wide.textContent = en ? 'Wide · 16:10' : 'Breed · 16:10';
      if (narrow) narrow.textContent = en ? 'Narrow · portrait' : 'Smal · portret';
    }
    const readmePrev = document.getElementById('readmeCarouselPrevButton');
    const readmeNext = document.getElementById('readmeCarouselNextButton');
    if (readmePrev) readmePrev.setAttribute('aria-label', en ? 'Previous slide' : 'Vorige slide');
    if (readmeNext) readmeNext.setAttribute('aria-label', en ? 'Next slide' : 'Volgende slide');
    setText('[data-config-card="tree"] > h2', en ? 'Tree and view' : 'Boom en beeld');
    setText('[data-config-card="log-settings"] > h2', en ? 'LOG placement authority' : 'LOG als plaatsingsautoriteit');
    setText('[data-config-card="lex"] > h2', en ? 'LEX axis · sentence type' : 'LEX-as · zinsoort');
    setText('[data-config-card="relations"] > h2', en ? 'Relations / rules' : 'Relaties / regels');
    setText('.config-save-menu-kicker', en ? 'SAVE OR SHARE NOW' : 'DIRECT OPSLAAN OF DELEN');
    setText('[data-config-card="graph-export"] > h2', en ? 'Save, export and share' : 'Opslaan, exporteren en delen');
    setText('[data-config-card="advanced"] > h2', en ? 'Language Tree compatibility' : 'Language Tree-compatibiliteit');
    setText('[data-config-max-text]', en
      ? 'Language Tree default: Tree spacing MAX and six free tree rows — large type with a deliberately low tree.'
      : 'Language Tree-standaard: Boomruimte MAX en zes vrije boomrijen — groot letterbeeld met een bewust lage boom.');
    setText('.right-menu-width-callout .inline-help', en ? 'Set the width of the right menu directly. The grid uses only the space needed for the active view; the remaining space goes to this column.' : 'Kies hier direct de breedte van het rechter menu. Het grid gebruikt alleen de benodigde ruimte voor de actieve view; de rest gaat naar deze kolom.');
    setText('[data-config-card="tree"] > .sticky-note', en ? 'View selects Syntax or Functional. Window fit describes how the tree uses the available app window.' : 'View kiest Syntax of Functional. Venstervulling beschrijft hoe de boom het beschikbare appvenster gebruikt.');

    setLabelSpan('rightMenuWidthSelectTop', en ? 'Right column visible' : 'Rechterkolom zichtbaar');
    setLabelSpan('centralModeSelect', 'View', en ? 'Choose central view: Syntax or Functional (functional structure).' : 'Kies de centrale view: Syntax of Functional (functionele structuur).');
    setLabelSpan('mainViewSelect', 'View', en ? 'Choose central view: Syntax or Functional (functional structure).' : 'Kies de centrale view: Syntax of Functional (functionele structuur).');
    setLabelSpan('mobileViewSelect', 'View', en ? 'Choose central view: Syntax or Functional (functional structure).' : 'Kies de centrale view: Syntax of Functional (functionele structuur).');
    setLabelSpan('treeChoiceSelect', en ? 'Tree choice' : 'Boomkeuze');
    setLabelSpan('functionalOrderSelect', en ? 'Layout order' : 'Layout order');
    setLabelSpan('branchOrderSelect', en ? 'Branch order' : 'Takvolgorde');
    setLabelSpan('branchTopSelect', en ? 'Top S/CLAUSE' : 'Top S/CLAUSE');
    setLabelSpan('branchMiddleSelect', en ? 'VP / ARG-STRUCT' : 'VP / ARG-STRUCT');
    setLabelSpan('branchOtherSelect', en ? 'Other' : 'Overig');
    setLabelSpan('layoutDensitySelect', en ? 'Tree spacing' : 'Boomruimte');
    setLabelSpan('mainLayoutDensitySelectTop', en ? 'Tree spacing' : 'Boomruimte');
    setLabelSpan('viewFitSelect', en ? 'Window fit' : 'Venstervulling', en ? 'How the active graph uses the available app window. MAX fills it.' : 'Hoe de actieve graph het beschikbare appvenster gebruikt. MAX vult het volledig.');
    setLabelSpan('mainViewFitSelectTop', en ? 'Window fit' : 'Venstervulling');
    setLabelSpan('freeSlotCountSelect', en ? 'Free tree rows' : 'Boom vrije rijen');
    setLabelSpan('lexProjectionColorSelect', en ? 'LEX color' : 'LEX-kleur');
    setLabelSpan('syntProjectionColorSelect', en ? 'SYNT color' : 'SYNT-kleur');
    setLabelSpan('logProjectionColorSelect', en ? 'LOG color' : 'LOG-kleur');
    setLabelSpan('gridColorSelect', en ? 'Grid color' : 'Rasterkleur');
    setLabelSpan('gridLineWeightSelect', en ? 'Grid lines' : 'Rasterlijnen');
    setLabelSpan('gridSizeHorizontalSelect', en ? 'Horizontal grid size' : 'Rastermaat horizontaal');
    setLabelSpan('gridSizeVerticalSelect', en ? 'Vertical grid size' : 'Rastermaat verticaal');
    setLabelSpan('treeLineColorSelect', en ? 'Tree color' : 'Boomkleur');
    setLabelSpan('treeLineWeightSelect', en ? 'Tree lines' : 'Boomlijnen');
    setLabelSpan('projectionLineWeightSelect', en ? 'Projection lines' : 'Projectielijnen');
    setLabelSpan('boxLineWeightSelect', en ? 'Box outlines' : 'Boxlijnen');
    setInputLabelText('#projectionBoxDraggableInput', en ? 'draggable' : 'verplaatsbaar');
    setInputLabelText('#southBoxDraggableInput', en ? 'draggable' : 'verplaatsbaar');
    setLabelSpan('projectionBoxDraggableInput', en ? 'Projections box' : 'Projecties-box');
    setLabelSpan('southBoxDraggableInput', en ? 'Language-action box' : 'Taalactiebox');
    document.querySelectorAll('.config-save-field legend').forEach(node => { node.textContent = en ? 'Save config' : 'Config opslaan'; });
    setText('#saveConfigButton', en ? 'Yes · save config' : 'Ja · bewaar config');
    setText('#discardConfigButton', en ? 'No · restore last saved config' : 'Nee · herstel laatst bewaarde config');
    setText('#downloadConfigLogButton', en ? 'Download local config log' : 'Download lokaal config-log');
    setText('.graph-export-card > .inline-help', en
      ? 'Choose a ready-to-share LinkedIn image, record the complete phased Play sequence as video, or save the current graph as a self-contained vector file.'
      : 'Kies een kant-en-klare LinkedIn-afbeelding, neem de volledige gefaseerde Play als video op of bewaar de huidige graph als zelfstandig vectorbestand.');
    setText('#downloadGraphPngButton', en ? 'LinkedIn PNG' : 'LinkedIn-PNG');
    setText('#recordPlayWebmButton', en ? 'Play video' : 'Play-video');
    setText('#downloadGraphSvgButton', en ? 'Graph as SVG' : 'Graph als SVG');
    if (!els.graphExportStatus?.dataset.statusNl && !graphExportBusy) {
      setGraphExportStatus(
        'PNG is voor een beeldpost. Play-video kiest waar mogelijk MP4/H.264 en legt altijd 30 fps vast. Houd dit scherm open tijdens de opname.',
        'PNG is for an image post. Play video selects MP4/H.264 where available and always captures 30 fps. Keep this window open while recording.'
      );
    } else {
      refreshGraphExportStatusLanguage();
    }
    const projBoxOuter = els.projectionBoxDraggableInput?.closest?.('label.inline-checkbox')?.parentElement;
    if (projBoxOuter?.querySelector?.('span')) projBoxOuter.querySelector('span').textContent = en ? 'Projections box' : 'Projecties-box';
    const southBoxOuter = els.southBoxDraggableInput?.closest?.('label.inline-checkbox')?.parentElement;
    if (southBoxOuter?.querySelector?.('span')) southBoxOuter.querySelector('span').textContent = en ? 'Language-action box' : 'Taalactiebox';
    setLabelSpan('lexFreeSlotCountSelect', en ? 'LOG minors' : 'Aantal minors');
    setLabelSpan('logInsertionIntervalSelect', en ? 'LOG interval' : 'LOG-interval');
    setLabelSpan('lexFreeSlotPlacementSelect', en ? 'Scope host (secondary)' : 'Scopehost (secundair)');
    setLabelSpan('lexInsertionContentSelect', en ? 'Adverb / content' : 'Bijwoord / inhoud');
    document.querySelectorAll('.projection-color-field legend').forEach(node => { node.textContent = en ? 'Projection colors' : 'Projectiekleuren'; });
    document.querySelectorAll('.projection-color-field .top-menu-choice-help').forEach(node => { node.textContent = en ? 'LEX, SYNT and LOG use distinct defaults and can each be colored independently.' : 'LEX, SYNT en LOG hebben verschillende standaardkleuren en zijn ieder afzonderlijk instelbaar.'; });
    document.querySelectorAll('.line-style-field legend').forEach(node => { node.textContent = en ? 'Line appearance' : 'Lijnbeeld'; });
    document.querySelectorAll('.line-style-field .top-menu-choice-help').forEach(node => { node.textContent = en ? 'Adjust the grid between the axes, projection lines and box outlines independently. Boxes inherit their projection color.' : 'Stel het raster tussen de assen, projectielijnen en boxcontouren afzonderlijk in. Boxen volgen de kleur van hun projectie.'; });
    document.querySelectorAll('.lex-adverb-insert-field legend').forEach(node => { node.textContent = en ? 'LOG minors for adverbs' : 'LOG-minors voor bijwoorden'; });
    document.querySelectorAll('.lex-adverb-insert-field > .top-menu-choice-help').forEach(node => {
      node.textContent = en
        ? 'Place each adverb first as a minor in a LOG interval. Every minor adds one fixed planned distance unit between its surrounding majors. This planning does not move a source node.'
        : 'Plaats ieder bijwoord eerst als minor in een LOG-interval. Elke minor voegt één vaste geplande afstandseenheid toe tussen de omringende majors. Deze planning verplaatst geen bronknoop.';
    });
    setLabelSpan('sentenceTypeSelect', en ? 'Sentence type' : 'Zinsoort');

    document.querySelectorAll('.lex-extension-field legend').forEach(node => { node.textContent = en ? 'Branch extension · compatibility' : 'Takverlenging · compatibiliteit'; });
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
    setText('#relationHelp', en ? 'No separate relation editor. This list follows the active view: SYNT rules, Functional roles, or LOG south-axis order.' : 'Geen losse editor-relaties. Deze lijst volgt de actieve view: SYNT-regels, Functional-rollen of LOG-volgorde op de zuidas.');

    setText('.mobile-sheet-header .intro-kicker', en ? 'Mobile viewer' : 'Mobiele viewer');
    setText('#mobileCloseButton', en ? 'Close' : 'Sluit');
    setText('.mobile-sheet-section[aria-label="Projecties"] h3', en ? 'Projections' : 'Projecties');
    setText('.mobile-sheet-section[aria-label="Snelle acties"] h3', en ? 'Actions' : 'Acties');
    setText('.mobile-sheet-section[aria-label="Menu\'s boven grid"] h3', en ? 'Menus above grid' : 'Menu’s boven grid');
    setText('.mobile-sheet-section[aria-label="LEX vrije slots"] h3', en ? 'LEX free slots' : 'LEX vrije slots');
    setText('.mobile-sheet-section[aria-label="Documentatie"] h3', en ? 'Documentation' : 'Documentatie');
    setLabelSpan('mobileLexFreeSlotCountSelect', en ? 'Count' : 'Aantal');
    setLabelSpan('mobileLogInsertionIntervalSelect', en ? 'LOG interval' : 'LOG-interval');
    setLabelSpan('mobileLexFreeSlotPlacementSelect', en ? 'Scope host' : 'Scopehost');
    setLabelSpan('mobileLexInsertionContentSelect', en ? 'Content' : 'Inhoud');
    setText('#mobileGrowthButton', en ? 'Grow on/off' : 'Groei aan/uit');
    setText('#mobileResetButton', en ? 'Reset sample' : 'Reset voorbeeld');
    setText('label[for="mobileFileInput"]', en ? 'Open OPN/JSON' : 'OPN/JSON openen');
    setText('#mobileDownloadJsonButton', en ? 'Legacy JSON' : 'Legacy JSON');
    setText('.mobile-sheet-note', en ? 'Drag with one finger to pan. Pinch with two fingers to zoom. FIT frames the active view.' : 'Sleep met één vinger om te pannen. Knijp met twee vingers om te zoomen. FIT zet de actieve view passend in beeld.');

    document.querySelectorAll('.text-panel summary').forEach((node, index) => {
      if (index === 0) node.textContent = en ? 'What is included in this Lite version?' : 'Wat zit in deze eerste Lite-versie?';
      if (index === 1) node.textContent = en ? 'Controls' : 'Bediening';
    });
    const details = document.querySelectorAll('.text-panel details');
    if (details[0]) details[0].querySelectorAll('p').forEach((p, i) => {
      if (i === 0) p.textContent = en ? 'The viewer shows Open Graph Notation with grid rule, projection mechanism, views and named projections. You can choose sample sentences, use Play, inspect projections, pan/zoom the canvas, open/download OPN documents and open documentation.' : 'De viewer toont Open Graph Notation met gridregel, projectiemechanisme, views en named projections. Je kunt voorbeeldzinnen kiezen, Play gebruiken, projecties bekijken, canvas pannen/zoomen, OPN-documenten openen/downloaden en documentatie openen.';
      if (i === 1) p.textContent = en ? 'Not carried over from the Java app: classical graph algorithms such as planarity, Dijkstra, MST, biconnectivity and canonical ordering. They are outside this first JAN language-tree layer.' : 'Niet overgenomen uit de Java-app: klassieke graph-algoritmen zoals planarity, Dijkstra, MST, biconnectivity en canonical ordering. Die horen niet bij deze eerste JAN-taalboomlaag.';
    });
  }

  function languageLabel(language = state.language) {
    return LANGUAGE_OPTIONS.find(option => option.id === language)?.label || 'English';
  }

  function dutchSentenceOrderNote() {
    return languageValue({
      en: 'The sentence examples are Dutch and illustrate Dutch sentence word order.',
      nl: 'De voorbeeldzinnen zijn Nederlands en tonen de Nederlandse woordvolgorde.',
      de: 'Die Beispielsätze sind niederländisch und zeigen die niederländische Satzstellung.',
      fr: 'Les phrases d’exemple sont néerlandaises et montrent l’ordre des mots en néerlandais.',
      es: 'Las frases de ejemplo están en neerlandés y muestran el orden de palabras del neerlandés.'
    });
  }

  function applySelectedLanguageTexts() {
    if (state.language === 'en' || state.language === 'nl') return;
    const t = {
      de: { sentence:'Satz', adverb:'Adverb', interface:'Ansicht', projections:'Projektionen', logOrder:'LOG-Reihenfolge', readme:'README', config:'Konfiguration', reset:'Zurücksetzen', growthOff:'Wachstum aus', chooseLanguage:'Sprache wählen', backMain:'← Zurück zu: Main', configOverview:'Konfigurationsübersicht', projectInfo:'Projektinformationen' },
      fr: { sentence:'Phrase', adverb:'Adverbe', interface:'Interface', projections:'Projections', logOrder:'Ordre LOG', readme:'README', config:'Configuration', reset:'Réinitialiser', growthOff:'Croissance arrêtée', chooseLanguage:'Choisir la langue', backMain:'← Retour à : Main', configOverview:'Vue d’ensemble de la configuration', projectInfo:'Informations sur le projet' },
      es: { sentence:'Oración', adverb:'Adverbio', interface:'Interfaz', projections:'Proyecciones', logOrder:'Orden LOG', readme:'README', config:'Configuración', reset:'Restablecer', growthOff:'Crecimiento desactivado', chooseLanguage:'Elegir idioma', backMain:'← Volver a: Main', configOverview:'Resumen de configuración', projectInfo:'Información del proyecto' }
    }[state.language];
    if (!t) return;
    if (els.mainSentenceSummary) els.mainSentenceSummary.textContent = t.sentence;
    if (els.mainAdverbSummary && (state.selectedAdverbId === 'none' || !state.selectedAdverbId)) els.mainAdverbSummary.textContent = t.adverb;
    if (els.mainInterfaceSummary) els.mainInterfaceSummary.textContent = t.interface;
    if (els.sourceAxisSummaryLabel) els.sourceAxisSummaryLabel.textContent = t.projections;
    if (els.mainExtraSummary) els.mainExtraSummary.textContent = t.logOrder;
    setText('#mainSouthHeading', t.logOrder);
    setText('#openHelpButton, #openHelpFromConfigButton', t.readme);
    setText('#openConfigButton, #openConfigFromHelpButton', t.config);
    setText('#mainResetButton, #growthResetButton, #mobileGrowthResetButton', t.reset);
    if (els.mainGrowthStepLabel && !state.growthActive) els.mainGrowthStepLabel.textContent = t.growthOff;
    setText('#closeConfigButton, #closeHelpButton', t.backMain);
    setText('.config-topbar h2', t.configOverview);
    setText('.help-topbar h2', t.projectInfo);
    document.querySelectorAll('.language-menu > summary').forEach(summary => { summary.title = t.chooseLanguage; });
  }

  function applyLanguage() {
    const en = isEnglish();
    document.documentElement.lang = state.language;
    document.body.classList.toggle('lang-en', en);
    document.body.classList.toggle('lang-nl', !en);
    document.body.dataset.language = state.language;
    applyConfigLanguageTexts(en);
    document.querySelectorAll('.language-menu > summary').forEach(summary => {
      summary.textContent = languageLabel();
      summary.title = languageValue({en:'Choose language',nl:'Kies taal',de:'Sprache wählen',fr:'Choisir la langue',es:'Elegir idioma'});
      summary.setAttribute('aria-label', summary.title);
    });
    document.querySelectorAll('[data-language-option]').forEach(button => {
      const selected = button.dataset.languageOption === state.language;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    document.querySelectorAll('.language-sentence-note').forEach(note => { note.textContent = dutchSentenceOrderNote(); });

    setText('.main-sentence-field span, .desktop-sentence-field span, .sentence-card .field span', en ? 'Sentence' : 'Zin');
    setText('.mobile-sentence-field span', en ? 'Sentences' : 'Zinnen');
    setTitle('#openHelpButton, #openHelpFromConfigButton', en ? 'Open README.' : 'Open LEESMIJ.');
    setTitle('#openConfigButton', en ? 'Open the configuration screen.' : 'Open het configuratiescherm.');
    setTitle('#closeConfigButton, #closeHelpButton', en ? 'Back to: Main.' : 'Terug naar: Main.');
    setText('#closeConfigButton, #closeHelpButton', en ? '← Back to: Main' : '← Terug naar: Main');
    setText('#openConfigButton, #openConfigFromHelpButton', 'Config');
    setText('#openHelpButton, #openHelpFromConfigButton', en ? 'README' : 'LEESMIJ');
    setText('.config-topbar h2', en ? 'Configuration by context' : 'Config per context');
    setText('.config-topbar p', en ? 'General and each application are separate. Only the settings of the selected context are shown.' : 'Algemeen en iedere toepassing zijn gescheiden. Alleen de instellingen van de gekozen context worden getoond.');
    setText('.help-topbar .intro-kicker', en ? 'README' : 'LEESMIJ');
    setText('.help-topbar h2', en ? 'Project information' : 'Projectinformatie');
    setText('.help-topbar p', en ? 'README topics and the selected text are both visible immediately. Drag the divider to enlarge or reduce the text panel.' : 'LEESMIJ-onderwerpen en de geselecteerde tekst zijn direct zichtbaar. Sleep de scheidingslijn om het tekstscherm groter of kleiner te maken.');
    setText('.header-subtitle', featureEnabled('adverbs')
      ? (en ? 'Top menu with Sentence, Adverb, Syntax / Functional, Interface, Projections, LOG order, Language, README and Config.' : 'Topmenu met Zin, Bijwoord, Syntax / Functional, Interface, Projecties, LOG-volgorde, taal, LEESMIJ en Config.')
      : (en ? 'Top menu with Sentence, Syntax / Functional, Interface, Projections, LOG order, Language, README and Config.' : 'Topmenu met Zin, Syntax / Functional, Interface, Projecties, LOG-volgorde, taal, LEESMIJ en Config.'));
    setText('[data-projection="axes"], [data-main-projection="axes"]', en ? 'All' : 'Alle');
    document.querySelectorAll('[data-source-axis-action="all"]').forEach(node => { node.textContent = en ? 'All' : 'Alle'; });
    document.querySelectorAll('[data-source-axis-action="none"]').forEach(node => { node.textContent = en ? 'None' : 'Geen'; });
    if (els.sourceAxisSummaryLabel) els.sourceAxisSummaryLabel.textContent = en ? 'Projections' : 'Projecties';
    renderMainChoiceMenus();
    applyFeatureVisibility();
    syncPlacementModeUi();
    syncProjectConfigStatus();
    applySelectedLanguageTexts();
  }

  function setLanguage(language) {
    state.language = normalizeLanguage(language);
    try { localStorage.setItem('opengraph_language', state.language); } catch (_err) {}
    syncControls();
    applyLanguage();
    renderStatus();
  }

  function setHelpTopic(topicId = 'readme') {
    const panels = Array.from(document.querySelectorAll('[data-help-topic]'));
    const buttons = Array.from(document.querySelectorAll('[data-help-topic-button]'));
    const validIds = panels
      .map(panel => panel.getAttribute('data-help-topic') || '')
      .filter(topic => topic && readmeTopicIsAvailable(topic));
    const next = validIds.includes(topicId)
      ? topicId
      : validIds.includes('readme')
        ? 'readme'
        : validIds[0] || '';
    panels.forEach(panel => {
      const active = !!next && panel.getAttribute('data-help-topic') === next;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
      panel.setAttribute('aria-hidden', String(!active));
    });
    buttons.forEach(button => {
      const buttonTopic = button.getAttribute('data-help-topic-button') || '';
      const available = readmeTopicIsAvailable(buttonTopic);
      const active = available && buttonTopic === next;
      button.hidden = !available;
      button.setAttribute('aria-hidden', String(!available));
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
      button.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
    const stage = document.querySelector('.help-topic-stage');
    if (stage) {
      let empty = stage.querySelector('.help-topic-empty-state');
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'help-topic-empty-state';
        empty.innerHTML = '<span class="help-lang-nl">Er zijn geen LEESMIJ-items ingesteld op Tonen: ja. Zet een item weer aan in Config.</span><span class="help-lang-en">No README topics are set to Show: yes. Enable a topic again in Config.</span>';
        stage.appendChild(empty);
      }
      empty.hidden = !!next;
      stage.scrollTop = 0;
    }
  }

  function registerHelpTopicTree() {
    document.querySelectorAll('[data-help-topic-button]').forEach(button => {
      if (button.dataset.helpBound === '1') return;
      button.dataset.helpBound = '1';
      button.addEventListener('click', () => setHelpTopic(button.getAttribute('data-help-topic-button') || 'readme'));
    });
    setHelpTopic('readme');
  }

  function effectiveHelpLayoutMode() {
    if (state.helpLayoutMode === 'stacked' || state.helpLayoutMode === 'side') return state.helpLayoutMode;
    const forced = validViewportMode(state.viewportMode);
    if (forced === 'mobile-landscape') return 'side';
    if (forced === 'desktop' || forced === 'mobile-portrait') return 'stacked';
    return isMobileViewport() && !isPortraitGridFirstViewport() ? 'side' : 'stacked';
  }

  function applyHelpLayoutMode() {
    const screen = document.querySelector('.help-tree-screen');
    const resizer = document.getElementById('helpPanelResizer');
    if (!screen) return;
    const mode = effectiveHelpLayoutMode();
    screen.dataset.helpLayout = mode;
    document.body?.classList.toggle('help-layout-side', mode === 'side');
    document.body?.classList.toggle('help-layout-stacked', mode === 'stacked');
    if (resizer) {
      resizer.setAttribute('aria-orientation', mode === 'side' ? 'vertical' : 'horizontal');
      resizer.title = mode === 'side'
        ? (isEnglish() ? 'Drag left or right to resize the README panels.' : 'Sleep links of rechts om de LEESMIJ-panelen te vergroten of verkleinen.')
        : (isEnglish() ? 'Drag up or down to resize the README panels.' : 'Sleep omhoog of omlaag om de LEESMIJ-panelen te vergroten of verkleinen.');
    }
  }

  function registerHelpPanelResizer() {
    const screen = document.querySelector('.help-tree-screen');
    const resizer = document.getElementById('helpPanelResizer');
    if (!screen || !resizer || resizer.dataset.resizeBound === '1') return;
    resizer.dataset.resizeBound = '1';

    const storageKey = 'opengraph_help_panel_size_session';
    const isStacked = () => effectiveHelpLayoutMode() === 'stacked';
    const limits = () => {
      const rect = screen.getBoundingClientRect();
      const stacked = isStacked();
      const total = stacked ? rect.height : rect.width;
      const min = stacked ? 140 : 190;
      const max = Math.max(min, total - (stacked ? 150 : 260));
      return { stacked, rect, min, max };
    };
    const currentRenderedSize = () => {
      const inline = parseFloat(screen.style.getPropertyValue('--help-nav-size'));
      if (Number.isFinite(inline) && inline > 0) return inline;
      const navRect = screen.querySelector('.help-tree-nav')?.getBoundingClientRect?.();
      const rendered = isStacked() ? Number(navRect?.height) : Number(navRect?.width);
      return Number.isFinite(rendered) && rendered > 0 ? rendered : 0;
    };
    const applySize = raw => {
      const { min, max } = limits();
      const size = Math.max(min, Math.min(max, Number(raw) || min));
      screen.style.setProperty('--help-nav-size', `${Math.round(size)}px`);
      resizer.setAttribute('aria-valuemin', String(Math.round(min)));
      resizer.setAttribute('aria-valuemax', String(Math.round(max)));
      resizer.setAttribute('aria-valuenow', String(Math.round(size)));
      return size;
    };
    const saveSize = size => {
      try { sessionStorage.setItem(storageKey, String(Math.round(size))); } catch (_err) {}
    };
    const restoreSize = () => {
      let saved = '';
      try { saved = sessionStorage.getItem(storageKey) || ''; } catch (_err) {}
      if (!saved) return;
      const rect = screen.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        applySize(saved);
      } else {
        // Tijdens init is README nog verborgen. Dan zijn de gemeten grenzen
        // 0×0 en zou een geldige gebruikersmaat onterecht tot het minimum
        // worden teruggebracht.
        const size = Number(saved);
        if (Number.isFinite(size) && size > 0) {
          screen.style.setProperty('--help-nav-size', `${Math.round(size)}px`);
        }
      }
    };

    let activePointer = null;
    const finish = event => {
      if (activePointer === null) return;
      if (event && event.pointerId !== undefined && event.pointerId !== activePointer) return;
      activePointer = null;
      resizer.classList.remove('is-dragging');
      document.body.classList.remove('help-resizing');
      saveSize(parseFloat(getComputedStyle(screen).getPropertyValue('--help-nav-size')) || 0);
    };
    resizer.addEventListener('pointerdown', event => {
      if (event.button !== undefined && event.button !== 0) return;
      activePointer = event.pointerId;
      resizer.setPointerCapture?.(event.pointerId);
      resizer.classList.add('is-dragging');
      document.body.classList.add('help-resizing');
      event.preventDefault();
    });
    resizer.addEventListener('pointermove', event => {
      if (activePointer !== event.pointerId) return;
      const { stacked, rect } = limits();
      applySize(stacked ? event.clientY - rect.top : event.clientX - rect.left);
    });
    resizer.addEventListener('pointerup', finish);
    resizer.addEventListener('pointercancel', finish);
    resizer.addEventListener('lostpointercapture', finish);
    resizer.addEventListener('keydown', event => {
      const { stacked } = limits();
      const relevant = stacked ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
      if (!relevant.includes(event.key) && event.key !== 'Home' && event.key !== 'End') return;
      const current = parseFloat(getComputedStyle(screen).getPropertyValue('--help-nav-size')) || (stacked ? screen.clientHeight / 2 : screen.clientWidth / 4);
      const { min, max } = limits();
      let next = current;
      if (event.key === 'Home') next = min;
      else if (event.key === 'End') next = max;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next -= 16;
      else next += 16;
      saveSize(applySize(next));
      event.preventDefault();
    });
    window.addEventListener('resize', () => {
      applyHelpLayoutMode();
      if (!document.body?.classList.contains('help-screen-active')) return;
      // Een CSS-custom-property met clamp(...) levert hier geen parseerbaar
      // getal op. Lees daarom de werkelijk gerenderde navigatiemaat; anders
      // klapte elke mobiele resize terug naar het absolute minimum.
      applySize(currentRenderedSize());
    }, { passive: true });
    applyHelpLayoutMode();
    restoreSize();
  }

  function safeReadmeEmbeddedImageSource(value) {
    const source = String(value || '').trim();
    if (!source || source.length > MAX_README_EMBEDDED_SOURCE_CHARS) return '';
    if (!/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(source)) return '';
    return source.replace(/\s+/g, '');
  }

  function normalizedReadmeCarouselSlide(value = {}) {
    const text = (input, maximum) => String(input || '').trim().slice(0, maximum);
    const embeddedSource = value.embedded === true ? safeReadmeEmbeddedImageSource(value.src) : '';
    return {
      src: embeddedSource || text(value.src, 2048),
      embedded: !!embeddedSource,
      fileName: embeddedSource ? text(value.fileName, 240) : '',
      shape: value.shape === 'narrow' ? 'narrow' : 'wide',
      altNl: text(value.altNl, 320),
      altEn: text(value.altEn, 320),
      captionNl: text(value.captionNl, 1200),
      captionEn: text(value.captionEn, 1200)
    };
  }

  function readmeCarouselTopicRecords() {
    return Array.from(document.querySelectorAll('.help-topic-panel'))
      .map(panel => {
        const id = panel.getAttribute('data-help-topic') || '';
        if (!id) return null;
        const featureId = panel.getAttribute('data-feature') || '';
        if (featureId && !featureEnabled(featureId)) return null;
        const button = Array.from(document.querySelectorAll('[data-help-topic-button]'))
          .find(candidate => candidate.getAttribute('data-help-topic-button') === id);
        const label = language => {
          const className = language === 'en' ? '.help-lang-en' : '.help-lang-nl';
          const localized = button?.querySelector(className)?.textContent?.trim();
          const plain = Array.from(button?.children || [])
            .find(child => !child.classList.contains('help-lang-en') && !child.classList.contains('help-lang-nl'))
            ?.textContent?.trim();
          return localized || plain || panel.querySelector(`${className} h3`)?.textContent?.trim()
            || panel.querySelector('h3')?.textContent?.trim() || id;
        };
        return { id, panel, labelNl: label('nl'), labelEn: label('en') };
      })
      .filter(Boolean);
  }

  function readmeTopicLanguageContainer(panel, language) {
    const className = language === 'en' ? 'help-lang-en' : 'help-lang-nl';
    return Array.from(panel?.children || []).find(child => child.classList?.contains(className)) || null;
  }

  function captureDefaultReadmeTopics() {
    if (readmeTopicDefaultsCaptured) return;
    readmeTopicDefaultsCaptured = true;
    Array.from(document.querySelectorAll('.help-topic-panel')).forEach(panel => {
      const id = panel.getAttribute('data-help-topic') || '';
      if (!id) return;
      const button = document.querySelector(`[data-help-topic-button="${CSS.escape(id)}"]`);
      const nlContainer = readmeTopicLanguageContainer(panel, 'nl');
      const enContainer = readmeTopicLanguageContainer(panel, 'en');
      const labelFor = language => {
        const localized = button?.querySelector(language === 'en' ? '.help-lang-en' : '.help-lang-nl');
        return localized?.textContent?.trim()
          || button?.textContent?.trim()
          || readmeTopicLanguageContainer(panel, language)?.querySelector('h3')?.textContent?.trim()
          || id;
      };
      DEFAULT_README_TOPICS.set(id, {
        visible: true,
        labelNl: labelFor('nl'),
        labelEn: labelFor('en'),
        htmlNl: nlContainer?.innerHTML?.trim() || '',
        htmlEn: enContainer?.innerHTML?.trim() || ''
      });
    });
  }

  function sanitizeReadmeTopicHtml(value) {
    const template = document.createElement('template');
    template.innerHTML = String(value || '').slice(0, MAX_README_TOPIC_HTML_LENGTH);
    const allowedElements = new Set([
      'a', 'b', 'blockquote', 'br', 'code', 'em', 'h3', 'h4', 'hr', 'i',
      'li', 'ol', 'p', 'pre', 'span', 'strong', 'u', 'ul'
    ]);
    const removableElements = new Set([
      'audio', 'button', 'embed', 'form', 'iframe', 'input', 'link', 'meta',
      'object', 'script', 'select', 'source', 'style', 'textarea', 'video'
    ]);
    Array.from(template.content.querySelectorAll('*')).forEach(node => {
      const tag = node.tagName.toLowerCase();
      if (!allowedElements.has(tag)) {
        if (removableElements.has(tag)) node.remove();
        else node.replaceWith(...Array.from(node.childNodes));
        return;
      }
      Array.from(node.attributes).forEach(attribute => {
        const name = attribute.name.toLowerCase();
        if (tag === 'a' && name === 'href') {
          const href = String(attribute.value || '').trim();
          if (!href || /^(?:javascript|vbscript|data|file):/i.test(href)) node.removeAttribute(attribute.name);
          return;
        }
        if (tag === 'a' && name === 'title') return;
        if (tag === 'p' && name === 'class' && attribute.value === 'readme-query-note') return;
        node.removeAttribute(attribute.name);
      });
      if (tag === 'a' && node.hasAttribute('href')) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
    return template.innerHTML.trim();
  }

  function normalizedReadmeTopicEdit(topicId, value = {}) {
    const defaults = DEFAULT_README_TOPICS.get(topicId);
    if (!defaults) return null;
    const label = (input, fallback) => String(input || '').trim().slice(0, 180) || fallback;
    return {
      visible: value.visible !== false,
      labelNl: label(value.labelNl, defaults.labelNl),
      labelEn: label(value.labelEn, defaults.labelEn),
      htmlNl: typeof value.htmlNl === 'string' ? sanitizeReadmeTopicHtml(value.htmlNl) : defaults.htmlNl,
      htmlEn: typeof value.htmlEn === 'string' ? sanitizeReadmeTopicHtml(value.htmlEn) : defaults.htmlEn
    };
  }

  function normalizeReadmeTopicEdits(value = {}) {
    const normalized = {};
    if (!value || typeof value !== 'object' || Array.isArray(value)) return normalized;
    Object.entries(value).forEach(([topicId, edit]) => {
      if (!DEFAULT_README_TOPICS.has(topicId) || !edit || typeof edit !== 'object' || Array.isArray(edit)) return;
      const item = normalizedReadmeTopicEdit(topicId, edit);
      if (item) normalized[topicId] = item;
    });
    return normalized;
  }

  function readmeTopicEditFor(topicId) {
    return state.readmeTopicEdits?.[topicId] || DEFAULT_README_TOPICS.get(topicId) || null;
  }

  function ensureReadmeTopicEdit(topicId) {
    if (!state.readmeTopicEdits || typeof state.readmeTopicEdits !== 'object') state.readmeTopicEdits = {};
    if (!state.readmeTopicEdits[topicId]) {
      state.readmeTopicEdits[topicId] = normalizedReadmeTopicEdit(topicId, DEFAULT_README_TOPICS.get(topicId));
    }
    return state.readmeTopicEdits[topicId] || null;
  }

  function readmeTopicIsAvailable(topicId) {
    const panel = document.querySelector(`.help-topic-panel[data-help-topic="${CSS.escape(topicId)}"]`);
    if (!panel) return false;
    const featureId = panel.getAttribute('data-feature') || '';
    return (!featureId || featureEnabled(featureId)) && readmeTopicEditFor(topicId)?.visible !== false;
  }

  function renderReadmeTopicEdits() {
    captureDefaultReadmeTopics();
    Array.from(document.querySelectorAll('.help-topic-panel')).forEach(panel => {
      const topicId = panel.getAttribute('data-help-topic') || '';
      const item = readmeTopicEditFor(topicId);
      const defaults = DEFAULT_README_TOPICS.get(topicId);
      if (!item || !defaults) return;
      const button = document.querySelector(`[data-help-topic-button="${CSS.escape(topicId)}"]`);
      if (button) {
        let labelNl = button.querySelector(':scope > .help-lang-nl');
        let labelEn = button.querySelector(':scope > .help-lang-en');
        if (!labelNl || !labelEn) {
          labelNl = document.createElement('span');
          labelNl.className = 'help-lang-nl';
          labelEn = document.createElement('span');
          labelEn.className = 'help-lang-en';
          button.replaceChildren(labelNl, labelEn);
        }
        labelNl.textContent = item.labelNl;
        labelEn.textContent = item.labelEn;
        const available = readmeTopicIsAvailable(topicId);
        button.hidden = !available;
        button.setAttribute('aria-hidden', String(!available));
      }
      const nlContainer = readmeTopicLanguageContainer(panel, 'nl');
      const enContainer = readmeTopicLanguageContainer(panel, 'en');
      if (nlContainer) nlContainer.innerHTML = item.htmlNl;
      if (enContainer) enContainer.innerHTML = item.htmlEn;
    });
    setHelpTopic(
      document.querySelector('.help-topic-panel.is-active')?.getAttribute('data-help-topic')
      || readmeCarouselEditorTopicId
      || 'readme'
    );
    registerReadmeExternalWindows();
  }

  function captureDefaultReadmeCarousels() {
    if (readmeCarouselDefaultsCaptured) return;
    readmeCarouselDefaultsCaptured = true;
    readmeCarouselTopicRecords().forEach(({ id, panel }) => {
      const carousel = panel.querySelector('[data-readme-carousel]');
      if (!carousel) return;
      const slides = Array.from(carousel.querySelectorAll('[data-readme-slide]')).map(slide => {
        const image = slide.querySelector('img');
        const caption = slide.querySelector('figcaption');
        const captionNl = caption?.querySelector('.help-lang-nl')?.textContent?.trim()
          || caption?.textContent?.trim() || '';
        const captionEn = caption?.querySelector('.help-lang-en')?.textContent?.trim()
          || caption?.textContent?.trim() || '';
        return normalizedReadmeCarouselSlide({
          src: image?.getAttribute('src') || '',
          shape: slide.getAttribute('data-readme-shape') || 'wide',
          altNl: image?.getAttribute('alt') || '',
          altEn: image?.getAttribute('alt') || '',
          captionNl,
          captionEn
        });
      });
      if (slides.length) DEFAULT_README_CAROUSELS.set(id, slides);
    });
  }

  function normalizeReadmeCarousels(value = {}) {
    const validTopics = new Set(
      Array.from(document.querySelectorAll('.help-topic-panel'))
        .map(panel => panel.getAttribute('data-help-topic'))
        .filter(Boolean)
    );
    const normalized = {};
    let embeddedCharacters = 0;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return normalized;
    Object.entries(value).forEach(([topicId, slides]) => {
      if (!validTopics.has(topicId) || !Array.isArray(slides)) return;
      normalized[topicId] = slides
        .slice(0, MAX_README_CAROUSEL_SLIDES)
        .map(normalizedReadmeCarouselSlide)
        .map(slide => {
          if (!slide.embedded) return slide;
          if (embeddedCharacters + slide.src.length > MAX_README_EMBEDDED_TOTAL_CHARS) {
            return normalizedReadmeCarouselSlide({
              ...slide,
              src: '',
              embedded: false,
              fileName: ''
            });
          }
          embeddedCharacters += slide.src.length;
          return slide;
        });
    });
    return normalized;
  }

  function readmeHasCustomCarousel(topicId) {
    return Object.prototype.hasOwnProperty.call(state.readmeCarousels || {}, topicId);
  }

  function readmeCarouselSlidesForTopic(topicId) {
    if (readmeHasCustomCarousel(topicId)) return state.readmeCarousels[topicId];
    return DEFAULT_README_CAROUSELS.get(topicId) || [];
  }

  function ensureReadmeCarouselOverride(topicId) {
    if (!state.readmeCarousels || typeof state.readmeCarousels !== 'object') state.readmeCarousels = {};
    if (!readmeHasCustomCarousel(topicId)) {
      state.readmeCarousels[topicId] = readmeCarouselSlidesForTopic(topicId)
        .map(slide => normalizedReadmeCarouselSlide(slide));
    }
    return state.readmeCarousels[topicId];
  }

  function safeReadmeCarouselSource(value, embedded = false) {
    const source = String(value || '').trim();
    if (embedded) return safeReadmeEmbeddedImageSource(source);
    if (!source || /^(?:javascript|vbscript|data|file):/i.test(source)) return '';
    return source;
  }

  function configuredReadmeCarouselHtml(topicId, slides) {
    const topic = readmeCarouselTopicRecords().find(item => item.id === topicId);
    const title = topic ? (isEnglish() ? topic.labelEn : topic.labelNl) : topicId;
    if (!slides.length) {
      return `<div class="help-carousel-frame">
        <strong>${escapeHtml(title)}</strong>
        <span class="help-lang-nl">Deze carousel bevat nog geen slides.</span>
        <span class="help-lang-en">This carousel does not contain slides yet.</span>
      </div>`;
    }
    return `<div class="readme-carousel-viewport">
      ${slides.map((slide, index) => {
        const item = normalizedReadmeCarouselSlide(slide);
        const source = safeReadmeCarouselSource(item.src, item.embedded);
        const alt = isEnglish() ? (item.altEn || item.altNl) : (item.altNl || item.altEn);
        return `<figure class="readme-carousel-slide${index === 0 ? ' is-active' : ''}" data-readme-shape="${item.shape}" data-readme-slide=""${index === 0 ? '' : ' hidden=""'}>
          ${source
            ? `<img alt="${escapeHtml(alt)}" data-alt-en="${escapeHtml(item.altEn)}" data-alt-nl="${escapeHtml(item.altNl)}" data-readme-carousel-image="" src="${escapeHtml(source)}"/>`
            : `<div class="readme-carousel-image-placeholder"><span class="help-lang-nl">Nog geen beeldpad</span><span class="help-lang-en">No image path yet</span></div>`}
          <figcaption><span class="help-lang-nl">${escapeHtml(item.captionNl || item.altNl)}</span><span class="help-lang-en">${escapeHtml(item.captionEn || item.altEn)}</span></figcaption>
        </figure>`;
      }).join('')}
    </div>
    <div aria-hidden="false" class="readme-carousel-controls" data-readme-carousel-controls=""></div>`;
  }

  function renderReadmeTopicCarousels() {
    document.querySelectorAll('.help-topic-panel').forEach(panel => {
      panel.querySelectorAll('.help-topic-carousel-slot:not(.readme-configured-carousel), .help-carousel-reserved, .readme-tree-carousel:not(.readme-configured-carousel)')
        .forEach(node => { node.dataset.readmeDefaultCarousel = '1'; });
      panel.querySelectorAll(':scope > .readme-configured-carousel').forEach(node => node.remove());
      const topicId = panel.getAttribute('data-help-topic') || '';
      const custom = topicId && readmeHasCustomCarousel(topicId);
      panel.querySelectorAll('[data-readme-default-carousel]').forEach(node => { node.hidden = custom; });
      if (!custom) return;
      const slides = readmeCarouselSlidesForTopic(topicId);
      const carousel = document.createElement('section');
      carousel.className = slides.length
        ? 'readme-tree-carousel readme-configured-carousel'
        : 'help-topic-carousel-slot readme-configured-carousel';
      carousel.dataset.readmeCarousel = '';
      carousel.dataset.readmeConfiguredTopic = topicId;
      if (!slides.length) {
        const topic = readmeCarouselTopicRecords().find(item => item.id === topicId);
        carousel.dataset.carouselTopic = topic ? (isEnglish() ? topic.labelEn : topic.labelNl) : topicId;
      }
      carousel.setAttribute('role', 'group');
      carousel.setAttribute('aria-label', `LEESMIJ-carousel: ${topicId}`);
      carousel.innerHTML = configuredReadmeCarouselHtml(topicId, slides);
      panel.appendChild(carousel);
    });
    registerReadmeCarousel();
    syncReadmeCarouselLanguage();
  }

  function syncReadmeCarouselLanguage() {
    document.querySelectorAll('[data-readme-carousel-image]').forEach(image => {
      image.alt = isEnglish()
        ? (image.dataset.altEn || image.dataset.altNl || '')
        : (image.dataset.altNl || image.dataset.altEn || '');
    });
  }

  function syncReadmeCarouselEditorTopics() {
    const select = document.getElementById('readmeCarouselTopicSelect');
    if (!select) return;
    const topics = readmeCarouselTopicRecords();
    const previous = readmeCarouselEditorTopicId;
    select.replaceChildren(...topics.map(topic => {
      const option = document.createElement('option');
      option.value = topic.id;
      option.textContent = isEnglish() ? topic.labelEn : topic.labelNl;
      return option;
    }));
    if (!topics.some(topic => topic.id === readmeCarouselEditorTopicId)) {
      readmeCarouselEditorTopicId = topics[0]?.id || '';
      readmeCarouselEditorSlideIndex = 0;
    }
    if (previous !== readmeCarouselEditorTopicId) readmeCarouselEditorSlideIndex = 0;
    select.value = readmeCarouselEditorTopicId;
    syncReadmeSlideFileTopics(topics);
    renderReadmeCarouselEditor();
  }

  function syncReadmeSlideFileTopics(topics = readmeCarouselTopicRecords()) {
    const select = document.getElementById('readmeSlideFileTopicSelect');
    if (!select) return;
    const previous = select.value || readmeCarouselEditorTopicId;
    select.replaceChildren(...topics.map(topic => {
      const option = document.createElement('option');
      option.value = topic.id;
      option.textContent = isEnglish() ? topic.labelEn : topic.labelNl;
      return option;
    }));
    const next = topics.some(topic => topic.id === previous)
      ? previous
      : topics.some(topic => topic.id === readmeCarouselEditorTopicId)
        ? readmeCarouselEditorTopicId
        : topics[0]?.id || '';
    select.value = next;
  }

  function renderReadmeCarouselEditorPreview(slide = null) {
    const preview = document.getElementById('readmeCarouselEditorPreview');
    if (!preview) return;
    if (!slide) {
      preview.innerHTML = '<span class="help-lang-nl">Nog geen slide. Kies + Slide.</span><span class="help-lang-en">No slide yet. Choose + Slide.</span>';
      return;
    }
    const item = normalizedReadmeCarouselSlide(slide);
    const source = safeReadmeCarouselSource(item.src, item.embedded);
    const alt = isEnglish() ? (item.altEn || item.altNl) : (item.altNl || item.altEn);
    preview.innerHTML = `<figure data-readme-shape="${item.shape}">
      ${source
        ? `<img alt="${escapeHtml(alt)}" src="${escapeHtml(source)}"/>`
        : '<div class="readme-carousel-image-placeholder"><span class="help-lang-nl">Nog geen beeldpad</span><span class="help-lang-en">No image path yet</span></div>'}
      <figcaption><span class="help-lang-nl">${escapeHtml(item.captionNl || item.altNl)}</span><span class="help-lang-en">${escapeHtml(item.captionEn || item.altEn)}</span></figcaption>
    </figure>`;
  }

  function renderReadmeCarouselEditor() {
    const slides = readmeCarouselSlidesForTopic(readmeCarouselEditorTopicId);
    readmeCarouselEditorSlideIndex = slides.length
      ? Math.max(0, Math.min(readmeCarouselEditorSlideIndex, slides.length - 1))
      : 0;
    const slide = slides[readmeCarouselEditorSlideIndex] || null;
    const counter = document.getElementById('readmeCarouselSlideCounter');
    if (counter) counter.textContent = slides.length ? `${readmeCarouselEditorSlideIndex + 1} / ${slides.length}` : '0 / 0';
    const fieldValues = slide || normalizedReadmeCarouselSlide();
    document.querySelectorAll('[data-readme-carousel-field]').forEach(control => {
      const field = control.dataset.readmeCarouselField;
      const embeddedSourceField = field === 'src' && fieldValues.embedded;
      control.value = embeddedSourceField
        ? `${isEnglish() ? 'Embedded file' : 'Ingesloten bestand'} · ${fieldValues.fileName || 'image'}`
        : fieldValues[field] || (field === 'shape' ? 'wide' : '');
      control.disabled = !slide;
      if (field === 'src') {
        control.readOnly = !!embeddedSourceField;
        control.classList.toggle('is-embedded-source', !!embeddedSourceField);
        control.title = embeddedSourceField
          ? (isEnglish()
            ? 'This image was inserted through Save & export. Remove the slide to replace the embedded file.'
            : 'Dit beeld is ingevoegd via Opslaan & exporteren. Verwijder de slide om het ingesloten bestand te vervangen.')
          : '';
      }
    });
    const topic = readmeTopicEditFor(readmeCarouselEditorTopicId);
    const topicDefaults = DEFAULT_README_TOPICS.get(readmeCarouselEditorTopicId);
    const topicFields = {
      readmeTopicLabelNlInput: topic?.labelNl || topicDefaults?.labelNl || '',
      readmeTopicLabelEnInput: topic?.labelEn || topicDefaults?.labelEn || '',
      readmeTopicHtmlNlInput: topic?.htmlNl || topicDefaults?.htmlNl || '',
      readmeTopicHtmlEnInput: topic?.htmlEn || topicDefaults?.htmlEn || ''
    };
    Object.entries(topicFields).forEach(([id, value]) => {
      const control = document.getElementById(id);
      if (control && control.value !== value) control.value = value;
    });
    const visibility = document.getElementById('readmeTopicVisibilitySelect');
    if (visibility) visibility.value = topic?.visible === false ? 'no' : 'yes';
    const previous = document.getElementById('readmeCarouselPrevButton');
    const next = document.getElementById('readmeCarouselNextButton');
    const remove = document.getElementById('readmeCarouselRemoveButton');
    const add = document.getElementById('readmeCarouselAddButton');
    if (previous) previous.disabled = slides.length < 2;
    if (next) next.disabled = slides.length < 2;
    if (remove) remove.disabled = !slide;
    if (add) add.disabled = slides.length >= MAX_README_CAROUSEL_SLIDES;
    const status = document.getElementById('readmeCarouselEditorStatus');
    if (status) {
      status.textContent = readmeHasCustomCarousel(readmeCarouselEditorTopicId)
        ? (isEnglish() ? 'Custom carousel · save Config to keep these changes.' : 'Eigen carousel · bewaar Config om deze wijzigingen te behouden.')
        : (isEnglish() ? 'Source default · editing creates a local Config override.' : 'Bronstandaard · bewerken maakt een lokale Config-overschrijving.');
    }
    renderReadmeCarouselEditorPreview(slide);
  }

  function updateReadmeTopicEditField(field, value) {
    if (!['visible', 'labelNl', 'labelEn', 'htmlNl', 'htmlEn'].includes(field)) return;
    const edit = ensureReadmeTopicEdit(readmeCarouselEditorTopicId);
    if (!edit) return;
    if (field === 'visible') edit.visible = value !== 'no' && value !== false;
    else if (field === 'labelNl' || field === 'labelEn') {
      const defaults = DEFAULT_README_TOPICS.get(readmeCarouselEditorTopicId);
      edit[field] = String(value || '').trim().slice(0, 180) || defaults?.[field] || readmeCarouselEditorTopicId;
    } else {
      edit[field] = sanitizeReadmeTopicHtml(value);
    }
    state.readmeTopicEdits[readmeCarouselEditorTopicId] = normalizedReadmeTopicEdit(readmeCarouselEditorTopicId, edit);
    renderReadmeTopicEdits();
    renderReadmeTopicCarousels();
    syncReadmeCarouselEditorTopics();
    appendConfigLog('change-readme-topic', { topic: readmeCarouselEditorTopicId, field });
    markConfigDirty(isEnglish() ? 'README topic' : 'LEESMIJ-item');
  }

  function updateReadmeCarouselSlideField(field, value) {
    if (!['src', 'shape', 'altNl', 'altEn', 'captionNl', 'captionEn'].includes(field)) return;
    const slides = ensureReadmeCarouselOverride(readmeCarouselEditorTopicId);
    const slide = slides[readmeCarouselEditorSlideIndex];
    if (!slide) return;
    slide[field] = field === 'shape' ? (value === 'narrow' ? 'narrow' : 'wide') : String(value || '');
    if (field === 'src') {
      slide.embedded = false;
      slide.fileName = '';
    }
    state.readmeCarousels[readmeCarouselEditorTopicId][readmeCarouselEditorSlideIndex] = normalizedReadmeCarouselSlide(slide);
    renderReadmeTopicCarousels();
    renderReadmeCarouselEditorPreview(state.readmeCarousels[readmeCarouselEditorTopicId][readmeCarouselEditorSlideIndex]);
    markConfigDirty(isEnglish() ? 'README carousel' : 'LEESMIJ-carousel');
  }

  function addReadmeCarouselSlide() {
    const slides = ensureReadmeCarouselOverride(readmeCarouselEditorTopicId);
    if (slides.length >= MAX_README_CAROUSEL_SLIDES) return;
    slides.push(normalizedReadmeCarouselSlide());
    readmeCarouselEditorSlideIndex = slides.length - 1;
    renderReadmeTopicCarousels();
    renderReadmeCarouselEditor();
    appendConfigLog('add-readme-carousel-slide', { topic: readmeCarouselEditorTopicId, index: readmeCarouselEditorSlideIndex });
    markConfigDirty(isEnglish() ? 'README carousel slide added' : 'LEESMIJ-carouselslide toegevoegd');
  }

  function removeReadmeCarouselSlide() {
    const slides = ensureReadmeCarouselOverride(readmeCarouselEditorTopicId);
    if (!slides.length) return;
    slides.splice(readmeCarouselEditorSlideIndex, 1);
    readmeCarouselEditorSlideIndex = Math.max(0, Math.min(readmeCarouselEditorSlideIndex, slides.length - 1));
    renderReadmeTopicCarousels();
    renderReadmeCarouselEditor();
    appendConfigLog('remove-readme-carousel-slide', { topic: readmeCarouselEditorTopicId });
    markConfigDirty(isEnglish() ? 'README carousel slide removed' : 'LEESMIJ-carouselslide verwijderd');
  }

  function resetReadmeCarouselTopic() {
    if (state.readmeCarousels) delete state.readmeCarousels[readmeCarouselEditorTopicId];
    readmeCarouselEditorSlideIndex = 0;
    renderReadmeTopicCarousels();
    renderReadmeCarouselEditor();
    appendConfigLog('reset-readme-carousel-topic', { topic: readmeCarouselEditorTopicId });
    markConfigDirty(isEnglish() ? 'README carousel reset' : 'LEESMIJ-carousel hersteld');
  }

  function resetReadmeTopicConfiguration() {
    if (state.readmeTopicEdits) delete state.readmeTopicEdits[readmeCarouselEditorTopicId];
    if (state.readmeCarousels) delete state.readmeCarousels[readmeCarouselEditorTopicId];
    readmeCarouselEditorSlideIndex = 0;
    renderReadmeTopicEdits();
    renderReadmeTopicCarousels();
    syncReadmeCarouselEditorTopics();
    appendConfigLog('reset-readme-topic', { topic: readmeCarouselEditorTopicId });
    markConfigDirty(isEnglish() ? 'README topic reset' : 'LEESMIJ-item hersteld');
  }

  function readmeEmbeddedSourceCharacterTotal() {
    return Object.values(state.readmeCarousels || {}).flatMap(slides => Array.isArray(slides) ? slides : [])
      .reduce((total, slide) => total + (slide?.embedded === true ? String(slide.src || '').length : 0), 0);
  }

  function setReadmeSlideFileStatus(nl, en = nl, error = false) {
    const status = document.getElementById('readmeSlideFileStatus');
    if (!status) return;
    status.textContent = isEnglish() ? en : nl;
    status.classList.toggle('is-error', !!error);
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(String(reader.result || '')));
      reader.addEventListener('error', () => reject(reader.error || new Error('Bestand lezen mislukt.')));
      reader.readAsDataURL(file);
    });
  }

  async function insertReadmeSlideFile() {
    const file = readmePendingSlideFile;
    const topicSelect = document.getElementById('readmeSlideFileTopicSelect');
    const shapeSelect = document.getElementById('readmeSlideFileShapeSelect');
    const insertButton = document.getElementById('readmeSlideFileInsertButton');
    const editButton = document.getElementById('readmeSlideFileEditButton');
    const topicId = topicSelect?.value || '';
    if (!file || !topicId) {
      setReadmeSlideFileStatus('Kies eerst een afbeelding en een LEESMIJ-item.', 'Choose an image and README topic first.', true);
      return;
    }
    if (!README_EMBEDDED_IMAGE_TYPES.has(file.type)) {
      setReadmeSlideFileStatus('Gebruik PNG, JPEG, WebP of GIF.', 'Use PNG, JPEG, WebP, or GIF.', true);
      return;
    }
    if (file.size > MAX_README_EMBEDDED_IMAGE_BYTES) {
      setReadmeSlideFileStatus(
        'Afbeelding te groot. Verklein deze tot maximaal 1,25 MB.',
        'Image too large. Reduce it to no more than 1.25 MB.',
        true
      );
      return;
    }
    if (readmeCarouselSlidesForTopic(topicId).length >= MAX_README_CAROUSEL_SLIDES) {
      setReadmeSlideFileStatus('Dit item heeft al 20 slides.', 'This topic already has 20 slides.', true);
      return;
    }
    if (insertButton) insertButton.disabled = true;
    try {
      const source = await readFileAsDataUrl(file);
      const safeSource = safeReadmeEmbeddedImageSource(source);
      if (!safeSource) throw new Error('Ongeldig beeldbestand.');
      if (readmeEmbeddedSourceCharacterTotal() + safeSource.length > MAX_README_EMBEDDED_TOTAL_CHARS) {
        setReadmeSlideFileStatus(
          'De ingesloten beelden zijn samen te groot voor lokale Config-opslag. Verklein beelden of verwijder een slide.',
          'The embedded images are too large together for local Config storage. Reduce images or remove a slide.',
          true
        );
        return;
      }
      const baseName = String(file.name || 'afbeelding').replace(/\.[^.]+$/, '').trim() || 'afbeelding';
      const slides = ensureReadmeCarouselOverride(topicId);
      slides.push(normalizedReadmeCarouselSlide({
        src: safeSource,
        embedded: true,
        fileName: file.name,
        shape: shapeSelect?.value === 'narrow' ? 'narrow' : 'wide',
        altNl: baseName,
        altEn: baseName
      }));
      readmeCarouselEditorTopicId = topicId;
      readmeCarouselEditorSlideIndex = slides.length - 1;
      renderReadmeTopicCarousels();
      syncReadmeCarouselEditorTopics();
      appendConfigLog('insert-readme-slide-file', {
        topic: topicId,
        fileName: file.name,
        mimeType: file.type,
        bytes: file.size
      });
      markConfigDirty(isEnglish() ? 'README image inserted' : 'LEESMIJ-beeld ingevoegd');
      setReadmeSlideFileStatus(
        `${file.name} is als slide ingevoegd. Bewerk nu alt-tekst en onderschrift en bewaar Config.`,
        `Inserted ${file.name}. Edit alt text and caption, then save Config.`
      );
      if (editButton) editButton.disabled = false;
      const input = document.getElementById('readmeSlideFileInput');
      if (input) input.value = '';
      readmePendingSlideFile = null;
    } catch (_err) {
      setReadmeSlideFileStatus('Afbeelding kon niet worden gelezen.', 'The image could not be read.', true);
    } finally {
      if (insertButton) insertButton.disabled = !readmePendingSlideFile;
    }
  }

  function registerReadmeCarousel() {
    document.querySelectorAll('[data-readme-carousel]').forEach(carousel => {
      if (!carousel || carousel.dataset.carouselBound === '1') return;
      carousel.dataset.carouselBound = '1';
      const slides = Array.from(carousel.querySelectorAll('[data-readme-slide]'));
      const controls = carousel.querySelector('[data-readme-carousel-controls]');
      if (!slides.length || !controls) return;

      let activeIndex = 0;
      const showSlide = requestedIndex => {
        activeIndex = (requestedIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
          const active = index === activeIndex;
          slide.classList.toggle('is-active', active);
          slide.hidden = !active;
          slide.setAttribute('aria-hidden', String(!active));
        });
        carousel.dataset.activeShape = slides[activeIndex]?.dataset.readmeShape || 'wide';
        controls.querySelectorAll('[data-readme-carousel-dot]').forEach((dot, index) => {
          const active = index === activeIndex;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-selected', String(active));
        });
      };

      if (slides.length < 2) {
        controls.hidden = true;
        controls.setAttribute('aria-hidden', 'true');
        showSlide(0);
        return;
      }

      controls.hidden = false;
      controls.setAttribute('aria-hidden', 'false');
      controls.innerHTML = `
        <button type="button" data-readme-carousel-prev aria-label="Vorig README-beeld">←</button>
        <div class="readme-carousel-dots" role="tablist" aria-label="Kies een README-beeld">
          ${slides.map((_slide, index) => `<button type="button" data-readme-carousel-dot="${index}" aria-label="README-beeld ${index + 1}" aria-selected="${index === 0}"></button>`).join('')}
        </div>
        <button type="button" data-readme-carousel-next aria-label="Volgend README-beeld">→</button>`;
      controls.querySelector('[data-readme-carousel-prev]')?.addEventListener('click', () => showSlide(activeIndex - 1));
      controls.querySelector('[data-readme-carousel-next]')?.addEventListener('click', () => showSlide(activeIndex + 1));
      controls.querySelectorAll('[data-readme-carousel-dot]').forEach(dot => {
        dot.addEventListener('click', () => showSlide(Number(dot.getAttribute('data-readme-carousel-dot')) || 0));
      });
      carousel.tabIndex = 0;
      carousel.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          showSlide(activeIndex - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          showSlide(activeIndex + 1);
        }
      });
      showSlide(0);
    });
  }

  function registerReadmeExternalWindows() {
    document.querySelectorAll('[data-readme-external-window]').forEach(link => {
      if (link.dataset.externalWindowBound === '1') return;
      link.dataset.externalWindowBound = '1';
      link.addEventListener('click', event => {
        if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const href = link.href;
        if (!href) return;
        const popup = window.open(
          href,
          '_blank',
          'popup=yes,width=1120,height=780,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=yes,status=no'
        );
        if (!popup) return;
        event.preventDefault();
        try { popup.opener = null; } catch (_err) {}
        try { popup.focus(); } catch (_err) {}
      });
    });
  }

  function projectConfigSnapshotFromDocument(documentValue, expectedKind) {
    if (!documentValue || typeof documentValue !== 'object' || Array.isArray(documentValue)) return null;
    if (documentValue.schema !== PROJECT_CONFIG_SCHEMA || documentValue.version !== VERSION) return null;
    if (expectedKind && documentValue.kind !== expectedKind) return null;
    if (documentValue.enabled === false) return null;
    const snapshot = documentValue.config;
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) return null;
    return { ...snapshot, version: VERSION };
  }

  function mergeProjectConfigSnapshots(base = {}, override = {}) {
    const merged = { ...base, ...override, version: VERSION };
    if (base.preconfig || override.preconfig) {
      merged.preconfig = {
        ...(base.preconfig || {}),
        ...(override.preconfig || {}),
        insertion: {
          ...(base.preconfig?.insertion || {}),
          ...(override.preconfig?.insertion || {})
        }
      };
    }
    if (base.features || override.features) {
      merged.features = { ...(base.features || {}), ...(override.features || {}) };
    }
    for (const key of ['directPlacementGeneral', 'directPlacementPresentation', 'greedyGrowConfig', 'randomPlacementConfig']) {
      if (base[key] || override[key]) merged[key] = { ...(base[key] || {}), ...(override[key] || {}) };
    }
    // Deze collecties zijn volledige gebruikerskeuzes. Als de user-config de
    // sleutel bevat, vervangt die de standaardcollectie ook wanneer zij leeg is.
    for (const key of ['readmeTopicEdits', 'readmeCarousels', 'sourceAxes', 'topMenusAbove', 'topMenuChoices']) {
      if (Object.prototype.hasOwnProperty.call(override, key)) merged[key] = override[key];
    }
    return merged;
  }

  function syncProjectConfigStatus() {
    const status = document.getElementById('projectConfigLayerStatus');
    if (!status) return;
    if (projectConfigStatus.messageNl || projectConfigStatus.messageEn) {
      status.textContent = isEnglish()
        ? (projectConfigStatus.messageEn || projectConfigStatus.messageNl)
        : (projectConfigStatus.messageNl || projectConfigStatus.messageEn);
      return;
    }
    const layersNl = [
      projectConfigStatus.defaultLoaded ? 'standaard geladen' : 'code-standaard actief',
      projectConfigStatus.userLoaded ? 'project-user-config actief' : 'geen project-user-config',
      projectConfigStatus.browserLoaded ? 'lokale browsersnapshot als laatste toegepast' : 'geen lokale browsersnapshot'
    ];
    const layersEn = [
      projectConfigStatus.defaultLoaded ? 'default loaded' : 'code default active',
      projectConfigStatus.userLoaded ? 'project user config active' : 'no project user config',
      projectConfigStatus.browserLoaded ? 'local browser snapshot applied last' : 'no local browser snapshot'
    ];
    status.textContent = (isEnglish() ? layersEn : layersNl).join(' · ');
  }

  async function fetchProjectConfigDocument(path) {
    const response = await fetch(`${path}?v=${encodeURIComponent(VERSION)}&nocache=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function loadProjectConfigLayers() {
    let merged = null;
    try {
      const defaultDocument = await fetchProjectConfigDocument(PROJECT_DEFAULT_CONFIG_PATH);
      const defaultSnapshot = projectConfigSnapshotFromDocument(defaultDocument, 'default');
      if (defaultSnapshot) {
        merged = defaultSnapshot;
        projectConfigStatus.defaultLoaded = true;
      }
    } catch (_err) {
      projectConfigStatus.defaultLoaded = false;
    }
    try {
      const userDocument = await fetchProjectConfigDocument(PROJECT_USER_CONFIG_PATH);
      const userSnapshot = projectConfigSnapshotFromDocument(userDocument, 'user');
      if (userSnapshot) {
        merged = mergeProjectConfigSnapshots(merged || {}, userSnapshot);
        projectConfigStatus.userLoaded = true;
      }
    } catch (_err) {
      projectConfigStatus.userLoaded = false;
    }
    if (merged) applyConfigSnapshot(merged);
    syncProjectConfigStatus();
    return !!merged;
  }

  function currentProjectUserConfigDocument() {
    return {
      schema: PROJECT_CONFIG_SCHEMA,
      version: VERSION,
      kind: 'user',
      enabled: true,
      savedAt: new Date().toISOString(),
      precedence: 'overrides config/default-config.json; browser-local saved Config is applied afterwards',
      config: {
        ...currentConfigSnapshot(),
        topMenusAbove: normalizeTopMenusAbove(state.topMenusAbove)
      }
    };
  }

  function downloadProjectUserConfig() {
    const content = `${JSON.stringify(currentProjectUserConfigDocument(), null, 2)}\n`;
    download('user-config.json', content, 'application/json');
    projectConfigStatus.messageNl = 'user-config.json gedownload. Plaats het bestand in de map config/ vóór je de projectzip maakt.';
    projectConfigStatus.messageEn = 'Downloaded user-config.json. Put it in config/ before creating the project zip.';
    syncProjectConfigStatus();
  }

  async function writeProjectUserConfig() {
    const button = document.getElementById('writeProjectUserConfigButton');
    if (button) button.disabled = true;
    const content = `${JSON.stringify(currentProjectUserConfigDocument(), null, 2)}\n`;
    try {
      const response = await fetch('/__opengraph_save_file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: PROJECT_USER_CONFIG_PATH, content })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'save endpoint failed');
      projectConfigStatus.userLoaded = true;
      projectConfigStatus.messageNl = `Actuele Config geschreven naar ${PROJECT_USER_CONFIG_PATH} (${result.bytes || content.length} bytes). Dit bestand gaat mee in de projectzip.`;
      projectConfigStatus.messageEn = `Current Config written to ${PROJECT_USER_CONFIG_PATH} (${result.bytes || content.length} bytes). It will be included in the project zip.`;
      appendConfigLog('write-project-user-config', { path: PROJECT_USER_CONFIG_PATH, bytes: result.bytes || content.length });
    } catch (_err) {
      const fallback = document.getElementById('downloadProjectUserConfigButton');
      projectConfigStatus.messageNl = 'Direct schrijven kan alleen via start_local_viewer.bat. Gebruik anders Download user-config en plaats het bestand in config/.';
      projectConfigStatus.messageEn = 'Direct writing requires start_local_viewer.bat. Otherwise download user-config and put it in config/.';
      if (fallback) fallback.focus();
    } finally {
      if (button) button.disabled = false;
      syncProjectConfigStatus();
    }
  }

  function currentConfigSnapshot() {
    return {
      version: VERSION,
      profile: featureEnabled('adverbs') ? 'custom' : 'base',
      preconfig: insertionPreconfigSnapshot(),
      features: { ...state.features },
      language: state.language,
      centerMode: state.centerMode,
      projection: state.projection,
      sourceAxes: normalizedSourceAxes(),
      treeChoice: state.treeChoice,
      functionalOrder: state.functionalOrder,
      branchOrder: state.branchOrder,
      layoutDensity: state.layoutDensity,
      viewFitMode: state.viewFitMode,
      helpLayoutMode: state.helpLayoutMode,
      readmeTopicEdits: normalizeReadmeTopicEdits(state.readmeTopicEdits),
      readmeCarousels: normalizeReadmeCarousels(state.readmeCarousels),
      showGrid: !!state.showGrid,
      showRelations: !!state.showRelations,
      showLabels: !!state.showLabels,
      placementMode: validPlacementMode(state.placementMode),
      multiOgnExampleId: state.multiOgnExampleId,
      directPlacementGeneral: normalizeDirectPlacementGeneral(state.directPlacementGeneral),
      greedyGrowConfig: normalizeGreedyGrowConfig(state.greedyGrowConfig),
      randomPlacementConfig: normalizeRandomPlacementConfig(state.randomPlacementConfig),
      lexProjectionColor: state.lexProjectionColor,
      syntProjectionColor: state.syntProjectionColor,
      logProjectionColor: state.logProjectionColor,
      gridColor: state.gridColor,
      gridLineWeight: validLineWeight(state.gridLineWeight),
      gridSizeHorizontal: validGridSize(state.gridSizeHorizontal),
      gridSizeVertical: validGridSize(state.gridSizeVertical),
      treeLineColor: state.treeLineColor,
      treeLineWeight: validLineWeight(state.treeLineWeight, 'strong'),
      kernelBranchHorizontal: validKernelBranchSpacing(state.kernelBranchHorizontal),
      kernelBranchVertical: validKernelBranchSpacing(state.kernelBranchVertical),
      kernelBranchFlip: validKernelBranchFlip(state.kernelBranchFlip),
      multiOgnFlipHold: validMultiOgnFlipHold(state.multiOgnFlipHold),
      causalAnaphorVariant: globalThis.OGNUtteranceKernels?.validCausalAnaphorVariant?.(state.causalAnaphorVariant) || 'die',
      projectionLineWeight: validLineWeight(state.projectionLineWeight),
      boxLineWeight: validLineWeight(state.boxLineWeight),
      projectionBoxDraggable: !!state.projectionBoxDraggable,
      projectionBoxManual: state.projectionBoxManual || null,
      southBoxDraggable: !!state.southBoxDraggable,
      southBoxManual: state.southBoxManual || null,
      freeSlotCount: state.freeSlotCount,
      ...(featureEnabled('adverbs') ? {
        lexFreeSlotCount: state.lexFreeSlotCount,
        lexFreeSlotPlacement: state.lexFreeSlotPlacement,
        lexInsertionContent: state.lexInsertionContent,
        logInsertionInterval: state.logInsertionInterval
      } : {}),
      topMenusAbove: normalizeTopMenusAbove(state.topMenusAbove)
    };
  }

  function appendConfigLog(action, details = {}) {
    const entry = { time: new Date().toISOString(), version: VERSION, action, details };
    try {
      const raw = localStorage.getItem(CONFIG_LOG_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(entry);
      while (list.length > 120) list.shift();
      localStorage.setItem(CONFIG_LOG_KEY, JSON.stringify(list));
    } catch (_err) {}
    return entry;
  }

  function syncConfigSaveStatus(saved = null) {
    if (!els.configSaveStatus) return;
    if (saved === true) {
      els.configSaveStatus.textContent = isEnglish()
        ? 'Config saved locally. Changes are also written to the local config log.'
        : 'Config lokaal bewaard. Wijzigingen staan ook in het lokale config-log.';
      return;
    }
    if (saved === false) {
      els.configSaveStatus.textContent = isEnglish()
        ? 'Config restored from the last saved local snapshot.'
        : 'Config hersteld uit de laatst lokaal bewaarde snapshot.';
      return;
    }
    els.configSaveStatus.textContent = isEnglish()
      ? 'Config changes are applied immediately. Use Save to store a local snapshot; use No to restore the last saved snapshot.'
      : 'Configwijzigingen worden direct toegepast. Gebruik Ja om lokaal te bewaren; gebruik Nee om de laatst bewaarde snapshot te herstellen.';
  }

  function markConfigDirty(label = '') {
    if (!els.configSaveStatus) return;
    const suffix = label ? ` · ${label}` : '';
    els.configSaveStatus.textContent = isEnglish()
      ? `Unstored config change${suffix}. Use Save or No.`
      : `Niet-bewaarde configwijziging${suffix}. Kies Ja of Nee.`;
  }

  function applyConfigSnapshot(snapshot = {}) {
    if (!snapshot || typeof snapshot !== 'object') return false;
    const currentVersionSnapshot = snapshot.version === VERSION;
    state.preconfig = { insertion: { ...DEFAULT_INSERTION_AXES } };
    if (currentVersionSnapshot && snapshot.preconfig?.insertion && typeof snapshot.preconfig.insertion === 'object') {
      for (const axisId of Object.keys(INSERTION_AXIS_DEFINITIONS)) {
        if (typeof snapshot.preconfig.insertion[axisId] === 'boolean') {
          state.preconfig.insertion[axisId] = snapshot.preconfig.insertion[axisId];
        }
      }
    }
    state.features = { ...DEFAULT_FEATURES };
    if (currentVersionSnapshot && snapshot.features && typeof snapshot.features === 'object') {
      for (const featureId of Object.keys(FEATURE_DEFINITIONS)) {
        if (typeof snapshot.features[featureId] === 'boolean') state.features[featureId] = snapshot.features[featureId];
      }
    }
    for (const featureId of Object.keys(FEATURE_DEFINITIONS)) {
      if (!featureRequirementsMet(featureId)) state.features[featureId] = false;
    }
    if (typeof snapshot.language === 'string') state.language = normalizeLanguage(snapshot.language);
    if (typeof snapshot.centerMode === 'string') state.centerMode = (snapshot.centerMode === 'ft' || snapshot.centerMode === 'functional') ? 'ft' : 'syntax';
    if (currentVersionSnapshot) {
      if (typeof snapshot.projection === 'string' && PROJECTION_OPTIONS.some(option => option.id === snapshot.projection)) state.projection = snapshot.projection;
      if (Array.isArray(snapshot.sourceAxes)) setSourceAxes(snapshot.sourceAxes, { activateSource: false });
    } else {
      state.projection = 'axes';
      state.sourceAxes = SOURCE_AXIS_IDS.slice();
    }
    if (typeof snapshot.treeChoice === 'string') state.treeChoice = snapshot.treeChoice;
    if (typeof snapshot.functionalOrder === 'string') state.functionalOrder = snapshot.functionalOrder;
    if (typeof snapshot.branchOrder === 'string') state.branchOrder = snapshot.branchOrder;
    if (currentVersionSnapshot) {
      if (typeof snapshot.layoutDensity === 'string') state.layoutDensity = validLayoutDensity(snapshot.layoutDensity);
      if (typeof snapshot.viewFitMode === 'string') state.viewFitMode = validViewFitMode(snapshot.viewFitMode);
    } else {
      // rc.20 wijzigt bewust de desktopdefault. Een oudere lokaal bewaarde
      // auto/window-snapshot mag MAX niet stilzwijgend weer ongedaan maken.
      state.layoutDensity = 'max';
      state.viewFitMode = 'max';
    }
    if (typeof snapshot.placementMode === 'string') state.placementMode = validPlacementMode(snapshot.placementMode);
    if (typeof snapshot.multiOgnExampleId === 'string') {
      state.multiOgnExampleId = snapshot.multiOgnExampleId === MULTI_OGN_ANAPHOR_DEMO.id || globalThis.OGNUtteranceKernels?.definitionFor?.(snapshot.multiOgnExampleId)
        ? snapshot.multiOgnExampleId : MULTI_OGN_ANAPHOR_DEMO.id;
    }
    const legacyDirectMethod = snapshot.placementMode === 'random'
      ? snapshot.randomPlacementConfig
      : snapshot.greedyGrowConfig;
    const hasLegacyDirectGeneral = Object.prototype.hasOwnProperty.call(snapshot, 'directPlacementPresentation')
      || Number.isFinite(Number(legacyDirectMethod?.targetCount))
      || Number.isFinite(Number(legacyDirectMethod?.intervalMs));
    const migratedDirectGeneral = {
      ...(snapshot.directPlacementPresentation || {}),
      ...(Number.isFinite(Number(legacyDirectMethod?.targetCount)) ? { targetCount: legacyDirectMethod.targetCount } : {}),
      ...(Number.isFinite(Number(legacyDirectMethod?.intervalMs)) ? { intervalMs: legacyDirectMethod.intervalMs } : {})
    };
    state.directPlacementGeneral = normalizeDirectPlacementGeneral(
      Object.prototype.hasOwnProperty.call(snapshot, 'directPlacementGeneral')
        ? snapshot.directPlacementGeneral
        : hasLegacyDirectGeneral
          ? migratedDirectGeneral
          : state.directPlacementGeneral
    );
    state.greedyGrowConfig = normalizeGreedyGrowConfig(
      Object.prototype.hasOwnProperty.call(snapshot, 'greedyGrowConfig')
        ? snapshot.greedyGrowConfig
        : state.greedyGrowConfig
    );
    state.randomPlacementConfig = normalizeRandomPlacementConfig(
      Object.prototype.hasOwnProperty.call(snapshot, 'randomPlacementConfig')
        ? snapshot.randomPlacementConfig
        : state.randomPlacementConfig
    );
    state.directPlacementIterationBaseSeed = state.randomPlacementConfig.seed;
    state.directPlacementIterationIndex = 0;
    state.directPlacementSeed = randomSeedForIteration(state.directPlacementIterationBaseSeed, 0);
    stopDirectPlacementPlayback();
    state.directPlacementState = null;
    if (typeof snapshot.lexProjectionColor === 'string') state.lexProjectionColor = snapshot.lexProjectionColor;
    if (typeof snapshot.syntProjectionColor === 'string') state.syntProjectionColor = snapshot.syntProjectionColor;
    if (typeof snapshot.logProjectionColor === 'string') state.logProjectionColor = snapshot.logProjectionColor;
    if (typeof snapshot.gridColor === 'string') state.gridColor = snapshot.gridColor;
    if (typeof snapshot.gridLineWeight === 'string') state.gridLineWeight = validLineWeight(snapshot.gridLineWeight);
    if (typeof snapshot.gridSizeHorizontal === 'string') state.gridSizeHorizontal = validGridSize(snapshot.gridSizeHorizontal);
    if (typeof snapshot.gridSizeVertical === 'string') state.gridSizeVertical = validGridSize(snapshot.gridSizeVertical);
    if (typeof snapshot.treeLineColor === 'string') state.treeLineColor = snapshot.treeLineColor;
    if (typeof snapshot.treeLineWeight === 'string') state.treeLineWeight = validLineWeight(snapshot.treeLineWeight, 'strong');
    if (typeof snapshot.kernelBranchHorizontal === 'string') state.kernelBranchHorizontal = validKernelBranchSpacing(snapshot.kernelBranchHorizontal);
    if (typeof snapshot.kernelBranchVertical === 'string') state.kernelBranchVertical = validKernelBranchSpacing(snapshot.kernelBranchVertical);
    if (typeof snapshot.kernelBranchFlip === 'string') state.kernelBranchFlip = validKernelBranchFlip(snapshot.kernelBranchFlip);
    if (typeof snapshot.multiOgnFlipHold === 'string') state.multiOgnFlipHold = validMultiOgnFlipHold(snapshot.multiOgnFlipHold);
    if (typeof snapshot.causalAnaphorVariant === 'string') state.causalAnaphorVariant = globalThis.OGNUtteranceKernels?.validCausalAnaphorVariant?.(snapshot.causalAnaphorVariant) || 'die';
    if (typeof snapshot.projectionLineWeight === 'string') state.projectionLineWeight = validLineWeight(snapshot.projectionLineWeight);
    if (typeof snapshot.boxLineWeight === 'string') state.boxLineWeight = validLineWeight(snapshot.boxLineWeight);
    if (typeof snapshot.projectionBoxDraggable === 'boolean') state.projectionBoxDraggable = snapshot.projectionBoxDraggable;
    if (snapshot.projectionBoxManual && Number.isFinite(snapshot.projectionBoxManual.left) && Number.isFinite(snapshot.projectionBoxManual.top)) state.projectionBoxManual = snapshot.projectionBoxManual;
    else if ('projectionBoxManual' in snapshot) state.projectionBoxManual = null;
    if (typeof snapshot.southBoxDraggable === 'boolean') state.southBoxDraggable = snapshot.southBoxDraggable;
    if (snapshot.southBoxManual && Number.isFinite(snapshot.southBoxManual.left) && Number.isFinite(snapshot.southBoxManual.top)) state.southBoxManual = snapshot.southBoxManual;
    else if ('southBoxManual' in snapshot) state.southBoxManual = null;
    if (typeof snapshot.helpLayoutMode === 'string' && ['auto','stacked','side'].includes(snapshot.helpLayoutMode)) state.helpLayoutMode = snapshot.helpLayoutMode;
    state.readmeCarousels = currentVersionSnapshot
      ? normalizeReadmeCarousels(snapshot.readmeCarousels)
      : {};
    state.readmeTopicEdits = currentVersionSnapshot
      ? normalizeReadmeTopicEdits(snapshot.readmeTopicEdits)
      : {};
    if (typeof snapshot.showGrid === 'boolean') state.showGrid = snapshot.showGrid;
    if (typeof snapshot.showRelations === 'boolean') state.showRelations = snapshot.showRelations;
    if (typeof snapshot.showLabels === 'boolean') state.showLabels = snapshot.showLabels;
    if (Number.isFinite(Number(snapshot.freeSlotCount))) state.freeSlotCount = Math.max(0, Math.min(6, Number(snapshot.freeSlotCount)));
    // Oude Config-snapshots mogen vrije-positievelden bevatten. Ze worden
    // genegeerd; nieuwe snapshots schrijven ze niet meer.
    if (Number.isFinite(Number(snapshot.lexFreeSlotCount))) state.lexFreeSlotCount = Math.max(0, Math.min(8, Number(snapshot.lexFreeSlotCount)));
    if (typeof snapshot.lexFreeSlotPlacement === 'string') state.lexFreeSlotPlacement = snapshot.lexFreeSlotPlacement;
    if (typeof snapshot.lexInsertionContent === 'string') state.lexInsertionContent = snapshot.lexInsertionContent;
    if (typeof snapshot.logInsertionInterval === 'string') state.logInsertionInterval = validLogInsertionInterval(snapshot.logInsertionInterval);
    const savedTopMenus = Array.isArray(snapshot.topMenusAbove)
      ? snapshot.topMenusAbove
      : snapshot.topMenuChoices;
    if (Array.isArray(savedTopMenus)) state.topMenusAbove = normalizeTopMenusAbove(savedTopMenus);
    try {
      localStorage.setItem('opengraph_projection_color_lex', state.lexProjectionColor);
      localStorage.setItem('opengraph_projection_color_synt', state.syntProjectionColor);
      localStorage.setItem('opengraph_projection_color_log', state.logProjectionColor);
      localStorage.setItem('opengraph_grid_color', state.gridColor);
      localStorage.setItem('opengraph_grid_line_weight', state.gridLineWeight);
      localStorage.setItem('opengraph_grid_size_horizontal', validGridSize(state.gridSizeHorizontal));
      localStorage.setItem('opengraph_grid_size_vertical', validGridSize(state.gridSizeVertical));
      localStorage.setItem('opengraph_tree_line_color', state.treeLineColor);
      localStorage.setItem('opengraph_tree_line_weight', state.treeLineWeight);
      localStorage.setItem('opengraph_kernel_branch_horizontal', validKernelBranchSpacing(state.kernelBranchHorizontal));
      localStorage.setItem('opengraph_kernel_branch_vertical', validKernelBranchSpacing(state.kernelBranchVertical));
      localStorage.setItem('opengraph_kernel_branch_flip', validKernelBranchFlip(state.kernelBranchFlip));
      localStorage.setItem('opengraph_multi_ogn_flip_hold', validMultiOgnFlipHold(state.multiOgnFlipHold));
      localStorage.setItem('opengraph_causal_anaphor_variant', state.causalAnaphorVariant);
      localStorage.setItem('opengraph_projection_line_weight', state.projectionLineWeight);
      localStorage.setItem('opengraph_box_line_weight', state.boxLineWeight);
      localStorage.setItem('opengraph_projection_box_draggable', state.projectionBoxDraggable ? '1' : '0');
      localStorage.setItem('opengraph_south_box_draggable', state.southBoxDraggable ? '1' : '0');
      localStorage.setItem('opengraph_source_axes_v200rc9', JSON.stringify(normalizedSourceAxes()));
      if (state.projectionBoxManual) localStorage.setItem('opengraph_projection_box_manual_v1014', JSON.stringify(state.projectionBoxManual));
      else localStorage.removeItem('opengraph_projection_box_manual_v1014');
      if (state.southBoxManual) localStorage.setItem('opengraph_south_box_manual_v4578', JSON.stringify(state.southBoxManual));
      else localStorage.removeItem('opengraph_south_box_manual_v4578');
    } catch (_err) {}
    if (!featureEnabled('adverbs')) resetAdverbFeatureState();
    refreshExamplesForFeatures();
    applyFeatureVisibility();
    renderReadmeTopicEdits();
    renderReadmeTopicCarousels();
    syncReadmeCarouselEditorTopics();
    resetManualViewBox();
    return true;
  }

  function loadSavedConfigSnapshot() {
    try {
      const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!raw) return false;
      return applyConfigSnapshot(JSON.parse(raw));
    } catch (_err) { return false; }
  }

  function saveConfigSnapshot() {
    const snapshot = currentConfigSnapshot();
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (_err) {
      if (els.configSaveStatus) {
        els.configSaveStatus.textContent = isEnglish()
          ? 'Config could not be saved. Embedded images may exceed browser storage; reduce or remove an image.'
          : 'Config kon niet worden bewaard. Ingesloten beelden passen mogelijk niet in de browseropslag; verklein of verwijder een beeld.';
      }
      appendConfigLog('save-config-failed', {
        reason: 'local-storage',
        embeddedCharacters: readmeEmbeddedSourceCharacterTotal()
      });
      return false;
    }
    appendConfigLog('save-config', {
      version: VERSION,
      profile: snapshot.profile,
      readmeTopicEdits: Object.keys(snapshot.readmeTopicEdits || {}).length,
      readmeCarousels: Object.fromEntries(
        Object.entries(snapshot.readmeCarousels || {}).map(([topicId, slides]) => [topicId, slides.length])
      ),
      embeddedCharacters: readmeEmbeddedSourceCharacterTotal()
    });
    syncConfigSaveStatus(true);
    return true;
  }

  async function discardConfigChanges() {
    let ok = false;
    try {
      const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (raw) ok = applyConfigSnapshot(JSON.parse(raw));
    } catch (_err) {}
    if (featureEnabled('adverbs')) {
      await loadLexiconUsageProfiles();
      await loadAdverbOptionsFromHtml();
    }
    refreshExamplesForFeatures();
    applyExampleAdverbDefaults();
    applyFeatureVisibility();
    appendConfigLog(ok ? 'restore-config' : 'restore-config-missing', currentConfigSnapshot());
    syncConfigSaveStatus(ok ? false : null);
    syncControls();
    applyLanguage();
    render();
  }

  function downloadConfigLog() {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(CONFIG_LOG_KEY) || '[]'); } catch (_err) { list = []; }
    const lines = [
      `OpenGraph local config log`,
      `version=${VERSION}`,
      `downloaded=${new Date().toISOString()}`,
      '',
      ...list.map(entry => `${entry.time || ''}\t${entry.action || ''}\t${JSON.stringify(entry.details || {})}`)
    ];
    download(`opengraph-local-config-log-${VERSION}.txt`, lines.join('\n'), 'text/plain');
  }

  function setAppScreen(screen = 'main', preferredConfigScope = '') {
    const next = ['main', 'config', 'help'].includes(screen) ? screen : 'main';
    const isMain = next === 'main';
    const isConfig = next === 'config';
    const isHelp = next === 'help';
    if (!isConfig) configScopeManual = false;
    if (!isMain) stopDirectPlacementPlayback();
    document.body.classList.toggle('main-screen-active', isMain);
    document.body.classList.toggle('config-screen-active', isConfig);
    document.body.classList.toggle('help-screen-active', isHelp);
    els.openConfigButton?.setAttribute('aria-expanded', isConfig ? 'true' : 'false');
    els.closeConfigButton?.setAttribute('aria-expanded', isConfig ? 'true' : 'false');
    els.openHelpButton?.setAttribute('aria-expanded', isHelp ? 'true' : 'false');
    els.closeHelpButton?.setAttribute('aria-expanded', isHelp ? 'true' : 'false');
    if (isConfig) {
      configScopeManual = false;
      syncConfigMethodScope();
      if (!configMethodScope && ['general', 'language-tree', 'multi-ogn-anaphor', 'direct-shared'].includes(preferredConfigScope)) {
        activeConfigScope = preferredConfigScope;
        const allowedTabs = configTabsForScope(preferredConfigScope);
        if (!allowedTabs.includes(activeConfigTab)) activeConfigTab = allowedTabs[0];
        lastFullConfigScope = activeConfigScope;
        lastFullConfigTab = activeConfigTab;
        syncConfigScopeUi();
      }
      activateConfigTab(configMethodScope ? 'direct' : activeConfigTab);
    }
    window.setTimeout(() => {
      syncExampleSelectSizing();
      syncMainTopbarLayout();
      try { render(); } catch (_) {}
      if (isConfig) els.closeConfigButton?.focus?.();
      else if (isHelp) els.closeHelpButton?.focus?.();
      else els.openConfigButton?.focus?.();
    }, 0);
  }

  function setConfigScreen(open, preferredConfigScope = '') {
    setAppScreen(open ? 'config' : 'main', preferredConfigScope);
  }

  function setHelpScreen(open) {
    // rc.18: open altijd op de intro, zodat tekst direct in het rechter paneel
    // staat en niet pas na een extra onderwerpklik verschijnt.
    if (open) setHelpTopic('readme');
    setAppScreen(open ? 'help' : 'main');
  }


  function safeStoreProjectionBoxManual(value) {
    state.projectionBoxManual = value;
    try {
      if (value && Number.isFinite(value.left) && Number.isFinite(value.top)) {
        localStorage.setItem('opengraph_projection_box_manual_v1014', JSON.stringify({ left: Math.round(value.left), top: Math.round(value.top) }));
      } else {
        localStorage.removeItem('opengraph_projection_box_manual_v1014');
      }
    } catch (_err) {}
  }

  function updateProjectionBoxDraggable(enabled) {
    state.projectionBoxDraggable = !!enabled;
    try { localStorage.setItem('opengraph_projection_box_draggable', state.projectionBoxDraggable ? '1' : '0'); } catch (_err) {}
    if (els.projectionBoxDraggableInput) els.projectionBoxDraggableInput.checked = state.projectionBoxDraggable;
    const box = document.querySelector('.main-grid-controls');
    if (box) box.classList.toggle('is-draggable', state.projectionBoxDraggable);
    syncMainOverlayControlPlacement();
  }

  function bindProjectionBoxDrag() {
    const box = document.querySelector('.main-grid-controls');
    const host = els.canvasWrap || workspaceForStage();
    if (!box || !host || box.dataset.dragBound === '1') return;
    box.dataset.dragBound = '1';

    box.addEventListener('dblclick', event => {
      if (event.target?.closest?.('button,input,select,a,label')) return;
      safeStoreProjectionBoxManual(null);
      state.projectionBoxDrag = null;
      syncMainOverlayControlPlacement();
      markConfigDirty('Projecties-box');
      event.preventDefault();
      event.stopPropagation();
    });

    box.addEventListener('pointerdown', event => {
      if (!state.projectionBoxDraggable) return;
      if (event.button !== undefined && event.button !== 0) return;
      if (event.target?.closest?.('button,input,select,a,label')) return;
      const rect = box.getBoundingClientRect();
      const hostRect = host.getBoundingClientRect();
      state.projectionBoxDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left - hostRect.left,
        startTop: rect.top - hostRect.top,
        width: rect.width,
        height: rect.height,
        moved: false
      };
      box.setPointerCapture?.(event.pointerId);
      box.classList.add('is-dragging');
      event.preventDefault();
      event.stopPropagation();
    });

    box.addEventListener('pointermove', event => {
      const drag = state.projectionBoxDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const hostRect = host.getBoundingClientRect();
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      const minLeft = 8;
      const minTop = 8;
      const maxLeft = Math.max(minLeft, hostRect.width - drag.width - 8);
      const maxTop = Math.max(minTop, hostRect.height - drag.height - 8);
      const left = Math.round(Math.max(minLeft, Math.min(maxLeft, drag.startLeft + dx)));
      const top = Math.round(Math.max(minTop, Math.min(maxTop, drag.startTop + dy)));
      document.documentElement.style.setProperty('--main-controls-left', `${left}px`);
      document.documentElement.style.setProperty('--main-controls-top', `${top}px`);
      safeStoreProjectionBoxManual({ left, top });
      event.preventDefault();
      event.stopPropagation();
    });

    const finish = event => {
      const drag = state.projectionBoxDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (drag.moved) {
        markConfigDirty('Projecties-box positie');
        appendConfigLog('move-projection-box', state.projectionBoxManual || {});
      }
      state.projectionBoxDrag = null;
      box.classList.remove('is-dragging');
      try { box.releasePointerCapture?.(event.pointerId); } catch (_err) {}
      event.preventDefault();
      event.stopPropagation();
    };
    box.addEventListener('pointerup', finish);
    box.addEventListener('pointercancel', finish);
  }

  function safeStoreSouthBoxManual(value) {
    state.southBoxManual = value;
    try {
      if (value && Number.isFinite(value.left) && Number.isFinite(value.top)) {
        localStorage.setItem('opengraph_south_box_manual_v4578', JSON.stringify({ left: Math.round(value.left), top: Math.round(value.top) }));
      } else {
        localStorage.removeItem('opengraph_south_box_manual_v4578');
      }
    } catch (_err) {}
  }

  function updateSouthBoxDraggable(enabled) {
    state.southBoxDraggable = !!enabled;
    try { localStorage.setItem('opengraph_south_box_draggable', state.southBoxDraggable ? '1' : '0'); } catch (_err) {}
    if (els.southBoxDraggableInput) els.southBoxDraggableInput.checked = state.southBoxDraggable;
    const box = document.querySelector('.main-south-control');
    if (box) box.classList.toggle('is-draggable', state.southBoxDraggable);
    syncMainOverlayControlPlacement();
  }

  function bindSouthBoxDrag() {
    const box = document.querySelector('.main-south-control');
    const host = els.canvasWrap || workspaceForStage();
    if (!box || !host || box.dataset.dragBound === '1') return;
    box.dataset.dragBound = '1';

    box.addEventListener('dblclick', event => {
      safeStoreSouthBoxManual(null);
      state.southBoxDrag = null;
      syncMainOverlayControlPlacement();
      event.preventDefault();
      event.stopPropagation();
    });

    box.addEventListener('pointerdown', event => {
      if (!state.southBoxDraggable) return;
      if (event.button !== undefined && event.button !== 0) return;
      if (event.target?.closest?.('button,input,select,a,label')) return;
      const rect = box.getBoundingClientRect();
      const hostRect = host.getBoundingClientRect();
      state.southBoxDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left - hostRect.left,
        startTop: rect.top - hostRect.top,
        width: rect.width,
        height: rect.height,
        moved: false
      };
      box.setPointerCapture?.(event.pointerId);
      box.classList.add('is-dragging');
      event.preventDefault();
      event.stopPropagation();
    });

    box.addEventListener('pointermove', event => {
      const drag = state.southBoxDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const hostRect = host.getBoundingClientRect();
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      const minLeft = 8;
      const minTop = 8;
      const maxLeft = Math.max(minLeft, hostRect.width - drag.width - 8);
      const maxTop = Math.max(minTop, hostRect.height - drag.height - 8);
      const left = Math.round(Math.max(minLeft, Math.min(maxLeft, drag.startLeft + dx)));
      const top = Math.round(Math.max(minTop, Math.min(maxTop, drag.startTop + dy)));
      document.documentElement.style.setProperty('--main-south-left', `${left}px`);
      document.documentElement.style.setProperty('--main-south-top', `${top}px`);
      safeStoreSouthBoxManual({ left, top });
      event.preventDefault();
      event.stopPropagation();
    });

    const finish = event => {
      const drag = state.southBoxDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (drag.moved) {
        state.southBoxClickSuppressed = true;
        markConfigDirty('Taalactiebox positie');
        appendConfigLog('move-south-box', state.southBoxManual || {});
      }
      state.southBoxDrag = null;
      box.classList.remove('is-dragging');
      try { box.releasePointerCapture?.(event.pointerId); } catch (_err) {}
      setTimeout(() => { state.southBoxClickSuppressed = false; }, 0);
      event.preventDefault();
      event.stopPropagation();
    };
    box.addEventListener('pointerup', finish);
    box.addEventListener('pointercancel', finish);
  }

  function registerEvents() {
    const updateCausalAnaphorVariant = event => {
      state.causalAnaphorVariant = globalThis.OGNUtteranceKernels?.validCausalAnaphorVariant?.(event.target.value) || 'die';
      try { localStorage.setItem('opengraph_causal_anaphor_variant', state.causalAnaphorVariant); } catch (_err) {}
      appendConfigLog('change-causal-anaphor-variant', { causalAnaphorVariant: state.causalAnaphorVariant });
      markConfigDirty('Causale anafoor');
      state.documentMetadata = null;
      resetManualViewBox();
      render();
    };
    els.mainCausalAnaphorSelect?.addEventListener('change', updateCausalAnaphorVariant);
    document.getElementById('multiCausalAnaphorSelect')?.addEventListener('change', updateCausalAnaphorVariant);
    els.mainCausalVerbSelect?.addEventListener('change', event => {
      state.causalVerbVariant = event.target.value;
      try { localStorage.setItem('opengraph_causal_verb_variant', state.causalVerbVariant); } catch (_err) {}
      state.documentMetadata = null; resetManualViewBox(); render();
    });
    els.mainBotSelect?.addEventListener('change', event => {
      state.botVariant = event.target.value;
      try { localStorage.setItem('opengraph_bot_variant', state.botVariant); } catch (_err) {}
      state.documentMetadata = null; resetManualViewBox(); render();
    });
    const activateConfigurableNode = event => {
      const target = event.target?.closest?.('[data-node-config="causal-subject"]');
      if (!target || !multiOgnAnaphorActive()) return;
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      const choices = globalThis.OGNUtteranceKernels?.CAUSAL_ANAPHOR_VARIANTS || [];
      const current = choices.findIndex(choice => choice.id === state.causalAnaphorVariant);
      const next = choices[(current + 1) % choices.length];
      if (next) updateCausalAnaphorVariant({ target: { value: next.id } });
    };
    els.svg?.addEventListener('click', activateConfigurableNode);
    els.svg?.addEventListener('keydown', activateConfigurableNode);
    document.querySelectorAll('.projection-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        setProjection(tab.dataset.projection || 'axes');
        render();
      });
    });
    els.exampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      state.documentMetadata = null;
      recordParadata('select-example', { example: state.example.id });
      resetForNewExample();
      render();
    });
    els.desktopExampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      state.documentMetadata = null;
      recordParadata('select-example', { example: state.example.id });
      resetForNewExample();
      render();
    });
    els.mobileExampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      state.documentMetadata = null;
      recordParadata('select-example', { example: state.example.id });
      resetForNewExample();
      render();
    });
    els.mainExampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      state.documentMetadata = null;
      recordParadata('select-example', { example: state.example.id });
      resetForNewExample();
      render();
    });
    const updateMainAdverb = event => {
      if (!featureEnabled('adverbs')) return;
      state.selectedAdverbId = event.target.value || 'none';
      state.useExampleLexInsertions = state.selectedAdverbId === 'none';
      recordParadata('select-adverb', { adverb: state.selectedAdverbId });
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
    els.clearLexAnalysisButton?.addEventListener('click', () => {
      const prefix = `${String(state.example?.id || 'example')}::`;
      Object.keys(state.lexAnalysisChoices || {}).forEach(key => { if (key.startsWith(prefix)) delete state.lexAnalysisChoices[key]; });
      saveLexAnalysisChoices();
      recordParadata('clear-lexical-profile-choices', { example: state.example?.id });
      resetManualViewBox();
      render();
    });
    els.openConfigButton?.addEventListener('click', () => {
      if (els.mainExtraMenu) els.mainExtraMenu.open = false;
      if (els.mainActionsMenu) els.mainActionsMenu.open = false;
      setConfigScreen(true, validPlacementMode(state.placementMode));
    });
    els.closeConfigButton?.addEventListener('click', () => setConfigScreen(false));
    els.openConfigFromHelpButton?.addEventListener('click', () => setConfigScreen(true, 'general'));
    els.openHelpButton?.addEventListener('click', () => { if (els.mainExtraMenu) els.mainExtraMenu.open = false; if (els.mainActionsMenu) els.mainActionsMenu.open = false; setHelpScreen(true); });
    els.openHelpFromConfigButton?.addEventListener('click', () => setHelpScreen(true));
    els.closeHelpButton?.addEventListener('click', () => setHelpScreen(false));
    registerHelpTopicTree();
    registerHelpPanelResizer();
    applyHelpLayoutMode();
    document.querySelectorAll('[data-language-option]').forEach(button => {
      button.addEventListener('click', event => {
        setLanguage(event.currentTarget.dataset.languageOption || DEFAULT_LANGUAGE);
        document.querySelectorAll('.language-menu[open]').forEach(menu => { menu.open = false; });
      });
    });
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && (document.body.classList.contains('config-screen-active') || document.body.classList.contains('help-screen-active'))) setAppScreen('main');
    });
    const setCenterModeFromViewSelect = value => {
      const previous = state.centerMode;
      state.centerMode = (value === 'ft' || value === 'functional') ? 'ft' : 'syntax';
      if (previous !== state.centerMode) recordParadata('set-central-view', { from: previous, to: state.centerMode });
      // Syntax en Functional zijn twee centrale views in hetzelfde vaste viewport.
      // Geen reset: ook deze wissel mag niet horizontaal of verticaal springen.
      render();
    };
    els.centralModeSelect?.addEventListener('change', event => setCenterModeFromViewSelect(event.target.value));
    els.mainViewSelect?.addEventListener('change', event => setCenterModeFromViewSelect(event.target.value));
    els.mobileViewSelect?.addEventListener('change', event => setCenterModeFromViewSelect(event.target.value));
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
    const setLayoutDensity = value => { state.layoutDensity = validLayoutDensity(value); resetManualViewBox(); render(); };
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
    els.lexProjectionColorSelect?.addEventListener('change', event => { state.lexProjectionColor = event.target.value || 'blue'; try { localStorage.setItem('opengraph_projection_color_lex', state.lexProjectionColor); } catch (_err) {} appendConfigLog('change-lex-color', { lexProjectionColor: state.lexProjectionColor }); markConfigDirty('LEX-kleur'); render(); });
    els.syntProjectionColorSelect?.addEventListener('change', event => { state.syntProjectionColor = event.target.value || 'green'; try { localStorage.setItem('opengraph_projection_color_synt', state.syntProjectionColor); } catch (_err) {} appendConfigLog('change-synt-color', { syntProjectionColor: state.syntProjectionColor }); markConfigDirty('SYNT-kleur'); render(); });
    els.logProjectionColorSelect?.addEventListener('change', event => { state.logProjectionColor = event.target.value || 'purple'; try { localStorage.setItem('opengraph_projection_color_log', state.logProjectionColor); } catch (_err) {} appendConfigLog('change-log-color', { logProjectionColor: state.logProjectionColor }); markConfigDirty('LOG-kleur'); render(); });
    els.gridColorSelect?.addEventListener('change', event => { state.gridColor = event.target.value || 'soft-slate'; try { localStorage.setItem('opengraph_grid_color', state.gridColor); } catch (_err) {} appendConfigLog('change-grid-color', { gridColor: state.gridColor }); markConfigDirty('Rasterkleur'); render(); });
    els.gridLineWeightSelect?.addEventListener('change', event => { state.gridLineWeight = validLineWeight(event.target.value); try { localStorage.setItem('opengraph_grid_line_weight', state.gridLineWeight); } catch (_err) {} appendConfigLog('change-grid-weight', { gridLineWeight: state.gridLineWeight }); markConfigDirty('Rasterlijnen'); render(); });
    const updateGridSizeHorizontal = event => { state.gridSizeHorizontal = validGridSize(event.target.value); try { localStorage.setItem('opengraph_grid_size_horizontal', state.gridSizeHorizontal); } catch (_err) {} appendConfigLog('change-grid-size-horizontal', { gridSizeHorizontal: state.gridSizeHorizontal }); markConfigDirty('Rastermaat horizontaal'); resetManualViewBox(); render(); };
    const updateGridSizeVertical = event => { state.gridSizeVertical = validGridSize(event.target.value); try { localStorage.setItem('opengraph_grid_size_vertical', state.gridSizeVertical); } catch (_err) {} appendConfigLog('change-grid-size-vertical', { gridSizeVertical: state.gridSizeVertical }); markConfigDirty('Rastermaat verticaal'); resetManualViewBox(); render(); };
    els.gridSizeHorizontalSelect?.addEventListener('change', updateGridSizeHorizontal);
    els.gridSizeVerticalSelect?.addEventListener('change', updateGridSizeVertical);
    document.getElementById('multiGridSizeHorizontalSelect')?.addEventListener('change', updateGridSizeHorizontal);
    document.getElementById('multiGridSizeVerticalSelect')?.addEventListener('change', updateGridSizeVertical);
    const updateTreeLineColor = event => { state.treeLineColor = event.target.value || 'blue'; try { localStorage.setItem('opengraph_tree_line_color', state.treeLineColor); } catch (_err) {} appendConfigLog('change-tree-color', { treeLineColor: state.treeLineColor }); markConfigDirty('Boomkleur'); render(); };
    const updateTreeLineWeight = event => { state.treeLineWeight = validLineWeight(event.target.value, 'strong'); try { localStorage.setItem('opengraph_tree_line_weight', state.treeLineWeight); } catch (_err) {} appendConfigLog('change-tree-weight', { treeLineWeight: state.treeLineWeight }); markConfigDirty('Boomlijnen'); render(); };
    els.treeLineColorSelect?.addEventListener('change', updateTreeLineColor);
    els.treeLineWeightSelect?.addEventListener('change', updateTreeLineWeight);
    document.getElementById('multiTreeLineColorSelect')?.addEventListener('change', updateTreeLineColor);
    document.getElementById('multiTreeLineWeightSelect')?.addEventListener('change', updateTreeLineWeight);
    document.getElementById('multiTreeLayoutDensitySelect')?.addEventListener('change', event => { state.layoutDensity = validLayoutDensity(event.target.value); appendConfigLog('change-tree-layout-density', { layoutDensity: state.layoutDensity }); markConfigDirty('Boomruimte'); resetManualViewBox(); render(); });
    document.getElementById('multiTreeBranchHorizontalSelect')?.addEventListener('change', event => { state.kernelBranchHorizontal = validKernelBranchSpacing(event.target.value); try { localStorage.setItem('opengraph_kernel_branch_horizontal', state.kernelBranchHorizontal); } catch (_err) {} appendConfigLog('change-kernel-branch-horizontal', { kernelBranchHorizontal: state.kernelBranchHorizontal }); markConfigDirty('Vertakking horizontaal'); resetManualViewBox(); render(); });
    document.getElementById('multiTreeBranchVerticalSelect')?.addEventListener('change', event => { state.kernelBranchVertical = validKernelBranchSpacing(event.target.value); try { localStorage.setItem('opengraph_kernel_branch_vertical', state.kernelBranchVertical); } catch (_err) {} appendConfigLog('change-kernel-branch-vertical', { kernelBranchVertical: state.kernelBranchVertical }); markConfigDirty('Vertakking verticaal'); resetManualViewBox(); render(); });
    document.getElementById('multiTreeBranchFlipSelect')?.addEventListener('change', event => { state.kernelBranchFlip = validKernelBranchFlip(event.target.value); try { localStorage.setItem('opengraph_kernel_branch_flip', state.kernelBranchFlip); } catch (_err) {} appendConfigLog('change-kernel-branch-flip', { kernelBranchFlip: state.kernelBranchFlip }); markConfigDirty('Flip · links/rechts'); resetManualViewBox(); render(); });
    document.getElementById('multiOgnFlipHoldSelect')?.addEventListener('change', event => { state.multiOgnFlipHold = validMultiOgnFlipHold(event.target.value); try { localStorage.setItem('opengraph_multi_ogn_flip_hold', state.multiOgnFlipHold); } catch (_err) {} appendConfigLog('change-multi-ogn-flip-hold', { multiOgnFlipHold: state.multiOgnFlipHold }); markConfigDirty('PLAY · Flip-houdtijd'); render(); });
    els.projectionLineWeightSelect?.addEventListener('change', event => { state.projectionLineWeight = validLineWeight(event.target.value); try { localStorage.setItem('opengraph_projection_line_weight', state.projectionLineWeight); } catch (_err) {} appendConfigLog('change-projection-weight', { projectionLineWeight: state.projectionLineWeight }); markConfigDirty('Projectielijnen'); render(); });
    els.boxLineWeightSelect?.addEventListener('change', event => { state.boxLineWeight = validLineWeight(event.target.value); try { localStorage.setItem('opengraph_box_line_weight', state.boxLineWeight); } catch (_err) {} appendConfigLog('change-box-weight', { boxLineWeight: state.boxLineWeight }); markConfigDirty('Boxlijnen'); render(); });
    document.querySelectorAll('[data-placement-mode]').forEach(button => {
      button.addEventListener('click', () => setPlacementMode(button.dataset.placementMode));
    });
    els.projectionBoxDraggableInput?.addEventListener('change', event => { updateProjectionBoxDraggable(event.target.checked); appendConfigLog('change-projection-box-draggable', { enabled: !!event.target.checked }); markConfigDirty('Projecties-box'); });
    els.southBoxDraggableInput?.addEventListener('change', event => { updateSouthBoxDraggable(event.target.checked); appendConfigLog('change-south-box-draggable', { enabled: !!event.target.checked }); markConfigDirty('Taalactiebox'); });
    const updateLexFreeSlotCount = event => { state.lexFreeSlotCount = Math.max(0, Math.min(8, Number(event.target.value) || 0)); resetManualViewBox(); render(); };
    const updateLexFreeSlotPlacement = event => { state.lexFreeSlotPlacement = validLexSlotPlacement(event.target.value); resetManualViewBox(); render(); };
    els.lexFreeSlotCountSelect?.addEventListener('change', updateLexFreeSlotCount);
    els.mobileLexFreeSlotCountSelect?.addEventListener('change', updateLexFreeSlotCount);
    els.lexFreeSlotPlacementSelect?.addEventListener('change', updateLexFreeSlotPlacement);
    els.mobileLexFreeSlotPlacementSelect?.addEventListener('change', updateLexFreeSlotPlacement);
    const updateLexInsertionContent = event => { state.lexInsertionContent = validLexInsertionContent(event.target.value); resetManualViewBox(); render(); };
    els.lexInsertionContentSelect?.addEventListener('change', updateLexInsertionContent);
    els.mobileLexInsertionContentSelect?.addEventListener('change', updateLexInsertionContent);
    const updateLogInsertionInterval = event => {
      state.logInsertionInterval = validLogInsertionInterval(event.target.value);
      recordParadata('set-log-insertion-interval', { interval: state.logInsertionInterval });
      appendConfigLog('change-log-insertion-interval', { interval: state.logInsertionInterval });
      markConfigDirty('LOG-interval');
      resetManualViewBox();
      render();
    };
    els.logInsertionIntervalSelect?.addEventListener('change', updateLogInsertionInterval);
    els.mobileLogInsertionIntervalSelect?.addEventListener('change', updateLogInsertionInterval);
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
    els.sentenceTypeSelect?.addEventListener('change', event => {
      const type = SENTENCE_TYPES.find(item => item.id === event.target.value) || SENTENCE_TYPES[0];
      const targetExample = EXAMPLES.find(example => example.id === type.defaultExample)
        || EXAMPLES.find(example => sentenceTypeForExample(example) === type.id)
        || EXAMPLES[0];
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
    els.growthResetButton?.addEventListener('click', () => { state.growthEnabled = true; state.projectionBlockUnlocked = false; stopGrowthPlayback(); setGrowthStep(0); });
    els.growthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mainGrowthPlayButton?.addEventListener('click', toggleActivePlacementPlayback);
    els.mainGrowthPrevButton?.addEventListener('click', activePlacementPrevious);
    els.mainGrowthNextButton?.addEventListener('click', activePlacementNext);
    els.mainResetButton?.addEventListener('click', activePlacementReset);
    els.mainSouthPrevButton?.addEventListener('click', () => { stopGrowthPlayback(); cycleSouthLogicalMode(-1); });
    els.mainSouthNextButton?.addEventListener('click', () => { stopGrowthPlayback(); cycleSouthLogicalMode(1); });
    els.mainSouthModeButton?.addEventListener('click', () => { stopGrowthPlayback(); cycleSouthLogicalMode(1); });
    bindProjectionBoxDrag();
    bindSouthBoxDrag();
    els.mainProjectionSelect?.addEventListener('change', event => {
      setProjection(event.target.value || 'axes');
      render();
    });
    [els.mainSentenceMenu, els.mainAdverbMenu, els.mainViewMenu, els.mainInterfaceMenu, els.sourceAxisMenu, els.mainExtraMenu, els.mainLanguageMenu, els.mainActionsMenu].forEach(menu => {
      menu?.addEventListener('toggle', () => { if (menu.open) closeMainChoiceMenus(menu); });
    });
    document.querySelectorAll('[data-source-axis]').forEach(button => {
      button.addEventListener('click', () => {
        toggleSourceAxis(button.dataset.sourceAxis);
        render();
      });
    });
    document.querySelectorAll('[data-source-axis-action]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.sourceAxisAction;
        applyProjectionAxes(action === 'all' ? SOURCE_AXIS_IDS : []);
        if (els.sourceAxisMenu) els.sourceAxisMenu.open = false;
        render();
      });
    });
    document.addEventListener('pointerdown', event => {
      [els.mainSentenceMenu, els.mainAdverbMenu, els.mainViewMenu, els.mainInterfaceMenu, els.sourceAxisMenu, els.mainExtraMenu, els.mainLanguageMenu, els.mainActionsMenu].forEach(menu => {
        if (menu?.open && !menu.contains(event.target)) menu.open = false;
      });
    });
    document.querySelectorAll('[data-main-projection]').forEach(button => {
      button.addEventListener('click', () => {
        setProjection(button.dataset.mainProjection || 'axes');
        render();
      });
    });
    els.mobileGrowthPlayButton?.addEventListener('click', toggleActivePlacementPlayback);
    els.mobileGrowthPrevButton?.addEventListener('click', activePlacementPrevious);
    els.mobileGrowthNextButton?.addEventListener('click', activePlacementNext);
    els.mobileGrowthResetButton?.addEventListener('click', activePlacementReset);
    els.resetExampleButton?.addEventListener('click', () => { applyProjectionAxes(SOURCE_AXIS_IDS); resetForNewExample(); render(); });
    els.fitButton?.addEventListener('click', runFit);
    els.mobileFitButton?.addEventListener('click', runFit);
    els.mobilePrevButton?.addEventListener('click', () => cycleExample(-1));
    els.mobileNextButton?.addEventListener('click', () => cycleExample(1));
    els.mobileMenuButton?.addEventListener('click', toggleMobileSheet);
    els.mobileCloseButton?.addEventListener('click', () => setMobileSheet(false));
    els.mobileSheetBackdrop?.addEventListener('click', () => setMobileSheet(false));
    els.mobileGrowthButton?.addEventListener('click', toggleMobileGrowth);
    els.mobileResetButton?.addEventListener('click', () => { applyProjectionAxes(SOURCE_AXIS_IDS); resetForNewExample(); setMobileSheet(false); render(); });
    els.mobileDownloadJsonButton?.addEventListener('click', () => { setMobileSheet(false); downloadJson(); });
    els.fileInput?.addEventListener('change', () => loadJsonFile(els.fileInput));
    els.configFileInput?.addEventListener('change', () => loadJsonFile(els.configFileInput));
    els.mobileFileInput?.addEventListener('change', () => loadJsonFile(els.mobileFileInput));
    document.querySelectorAll('[data-mobile-projection]').forEach(button => {
      button.addEventListener('click', () => setMobileProjection(button.dataset.mobileProjection || 'axes'));
    });
    window.addEventListener('keydown', event => {
      if (event.ctrlKey && event.altKey && !event.repeat) {
        const key = String(event.key || '').toLowerCase();
        const axisByKey = { l: 'lex', s: 'synt', g: 'log' };
        if (axisByKey[key]) {
          toggleSourceAxis(axisByKey[key]);
          render();
          event.preventDefault();
          return;
        }
        if (key === 'a') { applyProjectionAxes(SOURCE_AXIS_IDS); render(); event.preventDefault(); return; }
        if (key === '0') { applyProjectionAxes([]); render(); event.preventDefault(); return; }
      }
      if (event.key === 'Escape' && els.mainExtraMenu?.open) {
        els.mainExtraMenu.open = false;
        event.preventDefault();
        return;
      }
      if (event.key === 'Escape' && els.mainActionsMenu?.open) {
        els.mainActionsMenu.open = false;
        event.preventDefault();
        return;
      }
      if (event.key === 'Escape' && els.sourceAxisMenu?.open) {
        els.sourceAxisMenu.open = false;
        event.preventDefault();
        return;
      }
      if (event.key === 'Escape' && state.mobileSheetOpen) {
        setMobileSheet(false);
        event.preventDefault();
      }
    });
    els.saveConfigButton?.addEventListener('click', saveConfigSnapshot);
    els.discardConfigButton?.addEventListener('click', discardConfigChanges);
    els.downloadConfigLogButton?.addEventListener('click', downloadConfigLog);
    document.getElementById('configScreen')?.addEventListener('change', event => {
      if (event.target?.id && !['lexProjectionColorSelect','syntProjectionColorSelect','logProjectionColorSelect','gridColorSelect','gridLineWeightSelect','gridSizeHorizontalSelect','gridSizeVerticalSelect','multiGridSizeHorizontalSelect','multiGridSizeVerticalSelect','treeLineColorSelect','treeLineWeightSelect','multiTreeLineColorSelect','multiTreeLineWeightSelect','multiTreeLayoutDensitySelect','multiTreeBranchHorizontalSelect','multiTreeBranchVerticalSelect','multiTreeBranchFlipSelect','multiCausalAnaphorSelect','projectionLineWeightSelect','boxLineWeightSelect','projectionBoxDraggableInput','southBoxDraggableInput'].includes(event.target.id)) markConfigDirty(event.target.id);
    });
    els.downloadJsonButton?.addEventListener('click', downloadJson);
    els.downloadOpnButton?.addEventListener('click', downloadOpn);
    els.configDownloadOpnButton?.addEventListener('click', downloadOpn);
    els.downloadGraphSvgButton?.addEventListener('click', downloadGraphSvg);
    els.downloadGraphPngButton?.addEventListener('click', downloadGraphPng);
    els.recordPlayWebmButton?.addEventListener('click', recordPlayWebm);
    els.mobileDownloadOpnButton?.addEventListener('click', () => { setMobileSheet(false); downloadOpn(); });
    [els.includeParadataInput, els.configIncludeParadataInput, els.mobileIncludeParadataInput].forEach(input => input?.addEventListener('change', () => syncParadataExportCheckboxes(input.checked)));
    syncParadataExportCheckboxes(true);
    els.applyLexRuleButton?.addEventListener('click', () => {
      const typeId = sentenceTypeForExample();
      const type = SENTENCE_TYPES.find(item => item.id === typeId) || SENTENCE_TYPES[0];
      state.example = EXAMPLES.find(example => example.id === type.defaultExample)
        || EXAMPLES.find(example => sentenceTypeForExample(example) === typeId)
        || EXAMPLES[0];
      resetForNewExample();
      render();
    });
    els.swapRolesButton?.addEventListener('click', () => {
      state.roleSwap = !state.roleSwap;
      recordParadata('swap-roles', { enabled: state.roleSwap });
      render();
    });
    for (const button of [els.undoButton, els.redoButton, els.addNodeButton, els.duplicateNodeButton, els.deleteNodeButton, els.applyNodeButton, els.addEdgeButton, els.lexLeftButton, els.lexRightButton]) {
      button?.addEventListener('click', () => {
        if (els.actionFeedback) els.actionFeedback.textContent = 'Deze viewer heeft geen losse knoop-/relatie-editor. Gebruik structure-config/lexicon-config voor bronaanpassing.';
      });
    }
    window.addEventListener('keydown', event => {
      if (event.defaultPrevented
        || document.body.classList.contains('config-screen-active')
        || document.body.classList.contains('help-screen-active')) return;
      const target = event.target;
      if (target instanceof Element
        && (target.matches('input, textarea, select, [contenteditable]')
          || target.closest('input, textarea, select, [contenteditable]'))) return;
      if (event.key === '1') setProjection('axes');
      else if (event.key === '2') setProjection('source');
      else if (event.key === '3') setProjection('lex');
      else if (event.key.toLowerCase() === 'g') {
        if (directPlacementActive()) { toggleDirectPlacementPlayback(); return; }
        if (multiOgnAnaphorActive()) { toggleMultiOgnPlayback(); return; }
        state.growthEnabled = !state.growthEnabled;
        if (!state.growthEnabled) stopGrowthPlayback();
      }
      else if (event.key.toLowerCase() === 'n') {
        if (directPlacementActive()) directPlacementNext(false);
        else if (multiOgnAnaphorActive()) { stopMultiOgnPlayback(); setMultiOgnPlayStep(state.multiOgnPlayStep + 1, false); }
        else { state.growthEnabled = true; setGrowthStep(state.growthStep + 1, false); }
      }
      else if (event.key.toLowerCase() === 'p') {
        if (directPlacementActive()) directPlacementPrevious(false);
        else if (multiOgnAnaphorActive()) { stopMultiOgnPlayback(); setMultiOgnPlayStep(state.multiOgnPlayStep - 1, false); }
        else { state.growthEnabled = true; setGrowthStep(state.growthStep - 1, false); }
      }
      else if (event.key.toLowerCase() === 'f') runFit();
      else if (event.key === 'ArrowLeft') { panViewByClientDelta(60, 0); event.preventDefault(); return; }
      else if (event.key === 'ArrowRight') { panViewByClientDelta(-60, 0); event.preventDefault(); return; }
      else if (event.key === 'ArrowUp') { panViewByClientDelta(0, 60); event.preventDefault(); return; }
      else if (event.key === 'ArrowDown') { panViewByClientDelta(0, -60); event.preventDefault(); return; }
      else return;
      render();
    });
  }


  function ensureHelpTopicCarouselSlots() {
    const panels = Array.from(document.querySelectorAll('.help-topic-panel'));
    panels.forEach(panel => {
      if (!panel || panel.querySelector('.help-topic-carousel-slot, .help-carousel-reserved, .readme-tree-carousel')) return;
      const topic = panel.getAttribute('data-help-topic') || 'help-topic';
      const titleNode = panel.querySelector('h3');
      const title = (titleNode?.textContent || topic).trim();
      const slot = document.createElement('div');
      slot.className = 'help-topic-carousel-slot';
      slot.setAttribute('role', 'group');
      slot.setAttribute('aria-label', `Carouselruimte: ${title}`);
      slot.setAttribute('data-carousel-topic', title);
      slot.innerHTML = `
        <div class="help-carousel-frame">
          <strong>${title}</strong>
          <span class="help-lang-nl">Gereserveerde carousel-image voor dit help-item.</span>
          <span class="help-lang-en">Reserved carousel image for this help item.</span>
        </div>`;
      panel.appendChild(slot);
    });
  }

  async function init() {
    document.body.classList.add('main-screen-active');
    document.body.classList.remove('config-screen-active');
    document.body.classList.remove('help-screen-active');
    syncViewportTestClasses();
    syncPortraitStageMode();
    captureDefaultReadmeTopics();
    captureDefaultReadmeCarousels();
    setupConfigTabs();
    ensureHelpTopicCarouselSlots();
    renderReadmeTopicEdits();
    renderReadmeTopicCarousels();
    registerReadmeCarousel();
    registerReadmeExternalWindows();
    registerEvents();
    registerCanvasPan();
    registerPaneSplitter();
    await loadStructureConfig();
    await loadProjectConfigLayers();
    projectConfigStatus.browserLoaded = loadSavedConfigSnapshot();
    syncProjectConfigStatus();
    if (featureEnabled('adverbs')) await loadLexiconUsageProfiles();
    await loadExamplesFromHtml();
    refreshExamplesForFeatures();
    if (featureEnabled('adverbs')) await loadAdverbOptionsFromHtml();
    else resetAdverbFeatureState();
    applyExampleAdverbDefaults();
    applyFeatureVisibility();
    syncConfigSaveStatus();
    render();
    applyLanguage();
    try {
      const requestedScreen = new URLSearchParams(window.location.search || '').get('screen');
      if (requestedScreen === 'config') setAppScreen('config');
      else if (requestedScreen === 'help' || requestedScreen === 'readme') setAppScreen('help');
    } catch (_err) {}
    requestAnimationFrame(() => requestAnimationFrame(stabilizeInitialTreeView));
    window.addEventListener('load', () => {
      requestAnimationFrame(stabilizeInitialTreeView);
    }, { once: true });
    window.addEventListener('resize', () => {
      syncViewportTestClasses();
      syncPortraitStageMode();
      syncMainTopbarLayout();
      resetManualViewBox();
      render();
    });
    window.addEventListener('orientationchange', () => {
      // v2.0.0-rc.14: breek actieve pinch/pan expliciet af vóór herfit.
      resetManualViewBox();
      requestAnimationFrame(() => {
        resetManualViewBox();
        render();
      });
    });
    window.addEventListener('blur', clearViewportGestureState);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearViewportGestureState();
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
