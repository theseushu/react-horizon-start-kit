import React, { PropTypes } from 'react';
import _flatten from 'lodash/flatten';
import injectSheet from 'react-jss';
import { Buttons, CategorySpeciesNameCard, SpecsCard, ImagesCard, RichTextCard, LabelsCard, LocationCard } from 'modules/common/form';
import { labels, catalogGroups } from '../constants';

const Form = (props) => {
  const { handleSubmit, pristine, submitting, invalid, form, sheet: { classes } } = props;
  return (
    <form className={classes.form}>
      <CategorySpeciesNameCard form={form} catalogs={_flatten(catalogGroups)} />
      <SpecsCard />
      <LocationCard />
      <ImagesCard />
      <RichTextCard />
      <LabelsCard labels={Object.values(labels)} />
      <Buttons handleSubmit={handleSubmit} pristine={pristine} submitting={submitting} invalid={invalid} />
    </form>
  );
};

Form.propTypes = {
  form: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
  sheet: PropTypes.object.isRequired,
};

export default injectSheet({
  form: {
    width: '100%',
    maxWidth: 700,
    margin: 'auto',
  },
})(Form);
