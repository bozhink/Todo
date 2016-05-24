namespace Todos.Data.Repositories
{
    using System;
    using Contracts;
    using Todos.Data.Common.Repositories.Contracts;
    using Todos.Data.Contracts;

    public class ApplicationDataRepositoryProvider<T> : IApplicationDataRepositoryProvider<T>
        where T : class
    {
        private readonly IApplicationDbContextProvider contextProvider;

        public ApplicationDataRepositoryProvider(IApplicationDbContextProvider contextProvider)
        {
            if (contextProvider == null)
            {
                throw new ArgumentNullException(nameof(contextProvider));
            }

            this.contextProvider = contextProvider;
        }

        public IGenericRepository<T> Create()
        {
            return new ApplicationDataRepository<T>(this.contextProvider);
        }
    }
}