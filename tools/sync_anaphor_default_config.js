'use strict';

const fs = require('fs');
const path = require('path');
const combinations = require('../anaphor-combinations-engine');

const configPath = path.join(__dirname, '..', 'config', 'default-config.json');
const document = JSON.parse(fs.readFileSync(configPath, 'utf8'));
document.config.anaphorCombinations = combinations.toConfigList(combinations.DEFAULT_COMBINATIONS);
fs.writeFileSync(configPath, `${JSON.stringify(document, null, 2)}\n`);
process.stdout.write(`Synchronized ${document.config.anaphorCombinations.length} anaphor combinations.\n`);
