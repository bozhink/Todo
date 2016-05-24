namespace Todos.Services.Contracts
{
    using System.Linq;
    using System.Threading.Tasks;
    using Models;
    using Todos.Services.Common.Contracts;

    public interface IUsersDataService : IDataService
    {
        Task<IQueryable<UserServiceModel>> GetAllUsers();
    }
}