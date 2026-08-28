'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const engine = require(path.resolve(__dirname, '..', 'utterance-kernel-engine.js'));

function verify(name, schema, expected) {
  const layout = engine.buildRecursiveBinaryLayout(schema, { prefix: name });
  assert.equal(layout.nodes.length, expected.nodes, `${name}: verkeerd aantal knopen`);
  assert.equal(layout.edges.length, expected.nodes - 1, `${name}: geen verbonden boom`);
  assert.equal(new Set(layout.nodes.map(node => node.x)).size, layout.nodes.length, `${name}: gedeelde x-gridlijn`);
  assert.equal(new Set(layout.nodes.map(node => node.y)).size, layout.nodes.length, `${name}: gedeelde y-gridlijn`);
  const childCount = new Map();
  layout.edges.forEach(edge => childCount.set(edge.from, (childCount.get(edge.from) || 0) + 1));
  assert.ok([...childCount.values()].every(count => count <= 2), `${name}: niet-binair`);
  for (const [role, label] of Object.entries(expected.roles)) {
    assert.equal(layout.nodes.find(node => node.role === role)?.label, label, `${name}: rol ${role}`);
  }
  return layout;
}

verify('bijten', {
  key:'s', label:'S', x:-2, y:0, children:[
    { key:'subject', label:'HOND', cat:'NP', role:'subject', x:-4, y:1 },
    { key:'vp', label:'VP', x:1, y:2, children:[
      { key:'object', label:'MAN', cat:'NP', role:'object', x:-1, y:3 },
      { key:'predicate', label:'BIJT', cat:'V', role:'predicate', x:3, y:4 }
    ] }
  ]
}, { nodes:5, roles:{ subject:'HOND', object:'MAN', predicate:'BIJT' } });

verify('apporteren', {
  key:'s', label:'S', x:-2, y:0, children:[
    { key:'subject', label:'HOND', cat:'NP', role:'subject', x:-4, y:1 },
    { key:'vp', label:'VP', x:1, y:2, children:[
      { key:'theme-np', label:'NP', cat:'NP', role:'theme-phrase', x:-1, y:3, children:[
        { key:'det', label:'HET', cat:'DET', role:'determiner', x:-3, y:4 },
        { key:'theme', label:'BOT', cat:'N', role:'theme', x:0, y:5 }
      ] },
      { key:'predicate', label:'APPORTEERT', cat:'V', role:'predicate', x:3, y:6 }
    ] }
  ]
}, { nodes:7, roles:{ subject:'HOND', determiner:'HET', theme:'BOT', predicate:'APPORTEERT' } });

verify('terugbrengen', {
  key:'s', label:'S', x:-3, y:0, children:[
    { key:'subject', label:'HOND', cat:'NP', role:'subject', x:-6, y:1 },
    { key:'vp', label:'VP', x:2, y:2, children:[
      { key:'theme-np', label:'NP', cat:'NP', role:'theme-phrase', x:-2, y:3, children:[
        { key:'det', label:'HET', cat:'DET', role:'determiner', x:-4, y:4 },
        { key:'theme', label:'BOT', cat:'N', role:'theme', x:0, y:5 }
      ] },
      { key:'vp-shell', label:"VP'", cat:'VP', x:5, y:6, children:[
        { key:'goal-pp', label:'PP', cat:'PP', role:'goal-phrase', x:1, y:7, children:[
          { key:'preposition', label:'NAAR', cat:'P', role:'preposition', x:-1, y:8 },
          { key:'goal', label:'MAN', cat:'NP', role:'goal', x:4, y:9 }
        ] },
        { key:'predicate', label:'BRENGT', cat:'V', role:'predicate', x:8, y:10 }
      ] }
    ] }
  ]
}, { nodes:11, roles:{ subject:'HOND', determiner:'HET', theme:'BOT', preposition:'NAAR', goal:'MAN', predicate:'BRENGT' } });

assert.throws(() => engine.buildRecursiveBinaryLayout({
  key:'bad', label:'VP', x:0, y:0, children:[
    { key:'a', label:'A', x:-1, y:1 },
    { key:'b', label:'B', x:1, y:2 },
    { key:'c', label:'C', x:2, y:3 }
  ]
}), /Niet-binaire vertakking/);

console.log('RECURSIEVE KERNBOOM CHECK: OK (bijten, apporteren met NP, terugbrengen met NP+PP; strikt binair en vrije x/y-gridlijnen)');
