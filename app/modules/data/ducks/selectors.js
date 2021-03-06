import { createSelector } from 'reselect';
import _find from 'lodash/find';
import { denormalize } from 'denormalizr';
import { publishTypesInfo } from 'funong-common/lib/appConstants';

import { SpeciesArraySchema, CertsSchema, ProductSchemas, ShopProductsSchema,
  LogisticsProductsSchema, TripProductsSchema, CartItemsSchema,
  ShopsSchema, CommentsSchema, OrdersSchema, InquiriesSchema, BidsSchema, PublishesSchemas } from './schemas';

const rootSelector = (state) => state.data;

export const currentUserSelector = createSelector(
  rootSelector,
  (data) => {
    const { entities: { users = {} }, currentUser = '' } = data;
    const user = users && users[currentUser];
    return user;
  }
);

export const usersSelector = createSelector(
  rootSelector,
  (data) => {
    const { entities: { users = {} } } = data;
    return Object.values(users);
  }
);

export const superUsersSelector = createSelector(
  rootSelector,
  (data) => {
    const { entities: { users = {} } } = data;
    return Object.values(users).filter((user) => user.roles.indexOf('super') >= 0);
  }
);

export const adminUsersSelector = createSelector(
  rootSelector,
  (data) => {
    const { entities: { users = {} } } = data;
    return Object.values(users).filter((user) => user.roles.indexOf('admin') >= 0);
  }
);

export const categoriesSelector = createSelector(
  rootSelector,
  (data) => data.entities.categories ? Object.values(data.entities.categories) : [],
);

export const speciesSelector = createSelector(
  rootSelector,
  (data) => {
    const { species } = data.entities;
    if (!species) {
      return [];
    }
    return Object.values(denormalize(species, data.entities, SpeciesArraySchema));
  }
);

export const createProductsSelector = (type) => createSelector(
  rootSelector,
  (data) => {
    const { entities } = data;
    if (!entities) {
      return [];
    }
    const products = entities[`${type}Products`];
    if (!products) {
      return [];
    }
    const schema = ProductSchemas[type].array;
    return Object.values(denormalize(products, data.entities, schema));
  },
);

export const createProductSelector = (type, objectId) => createSelector(
  createProductsSelector(type),
  (products) => _find(products, (p) => p.objectId === objectId),
);

export const createUserProductsSelector = (type, userId) => createSelector(
  createProductsSelector(type),
  (products) => {
    if (!products) {
      return [];
    }
    const result = products.filter((p) => p.owner.objectId === userId);
    return result;
  },
);

export const shopProductsSelector = createSelector(
  rootSelector,
  (data) => {
    const { entities: { shopProducts } } = data;
    if (!shopProducts) {
      return [];
    }
    const result = Object.values(denormalize(shopProducts, data.entities, ShopProductsSchema));
    return result;
  },
);

export const createShopProductSelector = (objectId) => createSelector(
  shopProductsSelector,
  (products) => _find(products, (p) => p.objectId === objectId),
);

export const createShopProductsSelector = (objectId) => createSelector(
  shopProductsSelector,
  (products) => {
    if (!products) {
      return [];
    }
    const result = products.filter((p) => p.shop.objectId === objectId);
    return result;
  },
);

export const logisticsProductsSelector = createSelector(
  rootSelector,
  (data) => {
    const { entities: { logisticsProducts } } = data;
    if (!logisticsProducts) {
      return [];
    }
    const result = Object.values(denormalize(logisticsProducts, data.entities, LogisticsProductsSchema));
    return result;
  },
);
export const createLogisticsProductSelector = (objectId) => createSelector(
  logisticsProductsSelector,
  (products) => _find(products, (p) => p.objectId === objectId),
);

export const userLogisticsProductsSelector = (objectId) => createSelector(
  logisticsProductsSelector,
  (products) => {
    if (!products) {
      return [];
    }
    const result = products.filter((p) => p.owner.objectId === objectId);
    return result;
  },
);

