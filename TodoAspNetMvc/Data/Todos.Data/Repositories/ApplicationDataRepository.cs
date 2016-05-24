namespace Todos.Data.Repositories
{
    using Contracts;
    using Todos.Data.Common.Repositories;
    using Todos.Data.Contracts;

    public class ApplicationDataRepository<T> : EntityGenericRepository<ApplicationDbContext, T>, IApplicationDataRepository<T>
        where T : class
    {
        public ApplicationDataRepository(IApplicationDbContextProvider contextProvider)
            : base(contextProvider)
        {
        }
    }
}