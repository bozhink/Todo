using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Todos.WebApplication.Startup))]

namespace Todos.WebApplication
{
    using System;
    using System.Web.Mvc;
    using Todos.Data.Contracts;

    public partial class Startup
    {
        private readonly IApplicationDbContextProvider contextProvider;

        public Startup()
        {
            var contextProvider = (IApplicationDbContextProvider)DependencyResolver.Current.GetService(typeof(IApplicationDbContextProvider));

            if (contextProvider == null)
            {
                throw new ArgumentNullException(nameof(contextProvider));
            }

            this.contextProvider = contextProvider;
        }

        public void Configuration(IAppBuilder app)
        {
            this.ConfigureAuth(app);
        }
    }
}
