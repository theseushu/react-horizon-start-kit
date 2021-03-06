import React, { Component, PropTypes } from 'react';
import injectSheet from 'react-jss';
import Textfield from 'react-mdl/lib/Textfield';
import IconButton from 'react-mdl/lib/IconButton';
import logo40 from 'assets/logo40.png';
import logoBig from 'assets/logo-main.png';
import logoSmall from 'assets/logo.png';
import { breakpoints } from 'modules/common/styles';

class Search extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    value: PropTypes.string,
  }
  componentWillMount() {
    this.setState({ value: this.props.value || '' });
  }
  render() {
    const { label, onSearch, classes } = this.props;
    const { value } = this.state;
    return (
      <form
        className={classes.search}
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(value);
        }}
      >
        <Textfield
          label={label}
          onChange={(e) => { this.setState({ value: e.target.value }); }}
          value={value}
        />
        <IconButton name="search" type="submit" />
      </form>
    );
  }
}

const StyledSearch = injectSheet({
  search: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    '& .mdl-textfield': {
      minWidth: 0,
      width: 'auto',
      flex: 1,
    },
  },
})(Search);

const DefaultHeader = ({ classes, search, main }) => (
  <div className={classes.defaultHeader}>
    <a href="/" className={classes.logo}>
      <img src={logoBig} role="presentation" />
    </a>
    <a href="/" className={classes.logoSmall}>
      <img src={logoSmall} role="presentation" />
    </a>
    <a href="/" className={classes.logoHorizontal}>
      <img src={logo40} role="presentation" />
    </a>
    {
      search && search.label && search.onSearch && (
        <div className={classes.search}><StyledSearch {...search} /></div>
      )
    }
    {
      !search && main
    }
  </div>
);

DefaultHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  main: PropTypes.any,
  search: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    value: PropTypes.string,
  }),
};

export default injectSheet({
  defaultHeader: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    '.is-compact &': {
    },
  },
  logo: {
    [breakpoints.mediaDestkopBelow]: {
      display: 'none',
    },
    '.is-compact &': {
      display: 'none',
    },
  },
  logoSmall: {
    [breakpoints.mediaDestkopAbove]: {
      display: 'none',
    },
    '.is-compact &': {
      display: 'none',
    },
  },
  logoHorizontal: {
    display: 'none',
    '.is-compact &': {
      display: 'block',
    },
  },
  search: {
    flex: 1,
    marginLeft: 24,
    '& > *': {
      maxWidth: 400,
    },
    textAlign: 'right',
    '.is-compact &': {
      display: 'none',
    },
  },
})(DefaultHeader);
