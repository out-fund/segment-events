function setCookie(name, value) {
    let d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    let cookie_value = JSON.stringify(value);
    document.cookie = name + '=' + cookie_value + ';' + expires + ';path=/;SameSite=Lax"';
}
function getCookie(cookie_name) {
    if (typeof window === 'undefined')
        return false;
    try {
        const hasCookie = document.cookie.match(new RegExp('(^| )' + cookie_name + '=([^;]+)'));
        if (hasCookie && hasCookie.length > 2) {
            return JSON.parse(hasCookie[2]);
        }
        else {
            return false;
        }
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
function getUTM() {
    const defaultUtms = {
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
        utm_id: null,
        gclid: null,
        utm_chnl_adgrp: null,
        utm_chnl_adgrp_id: null,
        utm_cta: null,
        utm_chnl_cmp: null,
        utm_outfund: null,
        utm_outfund_id: null,
        utm_outfund_source: null,
        ad_group: null,
        target_id: null,
    };
    return defaultUtms;
}
function getParams() {
    const params = new URLSearchParams(window.location.search);
    const paramsArray = {};
    for (let pair of params.entries()) {
        paramsArray[pair[0]] = pair[1];
    }
    return paramsArray;
}
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function utmSourceTracking(url, utmParams) {
    const cookie = getCookie('outfund_analytics');
    const allowedUtms = getUTM();
    let utms = {};
    if (cookie && Object.keys(cookie) && Object.keys(cookie).length > 0) {
        utms = cookie;
    }
    for (let key in allowedUtms) {
        const value = getParameterByName(key, url);
        if (value) {
            utms[key] = value;
            setCookie('outfund_analytics', utms);
        }
    }
    return utms;
}
function utmCookie() {
    const cookie = getCookie('outfund_analytics');
    if (cookie)
        return cookie;
    return false;
}
function getRegionFromPath(regions, path) {
    let region = 'uk';
    if (regions && regions.length > 0) {
        for (let i = 0; i < regions.length; i++) {
            if (path.indexOf(`/${regions[i]}`) > -1) {
                region = regions[i];
                break;
            }
        }
    }
    return region;
}
function getPageName(title, pageNames) {
    if (typeof window === 'undefined')
        return;
    const strArray = title.split('|');
    if (strArray.length > 1) {
        return strArray[0].trim();
    }
    else {
        return title;
    }
}
function getPageInfo() {
    const path = document.location.pathname;
    const url = document.location.href;
    const utms = utmSourceTracking(url);
    const pageName = getPageName(document.title);
    const params = getParams();
    return {
        path,
        url,
        utms,
        pageName,
        params,
    };
}
var CustomAttributes;
(function (CustomAttributes) {
    CustomAttributes["elementType"] = "element-type";
    CustomAttributes["elementName"] = "element-name";
    CustomAttributes["elementState"] = "element-state";
    CustomAttributes["surfaceTitle"] = "data-surface-title";
    CustomAttributes["surfaceType"] = "data-surface-type";
    CustomAttributes["category"] = "data-element-category";
})(CustomAttributes || (CustomAttributes = {}));
function getSurfaceData(element, surface) {
    let surfaceData = element.getAttribute(`data-surface-${surface}`) || false;
    if (surfaceData)
        return surfaceData;
    const parent = (element === null || element === void 0 ? void 0 : element.parentNode) || false;
    const parent2 = (parent && (parent === null || parent === void 0 ? void 0 : parent.parentNode)) || false;
    const parent3 = (parent2 && (parent2 === null || parent2 === void 0 ? void 0 : parent2.parentNode)) || false;
    const parent4 = (parent3 && (parent3 === null || parent3 === void 0 ? void 0 : parent3.parentNode)) || false;
    const tree = [parent, parent2, parent3, parent4];
    for (let i = 0; i < tree.length; i++) {
        if (tree[i]) {
            const el = tree[i];
            const hasSurfaceData = el.getAttribute(`data-surface-${surface}`);
            if (hasSurfaceData)
                surfaceData = hasSurfaceData;
            if (surfaceData)
                break;
        }
    }
    return surfaceData ? surfaceData : '';
}
function getDataAttribute(attribute, element) {
    const value = element.getAttribute(attribute);
    return value ? value : '';
}
function getAttributes(element) {
    const attributes = {};
    for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        attributes[attr.name] = attr.value;
    }
    return {
        type: attributes.hasOwnProperty(CustomAttributes.elementType)
            ? attributes[CustomAttributes.elementType]
            : 'undefined',
        name: attributes.hasOwnProperty(CustomAttributes.elementName) ? attributes[CustomAttributes.elementName] : '',
        surfaceTitle: attributes.hasOwnProperty(CustomAttributes.surfaceTitle)
            ? attributes[CustomAttributes.surfaceTitle]
            : getSurfaceData(element, 'title'),
        surfaceType: attributes.hasOwnProperty(CustomAttributes.surfaceType)
            ? attributes[CustomAttributes.surfaceType]
            : getSurfaceData(element, 'type'),
        category: attributes.hasOwnProperty(CustomAttributes.category) ? attributes[CustomAttributes.category] : '',
    };
}
function getElementProperties(element) {
    const href = element.getAttribute('href') || '';
    const title = element.getAttribute('title') || '';
    const text = element.textContent || element.innerText || '';
    let innerText = '';
    if (text.length > 0 && text.length > 0) {
        innerText = text;
    }
    if (!innerText && title) {
        innerText = title;
    }
    return {
        href,
        title,
        text: innerText,
    };
}
function getInputProperties(element) {
    const type = element.getAttribute('type') || undefined;
    const value = type === 'password' ? '[REDACTED]' : element.getAttribute('value') || '';
    const attr = getAttributes(element);
    return {
        type,
        name: attr.name || element.getAttribute('name') || '',
        value,
        field_name: element.getAttribute('name') || '',
        trait: getDataAttribute('data-trait', element) || false,
        surface_title: attr.surfaceTitle,
        surface_type: attr.surfaceType,
    };
}
function getInputLableValue(element) {
    var _a;
    const label = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('label');
    if (label) {
        return label.textContent || label.innerText;
    }
    return false;
}
function parsePageNameFromPath(pages, region) {
    var _a;
    if (typeof window === 'undefined')
        return '';
    let path = document.location.pathname;
    //if region exists in path, remove it
    if (region && region.length > 0) {
        for (let i = 0; i < region.length; i++) {
            if (path.indexOf(`/${region[i]}`) > -1) {
                path = path.replace(`/${region[i]}`, '');
                break;
            }
        }
    }
    return ((_a = pages.find((page) => page.path === path)) === null || _a === void 0 ? void 0 : _a.name) || false;
}
export { setCookie, getCookie, getParameterByName, utmSourceTracking, utmCookie, getRegionFromPath, getPageName, getPageInfo, getParams, getDataAttribute, getAttributes, getSurfaceData, getElementProperties, getInputProperties, getInputLableValue, parsePageNameFromPath, };
