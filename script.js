const starterAttractions = [
  {
    id: "anilao",
    name: "Anilao Dive Sites",
    category: "Diving",
    area: "Anilao, Mabini",
    tag: "Signature experience",
    description:
      "Anilao is widely known for scuba diving, snorkeling, underwater photography, and a rich variety of marine life. Conditions and access vary by site, so arrange trips with a reputable local operator.",
    image: "img/Anilao Dive Sites.jpg",
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
    image: "img/Mt Gulugod Baboy.jpg",
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
    image: "img/Plaza Mabini.jpg",
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
    image: "img/Mabini Coastal Resorts.jpg",
    map: "resorts,Anilao,Mabini,Batangas,Philippines",
  },
  {
    id: "tingloy",
    name: "Masasa Beach, Tingloy",
    category: "Beach",
    area: "Tingloy, Batangas · nearby municipality",
    tag: "Nearby island destination",
    description:
      "Masasa Beach is a well-known coastal destination in Tingloy, a nearby island municipality. Boat access, schedules, and sea conditions can change, so confirm arrangements with local operators before traveling.",
    image: "img/Tingloy, Masasa Beach.jpg",
    map: "Masasa Beach,Tingloy,Batangas,Philippines",
  },
  {
    id: "anilao-beach",
    name: "Anilao Port",
    category: "Beach",
    area: "Anilao, Mabini, Batangas",
    tag: "Coastal gateway",
    description:
      "Anilao Port is a coastal access point for boat trips and nearby dive sites in Mabini. Confirm boat schedules, fares, weather, and departure details with your local operator before traveling.",
    image: "img/Anilao Port.jpg",
    map: "Anilao Port,Mabini,Batangas,Philippines",
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
          : currentById.has(item.id)
            ? {
                ...currentById.get(item.id),
                ...item,
                name: currentById.get(item.id).name,
                image: currentById.get(item.id).image,
              }
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
            `<article class="attraction"><div class="attraction-image"><img loading="lazy" src="${esc(a.image || fallbackImage)}" alt="${esc(a.name)}"><span class="tag">${esc(a.tag || a.category)}</span></div><div class="attraction-body"><h3>${esc(a.name)}</h3><p>${esc(a.description)}</p><div class="attraction-foot"><span class="attraction-location"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>${esc(a.area)}</span><button class="text-link" data-detail="${esc(a.id)}">Explore <svg class="icon icon-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" /></svg></button></div></div></article>`,
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
  $("#adminCategory").dispatchEvent(new Event("change", { bubbles: true }));
  $("#adminArea").value = a.area;
  $("#adminDescription").value = a.description;
  $("#adminImage").value = a.image || "";
  $("#adminName").focus();
}
function clearAdmin() {
  $("#editId").value = "";
  $("#adminForm").reset();
  $("#adminCategory").dispatchEvent(new Event("change", { bubbles: true }));
}
function setupCustomDropdowns() {
  $$(".planner-form .field select, #adminCategory").forEach((select) => {
    const label = document.querySelector(`label[for="${select.id}"]`);
    if (!label) return;

    const listId = `${select.id}Options`;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "dropdown-trigger";
    trigger.id = `${select.id}Trigger`;
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-controls", listId);
    trigger.setAttribute("aria-labelledby", `${label.id || (label.id = `${select.id}Label`)}`);
    trigger.setAttribute("aria-expanded", "false");

    const value = document.createElement("span");
    value.className = "dropdown-value";
    const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevron.setAttribute("class", "icon dropdown-chevron");
    chevron.setAttribute("viewBox", "0 0 24 24");
    chevron.setAttribute("aria-hidden", "true");
    chevron.setAttribute("focusable", "false");
    const chevronPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    chevronPath.setAttribute("d", "m6 9 6 6 6-6");
    chevron.append(chevronPath);
    trigger.append(value, chevron);

    const list = document.createElement("ul");
    list.className = "dropdown-options";
    list.id = listId;
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-labelledby", label.id);

    const options = Array.from(select.options).map((option, index) => {
      const item = document.createElement("li");
      item.className = "dropdown-option";
      item.id = `${listId}-${index}`;
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.textContent = option.textContent;
      list.append(item);
      return item;
    });

    const sync = () => {
      const selectedIndex = select.selectedIndex;
      value.textContent = select.options[selectedIndex]?.textContent || "";
      options.forEach((option, index) => {
        const isSelected = index === selectedIndex;
        option.setAttribute("aria-selected", String(isSelected));
        if (isSelected) trigger.setAttribute("aria-activedescendant", option.id);
      });
    };
    const setActive = (index) => {
      const boundedIndex = Math.max(0, Math.min(index, options.length - 1));
      options.forEach((option) => option.classList.remove("active"));
      options[boundedIndex].classList.add("active");
      trigger.setAttribute("aria-activedescendant", options[boundedIndex].id);
      options[boundedIndex].scrollIntoView({ block: "nearest" });
    };
    const close = (restoreFocus = false) => {
      list.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
      if (restoreFocus) trigger.focus();
    };
    const choose = (option) => {
      select.value = option.dataset.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
      close(true);
    };
    const open = (index = select.selectedIndex) => {
      list.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
      setActive(index);
    };

    select.classList.add("dropdown-native-select");
    select.tabIndex = -1;
    label.htmlFor = trigger.id;
    select.insertAdjacentElement("afterend", trigger);
    trigger.insertAdjacentElement("afterend", list);

    trigger.addEventListener("click", () => {
      if (trigger.getAttribute("aria-expanded") === "true") close();
      else open();
    });
    trigger.addEventListener("keydown", (event) => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      const activeIndex = options.findIndex(
        (option) => option.id === trigger.getAttribute("aria-activedescendant"),
      );
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!isOpen)
          open(
            select.selectedIndex + (event.key === "ArrowDown" ? 1 : -1),
          );
        else setActive(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        if (!isOpen) open(event.key === "Home" ? 0 : options.length - 1);
        else setActive(event.key === "Home" ? 0 : options.length - 1);
      } else if ((event.key === "Enter" || event.key === " ") && isOpen) {
        event.preventDefault();
        choose(options[activeIndex]);
      } else if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        close();
      } else if (event.key === "Tab" && isOpen) {
        close();
      }
    });
    list.addEventListener("click", (event) => {
      const option = event.target.closest('[role="option"]');
      if (option) choose(option);
    });
    list.addEventListener("mousemove", (event) => {
      const option = event.target.closest('[role="option"]');
      if (option) setActive(options.indexOf(option));
    });
    select.addEventListener("change", sync);
    document.addEventListener("pointerdown", (event) => {
      if (!select.parentElement.contains(event.target)) close();
    });
    sync();
  });
}
setupCustomDropdowns();
$("#filterRow").addEventListener("click", (e) => {
  const b = e.target.closest("[data-filter]");
  if (b) setFilter(b.dataset.filter);
});
$("#searchInput").addEventListener("input", renderCards);
$$("[data-filter-link]").forEach((a) =>
  a.addEventListener("click", () => setFilter(a.dataset.filterLink)),
);
$("#menuToggle").addEventListener("click", () => {
  const isOpen = $("#navLinks").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation",
  );
});
$$("#navLinks a").forEach((a) =>
  a.addEventListener("click", () => {
    $("#navLinks").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
    $("#menuToggle").setAttribute("aria-label", "Open navigation");
  }),
);
$("#plannerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const length = $("#tripLength").value,
    style = $("#tripStyle").value,
    budget = $("#budget").value,
    firstStop = $("#firstStop").value,
    travelGroup = $("#travelGroup").value;
  const stopDetails = {
    "Anilao Port": {
      note: "Anilao is a dive-tourism area in Mabini. Confirm your operator's exact departure point, boat, activity, and sea conditions; do not assume every trip leaves from this port.",
      activities: {
        sea: "Join a pre-arranged dive or snorkel trip with a reputable local operator. Choose an activity that matches your training and current conditions; follow the safety briefing and do not touch or stand on coral.",
        adventure: "Use the port only as a meeting or departure point if your operator confirms it. Ask locally about a suitable land-based activity; hiking trails do not start at the port.",
        relax: "Treat the port as a departure point, not a guaranteed swimming beach. Arrange any seaside rest or meal at a property that confirms visitor access.",
        mix: "If your operator confirms this as the departure point, take one guided marine trip. Keep the rest of the day flexible for a confirmed meal or coastal stop.",
      },
      dayTwo:
        "Explore Poblacion or arrange a separate land-based coastal visit. Confirm transport, visitor access, and opening details locally.",
    },
    "Mt. Gulugod Baboy": {
      note: "Visitor information describes a hiking route from Barangay Bagalangit. Confirm the current jump-off point, trail access, any fees or guide requirements, and weather locally before setting out.",
      activities: {
        sea: "This is a mountain destination, not a dive departure point. Keep it as your first stop, then arrange any Anilao marine activity separately with a local operator.",
        adventure: "Check in at the locally confirmed Bagalangit jump-off and follow the route and safety guidance provided there. Bring water, sun protection, and suitable footwear; turn back if weather or trail conditions deteriorate.",
        relax: "This destination involves a hike, so it may not suit a relaxed itinerary. Consider changing your first stop to Poblacion or a coastal property that confirms visitor access.",
        mix: "Make the hike your main activity after confirming trail access and weather. Avoid adding another major excursion until you know the route conditions and travel time.",
      },
      dayTwo:
        "Choose a separate coastal visit or guided marine activity in Mabini, subject to confirmed access, transport, weather, and operator availability.",
    },
    "Plaza Mabini": {
      note: "The plaza is in Poblacion, Mabini. It is a community space, so do not assume event schedules, facilities, or visitor services will be available.",
      activities: {
        sea: "Start in Poblacion, then arrange transport to an Anilao operator or resort that confirms a marine activity and meeting point.",
        adventure: "Explore the Poblacion area at your own pace. If adding Mt. Gulugod Baboy, confirm separate transport, the Bagalangit jump-off, trail access, and weather first.",
        relax: "Take an unhurried visit around Poblacion and use businesses that are open to visitors. Check current hours and services locally.",
        mix: "Visit Poblacion first, then add one separately arranged coastal activity only if transport, access, and conditions are confirmed.",
      },
      dayTwo:
        "Choose one pre-arranged activity elsewhere in Mabini, such as a guided marine trip or the Bagalangit hiking route, after checking access and conditions.",
    },
    "Masasa Beach, Tingloy": {
      note: "Masasa Beach is on Maricaban Island in Tingloy, a separate municipality from Mabini. Arrange and reconfirm round-trip boat transport, departure point, local requirements, and sea conditions; do not assume a fixed schedule or departure from Anilao Port.",
      activities: {
        sea: "Keep the island visit as your main activity. Swim or snorkel only where local guidance and conditions permit; follow local rules and never touch or stand on coral.",
        adventure: "Enjoy the island visit at a relaxed pace. Mt. Gulugod Baboy is on the Mabini mainland and requires separate transport and planning.",
        relax: "Spend your visit at the beach only if access and conditions are confirmed. Follow Tingloy community rules and allow time for your pre-arranged return boat.",
        mix: "Focus on Masasa Beach and visitor activities approved locally. Avoid adding a Mabini mainland excursion to the same day unless separate transport and return connections are confirmed.",
      },
      dayTwo:
        "After confirming your return to the Mabini mainland, choose one separately arranged activity there. Allow for boat connections and weather changes; no timetable is assumed.",
    },
  };
  const selectedStop = stopDetails[firstStop];
  const days = [selectedStop.activities[style]];
  const halfDayNote =
    length === "half"
      ? "A half-day may not allow enough time for travel and the activity, especially for an island boat trip or hike. Confirm realistic travel and activity durations locally."
      : "";
  if (length !== "half") {
    days.push(
      "Take a meal or rest break at a place open to visitors. Check availability and prices directly; this sample does not include live business information.",
    );
    if (style === "mix") {
      days.push(
        "Before adding another stop, confirm its location, transport, access, and remaining travel time with a local operator.",
      );
    }
  }
  const b =
    budget === "low"
      ? "No live prices are included. Ask operators and venues directly about fares, fees, inclusions, and payment methods; compare transport and meal costs before committing."
      : budget === "comfort"
        ? "No live prices or availability are included. Contact resorts and operators directly about current packages, transport, accessibility, and what is included."
        : "No live prices are included. Compare current transport, meal, and activity costs, and confirm exactly what each operator's package includes.";
  const groupNote =
    travelGroup === "Solo"
      ? "Travel solo: share your plan with someone you trust and use established local transport and operators."
      : travelGroup === "Family"
        ? "Traveling with family: confirm age, mobility, swimming, and safety requirements for each activity with its operator."
        : travelGroup === "Group"
          ? "Traveling as a group: confirm boat or vehicle capacity, meeting arrangements, and group requirements in advance."
          : "Traveling as a couple or with friends: agree on a meeting point and confirm each activity with its operator.";
  const dayTwo =
    length === "two"
      ? `<h4>Day 2</h4><ol><li>${esc(selectedStop.dayTwo)}</li><li>Check your return transport and allow a buffer for delays or changes before leaving.</li></ol><p class="itinerary-note"><strong>Overnight:</strong> Confirm accommodation and its location before travel. For Tingloy, confirm whether you will stay on the island or return to the Mabini mainland, and arrange the corresponding boat connection.</p>`
      : "";
  $("#itineraryResult").innerHTML =
    `<h3>Your ${length === "half" ? "half-day" : length === "one" ? "one-day" : "two-day"} idea</h3><p class="itinerary-first-stop"><strong>First stop:</strong> ${esc(firstStop)}</p><p class="itinerary-location-note">${esc(selectedStop.note)}${halfDayNote ? ` ${esc(halfDayNote)}` : ""}</p><h4>Day 1</h4><ol>${days.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>${dayTwo}<p class="itinerary-note"><strong>Group note:</strong> ${esc(groupNote)}</p><p class="itinerary-note"><strong>Budget note:</strong> ${esc(b)}</p><p class="itinerary-note">This is a planning guide, not a booking or live schedule. Boat trips, trail access, weather, and business hours can change. Confirm details with local authorities, your accommodation, or the operator before traveling.</p><p class="itinerary-sources"><strong>Location references:</strong> <a href="https://en.wikivoyage.org/wiki/Anilao" target="_blank" rel="noopener noreferrer">Mabini and Anilao visitor information</a> · <a href="https://en.wikipedia.org/wiki/Tingloy" target="_blank" rel="noopener noreferrer">Tingloy municipality information</a>.</p>`;
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
      "img/Anilao Port.jpg",
    tag:
      cat === "Diving"
        ? "Marine discovery"
        : cat === "Hiking"
          ? "Nature escape"
          : cat === "Stay"
            ? "Stay by the sea"
            : cat === "Snorkeling"
              ? "Underwater discovery"
              : cat === "Island hopping"
                ? "Island adventure"
                : cat === "Food & dining"
                  ? "Local flavors"
                  : cat === "Viewpoints"
                    ? "Scenic outlook"
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
const chatPanel = $("#chatPanel");
const chatToggle = $("#chatToggle");
const chatMessages = $("#chatMessages");
const chatForm = $("#chatForm");
const chatInput = $("#chatInput");
const chatSend = $("#chatSend");
const chatSuggestions = $("#chatSuggestions");
let chatHistory = [];
let chatPending = false;

function appendChatMessage(text, type, sources = []) {
  const message = document.createElement("div");
  message.className = `chat-message ${type}`;
  const bubble = document.createElement("p");
  bubble.textContent = text;
  message.append(bubble);
  const safeSources = sources.filter(
    (source) =>
      typeof source.title === "string" &&
      typeof source.url === "string" &&
      /^https:\/\//i.test(source.url),
  );
  if (safeSources.length) {
    const sourceList = document.createElement("div");
    sourceList.className = "chat-sources";
    const label = document.createElement("span");
    label.textContent = "Sources";
    sourceList.append(label);
    safeSources.slice(0, 5).forEach((source, index) => {
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${index + 1}. ${source.title}`;
      sourceList.append(link);
    });
    message.append(sourceList);
  }
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return message;
}

function setChatOpen(isOpen) {
  chatPanel.hidden = !isOpen;
  chatToggle.setAttribute("aria-expanded", String(isOpen));
  chatToggle.setAttribute(
    "aria-label",
    isOpen ? "Close Mabini travel assistant" : "Open Mabini travel assistant",
  );
  if (isOpen) {
    $("#chatClose").focus();
  } else {
    chatToggle.focus();
  }
}

function isFilipinoQuestion(question) {
  const text = question.toLowerCase().replace(/[’']/g, "");
  return /\b(ano|saan|paano|papunta|papaano|magkano|kailan|bukas|ngayon|mayroon|meron|puwede|pwede|gusto|mula|papuntang|biyahe|bumiyahe|sakay|sumakay|pamasahe|presyo|maganda|mabait|ba|po|opo|ng|sa|ang|mga|para|ito|iyan|ako|kami|sila|ninyo|natin|ko|mo|diyan|doon|dito)\b/.test(
    text,
  ) || /[ñ]/.test(text);
}

function getLocalMabiniAnswer(question) {
  const text = question.toLowerCase().replace(/[’']/g, "");
  const filipino = isFilipinoQuestion(text);

  if (/\b(food|foods|eat|eating|dish|dishes|cuisine|meal|restaurant|restaurants|food places|pagkain|pagkakainan|ulam|kainan|kakain|pagkain)\b/.test(text)) {
    if (filipino) {
      return "Kung pagkain ang hanap mo, magtanong sa mga lokal na kainan o resort restaurant kung ano ang available. Kilala ang Batangas sa mga pagkaing tulad ng lomi at bulalo, pero hindi ko makukumpirma kung aling putahe o kainan ang bukas ngayon sa Mabini. Nagbabago ang menu at oras, kaya direktang magtanong sa kainan bago pumunta.";
    }
    return "For food in Mabini, check local eateries and resort restaurants and ask what is available that day. Batangas is known for dishes such as lomi and bulalo, though I can't verify which restaurants are open or what's on today's menu. Menus and hours change, so check with the venue before you go.";
  }

  if (
    /\b(how|go|get|travel|commute|route|from|to|going|reach|direction|transport|paano|papunta|papuntang|biyahe|bumiyahe|commute)\b/.test(text) &&
    /\b(manila|maynila)\b/.test(text) &&
    /\bmabini\b/.test(text)
  ) {
    if (
      /\b(from|mula)\s+mabini\b/.test(text) ||
      /\bmabini\b.*\b(to|papuntang)\s+(manila|maynila)\b/.test(text)
    ) {
      if (filipino) {
        return "Kung manggagaling ka sa Mabini papuntang Maynila sakay ng pampublikong sasakyan, sumakay muna ng Batangas–Mabini (BW-05) jeepney papunta sa Batangas City Grand Terminal, at doon lumipat sa bus papuntang Maynila. Itanong muna sa mga lokal ang kasalukuyang sakayan at terminal; maaaring magbago ang iskedyul, pamasahe, at biyahe. Batay ito sa Wikivoyage Anilao/Mabini travel guide.";
      }
      return "For public transport from Mabini to Manila, take a Batangas–Mabini (BW-05) jeepney toward Batangas City Grand Terminal, then transfer to a Manila-bound bus. Confirm the current jeepney departure point and bus terminal with local staff before traveling; schedules, fares, and traffic can change. Source: Wikivoyage’s Anilao/Mabini travel guide.";
    }
    if (
      /\b(from|mula)\s+(manila|maynila)\b/.test(text) ||
      /\b(manila|maynila)\b.*\b(to|papuntang)\s+mabini\b/
    ) {
      if (filipino) {
        return "Kung manggagaling ka sa Maynila papuntang Mabini, sumakay ng bus papuntang Batangas City Grand Terminal, at lumipat sa Batangas–Mabini (BW-05) jeepney. Kumpirmahin muna sa terminal staff o drayber ang tamang sakayan, ruta, at babaan papunta sa eksaktong destinasyon mo, gaya ng Anilao. Walang direktang bus papasok sa Mabini; maaaring magbago ang iskedyul at pamasahe. Batay ito sa Wikivoyage Anilao/Mabini travel guide.";
      }
      return "For public transport from Manila, take a bus to Batangas City Grand Terminal, then transfer to a Batangas–Mabini (BW-05) jeepney toward Mabini. Ask terminal staff or the driver to confirm the current jeepney bay, route, and drop-off for your exact destination, such as Anilao. There is no bus directly into Mabini, and schedules and fares can change. By car, follow a current navigation route to Mabini and check traffic before leaving. Source: Wikivoyage’s Anilao/Mabini travel guide.";
    }
  }
  if (/\b(gulugod|baboy)\b/.test(text)) {
    if (filipino) {
      return "Ang Mt. Gulugod Baboy ay isang hiking destination sa Mabini, Batangas, na kilala sa tanawin ng baybayin. May rutang binabanggit mula sa Barangay Bagalangit. Kumpirmahin muna sa lokal ang kasalukuyang jump-off point, access, gabay o bayarin, at lagay ng panahon bago umakyat.";
    }
    return "Mt. Gulugod Baboy is a hiking destination in Mabini, Batangas, known for coastal views. Visitor information describes a route from Barangay Bagalangit. Confirm the current trail jump-off, access, guide or fee requirements, and weather locally before setting out.";
  }
  if (/\b(masasa|tingloy|maricaban)\b/.test(text)) {
    if (filipino) {
      return "Matatagpuan ang Masasa Beach sa Maricaban Island, Tingloy—hiwalay itong munisipalidad at hindi bahagi ng Mabini. Kumpirmahin ang pinanggagalingang pantalan at balikan mong biyahe sa bangka; huwag ipagpalagay na sa Anilao Port ito umaalis. Maaaring magbago ang iskedyul, lokal na patakaran, at kondisyon ng dagat.";
    }
    return "Masasa Beach is on Maricaban Island in Tingloy, a separate municipality from Mabini. Arrange and reconfirm your boat departure point and return trip; do not assume it leaves from Anilao Port. Schedules, local requirements, and sea conditions can change, so check them locally.";
  }
  if (/\b(anilao)\b/.test(text) && /\b(port|boat|depart|departure|ferry|schedule|transport)\b/.test(text)) {
    return "Anilao Port is a coastal access point, but not every dive or boat trip departs there. Ask your operator to confirm the exact meeting point, boat schedule, fare, and sea conditions.";
  }
  if (/\b(anilao|dive|diving|snorkel|snorkeling|underwater|marine)\b/.test(text)) {
    if (filipino) {
      return "Kilala ang Anilao sa Mabini sa scuba diving, snorkeling, underwater photography, at yamang-dagat. Magpa-iskedyul ng guided trip sa mapagkakatiwalaang lokal na operator. Nag-iiba ang dive sites at access, kaya kumpirmahin sa operator ang meeting point, kondisyon, at mga kinakailangan sa kaligtasan.";
    }
    return "Anilao in Mabini is known for scuba diving, snorkeling, underwater photography, and marine life. You can arrange a guided marine trip with a reputable local operator. Dive sites and access vary, so confirm the exact meeting point, current conditions, and safety requirements with them.";
  }
  if (/\b(plaza|poblacion|town center|town centre)\b/.test(text)) {
    return "Plaza Mabini is in Poblacion, Mabini, and serves as a community gathering place. Public activities and visitor services can vary, so check locally if you are looking for a particular event or facility.";
  }
  if (/\b(resort|resorts|hotel|hotels|stay|accommodation|accommodations|where to sleep)\b/.test(text)) {
    if (filipino) {
      return "May mga coastal resort sa Mabini na puwedeng tuluyan o pagtanungan ng marine activities. Nag-iiba ang pasilidad, access, package, at availability; direktang kontakin ang property para kumpirmahin ang lokasyon, kasalukuyang presyo, at inclusions.";
    }
    return "Mabini has coastal resorts that can serve as a base for a stay or marine activities. Facilities, visitor access, packages, and availability vary; contact a property directly to confirm its location, current rates, and what is included.";
  }
  if (/\b(price|prices|cost|costs|fare|fares|schedule|schedules|timetable|availability|available|open today|weather|conditions|magkano|pamasahe|presyo|iskedyul|oras|panahon)\b/.test(text)) {
    if (filipino) {
      return "Wala akong live na presyo, iskedyul, availability, o lagay ng panahon. Kumpirmahin ang kasalukuyang detalye sa lokal na operator ng bangka o tour, activity provider, o tanggapan ng turismo bago bumiyahe. Para sa Masasa Beach, kumpirmahin din ang pinanggagalingan at balikan mong bangka.";
    }
    return "I don't have live prices, schedules, availability, or weather. Please confirm current details directly with the local boat operator, activity provider, or tourism office before traveling. For Masasa Beach, also confirm the departure point and return boat.";
  }
  if (/\b(people|locals|friendly|kind|welcoming|hospitality)\b/.test(text) || /\b(tao|mga tao|mabait|magiliw|palakaibigan|hospitable)\b/.test(text)) {
    if (filipino) {
      return "Maraming bisita ang maaaring makaranas ng mainit na pagtanggap sa mga komunidad sa Mabini, lalo na kapag magalang sa mga lokal na kaugalian at patakaran. Iba-iba pa rin ang bawat tao at karanasan, kaya hindi ko ito maipapangako sa lahat ng pagkakataon.";
    }
    return "Visitors may experience warm hospitality in Mabini's communities, especially when they respect local customs and rules. People and experiences vary, so I can't promise that every interaction will be the same.";
  }
  if (
    (/\b(where is|location|located|how do i get|how to get)\b/.test(text) ||
      /\b(saan|matatagpuan|nasaan)\b/.test(text)) &&
    /\bmabini\b/.test(text)
  ) {
    if (filipino) {
      return "Ang Mabini ay isang munisipalidad sa lalawigan ng Batangas, Pilipinas. Kung may partikular kang hinahanap, maaari akong tumulong tungkol sa Mt. Gulugod Baboy, Anilao, Anilao Port, Plaza Mabini, o Masasa Beach sa kalapit na Tingloy.";
    }
    return "Mabini is a municipality in Batangas, Philippines. If you mean a specific place, ask me about Mt. Gulugod Baboy, Anilao, Anilao Port, Plaza Mabini, or Masasa Beach in nearby Tingloy.";
  }
  if (/\b(help|what can i do|things to do|attractions|places to visit|recommend|suggest|ano|pwedeng|puwede|gawin|pasyalan)\b/.test(text)) {
    if (filipino) {
      return "Sa Mabini, puwede kang magtanong sa lokal na operator tungkol sa diving o snorkeling sa Anilao, magkumpirma ng trail access bago mag-hike sa Mt. Gulugod Baboy, bumisita sa Plaza Mabini sa Poblacion, o magtanong sa mga coastal resort tungkol sa tuluyan at activities. Nasa hiwalay na munisipalidad ng Tingloy ang Masasa Beach at kailangan ng hiwalay na kumpirmadong biyahe sa bangka.";
    }
    return "In Mabini, you can arrange diving or snorkeling around Anilao, hike Mt. Gulugod Baboy after confirming trail access, visit Plaza Mabini in Poblacion, or ask coastal resorts about stays and activities. Masasa Beach is in nearby Tingloy, a separate island municipality, and needs separately confirmed boat transport.";
  }
  return "";
}

function appendLocalChatAnswer(question, answer) {
  const localAnswer = `Quick local guide: ${answer}`;
  chatHistory = [
    ...chatHistory.slice(-8),
    { role: "user", content: question },
    { role: "assistant", content: localAnswer },
  ];
  appendChatMessage(localAnswer, "assistant local");
}

async function sendChatMessage(message) {
  const prompt = message.trim();
  if (!prompt || chatPending) return;

  chatPending = true;
  chatSend.disabled = true;
  chatInput.disabled = true;
  chatSuggestions.hidden = true;
  appendChatMessage(prompt, "user");
  const typing = document.createElement("div");
  typing.className = "chat-message assistant typing";
  typing.setAttribute("role", "status");
  typing.setAttribute("aria-label", "Assistant is typing");
  typing.innerHTML =
    '<p aria-hidden="true"><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span></p>';
  chatMessages.append(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const messages = [
    ...chatHistory.slice(-8),
    { role: "user", content: prompt },
  ];

  if (window.location.protocol === "file:") {
    typing.remove();
    const localAnswer = getLocalMabiniAnswer(prompt);
    if (localAnswer) {
      appendLocalChatAnswer(prompt, localAnswer);
    } else {
      appendChatMessage(
        isFilipinoQuestion(prompt)
          ? "Pasensya na, wala pa akong sapat na mapagkakatiwalaang impormasyon para sagutin iyan sa lokal na preview. Maaari akong tumulong tungkol sa biyahe Manila–Mabini, Mt. Gulugod Baboy, Anilao, Masasa Beach, mga matutuluyan, at pangkalahatang ideya sa paglalakbay. Para sa iba pang tanong, kailangang naka-deploy ang AI chat service."
          : "I don't have enough reliable local information to answer that yet. I can help with routes between Manila and Mabini, Mt. Gulugod Baboy, Anilao, Masasa Beach, local stays, and general trip ideas. For other open-ended questions, AI answers require the site's chat service to be deployed.",
        "assistant error",
      );
    }
    chatPending = false;
    chatSend.disabled = false;
    chatInput.disabled = false;
    chatInput.value = "";
    chatInput.style.height = "";
    chatInput.focus();
    return;
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ messages }),
    });
    let result;
    try {
      result = await response.json();
    } catch {
      const error = new Error("The chat service returned an invalid response.");
      error.status = response.status;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(result.error || "Chat request failed");
      error.status = response.status;
      throw error;
    }
    if (typeof result.answer !== "string" || !result.answer.trim()) {
      throw new Error("The assistant returned an empty response.");
    }

    chatHistory = [
      ...messages,
      { role: "assistant", content: result.answer.trim() },
    ];
    typing.remove();
    appendChatMessage(
      result.answer.trim(),
      "assistant",
      Array.isArray(result.sources) ? result.sources : [],
    );
  } catch (error) {
    typing.remove();
    const localAnswer = getLocalMabiniAnswer(prompt);
    if (localAnswer) {
      appendLocalChatAnswer(prompt, localAnswer);
    } else {
      const messageText =
        error.status === 429
          ? isFilipinoQuestion(prompt)
            ? "Naabot na ang kasalukuyang free-tier limit ng AI o live search. Pakisubukan muli mamaya."
            : "The AI or live-search free-tier limit has been reached. Please try again later."
          : error.status === 400
            ? "I couldn't process that message. Please try asking it another way."
            : error.status === 403 || error.status === 404 || error.status === 503
              ? isFilipinoQuestion(prompt)
                ? "Hindi pa nakakonekta ang AI at live-search service sa site na ito. Para masagot ang iba’t ibang tanong, i-deploy ang site sa Cloudflare Pages at idagdag ang GEMINI_API_KEY at TAVILY_API_KEY bilang encrypted secrets."
                : "The AI and live-search services aren't configured for this site yet. To answer a broad range of questions, deploy it on Cloudflare Pages and add GEMINI_API_KEY and TAVILY_API_KEY as encrypted secrets."
              : error.status
                ? "The AI service is temporarily unavailable. Please try again shortly."
                : "I can't reach the AI service right now, and I don't have enough reliable local information for that answer. Try asking about Manila–Mabini transport, Gulugod Baboy, Anilao, or Masasa Beach.";
      appendChatMessage(messageText, "assistant error");
    }
    console.error("Mabini chat request failed:", error);
  } finally {
    chatPending = false;
    chatSend.disabled = false;
    chatInput.disabled = false;
    chatInput.value = "";
    chatInput.style.height = "";
    chatInput.focus();
  }
}

chatToggle.addEventListener("click", () =>
  setChatOpen(chatPanel.hidden),
);
$("#chatClose").addEventListener("click", () => setChatOpen(false));
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  void sendChatMessage(chatInput.value);
});
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});
chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 100)}px`;
});
$$("[data-chat-prompt]").forEach((button) =>
  button.addEventListener("click", () =>
    void sendChatMessage(button.dataset.chatPrompt),
  ),
);
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
