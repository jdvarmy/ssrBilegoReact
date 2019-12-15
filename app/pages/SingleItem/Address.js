import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
import ReactMapGL, { Marker } from 'react-map-gl';
import styled from 'styled-components';

import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { BilegoIconMapPin } from '../../theme/BilegoIcons';
import BlockHeaderText from '../../components/BlockHeaderText';

const Padding = styled.div`
  padding-top:48px;
`;

@inject('mapStore')
@observer
class Address extends Component {
  @observable viewport = {};

  componentDidMount() {
    const {item} = this.props;
    this.setViewport({
      width: '100%',
      height: 308,
      latitude: item.meta.map.latitude !== undefined && item.meta.map.latitude*1,
      longitude: item.meta.map.longitude !== undefined && item.meta.map.longitude*1,
      zoom: 16
    })
  }

  @action setViewport = (viewport) => {
    this.viewport = viewport;
  };

  render() {
    const {REACT_APP_MAPBOX_TOKEN, mapStyle} = this.props.mapStore;

    return (
      <Box>
        <Grid style={{padding: '20px'}} container spacing={4}>
          <Grid item xs={12}>
            <BlockHeaderText>Карта</BlockHeaderText>
          </Grid>
        </Grid>
        <ReactMapGL
          {...this.viewport}
          mapStyle={mapStyle}
          mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
          onViewportChange={this.setViewport}
        >
          <Marker latitude={this.props.item.meta.map.latitude*1} longitude={this.props.item.meta.map.longitude*1}>
            <Fab>{BilegoIconMapPin}</Fab>
          </Marker>
        </ReactMapGL>
        <Padding />
      </Box>
    );
  }
}

export default Address;