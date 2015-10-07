'use strict';

// jrequest : id, type
// jresponse : id, type
// jres_data(jresponse) : data
// jres_error(jresponse) : message
// jres_success(jresponse)
// jreq_enum(jrequest)
// jreq_get(jrequest) : key
// jreq_set(jrequest) : key, value
// jres_success::type_def = "success";
// jres_error::type_def = "error";
// jreq_enum::type_def = "enum";
// jreq_enum::response_type_def = "rs_enum";
// jreq_get::type_def = "get";
// jreq_get::response_type_def = "rs_get";
// jreq_set::type_def = "set";
// jreq_set::response_type_def = "rs_set";

// format irc :
// jpacket init <id> <data count>
// jpacket data <id> <data1>
// jpacket data <id> <data2>
// expiration du paquet si au bout de 30 secondes il n'a plus été mis à jour et n'est pas terminé

// max msg : 512 chars. On compte 150 pour nick + command, il reste 362. on prend 300 comme marge (si le nick est plus long plus tard mettons ...)

module.exports = {
  Manager  : require('./manager'),
  Client   : require('./client'),
  Executor : require('./executor'),
  Factory  : require('./factory')
};