let fs = require('fs');
let groupsView = {
    '出港上车一': {},
    '出港上车二': {},
};
let groups = {
    '出港上车一': [],
    '出港上车二': []

}
for (let i = 61; i < 111; i++) {
    let ips = "172.19.11."
    groupsView['出港上车一'][ips + i] = '狂扫' + (i - 60) + '';
    groups['出港上车一'].push(ips + i)
}
for (let i = 201; i < 225; i++) {
    let ips = "172.19.11."
    groupsView['出港上车二'][ips + i] = '狂扫' + (i - 200) + '';
    groups['出港上车二'].push(ips + i)
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