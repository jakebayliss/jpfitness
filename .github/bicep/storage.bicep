param location string = resourceGroup().location
param tags object

var entropy = uniqueString('${subscription().id}${resourceGroup().id}')

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'jpfitstorage${take(entropy, 4)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  tags: tags
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}
output id string = storageAccount.id
output name string = storageAccount.name
output apiVersion string = storageAccount.apiVersion
