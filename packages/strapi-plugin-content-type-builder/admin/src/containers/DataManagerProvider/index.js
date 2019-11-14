import React, { memo, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { request, LoadingIndicatorPage } from 'strapi-helper-plugin';
import { useRouteMatch } from 'react-router-dom';
import DataManagerContext from '../../contexts/DataManagerContext';
import pluginId from '../../pluginId';
import FormModal from '../FormModal';
import init from './init';
import reducer, { initialState } from './reducer';
import createDataObject from './utils/createDataObject';

const DataManagerProvider = ({ children }) => {
  const [reducerState, dispatch] = useReducer(reducer, initialState, init);
  const {
    components,
    contentTypes,
    isLoading,
    initialData,
    modifiedData,
    newSchema,
  } = reducerState.toJS();

  const contentTypeMatch = useRouteMatch(
    `/plugins/${pluginId}/content-types/:uid`
  );
  const componentMatch = useRouteMatch(
    `/plugins/${pluginId}/component-categories/:categoryUid/:componentUid`
  );
  const isInContentTypeView = contentTypeMatch !== null;
  const currentUid = isInContentTypeView
    ? contentTypeMatch.params.uid
    : componentMatch.params.componentUid;
  const abortController = new AbortController();
  const { signal } = abortController;
  const getDataRef = useRef();

  getDataRef.current = async () => {
    const [
      { data: componentsArray },
      { data: contentTypesArray },
    ] = await Promise.all(
      ['components', 'content-types'].map(endPoint => {
        return request(`/${pluginId}/${endPoint}`, {
          method: 'GET',
          signal,
        });
      })
    );
    const components = createDataObject(componentsArray);
    const contentTypes = createDataObject(contentTypesArray);

    dispatch({
      type: 'GET_DATA_SUCCEEDED',
      components,
      contentTypes,
    });
  };

  useEffect(() => {
    getDataRef.current();
  }, []);

  const createSchema = (data, schemaType, uid) => {
    dispatch({
      type: 'CREATE_SCHEMA',
      data,
      schemaType,
      uid,
    });
  };

  const setModifiedData = () => {
    const currentSchemas = isInContentTypeView ? contentTypes : components;
    const schemaToSet = get(currentSchemas, currentUid, {});

    dispatch({
      type: 'SET_MODIFIED_DATA',
      schemaToSet,
    });
  };

  console.log({ contentTypes, components });

  return (
    <DataManagerContext.Provider
      value={{
        components,
        contentTypes,
        createSchema,
        initialData,
        modifiedData,
        newSchema,
        setModifiedData,
      }}
    >
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <>
          {children}
          <FormModal />
        </>
      )}
    </DataManagerContext.Provider>
  );
};

DataManagerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(DataManagerProvider);