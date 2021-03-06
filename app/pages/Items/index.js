import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import { Spin } from 'antd';
import BlockHeaderText from '../../components/BlockHeaderText';
import Spinner from '../../components/Spinner';
import NoContent from '../../components/NoContent';
import { BilegoIconLoading } from '../../theme/bilegoIcons';
import { Item140 } from '../../components/Item';
import ItemsSearch from './ItemsSearch';
import { LoadingForItems } from '../../components/LoadingsTemplate';

const Wrap = styled.div`
  padding: 20px;
  overflow: hidden;
`;
const GridWrap = styled(Grid)`
  .MuiPaper-elevation1{
    box-shadow: none;
  }
`;
const CardWrap = styled(Card)`
  max-width: 870px;
`;
const SFab = styled(Fab)`
  margin: 50px auto!important;
  transition: opacity .2s ease 0s;
`;

@inject('pageStore', 'globalStore')
@observer
class Items extends Component{
  componentDidMount = async () => {
    const {pageStore:{changePageType, getItems}, globalStore:{baseNameForRouting, setMeta}} = this.props;

    changePageType('page');
    await getItems({city: baseNameForRouting});
    setMeta(this.props.pageStore.seoPage);
  };

  componentWillUnmount() {
    this.props.pageStore.clear();
  }

  loadMore = () => {
    const {pageStore:{pagination, setPagination, getItems}, globalStore:{baseNameForRouting}} = this.props;

    setPagination(pagination.current + 1);
    getItems({city: baseNameForRouting});
  };

  render(){
    const {pageStore:{items, isLoading, pagination:{showButton}}, globalStore:{cityLabel, baseNameForRouting}} = this.props;
    const content = <React.Fragment>
      <Grid container spacing={4}>
        {items.length > 0
          ?
          items.map(item=>(
            <Grid key={item.id} item xs={12}>
              <CardWrap>
                <Item140 {...item} baseNameForRouting={baseNameForRouting}/>
              </CardWrap>
            </Grid>
          ))
          :
          !isLoading && <Grid item xs={12}>
            <NoContent/>
          </Grid>
        }
      </Grid>
      <Grid container spacing={4}>
        {items.length > 0 && showButton &&
        <SFab onClick={this.loadMore} variant="extended" aria-label="load" style={{opacity: `${p=>p.loading ? 0 : 1}`}}>
          {BilegoIconLoading} Загрузить ещё
        </SFab>}
      </Grid>
    </React.Fragment>;

    return(
      <Wrap>
        <GridWrap container spacing={4}>
          <Grid item xs={12}><BlockHeaderText>Концертные площадки {cityLabel}</BlockHeaderText></Grid>
          <Grid item xs={12}>
            <ItemsSearch />
          </Grid>
          <Grid item xs={12}>
            <Spin spinning={isLoading && items.length > 0} indicator={<Spinner leftPadding={27/2} />}>
            {isLoading && items.length <= 0
              ? <LoadingForItems />
              : content
            }
            </Spin>
          </Grid>
        </GridWrap>
      </Wrap>
    );
  }
}

export default Items;
