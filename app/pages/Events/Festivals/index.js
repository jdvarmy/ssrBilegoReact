import React, { Component } from 'react';
import { inject } from 'mobx-react';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import EventsList from '../EventsList';
import BlockHeaderText from '../../../components/BlockHeaderText';
import { FilterLine } from '../../../components/FilterLine';

const Wrap = styled.div`
  padding: 20px;
  overflow: hidden;
`;
const GridWrap = styled(Grid)`
  .MuiPaper-elevation1{
    box-shadow: none;
  }
`;

@inject('pageStore')
class Festivals extends Component{
  render(){
    return(
      <Wrap>
        <GridWrap container spacing={4}>
          <Grid item xs={12}>
            <FilterLine/>
          </Grid>
          <Grid item xs={12}><BlockHeaderText>Фестивали</BlockHeaderText></Grid>
          <Grid item xs={12}>
            <EventsList/>
          </Grid>
        </GridWrap>
      </Wrap>
    );
  }
}

export default Festivals;
