namespace Todos.Data.Common.Repositories.Contracts
{
    public interface IGenericRepositoryProvider<T>
    {
        IGenericRepository<T> Create();
    }
}