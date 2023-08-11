using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
	.ConfigureFunctionsWorkerDefaults()
	.ConfigureFunctionsWorkerDefaults()
	.ConfigureServices((hostContext, services) =>
	{
		services.AddLogging();
		services.AddApplication();
		services.AddInfrastructure(hostContext.Configuration.GetConnectionString("DefaultConnection"));
	})
	.Build();

host.Run();
