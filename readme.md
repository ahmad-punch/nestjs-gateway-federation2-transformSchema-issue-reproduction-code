# NestJS Gateway Federation 2 - `transformSchema` Issue Reproduction

## Overview

This repository demonstrates an issue with the NestJS GraphQL module when using Apollo Federation 2. Specifically, the `transformSchema` function is never invoked, and custom directives applied in subgraphs are not detected by the gateway. The issue is highlighted with an example of trying to apply a `@public` directive to a subgraph, which should inform the gateway to bypass JWT authentication for certain queries.

## Repository Structure

The repository contains two main folders:

1. **gateway**: Contains the NestJS gateway service that attempts to use Apollo Federation 2 with schema transformation.
2. **platform-service**: Contains a subgraph service that defines a custom `@public` directive to mark certain queries as public.

## Prerequisites

- Node.js (version 14.x or above)
- npm or yarn

## Getting Started

### Cloning the Repository

    git clone https://github.com/ahmad-punch/nestjs-gateway-federation2-transformSchema-issue-reproduction-code.git

### Setting Up the Subgraph Service

1.  Navigate to the platform-service folder:

    ```
    cd nestjs-gateway-federation2-transformSchema-issue-reproduction-code/platform-service

    ```

2.  Install the dependencies:

        npm install

3.  Start the service:

        `npm run dev


### Setting Up the Gateway

1.  Navigate to the gateway folder:

        cd ../gateway

2.  Install the dependencies:

        npm install

3.  Start the gateway service:
    npm run dev

## Usage

### Testing the Issue

1.  Once both services are running, open the GraphQL Playground for the gateway.

2.  Run the following query:

        query {
        findAllTest {
            exampleField
                    }
        }

3.  Observe the logs in the gateway console. You should see that the transformSchema function is not being called, and the @public directive is not detected.

### Expected Behavior

- The transformSchema function should be invoked, and logs should be visible to confirm that the schema is being transformed.
- The gateway should correctly handle custom directives from the subgraph, such as the @public directive, and act accordingly.

### Issue Details

### Problem

The main goal is to apply a directive (e.g., @public) in the subgraph that instructs the gateway to leave certain queries public. The gateway is supposed to skip JWT authentication for these public queries. However, the transformSchema function is not being called, and arbitrary keys can be added to the gateway configuration without causing any errors.

### SDL Verification

The SDL of the subgraph correctly shows the @public directive. However, when querying the gateway, it does not detect the directive and fails to apply the required logic.

### Screen shots

Take a look at the folder /screenshots and in there you will find basic screenshots

### Technical Information

NestJS Version: 10.0.0
@nestjs/graphql Version: 12.2.0
@apollo/gateway Version: 2.8.1
Node.js Version: 14.17.6

### Contributing

If you encounter any issues or have suggestions for improving this repository, feel free to open an issue or submit a pull request.

### License

This repository is licensed under the MIT License. See the LICENSE file for more information.

    This `README.md` provides a detailed overview of your repository, including setup instructions, usage guidelines, and issue descriptions. You can adjust the content as needed to fit your specific requirements.
