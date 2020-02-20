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
        let oldData = this.aviationCards.slice();
        this._data = value;
        this.WipeListItems();
        this.CreateListItems();
        this.OldDataHandoff(oldData);
        if(this.searchBox.value != ''){
            this.FilterCards();
        }
    }
    /**API to get the data from */
    metarApi: MetarController;
    /**Holds the HTML elements of Aviation Cards*/
    list: HTMLElement = document.createElement("div");
    /**Avation Cards created from the data */
    aviationCards: AviationCard[] = [];
    /**User can filter Metar Data on this card */
    searchBox: HTMLInputElement = document.createElement("input");
    /**Filter to change selection */
    filterSelection:HTMLInputElement = document.createElement("input");
    /**Holds the refernces to stop autorefreshing */
    autoRefresh:number;
    constructor(metarApi: MetarController) {
        super();
        this.metarApi = metarApi;
        this.searchBox.placeholder = 'Search (Case Sensitive)'
        this.appendChild(this.searchBox);
        this.filterSelection.placeholder = 'Filter'
        this.appendChild(this.filterSelection);
        this.BuildFilterSelection();
        this.appendChild(this.list);
        this.searchBox.addEventListener("input", this.SearchTextHandler.bind(this));
        this.GetLatestReports();
        this.autoRefresh = window.setInterval(this.GetLatestReports.bind(this), 300000);
        
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
        this.aviationCards = [];
    }

    /**Filters out aviation cards that don't contain the text in the search box */
    SearchTextHandler(event: Event) {
        this.FilterCards();
    }

    /**Hides and shows cards based on search input */
    FilterCards(){
          this.aviationCards.forEach(card => {
            let searchCategory = this.filterSelection.value;
            //@ts-ignore
            let valueToSearchOn = card.metarData.properties[searchCategory] !== undefined ? card.metarData.properties[searchCategory] : card.metarData.properties.id ;
            
            //No idea what to search on just quit
            if(valueToSearchOn === undefined) return;

            //If empty show all boxes
            //@ts-ignore
            if (this.searchBox.value == '' || valueToSearchOn.toString().includes(this.searchBox.value)) {
                card.classList.remove('hidden');
            }
            //@ts-ignore
            else if (card.metarData.properties.id &&  !valueToSearchOn.toString().includes(this.searchBox.value)){
                card.classList.add('hidden');
            }
        });
    }

    /**
     * A quick dif for state of the new objects coming ine
     * @param data - old aviation cards
     */
    OldDataHandoff(data:AviationCard[]){
        this.aviationCards.forEach(aviationCard =>{
            let oldCard = data.find(oldAviationCard =>{
                if(oldAviationCard.metarData.properties.id && oldAviationCard.metarData.properties.obsTime && aviationCard.metarData.properties.id && aviationCard.metarData.properties.obsTime){
                    return (aviationCard.metarData.properties.id == oldAviationCard.metarData.properties.id && aviationCard.metarData.properties.obsTime && oldAviationCard.metarData.properties.obsTime);
                }
            });
            if(oldCard == undefined) return;
            aviationCard.ToggleHidden(!oldCard.detailedViewOpen);
        })
    }
    
    /**
     * Builds a few options for dropdown list
     */
    BuildFilterSelection(){
        let datalist =document.createElement("datalist")
        datalist.id = Math.random() * 1000 + "metar-control";
        this.filterSelection.setAttribute("list",datalist.id);
        this.filterSelection.appendChild(datalist);
        datalist.appendChild(CreateOption("wspd","Wind Speed"));
        datalist.appendChild(CreateOption("site","Site"));
        datalist.appendChild(CreateOption("cover","Cloud Cover"))
        
        function CreateOption(value:string,name?:string):HTMLOptionElement{
            let option = document.createElement("option");
            option.setAttribute("value",value)
            if(name!== undefined) option.label = name;
            return option;
        }
    }
}

customElements.define('metar-control', MetarControl);

export { MetarControl }
