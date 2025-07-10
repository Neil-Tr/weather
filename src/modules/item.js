class Item {
    constructor (name, desc, date) {
        this.id = Date.now();
        this.name = name;
        this.desc = desc;
        this.date = date;
        this.done = false;
    }
    toggleStatus() {
        this.done = !this.done;
    }
}

export default Item;