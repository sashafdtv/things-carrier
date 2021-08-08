{
    /* Быстро получение DOM узлов */
    const getNode = selector => document.querySelector(selector);
    const getNodes = selector => document.querySelectorAll(selector);

    /* Получаем название таски из DOM */
    const getTitle = () => getNode(".input.title textarea").value;

    /* Получаем описание таски из DOM */
    const getNotes = () => {
        const paragraphs = getNodes(".info .fields ~ .text-editor .ProseMirror p");

        const result = [...paragraphs].map(paragraph => {
            const separators = [...paragraph.children].filter(children => children.tagName === "BR");
            [...separators].forEach(separator => separator.replaceWith(" \r\n"));
            return paragraph;
        });
        return [...result].map(p => p.textContent.trim()).join("\n").trim();
    }

    /* Получаем сабстаски из DOM */
    const getItems = () => {
        const tasks = getNodes(".task-checklist .checklist-item .task-link");
        return [...tasks].map(task => task.textContent.trim());
    }

    /* Трансформация массива с названиями подзадач в JSON для things 3 */
    const transformItems = arr => {
        return arr.map(task => {
            return {
                "type": "to-do",
                "attributes": {
                    "title": task
                }
            }
        })
    }

    /* Формируем JSON */
    const projectJSON = "things:///json?data=" +
        encodeURI(JSON.stringify([
            {
                "type": "project",
                "attributes": {
                    "title": `${getTitle()}`,
                    "notes": `${document.location.href + ' \r\n \r\n'}${getNotes()}`,
                    "area": "Roistat",
                    "items": [
                        {
                            "type": "heading",
                            "attributes": {
                                "title": "Сабтаски"
                            }
                        }
                    ].concat(transformItems(getItems()))
                        .concat([
                            {
                                "type": "heading",
                                "attributes": {
                                    "title": "Отгрузка"
                                }
                            },
                            {
                                "type": "to-do",
                                "attributes": {
                                    "title": "Ревью",
                                    "tags": ["Блок"]
                                }
                            },
                            {
                                "type": "to-do",
                                "attributes": {
                                    "title": "Отгрузка",
                                    "tags": ["Блок"]
                                }
                            }
                        ])
                }
            },
        ]));

    /* Отправлям таску в things 3 */
    window.open(projectJSON);
}