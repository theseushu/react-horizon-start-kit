import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Layout from 'modules/common/layout';
import { createLogisticsProductSelector } from 'modules/data/ducks/selectors';
import Form from './form';
import Display from './display';

const EMPTY_PRODUCT = {
  capacity: '',
  maxNumber: '1',
  price: '',
  range: [],
  name: '',
  location: null,
  available: true,
  desc: '',
  images: [],
  labels: {},
};

// const EMPTY_PRODUCT = {
//   capacity: '500',
//   maxNumber: '1',
//   price: '5吨以下50元/吨公里， 10吨以下40元/吨公里，10吨以上30元/吨公里',
//   range: [{
//     title: '北京',
//     value: '北京',
//   }],
//   name: '500吨， 北京',
//   available: true,
//   location: { address: { country: '中国', province: '湖北省', city: '武汉市', district: '江夏区', details: '湖北省武汉市江夏区江夏区经济开发区藏龙岛街道藏龙大道40号湖北城市建设职业技术学院' }, lnglat: { longitude: 114.43427, latitude: 30.40506 } },
//   desc: 'dfsadfdsafdsafdas',
//   images: [{ name: '1485723387376.png', url: 'http://ac-ouy08OrF.clouddn.com/1e3f26168703a1a9ae8f.png', metaData: { owner: '58774b8d61ff4b0065df953d', width: 1024, height: 287 }, base64: '', mime_type: 'image/png', objectId: '588e56fb570c350062105312', __type: 'File', id: '588e56fb570c350062105312' }],
//   labels: {},
// };

const LogisticsEditPage = ({ product, location: { query } }) => (
  <Layout
    content={
      query.edit ?
        <Form initialValues={product || EMPTY_PRODUCT} /> :
        <Display product={product} />
    }
    smallContent={!!query.edit}
  >
  </Layout>
  );

LogisticsEditPage.propTypes = {
  product: PropTypes.object,
  location: PropTypes.object,
};

export default connect(
  (state, { params: { id } }) => ({ product: id === 'new' ? null : createLogisticsProductSelector(id)(state) }),
)(LogisticsEditPage);
