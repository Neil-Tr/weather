export default function saveLocal(locationArray) {
  localStorage.setItem("locations", JSON.stringify(locationArray));
}
