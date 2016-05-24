namespace Todos.Data.Factories
{
    using System;
    using Contracts;

    using Todos.Common.Constants;

    public class ApplicationDbContextFactory : IApplicationDbContextFactory
    {
        private string connectionString;

        public ApplicationDbContextFactory()
        {
            this.ConnectionString = DataConstants.DefaultConnectionKey;
        }

        public string ConnectionString
        {
            get
            {
                return this.connectionString;
            }

            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentNullException(nameof(this.ConnectionString));
                }

                this.connectionString = value;
            }
        }

        public ApplicationDbContext Create()
        {
            return new ApplicationDbContext(this.ConnectionString);
        }
    }
}