export const tripProductsSelector = createSelector(
  rootSelector,
  (data) => {
    const { entities: { tripProducts } } = data;
    if (!tripProducts) {
      return [];
    }
    const result = Object.values(denormalize(tripProducts, data.entities, TripProductsSchema));
    return result;
  },
);
export const createTripProductSelector = (objectId) => createSelector(
  tripProductsSelector,
  (products) => _find(products, (p) => p.objectId === objectId),
);

export const userTripProductsSelector = (objectId) => createSelector(
  tripProductsSelector,
  (products) => {
    if (!products) {
      return [];
    }
    const result = products.filter((p) => p.owner.objectId === objectId);
    return result;
  },
);

export const certsSelector = createSelector(
  rootSelector,
  (data) => {
    const { certs } = data.entities;
    if (!data.entities.certs || Object.values(data.entities.certs) === 0) {
      return [];
    }
    const result = denormalize(Object.values(certs), data.entities, CertsSchema);
    return result;
  },
);

export const cartItemsSelector = createSelector(
  rootSelector,
  currentUserSelector,
  (data, currentUser) => {
    if (currentUser) {
      const { cartItems } = data.entities;
      if (!cartItems || Object.values(cartItems) === 0) {
        return [];
      }
      return denormalize(Object.values(cartItems), data.entities, CartItemsSchema);
    }
    return [];
  },
);

export const shopsSelector = createSelector(
  rootSelector,
  (data) => {
    const { shops } = data.entities;
    if (!shops || Object.values(shops) === 0) {
      return [];
    }
    const result = denormalize(Object.values(shops), data.entities, ShopsSchema);
    return result;
  },
);

export const myShopSelector = createSelector(
  shopsSelector,
  currentUserSelector,
  (shops, currentUser) => _find(shops, (shop) => shop.owner.objectId === currentUser.objectId),
);

export const commentsSelector = createSelector(
  rootSelector,
  (data) => {
    const { comments } = data.entities;
    if (!comments || Object.values(comments) === 0) {
      return [];
    }
    return denormalize(Object.values(comments), data.entities, CommentsSchema);
  },
);

export const ordersSelector = createSelector(
  rootSelector,
  (data) => {
    const { orders } = data.entities;
    if (!orders || Object.values(orders) === 0) {
      return [];
    }
    return denormalize(Object.values(orders), data.entities, OrdersSchema);
  },
);

export const inquiriesSelector = createSelector(
  rootSelector,
  (data) => {
    const { inquiries } = data.entities;
    if (!inquiries || Object.values(inquiries) === 0) {
      return [];
    }
    return denormalize(Object.values(inquiries), data.entities, InquiriesSchema);
  },
);

export const createUserInquiriesSelector = (userId) => createSelector(
  inquiriesSelector,
  (inquiries) => {
    if (!inquiries) {
      return [];
    }
    const result = inquiries.filter((p) => p.owner.objectId === userId);
    return result;
  },
);


export const bidsSelector = createSelector(
  rootSelector,
  (data) => {
    const { bids } = data.entities;
    if (!bids || Object.values(bids) === 0) {
      return [];
    }
    return denormalize(Object.values(bids), data.entities, BidsSchema);
  },
);

export const createUserBidsSelector = (userId) => createSelector(
  bidsSelector,
  (bids) => {
    if (!bids) {
      return [];
    }
    const result = bids.filter((p) => p.owner.objectId === userId);
    return result;
  },
);

export const createPublishesSelector = (type) => createSelector(
  rootSelector,
  (data) => {
    const { entities } = data;
    if (!entities) {
      return [];
    }
    const publishes = entities[publishTypesInfo[type].plural];
    if (!publishes) {
      return [];
    }
    const schema = PublishesSchemas[type];
    return Object.values(denormalize(publishes, data.entities, schema));
  },
);

export const createPublishSelector = (type, objectId) => createSelector(
  createPublishesSelector(type),
  (publishes) => _find(publishes, (p) => p.objectId === objectId),
);
