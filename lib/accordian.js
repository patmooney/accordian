const joinKey = '\u001f';
const toArrKey = k => idx + '\u001d' + k;

// TODO add a 'uniqueBy' to parse Arrays (e.g. `attr1.arr.guid`)
function removeRedundant(base, ...hierarchy) {
    const hierarchyPaths = mergeHierarchy(...hierarchy);
    return vivifyDefinition(Object.entries(getPaths(base)).filter(
        ([k, v]) => {
            const nearestPath = getNearestPath(hierarchyPaths, k);
            return nearestPath !== k || !hierarchyPaths[k] || hierarchyPaths[k] !== v;
        }
    ).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}));
}

function rebuild(...hierarchy) {
    return vivifyDefinition(mergeHierarchy(...hierarchy));
}

function mergeHierarchy(...hierarchy) {
    // for each of the hierarchy, get paths -> merge to next
    return hierarchy.map((obj) => getPaths(obj)).reduce(
        (acc, paths) => ({
            ...acc,
            ...Object.entries(paths).filter(
                ([k]) => !getNearestPath(acc, k)
            ).reduce((subAcc, [k, v]) => ({ ...subAcc, [k]: v }), {})
        }), {}
    )
}

function getPaths(obj, subPath = '') {
    const getSP = k => [subPath, k].filter(k => k !== undefined && k !== null && k !== '').join(joinKey);
    if (typeof obj !== 'object' || !obj || !Object.keys(obj).length) {
        return { [getSP()]: obj };
    }
    if (Array.isArray(obj)) {
        return { [subPath]: obj }; // cant handle arrays
//        return obj.reduce((acc, item, idx) => ({ ...acc, ...getPaths(item, getSP(idx)) }), {});
    }
    return Object.entries(obj).reduce(
        (acc, [k, v]) => ({ ...acc, ...getPaths(v, getSP(k)) }), {}
    );
}

function getNearestPath(paths, toFind) {
    const toFindRe = new RegExp(`^${toFind}${joinKey}`);
    return Object.keys(paths).filter(k => k === toFind || new RegExp(`^${k}${joinKey}`).test(toFind) || toFindRe.test(k))
        .sort((a, b) => a.length - b.length)[0];
}

function vivifyDefinition(defSpec, base = {}) {
    const vivifyKey = (def, key, val) => {
        const keys = key.split(joinKey);
        const currentKey = isNaN(keys[0]) ? keys[0] : parseInt(keys[0]);

        if (keys.length === 1) {
            return Array.isArray(def)
                ? def.splice(currentKey, 0, val)
                : def[key] = val;
        }

        if (!def[currentKey]) {
            def[currentKey] = isNaN(keys[1]) ? {} : [];
        }
        vivifyKey(def[currentKey], keys.slice(1).join(joinKey), val);
    };
    return Object.entries(defSpec).reduce(
        (acc, [key, val]) => {
            vivifyKey(acc, key, val);
            return acc;
        },
        base
    );
}

module.exports = {
    removeRedundant,
    mergeHierarchy,
    rebuild
};
