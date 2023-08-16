using System.Net;
using System.Text.Json;
using Application.Users.Commands.AddUser;
using Domain.Entities;
using MediatR;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace FunctionApp
{
    public class AddUser
    {
        private readonly ILogger _logger;
        private readonly IMediator _mediator;

		public AddUser(ILoggerFactory loggerFactory, IMediator mediator)
		{
			_logger = loggerFactory.CreateLogger<AddUser>();
			_mediator = mediator;
		}

		[Function("AddUser")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

			var json = await req.ReadAsStringAsync();
			var request = JsonSerializer.Deserialize<AddUserCommand>(json);
            var result = await _mediator.Send(request);
			
			var response = req.CreateResponse(HttpStatusCode.OK);

            return response;
        }
    }
}
