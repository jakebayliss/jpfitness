# Infrastructure as Code

Language used: Azure Bicep

- Watch Richard Burns giving a nice overview of Bicep: https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview
- Raise issues at https://github.com/Azure/bicep

## Environments

There are 3 typical environments:

- Dev
- Test
- Prod

## Resource grouping conventions

All the resources for an application/project should be provisioned PER ENVIRONMENT (Dev, Test, Prod) and grouped together in a single Resource Group. This supports Azure Administrators who need to understand resources dependencies and costing.

Access/Permissions can be controlled for an individual resource group.

### Example Resource Group contents

The following hierarchy describes the relationship from the top-level Tenant, down to individual resources contained in a resource group

- Tenant (DPM)
  - Subscription (DPM)
    - Resource Group (DEV, TEST, PROD)
      - Application Insights
      - AppService Plan
      - AzFunc (for backend API)
      - AppConfig
      - KeyVault
      - Storage (for Static Site)
      - CDN
