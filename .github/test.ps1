$armTtk = ".\arm-Ttk"
$armTtkUrl = "https://aka.ms/arm-ttk-latest"

if ((Test-Path -Path $armTtk) -eq $false) {
  $zipFile = "arm-Ttk.zip"
  New-Item -ItemType Directory -Path $armTtk | Out-Null
  Invoke-WebRequest -Uri $armTtkUrl -Outfile $zipFile
  Expand-Archive -Path $zipFile -DestinationPath $armTtk
  Remove-Item -Path $zipFile
  if ($IsWindows) {
    Get-ChildItem "$armTtk\*.ps1", "$armTtk\*.psd1", "$armTtk\*.ps1xml", "$armTtk\*.psm1" -Recurse | Unblock-File
  }
}

Import-Module "$armTtk\arm-ttk\arm-ttk.psd1"

$results = Test-AzTemplate -TemplatePath .\bicep `
  -File azuredeploy.json `
  -Skip "Template Should Not Contain Blanks","Location Should Not Be Hardcoded","apiVersions Should Be Recent In Reference Functions","apiVersions Should Be Recent"

$results
$failures = ($results | Where-Object {$_.Passed -eq $false})
if ($failures.Length -gt 0) {
  exit 1
}
