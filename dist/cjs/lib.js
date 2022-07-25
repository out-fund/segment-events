"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputLableValue = exports.getInputProperties = exports.getElementProperties = exports.getSurfaceData = exports.getAttributes = exports.getDataAttribute = exports.getParams = exports.getPageInfo = exports.getPageName = exports.getRegionFromPath = exports.utmCookie = exports.utmSourceTracking = exports.getParameterByName = exports.setCookie = void 0;
const universal_cookie_1 = __importDefault(require("universal-cookie"));
function setCookie(name, value) {
    const cookie = new universal_cookie_1.default();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    cookie.set(name, JSON.stringify(value), { path: '/', expires: expires });
}
exports.setCookie = setCookie;
function getUTM() {
    const defaultUtms = {
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
        gclid: null,
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
exports.getParams = getParams;
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
exports.getParameterByName = getParameterByName;
function utmSourceTracking(url, utmParams) {
    const cookie = new universal_cookie_1.default();
    let defaultUtms = getUTM();
    let utms = utmParams ? utmParams : defaultUtms;
    if (cookie.get('outfund_analytics')) {
        utms = cookie.get('outfund_analytics');
    }
    for (let key in utms) {
        const value = getParameterByName(key, url);
        if (value) {
            utms[key] = value;
            setCookie('outfund_analytics', utms);
        }
    }
    return utms;
}
exports.utmSourceTracking = utmSourceTracking;
function utmCookie() {
    const cookie = new universal_cookie_1.default();
    let defaultUtms = getUTM();
    if (cookie.get('outfund_analytics'))
        return cookie.get('outfund_analytics');
    return defaultUtms;
}
exports.utmCookie = utmCookie;
function getRegionFromPath(regions, path) {
    let region = 'uk'; // TODO: config default region
    if (regions.length > 0) {
        for (let i = 0; i < regions.length; i++) {
            if (path.indexOf(`/${regions[i]}`) > -1) {
                region = regions[i];
                break;
            }
        }
    }
    return region;
}
exports.getRegionFromPath = getRegionFromPath;
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
exports.getPageName = getPageName;
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
exports.getPageInfo = getPageInfo;
var CustomAttributes;
(function (CustomAttributes) {
    CustomAttributes["elementType"] = "element-type";
    CustomAttributes["elementName"] = "element-name";
    CustomAttributes["elementState"] = "element-state";
    CustomAttributes["surfaceTitle"] = "data-surface-title";
    CustomAttributes["surfaceType"] = "data-surface-type";
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
exports.getSurfaceData = getSurfaceData;
function getDataAttribute(attribute, element) {
    const value = element.getAttribute(attribute);
    return value ? value : '';
}
exports.getDataAttribute = getDataAttribute;
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
    };
}
exports.getAttributes = getAttributes;
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
exports.getElementProperties = getElementProperties;
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
exports.getInputProperties = getInputProperties;
function getInputLableValue(element) {
    var _a;
    const label = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('label');
    if (label) {
        return label.textContent || label.innerText;
    }
    return false;
}
exports.getInputLableValue = getInputLableValue;
