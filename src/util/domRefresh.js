import $ from 'jquery'
import {
    emitter,
    SNACKBAR,
    GETNAV,
    THEME_CHANGE, SET_THEME,
    SETSITE
} from './EventEmitter';


import Group from '../class/component/Group';
import Section from '../class/section/Section';
import Banner from '../class/section/Banner';
import TextComponent from '../class/component/TextComponent';
import ImageComponent from '../class/component/ImageComponent';
import VideoComponent from '../class/component/VideoComponent';
import DivdingComponent from '../class/component/DividingComponent';


const teamWorkRemark = (data,link) => {

    $(`#teamworkMarks`).show().find('.msg .usr').html(data);
    $(`#teamworkMarks`).show().find('.msg .link').attr('href',link);


};

const findOne = (_id) => {
    if (!_id) return null;

    for (let i of window.comps) {
        if (i.uid === _id) {
            return i
        }
    }
    return null
};

const findNav = () => {

    for (let i of window.comps) {
        if (i.blockType === 'nav') {
            return i
        }
    }
    return null
};

const scrollToBottom = () => {
    let contentHeight = $('#content').height();
    let containerHeight = $('#mainContainer').height();
    // $('#mainContainer').scrollTop(contentHeight - containerHeight)

    let vroot = parseInt($('html').css('fontSize'));
    let vrem = parseFloat(contentHeight - containerHeight);
    let vh = `${vrem - 18 * vroot}`;

    // console.log(vh);
    $('#mainContainer').scrollTop(vh)
};


