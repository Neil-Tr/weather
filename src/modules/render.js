import saveLocal from './save';
import { getDay, isToday } from "date-fns";

export function projectLoad(prjArray, handlers) {
const projectContainer = document.getElementById("project-container");
projectContainer.innerHTML = '';
prjArray.forEach((project, index)=>{
    const projEl = document.createElement('div');
    projEl.innerHTML = `
    <h7 class='proj-name'>${project.name}</h7>
    <p class='proj-date'>${project.date}</p>
    <div class='icon-project'>
    <button class='edit-project'data-id='${project.id}'></button>
    <button class='delete-project' data-id='${project.id}'></button>
    </div>
    `    
    projEl.dataset.index = index;
    projEl.className = 'single-project';
    projEl.setAttribute('draggable', 'true');
// Click to activate project
    projEl.addEventListener('click', () => {
            handlers.setActiveProject(project);
    });

// Prevent click propagation when clicking buttons
    projEl.querySelector('.delete-project').addEventListener('click', (e) => {
            e.stopPropagation();
            handlers.deleteProjectById(project.id);
    });

    projEl.querySelector('.edit-project').addEventListener('click', (e) => {
            e.stopPropagation();
            handlers.changeProjectById(project.id);
        });
    projectContainer.appendChild(projEl);
});

//drag and drop function
let draggedEl = null;

    projectContainer.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('single-project')) {
            draggedEl = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.target.classList.add('dragging');
        }
    });

    projectContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const target = e.target.closest('.single-project');
        if (target && target !== draggedEl) {
            const bounding = target.getBoundingClientRect();
            const offset = e.clientY - bounding.top - (bounding.height / 2);
            projectContainer.insertBefore(
                draggedEl,
                offset > 0 ? target.nextSibling : target
            );
        }
    });

projectContainer.addEventListener('drop', () => {
    const newProjects = [...projectContainer.querySelectorAll('.single-project')]
        .map(el => {
            const idx = parseInt(el.dataset.index, 10);
            return prjArray[idx];
        })
        .filter(Boolean); 

    // Replace projects in the array
    prjArray.splice(0, prjArray.length, ...newProjects);
    projectLoad(prjArray, handlers); 
    saveLocal(prjArray); // Save reordered projects
});

    projectContainer.addEventListener('dragend', () => {
        draggedEl?.classList.remove('dragging');
        draggedEl = null;
    });
}




export function itemLoad(project, prjArray) {
    const itemContainer = document.getElementById('items-container');
    itemContainer.innerHTML = '';
    if (!project || !Array.isArray(project.items)) return;

    const items = project.items;
    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'single-item';
        itemEl.setAttribute('draggable', 'true');
        itemEl.dataset.index = project.items.indexOf(item);
        itemEl.innerHTML = `
            <strong>${item.name}</strong>
            <small>${item.desc}</small>
            <small>Due: ${item.date}</small>
            <div class='icon-item'>
            <button class='edit-item' data-id='${item.id}'></button>
            <button class='delete-item' data-id='${item.id}'></button>
            <input type = "checkbox" class = 'checkbox-item' data-id='${item.id}' ${item.done ? 'checked' : ''}>
             </div>
        `;

    itemEl.querySelector('.delete-item').addEventListener('click', (e) => {
            e.stopPropagation();
            project.removeItem(item.id);
            saveLocal(prjArray);
    });
    itemEl.querySelector('.edit-item').addEventListener('click', (e) => {
            e.stopPropagation();
            project.changeItem(item.id);
            saveLocal(prjArray);
        });
    itemEl.querySelector('.checkbox-item').addEventListener('click', (e) => {
            e.stopPropagation();
            item.toggleStatus();
            itemLoad(project);
            saveLocal(prjArray);
    });
    if (item.done) {
        itemEl.classList.add("done");
    }
    itemContainer.appendChild(itemEl);
    });
//drag and drop
let draggedEl = null;

    itemContainer.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('single-item')) {
            draggedEl = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.target.classList.add('dragging');
        }
    });

    itemContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const target = e.target.closest('.single-item');
        if (target && target !== draggedEl) {
            const bounding = target.getBoundingClientRect();
            const offset = e.clientY - bounding.top - (bounding.height / 2);
            itemContainer.insertBefore(
                draggedEl,
                offset > 0 ? target.nextSibling : target
            );
        }
    });

    itemContainer.addEventListener('drop', () => {
    const newItems = [...itemContainer.querySelectorAll('.single-item')]
        .map(el => {
            const idx = parseInt(el.dataset.index, 10);
            return project.items[idx];
        })
        .filter(Boolean);

    // Replace items in the project
    project.items.splice(0, project.items.length, ...newItems);
    itemLoad(project); 
    saveLocal(prjArray);
});

    itemContainer.addEventListener('dragend', () => {
        draggedEl?.classList.remove('dragging');
        draggedEl = null;
    });
}


export function footerLoad() {
    const footer = document.getElementById('footer');
    const today = new Date();
    const weekday = getDay(today);
    console.log(weekday);

let quoteText;

switch (weekday) {
    case 0:
        quoteText = '"Sundays should come with a pause button"';
        break;
    case 1:
        quoteText = '"Monday: The moment when even my coffee needs a coffee."';
        break;
    case 2: 
        quoteText = '"Tuesday is just Monday\'s ugly twin."'
        break;
    case 3:
        quoteText = '"Keep calm! It\'s only Wednesday—halfway to freedom."'
        break;
    case 4:
        quoteText = '"Thursday: The day to start counting how many things you\'ll pretend to finish before Friday."'
        break;
    case 5:
        quoteText = '"Friday: The day I celebrate surviving the week—mostly by doing as little as possible."'
        break;
    case 6:
        quoteText = '"Saturday: The day I plan to do nothing and still don\'t finish everything."'
        break;
    default: quoteText = '"Don\'t be so humble — you\'re not that great."'
}

const quote = document.createElement('p');
quote.textContent = quoteText;
footer.appendChild(quote);

}

