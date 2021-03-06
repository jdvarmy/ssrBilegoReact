import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ruLocale from 'date-fns/locale/ru';
import format from 'date-fns/format';

import style from '../../theme/style';

const Wrap = styled.div`
  width: 100%;
  margin-bottom: 20px;
  a{
    display: flex;
    & > div:last-child{
      width: calc(100% - 125px);
      display: flex;
      padding-left: 20px;
      color: ${style.$black};
      font-size: 1.2em;
    }
    
    .event-search-hover{
      height: 80px;
      width: 105px;
      overflow: hidden;
      position: relative;
      border-radius: 7px;
      
      .event-search-backgr{
        background-color: ${style.$redtr};
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        transition: opacity ${style.$transition} ${style.$transitionanimation} 0s;
      }
      .event-search-date{
        width: 100%;
        position: absolute;
        top: calc((100% - 52px) / 2);
        left: 0;
        opacity: 0;
        transition: opacity ${style.$transition} ${style.$transitionanimation} 0s;
        div{
          font-size: 1.5em;
          font-weight: bold;
          text-transform: uppercase;
          text-align: center;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${style.$white};
        }
        > div:first-child{
          font-size: 1.8em;
        }
      }
    }

    &:hover .event-search-backgr, &:hover .event-search-date{
      opacity: 1;
    }
    &:hover .event-search-image{
      transform: scale(1.10, 1.10);
      overflow: hidden;
      border-radius: 7px;
    }
  }
`;
const Image = styled.div`
  .event-search-image{
    background-image: url('${p=>(p.img)}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 80px;
    width: 105px;
    transition: transform .5s ease 0s;
  }
`;
const Text = styled.div``;

export default function Event(props){
  const {baseNameForRouting, name, image, title, date_time} = props;

  return(
    <Wrap className="event-search">
      <Link to={`/${baseNameForRouting}/event/${name}`}>
        <Image className="event-search-hover" img={image}>
          <div className="event-search-image"/>
          <div className="event-search-backgr"/>
          <div className="event-search-date">
            <div>{format(new Date(date_time), 'd', { locale: ruLocale }).slice(0, 3)}</div>
            <div>{format(new Date(date_time), 'MMM', { locale: ruLocale }).slice(0, 3)}</div>
          </div>
        </Image>
        <Text>
          {title}
        </Text>
      </Link>
    </Wrap>
  )
}
