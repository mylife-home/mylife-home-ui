'use strict';

const express = require('express');

module.exports = function(netJPacketManager) {

  const router = express.Router();

  router.route('/enum').get(function(req, res) {
    netJPacketManager.resourceEnum((err, list) => {
      if(err) { return res.status(500).json(err); }
      res.json(list);
    });
  });

  router.route('/get/:key').get(function(req, res) {
    netJPacketManager.resourceGet(req.params.key, (err, list) => {
      if(err) { return res.status(500).json(err); }
      res.json(list);
    });
  });

  return router;
};
