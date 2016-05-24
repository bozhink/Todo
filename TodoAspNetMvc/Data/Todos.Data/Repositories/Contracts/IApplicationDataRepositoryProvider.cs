namespace Todos.Data.Repositories.Contracts
{
    using Todos.Data.Common.Repositories.Contracts;

    public interface IApplicationDataRepositoryProvider<T> : IGenericRepositoryProvider<T>
        where T : class
    {
    }
}