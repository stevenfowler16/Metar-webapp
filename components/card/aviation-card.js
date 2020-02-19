class AviationCard extends HTMLElement {
    constructor(data) {
        super();
        this.data = data;
        this.CreateMinimalView();
        this.addEventListener('click', this.ClickHandler.bind(this));
    }
    CreateMinimalView() {
        let obsTime = this.data.properties.obsTime !== undefined ? this.data.properties.obsTime : 'N/A';
        this.CreateLabel("Observed Time", obsTime);
        let id = this.data.properties.id !== undefined ? this.data.properties.id : 'N/A';
        this.CreateLabel("Station Identifier", id);
        let fltcat = this.data.properties.fltcat !== undefined ? this.data.properties.fltcat : 'N/A';
        this.CreateLabel("Flight Category", fltcat);
    }
    CreateFullView() {
        this.fullView = document.createElement("div");
        this.fullView.classList.add("hidden");
        this.appendChild(this.fullView);
        let site = this.data.properties.site !== undefined ? this.data.properties.site : 'N/A';
        this.CreateLabel("Site", site, this.fullView);
        let prior = this.data.properties.prior !== undefined ? this.data.properties.prior : 'N/A';
        this.CreateLabel("Prior", prior, this.fullView);
        let temp = this.data.properties.temp !== undefined ? this.data.properties.temp.toString() : 'N/A';
        this.CreateLabel("Temp", temp, this.fullView);
        let dewPoint = this.data.properties.dewp !== undefined ? this.data.properties.dewp.toString() : 'N/A';
        this.CreateLabel("Dew Point", dewPoint, this.fullView);
        let windSpeed = this.data.properties.wspd !== undefined ? this.data.properties.wspd.toString() : 'N/A';
        this.CreateLabel("Wind Speed", windSpeed, this.fullView);
        let gust = this.data.properties.wgst !== undefined ? this.data.properties.wgst.toString() : 'N/A';
        this.CreateLabel("Wind Gust", gust, this.fullView);
        let windDirection = this.data.properties.wdir !== undefined ? this.data.properties.wdir.toString() : 'N/A';
        this.CreateLabel("Wind Direction", windDirection, this.fullView);
        let cover = this.data.properties.cover !== undefined ? this.data.properties.cover : 'N/A';
        this.CreateLabel("Cover", cover, this.fullView);
        let visibility = this.data.properties.visib !== undefined ? this.data.properties.visib.toString() : 'N/A';
        this.CreateLabel("Visibility", visibility, this.fullView);
        let altimeter = this.data.properties.altim !== undefined ? this.data.properties.altim.toString() : 'N/A';
        this.CreateLabel("Altimeter", altimeter, this.fullView);
        let slp = this.data.properties.slp !== undefined ? this.data.properties.slp.toString() : 'N/A';
        this.CreateLabel("Sea Level Pressure", slp, this.fullView);
        let rawOb = this.data.properties.rawOb !== undefined ? this.data.properties.rawOb : 'N/A';
        this.CreateLabel("Raw Metar", rawOb, this.fullView);
    }
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
    ClickHandler(event) {
        if (this.fullView == undefined) {
            this.CreateFullView();
        }
        if (this.fullView !== undefined) {
            this.fullView.classList.toggle('hidden');
        }
    }
}
customElements.define('aviation-card', AviationCard);
export { AviationCard };
