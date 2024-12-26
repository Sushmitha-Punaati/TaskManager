using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Models;

namespace TaskManager.Entity.DL
{
    public class TaskService
    {
        private DBEntity _entity = null;
        public TaskService(DBEntity entity) { 
        
            _entity = entity;
        }

        public TaskList GetAllTasks(int skip, int StatusId)
        {
            var taskmodel = new TaskList();
			taskmodel.Items = (from task in _entity.Tasks.Where(t => StatusId == Status.All || t.StatusId == StatusId)
                            select new Taskmodel
                            {
                                TaskId = task.TaskId,
                                Name = task.Name,
                                Description = task.Description,
                                Priority = task.Priority??0,
                                DueDate = task.DueDate,
                                Asignee = task.Asignee,
                                StatusId = task.StatusId,
                            }).OrderByDescending(s=>s.Priority).Skip(skip).Take(50).ToList();

            taskmodel.TotalCount = _entity.Tasks.Count(t => StatusId == Status.All || t.StatusId == StatusId);
            taskmodel.ActiveCount = _entity.Tasks.Count(t => t.StatusId == Status.Active);
			return taskmodel;

        }

        public Taskmodel GetTask(int TaskId)
        {
            var TaskObj = (from task in _entity.Tasks.Where(t => t.TaskId == TaskId)
                           select new Taskmodel
                           {
                               TaskId = task.TaskId,
                               Name = task.Name,
                               Description = task.Description,
                               Priority = task.Priority,
                               DueDate = task.DueDate,
                               Asignee = task.Asignee,
                               StatusId = task.StatusId,
                           }).FirstOrDefault();

            return TaskObj;

        }

        public int SaveTask(Taskmodel model)
        {
          
            if (model.TaskId > 0)
            {
                var obj = _entity.Tasks.Where(t => t.TaskId == model.TaskId).FirstOrDefault();
                obj.Name = model.Name;
                obj.Description = model.Description??"";
                obj.Priority = model.Priority;
                obj.DueDate = model.DueDate;
                obj.Asignee = model.Asignee;
                obj.StatusId = model.StatusId;
                _entity.Entry(obj).State = EntityState.Modified;
				_entity.SaveChanges();
              
			}
            else
            {
                var obj = new TaskManager.Entity.Tasks
                {
                    Name = model.Name,
                    Description = model.Description??"",
                    Priority = model.Priority,
                    DueDate = model.DueDate,
                    Asignee = model.Asignee,
                    StatusId = model.StatusId
                };

                _entity.Tasks.Add(obj);
                _entity.SaveChanges();
                model.TaskId = obj.TaskId;
				
			}

            return model.TaskId;

        }

        public bool DeleteTask(int TaskId)
        {
            if (TaskId > 0)
            {
                var tobeDeleted = _entity.Tasks.Where(t => t.TaskId == TaskId).FirstOrDefault();
                _entity.Tasks.Remove(tobeDeleted);

			}
            else
            {
				var tobeDeleted = _entity.Tasks.Where(t => t.StatusId == Status.Completed).ToList();
			    _entity.Tasks.RemoveRange(tobeDeleted);

			}
            return _entity.SaveChanges() != 0;
        }
    }
}
