class AviationWeatherController {
    async getLatestReports() {
        if (this.url === undefined)
            throw Error('Url not set');
        let result = await fetch(this.url);
        if (result.ok) {
            let data = await result.json();
            return data.features;
        }
        else
            throw Error(await result.statusText);
    }
}
class AviationWeatherJsonResponse {
    constructor() {
        this.type = '';
        this.features = [];
    }
}
export { AviationWeatherController };
