namespace Todos.Data.Repositories.Contracts
{
    using Todos.Data.Common.Repositories.Contracts;

    public interface IApplicationDataRepository<T> : IGenericRepository<T>
        where T : class
    {
    }
}