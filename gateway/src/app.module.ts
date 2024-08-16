import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import {
  parse,
  OperationDefinitionNode,
  GraphQLDirective,
  DirectiveLocation,
  printSchema,
} from 'graphql';
import { publicDirectiveTransformer } from './public.directive';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        debug: true,
        gateway: {
          autoSchemaFile: {
            federation: {
              version: 2,

              directives: { name: 'public', as: 'public' },
            },
          },
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              // {
              //   name: 'auth',
              //   url: configService.getOrThrow<string>('AUTH_SERVICE_URL'),
              // },
              // {
              //   name: 'baas',
              //   url: configService.getOrThrow<string>('BAAS_SERVICE_URL'),
              // },
              {
                name: 'platform',
                url: configService.getOrThrow<string>('PLATFORM_SERVICE_URL'),
              },
            ],
          }),
          // buildService({ url }) {
          //   console.log('buildService is being called');

          //   return new RemoteGraphQLDataSource({ url });
          // },
          // transformSchema: (schema) => {
          //   console.log('transformSchema is being called');
          //   return schema;
          // },
          buildService({ url }) {
            const service = new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }) {
                // console.log('Request context:', context);

                if (!context.isPublic) {
                  console.log('Will send Request : Context is Not Public');

                  // Perform your JWT validation here if it's not a public query
                  // const token = context.req.headers.authorization;
                  // // Add your JWT validation logic here
                  // if (!token) {
                  //   throw new Error('Unauthorized');
                  // }
                } else {
                  console.log('Will send Request : Context is Public');
                }
                // Pass the user context or any other needed headers to the subgraph services
                request.http.headers.set(
                  'user',
                  context.user ? JSON.stringify(context.user) : null,
                );
              },
            });

            service.didReceiveResponse = async (requestContext) => {
              const response = requestContext.response;

              if (response.errors) {
                console.error('Micro Service Error :', response.errors);
              }
              return response;
            };

            return service;
          },
          context: ({ req }) => ({ req }),
          buildschema: (schema) => {
            console.log('Composed Supergraph Schema:', printSchema(schema));
          },
          transformSchema: (schema) => {
            console.log('Composed Supergraph Schema:', printSchema(schema));

            try {
              console.log(
                'app-module: trying to apply publicDirectiveTransformer',
              );
              return publicDirectiveTransformer(schema, 'public');
            } catch (error) {
              console.error('Error transforming schema:', error);
              throw error;
            }

            return schema;
          },
          autoschemaFile: true,
          abc: true,
        },
      }),
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
