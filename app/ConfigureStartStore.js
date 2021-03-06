import { observable, action, computed, flow, configure } from 'mobx';
import { matchPath } from 'react-router-dom';
import { globalService, pageService, eventService, itemService, searchService, servicePagesService } from './services';
import { cities, searchStore } from './stores';

import { BilegoIconHandshake } from './theme/bilegoIcons';

configure({
  enforceActions: 'always'
});

export default class ConfigureStartStore {
  @observable CITY = -1; // Москва == 0, Питер == 1
  @action setCity = val => {
    this.CITY = val
  };
  cities;
  pageName;
  ssrSide; // server or client
  siteAddress = 'https://bilego.ru';
  @observable daData;
  @observable data;
  @observable history;

  @observable title = '';
  @observable description = '';
  @observable keywords = '';
  @observable opengraph = null;
  @observable postMeta;

  @observable frontPageFirstData = null;
  @observable eventsFirstData = null;
  @observable eventCategoryFirstData = null;
  @observable itemsFirstData = null;
  @observable singleEventFirstData = null;
  @observable singleItemFirstData = null;

  @observable searchFirstData = null;

  @observable req;
  @action setReq = r => {this.req = r};

  @observable mobile;
  @action setMobile = val => {
    this.mobile = val
  };
  @observable mobileMenuCityColor = '#ffffff';
  @action setMobileMenuCityColor = val => {
    this.mobileMenuCityColor = val
  };

  meta404 = {
    id: 0,
    type: 'page',
    title: 'Страница не найдена | Bilego',
    description: false,
    keywords: '',
    opengraph: {
      locale: 'ru_RU',
      type: 'website',
      title: 'Страница не найдена | Bilego',
      description: false,
      site_name: 'Bilego',
      image: null,
      image_secure_url: null,
      image_width: null,
      image_height: null },
    company_logo: 'https://mos.bilego.ru/wp-content/uploads/2019/03/bilego-logo-1.png'
  };

  // def variables
  @computed
  get baseNameForRouting(){
    if(this.CITY !== -1) return this.cities[this.CITY].baseName;
    return false;
  };
  @computed
  get cityLabel(){
    if(this.CITY !== -1) return this.cities[this.CITY].cityLabel;
    return false;
  };
  @computed
  get categoryConcertsForFrontPage(){
    if(this.CITY !== -1) return this.cities[this.CITY].categoryConcerts;
    return false;
  };
  @computed
  get apiRoot(){
    if(this.CITY !== -1) return this.cities[this.CITY].apiRoot;
    return false;
  };
  @computed
  get categoriesForMenu(){
    if(this.CITY !== -1) return [
      {
        id: this.cities[this.CITY].category.concerts,
        cat: 'Concerts',
        slug: 'concerts',
        page: 'page',
        name: 'Концерты',
        link: 'events/concerts',
        icon: BilegoIconHandshake,
      }, {
        id: this.cities[this.CITY].category.festivals,
        cat: 'Festivals',
        slug: 'festivals',
        page: 'page',
        name: 'Фестивали',
        link: 'events/festivals',
        icon: BilegoIconHandshake,
      }, {
        id: this.cities[this.CITY].category.lectures,
        cat: 'Lectures',
        slug: 'lectures',
        page: 'category',
        name: 'Лекции',
        link: 'events/lectures',
        icon: BilegoIconHandshake,
      }, {
        id: this.cities[this.CITY].category.exhibitions,
        cat: 'Exhibitions',
        slug: 'exhibitions',
        page: 'category',
        name: 'Выставки',
        link: 'events/exhibitions',
        icon: BilegoIconHandshake,
      }, {
        id: this.cities[this.CITY].category.children,
        cat: 'Children',
        slug: 'children',
        page: 'category',
        name: 'Детям',
        link: 'events/forkids',
        icon: BilegoIconHandshake,
      },
      // {
      //   id: this.cities[this.CITY].category.free,
      //   cat: 'Free',
      //   page: 'category',
      //   name: 'Бесплатно',
      //   link: 'events/free',
      //   icon: BilegoIconHandshake,
      // }
    ];

    return [];
  }
  @computed
  get categoriesForFooterMenu(){
    if(this.CITY !== -1) return [
      // {
      //   id: 'advertising',
      //   cat: false,
      //   page: 'page',
      //   name: 'Реклама',
      //   link: `/${this.baseNameForRouting}/advertising`,
      //   icon: BilegoIconHandshake,
      // },
      {
        id: 'contacts',
        cat: false,
        page: 'page',
        name: 'Контакты',
        link: `/contacts`,
        icon: BilegoIconHandshake,
      },
      {
        id: 'offer',
        cat: false,
        page: 'page',
        name: 'Оферта',
        link: `/offer`,
        icon: BilegoIconHandshake,
      },
      {
        id: 'events',
        cat: false,
        page: 'page',
        name: 'События',
        link: `/events`,
        icon: BilegoIconHandshake,
      },
      {
        id: 'items',
        cat: false,
        page: 'page',
        name: 'Места',
        link: `/items`,
        icon: BilegoIconHandshake,
      },
    ];
    return [];
  }
  @computed
  get canonicalLink(){
    return this.siteAddress + this.history.location.pathname;
  };
  @computed
  get meta(){
    return {
      title: this.title,
      description: this.description,
      keywords: this.keywords,
      opengraph: this.opengraph,
      meta: this.postMeta
    }
  }

