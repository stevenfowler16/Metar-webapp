class AviationCard extends HTMLElement {
    constructor(data) {
        super();
        this.data = data;
        this.CreateMinimalView();
        this.addEventListener('click', this.ClickHandler.bind(this));
    }
    CreateMinimalView() {
        this.CreateLabel("Observed Time", this.data.properties.obsTime);
        this.CreateLabel("Station Identifier", this.data.properties.id);
        this.CreateLabel("Flight Category", this.data.properties.fltcat);
    }
    CreateFullView() {
        this.fullView = document.createElement("div");
        this.fullView.classList.add("hidden");
        this.appendChild(this.fullView);
        this.CreateLabel("Site", this.data.properties.site, this.fullView);
        this.CreateLabel("Prior", this.data.properties.prior, this.fullView);
        this.CreateLabel("Temp", this.data.properties.temp.toString(), this.fullView);
        this.CreateLabel("Dew Point", this.data.properties.dewp.toString(), this.fullView);
        this.CreateLabel("Wind Speed", this.data.properties.wspd.toString(), this.fullView);
        let gust = this.data.properties.wgst !== undefined ? this.data.properties.wgst.toString() : 'N/A';
        this.CreateLabel("Wind Gust", gust, this.fullView);
        this.CreateLabel("Wind Direction", this.data.properties.wdir.toString(), this.fullView);
        this.CreateLabel("Cover", this.data.properties.cover.toString(), this.fullView);
        this.CreateLabel("Visibility", this.data.properties.visib.toString(), this.fullView);
        this.CreateLabel("Altimeter", this.data.properties.altim.toString(), this.fullView);
        this.CreateLabel("Sea Level Pressure", this.data.properties.slp.toString(), this.fullView);
        this.CreateLabel("Raw Metar", this.data.properties.rawOb, this.fullView);
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
