let pushval;
let counts = {};
let pairvals = [12, 12, 12, 12, 12, 12, 3, 3, 3];
pairvals.forEach(function(x) { counts[x] = (counts[x] || 0) + 1; });
let dpairs = [...new Set(pairvals)];
let ccounts = Object.keys(counts);
for(let i = 0; i < dpairs.length; i++) {
    if(counts[ccounts[i]] == "6") {
        pushval = ccounts[i];
    }
}
console.log(pushval);