'use strict';
'format es6';

angular.module('mylife-home-ui.components.repository', ['mylife-home-ui.components.data'])

.factory('repository', function(socket) {
  const repo = new Map();

  socket.on('state', (data) => {
    repo.clear();

    for(let id in data) {
      if(!data.hasOwnProperty(id)) { continue; }
      repo.set(id, data[id]);
    }
  });

  socket.on('add', (data) => {
    repo.set(data.id, data.attributes);
  });

  socket.on('remove', (data) => {
    repo.delete(data.id);
  });

  socket.on('change', (data) => {
    const obj = repo.get(data.id);
    if(!obj) { return; }
    obj[data.name] = data.value;
  });

  return repo;
});