import { projectLoad, itemLoad } from './render';
import Item from './item';

class Project {
    constructor (name, desc, date) {
        this.id = Date.now();
        this.name = name;
        this.desc = desc;
        this.date = date;
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    changeItem(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    const nameInput = document.getElementById("item-name");
    const descInput = document.getElementById("item-desc");
    const dateInput = document.getElementById("item-date");

    nameInput.value = item.name;
    descInput.value = item.desc;
    dateInput.value = item.date;
    const itemChangeForm = document.getElementById('item-form');
    itemChangeForm.style.display = 'flex';

    const submitBtn = document.getElementById("item-submit");
    const newSubmit = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmit, submitBtn);

    newSubmit.addEventListener("click", (ev) => {
        ev.preventDefault();
        item.name = nameInput.value;
        item.desc = descInput.value;
        item.date = dateInput.value;

        itemLoad(this);
        itemChangeForm.reset();
        itemChangeForm.style.display = 'none';
    });
}

    removeItem(itemId) {
    const confirmed = window.confirm("Are you sure you want to delete this item?")
    if (!confirmed) return;
    
    const index = this.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
        this.items.splice(index, 1);
        itemLoad(this);
        }
    }


    save() {
        localStorage.setItem(this.name, JSON.stringify({
            name: this.name,
            desc: this.desc,
            date: this.date,
            items: this.items,
        }))
    }

    static load(name) {
        const data = localStorage.getItem(name);
         if (data) {
            const parsed = JSON.parse(data);
            const project = new Project(parsed.name, parsed.desc, parsed.date);
            project.items = parsed.items.map(i => {
            const item = new Item(i.name, i.desc, i.date);
            item.id = i.id;
            item.done = i.done ?? false;
            return item;
        });
        return project;
    }
    return null;
    }
}
export default Project;