import React from 'react';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import success from 'modules/toastr/success';


export default (FORM_NAME, actions, FormComponent) => {
  const { create, update } = actions;
  return reduxForm({
    form: FORM_NAME,  // a unique identifier for this form
    onSubmit: ({ objectId, status, createdAt, minPrice, owner, shop, thumbnail, updatedAt, ...params }, dispatch, { initialValues }) => (
      initialValues.objectId ?
        new Promise((resolve, reject) => {
          dispatch(update({
            product: initialValues,
            ...params,
            meta: {
              resolve: (product) => {
                const image = params.images[0].thumbnail_80_80;
                success({
                  icon: <img role="presentation" width="70" height="70" src={image} />,
                  title: '保存完毕',
                  message: product.name,
                  onHideComplete: () => {
                  },
                });
                resolve();
              },
              reject,
            },
          }));
        }) :
        new Promise((resolve, reject) => {
          dispatch(create({
            ...params,
            meta: {
              resolve: (product) => {
                const image = params.images[0].thumbnail_80_80;
                success({
                  icon: <img role="presentation" width="70" height="70" src={image} />,
                  title: '创建成功',
                  message: product.name,
                  onHideComplete: () => {
                    dispatch(push('/me/products'));
                  },
                });
                resolve();
              },
              reject,
            },
          }));
        })
    ),
  })(FormComponent);
};