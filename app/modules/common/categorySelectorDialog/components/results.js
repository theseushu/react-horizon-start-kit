import React, { PropTypes } from 'react';
import Button from 'react-mdl/lib/Button';
import injectSheet from 'react-jss';
import Liner from '../../svgs/liner';

function renderButton(result, i, onClick) {
  return <Button key={i} onClick={() => (e) => { e.preventDefault(); onClick(result); }}>{result.name}</Button>;
}

function renderButtonWithActiveCheck(result, i, isButtonActive, onClick) {
  const active = isButtonActive(result);
  return (
    <Button
      key={i}
      colored={active}
      onClick={(e) => { e.preventDefault(); onClick(result); }}
    >{result.name}</Button>
  );
}

const Results = ({ pending, fulfilled, rejected, error, results, onClick, isButtonActive, sheet: { classes } }) => {
  if (pending) {
    return <Liner />;
  } else if (rejected) {
    return (
      <div className="text-center">
        <span className="text-danger">读取列表失败, 请重试{error && error.toString()}</span>
      </div>
    );
  } else if (fulfilled) {
    return (
      <div className={classes.results}>
        {
          isButtonActive ? results.map((result, i) => renderButtonWithActiveCheck(result, i, isButtonActive, onClick))
            : results.map((result, i) => renderButton(result, i, onClick))
        }
      </div>
    );
  }
  return null;
};

Results.propTypes = {
  sheet: PropTypes.object,
  pending: PropTypes.bool,
  fulfilled: PropTypes.bool,
  rejected: PropTypes.bool,
  error: PropTypes.object,
  results: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    objectId: PropTypes.string.isRequired,
  })),
  onClick: PropTypes.func,
  isButtonActive: PropTypes.func,
};

export default injectSheet({
  results: {
    display: 'flex',
    flexWrap: 'wrap',
  },
})(Results);