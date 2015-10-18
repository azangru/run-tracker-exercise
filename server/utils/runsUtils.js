import R from 'ramda';


let permittedRunParameters = (params) => {
  let allowedProperties = ['distance', 'time', 'date'];
  let permittedParameters = R.pick(allowedProperties, params);
  return permittedParameters;
};

export default {permittedRunParameters};
