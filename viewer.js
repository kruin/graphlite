(() => {
  'use strict';

  const VERSION = 'v2.0.0-rc.37';
  const OPN_FORMAT_VERSION = '1.0';
  const OPN_DOCUMENT_TYPE = 'opengraph-document';
  const PARADATA_EVENT_LIMIT = 250;
  const BASE_CELL = 74;
  const ROOT_SIDE_GAP = 1;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  // Volledige westelijke LEX-laag: brede bijwoordgroepen, brontraces en
  // maximaal vier gestaffelde bewegingen. Houd rechts daarvan ook een
  // zichtbare goot vrij vóór de buitenste S/CLAUSE-box.
  const LEX_RENDER_RIGHT_REACH = 220;
  const LEX_RENDER_LEFT_REACH = 148;
  const LEX_TREE_CLEARANCE = 48;
  const CANVAS_GUIDE_TEXT_VISIBLE = false;
  const CONFIG_STORAGE_KEY = 'opengraph_saved_config_v1014';
  const CONFIG_LOG_KEY = 'opengraph_local_config_log_v1014';
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
      insertionAxes: Object.freeze(['lex', 'log'])
    })
  });
  const DEFAULT_FEATURES = Object.freeze(
    Object.fromEntries(Object.values(FEATURE_DEFINITIONS).map(feature => [feature.id, feature.defaultEnabled]))
  );


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
      "id": "omdat-hond-man-bijt",
      "title": "OMDAT HOND MAN BIJT",
      "phase": "Fase 3",
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
    }
  ];

  let ALL_EXAMPLES = EXAMPLES.slice();

  const LEX_RULES = [
    { id: 'hoofdzininvariant', label: 'hoofdzin V2: subject/topic – pv/predicaat – object · Wissel' },
    { id: 'bijzin-omdat', label: 'bijzin: Comp/(om)dat + subject + object + predicaat · geen V2' },
    { id: 'perfectum-heeft-vdw', label: 'perfectum V2: subject/topic – pv – object – vdw · Wissel' }
  ];

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
        playPhases: ['LOG', 'SPACE', 'LEX'],
        playSpaceMode: 'reserve-empty-lex-rows',
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
  const LEX_ANALYSIS_STORAGE_KEY = 'opengraph_lex_analysis_choices_v2.0.0-rc.37';

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
    syntProjectionColor: (function(){ try { return localStorage.getItem('opengraph_projection_color_synt') || 'green'; } catch (_err) { return 'green'; } })(),
    logProjectionColor: (function(){ try { return localStorage.getItem('opengraph_projection_color_log') || 'purple'; } catch (_err) { return 'purple'; } })(),
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
    return activeLexItems().map(i => i.label).join(' ');
  }

  function tokenHtml(item) {
    const label = escapeHtml(item.label);
    if (item.role === 'subject') return `<strong>${label}</strong>`;
    if (item.role === 'object') return `<em>${label}</em>`;
    return label;
  }

  function activeSentenceHtml() {
    if (exampleLexInsertionsActive() && state.example?.sentenceHtml && !state.roleSwap) return state.example.sentenceHtml;
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
          lexRule: card.dataset.lexRule || 'hoofdzininvariant',
          sentence: (sentenceEl?.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase(),
          sentenceHtml: sentenceEl?.innerHTML || '',
          subjectDefault: subject.toUpperCase(),
          objectDefault: object.toUpperCase(),
          predicate: (card.dataset.predicate || 'BIJT').toUpperCase(),
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
      playPhases: String(section.dataset.playPhases || 'LOG SPACE LEX').trim().toUpperCase().split(/\s+/).filter(Boolean),
      playSpaceMode: String(section.dataset.playSpaceMode || 'reserve-empty-lex-rows').trim().toLowerCase(),
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
    return configured.join(' ') === 'LOG SPACE LEX' ? configured : ['LOG', 'SPACE', 'LEX'];
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
      shiftSubtreeY(layout, host.id, reserveRows);
      const shiftedHost = (layout.nodes || []).find(node => String(node.id) === String(host.id)) || host;
      const shiftedBox = hostBoxForNode(layout, shiftedHost);
      const slotY0 = (shiftedBox ? shiftedBox.minY - reserveRows : oldSlotTopY) + 0.5;
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
      spaces.push({ count: visibleSlotCount, reserveRows, slotStepRows, hostId: shiftedHost.id, hostLabel: activeAdverbHostLabel(orderedSpecs[0]?.content, orderedSpecs[0]?.placement), axis: 'LEX', source: 'external-lexical-insertion' });
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
    const root = document.documentElement;
    const body = document.body;
    [root, body].forEach(node => {
      if (!node) return;
      VIEWPORT_TEST_MODES.forEach(option => node.classList.toggle(`viewport-${option.id}`, mode === option.id));
      node.classList.toggle('viewport-mobile-test', mobileTest);
      node.classList.toggle('viewport-mobile-portrait-test', mobilePortrait);
      node.classList.toggle('viewport-mobile-landscape-test', mobileLandscape);
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

  function isMobileViewport() {
    const forced = activeViewportMode();
    if (forced === 'mobile-portrait' || forced === 'mobile-landscape') return true;
    if (forced === 'desktop') return false;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
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
    if (mode === 'max') {
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
    return ['axes', 'source', 'log'].includes(projection);
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
    if (!growthActive()) return { active: false, current: Infinity, max: 0, nodeStep: new Map(), structureStep: 0, logStep: 0, spaceStep: 0, lexBaseStep: 0, lexMovementStartStep: 0, lexMovementCount: 0, projectionStep: 0 };
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const orderedNodes = orderedGrowthNodes(layout, metrics);
    const structureStep = Math.max(1, orderedNodes.length);
    const playPhases = logLexPlayPhases();
    const phaseStep = phase => structureStep + playPhases.indexOf(phase) + 1;
    const logStep = phaseStep('LOG');
    const spaceStep = phaseStep('SPACE');
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
    return { active: true, current: state.growthStep, max, nodeStep, structureStep, logStep, spaceStep, lexBaseStep, lexMovementStartStep, lexMovementCount, projectionStep };
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
    const spaceStep = phaseStep('SPACE');
    const lexBaseStep = phaseStep('LEX');
    const movementStart = structureStep + playPhases.length + 1;
    if (step === logStep) return `${step}/${max} · 1/3 LOG`;
    if (step === spaceStep) return `${step}/${max} · 2/3 ruimte`;
    if (step === lexBaseStep) return `${step}/${max} · 3/3 horizontale LEX-projectie`;
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
    // rc.14: bijwoord-minors staan op LOG en projecteren vandaar naar LEX.
    // Een scopehost tekent geen syntaxknoop en reserveert geen boomruimte.
    return;
  }

  function drawTreeNodes(g, layout, origin, selectable = true, growthPlan = null) {
    const ordered = orderedTreeNodes(layout).filter(({ node }) => visibleAt(growthPlan, nodeGrowthStep(growthPlan, node.id)));
    const shapeLayer = svgEl('g', { class: 'node-shape-layer' });
    const labelLayer = svgEl('g', { class: 'node-label-layer' });
    const maximumLayout = validLayoutDensity() === 'max';
    const leafRadius = maximumLayout ? 34 : 27;
    const categoryWidth = maximumLayout ? 124 : 104;
    const categoryHeight = maximumLayout ? 54 : 46;

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
          rx: maximumLayout ? 15 : 13,
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

  function drawLexConfiguredFreeSlot(g, x, slot) {
    const content = slot.content || lexInsertionContentDef();
    const marked = slot.marked ? (isEnglish() ? ' · marked' : ' · gemarkeerd') : '';
    const toggleLabel = slot.toggleLabel || adverbMarkedToggleLabel();
    const hasToggle = !!slot.toggleTargetId;
    const sub = slot.source === 'LOG'
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

  function logicalPlacementMovementForItem(item, index, items = state.example?.lexItems || []) {
    if (!logicalAuthorityEnabled() || !item?.source) return null;
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
    // berekent de neutrale doelrij en topic/V2 kan die doelrij vervangen,
    // maar de presentatie tekent geen afzonderlijke tussensprong meer.
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
    // rc.14: LOG bepaalt de neutrale LEX-basis. Alleen de expliciete
    // plaatsingsregels topic/vooropplaatsing en V2 voeren daarna een Wissel
    // uit; overige items blijven op hun LOG-afgeleide basisrij.
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
      const rowsBelowRoot = 1 + (showTopicSlot(items) ? 1 : 0) + (showV2Slot(items) ? 1 : 0);
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
    const logicalPlacement = appliedLogicalPlacementForItem(item, index, items, options);
    const neutralY = logicalPlacement
      ? baseLexY(item, index, y0, sourceMap, items)
      : projectionAnchorY(item, index, y0, sourceMap, items);
    const movement = appliedMovementForItem(item, index, items, options);
    if (movement?.slot === 'topic') return topicSlotY(y0, items);
    if (movement?.slot === 'v2') return v2SlotY(y0, items);
    if (movement?.slot === 'post-v2') return postV2SlotY(y0, movement, items);
    return neutralY;
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
    group.appendChild(svgEl('text', { x: x - 22, y: y + 5, class: 'lex-trace-label' }, label));
    g.appendChild(group);
  }

  function drawLexWissel(g, x, fromY, toY, label, lane = 0) {
    const safeLane = Math.max(0, lane);
    const sideX = x + 86 + (safeLane % 4) * 18;
    const group = svgEl('g', {
      class: 'lex-wissel-movement',
      'data-movement-label': label
    });
    group.appendChild(svgEl('title', {}, label));
    group.appendChild(pathEl(`M ${sideX} ${fromY} C ${sideX + 52} ${fromY} ${sideX + 52} ${toY} ${sideX} ${toY}`, { class: 'lex-wissel-line' }));
    group.appendChild(svgEl('polygon', { points: `${sideX},${toY} ${sideX + 9},${toY - 6} ${sideX + 9},${toY + 6}`, class: 'lex-wissel-arrow' }));
    group.appendChild(svgEl('text', {
      x: sideX + 46,
      y: (fromY + toY) / 2 + 4,
      class: 'lex-wissel-step-label'
    }, `LEX ${safeLane + 1}`));
    g.appendChild(group);
  }


  function movementSummary() {
    const items = activeLexItems();
    const moved = orderedLexMovements(items);
    const explicit = items.map((item, index) => movementForItem(item, index, items)).filter(Boolean);
    const type = state.example?.lexRule || 'voorbeeldzin';
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
    if (!item?.source) return item.slot === 'comp' ? projectedCompSlotY(y0, sourceMap) : lexWordOrderY(index, y0);
    const logicalPlacement = appliedLogicalPlacementForItem(item, index, items, options);
    const neutralY = logicalPlacement
      ? baseLexY(item, index, y0, sourceMap, items)
      : projectionAnchorY(item, index, y0, sourceMap, items);
    const movement = appliedMovementForItem(item, index, items, options);
    if (movement?.slot === 'topic') return projectedTopicSlotY(y0, sourceMap, items);
    if (movement?.slot === 'v2') return projectedV2SlotY(y0, sourceMap, items);
    if (movement?.slot === 'post-v2') return projectedPostV2SlotY(y0, sourceMap, movement, items);
    return neutralY;
  }

  function drawLexAxis(g, x, y0, items, sourceMap = null, options = {}) {
    const horizontalProjectionMode = !!sourceMap && horizontalLexProjectionEnabled();
    const systemY0 = sourceMap ? projectedLexSystemY0(y0, sourceMap) : y0;
    drawAxisTitle(g, x - 98, systemY0 - 70, options.spaceOnly
      ? 'LEX-projectie · fase 2/3 · ruimte uit LOG-slots'
      : logicalAuthorityEnabled()
      ? 'LEX-projectie · horizontale bronpositie → één uiteindelijke LOG/LEX-doelrij'
      : (horizontalProjectionMode ? 'LEX-projectie · projectiemerkers + Wisselregels' : 'LEX-as · lokale plaatsingsregels'));

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
    g.appendChild(svgEl('line', {
      x1: x,
      y1: axisMinY,
      x2: x,
      y2: axisMaxY,
      class: 'lex-axis-line',
      'data-render-right-reach': LEX_RENDER_RIGHT_REACH,
      'data-tree-clearance': LEX_TREE_CLEARANCE
    }));

    const positions = new Map();
    if (options.spaceOnly) {
      const reservationRows = [
        ...baseYs.map(y => ({ y, kind: 'major' })),
        ...configuredSlots.map(slot => ({
          y: Number.isFinite(slot.baseY) ? slot.baseY : slot.y,
          kind: 'minor'
        }))
      ].filter(row => Number.isFinite(row.y));
      const seenRows = new Set();
      const uniqueRows = reservationRows
        .sort((a, b) => a.y - b.y)
        .filter(row => {
          const key = Math.round(row.y * 10) / 10;
          if (seenRows.has(key)) return false;
          seenRows.add(key);
          return true;
        });
      if (uniqueRows.length) {
        const firstY = uniqueRows[0].y;
        const lastY = uniqueRows[uniqueRows.length - 1].y;
        g.appendChild(svgEl('rect', {
          x: x - 8,
          y: firstY - 18,
          width: 16,
          height: Math.max(36, lastY - firstY + 36),
          rx: 8,
          class: 'lex-space-reservation'
        }));
        [firstY, lastY].forEach(rowY => {
          g.appendChild(svgEl('line', {
            x1: x - 15,
            y1: rowY,
            x2: x + 15,
            y2: rowY,
            class: 'lex-space-reservation-cap'
          }));
        });
      }
      drawCanvasGuideText(
        g,
        x + 150,
        axisMinY + 18,
        'Fase 2/3: reserveer eerst de LOG-afgeleide LEX-rijen; plaats de woorden pas in de volgende fase.',
        'wissel-label'
      );
      return positions;
    }
    // LOG levert doelrijen. De inhoud verschijnt eerst op de exact
    // horizontale bronprojectie en verhuist daarna uitsluitend langs LEX.
    configuredSlots.forEach(slot => drawLexConfiguredFreeSlot(g, x, slot));
    const topicOccupied = topicIndex >= 0
      && appliedMovementForItem(items[topicIndex], topicIndex, items, options)?.slot === 'topic';
    const v2Occupied = v2Index >= 0
      && appliedMovementForItem(items[v2Index], v2Index, items, options)?.slot === 'v2';
    if (topicSlotY !== null && isMainV2Rule() && !frontedAdverb && !topicOccupied) {
      drawLexTopicSlot(g, x, topicSlotY);
    }
    if (v2SlotY !== null && !v2Occupied) drawLexV2Slot(g, x, v2SlotY);

    const ruleText = logicalAuthorityEnabled()
      ? (featureEnabled('adverbs')
        ? `Bronknoop → horizontale LEX-projectie → één doelrij; LOG berekent de neutrale rij en topic/V2 kan die vervangen. Per bronwoord volgt hoogstens één zichtbare LEX-verplaatsing. ${lexFreeSlotCount()} minor(s) vergroten de logische afstand (${logInsertionIntervalLabel()}).`
        : 'Bronknoop → horizontale LEX-projectie → één doelrij; LOG-majors bepalen de neutrale rij en topic/V2 kan die vervangen. Per bronwoord volgt hoogstens één zichtbare LEX-verplaatsing.')
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
      const slotLabel = hasPendingLogicalMove ? 'H' : lexSlotIndex(item, i, items, explicitMovement);
      g.appendChild(svgEl('text', { x: x - 92, y: y + 5, class: 'lex-index' }, slotLabel));
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
    const title = options.title || (mode === 'functional' ? 'Functional · functionele regels/rollen' : 'SYNT-projectie · regels');
    const cls = mode === 'functional' ? 'synt functional' : 'synt';
    const boxClass = mode === 'functional' ? 'syntax-rule-box projected-rule-box projected-functional-rule-box' : 'syntax-rule-box projected-rule-box';
    const ruleClass = mode === 'functional' ? 'rule-label projected-rule-label projected-functional-rule-label' : 'rule-label projected-rule-label';
    const rows = projectedRuleRows(spec, layout, origin, mode).filter(row => {
      const plan = options.growthPlan || null;
      return !plan?.active || visibleAt(plan, nodeGrowthStep(plan, row.id));
    });
    if (!rows.length) return;
    const maxText = rows.reduce((max, row) => Math.max(max, row.text.length), 0);
    const width = Math.max(mode === 'functional' ? 250 : 210, Math.min(380, maxText * 8.2 + 34));
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
    const subtitle = options.subtitle || 'LOG-slots bepalen de afstand; dezelfde slots bepalen daarna de neutrale LEX-positie.';
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
        rows.push('LOG-majors en -minors bepalen de neutrale LEX-rijen; de voorbeeldzin valideert alleen.');
      } else {
        rows.push('De LOG-majors S/O/V bepalen de neutrale LEX-rijen; de voorbeeldzin valideert alleen.');
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

  function westLexAxisX(layoutBox, origin) {
    const treeBoxLeft = px(Number(layoutBox?.minX || 0) - 0.75, origin);
    return treeBoxLeft - LEX_RENDER_RIGHT_REACH - LEX_TREE_CLEARANCE;
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
    const westAxisX = westLexAxisX(centralLayout?.box, origin);
    const southAxisY = py((centralLayout?.box?.maxY || 0) + 2.1, origin);
    const logicalSlots = southItems.map(item => Number(item.logicalSlot)).filter(Number.isFinite);
    const logicalSpan = Math.max(1, Math.max(...logicalSlots) - Math.min(...logicalSlots)) * logAxisSlotPixels();
    const centralTreeCenterPx = px(((centralLayout?.box?.minX || 0) + (centralLayout?.box?.maxX || 0)) / 2, origin);
    const southAxisX1 = centralTreeCenterPx - logicalSpan / 2;
    const southAxisX2 = centralTreeCenterPx + logicalSpan / 2;
    const centralTreeRightPx = px((centralLayout?.box?.maxX || 0), origin);
    const eastAxisX = centralTreeRightPx + 118;
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
    const westAxisX = westLexAxisX(union, origin);
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
    const westAxisX = westLexAxisX(union, origin);
    const southAxisY = py(union.maxY + 2.1, origin);
    const projectedRuleRight = (layout, spec, mode) => {
      const rows = projectedRuleRows(spec, layout, origin, mode);
      const maxText = rows.reduce((max, row) => Math.max(max, String(row.text || '').length), 0);
      const width = Math.max(mode === 'functional' ? 250 : 210, Math.min(380, maxText * 8.2 + 34));
      const treeRight = px(Number(layout?.box?.maxX || 0), origin);
      return treeRight + 118 + 22 + width;
    };
    const syntaxRuleRight = projectedRuleRight(layouts[0], treeSpec(), 'syntax');
    const functionalRuleRight = projectedRuleRight(
      layouts[1],
      nodeConfigToTree(STRUCTURE_CONFIG.functionalNodes, STRUCTURE_CONFIG.functionalRoot),
      'functional'
    );
    const logicalSequence = activeLogicalSlotSequence();
    const logicalSlots = logicalSequence.map(item => Number(item.logicalSlot)).filter(Number.isFinite);
    const logicalSpan = Math.max(1, Math.max(...logicalSlots) - Math.min(...logicalSlots)) * logAxisSlotPixels();
    const treeCenterPx = px((union.minX + union.maxX) / 2, origin);
    const logicalLeft = treeCenterPx - logicalSpan / 2;
    const logicalRight = treeCenterPx + logicalSpan / 2;
    const left = Math.min(-12, westAxisX - LEX_RENDER_LEFT_REACH, leftTreePx - 100, logicalLeft - 96);
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
          ? `LOG ordent majors en bijwoord-minors op vaste slots; de LOG-volgorde bepaalt daarna de neutrale LEX-rijen.${southModeWarningText()}`
          : `LOG ordent S/O/V-majors op vaste slots; de LOG-volgorde bepaalt daarna de neutrale LEX-rijen.${southModeWarningText()}`,
        badgeText: southLogicalModeLabel(state.southLogicalMode || 'SOV'),
        order: southLogicalOrder(),
        items: ctx.southItems,
        interactive: true,
        tipText: 'tip: SOV → SVO → OVS → OSV-! → VSO-! → VOS-!',
        badgeAlign: 'right-below'
      });
    } else if (kind === 'log') {
      drawAxisTitle(g, ctx.southAxisX1, ctx.southAxisY - 60, `LOG verschijnt in fase 1/3 · ${growthLabel()}`);
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
        ? `Majors en minors staan op vaste LOG-slots; elke minor vergroot de afstand en schuift de neutrale LEX-basis mee.${southModeWarningText()}`
        : `De majors S, O en V staan op vaste LOG-slots en bepalen de neutrale LEX-basis.${southModeWarningText()}`);
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
    const showSpaceStep = !growthPlan?.active || visibleAt(growthPlan, growthPlan.spaceStep);
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
      drawLogPhase(`Fase 3/3: bronknopen projecteren eerst horizontaal naar LEX; daarna volgen de verplaatsingen langs de as.${southModeWarningText()}`);
    } else if (showSpaceStep) {
      drawLexAxis(g, westAxisX, 126, activeLexItems(), sourceMap, { spaceOnly: true });
      drawAxisTitle(g, eastAxisX, 116, 'SYNT-projectie verschijnt in de laatste stap');
      drawLogPhase(`Fase 2/3: de LOG-afstand reserveert nu lege rijen op LEX; inhoud volgt pas daarna.${southModeWarningText()}`);
    } else if (showLogStep) {
      drawAxisTitle(g, westAxisX - 45, 116, 'LEX verschijnt na het reserveren van ruimte');
      drawAxisTitle(g, eastAxisX, 116, 'SYNT-projectie verschijnt in de laatste stap');
      drawLogPhase(featureEnabled('adverbs')
        ? `Fase 1/3: plaats majors en minors eerst op de LOG-as.${southModeWarningText()}`
        : `Fase 1/3: plaats de majors S, O en V eerst op de LOG-as.${southModeWarningText()}`);
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
    if (selectedAxes.has('lex') && (!growthPlan?.active || visibleAt(growthPlan, growthPlan.spaceStep))) {
      const spaceOnly = !!growthPlan?.active && !visibleAt(growthPlan, growthPlan.lexBaseStep);
      drawLexAxis(g, ctx.westAxisX, 126, activeLexItems(), ctx.sourceMap, {
        spaceOnly,
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
    root.style.setProperty('--lex', '#2563eb');
    root.style.setProperty('--synt', projectionColorCss(state.syntProjectionColor, 'green'));
    root.style.setProperty('--log', projectionColorCss(state.logProjectionColor, 'purple'));
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
        return expandBoxToAspect(state.maximumContentFit, canvasAspectRatio());
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
      const projectionView = ['axes', 'source', 'lex', 'synt', 'log'].includes(state.projection);
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
      return expandBoxToAspect(fit, canvasAspectRatio());
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
    if (isMainScreenActive() && ['axes', 'source', 'lex', 'synt', 'log'].includes(state.projection)) {
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
    const syntaxModeLabel = isEnglish() ? 'OPN syntax tree' : 'OPN-syntaxboom';
    const functionalModeLabel = isEnglish() ? 'Functional structure' : 'Functional functionele structuur';
    els.titleLine.textContent = `${activeSentenceText()} · ${state.projectionLabel || projectionLabel()} · ${state.centerMode === 'syntax' ? syntaxModeLabel : functionalModeLabel}`;
    const noticeText = state.example.notice ? ` · NOTICE=${state.example.notice}` : '';
    const logicalSequence = activeLogicalSlotSequence();
    const directLexCount = activeLexInsertionSpecs().filter(spec => normalizeInsertionOrigin(spec.origin) === 'LEX').length;
    const logStatus = `LOG=${logicalSequenceCode(logicalSequence)} · ${logicalDistanceSummary(logicalSequence)}${directLexCount ? ` · direct-LEX=${directLexCount}` : ''}`;
    const featureStatus = featureEnabled('adverbs') ? ` · ${activeAdverbStatusLabel()}` : '';
    els.metaLine.textContent = isEnglish()
      ? `${state.example.phase} · ${movementSummaryLabel()}${featureStatus} · ${logStatus} → neutral LEX · sentence validation=${activeSentenceText()}${noticeText}`
      : `${state.example.phase} · ${movementSummaryLabel()}${featureStatus} · ${logStatus} → neutrale LEX · zinsvalidatie=${activeSentenceText()}${noticeText}`;
    if (els.sentencePreview) els.sentencePreview.innerHTML = activeSentenceHtml();
    const baseFeedback = isEnglish()
      ? (state.projection === 'source'
        ? 'Source shows the selected OPN source from structure-config.html. At Source, LEX, SYNT and LOG axes can be combined independently. The View menu switches between the Syntax view and the Functional view (functional CLAUSE roles). Syntax and Functional views use bottom-up recursive box layout; left/right controls both layouts; branch order can be global, compact-auto or align-auto.'
        : (featureEnabled('adverbs')
          ? 'Derivation: structure config → lexical usage profile → LOG minors and/or direct LEX insertions → complete LEX placement plan → optional topic/V2 target override. The sample sentence selects an instance analysis; it does not rewrite the lexicon.'
          : 'Derivation: structure config → LOG majors → neutral LEX rows → optional topic/V2 target override. The sample sentence selects the lexical items; it does not rewrite the structure.'))
      : (state.projection === 'source'
        ? 'Bron toont de gekozen OPN-bron uit structure-config.html; LEX-, SYNT- en LOG-as zijn daar onafhankelijk combineerbaar. Het View-menu wisselt tussen de Syntax-view en de Functional-view (functionele CLAUSE/rollen). Syntax en Functional gebruiken bottom-up recursieve box-layout; left/right stuurt beide layouts; takvolgorde kan globaal, compact-auto of align-auto zijn.'
        : (featureEnabled('adverbs')
          ? 'Afleiding: structure-config → lexicaal gebruiksprofiel → LOG-minors en/of directe LEX-inserties → volledig LEX-plaatsingsplan → eventuele topic/V2-doelvervanging. De voorbeeldzin kiest een zinsanalyse en herschrijft het lexicon niet.'
          : 'Afleiding: structure-config → LOG-majors → neutrale LEX-rijen → eventuele topic/V2-doelvervanging. De voorbeeldzin kiest de lexicale items en herschrijft de structuur niet.'));
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
        ? `LOG supplies semantic placement for LOG profiles. Current LOG sequence: ${logicalSequenceCode(logicalSequence)} (${logicalDistanceSummary(logicalSequence)}). Every LOG minor increases the distance between its bounding majors by one slot. Direct LEX profiles reserve a LEX row without a LOG minor; topic/V2 may replace a target before one visible move and one source trace are drawn. The sample sentence validates the surface result and does not determine the layout.`
        : `LOG levert de semantische plaatsing voor LOG-profielen. Huidige LOG-sequentie: ${logicalSequenceCode(logicalSequence)} (${logicalDistanceSummary(logicalSequence)}). Iedere LOG-minor vergroot de afstand tussen zijn begrenzende majors met één slot. Directe LEX-profielen reserveren een LEX-rij zonder LOG-minor; topic/V2 kan een doel vervangen vóór één zichtbare verplaatsing en één brontrace worden getekend. De voorbeeldzin valideert de surface-uitkomst en bepaalt de layout niet.`)
      : (isEnglish()
        ? `Current LOG sequence: ${logicalSequenceCode(logicalSequence)} (${logicalDistanceSummary(logicalSequence)}). The S/O/V majors determine neutral LEX rows; topic/V2 may replace a target before one visible move and one source trace are drawn. The sample sentence validates the surface result and does not determine the layout.`
        : `Huidige LOG-sequentie: ${logicalSequenceCode(logicalSequence)} (${logicalDistanceSummary(logicalSequence)}). De majors S/O/V bepalen de neutrale LEX-rijen; topic/V2 kan een doel vervangen vóór één zichtbare verplaatsing en één brontrace worden getekend. De voorbeeldzin valideert de surface-uitkomst en bepaalt de layout niet.`);
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
        ? 'LEX: west named projection. LOG profiles project from the south axis; direct LEX profiles do not. Both enter one precomputed placement plan before topic/V2 may replace a target.'
        : 'LEX: west named projection. Lexical sources project horizontally to neutral rows derived from the LOG majors; topic/V2 may replace a target.';
      if (state.projection === 'synt') return 'SYNT: isolated syntax-rule set. Rules are placed at their source height; the central tree is only used as a hidden height anchor.';
      if (state.projection === 'log') return featureEnabled('adverbs')
        ? 'LOG: south named projection. S, O and V are majors. Only insertions with a LOG or LOG+LEX profile appear as minors; direct LEX profiles remain absent from this axis.'
        : 'LOG: south named projection. S, O and V are majors on fixed slots and determine the neutral LEX rows.';
      return 'All: central view selected by the View menu. LEX, SYNT and LOG use named projections with their own projection markers and selection rules.';
    }
    if (state.projection === 'source') return `Bron: de Syntax- en Functional-structuren worden gelezen uit structure-config.html. Gekozen assen bij Bron: ${sourceAxesShortLabel()}. LEX, SYNT en LOG kunnen gecombineerd worden zonder de centrale view te verplaatsen of te herschalen.`;
    if (state.projection === 'lex') return featureEnabled('adverbs')
      ? 'LEX: westelijke named projection. LOG-profielen projecteren vanaf de zuidas; directe LEX-profielen niet. Beide komen vooraf in één plaatsingsplan voordat topic/V2 een doel kan vervangen.'
      : 'LEX: westelijke named projection. Lexicale bronnen projecteren horizontaal naar neutrale rijen uit de LOG-majors; topic/V2 kan een doel vervangen.';
    if (state.projection === 'synt') return 'SYNT: geïsoleerde syntax-regelset. Regels staan op bronhoogte; de centrale boom dient alleen als verborgen hoogteanker.';
    if (state.projection === 'log') return featureEnabled('adverbs')
      ? 'LOG: named projection op de zuidas. S, O en V zijn majors. Alleen inserties met een LOG- of LOG+LEX-profiel verschijnen als minor; directe LEX-profielen ontbreken op deze as.'
      : 'LOG: named projection op de zuidas. S, O en V zijn majors op vaste slots en bepalen de neutrale LEX-rijen.';
    return 'Alle: centrale view via View-menu. LEX, SYNT en LOG gebruiken named projections met eigen projectiemerkers en selectieregels.';
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
    syntProjectionColorSelect: { green: 'green', purple: 'purple', orange: 'orange', teal: 'teal', red: 'red', slate: 'slate' },
    logProjectionColorSelect: { green: 'green', purple: 'purple', orange: 'orange', teal: 'teal', red: 'red', slate: 'slate' },
    freeSlotCountSelect: { 0: 'tree rows: 0', 1: 'tree rows: 1', 2: 'tree rows: 2', 3: 'tree rows: 3', 4: 'tree rows: 4', 5: 'tree rows: 5', 6: 'tree rows: 6' },
    lexFreeSlotCountSelect: { 0: 'LOG minors: 0', 1: 'LOG minors: 1', 2: 'LOG minors: 2', 3: 'LOG minors: 3', 4: 'LOG minors: 4', 5: 'LOG minors: 5', 6: 'LOG minors: 6', 7: 'LOG minors: 7', 8: 'LOG minors: 8' },
    mobileLexFreeSlotCountSelect: { 0: 'LOG minors: 0', 1: 'LOG minors: 1', 2: 'LOG minors: 2', 3: 'LOG minors: 3', 4: 'LOG minors: 4', 5: 'LOG minors: 5', 6: 'LOG minors: 6', 7: 'LOG minors: 7', 8: 'LOG minors: 8' },
    lexFreeSlotPlacementSelect: { 'above-selected-box': 'scope host: selected box', 'above-s': 'scope host: S', 'above-np': 'scope host: NP', 'above-vp': 'scope host: VP', 'above-v': 'scope host: V', 'above-vcluster': 'scope host: V cluster', 'above-pp': 'scope host: PP', 'above-ap': 'scope host: AP' },
    mobileLexFreeSlotPlacementSelect: { 'above-selected-box': 'scope host: selected box', 'above-s': 'scope host: S', 'above-np': 'scope host: NP', 'above-vp': 'scope host: VP', 'above-v': 'scope host: V', 'above-vcluster': 'scope host: V cluster', 'above-pp': 'scope host: PP', 'above-ap': 'scope host: AP' },
    lexInsertionContentSelect: { empty: 'empty slot', gisteren: 'GISTEREN', morgen: 'MORGEN', daar: 'DAAR', daarom: 'DAAROM', anders: 'ANDERS', vaak: 'VAAK', soms: 'SOMS', altijd: 'ALTIJD', niet: 'NIET', snel: 'SNEL', hard: 'HARD', zachtjes: 'ZACHTJES', misschien: 'MISSCHIEN', waarschijnlijk: 'WAARSCHIJNLIJK', helaas: 'HELAAS', alleen: 'ALLEEN', ook: 'OOK', zelfs: 'ZELFS', heel: 'HEEL', erg: 'ERG', zeer: 'ZEER', anafoor: 'anaphor', 'other-lex-axis': 'other LEX axis' },
    mobileLexInsertionContentSelect: { empty: 'empty slot', gisteren: 'GISTEREN', morgen: 'MORGEN', daar: 'DAAR', daarom: 'DAAROM', anders: 'ANDERS', vaak: 'VAAK', soms: 'SOMS', altijd: 'ALTIJD', niet: 'NIET', snel: 'SNEL', hard: 'HARD', zachtjes: 'ZACHTJES', misschien: 'MISSCHIEN', waarschijnlijk: 'WAARSCHIJNLIJK', helaas: 'HELAAS', alleen: 'ALLEEN', ook: 'OOK', zelfs: 'ZELFS', heel: 'HEEL', erg: 'ERG', zeer: 'ZEER', anafoor: 'anaphor', 'other-lex-axis': 'other LEX axis' },
    portraitMenuSlotsSelect: { 0: 'bottom space: 0 menus', 1: 'bottom space: 1 menu', 2: 'bottom space: 2 menus' },
    mobilePortraitMenuSlotsSelect: { 0: 'bottom space: 0 menus', 1: 'bottom space: 1 menu', 2: 'bottom space: 2 menus' },
    lexRuleSelect: { hoofdzininvariant: 'main clause V2: subject/topic - finite verb/predicate - object - exchange', 'bijzin-omdat': 'subordinate clause: Comp/(om)dat + subject + object + predicate - no V2', 'perfectum-heeft-vdw': 'perfect V2: subject/topic - finite verb - object - participle - exchange' }
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

  function renderMainChoiceMenus() {
    if (els.mainSentenceSummary) {
      els.mainSentenceSummary.textContent = isEnglish() ? 'Sentence' : 'Zin';
      els.mainSentenceSummary.title = isEnglish() ? 'Choose the sample sentence' : 'Kies de voorbeeldzin';
    }
    if (featureEnabled('adverbs') && els.mainAdverbSummary) {
      els.mainAdverbSummary.textContent = isEnglish() ? 'Adverb' : 'Bijwoord';
      els.mainAdverbSummary.title = isEnglish() ? 'Choose an adverb' : 'Kies een bijwoord';
    }
    if (els.mainViewSummary) {
      els.mainViewSummary.textContent = state.centerMode === 'ft' ? 'Functional' : 'Syntax';
      els.mainViewSummary.title = isEnglish() ? 'Choose Syntax or Functional' : 'Kies Syntax of Functional';
    }
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
        ? 'Changes the LOG order. LOG slots determine the neutral LEX basis; an explicit rule may replace the final target before drawing.'
        : 'Wijzigt de LOG-volgorde. LOG-slots bepalen de neutrale LEX-basis; een expliciete regel kan vóór het tekenen het einddoel vervangen.';
    }
    fillCompactChoiceMenu(els.mainSentenceOptions, EXAMPLES, state.example.id, els.mainExampleSelect, id => {
      state.example = EXAMPLES.find(e => e.id === id) || EXAMPLES[0];
      resetForNewExample();
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
          ? 'No branch extension. LOG minors determine adverb distance and project to neutral LEX rows.'
          : 'Geen takverlenging. LOG-minors bepalen de bijwoordafstand en projecteren naar neutrale LEX-rijen.'))
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
    fillSelect(els.syntProjectionColorSelect, PROJECTION_COLOR_OPTIONS, state.syntProjectionColor);
    fillSelect(els.logProjectionColorSelect, PROJECTION_COLOR_OPTIONS, state.logProjectionColor);
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
    fillSelect(els.lexRuleSelect, LEX_RULES, state.example.lexRule);
    if (els.showGridInput) els.showGridInput.checked = state.showGrid;
    if (els.showRelationsInput) els.showRelationsInput.checked = state.showRelations;
    if (els.showLabelsInput) els.showLabelsInput.checked = state.showLabels;
    if (els.projectionBoxDraggableInput) els.projectionBoxDraggableInput.checked = !!state.projectionBoxDraggable;
    if (els.southBoxDraggableInput) els.southBoxDraggableInput.checked = !!state.southBoxDraggable;
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
    if (els.mainGrowthStepLabel) {
      els.mainGrowthStepLabel.textContent = growthLabel();
      els.mainGrowthStepLabel.title = growthLabel();
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
      mainSouthControl.classList.remove('is-hidden');
      mainSouthControl.setAttribute('aria-hidden', 'false');
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
      els.mobileGrowthStepLabel.textContent = growthLabel();
      els.mobileGrowthStepLabel.title = growthLabel();
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
    const exampleId = String(state.example?.id || 'opengraph')
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
    return {
      document_id: globalThis.crypto?.randomUUID?.() || `opn-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: state.example?.title || state.example?.sentence || 'OpenGraph-document',
      language: state.language || 'nl',
      created_at: now,
      source: { kind: 'viewer-example', example_id: state.example?.id || null }
    };
  }

  function ensureDocumentMetadata() {
    if (!state.documentMetadata || typeof state.documentMetadata !== 'object') {
      state.documentMetadata = defaultDocumentMetadata();
    }
    return state.documentMetadata;
  }

  function serializeLayoutGraph(layout, view, rules) {
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
      lex_rule: ex.lexRule || null,
      ...(featureEnabled('adverbs') ? {
        lex_insertions: Array.isArray(ex.lexInsertions) ? ex.lexInsertions.map(spec => {
          const analysis = resolvedInsertionAnalysis(spec);
          return { ...jsonClone(spec, {}), usageProfile: analysis.id, origin: analysis.origin, originComponents: analysis.components, scope: analysis.scope || spec.scope || '', analysisStatus: analysis.unresolved ? 'ask' : 'resolved' };
        }) : []
      } : {}),
      lex_items: activeLexItems()
    };
  }

  function buildOpnDocument(includeParadata = true) {
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
    recordParadata('export-legacy-json', { example: state.example.id });
    download(`${state.example.id}.${VERSION}.legacy.json`, JSON.stringify(legacyJsonPayload(), null, 2));
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
    recordParadata('export-opn', { example: state.example.id, paradata_included: includeParadata });
    const payload = buildOpnDocument(includeParadata);
    download(`${state.example.id}.${VERSION}.opn`, JSON.stringify(payload, null, 2), 'application/vnd.opengraph.opn+json');
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
      lexRule: exampleData.lex_rule || 'hoofdzininvariant',
      sentence: String(exampleData.sentence || lexItems.map(item => item.label).join(' ')),
      sentenceHtml: String(exampleData.sentence_html || lexItems.map(item => escapeHtml(item.label)).join(' ')),
      subjectDefault: exampleData.subject_default || lexItems.find(item => item.role === 'subject' || item.source === 'subject')?.label || 'HOND',
      objectDefault: exampleData.object_default || lexItems.find(item => item.role === 'object' || item.source === 'object')?.label || 'MAN',
      predicate: exampleData.predicate || lexItems.find(item => item.role === 'predicate' || item.source === 'predicate')?.label || 'BIJT',
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

  function applyLegacyPayload(payload) {
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
    { id: 'preconfig', nl: 'Voorconfig', en: 'Pre-config' },
    { id: 'features', nl: 'Toepassingen', en: 'Applications' },
    { id: 'overview', nl: 'Overzicht', en: 'Overview' },
    { id: 'jan', nl: 'JaN · TODO', en: 'JaN · TODO' },
    { id: 'files', nl: 'Opslaan & exporteren', en: 'Save & export' },
    { id: 'view', nl: 'Beeld', en: 'View' },
    { id: 'log-lex', nl: 'LOG & LEX', en: 'LOG & LEX' },
    { id: 'advanced', nl: 'Geavanceerd', en: 'Advanced' }
  ];
  let activeConfigTab = 'preconfig';

  function activateConfigTab(tabId = 'preconfig', focusTab = false) {
    const validId = CONFIG_TAB_DEFINITIONS.some(tab => tab.id === tabId) ? tabId : 'preconfig';
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

    const primaryViewGrid = document.createElement('div');
    primaryViewGrid.className = 'config-primary-view-grid';
    primaryViewGrid.setAttribute('aria-label', 'Primaire beeldinstellingen');
    const helpLayoutLabel = document.createElement('label');
    helpLayoutLabel.className = 'select-field';
    helpLayoutLabel.innerHTML = `<span><span class="help-lang-nl">LEESMIJ-indeling</span><span class="help-lang-en">README layout</span></span><select id="helpLayoutModeSelect"><option value="auto">Automatic</option><option value="stacked">List above text</option><option value="side">List left, text right</option></select><small class="config-item-help"><span class="help-lang-nl">Automatisch gebruikt links-rechts alleen op mobiel liggend; elders staat de lijst boven de tekst.</span><span class="help-lang-en">Automatic uses side-by-side only on mobile landscape; elsewhere the list is above the text.</span></small>`;
    [els.layoutDensitySelect, els.viewFitSelect, els.freeSlotCountSelect].forEach(select => {
      const label = select?.closest?.('label');
      if (label) primaryViewGrid.appendChild(label);
    });
    primaryViewGrid.appendChild(helpLayoutLabel);
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
    ['.lex-extension-field', '.top-menu-choice-field:not(.lex-extension-field)'].forEach(selector => {
      const field = treeCard.querySelector(selector);
      if (field) advancedCard.appendChild(field);
    });

    const saveCard = document.createElement('section');
    saveCard.className = 'panel-card config-file-settings-card';
    saveCard.dataset.configCard = 'save';
    const saveField = treeCard.querySelector('.config-save-field');
    if (saveField) saveCard.appendChild(saveField);

    const oldViewGrid = treeCard.querySelector('.view-config-grid');
    if (oldViewGrid && !oldViewGrid.children.length) oldViewGrid.remove();

    const overviewCard = document.createElement('section');
    overviewCard.className = 'panel-card config-overview-dashboard';
    overviewCard.id = 'config-overview';
    overviewCard.innerHTML = `<h2><span class="help-lang-nl">Config-overzicht</span><span class="help-lang-en">Configuration overview</span></h2>
      <p class="inline-help"><span class="help-lang-nl">Open één onderdeel. De bestaande save-werkwijze blijft ongewijzigd.</span><span class="help-lang-en">Open one section. The existing save workflow remains unchanged.</span></p>
      <div class="config-dashboard">
        <button type="button" data-config-jump="preconfig"><strong>Voorconfig</strong><span>Algemene mogelijkheden vóór toepassingen.</span></button>
        <button type="button" data-config-jump="features"><strong>Toepassingen</strong><span>Bijwoorden en volgende uitbreidingen.</span></button>
        <button type="button" data-config-jump="view"><strong>Basisweergave</strong><span>View, interface, raster en vulling.</span></button>
        <button type="button" data-config-jump="jan"><strong>JaN-notatie · TODO</strong><span>S:np-VP; binair eerst, meertakkig later.</span></button>
        <button type="button" data-config-jump="view"><strong>Boom & layout</strong><span>Takvolgorde, ruimte en fit.</span></button>
        <button type="button" data-config-jump="log-lex"><strong data-config-log-lex-title>LEX</strong><span>LEX-plaatsing en, indien ingeschakeld, extra insertieprofielen.</span></button>
        <button type="button" data-config-jump="view"><strong>Projecties</strong><span>LEX, SYNT en LOG.</span></button>
        <button type="button" data-config-jump="files"><strong>Voorbeelden & editors</strong><span>Bestanden, export en voorbeelden.</span></button>
        <button type="button" data-config-jump="advanced"><strong>Geavanceerd</strong><span>Regels en technische opties.</span></button>
      </div>`;
    overviewCard.querySelectorAll('[data-config-jump]').forEach(button => button.addEventListener('click', () => activateConfigTab(button.dataset.configJump)));

    const preconfigCard = document.createElement('section');
    preconfigCard.className = 'panel-card config-preconfig-card';
    preconfigCard.id = 'config-preconfig';
    preconfigCard.innerHTML = `
      <div class="help-lang-nl">
        <h2>Voorconfig · infrastructuur</h2>
        <p class="inline-help">Een voorconfig schakelt een algemene mogelijkheid in, maar voegt zelf nog geen taalinhoud toe. Toepassingen gebruiken daarna alleen de mogelijkheden die hier gereedstaan.</p>
      </div>
      <div class="help-lang-en">
        <h2>Pre-config · infrastructure</h2>
        <p class="inline-help">A pre-config enables a general capability without adding linguistic content. Applications then use only capabilities enabled here.</p>
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
        <p><span class="help-lang-nl">Ontwerpvoorraad; in rc.37 nog niet schakelbaar.</span><span class="help-lang-en">Design backlog; not switchable in rc.37 yet.</span></p>
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
        <h2>OGN Basis & toepassingen</h2>
        <p class="inline-help">OGN Basis bevat de gewone boom, het raster, LEX/SYNT/LOG met S/O/V-majors en voorbeeldzinnen zonder extra inserties. Een toepassing wordt pas beschikbaar wanneer haar voorconfig gereed is.</p>
      </div>
      <div class="help-lang-en">
        <h2>OGN Base & applications</h2>
        <p class="inline-help">OGN Base contains the ordinary tree, grid, LEX/SYNT/LOG with S/O/V majors, and samples without extra insertions. An application becomes available only after its pre-config is ready.</p>
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
      </fieldset>`;
    featuresCard.querySelector('#featureAdverbsInput')?.addEventListener('change', async event => {
      const enabled = !!event.target.checked;
      event.target.disabled = true;
      await setFeatureEnabled('adverbs', enabled);
      event.target.disabled = !featureRequirementsMet('adverbs');
      appendConfigLog('change-feature-adverbs', { enabled });
      markConfigDirty(isEnglish() ? 'Adverbs application' : 'Toepassing Bijwoorden');
    });

    const janCard = document.createElement('section');
    janCard.className = 'panel-card config-jan-card';
    janCard.id = 'config-jan';
    janCard.innerHTML = `<div class="help-lang-nl"><h2>JaN · Just another Notation</h2><p><code>S:np-VP</code>, nadrukkelijk niet <code>S:NP-VP</code>.</p><p>Onderzoeksnotatie: <code>S+ np-VP</code>. Eerst voor binaire bomen; later voor niet-binaire, meertakkige bomen.</p><p>TODO: <code>heeft gebeten</code> ↔ <code>gebeten heeft</code>.</p></div><div class="help-lang-en"><h2>JaN · Just another Notation</h2><p><code>S:np-VP</code>, explicitly not <code>S:NP-VP</code>.</p><p>Research notation: <code>S+ np-VP</code>. Binary trees first; non-binary multi-branching trees later.</p><p>TODO: <code>heeft gebeten</code> ↔ <code>gebeten heeft</code>.</p></div>`;

    panels.get('preconfig').appendChild(preconfigCard);
    panels.get('features').appendChild(featuresCard);
    panels.get('overview').appendChild(overviewCard);
    panels.get('jan').appendChild(janCard);
    panels.get('files').append(graphExportCard, opnCard, saveCard, examplesCard);
    panels.get('view').appendChild(treeCard);
    panels.get('log-lex').append(logSettingsCard, lexCard, relationCard);
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
    sidePanel.replaceChildren(tabList, ...panels.values());
    sidePanel.dataset.configTabsReady = '1';
    activateConfigTab(activeConfigTab);
    applyFeatureVisibility();
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
    setText('.config-topbar h2', en ? 'All settings' : 'Alle instellingen');
    setText('.config-topbar p', en ? 'Pre-config opens first. Enable infrastructure per axis before selecting an application.' : 'Voorconfig opent als eerste. Schakel infrastructuur per as in voordat je een toepassing kiest.');
    document.querySelectorAll('[data-config-tab-button]').forEach(button => {
      button.textContent = en ? button.dataset.labelEn : button.dataset.labelNl;
    });
    setText('[data-config-card="tree"] > h2', en ? 'Tree and view' : 'Boom en beeld');
    setText('[data-config-card="log-settings"] > h2', en ? 'LOG placement authority' : 'LOG als plaatsingsautoriteit');
    setText('[data-config-card="lex"] > h2', en ? 'LEX axis - utterance type' : 'LEX-as · uitingtype');
    setText('[data-config-card="relations"] > h2', en ? 'Relations / rules' : 'Relaties / regels');
    setText('.config-save-menu-kicker', en ? 'SAVE OR SHARE NOW' : 'DIRECT OPSLAAN OF DELEN');
    setText('[data-config-card="graph-export"] > h2', en ? 'Save, export and share' : 'Opslaan, exporteren en delen');
    setText('[data-config-card="advanced"] > h2', en ? 'Advanced settings' : 'Geavanceerde instellingen');
    setText('[data-config-max-text]', en
      ? 'Default: Tree spacing MAX and Window fit MAX — large type, a lower tree and full use of the app window.'
      : 'Standaard: Boomruimte MAX en Venstervulling MAX — groot letterbeeld, een lage boom en volledig gebruik van het appvenster.');
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
    setLabelSpan('viewFitSelect', en ? 'Window fit' : 'Venstervulling', en ? 'How the tree uses the available app window. MAX fills it.' : 'Hoe de boom het beschikbare appvenster gebruikt. MAX vult het volledig.');
    setLabelSpan('mainViewFitSelectTop', en ? 'Window fit' : 'Venstervulling');
    setLabelSpan('freeSlotCountSelect', en ? 'Free tree rows' : 'Boom vrije rijen');
    setLabelSpan('lexProjectionColorSelect', en ? 'LEX color' : 'LEX-kleur');
    if (els.lexProjectionColorSelect?.options?.[0]) els.lexProjectionColorSelect.options[0].textContent = en ? 'blue' : 'blauw';
    setLabelSpan('syntProjectionColorSelect', en ? 'SYNT color' : 'SYNT-kleur');
    setLabelSpan('logProjectionColorSelect', en ? 'LOG color' : 'LOG-kleur');
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
    document.querySelectorAll('.projection-color-field .top-menu-choice-help').forEach(node => { node.textContent = en ? 'LEX and LEX projection lines stay blue. Choose colors for the other named projections here.' : 'LEX en de LEX-projectielijnen blijven blauw. Kies hier de kleuren voor de andere named projections.'; });
    document.querySelectorAll('.lex-adverb-insert-field legend').forEach(node => { node.textContent = en ? 'LOG minors for adverbs' : 'LOG-minors voor bijwoorden'; });
    document.querySelectorAll('.lex-adverb-insert-field > .top-menu-choice-help').forEach(node => {
      node.textContent = en
        ? 'Place each adverb first as a minor in a LOG interval. Every minor adds one fixed distance unit between its surrounding majors. This LOG order supplies the neutral LEX rows; the sample sentence only validates.'
        : 'Plaats ieder bijwoord eerst als minor in een LOG-interval. Elke minor voegt één vaste afstandseenheid toe tussen de omringende majors. Die LOG-volgorde levert de neutrale LEX-rijen; de voorbeeldzin valideert alleen.';
    });
    setLabelSpan('lexRuleSelect', en ? 'Utterance-type rule' : 'Uitingtype-regel');

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
    setText('.config-topbar h2', en ? 'Configuration overview' : 'Config-overzicht');
    setText('.config-topbar p', en ? 'First set the pre-config, then choose an application. Save still uses Yes · save config / No · restore last saved config.' : 'Stel eerst de Voorconfig in en kies daarna een toepassing. Opslaan blijft Ja · bewaar config / Nee · herstel laatst bewaarde config.');
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
    const validIds = new Set(panels.map(panel => panel.getAttribute('data-help-topic')));
    const next = validIds.has(topicId) ? topicId : 'readme';
    panels.forEach(panel => {
      const active = panel.getAttribute('data-help-topic') === next;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    buttons.forEach(button => {
      const active = button.getAttribute('data-help-topic-button') === next;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
      button.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
    const stage = document.querySelector('.help-topic-stage');
    if (stage) stage.scrollTop = 0;
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
      const min = stacked ? 116 : 176;
      const max = Math.max(min, total - (stacked ? 150 : 260));
      return { stacked, rect, min, max };
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
      if (saved) applySize(saved);
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
    window.addEventListener('resize', () => { applyHelpLayoutMode(); applySize(parseFloat(getComputedStyle(screen).getPropertyValue('--help-nav-size')) || 0); }, { passive: true });
    applyHelpLayoutMode();
    restoreSize();
  }

  function registerReadmeCarousel() {
    // Het eerste README-item bevat een brede en een smalle traditionele boom.
    // De actieve beeldvorm bepaalt de carouselverhouding, zodat beide leesbaar blijven.
    const carousel = document.querySelector('[data-readme-carousel]');
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
      showGrid: !!state.showGrid,
      showRelations: !!state.showRelations,
      showLabels: !!state.showLabels,
      syntProjectionColor: state.syntProjectionColor,
      logProjectionColor: state.logProjectionColor,
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
      topMenuChoices: Array.isArray(state.topMenuChoices) ? state.topMenuChoices.slice() : []
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
    if (typeof snapshot.syntProjectionColor === 'string') state.syntProjectionColor = snapshot.syntProjectionColor;
    if (typeof snapshot.logProjectionColor === 'string') state.logProjectionColor = snapshot.logProjectionColor;
    if (typeof snapshot.projectionBoxDraggable === 'boolean') state.projectionBoxDraggable = snapshot.projectionBoxDraggable;
    if (snapshot.projectionBoxManual && Number.isFinite(snapshot.projectionBoxManual.left) && Number.isFinite(snapshot.projectionBoxManual.top)) state.projectionBoxManual = snapshot.projectionBoxManual;
    else if ('projectionBoxManual' in snapshot) state.projectionBoxManual = null;
    if (typeof snapshot.southBoxDraggable === 'boolean') state.southBoxDraggable = snapshot.southBoxDraggable;
    if (snapshot.southBoxManual && Number.isFinite(snapshot.southBoxManual.left) && Number.isFinite(snapshot.southBoxManual.top)) state.southBoxManual = snapshot.southBoxManual;
    else if ('southBoxManual' in snapshot) state.southBoxManual = null;
    if (typeof snapshot.helpLayoutMode === 'string' && ['auto','stacked','side'].includes(snapshot.helpLayoutMode)) state.helpLayoutMode = snapshot.helpLayoutMode;
    if (typeof snapshot.showGrid === 'boolean') state.showGrid = snapshot.showGrid;
    if (typeof snapshot.showRelations === 'boolean') state.showRelations = snapshot.showRelations;
    if (typeof snapshot.showLabels === 'boolean') state.showLabels = snapshot.showLabels;
    if (Number.isFinite(Number(snapshot.freeSlotCount))) state.freeSlotCount = Math.max(0, Math.min(6, Number(snapshot.freeSlotCount)));
    if (Number.isFinite(Number(snapshot.lexFreeSlotCount))) state.lexFreeSlotCount = Math.max(0, Math.min(8, Number(snapshot.lexFreeSlotCount)));
    if (typeof snapshot.lexFreeSlotPlacement === 'string') state.lexFreeSlotPlacement = snapshot.lexFreeSlotPlacement;
    if (typeof snapshot.lexInsertionContent === 'string') state.lexInsertionContent = snapshot.lexInsertionContent;
    if (typeof snapshot.logInsertionInterval === 'string') state.logInsertionInterval = validLogInsertionInterval(snapshot.logInsertionInterval);
    if (Array.isArray(snapshot.topMenuChoices)) state.topMenuChoices = snapshot.topMenuChoices.slice(0, TOP_MENU_MAX);
    try {
      localStorage.setItem('opengraph_projection_color_synt', state.syntProjectionColor);
      localStorage.setItem('opengraph_projection_color_log', state.logProjectionColor);
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
    try { localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(snapshot)); } catch (_err) {}
    appendConfigLog('save-config', snapshot);
    syncConfigSaveStatus(true);
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
    if (isConfig) activateConfigTab(activeConfigTab);
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
    els.openConfigButton?.addEventListener('click', () => { if (els.mainExtraMenu) els.mainExtraMenu.open = false; if (els.mainActionsMenu) els.mainActionsMenu.open = false; setConfigScreen(true); });
    els.closeConfigButton?.addEventListener('click', () => setConfigScreen(false));
    els.openConfigFromHelpButton?.addEventListener('click', () => setConfigScreen(true));
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
    els.syntProjectionColorSelect?.addEventListener('change', event => { state.syntProjectionColor = event.target.value || 'green'; try { localStorage.setItem('opengraph_projection_color_synt', state.syntProjectionColor); } catch (_err) {} appendConfigLog('change-synt-color', { syntProjectionColor: state.syntProjectionColor }); markConfigDirty('SYNT-kleur'); render(); });
    els.logProjectionColorSelect?.addEventListener('change', event => { state.logProjectionColor = event.target.value || 'purple'; try { localStorage.setItem('opengraph_projection_color_log', state.logProjectionColor); } catch (_err) {} appendConfigLog('change-log-color', { logProjectionColor: state.logProjectionColor }); markConfigDirty('LOG-kleur'); render(); });
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
    els.growthResetButton?.addEventListener('click', () => { state.growthEnabled = true; state.projectionBlockUnlocked = false; stopGrowthPlayback(); setGrowthStep(0); });
    els.growthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mainGrowthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mainGrowthPrevButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep - 1); });
    els.mainGrowthNextButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep + 1); });
    els.mainResetButton?.addEventListener('click', () => { applyProjectionAxes(SOURCE_AXIS_IDS); resetForNewExample(); render(); });
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
    els.mobileGrowthPlayButton?.addEventListener('click', toggleGrowthPlayback);
    els.mobileGrowthPrevButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep - 1); });
    els.mobileGrowthNextButton?.addEventListener('click', () => { stopGrowthPlayback(); state.growthEnabled = true; setGrowthStep(state.growthStep + 1); });
    els.mobileGrowthResetButton?.addEventListener('click', () => { state.growthEnabled = true; stopGrowthPlayback(); setGrowthStep(0); });
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
      if (event.target?.id && !['syntProjectionColorSelect','logProjectionColorSelect','projectionBoxDraggableInput','southBoxDraggableInput'].includes(event.target.id)) markConfigDirty(event.target.id);
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
      state.example = state.example.lexRule === 'bijzin-omdat' ? (EXAMPLES.find(e => e.lexRule === 'bijzin-omdat') || EXAMPLES[1]) : (EXAMPLES.find(e => e.lexRule === 'hoofdzininvariant') || EXAMPLES[0]);
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
    setupConfigTabs();
    ensureHelpTopicCarouselSlots();
    registerReadmeCarousel();
    registerReadmeExternalWindows();
    registerEvents();
    registerCanvasPan();
    registerPaneSplitter();
    await loadStructureConfig();
    loadSavedConfigSnapshot();
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
