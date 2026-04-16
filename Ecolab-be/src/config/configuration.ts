/**
 * Provides the configuration settings for the application.
 * @returns {Object} The configuration object.
 * @property {Object} database - The database connection settings.
 * @property {string} database.host - The database host.
 * @property {string} database.username - The database username.
 * @property {string} database.password - The database password.
 * @property {string} database.database - The database name.
 * @property {number} database.port - The database port.
 * @property {string} secret - The secret key used for application security.
 */
export default () => ({
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
  },
  secret: process.env.SECRET,
});
