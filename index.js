'use strict';

const Joi = require('joi');
const validationOptions = require('./config/joi.json');
const errorUtil = require('error-util');

module.exports = {
  /**
   * Returns a Joi validation
   */
  validate: (data, schema) => Joi.validate(data, schema, validationOptions),

  /**
   * Validates a schema against the request body
   */
  validateSchema: (schema) => async (request, response, next) => {
    try {
      const result = await Joi.validate(request.body, schema, validationOptions);

      request.body = result;

      next();
    } catch (error) {
      if (error.isJoi) {
        error = errorUtil.getValidationError(module.exports.formatJoiError(error));
      }

      next(error);
    }
  },

  /**
   * Validates that a field in the body is unique. If excludeCurrentKey is true, then the
   * value of the key from the request.params will be passed to the unique check function
   */
  uniqueField: (field, uniqueCheckFunction, excludeCurrentKey) => async (
    request,
    response,
    next
  ) => {
    try {
      if (
        typeof field !== 'string' ||
        (excludeCurrentKey && typeof excludeCurrentKey !== 'string')
      ) {
        throw errorUtil.getInvalidArgumentError();
      }

      // Exclude undefined or null values as postgress doesn't consider them as unique
      if (typeof request.body[field] === 'undefined' || request.body[field] === null) {
        return next();
      }

      const keyValueList = [{ key: field, value: request.body[field] }];

      // If we need to exclude current, we need to add a key/value pair with a negative condition
      if (excludeCurrentKey) {
        keyValueList.push({
          key: excludeCurrentKey,
          value: request.params[excludeCurrentKey],
          condition: '!=',
        });
      }

      const result = await uniqueCheckFunction(keyValueList);

      if (result[0].count > 0) {
        throw errorUtil.getValidationError(module.exports.getUniqueFieldError(field, request.body));
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Given a Joi error (produced after a failed validation), this function will return a
   * formatted object that is more user friendly
   *
   * Format: {
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
      original: error._object,
      errors: {},
    };

    for (let index = 0; index < error.details.length; index++) {
      const errorDetail = error.details[index];

      // The following comment is required so that code coverage skips next line
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
    original: original,
    errors: {
      [name]: [
        {
          type: `field.unique`,
          message: `${name} must be unique`,
        },
      ],
    },
  }),
};
