import React, { PropTypes } from 'react';
import injectSheet from 'react-jss';
import Checkbox from 'react-mdl/lib/Checkbox';
import IconButton from 'react-mdl/lib/IconButton';
import Button from 'react-mdl/lib/Button';
import Menu, { MenuItem } from 'react-mdl/lib/Menu';
import Textfield from 'react-mdl/lib/Textfield';
import LabelWithBorder from 'modules/common/label/labelWithBorder';
import { formatPrice } from 'utils/displayUtils';
import { breakpoints, shadows, colors } from 'modules/common/styles';
import layout from '../layout';

const CartItem = ({ item, classes, checked, onChange, onQuantityChange, error }) => {
  const product = item.shopProduct || item.supplyProduct;
  const spec = product.specs[item.specIndex || 0];
  return (
    <div className={`${classes.cartItem} ${shadows.shadow2}`}>
      <div className={classes.desc}>
        <div>
          <Checkbox ripple checked={checked} onChange={onChange} />
        </div>
        <img role="presentation" className={classes.thumbnail} src={product.thumbnail.thumbnail_80_80} />
        <div className="_desc_name">{product.name}</div>
      </div>
      <div className={classes.spec}>
        <div>
          <span>{spec.name}</span>
          { product.specs.length > 1 &&
            <div className={classes.specSelector}>
              <small>更多规格</small>
              <IconButton name="more_vert" id={`${item.objectId}_spec_menu`} />
              <Menu target={`${item.objectId}_spec_menu`} align="right">
                {product.specs.map((s, i) => <MenuItem key={i} disabled={s === spec}>{s.name}</MenuItem>)}
              </Menu>
            </div>
          }
        </div>
        <div className={classes.specParams}>
          {spec.params.map((param, i) => <span style={{ display: 'inline-block', padding: 4 }} key={i}><LabelWithBorder>{param}</LabelWithBorder> </span>)}
        </div>
        <div className={classes.specPrice}>
          {formatPrice(spec)}
        </div>
      </div>
      <div className={classes.countAndAmount}>
        <div className={classes.count}>
          <IconButton name="add_circle_outline" onClick={() => onQuantityChange(item.quantity + 1)} />
          <Textfield
            label="数量"
            type="number"
            className={classes.countInput}
            value={item.quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            autoComplete="off"
            error={error}
          />
          <IconButton name="remove_circle_outline" onClick={() => onQuantityChange(item.quantity - 1)} />
        </div>
        <div className={classes.amount}>
          <h6>{!error && (spec.price * Number(item.quantity))}</h6>
        </div>
      </div>
      <div className={classes.actions}>
        <Button colored>删除</Button>
        <Button colored>加入收藏</Button>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default injectSheet({
  avatar: {
    width: 30,
    height: 30,
    margin: '0 16px',
  },
  cartItem: {
    padding: 16,
    marginTop: 16,
    display: 'flex',
    alignItems: 'stretch',
    height: 132,
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
    '& > img': {
      marginRight: 16,
      width: 80,
      height: 80,
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
