using System.Net;
using System.Text.Json;
using Domain.Entities;
using MediatR;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace FunctionApp
{
    public class Function1
    {
        private readonly ILogger _logger;
        private readonly IMediator _mediator;

		public Function1(ILoggerFactory loggerFactory, IMediator mediator)
		{
			_logger = loggerFactory.CreateLogger<Function1>();
			_mediator = mediator;
		}

		[Function("Function1")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

			var json = await req.ReadAsStringAsync();
			var request = JsonSerializer.Deserialize<User>(json);
            var result = await _mediator.Send(request);
			var response = req.CreateResponse(HttpStatusCode.OK);

            return response;
        }
    }
}
