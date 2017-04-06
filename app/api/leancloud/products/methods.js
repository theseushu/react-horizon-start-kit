import _map from 'lodash/map';
import _union from 'lodash/union';
import _isUndefined from 'lodash/isUndefined';
import AV from 'leancloud-storage';
import { generateKeywords } from 'utils/productUtils';
import { productToJSON as converter } from '../utils/converters';
import { products as shemas } from '../utils/shemas';
const debug = require('debug')('app:api:product:methods');

export const create = async (schema, params, context) => {
  // const { token: { sessionToken } } = context;
  // const result = await AV.Cloud.rpc('createProduct', { type: schema.type, ...params }, { sessionToken });
  // return {
  //   ...result,
  //   results: result.results.map((product) => converter(schema, product)),
  // };
  const { token: { sessionToken }, profile } = context;
  const { table, attributes } = schema;
  const product = new schema.Class();
  try {
    const attrs = attributes.owner ? { ...params, owner: profile } : { ...params };
    _map(attrs, (value, key) => {
      if (!_isUndefined(value)) {
        const attrSchema = attributes[key];
        if (!attrSchema || !attrSchema.create) {
          throw new Error(`Unsupported attr(${key}) in ${table} creating`);
        }
        attrSchema.create(product, value);
      }
    });
    product.set('keywords', generateKeywords(schema.type, params));
    const savedProduct = await product.save(null, {
      fetchWhenSave: true,
      sessionToken,
    });
    return { ...savedProduct.toJSON(), ...attrs };
  } catch (err) {
    debug(err);
    throw err;
  }
};

export const update = async (schema, { ...params }, context) => {
  const { token: { sessionToken } } = context;
  const { table, attributes } = schema;
  const { product, ...attrs } = params;
  if (!product || !product.objectId) {
    throw new Error('objectId is empty');
  }
  const toSave = AV.Object.createWithoutData(table, product.objectId);
  try {
    _map(attrs, (value, key) => {
      if (!_isUndefined(value)) {
        const attrSchema = attributes[key];
        if (!attrSchema || !attrSchema.update) {
          throw new Error(`Unsupported attr(${key}) in ${table} updating`);
        }
        attrSchema.update(toSave, value);
      }
    });
    toSave.set('keywords', generateKeywords(schema.type, params));
    const savedProduct = await toSave.save(null, {
      fetchWhenSave: true,
      sessionToken,
    });
    return { ...product, ...savedProduct.toJSON(), ...attrs };
  } catch (err) {
    debug(err);
    throw err;
  }
};

export const fetch = async (schema, { objectId }, context) => {
  const { table, attributes } = schema;
  const { token: { sessionToken } } = context;
  const product = await AV.Object.createWithoutData(table, objectId)
    .fetch({
      include: _union(..._map(attributes, (attr) => attr.include)),
    }, {
      sessionToken,
    });
  return converter(schema, product);
};

const createQuery = (schema, { sort, page, pageSize, ...params }) => {
  const { table, attributes } = schema;
  const query = new AV.Query(table)
    .include(_union(..._map(attributes, (attr) => attr.include)));
  _map(params, (value, key) => {
    if (!_isUndefined(value)) {
      const attrSchema = attributes[key];
      if (!attrSchema || !attrSchema.search) {
        throw new Error(`Unsupported attr(${key}) in ${table} searching`);
      }
      attrSchema.search(query, value);
    }
  });
  if (sort && sort.sort) {
    if (sort.order === 'asc') {
      query.addAscending(sort.sort);
    } else {
      query.addDescending(sort.sort);
    }
  }
  if (page && pageSize) {
    query
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }
  return query;
};

export const search = async (schema, params, context) => {
  const { token: { sessionToken } } = context;
  const query = createQuery(schema, params);
  const products = await query.find({ sessionToken });
  return products.map((product) => converter(schema, product));
};

export const page = async (schema, params, context) => {
  const { token: { sessionToken } } = context;
  const result = await AV.Cloud.rpc('pageProducts', { type: schema.type, ...params }, { sessionToken });
  return {
    ...result,
    results: result.results.map((product) => converter(schema, product)),
  };
};

export const recommend = async (schema, params, context) => {
  const { token: { sessionToken } } = context;
  const query = createQuery(schema, params);
  const products = await query.find({ sessionToken });
  return products.map((product) => converter(schema, product));
};

export const count = async (schema, params, context) => {
  const { token: { sessionToken } } = context;
  const query = createQuery(schema, params);
  return await query.count({ sessionToken });
};

export default (type, context) => {
  const schema = shemas[type];
  return ({
    create: (params) => create(schema, params, context),
    update: (params) => update(schema, params, context),
    fetch: (params) => fetch(schema, params, context),
    search: (params) => search(schema, params, context),
    page: (params) => page(schema, params, context),
    recommend: (params) => recommend(schema, params, context),
    count: (params) => count(schema, params, context),
  });
};

