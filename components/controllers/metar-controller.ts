type MetarData = {
    properties: MetarProperties;
    geometry: MetarGeometry;
};

interface MetarController{
    getLatestReports():Promise<MetarData[]>
}

interface MetarProperties{
    id:string; //Station identifier
    site:string; //The long name for the site
    prior:string; //
    obsTime:string; //ISO 8601 formatted date and time
    temp:number; //Temperature in Celsius
    dewp:number; //Dewpoint temperature in Celsius
    wspd:number; //Wind speed in knots
    wgst?:number; //Wind direction in degrees
    wdir:number; //Wind gusts in knots
    cover:string; //Cloud ceiling in 100s feet for broken or overcast skies (missing otherwise)
    visib:number; //Visibility in miles
    fltcat:string; //Flight category, either VFR, MVFR, IFR, LIFR
    altim:number; //Altimeter setting in hPa
    slp:number;  //Sea level pressure in hPa
    rawOb:string  //Raw METAR text
}

interface MetarGeometry{
    type:string;
    coordinates:number[];
}

export {MetarController,MetarProperties,MetarGeometry,MetarData}