const starterAttractions = [
  {
    id: "anilao",
    name: "Anilao Dive Sites",
    category: "Diving",
    area: "Anilao, Mabini",
    tag: "Signature experience",
    description:
      "Anilao is widely known for scuba diving, snorkeling, underwater photography, and a rich variety of marine life. Conditions and access vary by site, so arrange trips with a reputable local operator.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=82",
    map: "Anilao,Mabini,Batangas,Philippines",
  },
  {
    id: "gulugod",
    name: "Mt. Gulugod Baboy",
    category: "Hiking",
    area: "Mabini, Batangas",
    tag: "Mountain escape",
    description:
      "A popular hiking destination known for grassy slopes and panoramic views of the surrounding coast. Check trail access, weather, and local guide requirements before your hike.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=82",
    map: "Mt.+Gulugod+Baboy,Mabini,Batangas,Philippines",
  },
  {
    id: "plaza",
    name: "Plaza, Mabini",
    category: "Culture",
    area: "Poblacion, Mabini, Batangas",
    tag: "Town and community",
    description:
      "The town plaza is a central community gathering place and a way to experience everyday life in Mabini. Visit respectfully and check with local officials for public activities or events.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=82",
    map: "Plaza,Mabini,Batangas,Philippines",
  },
  {
    id: "coast",
    name: "Mabini Coastal Resorts",
    category: "Stay",
    area: "Coastal Mabini",
    tag: "Stay by the sea",
    description:
      "Coastal resorts provide bases for diving, snorkeling, and relaxing by the water. Compare facilities and packages directly with properties and confirm prices, access, and availability.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=82",
    map: "resorts,Anilao,Mabini,Batangas,Philippines",
  },
  {
    id: "tingloy",
    name: "Tingloy",
    category: "Beach",
    area: "Tingloy, Batangas · nearby municipality",
    tag: "Nearby island destination",
    description:
      "Tingloy is an island municipality near Mabini known for coastal scenery and island adventures. Boat access, schedules, and sea conditions can change, so confirm arrangements with local operators before traveling.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=82",
    map: "Tingloy,Batangas,Philippines",
  },
  {
    id: "anilao-beach",
    name: "Anilao Beach",
    category: "Beach",
    area: "Anilao, Mabini, Batangas",
    tag: "Coastal escape",
    description:
      "Enjoy Anilao’s coastal scenery and sea breeze, with water activities offered at selected beachfront properties and sites. Beach access and swimming suitability vary by location, weather, and local guidance.",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1000&q=82",
    map: "Anilao Beach,Mabini,Batangas,Philippines",
  },
];
let attractions = [];
try {
  const saved = localStorage.getItem("discoverMabiniAttractions");
  if (saved) {
    const oldItems = JSON.parse(saved);
    const currentById = new Map(
      starterAttractions.map((item) => [item.id, item]),
    );
    const legacyIdMap = {
      cathedral: "plaza",
      sombrero: "tingloy",
      snorkel: "anilao-beach",
    };
    const mappedItems = (Array.isArray(oldItems) ? oldItems : [])
      .filter(
        (item) =>
          ![
            "Cathedral Rock",
            "Sombrero Island",
            "Snorkeling & Reef Discovery",
          ].includes(item.name),
      )
      .map((item) => {
        const replacementId = legacyIdMap[item.id];
        return replacementId
          ? { ...(currentById.get(replacementId) || {}) }
          : item;
      })
      .filter((item) => item && item.id);
    const seen = new Set(mappedItems.map((item) => item.id));
    starterAttractions.forEach((item) => {
      if (!seen.has(item.id)) mappedItems.push({ ...item });
    });
    attractions = [
      ...new Map(mappedItems.map((item) => [item.id, item])).values(),
    ];
  } else {
    attractions = starterAttractions.map((item) => ({ ...item }));
  }
} catch (error) {
  attractions = starterAttractions.map((item) => ({ ...item }));
}
let activeFilter = "All";
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b6b64"/><stop offset="1" stop-color="#1379a6"/></linearGradient></defs><rect width="1200" height="800" fill="url(#bg)"/><circle cx="960" cy="160" r="78" fill="#dff6eb"/><path d="M0 470 Q170 390 330 470 T660 455 T990 450 T1200 445 V800 H0Z" fill="#d9f1fa"/><path d="M0 575 Q220 505 420 575 T850 565 T1200 585 V800 H0Z" fill="#083e43"/><text x="60" y="700" font-family="Arial,sans-serif" font-size="48" font-weight="700" fill="white">DISCOVER MABINI</text></svg>',
  );
