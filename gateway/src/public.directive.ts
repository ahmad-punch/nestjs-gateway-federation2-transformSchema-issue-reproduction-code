import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

export function publicDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string,
) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      console.log(
        'publicDirectiveTransformer -> Always checking fields',
        fieldConfig,
      );
      const publicDirective = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0];

      console.log(
        'publicDirectiveTransformer -> Checking for publicDirective',
        publicDirective,
      );

      if (publicDirective) {
        console.log('publicDirectiveTransformer -> Public Directive found');

        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source, args, context, info) {
          console.log(
            `Directive '${directiveName}' detected on field: ${info.fieldName}`,
          );

          context.isPublic = true; // Set a flag in the context for public queries
          return resolve(source, args, context, info);
        };
      } else {
        console.log(`Directive '${directiveName}' NOT detected on field.`);
      }
      return fieldConfig;
    },
  });
}
