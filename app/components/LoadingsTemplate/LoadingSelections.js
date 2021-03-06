import React from 'react';
import styled, { keyframes } from 'styled-components';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import css from '../../theme/style';

const CardWrap = styled(Card)`
  margin-bottom: 16px;
`;
const Image = styled.div`
  background: linear-gradient( to right,
    rgba(237,237,237,1) 0%,
    rgba(237,237,237,1) 41%,
    rgba(230,225,230,1) 51%,
    rgba(230,225,230,1) 54%,
    rgba(237,237,237,1) 62%,
    rgba(237,237,237,1) 100% );
  background-attachment: fixed;
  background-position-x: 0;
  background-size: 200vw;
  animation: ${keyframes`
        from{background-position-x:0;}50%{background-position-x:-200%;}
        to{background-position-x:-200%;}
      `} 2s linear infinite;
  display: block;
  border-radius: ${css.sizes.xd};
  margin-bottom: 0px;
  height: 300px;
  width: 100%;
`;
const Title = styled(Image)`
  height: ${css.sizes.xxxl};
  width: 42%;
  border-radius: ${css.sizes.lg};
`;

export default function LoadingForEvents(){
  return(
    <React.Fragment>
      <Grid item xs={12}>
        <Title />
      </Grid>
      {[1,2,3,4].map((el, k) => (
        <Grid key={k} item xs={6}>
          <CardWrap>
            <Image />
          </CardWrap>
        </Grid>
      ))}
      <div style={{marginTop: '1em'}}/>
    </React.Fragment>
  )
}
