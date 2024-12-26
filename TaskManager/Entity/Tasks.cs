using System.ComponentModel.DataAnnotations;

namespace TaskManager.Entity
{
    public class Tasks
    {
        [Key]
        public int TaskId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public byte? Priority { get; set; }

        public DateOnly? DueDate { get; set; }

        public string? Asignee { get; set; }

        [Required]
        public byte StatusId { get; set; }


    }
}
