export default function loadLocal() {
  const raw = localStorage.getItem("selections");
  if (!raw)
    return {
      locations: ["Sydney", "London", "New York", "Tokyo"],
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
