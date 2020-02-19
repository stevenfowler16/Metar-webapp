/**
 * The MetarJSON object coming throught the api
 */
type MetarData = {
    properties: MetarProperties;
    /**Undefined because this seems to be something special */
    geometry?: MetarGeometry;
};

/**
 * The point of this interface is to create a barrier on a volatile data source. 
 * I don't control the api and it could change at any point in time. 
 * By having my components depends on this interface and injecting the concrete implementation into the components
 * I'll save time + complexity later if I decide to change my data source or the concrete changes suddenly
 */
interface MetarController{
    getLatestReports():Promise<MetarData[]>
}

/**
 * Represent the actual Metar Data 
 * Concrete classes should provide this data
 * Undefined because should doesn't mean they will
 */
interface MetarProperties{
    /**Station Identifier */
    id?:string; 
    /**Long Name For The Reporting Site */
    site?:string; 
    /**Still not sure on this guy */
    prior?:string;
    /**Observation Time in ISO 8601 formatted date and time*/ 
    obsTime?:string;
    /**Temperature in Celsius */
    temp?:number; 
    /**Dewpoint in Celsius */
    dewp?:number; 
    /**Wind speed in knots */
    wspd?:number; 
    /**Wind direction in degrees */
    wgst?:number; 
    /**Wind gusts in knots */
    wdir?:number; 
    /**Cloud ceiling in 100s feet for broken or overcast skies (missing otherwise) */
    cover?:string;
    /**Visibility in miles*/
    visib?:number; 
    /**Flight category, either VFR, MVFR, IFR, LIFR */
    fltcat?:string; 
    /**Altimeter setting in hPa */
    altim?:number;
    /**Sea level pressure in hPa */
    slp?:number; 
    /**Raw METAR text */
    rawOb?:string  
}

/**
 * Something Speciaal that comes with NOAA Reports doesn't seem to be apart of the official spec
 * https://en.wikipedia.org/wiki/METAR
 */
interface MetarGeometry{
    type?:string;
    coordinates?:number[];
}

export {MetarController,MetarProperties,MetarGeometry,MetarData}