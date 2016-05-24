namespace Todos.Services.Models
{
    public class TodoServiceModel
    {
        public string Id { get; set; }

        public string Text { get; set; }

        public string Category { get; set; }

        public bool State { get; set; }

        public string UserId { get; set; }
    }
}