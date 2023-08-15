using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
	.ConfigureFunctionsWorkerDefaults()
	.ConfigureServices((hostContext, services) =>
	{
		services.AddLogging();
		services.AddApplication();
		services.AddInfrastructure(hostContext.Configuration);
	})
	.Build();

host.Run();
