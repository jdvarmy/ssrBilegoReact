import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ruLocale from 'date-fns/locale/ru';
import format from 'date-fns/format';

import style from '../../theme/style';
import { TicketsModalButton } from '../TicketsModal';

const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  & > a{
    height: 219px;
    overflow: hidden;
    display: block;
  }
  &:hover .event-300-hover{
    transform: scale(1.10, 1.10);
  }
`;
const Image = styled.div`
  background-image: url('${p => (p.img ? p.img : '')}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 219px;
  transition: transform .5s ease 0s;
`;
const Content = styled.div`
  position: relative;
  a{
    color: ${style.$black}
  }
`;
const Title = styled.h2`
  margin-top: 16px;
  line-height: 32px;
  font-size: 24px;
`;
const Span = styled.span`
  color: ${style.$greydark};
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  a{
    color: ${style.$greydark};
  }
`;
const SWrap = styled.div`
  .MuiFab-extended{
    position: absolute!important;
    top: -65px;
    left: 40px;
    height: 25px;
    padding: 0 15px;
    .MuiFab-label{
      font-size: 0.8em;
      color: ${style.$white};
    }
    svg{
      font-size: 1rem;
    }
  }
`;

export default function Event300(props) {
  const { title, date_time, images, name, ticket_link, item, baseNameForRouting } = props;
  const img = images && images.medium
    ? images.medium
    : images && images.medium_large
      ? images.medium_large
      : undefined;

  return (
    <Wrapper>
      {img !== undefined
        ? <React.Fragment>
          <Link to={`/${baseNameForRouting}/event/${name}`}>
            <div style={{borderRadius: '12px', overflow: 'hidden'}}>
              <Image className="event-300-hover" img={img} />
            </div>
          </Link>
          <Content>
            <SWrap>
              <TicketsModalButton href={ticket_link} />
            </SWrap>
            <Title><Link to={`/${baseNameForRouting}/event/${name}`}>{title}</Link></Title>
            <Span className="bilego-date-location">{format(new Date(date_time), 'd MMMM', { locale: ruLocale })} / <Link to={`/${baseNameForRouting}/item/${item.name}`}>{item.title}</Link></Span>
          </Content>
        </React.Fragment>
        :
        <Image className="event-300-hover" />
      }
    </Wrapper>
  );
}
