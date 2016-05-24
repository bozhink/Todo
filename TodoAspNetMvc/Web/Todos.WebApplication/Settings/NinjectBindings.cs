namespace Todos.WebApplication.Settings
{
    using Ninject.Extensions.Conventions;
    using Ninject.Modules;

    /// <summary>
    /// NinjectModule to bind infrastructure objects.
    /// </summary>
    public class NinjectBindings : NinjectModule
    {
        public override void Load()
        {
            this.Bind(b =>
            {
                b.FromThisAssembly()
                 .SelectAllClasses()
                 .BindDefaultInterface();
            });

            this.Bind(b =>
            {
                b.From(Todos.Data.Assembly.Assembly.GetType().Assembly)
                    .SelectAllClasses()
                    .BindDefaultInterface();
            });

            this.Bind(b =>
            {
                b.From(Todos.Services.Assembly.Assembly.GetType().Assembly)
                    .SelectAllClasses()
                    .BindDefaultInterface();
            });
        }
    }
}