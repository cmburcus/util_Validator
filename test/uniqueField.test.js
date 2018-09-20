'use strict';

const chai = require('chai');

const expect = chai.expect;

const uniqueField = require('../index').uniqueField;

function truthyCondition() {
  return [{ count: 0 }];
}
function falsyCondition() {
  return [{ count: 1 }];
}

const mockRequest = {
  body: { field: 1 },
  params: { id: 2 },
};

describe('TESTING: uniqueField', () => {
  it('it calls the callback with no value if valid and not excluding current', async () => {
    let result = null;

    try {
      await uniqueField('field', truthyCondition)(mockRequest, null, function(possibleError) {
        result = possibleError;
      });
    } catch (error) {
      result = null;
    }

    expect(result).to.be.undefined;
  });

  it('it calls the callback with no value if valid and excluding current', async () => {
    let result = null;

    try {
      await uniqueField('field', truthyCondition, 'id')(mockRequest, null, function(possibleError) {
        result = possibleError;
      });
    } catch (error) {
      result = null;
    }

    expect(result).to.be.undefined;
  });

  it('it calls the callback with an error if not valid', async () => {
    let result = null;

    try {
      await uniqueField('field', falsyCondition)(mockRequest, null, function(possibleError) {
        result = possibleError;
      });
    } catch (error) {
      result = null;
    }

    expect(result).to.be.an('error');
    expect(result)
      .to.have.property('type')
      .equal('ValidationError');
  });

  it('it throws an invalid argument error if field is not a string', async () => {
    let result = null;

    try {
      await uniqueField(123, truthyCondition)(mockRequest, null, function(possibleError) {
        result = possibleError;
      });
    } catch (error) {
      result = null;
    }

    expect(result).to.be.an('error');
    expect(result)
      .to.have.property('type')
      .equal('InvalidArgumentError');
  });

  it('it throws an invalid argument error if exclude current is not a string', async () => {
    let result = null;

    try {
      await uniqueField('field', truthyCondition, 123)(mockRequest, null, function(possibleError) {
        result = possibleError;
      });
    } catch (error) {
      result = null;
    }

    expect(result).to.be.an('error');
    expect(result)
      .to.have.property('type')
      .equal('InvalidArgumentError');
  });
});
