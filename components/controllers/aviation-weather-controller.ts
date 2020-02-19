import { MetarController, MetarData} from "./metar-controller";

/**
 * Implmentation using https://www.aviationweather.gov/ api for METAR reports
 * Deatils at https://www.aviationweather.gov/help/webservice?page=metarjson currently 
 */
class AviationWeatherController implements MetarController{
    url:string | undefined; 
    
    async getLatestReports(): Promise<MetarData[]> {
        if(this.url === undefined)  throw Error('Url not set');
        let result = await fetch(this.url);
        if(result.ok){
            let data = await result.json() as AviationWeatherJsonResponse;
            return data.features;
        }
        else throw Error(result.statusText);
    }
}
/**
 * The object NOAA currently returns on their api
 */
class AviationWeatherJsonResponse{
    type:string = '';
    features:MetarData[] = [];
}

export {AviationWeatherController};