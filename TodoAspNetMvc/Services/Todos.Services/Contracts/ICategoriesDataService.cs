namespace Todos.Services.Contracts
{
    using System.Linq;
    using System.Threading.Tasks;
    using Models;

    public interface ICategoriesDataService
    {
        Task<IQueryable<CategoryServiceModel>> GetCategories();
    }
}