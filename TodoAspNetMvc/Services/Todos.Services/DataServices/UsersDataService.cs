namespace Todos.Services.DataServices
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    using Contracts;
    using Models;

    using Todos.Common.Extensions;
    using Todos.Data.Models;
    using Todos.Data.Repositories.Contracts;

    public class UsersDataService : IUsersDataService
    {
        private readonly IApplicationDataRepositoryProvider<User> repositoryProvider;

        public UsersDataService(IApplicationDataRepositoryProvider<User> repositoryProvider)
        {
            if (repositoryProvider == null)
            {
                throw new ArgumentNullException(nameof(repositoryProvider));
            }

            this.repositoryProvider = repositoryProvider;
        }

        public async Task<IQueryable<UserServiceModel>> GetAllUsers()
        {
            var repository = this.repositoryProvider.Create();

            var users = (await repository.All())
                .Select(u => new UserServiceModel
                {
                    Id = u.Id,
                    Email = u.Email,
                    UserName = u.UserName
                })
                .ToList();

            repository.TryDispose();

            return users.AsQueryable();
        }
    }
}