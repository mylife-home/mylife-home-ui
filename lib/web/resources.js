'use strict';

const express = require('express');

module.exports = function(netJPacketClient) {

  const router = express.Router();

  router.route('/enum').get(function(req, res) {
    netJPacketClient.resourceEnum((err, list) => {
      if(err) { return res.status(500).json(err); }
      res.json(list);
    });
  });

  router.route('/get/:key').get(function(req, res) {
    netJPacketClient.resourceGet(req.params.key, (err, list) => {
      if(err) { return res.status(500).json(err); }
      res.json(list);
    });
  });

  return router;
};
