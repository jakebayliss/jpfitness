Remove-Item .\azuredeploy.parameters.json -Force  -ErrorAction Ignore
Remove-Item .\bicep\*.json -Force  -ErrorAction Ignore
Remove-Item .\arm-Ttk -Force -Recurse  -ErrorAction Ignore
Remove-Item .\arm-Ttk.zip -Force  -ErrorAction Ignore
