import {observable, action, configure, flow} from 'mobx';
import {searchService} from '../services';

configure({
  enforceActions: 'always'
});

class Search{
  @observable search = -1;
  @observable request = '';
  @observable date = new Date();
  @observable dateDayFlag = null;

  @observable searchResult = undefined; // events, items
  @observable events = undefined;
  @observable items = undefined;

  defaultPageSize = 21;
  @observable searchString = '';
  @observable searchEvents = [];
  @observable pagination = {current: 1, pageSize: this.defaultPageSize, showButton: true};

  cache = {};
  searchCache = {
    remove: (resource) => {
      delete this.cache[resource];
    },
    exist: (resource) => {
      return this.cache.hasOwnProperty(resource) && this.cache[resource] !== null;
    },
    get: (resource) => {
      return this.cache[resource];
    },
    set: (resource, cachedData) => {
      this.searchCache.remove(resource);
      this.cache[resource] = cachedData;
    },
  };

  @observable focus = false;
  @observable isLoading = false;

  @action setSearchString = (string) => {
    this.searchString = string;
  };

  @action changeSearchStatus = (status) => {
    this.search = status;
  };

  @action setRequest = (value) => {
    this.request = value;
  };

  @action setDate = (value) => {
    this.date = value;
  };

  @action changeFocus = (flag) => {
    this.focus = flag;
  };

  @action
  getSearchResult = flow( function* getSearchResult(){
    this.isLoading = true;
    try {
      const key = this.request + this.date.getFullYear()+this.date.getMonth()+this.date.getDate();
      if(this.searchCache.exist(key)){
        this.searchResult = this.searchCache.get(key);
        this.events = this.searchResult.events.length > 0 ? this.searchResult.events : undefined;
        this.items = this.searchResult.items.length > 0 ? this.searchResult.items : undefined;
      }else {
          const args = {
            text: this.request,
            date: this.date.getTime()
          };
          this.searchResult = yield searchService.getSearchResult(args);
          this.events = this.searchResult.events.length > 0 ? this.searchResult.events : undefined;
          this.items = this.searchResult.items.length > 0 ? this.searchResult.items : undefined;
          this.searchCache.set(key, this.searchResult)
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }).bind(this);

  @action
  getSearchPageResult = flow( function* getSearchPageResult(){
    this.isLoading = true;
    try {
      let args = this.parseString();
      args.size = this.pagination.pageSize;
      args.page = this.pagination.current;

      const response = yield searchService.getSearchPageResult(args);
      this.searchEvents = response;

      console.log(response)
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }).bind(this);

  parseString = () => {
    const params = new URLSearchParams(this.searchString);

    return {
      start: params.get('start'),
      end: params.get('end'),
      s: params.get('s'),
      mask: params.get('mask'),
    };
  }
}

// decorate(Search, {
//   getSearchResult: action.bound
// });

export default new Search();