const typeAction = {

    //row_text_up
    r_t_up: (cur, data) => {

        $(cur.component).find('.tb-content').html(data.data.inner)


    },
    // r_t_font: (cur, data) => {
    //     var range = document.createRange();
    //     row endContainer = $(`#${data.data.endContainer}`)[0],
    //         endOffset = data.data.endOffset,
    //         startContainer = $(`#${data.data.startContainer}`)[0],
    //         startOffset = data.data.startOffset;
    //     console.log(endContainer, startContainer, endOffset, startOffset);
    //     range.setStart(startContainer, startOffset);
    //     range.setEnd(endContainer, endOffset);
    //     range.deleteContents();
    //     // document.designMode = "on";
    //     // document.execCommand("bold", false, 'null');
    //     // document.designMode = "off";
    // },

    //row_image_add
    r_i_add: (cur, data) => {
        $(cur.component).find('.image-empty').remove();
        $(cur.component).find('.image-show').show();
        cur.src = data.data.src;
        cur.component.dataset.src = cur.src;
        $(cur.component).find('.show').css({'background-image': `url("${cur.src}")`});
    },

    //row_image_up
    r_i_up: (cur, data) => {

        if (data.data.hasOwnProperty(alt)) {
            cur.component.dataset.alt = data.data.alt;
        }
        if (data.data.hasOwnProperty(link)) {
            cur.component.dataset.link = data.data.link;

        }
    },
    //row_video_up
    r_v_up: (cur, data) => {

        if (data.data.hasOwnProperty(alt)) {
            cur.component.dataset.alt = data.data.alt;
        }
        if (data.data.hasOwnProperty(src)) {
            cur.src = src;
            cur.component.dataset.alt = data.data.alt;
        }
        if (data.data.hasOwnProperty(link)) {
            cur.component.dataset.link = data.data.link;

        }
    },

    //row_remove
    r_remove: (cur, data) => {
        let group = $(cur.component).parents('.group')[0];
        $(cur.component).remove();
        for (let i = 0; i < window.comps.length; i++) {
            if (window.comps[i].uid == data._id) {
                let obj = window.comps.splice(i, 1);
                obj = null;
            }
        }
        cur.removeEmpty(group);
    },

    //row_resize
    r_resize: (cur, data) => {
        let group = $(cur.component).parents('.group')[0];
        let curCol = Number(group.dataset.col);
        let newCol = data.data.newCol
        if (data.data.resizeAnchor == 'l' || data.data.resizeAnchor == 'lb') {

            group.className = `group col-md-${newCol}`;
            group.dataset.col = newCol;
            if (newCol < curCol) {
                let colPlaceholder = `<div class="col-placeholder"></div>`.repeat(curCol - newCol);
                $(group).before(colPlaceholder);
            } else {
                cur.removePrevColPlaceHolder(newCol - curCol, group);
            }
        } else if (data.data.resizeAnchor == 'r' || data.data.resizeAnchor == 'rb') {

            group.className = `group col-md-${newCol}`;
            group.dataset.col = newCol;
            if (newCol < curCol) {
                let colPlaceholder = `<div class="col-placeholder"></div>`.repeat(curCol - newCol);
                $(group).after(colPlaceholder);
            } else {
                cur.removeNextColPlaceHolder(newCol - curCol, group);
            }
        }
    },

    //row_move
    r_move: (cur, data) => {

        let pos = data.data.pos;
        let target = findOne(data.data.target);
        // if (!target) return;
        let parentGroup = $(cur.component).parents('.group')[0];
        let configSec = data.data.section;
        let configGro = data.data.group;
        let newSection, group, targetPlaceHolder,
            nextp, cw, newGroup, section,
            targetGroup, parentSection, g

        switch (pos) {
            case 'row2_n_s':
                newSection = new Section(configSec);
                group = new Group(configGro);
                configSec['loadPosition'] = {
                    target: target.section,
                    position: data.data.position
                };


                group.loadRow(cur.component);
                newSection.loadGroup(group.component);

                break;
            case 'row2_r':

                if (data.data.position === 'before') {

                    $(target.component).before(cur.component);

                } else if (data.data.position === 'after') {
                    $(target.component).after(cur.component);

                }

                break;
            case 'row2_n_g':
                group = new Group(configGro);
                group.loadRow(cur.component);
                let targetSection = $(target.component).parents('section');
                let parentGroupCol = Number(parentGroup.dataset.col);

                if (data.data.place) {
                    for (let i = 0; i < parentGroupCol; i++) {
                        $(targetSection.find('.col-placeholder')[i]).addClass('col-placeholder-remove');
                    }
                }

                $('.col-placeholder-remove').remove();
                if (data.data.position === 'before') {

                    $(target.component).before(group.component);


                } else if (data.data.position === 'after') {
                    $(target.component).after(group.component);

                }

                break;
            case 'row2_n_g_np':
                group = new Group(configGro);
                group.loadRow(cur.component);


                $('.col-placeholder-remove').remove();
                if (data.data.position === 'before') {

                    $(target.component).before(group.component);


                } else if (data.data.position === 'after') {
                    $(target.component).after(group.component);

                }
                g = findOne(data.data.g.uid);

                g.component.dataset.col = data.data.g.col;
                g.component.className = `group col-md-${data.data.g.col}`;
                // cur.removeEmpty(parentSection);
                break;
            case 'row2_n_g_np1':

                parentSection = $(cur.component).parents('section')[0];

                $('.col-placeholder-remove').remove();
                if (data.data.position === 'before') {

                    $(target.component).before(cur.component);


                } else if (data.data.position === 'after') {
                    $(target.component).after(cur.component);

                }
                g = findOne(data.data.g.uid);

                g.component.dataset.col = data.data.g.col;
                g.component.className = `group col-md-${data.data.g.col}`;
                cur.removeEmpty(parentSection);
                break;
            case 'row_in_s':
                targetPlaceHolder = cur.getPositionPlaceHolder(data.data.colIndex, null, cur.component);
                cw = data.data.cw;

                $(cur.component).after(`<div class="col-placeholder"></div>`.repeat(cw));
                nextp = $(targetPlaceHolder).nextAll('.col-placeholder');
                for (let i = 0; i < cw - 1; i++) {
                    $(nextp[i]).remove();
                }
                targetPlaceHolder.after(cur.component);
                $(targetPlaceHolder).remove();
                break;

            case 'row_in_s1':
                targetPlaceHolder = cur.getPositionPlaceHolder(data.data.colIndex, null, cur.component);
                cw = data.data.cw;
                $(parentGroup).before(`<div class="col-placeholder"></div>`.repeat(cw));
                pretp = $(targetPlaceHolder).prevAll('.col-placeholder');
                if (pretp.length < cw) {
                    cur.removeNextColPlaceHolder(cw - pretp.length - 1, cur.component);
                }
                for (let i = 0; i < cw - 1; i++) {
                    $(pretp[i]).remove();
                }
                targetPlaceHolder.after(cur.component);
                $(targetPlaceHolder).remove();
                break;

            case 'row_in_s2':

                parentGroup = findOne(data.data.parentG);
                cw = data.data.cw;

                targetPlaceHolder = cur.getPositionPlaceHolder(data.data.colIndex, null, parentGroup.component);
                nextp = $(targetPlaceHolder).nextAll('.col-placeholder');
                for (let i = 0; i < cw - 1; i++) {
                    $(nextp[i]).remove();
                }
                newGroup = new Group(data.data.group);
                newGroup.loadRow(cur.component);
                targetPlaceHolder.after(newGroup.component);
                $(targetPlaceHolder).remove();
                break;
            case 'row_in_r':

                $(cur.component).before(`<div class="col-placeholder"></div>`.repeat(data.data.cw));
                for (let i = 0; i < data.data.cw; i++) {
                    $(cur.component).next('.col-placeholder').remove();
                }
                break;

            case 'row_in_s3':
                targetPlaceHolder = cur.getPositionPlaceHolder(data.data.colIndex, null, cur.component);
                cw = data.data.cw;
                $(cur.component).before(`<div class="col-placeholder"></div>`.repeat(cw));
                nextp = $(targetPlaceHolder).nextAll('.col-placeholder');
                if (nextp.length < cw) {
                    cur.removePrevColPlaceHolder(cw - nextp.length - 1, cur.component);
                }
                for (let i = 0; i < cw - 1; i++) {
                    $(nextp[i]).remove();
                }
                break
            case 'row_in_s4':
                cw = data.data.cw;

                targetPlaceHolder = cur.getPositionPlaceHolder(data.data.colIndex, null, parentGroup.component);
                nextp = jq(targetPlaceHolder).nextAll('.col-placeholder');
                if ((nextp.length + 1) < cw) {
                    cw = nextp.length + 1;
                }
                for (let i = 0; i < cw - 1; i++) {
                    $(nextp[i]).remove();
                }
                newGroup = new Group(configGro);
                newGroup.loadRow(cur.component);
                targetPlaceHolder.after(newGroup.component);
                $(targetPlaceHolder).remove();
                break;

            case 'row_no_s':
                parentSection = $(cur.component).parents('section')[0];

                section = findOne(data.data.section)
                targetPlaceHolder = cur.getPositionPlaceHolder(data.data.colIndex, section.section, cur.component);


                nextp = $(targetPlaceHolder).nextAll('.col-placeholder');


                for (let i = 0; i < cw - 1; i++) {
                    $(targetPlaceHolder).next('.col-placeholder').remove();
                }
                if (nextp.length < cw - 1) {
                    cw = nextp.length + 1;
                }
                cur.component.dataset.col = cw;
                cur.component.className = `group col-md-${cw}`;
                $(targetPlaceHolder).after(cur.component);
                $(targetPlaceHolder).remove();
                cur.removeEmpty(parentSection);

                break;


            case 'row_no_s1':
                newGroup = new Group(configGro);
                newGroup.loadRow(cur.component);
                targetGroup = findOne(data.data.targroup);
                parentSection = $(cur.component).parents('section')[0];

                if (data.data.preGroup.length) {
                    let cols = $(targetGroup).nextAll('.col-placeholder');
                    for (let i = 0; i < data.data.empty; i++) {
                        $(cols[i]).addClass('col-placeholder-remove');
                    }
                    targetGroup.after(newGroup.component);
                } else {
                    let cols = $(targetGroup).prevAll('.col-placeholder');
                    for (let i = 0; i < data.data.empty; i++) {
                        $(cols[i]).addClass('col-placeholder-remove');
                    }
                    targetGroup.before(newGroup.component);
                }
                $('.col-placeholder-remove').remove();

                if ($(cur.component).find('ide-row').length == 0) {
                    $(cur.component).remove();
                }
                if ($(parentSection).find('.group').length == 0) {
                    $(parentSection).remove();
                }
                break

            case 'row_no_s2':
                parentSection = $(cur.component).parents('section')[0];

                if (data.data.position === 'before') {
                    $(target).before(cur.component);

                } else if (data.data.position === 'after') {
                    $(target).after(cur.component);

                }

                if ($(cur.component).find('ide-row').length == 0) {
                    $(cur.component).remove();
                }
                if ($(parentSection).find('.group').length == 0) {
                    $(parentSection).remove();
                }
                break


            case 'row_no_s3':
                newGroup = new Group(configGro);

                cw = data.data.cw;
                empty = data.data.empty;
                newGroup.loadRow(cur.component);
                if (data.data.p == 'pre') {
                    let cols = $(target).nextAll('.col-placeholder');
                    for (let i = 0; i < cw; i++) {
                        $(cols[i]).addClass('col-placeholder-remove');
                    }
                    target.after(newGroup.component);
                } else {
                    let cols = $(target).prevAll('.col-placeholder');
                    for (let i = (cw - empty); i < cw; i++) {
                        $(cols[i]).addClass('col-placeholder-remove');
                    }
                    target.before(newGroup.component);
                }
                $('.col-placeholder-remove').remove();
                break;
            // case 'row2_n_g':
            //     row group = new Group(configGro);
            //     group.loadRow(cur.component);
            //     if (data.data.position === 'before') {
            //
            //         $(target.component).before(group.component);
            //
            //
            //     } else if (data.data.position === 'after') {
            //         $(target.component).after(group.component);
            //
            //     }
            //
            //     break;
        }
        cur.removeEmpty(parentGroup);


    },

    //section_move
    s_move: (cur, data) => {
        let target = findOne(data.data.target);

        if (data.data.position === 'before') {

            $(target.section).before(cur.section);

        } else if (data.data.position === 'after') {
            $(target.section).after(cur.section);

        }
    },
    s_up: (cur, data) => {

        if (data.data.hasOwnProperty('bgImage')) {
            cur.bgImage = data.data.bgImage;

            $(cur.section).find('.work-panel').css({backgroundImage: `url(${data.data.bgImage})`})
                .attr('data-bg-image', data.data.bgImage);
        }
        if (data.data.hasOwnProperty('bgcolor')) {
            let bgtype = data.data.bgcolor;
            $(cur.section).find('.work-panel').removeClass('weightTheme').removeClass('lightTheme');
            cur.handleBgChange(bgtype);
            $($(cur.section).find('.bg-choose button')[data.data.i]).addClass('active').siblings().removeClass('active');

        }
    },
    s_delete: (cur, data) => {
        $(cur.section).find('ide-group ide-row').each((i, m) => {
            let uid = m.dataset.id;
            for (let i = 0; i < window.comps.length; i++) {
                if (window.comps[i].uid == uid) {
                    let obj = window.comps.splice(i, 1);
                    obj = null;
                }
            }
        });
        $(cur.section).find('ide-group').each((i, m) => {
            let uid = m.dataset.id;
            for (let i = 0; i < window.comps.length; i++) {
                if (window.comps[i].uid == uid) {
                    let obj = window.comps.splice(i, 1);
                    obj = null;
                }
            }
        });
        $(cur.section).remove();
        for (let i = 0; i < window.comps.length; i++) {
            if (window.comps[i].uid == data._id) {
                let obj = window.comps.splice(i, 1);
                obj = null;
            }
        }
        if (data.data && data.data.block === 'banner') {
            $('#content').addClass('no-banners')

        }
    },
    s_copy: (cur, data) => {

        let s_uid = data.data.s_uid;
        let section = new Section({
            uid: s_uid,
            loadPosition: {
                target: cur.section,
                position: 'after'
            },
            ariaLabel: `section_${s_uid}`,
        });
        let groups = data.data.groups;
        for (let i = 0; i < groups.length; i++) {
            let g_uid = groups[i].g_uid;
            let col = groups[i].col;

            let group = new Group({
                uid: g_uid,
                col: col,
                ariaLabel: 'group_' + g_uid,
            });

            let rows = groups[i].rows;
            let comp;
            for (let j = 0; j < rows.length; j++) {

                switch (rows[i].type) {
                    case 'text':
                        comp = new TextComponent(rows[i].cfg);
                        break;
                    case 'image':

                        comp = new ImageComponent(rows[i].cfg);

                        break;
                    case 'video':
                        comp = new VideoComponent(rows[i].cfg);

                        break;
                    case 'dividing':
                        comp = new DividingComponent(rows[i].cfg);
                        break;
                }

                group.loadRow(comp.component);

            }

            section.loadGroup(group.component);
        }
    },
    g_move: (cur, data) => {

        let target = findOne(data.data.target);


        if (data.data.position === 'before') {

            $(target.component).before(cur.component);

        } else if (data.data.position === 'after') {
            $(target.component).after(cur.component);

        }

    },
    g_move_no: (cur, data) => {

        let target = findOne(data.data.target);
        let parentSection = $(cur.component).parents('section')[0];


        if (data.data.position === 'before') {

            $(target.component).before(cur.component);

        } else if (data.data.position === 'after') {
            $(target.component).after(cur.component);

        }
        cur.removeEmpty(parentSection);


    },

    b_add: (cur, data) => {
        let {bannerBg} = window.projectConfig;
        let s_id = data.data.s_id;
        let g_id = data.data.g_id;
        let r_id = data.data.r_id;
        let options = {
            uid: s_id,
            ariaLabel: '页眉部分',
            bannerBg: bannerBg || ''
        };
        let first = $('#content #article').find('section.section-panel');
        if (first.length > 0) {
            options.loadPosition = {
                target: first[0],
                position: 'after'
            };
        }

        let banner = new Banner(options);

        window.comps.push(banner);
        let bannerGroup = new Group({
            uid: g_id,
            col: 12,
            ariaLabel: '组' + Math.random().toString(),
        });
        window.comps.push(bannerGroup);
        let bannerText = new TextComponent({
            uid: r_id,
            initFormat: 'h1',
            ariaLabel: '标题',
        });
        bannerGroup.loadRow(bannerText.component);
        banner.loadGroup(bannerGroup.component);
        $('#content').removeClass('no-banners');

    },
    b_up: (cur, data) => {

        if (data.data.act === 'reset') {
            cur.bannerBg = '';
            $(cur.section).find('.reset-banner').addClass('reset-banner-h');
            cur.handleBgChange();
        }

        if (data.data.hasOwnProperty('bannerBg')) {
            cur.bannerBg = data.data.bannerBg;
            cur.handleBgChange();
        }
        if (data.data.hasOwnProperty('bannerType')) {
            cur.bannerType = data.data.bannerType;
            $($(cur.section).find('.cg-banner')[data.data.i]).addClass('cg-banner-active').siblings().removeClass('cg-banner-active');
            cur.bannerType = data.data.bannerType;
            cur.section.className = 'section-panel';
            $(cur.section).addClass(data.data.bannerType);
            window.projectConfig.bannerType = data.data.bannerType;
        }
    },
    n_up: (cur, data) => {


        cur = findNav();

        if (data.data.hasOwnProperty('siteName')) {
            window.projectConfig.sitesName = data.data.sitesName;
            $(cur.section).find('#navSiteName').val(data.data.sitesName)
        }
        if (data.data.hasOwnProperty('navType')) {
            cur.bgColor = data.data.navType;
            window.projectConfig.headerBg = data.data.navType;
            $($(cur.section).find('.s-bg-option li')[data.data.i]).addClass('active').siblings().removeClass('active');
            $('#nav-sbg span').text(data.data.navType);
            $(cur.section).find('.nav-wrap')[0].className = `nav-wrap navtheme-${data.data.navType}`;
        }
        if (data.data.hasOwnProperty('icon')) {
            let section = $(cur.section);
            cur.icon = data.data.icon
            if (cur.icon) {
                section.find('.preview-box').addClass('preview-box-show').find('img').attr('src', cur.icon);
                section.find('.upload').addClass('upload-hide');
                section.find('.s-bg').addClass('s-bg-show');
                section.find('.logo').append(`<img src="${cur.icon}"/>`);
            } else {
                section.find('.preview-box').removeClass('preview-box-show').find('img').attr('src', '');
                section.find('.upload').removeClass('upload-hide');
                section.find('.s-bg').removeClass('s-bg-show');
                section.find('.logo img').remove();
            }
            window.projectConfig.logo = cur.icon;

        }

    },
    in_b: (cur, data) => {
        let section;
        let s_cfg = data.data.s_cfg;
        let g_cfg = data.data.g_cfg;
        let r_cfg = data.data.r_cfg;

        section = new Section(s_cfg);
        window.comps.push(section);
        let group = new Group(g_cfg);
        window.comps.push(group);
        let row;
        switch (data.data.type) {
            case 'textarea':
                row = new TextComponent(r_cfg);

                break;
            case 'dividing':
                row = new DivdingComponent(r_cfg);
                break;
            case 'image':
                row = new ImageComponent(r_cfg);
                break;
            case 'video':
                row = new VideoComponent(r_cfg);
                break;
        }
        group.loadRow(row.component);
        section.loadGroup(group.component);
        window.comps.push(row);

        scrollToBottom();


    },
    in_lay: () => {

    },
    p_n: (cur, data) => {

        let siteName = data.data.siteName;
        emitter.emit(SETSITE, {siteName})
    }
};

