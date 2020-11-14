let fs = require('fs');
let groupsView = {
    '出港夹层': {},
    '进港夹层': {},
};
let groups = {
    '自动化五': [],
    '自动化四': [],
    '自动化三': [],
    '自动化二': [],
    '自动化一': []

}
for (let i = 201; i < 206; i++) {
    let ips = "172.19.12."
    groupsView['出港夹层'][ips + i] = '出港夹层'+(i - 200) + '';
    // groups['自动化五'].push(ips + i)
}
for (let i = 150; i < 166; i++) {
    let ips = "172.19.12."
    groupsView['进港夹层'][ips + i] = '进港夹层'+(i - 149) + '';
    // groups['自动化四'].push(ips + i)
}
// for (let i = 31; i < 67; i++) {
//     let ips = "172.19.6."
//     groupsView['自动化三'][ips + i] = (i - 30) + '';
//     groups['自动化三'].push(ips + i)
// }

// for (let i = 131; i < 155; i++) {
//     let ips = "172.19.5."
//     groupsView['自动化二'][ips + i] = (i - 130) + '';
//     groups['自动化二'].push(ips + i)
// }

// for (let i = 31; i < 67; i++) {
//     let ips = "172.19.5."
//     groupsView['自动化一'][ips + i] = (i - 30) + '';
//     groups['自动化一'].push(ips + i)
// }


// for (let i = 20; i < 43; i++) {
//     let ips = "172.19.11."
//     groupsView['卸车A'][ips + (count - i)] = '供件台' + (i + 1);
//     groups['卸车A'].push(ips + (count - i))
// }

let data = {
    groupsView
}
data = JSON.stringify(data)

fs.writeFileSync('./aa.json', data)