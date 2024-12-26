using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Entity.DL;
using TaskManager.Models;


namespace TaskManager.Controllers
{
    public class TaskManagerController : Controller
    {
        private readonly TaskService _taskService = null; 

        public TaskManagerController(TaskService taskService)
        {
            _taskService = taskService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetAllTasks(int skip,int StatusId = -1)// All -1
        {
			var model = _taskService.GetAllTasks(skip, StatusId);
			return PartialView("_TaskBody",model);
		}

        [HttpGet]
        public ActionResult GetTask(int TaskId)
        {
            var model = new Taskmodel();
            if (TaskId > 0)
                model = _taskService.GetTask(TaskId);

            model.PriorityList = Priority.GetPriorityList();

            return PartialView("_CreateOrEditTask", model);
        }

		[HttpGet]
		public ActionResult ViewTask(int TaskId)
		{
			var model = new Taskmodel();
			if (TaskId > 0)
				model = _taskService.GetTask(TaskId);

			model.PriorityList = Priority.GetPriorityList();
			return PartialView("_ViewTask", model);
		}

		[HttpPost]
		public ActionResult SaveTask(Taskmodel model)
		{
			var res = _taskService.SaveTask(model);
            return Json(new { TaskId = model.TaskId });
		}

        [HttpPost]
        public ActionResult DeleteTask(int TaskId)
        {
            var res = _taskService.DeleteTask(TaskId);
            return Json(res);

        }
	}
}
