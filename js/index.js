{
    const TODO_KEY = 'to-do',
          HEADER_KEY = 'header';

    /* Быстрое получение DOM узлов */
    const _getNode = selector => document.querySelector(selector);
    const _getNodes = selector => document.querySelectorAll(selector);

    /* Получаем название таски из DOM */
    const getTaskTitle = () => _getNode(".input.title textarea").value;

    /* Получаем описание таски из DOM */
    const getTaskDescription = () => {
        const paragraphs = _getNodes(".info .fields ~ .text-editor .ProseMirror p");

        const result = [...paragraphs].map(paragraph => {
            const separators = [...paragraph.children].filter(children => children.tagName === "BR");
            [...separators].forEach(separator => separator.replaceWith(" \r\n"));
            return paragraph;
        });
        
        return [...result].map(p => p.textContent.trim()).join("\n").trim();
    }

    /* Получаем сабстаски из DOM */
    const getSubtasks = () => {
        const tasks = _getNodes(".task-checklist .checklist-item .task-link");
        return [...tasks].map(task => task.textContent.trim());
    }

    /* Трансформация массива с названиями подзадач в JSON для things 3 */
    const getFormattedTasks = (arr, type) => {
        return arr.map(task => {
            return {
                "type": type,
                "attributes": {
                    "title": task
                }
            }
        })
    }

    const TASK_HREF = `${document.location.href + ' \r\n \r\n'}${getTaskDescription()}`
    const TASK_TITLE = `${getTaskTitle()}`
    const TASK_SUBTASKS = getFormattedTasks(getSubtasks())

    const TASK_RELEASE_SUBTASK = getFormattedTasks(['Отгрузка'], TODO_KEY);
    const TASK_LOG_SABTASK = [
        ...getFormattedTasks(['Логирование'], HEADER_KEY),
        ...getFormattedTasks(['Общие логи по задаче'], TODO_KEY),
    ]



    /* Формируем JSON */
    const projectJSON = "things:///json?data=" +
        encodeURI(JSON.stringify([
            {
                "type": "project",
                "attributes": {
                    "title": TASK_TITLE,
                    "notes": TASK_HREF,
                    "items": [
                        ...TASK_SUBTASKS,
                        ...TASK_RELEASE_SUBTASK,
                        ...TASK_LOG_SABTASK,
                    ]
                }
            },
        ]));

    /* Отправлям таску в things 3 */
    window.open(projectJSON);
}