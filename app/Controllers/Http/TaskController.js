'use strict'

class TaskController {

  const Task = use('App/Models/Task')

  async index ({ view }) {
    const tasks = await Task.all()

    return view.render('tasks.index', { tasks: tasks.toJSON() })
  }
  const { validate } = use('Validator')

  async store ({ request, response, session }) {
    // validate form input
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255'
    })

    // show error messages upon validation fail
    if (validation.fails()) {
      session.withErrors(validation.messages())
      .flashAll()

      return response.redirect('back')
    }

    // persist to database
    const task = new Task()
    task.title = request.input('title')
    await task.save()

    // Fash success message to session
    session.flash({ notification: 'Task added!' })

    return response.redirect('back')
  }
  async destroy ({ params, session, response }) {
    const task = await Task.find(params.id)
    await task.delete()

    // Fash success message to session
    session.flash({ notification: 'Task deleted!' })

    return response.redirect('back')
  }
}

module.exports = TaskController
