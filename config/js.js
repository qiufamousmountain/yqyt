let fs = require('fs');
let groupsView = {
    '自动化五': {},
    '自动化四': {},
    '自动化三': {},
    '自动化二': {},
    '自动化一': {}
};
let groups = {
    '自动化五': [],
    '自动化四': [],
    '自动化三': [],
    '自动化二': [],
    '自动化一': []

}
for (let i = 51; i < 87; i++) {
    let ips = "172.19.7."
    groupsView['自动化五'][ips + i] = (i - 50) + '';
    groups['自动化五'].push(ips + i)
}
for (let i = 131; i < 167; i++) {
    let ips = "172.19.6."
    groupsView['自动化四'][ips + i] = (i - 130) + '';
    groups['自动化四'].push(ips + i)
}
for (let i = 31; i < 67; i++) {
    let ips = "172.19.6."
    groupsView['自动化三'][ips + i] = (i - 30) + '';
    groups['自动化三'].push(ips + i)
}

for (let i = 131; i < 155; i++) {
    let ips = "172.19.5."
    groupsView['自动化二'][ips + i] = (i - 130) + '';
    groups['自动化二'].push(ips + i)
}

for (let i = 31; i < 67; i++) {
    let ips = "172.19.5."
    groupsView['自动化一'][ips + i] = (i - 30) + '';
    groups['自动化一'].push(ips + i)
}


// for (let i = 20; i < 43; i++) {
//     let ips = "172.19.11."
//     groupsView['卸车A'][ips + (count - i)] = '供件台' + (i + 1);
//     groups['卸车A'].push(ips + (count - i))
// }

let data = {
    groupsView, groups
}
data = JSON.stringify(data)

fs.writeFileSync('./aa.json', data)