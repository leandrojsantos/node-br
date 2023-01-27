/**
 * index = chamar os metedos
 */

const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb')
const Postgres = require('./db/strategies/postgres')

/**
 * apos isso instacia o obj
 */
const contexMongo = new ContextStrategy(new MongoDB())
contexMongo.create()

const contexPostgres = new ContextStrategy(new Postgres)
contexPostgres.create()

