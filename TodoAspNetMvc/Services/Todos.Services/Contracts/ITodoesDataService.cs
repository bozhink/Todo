namespace Todos.Services.Contracts
{
    using System.Linq;
    using System.Threading.Tasks;

    using Models;

    using Todos.Services.Common.Contracts;

    public interface ITodoesDataService : IDataService
    {
        Task<IQueryable<TodoServiceModel>> Get(int page, int numberOfItemsPerPage, string userId);

        Task<TodoServiceModel> GetById(string id, string userId);

        Task<object> Add(TodoServiceModel todo, string userId);

        Task<object> Update(TodoServiceModel todo, string userId);

        Task<object> Delete(string id, string userId);
    }
}