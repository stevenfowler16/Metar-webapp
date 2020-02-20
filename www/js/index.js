/**
 * Implmentation using https://www.aviationweather.gov/ api for METAR reports
 * Deatils at https://www.aviationweather.gov/help/webservice?page=metarjson currently
 */
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
            throw Error(result.statusText);
    }
}

/**
 * Holds and display a Metar Data Item
 */
class AviationCard extends HTMLElement {
    constructor(data) {
        super();
        /**Class to hide and unhide */
        this.hiddenClass = 'hidden';
        this.metarData = data;
        this.CreateMinimalView();
        this.addEventListener('click', this.ClickHandler.bind(this));
    }
    /**Detailed Open */
    get detailedViewOpen() {
        if (this.fullView === undefined)
            return false;
        else
            return !this.fullView.classList.contains(this.hiddenClass);
    }
    /**
     * Generates the minimal view for the card
     */
    CreateMinimalView() {
        let obsTime = this.metarData.properties.obsTime !== undefined ? this.metarData.properties.obsTime : 'N/A';
        this.CreateLabel("Observed Time", obsTime);
        let id = this.metarData.properties.id !== undefined ? this.metarData.properties.id : 'N/A';
        this.CreateLabel("Station Identifier", id);
        let fltcat = this.metarData.properties.fltcat !== undefined ? this.metarData.properties.fltcat : 'N/A';
        this.CreateLabel("Flight Category", fltcat);
    }
    /**
     * Generates the detailed view with all of the propertes of the Metar Data.
     * @param hidden - defaults to true. Hide the full view on creation
     */
    CreateFullView(hidden = true) {
        this.fullView = document.createElement("div");
        if (hidden)
            this.ToggleHidden(hidden);
        this.appendChild(this.fullView);
        const placeHolder = 'N/A';
        //These could be cleaned up and the property check could go in a function but I prefer the readability here since I'm only dealing with a few properties. 
        let site = this.metarData.properties.site !== undefined ? this.metarData.properties.site : placeHolder;
        this.CreateLabel("Site", site, this.fullView);
        let prior = this.metarData.properties.prior !== undefined ? this.metarData.properties.prior : placeHolder;
        this.CreateLabel("Prior", prior, this.fullView);
        let temp = this.metarData.properties.temp !== undefined ? this.metarData.properties.temp.toString() : placeHolder;
        this.CreateLabel("Temp", temp, this.fullView);
        let dewPoint = this.metarData.properties.dewp !== undefined ? this.metarData.properties.dewp.toString() : placeHolder;
        this.CreateLabel("Dew Point", dewPoint, this.fullView);
        let windSpeed = this.metarData.properties.wspd !== undefined ? this.metarData.properties.wspd.toString() : placeHolder;
        this.CreateLabel("Wind Speed", windSpeed, this.fullView);
        let gust = this.metarData.properties.wgst !== undefined ? this.metarData.properties.wgst.toString() : placeHolder;
        this.CreateLabel("Wind Gust", gust, this.fullView);
        let windDirection = this.metarData.properties.wdir !== undefined ? this.metarData.properties.wdir.toString() : placeHolder;
        this.CreateLabel("Wind Direction", windDirection, this.fullView);
        let cover = this.metarData.properties.cover !== undefined ? this.metarData.properties.cover : placeHolder;
        this.CreateLabel("Cover", cover, this.fullView);
        let visibility = this.metarData.properties.visib !== undefined ? this.metarData.properties.visib.toString() : placeHolder;
        this.CreateLabel("Visibility", visibility, this.fullView);
        let altimeter = this.metarData.properties.altim !== undefined ? this.metarData.properties.altim.toString() : placeHolder;
        this.CreateLabel("Altimeter", altimeter, this.fullView);
        let slp = this.metarData.properties.slp !== undefined ? this.metarData.properties.slp.toString() : placeHolder;
        this.CreateLabel("Sea Level Pressure", slp, this.fullView);
        let rawOb = this.metarData.properties.rawOb !== undefined ? this.metarData.properties.rawOb : placeHolder;
        this.CreateLabel("Raw Metar", rawOb, this.fullView);
    }
    /**
     * Generates and attaches a label value combo
     * @param text - The text for the label
     * @param value - the text after the label
     * @param appendTo - optional html element to append to, defaults to this
     */
    CreateLabel(text, value, appendTo) {
        let div = document.createElement("div");
        let label = document.createElement("label");
        label.textContent = text + ": ";
        div.appendChild(label);
        let labelValue = document.createElement("span");
        labelValue.textContent = value;
        div.appendChild(labelValue);
        appendTo === undefined ? this.appendChild(div) : appendTo.appendChild(div);
    }
    /**
     * Handles the click event on the card. Toggles between detailed view
     * @param event -Click Event That is fired on the card
     */
    ClickHandler(event) {
        if (this.fullView == undefined) {
            this.CreateFullView();
        }
        this.ToggleHidden();
    }
    /**
     * Toggles whether or not the detailed view is open
     * @param hide - optional force an unhide or hide
     */
    ToggleHidden(hide) {
        if (this.fullView === undefined && hide === false) {
            this.CreateFullView();
        }
        if (this.fullView === undefined)
            return;
        if (hide !== undefined) {
            if (hide)
                this.fullView.classList.add(this.hiddenClass);
            else
                this.fullView.classList.remove(this.hiddenClass);
        }
        else {
            this.fullView.classList.toggle(this.hiddenClass);
        }
    }
}
customElements.define('aviation-card', AviationCard);

