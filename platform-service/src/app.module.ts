import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import {
  DateTimeResolver,
  GraphQLJSONObject,
  ObjectIDResolver,
} from 'graphql-scalars';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLError,
  GraphQLFormattedError,
} from 'graphql';

@Module({
  imports: [
    TestModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      context: ({ req }: any) => ({ req }),
      // formatError: (error: GraphQLError) => {
      //   const graphQLFormattedError: GraphQLFormattedError = {
      //     message: error?.extensions?.exception?.response?.message || error?.message,
      //   };
      //   return graphQLFormattedError;
      // },
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'public',
            locations: [DirectiveLocation.FIELD_DEFINITION],
            args: {},
          }),
        ],
      },
      typeDefs: `
    directive @public on FIELD_DEFINITION
  `,
      // resolvers: {
      //   JSONObject: GraphQLJSONObject,
      //   DateTime: DateTimeResolver,
      //   ObjectID: ObjectIDResolver,
      // },
      // typePaths: ['./**/*.graphql'],
      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.classes.ts'),
      //   // outputAs: "class" as const,
      // },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
