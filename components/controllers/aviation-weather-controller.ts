import { MetarController, MetarData} from "./metar-controller";

class AviationWeatherController implements MetarController{
    url:string | undefined; 
    
    async getLatestReports(): Promise<MetarData[]> {
        if(this.url === undefined)  throw Error('Url not set');
        let result = await fetch(this.url);
        if(result.ok){
            let data = await result.json() as AviationWeatherJsonResponse;
            return data.features;
        }
        else throw Error(await result.statusText);
    }
}
class AviationWeatherJsonResponse{
    type:string = '';
    features:MetarData[] = [];
}
export {AviationWeatherController};