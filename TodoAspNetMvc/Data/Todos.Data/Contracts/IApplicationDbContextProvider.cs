namespace Todos.Data.Contracts
{
    using Todos.Data.Common.Contracts;

    public interface IApplicationDbContextProvider : IDatabaseProvider<ApplicationDbContext>
    {
    }
}