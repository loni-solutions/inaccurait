import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';

const HeaderContainer = styled('header')`
  .MuiToolbar-root {
    display: flex;
    justify-content: center;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" align='center'>inaccurAIt</Typography>
        </Toolbar>
      </AppBar>
    </HeaderContainer>
  );
};

export default Header;
