import _omitBy from 'lodash/omitBy';
import _isUndefined from 'lodash/isUndefined';
import fileToJSON from './file';
import imagesToJSON from './images';

export default (user) => {
  if (!user) {
    return null;
  }
  const { objectId, name, mobilePhoneNumber, desc, badges, addresses, roles } = user.toJSON();
  const avatar = fileToJSON(user.get('avatar'));
  const images = imagesToJSON(user.get('images'));
  const avCreatedAt = user.get('createdAt');
  const avUpdatedAt = user.get('updatedAt');
  const createdAt = avCreatedAt ? avCreatedAt.getTime() : undefined;
  const updatedAt = avUpdatedAt ? avUpdatedAt.getTime() : undefined;
  return _omitBy({ objectId, name, mobilePhoneNumber, desc, avatar, images, roles, addresses, badges, createdAt, updatedAt }, _isUndefined);
};
