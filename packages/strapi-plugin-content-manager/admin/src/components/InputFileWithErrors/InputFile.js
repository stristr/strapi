import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { InputFile as Input } from 'strapi-helper-plugin';

function InputFile({
  onBlur,
  onChange,
  multiple,
  error,
  dispatch,
  name,
  value,
  setLabel,
  accept,
}) {
  useEffect(() => {
    dispatch({
      type: 'SET_CHECK',
    });
  }, [dispatch]);

  return (
    <Input
      accept={accept}
      multiple={multiple}
      error={error}
      name={name}
      onChange={e => {
        dispatch({
          type: 'SET_ERROR',
          error: null,
        });
        onChange(e);
        onBlur(e);
      }}
      setLabel={setLabel}
      value={value}
    />
  );
}

InputFile.defaultProps = {
  accept: null,
  dispatch: () => {},
  error: false,
  multiple: false,
  onBlur: () => {},
  setLabel: () => {},
  value: [],
};

InputFile.propTypes = {
  accept: PropTypes.string,
  dispatch: PropTypes.func,
  error: PropTypes.bool,
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  setLabel: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default memo(InputFile);
