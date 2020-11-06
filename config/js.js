let fs = require('fs');
let groupsView = {
    '卸车B':{},
    '卸车A':{}
};
let groups = {
    '卸车B':[],
    '卸车A':[]

}
let count = 53
for (let i = 0; i < 20; i++) {
    let ips = "172.19.11."
    groupsView['卸车B'][ips + (count - i)] = '供件台' + (i+1);
    groups['卸车B'].push(ips + (count - i))
}
for (let i = 20; i < 43; i++) {
    let ips = "172.19.11."
    groupsView['卸车A'][ips + (count - i)] = '供件台' + (i+1);
    groups['卸车A'].push(ips + (count - i))
}

let data={
    groupsView,groups
}
data=JSON.stringify(data)

fs.writeFileSync('./aa.json',data)