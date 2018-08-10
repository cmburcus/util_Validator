'use strict';

const Joi = require('joi');
const validationOptions = require('./config/joi.json');
const messages = require('./constants/messages.json');
const status = require('./constants/status.json');

module.exports = {
  /**
   * Returns a Joi validation
   */
  validate: (data, schema) => Joi.validate(data, schema, validationOptions),
  /**
   * Given a Joi error (produced after a failed validation), this function will return a
   * formatted object that is more user friendly
   *
   * Format: {
   *    status: failed'
   *    original: {
   *      key: value,
   *    },
   *    errors: {
   *      key: [
   *        {
   *          type: joi.error
   *          message: Human readable string
   *        }
   *      ]
   *    }
   * }
   */
  formatJoiError: (error) => {
    const formattedError = {
      status: status.failed_status,
      original: error._object,
      errors: {},
    };

    for (let index = 0; index < error.details.length; index++) {
      const errorDetail = error.details[index];

      /* istanbul ignore next */
      if (typeof formattedError.errors[errorDetail.path] === 'undefined') {
        formattedError.errors[errorDetail.path] = [];
      }

      formattedError.errors[errorDetail.path].push({
        type: errorDetail.type,
        message: errorDetail.message.replace(/['"]/g, ''),
      });
    }

    return formattedError;
  },

  /**
   * Given a name (such as an object key name or a path) and the original body, this function
   * will return an error message in the same format as the schema validator.
   *
   * The reason why such a function is required is because Joi doesn't allow for async validation
   * and database calls can only be done async.
   */
  getUniqueFieldError: (name, original) => ({
    status: status.failed_status,
    original: original,
    errors: {
      [name]: [
        {
          type: `field.unique`,
          message: `${name} ${messages.mustBeUnique}`,
        },
      ],
    },
  }),
};