const projectAction = {

    nav_up: (data) => {

        if (data.data && data.data.hasOwnProperty('node')) {

            if (_PAGE_ID == data.data.node) {
                teamWorkRemark(`${data.user}删除了页面`,data.data.target)
            }

        } else {
            emitter.emit(GETNAV);

        }

    },
    the_up: (data) => {
        let obj = {}
        if (data.data.hasOwnProperty('themeColor')) {
            window.projectConfig.themeColor = data.data.themeColor;
            // obj.customColor = data.data.themeColor
            obj.themeColor = data.data.themeColor

        }

        if (data.data.hasOwnProperty('themeId')) {
            window.projectConfig.themeId = data.data.themeId;
        }

        if (data.data.hasOwnProperty('theme')) {
            window.projectConfig.theme = data.data.theme;
            obj.theme = data.data.theme
        }
        // console.log(obj)
        emitter.emit(THEME_CHANGE);
        emitter.emit(SET_THEME, obj);

    },
    pro_d: (data) => {
        teamWorkRemark(`${data.user}删除了项目`,`/${_INSTANCEID}/ide/new`)
    }


};

export const domRefresh = (data) => {

    const type = data.type;
    const _id = data._id;
    const _pageId = data._pageId;
    const user = data.user;
    if (!type) return;
    if (typeof typeAction[type] == 'function' && _pageId === _PAGE_ID) {

        let current = findOne(_id);
        typeAction[type](current, data);
        emitter.emit(SNACKBAR, `${user}`);

    }
    if (typeof projectAction[type] == 'function') {
        projectAction[type](data);
        emitter.emit(SNACKBAR, `${user}`);
    }


};


