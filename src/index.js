import './styles.css';
import Project from './modules/project';
import Item from './modules/item';
import { projectLoad, itemLoad, footerLoad } from './modules/render';
import loadLocal from './modules/load';
import saveLocal from './modules/save';

const addPrjBtn = document.getElementById("add-project");
const prjForm = document.getElementById("project-form");
const addItemBtn = document.getElementById("add-item");
const itemForm = document.getElementById("item-form");
let activeProject = null;
let prjArray = loadLocal();
//default project for testing

footerLoad();

if (prjArray.length === 0) {
const defaultProject = new Project('Default', 'Desc', '2099-12-31');
defaultProject.id = '456';
prjArray = [defaultProject];
projectLoad(prjArray, { setActiveProject, deleteProjectById, changeProjectById });
setActiveProject(prjArray[0]);
}

//functions
//functions for projects
function setActiveProject(project) {
    activeProject = project;
    itemLoad(activeProject);


    document.querySelectorAll(".projects").forEach(item => {
        item.classList.remove('active');
    });

    const activeElement = document.querySelector(`[data-project-id="${project.id}"]`);
    if (activeElement) activeElement.classList.add('active');
}


function deleteProjectById(projectId){
    const confirmed = window.confirm("Are you sure you want to delete this project?")
    if (!confirmed) return;

    const index = prjArray.findIndex(p => p.id === projectId);
    if (index !== -1) {
        const wasActive = prjArray[index].id === activeProject?.id;
        prjArray.splice(index, 1);
        saveLocal(prjArray);
        projectLoad(prjArray, { setActiveProject, deleteProjectById, changeProjectById });
        if (wasActive) {
            activeProject = null;
            itemLoad([]);
        }
    }
}



function changeProjectById(projectId) {
    const project = prjArray.find(p => p.id === projectId);
    if (!project) return;

    const nameInput = document.getElementById("project-name");
    const descInput = document.getElementById("project-desc");
    const dateInput = document.getElementById("project-date");

    nameInput.value = project.name;
    descInput.value = project.desc;
    dateInput.value = project.date;

    prjForm.style.display = 'flex';

    const submitBtn = document.getElementById("project-submit");
    const newSubmit = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmit, submitBtn);

    newSubmit.addEventListener("click", (ev) => {
        ev.preventDefault();
        project.name = nameInput.value;
        project.desc = descInput.value;
        project.date = dateInput.value;

        projectLoad(prjArray, { setActiveProject, deleteProjectById, changeProjectById });
        saveLocal(prjArray);
        setActiveProject(project);
        prjForm.reset();
        prjForm.style.display = 'none';
    });
}

//functions for Item



//event listener for the actions in the main screen
//submit project form
prjForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const prjName = document.getElementById("project-name");
    const prjDesc = document.getElementById("project-desc");
    const prjDate = document.getElementById("project-date");

    const newProject = new Project(prjName.value, prjDesc.value, prjDate.value);
    prjArray.push(newProject);
    saveLocal(prjArray);
    setActiveProject(newProject);
    projectLoad(prjArray, {
        setActiveProject,
        deleteProjectById,
        changeProjectById,
    });
    prjForm.reset();
    prjForm.style.display = 'none';
})

//add new project
addPrjBtn.addEventListener("click", () => {
    prjForm.style.display = 'flex';
})

//close project form
document.getElementById("project-close").addEventListener('click',() => {
        document.getElementById('project-form').style.display = 'none';
});

//add new Item

addItemBtn.addEventListener("click", () => {
    itemForm.style.display = 'flex';
})

//close Item form
document.getElementById("item-close").addEventListener('click',() => {
        document.getElementById('item-form').style.display = 'none';
});

//submit Item form
itemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const itemName = document.getElementById("item-name");
    const itemDesc = document.getElementById("item-desc");
    const itemDate = document.getElementById("item-date");

    const newItem = new Item(itemName.value, itemDesc.value, itemDate.value);
    if(activeProject) {
        activeProject.items.push(newItem);
        saveLocal(prjArray);
        itemLoad(activeProject, prjArray);
    }
    itemForm.reset();
    itemForm.style.display = 'none';
})


projectLoad(prjArray, { setActiveProject, deleteProjectById, changeProjectById });
setActiveProject(prjArray[0]); // auto-select first
