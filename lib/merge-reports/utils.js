'use strict';

const _ = require('lodash');
const {SUCCESS, FAIL, ERROR, SKIPPED} = require('../constants/test-statuses');

const statusToStat = {
    [SUCCESS]: 'passed',
    [FAIL]: 'failed',
    [ERROR]: 'failed',
    [SKIPPED]: 'skipped'
};

function collectBrowsersFrom(node) {
    const browsers = node.browsers ? node.browsers : [];
    const browsersFromChildren = node.children ? _.flatten(node.children.map((child) => collectBrowsersFrom(child))) : [];

    return [...browsers, ...browsersFromChildren];
}

function getDataFrom(node, {fieldName, fromFields}) {
    if (!fromFields) {
        return [].concat(_.get(node, fieldName, []));
    }

    const {result = {}, retries = {}} = _.pick(node, fromFields);

    return _.isEmpty(result) && _.isEmpty(retries)
        ? walk(node, (n) => getDataFrom(n, {fieldName, fromFields}), _.flatMap)
        : [].concat(_.get(result, fieldName, []), _.flatMap(retries, fieldName));
}

function getImagePaths(node, fromFields) {
    return _(getDataFrom(node, {fieldName: 'imagesInfo', fromFields}))
        .flatMap((imageInfo) => _.at(imageInfo, ['expectedImg.path', 'actualImg.path', 'diffImg.path']))
        .compact()
        .value();
}

function getStatNameForStatus(status) {
    return statusToStat[status];
}

function walk(node, cb, fn) {
    const resultFromBrowsers = node.browsers ? fn(node.browsers, cb) : [];
    const resultFromChildren = node.children ? fn(node.children, cb) : [];

    return [...resultFromBrowsers, ...resultFromChildren];
}

function isAbsoluteUrl(str) {
    return /^http(s)?:\/\//.test(str);
}

module.exports = {
    getImagePaths,
    getStatNameForStatus,
    collectBrowsersFrom,
    isAbsoluteUrl
};
