import React, { PropTypes } from 'react';
import injectSheet from 'react-jss';
import Link from 'react-router/lib/Link';
import Checkbox from 'react-mdl/lib/Checkbox';
import IconButton from 'react-mdl/lib/IconButton';
import Button from 'react-mdl/lib/Button';
import Menu, { MenuItem } from 'react-mdl/lib/Menu';
import Textfield from 'react-mdl/lib/Textfield';
import { publishTypesInfo } from 'funong-common/lib/appConstants';
import LabelWithBorder from 'modules/common/label/labelWithBorder';
import { formatPrice } from 'funong-common/lib/utils/displayUtils';
import { breakpoints, shadows, colors } from 'modules/common/styles';
import Thumbnail from 'modules/common/publishes/thumbnail';
import layout from '../layout';
import RemoveItemsButton from '../removeItemsButton';

const Spec = ({ type, item, classes, onItemChange }) => {
  const product = item[type];
  const info = publishTypesInfo[type];
  if (info.saleType === 1) {
    const spec = info.saleType === 1 ? product.specs[item.specIndex] : {};
    return (
      <div className={classes.spec}>
        <div>
          <span>{spec.name}</span>
          { info.saleType === 1 && product.specs.length > 1 &&
          <div className={classes.specSelector}>
            <small>更多规格</small>
            <IconButton name="more_vert" id={`${item.objectId}_spec_menu`} />
            <Menu target={`${item.objectId}_spec_menu`} align="right">
              {product.specs.map((s, i) => <MenuItem
                key={i}
                disabled={s === spec}
                onClick={() => onItemChange({ specIndex: i })}
              >{s.name}</MenuItem>)}
            </Menu>
          </div>
          }
        </div>
        <div className={classes.specParams}>
          {info.saleType === 1 && spec.params.map((param, i) => <span style={{ display: 'inline-block', padding: 4 }} key={i}><LabelWithBorder>{param}</LabelWithBorder> </span>)}
        </div>
        <div className={classes.specPrice}>
          {info.saleType === 1 ? formatPrice(spec) : '待议'}
        </div>
      </div>
    );
  }
  return <div className={classes.spec} />;
};
Spec.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  onItemChange: PropTypes.func.isRequired,
};

const CountAndAmount = ({ type, item, classes, onItemChange, error }) => {
  const product = item[type];
  const info = publishTypesInfo[type];
  if (info.saleType === 1) {
    const spec = info.saleType === 1 ? product.specs[item.specIndex] : {};
    return (
      <div className={classes.countAndAmount}>
        <div className={classes.count}>
          <IconButton name="add_circle_outline" onClick={() => onItemChange({ quantity: item.quantity + 1 })} />
          <Textfield
            label="数量"
            type="number"
            className={classes.countInput}
            value={item.quantity}
            onChange={(e) => onItemChange({ quantity: e.target.value })}
            autoComplete="off"
            error={error}
          />
          <IconButton name="remove_circle_outline" onClick={() => onItemChange({ quantity: item.quantity - 1 })} />
        </div>
        <div className={classes.amount}>
          <h6>{!error && (spec.price * Number(item.quantity))}</h6>
        </div>
      </div>
    );
  }
  return (
    <div className={classes.countAndAmount}>
      <div className={classes.count} />
      <div className={classes.amount}>
        <h6>待议</h6>
      </div>
    </div>
  );
};
CountAndAmount.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  onItemChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

const CartItem = ({ type, item, classes, checked, onChange, onItemChange, onItemsRemoved, error }) => {
  const product = item[type];
  const info = publishTypesInfo[type];
  return (
    <div className={`${classes.cartItem} ${shadows.shadow2}`}>
      <div className={classes.desc}>
        <div>
          <Checkbox ripple checked={checked} onChange={onChange} />
        </div>
        <div className="_thumbnail">
          <Link to={`/${info.route}/${product.objectId}`}>
            <Thumbnail className={classes.thumbnail} type={type} thumbnail={product.thumbnail} />
          </Link>
        </div>
        <div className="_desc_name">
          <Link to={`/${info.route}/${product.objectId}`}>
            {`${info.title} - ${product.name}`}
          </Link>
        </div>
      </div>
      <Spec item={item} type={type} classes={classes} onItemChange={onItemChange} />
      <CountAndAmount item={item} type={type} classes={classes} onItemChange={onItemChange} error={error} />
      <div className={classes.actions}>
        <RemoveItemsButton cartItemIds={[item.objectId]} onItemsRemoved={onItemsRemoved} />
        <Button>加入收藏</Button>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onItemChange: PropTypes.func.isRequired,
  onItemsRemoved: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default injectSheet({
  cartItem: {
    padding: 8,
    marginTop: 16,
    display: 'flex',
    alignItems: 'stretch',
    height: 96,
    [breakpoints.mediaDestkopBelow]: {
      flexDirection: 'column',
      height: 'auto',
      '& > div': {
        marginBottom: 16,
      },
      '& :last-child': {
        marginBottom: 0,
      },
    },
  },
  desc: {
    width: layout.desc.width,
    marginRight: layout.desc.marginRight,
    display: 'flex',
    '& > ._thumbnail': {
      marginRight: 16,
      width: 80,
      height: 80,
      '& i': {
        fontSize: 80,
      },
    },
    '& > ._desc_name': {
      flex: 1,
    },
    [breakpoints.mediaDestkopBelow]: {
      width: '100%',
      marginRight: 0,
      '& > img': {
        width: 40,
        height: 40,
        marginRight: 16,
      },
    },
  },
  spec: {
    margin: `0 ${layout.spec.margin}px`,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  specSelector: {
    float: 'right',
    position: 'relative',
    marginTop: -6,
    color: colors.colorSubTitle,
  },
  specParams: {
    flex: 1,
    overflow: 'hidden',
    '& > span': {
    },
  },
  specPrice: {
    color: colors.colorPrice,
  },
  countAndAmount: {
    display: 'flex',
    margin: `0 ${layout.countAndAmount.margin}px`,
    width: layout.countAndAmount.width,
    flexDirection: 'column',
    alignItems: 'center',
    [breakpoints.mediaDestkopBelow]: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
    },
  },
  count: {
    minHeight: 50,
    margin: '-6px 0 0',
    display: 'flex',
    alignItems: 'flex-start',
    width: 140, // 76 + 32 + 32
    color: colors.colorSubTitle,
    [breakpoints.mediaDestkopBelow]: {
      margin: 0,
    },
  },
  countInput: {
    minWidth: 0,
    marginTop: -16,
    flex: 1,
    color: colors.colorText,
    '& .mdl-textfield__input, & .mdl-textfield__label': {
      textAlign: 'right',
    },
  },
  amount: {
    margin: '0 24px',
    color: colors.colorPrice,
    '& > h6': {
      margin: 0,
    },
  },
  actions: {
    width: layout.actions.width,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    [breakpoints.mediaDestkopBelow]: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 0,
    },
  },
})(CartItem);
