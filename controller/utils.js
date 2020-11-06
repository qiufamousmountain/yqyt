/**
 * Created by zhengliuyang on 2018/10/11.
 */
const config = require('../config/config.json');


module.exports = {
    formatData: (items) => {
        let pos = {};
        let tree = [];
        let i = 0;
        while (items.length > 0) {
            if (items[i].pid == '0') {
                if (items[i].type == 'page') {
                    tree.push({
                        id: items[i].uuid,
                        pid: items[i].pid,
                        name: items[i].urlName,
                        type: 'page',
                        children: [],
                    })
                } else {
                    tree.push({
                        id: items[i].uuid,
                        pid: items[i].pid,
                        name: items[i].urlName,
                        url: items[i].url,
                        blank: items[i].blank,
                        type: 'url',
                        children: [],
                    })
                }
                pos[items[i].uuid] = [tree.length - 1];
                items.splice(i, 1);
                i--;
            } else {
                let posArr = pos[items[i].pid];
                if (posArr != undefined) {
                    let obj = tree[posArr[0]];
                    for (let j = 1; j < posArr.length; j++) {
                        obj = obj.children[posArr[j]];
                    }
                    if (items[i].type == 'page') {
                        obj.children.push({
                            id: items[i].uuid,
                            pid: items[i].pid,
                            name: items[i].urlName,
                            type: 'page',
                            children: [],
                        });
                    } else {
                        obj.children.push({
                            id: items[i].uuid,
                            pid: items[i].pid,
                            name: items[i].urlName,
                            url: items[i].url,
                            blank: items[i].blank,
                            type: 'url',
                            children: [],
                        });
                    }
                    pos[items[i].uuid] = posArr.concat([obj.children.length - 1]);
                    items.splice(i, 1);
                    i--;
                } else {
                    items.splice(i, 1);
                    i--
                }
            }
            i++;
            if (i > items.length - 1) {
                i = 0;
            }
        }
        return tree;
    },


    getHeader: (req) => {
        let uid = req.get('C-Uid');
        let name = req.get('C-Name');
        let firstname = req.get('C-Firstname');
        let lastname = req.get('C-Lastname');
        let avatar = req.get('C-Avatar');
        let email = req.get('C-Email');
        let domain = req.get('C-Domain');
        let csId = req.get('C-Cs-Id');
        let sId = req.get('C-Instance-Id');
        let roles = req.get('C-Roles');
        let groups = req.get('C-Groups');
        let udomain = req.get('C-Ui-Domain');

        // let sId = req.get('C-Cs-Id');

        let headers = {
            'C-Uid': uid,
            'C-Name': name,
            'C-Firstname': firstname,
            'C-Lastname': lastname,
            'C-Avatar': avatar,
            'C-Email': email,
            'C-Domain': domain,
            'C-Cs-Id': csId,
            'C-Instance-Id': sId,
            'C-Roles': roles,
            'C-Groups': groups,
            'C-Ui-Domain':udomain
        };

        let headers_test = {
            'C-Cs-Id': 'csjo0iyzquppty','C-Instance-Id': '11', 'C-Uid': 'zhangyuntao', 'C-Name': 'zhangyuntao'
        };

        if (config.webConfig.env === 'dev') {
            return headers_test;
        } else {
            return headers;
        }

    }
}
;