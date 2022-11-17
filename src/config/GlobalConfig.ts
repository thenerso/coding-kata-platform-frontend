/**
 * Config types
 */
type IGlobalConfig = {
  [key: string]: any;
  env: string;
  server_url: string;
};

/**
 * Load in environment variables from the .env and export them
 * Has the single responsibility of configuring origins, to keep the service classes DRY
 */
const GlobalConfig: IGlobalConfig = {
  env: process.env.NODE_ENV || "development",
  server_url: process.env.REACT_APP_SERVER_URL || "http://localhost:8080",
  ga_id: process.env.REACT_APP_GOOGLE_ANALYTICS,
};

export default GlobalConfig;
