import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import MenuItem from '@material-ui/core/MenuItem';
import { StyledTextField } from '../../components/StyledTextField';

const STextField = styled(StyledTextField)`
  width: 387px;
`;
const STextFieldCat = styled(StyledTextField)`
  width: 200px;
`;
const Sform = styled.form`
  max-width: 870px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

@inject('pageStore', 'globalStore')
@observer
class ItemsSearch extends Component{
  componentDidMount() {
    const {pageStore:{getItemsCategoryList}, globalStore:{baseNameForRouting}} = this.props;
    getItemsCategoryList({city: baseNameForRouting});
  }

  time;

  setCategory = event => {
    const {pageStore:{setItemFilter}, globalStore:{baseNameForRouting}} = this.props;
    const value = 'all' === event.target.value ? '' : event.target.value;

    setItemFilter({city: baseNameForRouting, category: value});
  };
  setSearch = event => {
    const {pageStore:{setItemFilter}, globalStore:{baseNameForRouting}} = this.props;
    const value = event.target.value;

    this.time = setTimeout(function(){
      setItemFilter({city: baseNameForRouting, search: value});
    }, 100);
  };

  componentWillUnmount(){
    clearTimeout(this.time);
  };

  render(){
    const {pageStore:{itemsCategoryList, itemFilters}} = this.props;

    return(
      <Sform noValidate autoComplete="off">
        <STextField
          id="bilego-search"
          label="Название места, улица"
          type="search"
          onChange={this.setSearch}
          margin="normal"
          variant="outlined"
        />
        <STextFieldCat
          id="bilego-select-category"
          select
          label="Тип места"
          value={itemFilters.category ? itemFilters.category : 'all'}
          onChange={this.setCategory}
          margin="normal"
          variant="outlined"
        >
          {[{id: 0, name: 'Все площадки', slug: 'all'}, ...itemsCategoryList].map((cat) =>(
            <MenuItem key={cat.name} value={cat.slug}>
              {cat.name}
            </MenuItem>
          ))}
        </STextFieldCat>
      </Sform>
    )
  }
}

export default ItemsSearch;
