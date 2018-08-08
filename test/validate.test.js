'use strict';

const chai = require('chai');

const expect = chai.expect;

const Joi = require('joi');
const validate = require('../index').validate;

describe('TESTING: validate', () => {
  it('it validates a schema and returns a joi error if it fails', async () => {
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
      result = await validate(data, schema);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result)
      .to.have.property('isJoi')
      .equal(true);
    expect(result)
      .to.have.property('name')
      .equal('ValidationError');
    expect(result)
      .to.have.property('_object')
      .be.an('object')
      .and.equal(data);
    expect(result)
      .to.have.property('details')
      .be.an('array');

    expect(result)
      .to.have.nested.property('details[0].message')
      .be.a('string');
    expect(result)
      .to.have.nested.property('details[0].path')
      .be.an('array')
      .and.have.lengthOf(1);
    expect(result)
      .to.have.nested.property('details[0].path[0]')
      .be.a('string')
      .and.equal('keyOne');
    expect(result)
      .to.have.nested.property('details[0].type')
      .equal('string.max');
    expect(result)
      .to.have.nested.property('details[0].context')
      .be.an('object');
    expect(result)
      .to.have.nested.property('details[0].context.limit')
      .equal(5);
    expect(result)
      .to.have.nested.property('details[0].context.value')
      .equal('123456');
    expect(result)
      .to.have.nested.property('details[0].context.key')
      .equal('keyOne');
    expect(result)
      .to.have.nested.property('details[0].context.label')
      .equal('keyOne');

    expect(result)
      .to.have.nested.property('details[1].message')
      .be.a('string');
    expect(result)
      .to.have.nested.property('details[1].path')
      .be.an('array')
      .and.have.lengthOf(1);
    expect(result)
      .to.have.nested.property('details[1].path[0]')
      .be.a('string')
      .and.equal('keyTwo');
    expect(result)
      .to.have.nested.property('details[1].type')
      .equal('string.email');
    expect(result)
      .to.have.nested.property('details[1].context')
      .be.an('object');
    expect(result)
      .to.have.nested.property('details[1].context.value')
      .equal('notanemail');
    expect(result)
      .to.have.nested.property('details[1].context.key')
      .equal('keyTwo');
    expect(result)
      .to.have.nested.property('details[1].context.label')
      .equal('keyTwo');

    expect(result)
      .to.have.nested.property('details[2].message')
      .be.a('string');
    expect(result)
      .to.have.nested.property('details[2].path')
      .be.an('array')
      .and.have.lengthOf(1);
    expect(result)
      .to.have.nested.property('details[2].path[0]')
      .be.a('string')
      .and.equal('keyThree');
    expect(result)
      .to.have.nested.property('details[2].type')
      .equal('number.base');
    expect(result)
      .to.have.nested.property('details[2].context')
      .be.an('object');
    expect(result)
      .to.have.nested.property('details[2].context.key')
      .equal('keyThree');
    expect(result)
      .to.have.nested.property('details[2].context.label')
      .equal('keyThree');
  });

  it('it validates a schema and returns the object if it succeeds', async () => {
    const schema = Joi.object().keys({
      keyOne: Joi.string().max(5),
      keyTwo: Joi.string().email(),
      keyThree: Joi.number(),
    });
    const data = {
      keyOne: '12345',
      keyTwo: 'anemail@example.com',
      keyThree: 123,
    };

    let result = null;

    try {
      result = await validate(data, schema);
    } catch (error) {
      result = error;
    }

    expect(result)
      .to.be.an('object')
      .and.deep.equal(data);
  });
});
