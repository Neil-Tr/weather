import Project from './project';
import Item from './item';

export default function loadLocal() {
    const raw = localStorage.getItem('projects');
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return parsed.map(p => {
            const project = new Project(p.name, p.desc, p.date);
            project.id = p.id || Date.now();
            
            project.items = (p.items || []).map(i => {
                const item = new Item(i.name, i.desc, i.date);
                item.id = i.id;
                item.done = i.done ?? false;
                return item;
            })
        return project;
        });
        }
        catch (err) {
            console.error("Error loading from local storage", err);
            return [];
        }
    }
