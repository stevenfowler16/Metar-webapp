import { MetarData } from "../controllers/metar-controller";

/**
 * Holds and display a Metar Data Item
 */
class AviationCard extends HTMLElement {
    /**The Metar Data */
    metarData: MetarData;
    /**The Full View. Generated lazily*/
    fullView?: HTMLElement;
    /**Detailed Open */
    public get detailedViewOpen(): boolean {
        if(this.fullView === undefined) return false;
        else return !this.fullView.classList.contains(this.hiddenClass)
    }
    /**Class to hide and unhide */
    hiddenClass:string = 'hidden';

    constructor(data: MetarData) {
        super();
        this.metarData = data;
        this.CreateMinimalView();
        this.addEventListener('click', this.ClickHandler.bind(this));
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
        if (hidden) this.ToggleHidden(hidden);

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
    CreateLabel(text: string, value: string, appendTo?: HTMLElement) {
        let div = document.createElement("div");

        let label = document.createElement("label")
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
    ClickHandler(event: Event) {
        if (this.fullView == undefined) {
            this.CreateFullView();
        }

        this.ToggleHidden();

    }

    /**
     * Toggles whether or not the detailed view is open
     * @param hide - optional force an unhide or hide 
     */
    ToggleHidden(hide?: boolean) {
        if(this.fullView === undefined && hide === false){
            this.CreateFullView();
        }
        if (this.fullView === undefined) return;
        
        if (hide !== undefined) {
            if (hide) this.fullView.classList.add(this.hiddenClass);
            else this.fullView.classList.remove(this.hiddenClass);
        }
        else {
            this.fullView.classList.toggle(this.hiddenClass);
        }
    }

}

customElements.define('aviation-card', AviationCard)

export { AviationCard }