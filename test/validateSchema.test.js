'use strict';

const chai = require('chai');

const expect = chai.expect;

const Joi = require('joi');
const validateSchema = require('../index').validateSchema;

let mockRequest = {
  body: {},
};

describe('TESTING: validateSchema', () => {
  beforeEach(() => {
    mockRequest = {
      body: {},
    };
  });

  it('it calls the callback with no value if valid', async () => {
    const schema = Joi.object().keys({
      keyOne: Joi.string().max(5),
      keyTwo: Joi.string().email(),
      keyThree: Joi.number(),
    });

    mockRequest.body = {
      keyOne: '12345',
      keyTwo: 'anemail@example.com',
      keyThree: 123,
    };

    let result = null;

    try {
      await validateSchema(schema)(mockRequest, null, function(possibleError) {
        result = possibleError;
      });
    } catch (error) {
      result = null;
    }

    expect(result).to.be.undefined;
  });

  it('it calls the callback with an error if not valid', async () => {
    const schema = Joi.object().keys({
      keyOne: Joi.string().max(5),
      keyTwo: Joi.string().email(),
      keyThree: Joi.number(),
    });

    mockRequest.body = {
      keyOne: '123456',
      keyTwo: 'notanemail',
      keyThree: null,
    };

    let result = null;

    try {
      await validateSchema(schema)(mockRequest, null, function(possibleError) {
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

  it('it calls the callback with an error if system error occured', async () => {
    let result = null;

    try {
      await validateSchema(null)(null, null, function(possibleError) {
        result = possibleError;
      });
    } catch (error) {
      result = null;
    }

    expect(result).to.be.an('error');
    expect(result).to.not.have.property('type');
  });
});
