namespace Todos.WebApplication.ViewModels.Todo
{
    using System;
    using System.ComponentModel.DataAnnotations;

    using Todos.Common.Constants;

    public class TodoViewModel
    {
        public TodoViewModel()
        {
            this.Id = Guid.NewGuid().ToString();
            this.Category = ModelConstants.DefaultCategoryName;
            this.State = false;
        }

        public string Id { get; set; }

        [Required]
        [MaxLength(ModelConstants.MaximalLengthOfTodoText)]
        public string Text { get; set; }

        [MaxLength(ModelConstants.MaximalLengthOfCategoryName)]
        public string Category { get; set; }

        public bool State { get; set; }

        public virtual string UserId { get; set; }
    }
}