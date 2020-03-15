import React from 'react';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import {Error, Label,} from '@buffetjs/core';
import {Description, ErrorMessage} from '@buffetjs/styles';
import {SketchPicker} from 'react-color';

import Wrapper from './Wrapper';

/* eslint-disable react/forbid-prop-types */

function ColorpickerWithErrors({
   description,
   error: inputError,
   id,
   label,
   name,
   onChange,
   type,
   validations,
   value,
 }) {
  const inputValue = value || '#000';
  const inputId = id || name;
  const descriptionId = `description-${inputId}`;
  const errorId = `error-${inputId}`;

  return (
    <Error
      inputError={inputError}
      name={name}
      type={type}
      validations={validations}
    >
      {({canCheck, error, dispatch}) => (
        <Wrapper error={error}>
          <Label htmlFor={inputId}>
            {label}
            {isEmpty(label) && <>&nbsp;</>}
          </Label>
          <input
            type="hidden"
            name={name}
            id={inputId}
            aria-describedby={`${!error && description ? descriptionId : ''} ${error ? errorId : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            onChange={e => {
              if (!canCheck) {
                dispatch({
                  type: 'SET_CHECK',
                });
              }

              dispatch({
                type: 'SET_ERROR',
                error: null,
              });
              onChange(e);
            }}
            value={inputValue}
          />
          {!error && description && (
            <Description id={descriptionId}>{description}</Description>
          )}
          {error && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
          <SketchPicker color={inputValue} onChangeComplete={color => {
            onChange({
              target: {
                name,
                value: color.hex,
              },
            });
          }}/>
        </Wrapper>
      )}
    </Error>
  );
}

ColorpickerWithErrors.defaultProps = {
  description: null,
  id: null,
  error: null,
  label: null,
  onChange: () => {
  },
  validations: {},
  value: null,
};

ColorpickerWithErrors.propTypes = {
  description: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: () => {
  },
  type: PropTypes.string.isRequired,
  validations: PropTypes.object,
  value: PropTypes.any,
};

export default ColorpickerWithErrors;
