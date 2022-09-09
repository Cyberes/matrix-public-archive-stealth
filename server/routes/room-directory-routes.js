'use strict';

const assert = require('assert');
const path = require('path');
const urlJoin = require('url-join');
const express = require('express');
const asyncHandler = require('../lib/express-async-handler');

const fetchPublicRooms = require('../lib/matrix-utils/fetch-public-rooms');
const renderHydrogenVmRenderScriptToPageHtml = require('../hydrogen-render/render-hydrogen-vm-render-script-to-page-html');

const config = require('../lib/config');
const basePath = config.get('basePath');
assert(basePath);
const matrixServerUrl = config.get('matrixServerUrl');
assert(matrixServerUrl);
const matrixServerName = config.get('matrixServerName');
assert(matrixServerName);
const matrixAccessToken = config.get('matrixAccessToken');
assert(matrixAccessToken);

const router = express.Router({
  caseSensitive: true,
  // Preserve the req.params values from the parent router.
  mergeParams: true,
});

router.get(
  '/',
  asyncHandler(async function (req, res) {
    const paginationToken = req.query.page;

    const { rooms, nextPaginationToken, prevPaginationToken } = await fetchPublicRooms(
      matrixAccessToken,
      {
        //server: TODO,
        paginationToken,
        // It would be good to grab more rooms than we display in case we need
        // to filter any out but then the pagination tokens with the homeserver
        // will be out of sync. XXX: It would be better if we could just filter
        // `/publicRooms` directly via the API (needs MSC).
        limit: 9,
      }
    );

    const hydrogenStylesUrl = urlJoin(basePath, '/hydrogen-styles.css');
    const stylesUrl = urlJoin(basePath, '/css/styles.css');
    const roomDirectoryStylesUrl = urlJoin(basePath, '/css/room-directory.css');
    const jsBundleUrl = urlJoin(basePath, '/js/entry-client-room-directory.es.js');

    const pageHtml = await renderHydrogenVmRenderScriptToPageHtml(
      path.resolve(__dirname, '../../shared/room-directory-vm-render-script.js'),
      {
        rooms,
        nextPaginationToken,
        prevPaginationToken,
        searchTerm: 'foobar (TODO)',
        config: {
          basePath,
          matrixServerUrl,
          matrixServerName,
        },
      },
      {
        title: `Matrix Public Archive`,
        styles: [hydrogenStylesUrl, stylesUrl, roomDirectoryStylesUrl],
        scripts: [jsBundleUrl],
      }
    );

    res.set('Content-Type', 'text/html');
    res.send(pageHtml);
  })
);

module.exports = router;