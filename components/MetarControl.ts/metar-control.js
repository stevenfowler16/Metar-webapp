import { AviationCard } from "../card/aviation-card";
class MetarControl extends HTMLElement {
    constructor(metarApi) {
        super();
        this._data = [];
        this.list = document.createElement("div");
        this.aviationCards = [];
        this.detailPanel = document.createElement("div");
        this.searchBox = document.createElement("input");
        this.metarApi = metarApi;
        this.appendChild(this.detailPanel);
        this.appendChild(this.searchBox);
        this.appendChild(this.list);
        this.searchBox.addEventListener("input", this.SearchTextHandler.bind(this));
        this.GetLatestReports();
    }
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
        this.WipeListItems();
        this.CreateListItems();
    }
    async GetLatestReports() {
        if (this.metarApi === undefined)
            throw Error('No Api To Fetch From');
        this.data = await this.metarApi.getLatestReports();
    }
    CreateListItems() {
        this.data.forEach(dataItem => {
            let aviationCard = new AviationCard(dataItem);
            this.aviationCards.push(aviationCard);
            this.list.appendChild(aviationCard);
        });
    }
    WipeListItems() {
        this.list.innerHTML = '';
    }
    SearchTextHandler(event) {
        this.aviationCards.forEach(card => {
            if (this.searchBox.value == '') {
                card.classList.remove('hidden');
            }
            else if (!card.data.properties.id.includes(this.searchBox.value)) {
                card.classList.add('hidden');
            }
        });
    }
}
customElements.define('metar-control', MetarControl);
export { MetarControl };
