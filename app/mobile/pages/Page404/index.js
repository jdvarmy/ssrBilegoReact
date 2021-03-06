import React from 'react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { style } from '../../../theme';
import Padding from '../../components/Padding';

const Content = styled.div`
  background-color: ${style.$white};
  overflow: hidden;
  z-index: 1;
  position: relative;
  padding-top: 75px;
  margin: auto 16px;
  h2{
    text-align: center;
    margin-top: 32px;
    margin-bottom: 16px;
  }
`;
const Title = styled(Typography)`
  text-align: center;
  margin-top: 25px!important;
`;

@inject('globalStore')
class Page404 extends React.Component{
  constructor(props){
    super(props);
    this.props.globalStore.setMobileMenuCityColor(style.$black);
  };

  componentDidMount = () => {
    const { meta404, setMeta } = this.props.globalStore;

    setMeta(meta404);
  };

  menu = [
    {
      name: 'Главная',
      link: '',
    }, {
      name: 'Концерты',
      link: '/search?cat=concerts',
    }, {
      name: 'Фестивали',
      link: '/search?cat=festivals',
    }
  ];
  subMenu = [
    {
      name: 'Контакты',
      link: '/contacts',
    }, {
      name: 'Оферта',
      link: '/offer',
    }
  ];

  render(){
    const {globalStore:{baseNameForRouting, categoriesForMenu, categoriesForFooterMenu}} = this.props;

    return(
      <React.Fragment>
        <Padding>
          <div/>
        </Padding>
        <Content>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Title component="h1" variant="h4">Четыре Ноль Четыре</Title>
              <Typography component="h2" variant="h5">Такой страницы не существует</Typography>
              <List component="nav" aria-label="main">
                {this.menu.map(el=>(
                  <ListItem key={el.name} button>
                    <Link to={`/${baseNameForRouting}/${el.link}`}>
                      <ListItemText primary={el.name} />
                    </Link>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List component="nav" aria-label="secondary">
                {this.subMenu.map(el=>(
                  <ListItem key={el.name} button>
                    <Link to={`/${baseNameForRouting}/${el.link}`}>
                      <ListItemText primary={el.name} />
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Content>
      </React.Fragment>
    );
  }
}

export default Page404;