  constructor(initialState, history) {
    this.setData(initialState);
    this.setHistory(history);

    this.cities = cities;
  }
  @action
  setData = (initialState) => {
    this.CITY = initialState.CITY;
    this.cities = initialState.cities;
    this.daData = initialState.daData;
    this.data = initialState.data;

    this.pageName = initialState.pageName;

    this.title = initialState.title;
    this.description = initialState.description;
    this.keywords = initialState.keywords;
    this.opengraph = initialState.opengraph;
    this.postMeta = initialState.postMeta;

    this.frontPageFirstData = initialState.frontPageFirstData;
    this.eventsFirstData = initialState.eventsFirstData;
    this.eventCategoryFirstData = initialState.eventCategoryFirstData;
    this.itemsFirstData = initialState.itemsFirstData;
    this.singleEventFirstData = initialState.singleEventFirstData;
    this.singleItemFirstData = initialState.singleItemFirstData;

    this.searchFirstData = initialState.searchFirstData;

    this.mobile = initialState.mobile;


    this.req = initialState.req;
  };
  @action
  setHistory = (history) => {
    this.history = history;
  };
  @action
  setMeta = (data) => {
    this.title = data.title;
    this.description = data.description;
    this.keywords = data.keywords;
    this.opengraph = data.opengraph;
    this.postMeta = data;
  };

  @action
  getData = async (props) => {
    try {
      if (this.history.location.pathname.indexOf('mos') + 1) {
        this.setCity(0);
      } else if (this.history.location.pathname.indexOf('spb') + 1) {
        this.setCity(1);
      } else {
        const daData = await this.getSypex(props.ip);
        const city = daData && daData.city ? daData.city.name_ru : false;
        const region = daData && daData.region ? daData.region.name_ru : false;

        if(daData && city && region){
          if( (city && city.indexOf('Москв')+1) || (region && region.indexOf('Московск')+1) ){
            this.setCity(0);
          }else if( (city && city.indexOf('Петербург')+1) || (region && region.indexOf('Ленинград')+1) ){
            this.setCity(1);
          }else{
            this.setCity(0);
          }
        }else{
          this.setCity(0);
        }
      }
    }catch (e) {
      console.log(e)
    }
  };

  @action
  getSypex = flow( function* getSypex(props){
    try{
      const resp = yield globalService.getSypex(props);
      this.daData = resp;

      return resp;
    }catch(e){
      console.log(e);
    }
  }).bind(this);

