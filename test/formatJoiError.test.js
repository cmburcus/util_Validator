'use strict';

const chai = require('chai');

const expect = chai.expect;

const Joi = require('joi');
const validationOptions = require('../config/joi.json');
const formatJoiError = require('../index').formatJoiError;

describe('TESTING: formatJoiError', () => {
  it('it formats a Joi error', async () => {
    const schema = Joi.object().keys({
      keyOne: Joi.string().max(5),
      keyTwo: Joi.string().email(),
      keyThree: Joi.number(),
    });
    const data = {
      keyOne: '123456',
      keyTwo: 'notanemail',
      keyThree: null,
    };

    let result = null;

    try {
      result = await Joi.validate(data, schema, validationOptions);
    } catch (error) {
      result = formatJoiError(error);
    }

    expect(result).to.be.an('object');
    expect(result)
      .to.have.property('status')
      .equal('failed');
    expect(result)
      .to.have.property('original')
      .equal(data);
    expect(result)
      .to.have.property('errors')
      .be.an('object');
    expect(result)
      .to.have.nested.property('errors.keyOne')
      .be.an('array')
      .and.have.lengthOf(1);
    expect(result)
      .to.have.nested.property('errors.keyOne[0].type')
      .be.a('string')
      .and.equal('string.max');
    expect(result)
      .to.have.nested.property('errors.keyOne[0].message')
      .be.a('string');
    expect(result)
      .to.have.nested.property('errors.keyTwo')
      .be.an('array')
      .and.have.lengthOf(1);
    expect(result)
      .to.have.nested.property('errors.keyTwo[0].type')
      .be.a('string')
      .and.equal('string.email');
    expect(result)
      .to.have.nested.property('errors.keyTwo[0].message')
      .be.a('string');
    expect(result)
      .to.have.nested.property('errors.keyThree')
      .be.an('array')
      .and.have.lengthOf(1);
    expect(result)
      .to.have.nested.property('errors.keyThree[0].type')
      .be.a('string')
      .and.equal('number.base');
    expect(result)
      .to.have.nested.property('errors.keyThree[0].message')
      .be.a('string');
  });
});
