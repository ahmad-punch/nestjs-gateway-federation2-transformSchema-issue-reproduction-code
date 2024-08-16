import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { parse, OperationDefinitionNode } from 'graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const query = req.body.query;
    const operationName = req.body.operationName;

    const parsedQuery = parse(query);
    const operationDefinition = parsedQuery.definitions.find(
      (def) =>
        def.kind === 'OperationDefinition' && def.name?.value === operationName,
    ) as OperationDefinitionNode | undefined;

    const isPublic = operationDefinition?.directives?.some(
      (directive) => directive.name.value === 'public',
    );

    if (isPublic) {
      console.log('SuperGraph detects Public Directive');
      return true;
    }

    console.log(
      'SuperGraph did not find Public Directive - Performing JWT validation',
    );

    // Perform JWT validation
    const token = req.headers['authorization'];
    if (!token) {
      throw new Error('Unauthorized');
    }

    // Your JWT validation logic here
    // const user = validateToken(token);
    // if (!user) {
    //   throw new Error('Invalid token');
    // }

    // Attach the validated user to the context
    // req.user = user;

    return true;
  }
}
