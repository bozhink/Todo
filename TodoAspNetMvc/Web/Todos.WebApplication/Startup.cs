using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Todos.WebApplication.Startup))]
namespace Todos.WebApplication
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