  @action
  getPageData = flow( function* getPageData(routes){
    try{
      const match = matchRoutesPath(this.history.location.pathname, routes);
      let resp;

      switch (match.component.key) {
        case 'FrontPage':
        case 'FrontPageCity':
          resp = yield pageService.getFrontPageData({city: this.baseNameForRouting});
          this.setMeta(resp.seo);
          this.frontPageFirstData = resp;
          break;

        case 'Events':
          resp = yield pageService.getEvents({city: this.baseNameForRouting, page: 1, size: 21});
          this.setMeta(resp.seo);
          this.eventsFirstData = resp;
          break;

        case 'Concerts':
        case 'Festivals':
        case 'EventCategory':
          const category = matchCategories(this.categoriesForMenu, match)[0];
          resp = yield pageService.getEventsByCategory({city: this.baseNameForRouting, page: 1, size: 21, category: category.slug});
          this.setMeta(resp.seo);
          this.eventCategoryFirstData = resp;
          this.pageName = category.name;
          break;

        case 'Items':
          resp = yield pageService.getItems({city: this.baseNameForRouting, page: 1, size: 21});
          this.setMeta(resp.seo);
          this.itemsFirstData = resp;
          break;

        case 'SingleEvent':
          resp = yield eventService.getEventDataBySlug({city: this.baseNameForRouting, slug: match.match.params.eventSlug});
          this.setMeta(resp.seo);
          this.singleEventFirstData = resp;
          break;

        case 'SingleItem':
          resp = yield itemService.getItemDataBySlug({city: this.baseNameForRouting, slug: match.match.params.itemSlug});
          this.setMeta(resp.seo);
          this.singleItemFirstData = resp;
          break;

        case 'Search':
          searchStore.setSearchString(this.history.location.search.substr(1));
          let args = searchStore.parseString();
          args.size = searchStore.pagination.pageSize;
          args.page = searchStore.pagination.current;

          resp = yield searchService.getSearchPageResult({city: this.baseNameForRouting, ...args});
          this.setMeta(resp.seo);
          this.searchFirstData = resp;
          searchStore.setTitle(resp.seo.title_page);
          break;

        case 'Offer':
          resp = yield servicePagesService.getMetaPageByName({city: this.baseNameForRouting, slug: 'offer'});
          this.setMeta(resp);
          break;

        case 'Advertising':
          resp = yield servicePagesService.getMetaPageByName({city: this.baseNameForRouting, slug: 'reklama'});
          this.setMeta(resp);
          break;

        case 'Contacts':
          resp = yield servicePagesService.getMetaPageByName({city: this.baseNameForRouting, slug: 'contacts'});
          this.setMeta(resp);
          break;

        case 'Page404':
          this.setMeta(this.meta404);
          break;

        default:
      }

      return resp;
    }catch(e){
      console.log(e);
    }
  }).bind(this);

  toJson() {
    return {
      CITY: this.CITY,
      cities: this.cities,
      daData: this.daData,
      data: this.data,
      history: this.history,

      pageName: this.pageName,

      title: this.title,
      description: this.description,
      keywords: this.keywords,
      opengraph: this.opengraph,
      postMeta: this.postMeta,

      frontPageFirstData: this.frontPageFirstData,
      eventsFirstData: this.eventsFirstData,
      eventCategoryFirstData: this.eventCategoryFirstData,
      itemsFirstData: this.itemsFirstData,
      singleEventFirstData: this.singleEventFirstData,
      singleItemFirstData: this.singleItemFirstData,

      searchFirstData: this.searchFirstData,

      mobile: this.mobile,


      req: this.req
    };
  }
}

function matchRoutesPath(localPath, routes){
  return routes.map(el => {
    const rout = el.path;

    const match = matchPath(
      localPath,
      { path: rout, exact: true }
    );

    if(match !== null) return {component: el, match}
  }).filter(el => {
    return el !== undefined
  })[0];
}
function matchCategories(categories, cat){
  let c = categories.filter(category => {
    if(category.cat === cat.component.key || category.cat.toLowerCase() === cat.match.params.catName)
      return category;
  });
  return c;
}
