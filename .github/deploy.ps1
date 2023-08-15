Param(
  [String]$deploymentName = 'deploy',

  [Parameter(Mandatory = $true)]
  [String]$resourceGroup,

  [Parameter(Mandatory = $false)]
  [Switch]$deploy = $false,

  [Parameter(Mandatory = $false)]
  [String]$sqlAdministratorLoginPassword
)

# NOTE: You must have logged in via 'az login' before running this deployment

Write-Host "Creating Parameters"
$parameters = New-Object PSObject -Property @{
  '$schema'      = 'https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#'
  contentVersion = "1.0.0.0"
  parameters     = @{
    sqlAdministratorLoginPassword   = @{ value = $sqlAdministratorLoginPassword }
  }
}

if (Test-Path ./azuredeploy.parameters.json) 
{
  Remove-Item ./azuredeploy.parameters.json
}

$parameters | ConvertTo-Json -Depth 100 | Out-File ./azuredeploy.parameters.json

Write-Host "Running What-If on bicep"
az deployment group what-if `
  --template-file .\bicep\azuredeploy.bicep `
  -g $resourceGroup `
  --parameters '@azuredeploy.parameters.json'

if ($deploy -eq $true) {
  Write-Host "Deploying bicep"
  $output = (az deployment group create `
    --template-file .\bicep\azuredeploy.bicep `
    -g $resourceGroup `
    --name "$($deploymentName)" `
    --mode Incremental `
    --parameters '@azuredeploy.parameters.json') |
  ConvertFrom-Json

  $output.properties.outputs.functionAppSettings.value.PSObject.Properties | ForEach-Object {
    Write-Host "##vso[task.setvariable variable=functionApp$($_.Name);isOutput=true]$($_.Value)"
  }

  if (!$?) {
    Write-Host "Deploying Bicep failed... aborting!"
    exit 1
  }
}

Write-Host "Done"
