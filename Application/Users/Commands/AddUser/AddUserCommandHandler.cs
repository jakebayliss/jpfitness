using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Users.Commands.AddUser
{
	public class AddUserCommand : IRequest<User>
	{
		public string Name { get; set; }
		public string Email { get; set; }
		public string Product { get; set; }
	}
	
	public class AddUserCommandHandler : IRequestHandler<AddUserCommand, User>
	{
		private readonly IApplicationDbContext _context;
		
		public AddUserCommandHandler(IApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<User> Handle(AddUserCommand command, CancellationToken cancellationToken)
		{
			var user = new User
			{
				Name = command.Name,
				Email = command.Email,
				Product = command.Product,
			};
			var newUserEntity = await _context.Users.AddAsync(user);
			await _context.SaveChangesAsync(cancellationToken);
			return newUserEntity.Entity;
		}
	}
}
