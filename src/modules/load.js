export default function loadLocal() {
  const raw = localStorage.getItem("selections");
  if (!raw)
    return {
      locations: ["Macquarie Fields", "Dallas", "Ho Chi Minh", "Pleiku"],
      unit: "metric",
    };

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error("Error loading from local storage", err);
    return [];
  }
}