/**
 * Control The UI displaying and sorting METAR data
 */
class MetarControl extends HTMLElement {
    constructor(metarApi) {
        super();
        /**Contains the raw data object the api pass over. Used to perform operations on*/
        this._data = [];
        /**Holds the HTML elements of Aviation Cards*/
        this.list = document.createElement("div");
        /**Avation Cards created from the data */
        this.aviationCards = [];
        /**User can filter Metar Data on this card */
        this.searchBox = document.createElement("input");
        /**Filter to change selection */
        this.filterSelection = document.createElement("input");
        this.metarApi = metarApi;
        this.searchBox.placeholder = 'Search (Case Sensitive)';
        this.appendChild(this.searchBox);
        this.filterSelection.placeholder = 'Filter';
        this.appendChild(this.filterSelection);
        this.BuildFilterSelection();
        this.appendChild(this.list);
        this.searchBox.addEventListener("input", this.SearchTextHandler.bind(this));
        this.GetLatestReports();
        this.autoRefresh = window.setInterval(this.GetLatestReports.bind(this), 300000);
    }
    get data() {
        return this._data;
    }
    set data(value) {
        let oldData = this.aviationCards.slice();
        this._data = value;
        this.WipeListItems();
        this.CreateListItems();
        this.OldDataHandoff(oldData);
        if (this.searchBox.value != '') {
            this.FilterCards();
        }
    }
    /**
     * Calls into the injected metarApi
     */
    async GetLatestReports() {
        if (this.metarApi === undefined)
            throw Error('No Api To Fetch From');
        this.data = await this.metarApi.getLatestReports();
    }
    /**Create the initial html elements from the data. */
    CreateListItems() {
        this.data.forEach(dataItem => {
            let aviationCard = new AviationCard(dataItem);
            this.aviationCards.push(aviationCard);
            this.list.appendChild(aviationCard);
        });
    }
    /**Clear the list */
    WipeListItems() {
        this.list.innerHTML = '';
        this.aviationCards = [];
    }
    /**Filters out aviation cards that don't contain the text in the search box */
    SearchTextHandler(event) {
        this.FilterCards();
    }
    /**Hides and shows cards based on search input */
    FilterCards() {
        this.aviationCards.forEach(card => {
            let searchCategory = this.filterSelection.value;
            //@ts-ignore
            let valueToSearchOn = card.metarData.properties[searchCategory] !== undefined ? card.metarData.properties[searchCategory] : card.metarData.properties.id;
            //No idea what to search on just quit
            if (valueToSearchOn === undefined)
                return;
            //If empty show all boxes
            //@ts-ignore
            if (this.searchBox.value == '' || valueToSearchOn.toString().includes(this.searchBox.value)) {
                card.classList.remove('hidden');
            }
            //@ts-ignore
            else if (card.metarData.properties.id && !valueToSearchOn.toString().includes(this.searchBox.value)) {
                card.classList.add('hidden');
            }
        });
    }
    /**
     * A quick dif for state of the new objects coming ine
     * @param data - old aviation cards
     */
    OldDataHandoff(data) {
        this.aviationCards.forEach(aviationCard => {
            let oldCard = data.find(oldAviationCard => {
                if (oldAviationCard.metarData.properties.id && oldAviationCard.metarData.properties.obsTime && aviationCard.metarData.properties.id && aviationCard.metarData.properties.obsTime) {
                    return (aviationCard.metarData.properties.id == oldAviationCard.metarData.properties.id && aviationCard.metarData.properties.obsTime && oldAviationCard.metarData.properties.obsTime);
                }
            });
            if (oldCard == undefined)
                return;
            aviationCard.ToggleHidden(!oldCard.detailedViewOpen);
        });
    }
    /**
     * Builds a few options for dropdown list
     */
    BuildFilterSelection() {
        let datalist = document.createElement("datalist");
        datalist.id = Math.random() * 1000 + "metar-control";
        this.filterSelection.setAttribute("list", datalist.id);
        this.filterSelection.appendChild(datalist);
        datalist.appendChild(CreateOption("wspd", "Wind Speed"));
        datalist.appendChild(CreateOption("site", "Site"));
        datalist.appendChild(CreateOption("cover", "Cloud Cover"));
        function CreateOption(value, name) {
            let option = document.createElement("option");
            option.setAttribute("value", value);
            if (name !== undefined)
                option.label = name;
            return option;
        }
    }
}
customElements.define('metar-control', MetarControl);

/**
 * Web app class for pulling together the controllers and controls
 */
class MetarWebApp extends HTMLElement {
    constructor() {
        super();
        let metarApi = new AviationWeatherController();
        //herokuapp used as a proxy becuase the AWC API doesn't return headers. 
        metarApi.url = "https://cors-anywhere.herokuapp.com/" + "https://www.aviationweather.gov/cgi-bin/json/MetarJSON.php";
        this.metarControl = new MetarControl(metarApi);
        this.appendChild(this.metarControl);
    }
}
customElements.define('metar-web-app', MetarWebApp);

export { MetarWebApp };
