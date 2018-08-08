'use strict';

const chai = require('chai');

const expect = chai.expect;

const getUniqueFieldError = require('../index').getUniqueFieldError;

describe('TESTING: getUniqueFieldError', () => {
  it('it formats a Joi error', (done) => {
    const data = { keyOne: 'test', keyTwo: 'test' };

    const result = getUniqueFieldError('keyOne', data);

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
      .and.equal('field.unique');
    expect(result)
      .to.have.nested.property('errors.keyOne[0].message')
      .be.a('string');

    done();
  });
});
