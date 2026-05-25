const slides = Array.from(document.querySelectorAll(".slide"));
const dots = document.getElementById("dots");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let activeIndex = 0;

const architectureDetails = {
  presentation: {
    title: "Presentation",
    detail: "React.js keeps invoice forms, dashboards, and search in one controlled interface before data reaches the backend."
  },
  api: {
    title: "API Layer",
    detail: "Node.js/Express owns validation, authentication, business rules, duplicate checks, and secure handoff to storage services."
  },
  data: {
    title: "Data Layer",
    detail: "PostgreSQL stores invoice, client, finance, payment status, transaction reference, and full audit data for flexible operations."
  },
  blockchain: {
    title: "Blockchain",
    detail: "Hyperledger Fabric receives only verified paid invoice summaries, giving confirmed payments an immutable audit record."
  }
};

const workflowSteps = [
  ["Step 1: Employee logs in with authorized account", "The process begins with a controlled user identity before any invoice data is entered."],
  ["Step 2: Enters invoice, client, and payment details", "Structured data entry captures the invoice, client, journal, country, amount, date, and payment fields."],
  ["Step 3: Backend validates fields and permissions", "The API checks required fields, accepted status values, user rights, date format, and amount rules."],
  ["Step 4: Duplicate journal number check", "Existing journal numbers are blocked before a record can create a conflict in finance data."],
  ["Step 5: Invoice saved as Pending or Unpaid", "Operational records stay in PostgreSQL while payment evidence is still being reviewed."],
  ["Step 6: Authorized verifier reviews payment evidence", "Only a verifier can decide whether the invoice is confirmed enough to move into the paid path."],
  ["Step 7: Verifier marks as Paid", "The system records who verified the payment and when the status changed."],
  ["Step 8: Backend submits summary to Hyperledger Fabric", "The backend sends a minimized paid-invoice summary, not every operational detail."],
  ["Step 9: Fabric endorses and commits transaction", "Fabric policies approve the transaction and commit it to the ledger."],
  ["Step 10: Transaction ID stored in PostgreSQL", "The blockchain transaction reference is written back to the dashboard for search, reporting, and audit."],
];

function buildDots() {
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.className = "dot";
    button.type = "button";
    button.setAttribute("aria-label", `Go to slide ${index + 1}: ${slide.dataset.title}`);
    button.addEventListener("click", () => goToSlide(index));
    dots.appendChild(button);
  });
}

function goToSlide(index) {
  const bounded = Math.max(0, Math.min(index, slides.length - 1));
  const previous = activeIndex;
  activeIndex = bounded;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === activeIndex);
    slide.classList.toggle("prev-out", i === previous && previous > activeIndex);
  });

  Array.from(dots.children).forEach((dot, i) => {
    dot.classList.toggle("active", i === activeIndex);
    dot.setAttribute("aria-current", i === activeIndex ? "step" : "false");
  });

  progressBar.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
  prevBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex === slides.length - 1;
  window.location.hash = `slide-${activeIndex + 1}`;
}

function nextSlide() {
  goToSlide(activeIndex + 1);
}

function prevSlide() {
  goToSlide(activeIndex - 1);
}

function initNavigation() {
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  document.addEventListener("keydown", (event) => {
    const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
    if (tag === "button" && event.key === " ") return;

    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      nextSlide();
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      prevSlide();
    }
    if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goToSlide(slides.length - 1);
    }
  });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => goToSlide(Number(button.dataset.go)));
  });

  fullscreenBtn.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  });
}

function initArchitecture() {
  const title = document.getElementById("archTitle");
  const detail = document.getElementById("archDetail");
  document.querySelectorAll(".layer-node").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".layer-node").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      const item = architectureDetails[button.dataset.layer];
      title.textContent = item.title;
      detail.textContent = item.detail;
    });
  });
}

function initWorkflow() {
  const title = document.getElementById("workflowTitle");
  const detail = document.getElementById("workflowDetail");

  document.querySelectorAll(".step-node").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".step-node").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      const [stepTitle, stepDetail] = workflowSteps[Number(button.dataset.step)];
      title.textContent = stepTitle;
      detail.textContent = stepDetail;
    });
  });

  document.querySelectorAll("[data-path]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-path]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const pending = button.dataset.path === "pending";
      document.querySelectorAll(".paid-path").forEach((node) => node.classList.toggle("dimmed", pending));
      if (pending) {
        title.textContent = "Unpaid / Pending Path";
        detail.textContent = "Invoice remains in PostgreSQL only. No blockchain submission occurs. It can be updated to Paid later by an authorized verifier, with audit logs recording all status changes.";
      } else {
        const activeStep = document.querySelector(".step-node.active");
        const index = activeStep ? Number(activeStep.dataset.step) : 0;
        title.textContent = workflowSteps[index][0];
        detail.textContent = workflowSteps[index][1];
      }
    });
  });
}

function initRequirements() {
  const reqId = document.getElementById("reqId");
  const reqTitle = document.getElementById("reqTitle");
  const reqDetail = document.getElementById("reqDetail");

  function selectRequirement(row) {
    document.querySelectorAll(".req-row").forEach((item) => item.classList.remove("active"));
    row.classList.add("active");
    reqId.textContent = row.dataset.id;
    reqTitle.textContent = row.querySelector("strong").textContent;
    reqDetail.textContent = row.dataset.detail;
  }

  document.querySelectorAll(".req-row").forEach((row) => {
    row.addEventListener("click", () => {
      selectRequirement(row);
    });
  });

  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      document.querySelectorAll(".req-row").forEach((row) => {
        row.classList.toggle("hidden", filter !== "all" && row.dataset.priority !== filter);
      });
      const visibleActive = document.querySelector(".req-row.active:not(.hidden)");
      const firstVisible = document.querySelector(".req-row:not(.hidden)");
      if (!visibleActive && firstVisible) {
        selectRequirement(firstVisible);
      }
    });
  });
}

function initSecurity() {
  const title = document.getElementById("securityTitle");
  const detail = document.getElementById("securityDetail");
  document.querySelectorAll(".security-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      document.querySelectorAll(".security-tile").forEach((item) => item.classList.remove("active"));
      tile.classList.add("active");
      title.textContent = tile.dataset.security;
      detail.textContent = tile.dataset.detail;
    });
  });
}

function initTimeline() {
  document.querySelectorAll(".phase").forEach((phase) => {
    phase.addEventListener("click", () => {
      document.querySelectorAll(".phase").forEach((item) => item.classList.remove("active"));
      phase.classList.add("active");
      document.querySelectorAll(".deliverable").forEach((card) => {
        card.classList.toggle("active", card.dataset.phaseCard === phase.dataset.phase);
      });
    });
  });
}

function initStars() {
  const stars = document.querySelector(".stars");
  if (!stars) return;

  for (let i = 0; i < 90; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${(i * 47) % 100}%`;
    star.style.top = `${(i * 83) % 100}%`;
    star.style.animationDelay = `${(i % 12) * 0.22}s`;
    star.style.animationDuration = `${2.2 + (i % 9) * 0.18}s`;
    stars.appendChild(star);
  }
}

function initHash() {
  const match = window.location.hash.match(/slide-(\d+)/);
  if (match) {
    goToSlide(Number(match[1]) - 1);
  } else {
    goToSlide(0);
  }
}

buildDots();
initNavigation();
initArchitecture();
initWorkflow();
initRequirements();
initSecurity();
initTimeline();
initStars();
initHash();
window.addEventListener("hashchange", initHash);
