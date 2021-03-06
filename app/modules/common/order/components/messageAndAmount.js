import React, { Component, PropTypes } from 'react';
import _map from 'lodash/map';
import injectSheet from 'react-jss';
import Textfield from 'react-mdl/lib/Textfield';
import { breakpoints, colors } from 'modules/common/styles';
import { orderFeeTypes } from 'funong-common/lib/appConstants';
import { isOwner as isOrderOwner } from 'funong-common/lib/utils/orderUtils';
import confirm from 'modules/toastr/confirm';
import { layouts } from '../styles';
import FeeDialog from './feeDialog';

class MessageAndAmount extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onMessageChange: PropTypes.func,
    onDiscountChange: PropTypes.func,
  }
  state = { editing: false }
  message = () => {
    const { order: { message }, onMessageChange, classes } = this.props;
    return (
      <div className="_left">
        <Textfield
          label="给卖家留言"
          rows={3}
          className={classes.message}
          value={message || ''}
          onChange={(e) => onMessageChange(e.target.value)}
        />
      </div>
    );
  }
  messageReadonly = (isOwner) => {
    const { order: { message }, classes } = this.props;
    return (
      <div className="_left">
        <Textfield
          label={isOwner ? '留言' : '买家留言'}
          rows={3}
          readOnly
          className={classes.message}
          value={message || ''}
        />
      </div>
    );
  }
  amount = () => {
    const { order, onDiscountChange, classes } = this.props; // eslint-disable-line
    const { fees, amount } = order;
    return (
      <div className="_right">
        <div className={classes.amount}>
          { _map(fees, (value, key) => (
            <div key={key}>
              <small>{orderFeeTypes[key].title}：</small>
              {value === -1 ? '待议' : `￥${value}`}
            </div>
          ))}
          <div>
            <small>总价：</small>{amount === -1 ? '待议' : `￥${amount}`}
            <br className="_line_breaker" />
            <small>
              <a href="#_non_existing" disabled={amount === -1} onClick={(e) => { e.preventDefault(); this.setState({ editing: true }); }}>
                {amount === -1 ? '请先设置其它费用' : ' 修改总价'}
              </a>
            </small>
          </div>
        </div>
        { this.state.editing && (
          <FeeDialog
            title="总价"
            label="总价"
            close={() => this.setState({ editing: false })}
            value={amount === -1 ? null : amount}
            onSubmit={(newAmount) => {
              const oldDiscount = fees[orderFeeTypes.discount.key] || 0;
              const discount = newAmount - (amount - oldDiscount);
              if (discount > 0) {
                confirm({
                  title: '您设置的总价高于商品价格和服务费之和，确定吗？',
                  ok: () => {
                    onDiscountChange(discount);
                  },
                  cancel: () => {},
                });
              } else {
                onDiscountChange(discount);
              }
            }}
          />
        )}
      </div>
    );
  }
  amountReadonly = () => {
    const { order, classes } = this.props;
    const { fees, amount } = order;
    return (
      <div className="_right">
        <div className={classes.amount}>
          { _map(fees, (value, key) => (
            <div key={key}>
              <small>{orderFeeTypes[key].title}：</small>
              {value === -1 ? '待议' : `￥${value}`}
            </div>
          ))}
          <div><small>总价：</small>{amount === -1 ? '待议' : `￥${amount}`}</div>
        </div>
      </div>
    );
  }
  render() {
    const { user, order, classes } = this.props;
    const isOwner = isOrderOwner(order, user);
    return (
      <div className={classes.messageAndAmount}>
        {order.can.requirements ? this.message() : this.messageReadonly(isOwner)}
        {order.can.discount ? this.amount() : this.amountReadonly()}
      </div>
    );
  }
}

export default injectSheet({
  messageAndAmount: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    color: colors.colorSubTitle,
    '& > ._left': {
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '& > ._right': {
      width: layouts.right,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '& ._info': {
      flex: 1,
      paddingRight: 16,
    },
    '& ._amount': {
      color: colors.colorSubPrice,
      width: layouts.priceColumnWidth,
      '& a': {
        textDecoration: 'none',
      },
    },
    '& small': {
      color: colors.colorSubTitle,
    },
    [breakpoints.mediaDestkopBelow]: {
      flexDirection: 'column',
      '& > ._left': {
        width: '100%',
      },
      '& > ._right': {
        width: '100%',
        flexDirection: 'column',
      },
      '& ._amount': {
        width: '100%',
      },
      '& ._line_breaker': {
        display: 'none',
      },
    },
  },
  message: {
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
    marginRight: 24,
  },
  amount: {
    paddingTop: 24,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    color: colors.colorPrice,
    '& > div': {
      width: 180,
    },
    [breakpoints.mediaDestkopBelow]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingTop: 0,
      paddingBottom: 24,
      '& > div': {
        width: 'auto',
        marginRight: 24,
      },
    },
  },
})(MessageAndAmount);
