'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const engineSource = fs.readFileSync(path.join(root, 'utterance-kernel-engine.js'), 'utf8');
const engine = require(path.join(root, 'utterance-kernel-engine.js'));
const combinations = require(path.join(root, 'anaphor-combinations-engine.js'));
const defaults = JSON.parse(fs.readFileSync(path.join(root, 'config', 'default-config.json'), 'utf8'));
const publication = JSON.parse(fs.readFileSync(path.join(root, 'config', 'publication-start-items.json'), 'utf8'));
const catalog = fs.readFileSync(path.join(root, 'publicatie-links.html'), 'utf8');
const examplesInput = fs.readFileSync(path.join(root, 'examples-input.html'), 'utf8');

const reward = 'jan-beloonde-jek-omdat-die-het-bot-terugbracht';
const story = 'story-jan-sloeg-jek-waarna-hij-hem-ontweek';

assert.ok(!Object.prototype.hasOwnProperty.call(defaults.config, 'startItemId'), 'startitem mag niet via Config worden bestuurd');
assert.equal(publication.bareDefault, 'hond-bijt-man', 'kale ingang is niet HOND BIJT MAN');
assert.equal(publication.platforms.linkedin.item, reward, 'LinkedIn-startitem wijkt af');
assert.equal(publication.platforms.linkedin.parameters.werkwoord, 'terugbracht');
assert.equal(publication.platforms.reddit.enabled, false, 'Reddit mag nog geen vast startitem hebben');
assert.equal(publication.platforms.reddit.item, null);

assert.ok(source.includes("queryParamValue('item', 'example')"), 'item-URI wordt niet gelezen met example-compatibiliteit');
assert.ok(source.includes("url.searchParams.set('item', id)"), 'canonieke item-URI wordt niet geschreven');
assert.ok(source.includes("window.addEventListener('popstate'"), 'browser terug/vooruit ontbreekt');
assert.ok(!source.includes('Startitem van de app'), 'Config bevat nog een startitemkeuze');
assert.ok(source.includes("const DEFAULT_START_ITEM_ID = 'hond-bijt-man'"), 'vaste kale ingang ontbreekt');
assert.ok(source.includes("queryParamValue('app')"), 'app-URI voor directe plaatsing ontbreekt');
assert.ok(source.includes("requestedApp === 'greedy-grow' || requestedApp === 'random'"), 'Greedy/Random URI-routering ontbreekt');
assert.ok(source.includes('activeAnaphorCombinationDefinition'), 'anafoorcombinaties hebben geen canonieke item-routering');
assert.ok(source.includes('engine.composeDeclaredPair'), 'anafoorcombinaties met meerdere relaties gebruiken niet de gezamenlijke compositor');
assert.ok(source.includes('for (const upperSide of [-1, 1])'), 'multi-OGN-keuze probeert geen lokale links/rechts-Flip');
assert.ok(source.includes('multi-ogn-context-relation-line'), 'LEX-Contextrelatie wordt niet getekend');
for (const marker of ['?item=hond-bijt-man', '?item=jan-beloonde-jek-omdat-die-het-bot-terugbracht', '?app=greedy-grow', '?app=random', 'Uitleg · Notatie']) assert.ok(catalog.includes(marker), `URI-catalogus mist ${marker}`);
const knownItems = new Set([
  ...[...examplesInput.matchAll(/<article class="example-input" data-id="([^"]+)"/g)].map(match => match[1]),
  ...engine.DEFINITIONS.map(item => item.id)
  , ...combinations.normalizeCombinations().map(item => item.id)
]);
for (const match of catalog.matchAll(/[?&]item=([^&"<]+)/g)) {
  assert.ok(knownItems.has(match[1]), `URI-catalogus verwijst naar onbekend item: ${match[1]}`);
}
assert.ok(catalog.includes('features=adverbs'), 'uitbreidingsitems activeren hun vereiste profiel niet');
assert.ok(catalog.includes('<base href="https://kruin.github.io/graphlite/">'), 'publieke basis-URI ontbreekt');
assert.ok(!catalog.includes('file:///'), 'URI-catalogus bevat een lokaal file-pad');
for (const href of catalog.matchAll(/<a href="([^"]+)"/g)) {
  const resolved = new URL(href[1], 'https://kruin.github.io/graphlite/publicatie-links.html');
  assert.equal(resolved.protocol, 'https:', `publicatielink is niet publiek: ${href[1]}`);
  assert.equal(resolved.host, 'kruin.github.io', `publicatielink wijst buiten GitHub Pages: ${href[1]}`);
}

assert.ok(engine.DEFINITIONS.some(item => item.id === story), 'gecorrigeerde story-id ontbreekt');
assert.equal(engine.definitionFor('story-jan-sloeg-jek-waarna-hij-ontweek').id, story, 'oude story-URI heeft geen alias');
assert.equal(engine.DEFINITIONS.find(item => item.id === 'jan-wast-zichzelf').anaphorClass, 'reflexive-local');
assert.equal(engine.DEFINITIONS.find(item => item.id === 'ken-uzelf').anaphorClass, 'reflexive-local-implicit-subject');
assert.ok(engineSource.includes("anaphorClass: 'cross-kernel-story'"));
const combinationTitles = new Map(combinations.normalizeCombinations().map(item => [item.id, item.title]));
assert.equal(combinationTitles.get('ik-zag-man-gisteren-vandaag-was-hij-er-niet-meer'), 'Ik zag de man gisteren. Vandaag was hij er niet meer.');
assert.equal(combinationTitles.get('boer-bezit-ezel-hij-slaat-hem'), 'Een boer bezit een ezel. Hij slaat hem.');
assert.equal(combinationTitles.get('man-slaat-hond-omdat-die-hem-heeft-gebeten'), 'De man slaat de hond omdat die hem heeft gebeten.');

console.log('ITEM URI/START CHECK: OK (kale HOND BIJT MAN, URI-catalogus, LinkedIn-profiel, Reddit open, families apart)');
