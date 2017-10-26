const { forEachField } = require('graphql-tools');
const { getArgumentValues } = require('graphql/execution/values');
const { AuthorizationError } = require('./../errors');
const jwt = require('jsonwebtoken');

const directiveResolvers = {
  isAuthenticated(result, source, args, context) {
    const token = context.headers.authorization;
    if (!token) {
      throw new AuthorizationError({
        message: 'You must supply a JWT for authorization!'
      });
    }
    try {
      const decoded = jwt.verify(
        token.replace('Bearer ', ''),
        process.env.JWT_SECRET
      );
      return result;
    } catch (err) {
      throw new AuthorizationError({
        message: 'You are not authorized.'
      });
    }
  },
  hasScope(result, source, args, context) {
    const token = context.headers.authorization;
    const expectedScopes = args.scope;
    if (!token) {
      throw new AuthorizationError({
        message: 'You must supply a JWT for authorization!'
      });
    }
    try {
      const decoded = jwt.verify(
        token.replace('Bearer ', ''),
        process.env.JWT_SECRET
      );
      const scopes = decoded.scope.split(' ');
      if (expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
        return result;
      }
    } catch (err) {
      return Promise.reject(
        new AuthorizationError({
          message: `You are not authorized. Expected scopes: ${expectedScopes.join(
            ', '
          )}`
        })
      );
    }
  }
};

// Credit: agonbina https://github.com/apollographql/graphql-tools/issues/212
const attachDirectives = schema => {
  forEachField(schema, field => {
    const directives = field.astNode.directives;
    directives.forEach(directive => {
      const directiveName = directive.name.value;
      const resolver = directiveResolvers[directiveName];

      if (resolver) {
        const oldResolve = field.resolve;
        const Directive = schema.getDirective(directiveName);
        const args = getArgumentValues(Directive, directive);

        field.resolve = function() {
          const [source, _, context, info] = arguments;
          let promise = oldResolve.call(field, ...arguments);

          const isPrimitive = !(promise instanceof Promise);
          if (isPrimitive) {
            promise = Promise.resolve(promise);
          }

          return promise.then(result =>
            resolver(result, source, args, context, info)
          );
        };
      }
    });
  });
};

module.exports = { directiveResolvers, attachDirectives };
