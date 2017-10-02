// @flow

import React from 'react';
import { Menu, Container, Icon } from 'semantic-ui-react';

const Footer = () => (
  <Menu secondary inverted color="grey">
    <Container className="footerContainer ">
      <Menu.Item>
        <p>
          Made with <Icon name="empty heart" /> by{' '}
          <a href="https://github.com/MAOKG" target="blank" className="border">
            {' '}
            Maosen
          </a>
          <a href="https://github.com/MAOKG/votingApp" target="blank">
            GitHub Respository
          </a>
        </p>
      </Menu.Item>
    </Container>
  </Menu>
);

export default Footer;
