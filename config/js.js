let fs = require('fs');
let groupsView = {
    '夹层': {},
    '拆包组': {},
};
let groups = {
    '夹层': [],
    '拆包组': []

}
for (let i = 150; i < 164; i++) {
    let ips = "172.19.12."
    groupsView['夹层'][ips + i] = '大件快手' + (i - 149) + '';
    groups['夹层'].push(ips + i)
}
for (let i = 11; i < 21; i++) {
    let ips = "172.19.12."
    groupsView['拆包组'][ips + i] = '小件快手' + (i - 10) + '';
    groups['拆包组'].push(ips + i)
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
    groupsView, groups
}
data = JSON.stringify(data)

fs.writeFileSync('./aa.json', data)