import { MetarController, MetarData } from "../controllers/metar-controller"
import { AviationCard } from "../card/aviation-card";

/**
 * Control The UI displaying and sorting METAR data
 */
class MetarControl extends HTMLElement {

    /**Contains the raw data object the api pass over. Used to perform operations on*/
    private _data: MetarData[] = [];
    public get data(): MetarData[] {
        return this._data;
    }
    public set data(value: MetarData[]) {
        this._data = value;
        this.WipeListItems();
        this.CreateListItems();
    }
    /**API to get the data from */
    metarApi: MetarController;
    /**Holds the HTML elements of Aviation Cards*/
    list: HTMLElement = document.createElement("div");
    /**Avation Cards created from the data */
    aviationCards: AviationCard[] = [];
    /**User can filter Metar Data on this card */
    searchBox: HTMLInputElement = document.createElement("input");

    constructor(metarApi: MetarController) {
        super();
        this.metarApi = metarApi;
        this.appendChild(this.searchBox);
        this.appendChild(this.list);
        this.searchBox.addEventListener("input", this.SearchTextHandler.bind(this));
        this.GetLatestReports();
    }

    /**
     * Calls into the injected metarApi
     */
    async GetLatestReports() {
        if (this.metarApi === undefined) throw Error('No Api To Fetch From')
        this.data = await this.metarApi.getLatestReports();
    }

    /**Create the initial html elements from the data. */
    CreateListItems() {
        this.data.forEach(dataItem => {
            let aviationCard = new AviationCard(dataItem);
            this.aviationCards.push(aviationCard);
            this.list.appendChild(aviationCard);
        })
    }

    /**Clear the list */
    WipeListItems() {
        this.list.innerHTML = '';
    }

    /**Filters out aviation cards that don't contain the text in the search box */
    SearchTextHandler(event: Event) {
        this.aviationCards.forEach(card => {
            //If empty show all boxes
            if (this.searchBox.value == '') {
                card.classList.remove('hidden');
            }
            else if (card.metarData.properties.id &&  !card.metarData.properties.id.includes(this.searchBox.value)){
                card.classList.add('hidden');
            }
        });
    }
}

customElements.define('metar-control', MetarControl);

export { MetarControl }
