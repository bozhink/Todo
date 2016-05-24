namespace Todos.Data.Factories
{
    using System;
    using Contracts;

    using Todos.Common.Constants;

    public class ApplicationDbContextProvider : IApplicationDbContextProvider
    {
        private readonly IApplicationDbContextFactory contextFactory;

        public ApplicationDbContextProvider(IApplicationDbContextFactory contextFactory)
        {
            if (contextFactory == null)
            {
                throw new ArgumentNullException(nameof(contextFactory));
            }

            this.contextFactory = contextFactory;
            this.contextFactory.ConnectionString = DataConstants.DefaultConnectionKey;
        }

        public ApplicationDbContext Create() => this.contextFactory.Create();
    }
}