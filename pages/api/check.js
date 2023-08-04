import COUNTRIES from "../../assets/countries.json";
const fs = require("fs");
const Reader = require("@maxmind/geoip2-node").Reader;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ip } = req.body;
    // Synchronous database opening
    let response = null;

    const dbBuffer = fs.readFileSync("./assets/GeoLite2-Country.mmdb");

    // This reader object should be reused across lookups as creation of it is
    // expensive.
    const reader = Reader.openBuffer(dbBuffer);
    try {
      response = reader.country(ip);
    } catch (error) {
      response = {
        code: "US",
        country: COUNTRIES["US"].countryName,
        currency: COUNTRIES["US"].currency,
        symbol: COUNTRIES["US"].symbol,
      };

      return res.status(200).json(response);
    }

    res.status(200).json({
      code: response.country.isoCode,
      country: COUNTRIES[response.country.isoCode].countryName,
      currency: COUNTRIES[response.country.isoCode].currency,
      symbol: COUNTRIES[response.country.isoCode].symbol,
    });
  }
}
