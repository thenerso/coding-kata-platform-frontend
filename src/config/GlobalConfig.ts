//@ts-nocheck
//@TODO - convert this file to TS
// Has the single responsibility of configuring origins, to keep the service classes DRY
const GlobalConfig = {
  inProduction: false,
  PROTOCOL: "http",
  DOMAIN_NAME: "http://bntechacademy.com",
  LOCALHSOT: "http://localhost",
  API_PORT: "8080",
  FRONTEND_PORT: "80",

  getFrontendOrigin: () =>
    this.inProduction ? this.DOMAIN_NAME : this.LOCALHSOT,
  getApiOrigin: () =>
    this.inProduction ? this.DOMAIN_NAME : this.LOCALHSOT + this.API_PORT,
};

export default GlobalConfig;
