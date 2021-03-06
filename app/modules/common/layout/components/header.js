import React, { PropTypes } from 'react';
import injectSheet from 'react-jss';
import Link from 'react-router/lib/Link';
import { Header, HeaderRow, Navigation } from 'react-mdl/lib/Layout';
import logo40 from 'assets/logo40.png';
import logoBig from 'assets/logo-main.png';
import { colors, breakpoints } from 'modules/common/styles';
import background from './assets/header-bg.jpg';
import Account from './account';

const routes = [
  { title: '首页', path: '/' },
  { title: '供应', path: '/supplies' },
  { title: '采购', path: '/inquiries' },
  { title: '乡村游', path: '/trips' },
  { title: '我的富农', path: '/me' },
  { title: '物流', path: '/logisticsList' },
  { title: '微店', path: '/products' },
];

const AppHeader = ({ classes, containerClass, header }) => (
  <Header waterfall hideTop={false} className={classes.header}>
    <HeaderRow className={classes.logoRow}>
      { header || <div className={classes.logo} /> }
      <Account className={classes.account} />
    </HeaderRow>
    <HeaderRow className={classes.nav}>
      <div className={containerClass}>
        <Navigation className={classes.links}>
          { routes.map((route, i) => <Link key={i} activeClassName={classes.activeLink} to={route.path}>{route.title}</Link>) }
        </Navigation>
      </div>
    </HeaderRow>
  </Header>
);

AppHeader.contextTypes = {
  router: PropTypes.object.isRequired,
};

AppHeader.propTypes = {
  containerClass: PropTypes.string.isRequired,
  classes: PropTypes.object,
  header: PropTypes.any,
};

export default injectSheet({
  header: {
    background: `url(${background})`,
  },
  logoRow: {
    position: 'relative',
    justifyContent: 'center',
    padding: 0,
    minHeight: 100,
    '.is-compact &': {
      minHeight: 0,
    },
  },
  logo: {
    background: `url(${logoBig})`,
    height: 100,
    width: 250,
    '.is-compact &': {
      background: `url(${logo40})`,
      height: 40,
      width: 166,
    },
  },
  account: {
    position: 'absolute',
    height: '100%',
    right: 16,
  },
  nav: {
    height: 45,
    padding: 0,
    background: 'rgba(76,175,80, 0.08)',
    [breakpoints.mediaDestkopBelow]: {
      display: 'none',
    },
  },
  links: {
    height: '45px !important',
    display: 'flex',
    justifyContent: 'space-between',
    '& > .mdl-navigation__link': {
      flex: 1,
      textAlign: 'center',
      padding: 0,
      height: 42,
      lineHeight: '42px',
    },
  },
  activeLink: {
    borderBottom: `solid 3px ${colors.colorAccent}`,
  },
})(AppHeader);
