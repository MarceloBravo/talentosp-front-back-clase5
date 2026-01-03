function parseTaskData(req, task, index){
    const {title, description, status, priority, assignee_id, due_date} = task;

    if (title) {
        req.body.tasks[index].title = `${title}`;
    }
    if (description) {
        req.body.tasks[index].description = `${description}`
    }
    if (status) {
        req.body.tasks[index].status = `${status}`;
    }
    if (priority) {
        req.body.tasks[index].priority = `${priority}`;
    }
    if (assignee_id) {
        req.body.tasks[index].assignee_id = parseInt(assignee_id);
    }
    if (due_date) {
        req.body.tasks[index].due_date = new Date(due_date);
    }

    return req;

}

module.exports = parseTaskData;