document.addEventListener(
  "error",
  (e) => {
    if (e.target instanceof HTMLImageElement && e.target.naturalWidth === 0) {
      e.target.onerror = null;
      e.target.src = fallbackImage;
    }
  },
  true,
);
function persist() {
  try {
    localStorage.setItem(
      "discoverMabiniAttractions",
      JSON.stringify(attractions),
    );
  } catch (e) {
    showToast("Browser storage is unavailable; changes may not persist.");
  }
}
function renderCards() {
  const q = $("#searchInput").value.trim().toLowerCase();
  const filtered = attractions.filter(
    (a) =>
      (activeFilter === "All" || a.category === activeFilter) &&
      [a.name, a.area, a.description, a.category]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );
  $("#attractionGrid").innerHTML = filtered.length
    ? filtered
        .map(
          (a) =>
            `<article class="attraction"><div class="attraction-image"><img loading="lazy" src="${esc(a.image || fallbackImage)}" alt="${esc(a.name)}"><span class="tag">${esc(a.tag || a.category)}</span></div><div class="attraction-body"><h3>${esc(a.name)}</h3><p>${esc(a.description)}</p><div class="attraction-foot"><span>⌖ ${esc(a.area)}</span><button class="text-link" data-detail="${esc(a.id)}">Explore ↗</button></div></div></article>`,
        )
        .join("")
    : '<div class="empty-state">No places match that search. Try another name or category.</div>';
  $$("[data-detail]").forEach((b) =>
    b.addEventListener("click", () => openDetail(b.dataset.detail)),
  );
}
function setFilter(f) {
  activeFilter = f;
  $$(".filter-chip").forEach((b) =>
    b.classList.toggle("active", b.dataset.filter === f),
  );
  renderCards();
}
function openDetail(id) {
  const a = attractions.find((x) => x.id === id);
  if (!a) return;
  $("#detailTitle").textContent = a.name;
  $("#detailImage").src = a.image || fallbackImage;
  $("#detailImage").alt = a.name;
  $("#detailBody").innerHTML =
    `<p><strong style="color:var(--text)">${esc(a.area)}</strong> · ${esc(a.category)}</p><p>${esc(a.description)}</p><p style="font-size:.86rem">Tip: verify access, fees, weather, and opening details with the local operator or tourism office before visiting.</p>`;
  $("#mapLink").href =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(a.map || a.name + ", Mabini, Batangas");
  openModal("detailModal");
}
function openModal(id) {
  $("#" + id).classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  $("#" + id).classList.remove("open");
  if (!$(".modal-backdrop.open")) document.body.style.overflow = "";
}
function showToast(t) {
  const el = $("#toast");
  el.textContent = t;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
function renderAdmin() {
  const list = $("#adminList");
  list.innerHTML =
    attractions
      .map(
        (a) =>
          `<div class="admin-item"><div><strong>${esc(a.name)}</strong><small>${esc(a.category)} · ${esc(a.area)}</small></div><div style="display:flex;gap:6px"><button type="button" data-edit="${esc(a.id)}">Edit</button><button type="button" data-delete="${esc(a.id)}">Delete</button></div></div>`,
      )
      .join("") || "<p>No attractions yet.</p>";
  $$("[data-edit]").forEach(
    (b) => (b.onclick = () => editAttraction(b.dataset.edit)),
  );
  $$("[data-delete]").forEach(
    (b) =>
      (b.onclick = () => {
        if (confirm("Remove this attraction from the demo?")) {
          attractions = attractions.filter((a) => a.id !== b.dataset.delete);
          persist();
          renderCards();
          renderAdmin();
          showToast("Attraction removed");
        }
      }),
  );
}
function editAttraction(id) {
  const a = attractions.find((x) => x.id === id);
  if (!a) return;
  $("#editId").value = a.id;
  $("#adminName").value = a.name;
  $("#adminCategory").value = a.category;
  $("#adminArea").value = a.area;
  $("#adminDescription").value = a.description;
  $("#adminImage").value = a.image || "";
  $("#adminName").focus();
}
function clearAdmin() {
  $("#editId").value = "";
  $("#adminForm").reset();
}
$("#filterRow").addEventListener("click", (e) => {
  const b = e.target.closest("[data-filter]");
  if (b) setFilter(b.dataset.filter);
});
$("#searchInput").addEventListener("input", renderCards);
$$("[data-filter-link]").forEach((a) =>
  a.addEventListener("click", () => setFilter(a.dataset.filterLink)),
);
$("#menuToggle").addEventListener("click", () =>
  $("#navLinks").classList.toggle("open"),
);
$$("#navLinks a").forEach((a) =>
  a.addEventListener("click", () => $("#navLinks").classList.remove("open")),
);
$("#plannerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const length = $("#tripLength").value,
    style = $("#tripStyle").value,
    budget = $("#budget").value;
  let days = [];
  if (style === "sea")
    days = [
      "Morning: Meet your dive or snorkeling operator and review safety instructions.",
      "Midday: Explore a suitable Anilao marine site with a qualified guide.",
      "Afternoon: Enjoy a relaxed seaside meal and leave time for travel.",
    ];
  else if (style === "adventure")
    days = [
      "Early morning: Check weather and trail conditions before heading out.",
      "Morning: Hike Mt. Gulugod Baboy with appropriate gear and a local guide if required.",
      "Afternoon: Rest, hydrate, and enjoy coastal views.",
    ];
  else if (style === "relax")
    days = [
      "Morning: Enjoy a slow breakfast near the coast.",
      "Midday: Choose a resort, beach area, or permitted water activity.",
      "Afternoon: Take photos, support a local business, and return safely.",
    ];
  else
    days = [
      "Morning: Start with a guided marine activity or a visit to a local coastal spot.",
      "Midday: Take a break for lunch and explore nearby viewpoints.",
      "Afternoon: Choose a relaxed seaside stop or add a nearby trip if conditions allow.",
    ];
  if (length === "half") days = days.slice(0, 2);
  if (length === "two")
    days = [
      ...days,
      ...(style === "adventure"
        ? [
            "Day 2: Explore a second trail or viewpoint after checking access and weather.",
            "Day 2 afternoon: Enjoy a relaxed coastal stop before heading home.",
          ]
        : style === "sea"
          ? [
              "Day 2: Book another guided dive only if certified and properly rested.",
              "Day 2 afternoon: Visit local businesses and enjoy the coastline.",
            ]
          : [
              "Day 2: Consider a nearby island trip only with confirmed boat arrangements.",
              "Day 2 afternoon: Return with enough time for your onward journey.",
            ]),
    ];
  const b =
    budget === "low"
      ? "Keep costs manageable by comparing transport and meal options, bringing essentials, and asking about fees in advance."
      : budget === "comfort"
        ? "For extra comfort, compare resort packages and arrange transport and guided activities in advance."
        : "Compare a few local operators and accommodation options, and confirm exactly what each package includes.";
  $("#itineraryResult").innerHTML =
    `<h3>Your ${length === "half" ? "half-day" : length === "one" ? "one-day" : "two-day"} idea</h3><ol>${days.map((x) => `<li>${esc(x)}</li>`).join("")}</ol><p style="margin:12px 0 0;font-size:.85rem"><strong>Budget note:</strong> ${esc(b)}</p><p style="margin:8px 0 0;font-size:.78rem">This is a sample plan, not a live booking. Confirm prices, access, weather, and schedules before traveling.</p>`;
  $("#itineraryResult").classList.add("show");
  $("#itineraryResult").scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
});
function openAdmin() {
  renderAdmin();
  openModal("adminModal");
}
$("#openAdmin").onclick = openAdmin;
$("#footerAdmin").onclick = openAdmin;
$("#adminForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = $("#editId").value || "custom-" + Date.now();
  const old = attractions.find((a) => a.id === id);
  const cat = $("#adminCategory").value;
  const obj = {
    id,
    name: $("#adminName").value.trim(),
    category: cat,
    area: $("#adminArea").value.trim(),
    description: $("#adminDescription").value.trim(),
    image:
      $("#adminImage").value.trim() ||
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80",
    tag:
      cat === "Diving"
        ? "Marine discovery"
        : cat === "Hiking"
          ? "Nature escape"
          : cat === "Stay"
            ? "Stay by the sea"
            : "Coastal escape",
    map: encodeURIComponent(
      $("#adminArea").value.trim() + ", Mabini, Batangas, Philippines",
    ),
  };
  if (old) attractions = attractions.map((a) => (a.id === id ? obj : a));
  else attractions.unshift(obj);
  persist();
  renderCards();
  renderAdmin();
  clearAdmin();
  showToast(old ? "Attraction updated" : "Attraction added");
});
$("#resetAdmin").onclick = clearAdmin;
$("#resetData").onclick = () => {
  if (
    confirm(
      "Restore the original sample attractions? This will remove custom changes.",
    )
  ) {
    attractions = starterAttractions.map((a) => ({ ...a }));
    persist();
    renderCards();
    renderAdmin();
    clearAdmin();
    showToast("Sample content restored");
  }
};
$$("[data-close]").forEach((b) =>
  b.addEventListener("click", () => closeModal(b.dataset.close)),
);
$$(".modal-backdrop").forEach((m) =>
  m.addEventListener("click", (e) => {
    if (e.target === m) closeModal(m.id);
  }),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    $$(".modal-backdrop.open").forEach((m) => closeModal(m.id));
});
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  $$(".reveal").forEach((el) => observer.observe(el));
} else {
  $$(".reveal").forEach((el) => el.classList.add("visible"));
}
$("#year").textContent = new Date().getFullYear();
renderCards();
