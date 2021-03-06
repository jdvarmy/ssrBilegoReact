import { observable, action, configure, flow } from 'mobx';
import { rightPanelService } from '../services';

import format from 'date-fns/format';

configure({
  enforceActions: 'always'
});

class RightPanel{
  defaultPageSize = 6;

  @observable isLoading = false;
  @observable temporaryResponseEvents = [];
  @observable events = [];
  @observable markers = [];

  @observable pagination = {current: 1, pageSize: this.defaultPageSize, showButton: true};

  @action
  clear = () => {
    this.temporaryResponseEvents = [];
    this.events = [];
    this.markers = [];
    this.pagination = {current: 1, pageSize: this.defaultPageSize, showButton: true}
  };
  @action
  setPagination = (current, pageSize = this.defaultPageSize) => {
    this.pagination.current = current ? current : this.pagination.current;
    this.pagination.pageSize = pageSize ? pageSize : this.pagination.pageSize;
  };

  @action
  getDataTimeLine = flow( function* getDataTimeLine(params){
    this.isLoading = true;
    try{
      const response = yield rightPanelService.getDataTimeLine({page: this.pagination.current, size: this.pagination.pageSize, ...params});
      this.pagination.showButton = response.length === this.pagination.pageSize;

      this.temporaryResponseEvents = [
        ...this.temporaryResponseEvents,
        ...response
      ];

      this.getTimeLine();
      this.getMarkers();
    }catch(e){
      console.log(e);
    }finally {
      this.isLoading = false;
    }
  }).bind(this);

  getTimeLine = () => {
    const temp = this.temporaryResponseEvents.reduce((obj, item) => {
      obj[item.date] = obj[item.date] || [];
      obj[item.date].push(item);
      return obj;
    }, {});

    this.events = Object.keys(temp).map(key => {
      return {date: key, events: temp[key]};
    });
  };
  getMarkers = () => {
    const temp = this.temporaryResponseEvents.reduce((obj, item) => {
      obj[item.item_id] = obj[item.item_id] || [];
      obj[item.item_id].push(item);
      return obj;
    }, {});

    this.markers = Object.keys(temp).map(key => {
      return {itemId: key, events: temp[key]};
    });
  };
}

export default new RightPanel();
