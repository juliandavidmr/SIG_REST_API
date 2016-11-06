var express = require('express');
var router = express.Router();

var pg = require('pg');
var conString = "postgres://postgres:root@localhost/proyecto_sig"; // Cadena de conexión a la base de datos

// Set up your database query to display GeoJSON
var coffee_query = "SELECT row_to_json(fc) FROM ( SELECT array_to_json(array_agg(f)) As Datos FROM (" +
    "SELECT ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, name)) As prope" +
    "rties FROM cambridge_coffee_shops As lg) As f) As fc";

/*
SELECT row_to_json(fc) FROM (
	SELECT array_to_json(array_agg(f)) As features FROM (
		SELECT ST_AsGeoJSON(lg.geom)::json As geometry,
		row_to_json((id, name)) As properties FROM cambridge_coffee_shops As lg
	) As f
) As fc
*/

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

/* GET Postgres JSON data */
router.get('/data', function (req, res) {
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query(coffee_query);
  query.on("row", function (row, result) {
    result.addRow(row);
  });
  query.on("end", function (result) {
    res.json(result.rows[0].row_to_json);
    res.end();
  });
});

module.exports = router;
