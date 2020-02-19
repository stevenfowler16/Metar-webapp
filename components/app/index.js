import { AviationWeatherController } from "../controllers/aviation-weather-controller";
import { MetarControl } from "../MetarControl.ts/metar-control";
class MetarWebApp extends HTMLElement {
    constructor() {
        super();
        let metarApi = new AviationWeatherController();
        metarApi.url = "https://cors-anywhere.herokuapp.com/" + "https://www.aviationweather.gov/cgi-bin/json/MetarJSON.php";
        this.metarControl = new MetarControl(metarApi);
        this.appendChild(this.metarControl);
    }
}
customElements.define('metar-web-app', MetarWebApp);
export { MetarWebApp };
