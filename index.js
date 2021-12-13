const a = {
    k1: false,
    k2: 'yes',
    k3: 44,
    obj1: {
        a: {
            b: {
                c: 'no',
                d: true
            }
        }
    },
    obj2: {
        a: 100
    },
    obj3: {
        a: {
            b: {
                c: 'deep'
            }
        }
    },
    arr: [
        1, 2, 3
    ]
};

const b = {
    k1: true,
    k2: 'no',
    k3: 44,
    obj1: {
        a: {
            b: {
                c: 'yes',
                d: true
            }
        }
    },
    obj2: {
        a: {
            b: {
                c: 'deep'
            }
        }
    },
    obj3: {
        a: 'not deep',
    },
    arr: [
        1, 2, 4
    ],
    k6: 'mid'
};

const c = {
    k5: 'beep',
    obj2: 'sausages'
};

const { removeRedundant, rebuild } = require('./lib/accordian');

const filtered = removeRedundant(a, b, c);

const rebuilt = rebuild(a, b, c);

// todo, turn this into a test
console.log(JSON.stringify({
    a, b, c, filtered, rebuilt
}, null, 2));
