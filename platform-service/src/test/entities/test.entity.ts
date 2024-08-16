import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Test {
  @Field(() => String, { description: 'Example field (placeholder)' })
  exampleField: string;
}
