import React, { Component, PropTypes } from 'react';
import _find from 'lodash/find';
import injectSheet from 'react-jss';
import { provinces as allProvinces } from 'funong-common/lib/appConstants';
import ProvincesSelectorDialog from 'modules/common/location/provincesSelectorDialog';
import FormButton from 'modules/common/formElements/button';
import styles, { colors } from 'modules/common/styles';

class RangeField extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object,
    classes: PropTypes.object.isRequired,
  }
  state = {
    showDialog: false,
  }
  render() {
    const { input: { value, onChange }, meta: { error }, classes } = this.props;
    const { showDialog } = this.state;
    return (
      <div className={error && styles.colorError}>
        <div>
          服务区域
          <FormButton
            error={error} onClick={(e) => {
              e.preventDefault();
              this.setState({ showDialog: true });
            }}
          >
            {value.length === 0 ? '点击选择' : '修改'}
          </FormButton>
        </div>
        <div className={`${classes.range}`}>
          {
            value.length === 0 ? '全国' :
            value.map((province, i) => <span key={i}>{_find(allProvinces, (p) => p.value === province).title}</span>)
          }
        </div>
        <ProvincesSelectorDialog
          show={showDialog}
          close={() => this.setState({ showDialog: false })}
          onSubmit={(range) => { onChange(range); this.setState({ showDialog: false }); }}
          provinces={value}
        />
      </div>
    );
  }
}

export default injectSheet({
  range: {
    marginBottom: 16,
    '& > span': {
      fontSize: 12,
      padding: 8,
      color: colors.colorSubTitle,
      display: 'inline-block',
    },
  },
})(RangeField);
