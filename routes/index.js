var express = require('express');
var router = express.Router();

var pg = require('pg');
var conString = "postgres://root:root@localhost/databasename"; // Cadena de conexión a la base de datos

// Set up your database query to display GeoJSON
var coffee_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, name)) As properties FROM cambridge_coffee_shops As lg) As f) As fc";


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
