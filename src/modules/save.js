export default function saveLocal(prjArray) {
    localStorage.setItem('projects', JSON.stringify(prjArray));
}