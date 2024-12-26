using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.Design;
using System.Reflection.Metadata;

namespace TaskManager.Models
{
    public class Taskmodel
    {
        public Taskmodel()
        {
           PriorityList = new List<SelectListItem>();
        }

        public int TaskId { get; set; }
        public string Name { get; set; }

		public string Description { get; set; }

		public byte? Priority { get; set; }


        public DateOnly? DueDate { get; set; }

        public string? Asignee { get; set; }

        public byte StatusId { get; set; }

        public List<SelectListItem> PriorityList { get; set; }


    }

    public class TaskList
    {
        public TaskList()
        {
			Items = new List<Taskmodel>();
        }
        public List<Taskmodel> Items { get; set; }
        public int TotalCount { get; set; }
        public int ActiveCount { get; set; }
        
    }

    public class Priority
    {
        public static List<SelectListItem> GetPriorityList()
        {
			var prioritylist = new List<SelectListItem>();
			prioritylist.Add(new SelectListItem { Value = "1", Text = "Low" });
			prioritylist.Add(new SelectListItem { Value = "2", Text = "Medium" });
			prioritylist.Add(new SelectListItem { Value = "3", Text = "High" });
            return prioritylist;
		}
    }


    public static class Status
    {
        public const sbyte Active = 1;
        public const sbyte Completed = 0;
		public const sbyte All = -1;
	}
}
