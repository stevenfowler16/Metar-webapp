import { MetarController, MetarData } from "../controllers/metar-controller"
import { AviationCard } from "../card/aviation-card";

class MetarControl extends HTMLElement {

    private _data: MetarData[] = [];
    public get data(): MetarData[] {
        return this._data;
    }
    public set data(value: MetarData[]) {
        this._data = value;
        this.WipeListItems();
        this.CreateListItems();
    }

    metarApi: MetarController;
    list: HTMLElement = document.createElement("div");
    aviationCards: AviationCard[] = [];
    detailPanel: HTMLElement = document.createElement("div");
    searchBox: HTMLInputElement = document.createElement("input");

    constructor(metarApi: MetarController) {
        super();
        this.metarApi = metarApi;
        this.appendChild(this.detailPanel);
        this.appendChild(this.searchBox);
        this.appendChild(this.list);
        this.searchBox.addEventListener("input", this.SearchTextHandler.bind(this));
        this.GetLatestReports();
    }

    async GetLatestReports() {
        if (this.metarApi === undefined) throw Error('No Api To Fetch From')
        this.data = await this.metarApi.getLatestReports();
    }

    CreateListItems() {
        this.data.forEach(dataItem => {
            let aviationCard = new AviationCard(dataItem);
            this.aviationCards.push(aviationCard);
            this.list.appendChild(aviationCard);
        })
    }

    WipeListItems() {
        this.list.innerHTML = '';
    }

    SearchTextHandler(event: Event) {

        this.aviationCards.forEach(card => {
            if (this.searchBox.value == '') {
                card.classList.remove('hidden');
            }
            else if (card.data.properties.id &&  !card.data.properties.id.includes(this.searchBox.value)){
                card.classList.add('hidden');
            }
        });
    }
}
customElements.define('metar-control', MetarControl);

export { MetarControl }
