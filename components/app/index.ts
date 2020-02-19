
import { AviationWeatherController } from "../controllers/aviation-weather-controller";
import { MetarControl } from "../MetarControl.ts/metar-control";


/**
 * Web app class for pulling together the controllers and controls
 */
class MetarWebApp extends HTMLElement{

    metarControl: MetarControl;

    constructor(){
        super();
        let metarApi = new AviationWeatherController();
        //herokuapp used as a proxy becuase the AWC API doesn't return headers. 
        metarApi.url = "https://cors-anywhere.herokuapp.com/" + "https://www.aviationweather.gov/cgi-bin/json/MetarJSON.php";
        this.metarControl = new MetarControl(metarApi);
        this.appendChild(this.metarControl);
    }
}

customElements.define('metar-web-app',MetarWebApp)


export {MetarWebApp}
