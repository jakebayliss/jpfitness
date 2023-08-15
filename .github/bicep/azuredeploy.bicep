// project name
@minLength(3)
@maxLength(21)
@description('Name of this project')
param projectName string = 'jpfit'

@description('Location for all resources.')
param location string = resourceGroup().location

@description('The admin user of the SQL Server')
param sqlAdministratorLogin string = projectName

@description('The password of the admin user of the SQL Server')
@secure()
param sqlAdministratorLoginPassword string

@description('Date timestamp of when this deployment was run - defaults to UtcNow()')
param lastDeploymentDate string = utcNow('yyMMddHHmmss')

var tags = {
  project: projectName
  lastDeploymentDate: lastDeploymentDate
}

module sql 'sql.bicep' = {
  name: 'sql-${lastDeploymentDate}'
  scope: resourceGroup()
  params: {
    location: location
    appName: projectName
    sqlAdministratorLogin: sqlAdministratorLogin
    sqlAdministratorLoginPassword: sqlAdministratorLoginPassword
  }
}

module storageAccount 'storage.bicep' = {
  name: 'storage${lastDeploymentDate}'
  scope: resourceGroup()
  params: {
    location: location
    tags: tags
  }
}

module functionapp 'functions.bicep' = {
  name: 'functions-${lastDeploymentDate}'
  scope: resourceGroup()
  params: {
    location: location
    storageAccountId: storageAccount.outputs.id
    storageAccountName: storageAccount.outputs.name
    storageAccountApiVersion: storageAccount.outputs.apiVersion
    tags: tags
  }
}
