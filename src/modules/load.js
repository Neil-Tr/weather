export default function loadLocal() {
  const raw = localStorage.getItem("selections");
  if (!raw)
    return {
      locations: ["Sydney", "Melbourne", "Brisbane", "Perth", "metric"],
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
