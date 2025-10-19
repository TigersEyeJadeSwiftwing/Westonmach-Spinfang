const fs = require('fs');

const xml0 = fs.readFileSync("./icon_dump/assets0.xml", "utf8");
const xml1 = fs.readFileSync("./icon_dump/assets1.xml", "utf8");
const xml2 = fs.readFileSync("./icon_dump/assets2.xml", "utf8");

// match everything between <Name> and </Name>
const names_list0 = [...xml0.matchAll(/<Name>(.*?)<\/Name>/g)].map(m => m[1]).filter( (name) => name.includes("icon") || name.includes("Icon") );
const names_list1 = [...xml1.matchAll(/<Name>(.*?)<\/Name>/g)].map(m => m[1]).filter( (name) => name.includes("icon") || name.includes("Icon") );
const names_list2 = [...xml2.matchAll(/<Name>(.*?)<\/Name>/g)].map(m => m[1]).filter( (name) => name.includes("icon") || name.includes("Icon") );

let names = [];

for (name of names_list0) {
    if (!names.includes(name))
        names.push(name);
}
for (name of names_list1) {
    if (!names.includes(name))
        names.push(name);
}
for (name of names_list2) {
    if (!names.includes(name))
        names.push(name);
}

names = names.sort( (a, b) => a - b );

console.log(names);

fs.writeFileSync("./icons.json", JSON.stringify(names, null, 2), "utf8");
console.log("Wrote file \"icons.json\", containing " + String(names.length) + " icon names.");
