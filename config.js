// ============ إعدادات الموقع ============
const siteConfig = {
  profile: {
    name: "Abdullah Ahmed",
    nameAr: "عبدالله أحمد",
    tagline: "مونتير فيديوهات ريلز محترف",
    email: "your@email.com",
    whatsapp: "201000000000",
    instagram: "yourusername",
  },

  projects: [
    {
      id: 1,
      title: "Reel — Hook قوي مع موشن جرافيك",
      description: "Hook قوي + موشن جرافيك + ترجمات جذابة + موسيقى تريند",
      videoId: "L956zYHjPMs",
      thumbnail: "https://img.youtube.com/vi/L956zYHjPMs/maxresdefault.jpg",
      tags: ["موشن جرافيك", "ترجمات"],
    },
    {
      id: 2,
      title: "Reel — تصحيح ألوان سينمائي",
      description: "تعديل سريع + تصحيح ألوان سينمائي + تأثيرات انتقال سلسة",
      videoId: "aY1pQbV9vnk",
      thumbnail: "https://img.youtube.com/vi/aY1pQbV9vnk/maxresdefault.jpg",
      tags: ["تصحيح ألوان", "تأثيرات"],
    },
    {
      id: 3,
      title: "YouTube Short — Storytelling",
      description: "ستوري تيلينج + نصوص متحركة + إيقاع سريع",
      videoId: "2zZlqrjOe8g",
      thumbnail: "https://img.youtube.com/vi/2zZlqrjOe8g/maxresdefault.jpg",
      tags: ["نصوص متحركة", "ستوري تيلينج"],
    },
    {
      id: 4,
      title: "TikTok — تريند سريع",
      description: "محتوى تريندي بإيقاع سريع ومؤثرات صوتية",
      videoId: "mLpMI7qb9Ec",
      thumbnail: "https://img.youtube.com/vi/mLpMI7qb9Ec/maxresdefault.jpg",
      tags: ["تريند", "مؤثرات"],
    },
  ],
};

// ============ تحميل المشاريع مع منع تشغيل فيديوين ============
function loadProjects() {
  const grid = document.getElementById("portfolio-grid");
  if (!grid) return;

  const validProjects = siteConfig.projects.filter(
    (p) => p.videoId && !p.videoId.startsWith("VIDEO_ID")
  );

  grid.innerHTML = validProjects
    .map(
      (project) => `
        <div class="video-card" data-aos="fade-up" data-card-id="${project.id}">
          <div class="video-container">
            <div class="video-placeholder"
                 data-video-id="${project.videoId}"
                 data-project-id="${project.id}"
                 role="button" tabindex="0"
                 aria-label="تشغيل ${project.title}">
              ${
                project.thumbnail
                  ? `<img src="${project.thumbnail}" alt="${project.title}" class="video-thumb" loading="lazy" onerror="this.style.display='none'" />`
                  : ""
              }
              <div class="play-btn" aria-hidden="true"><i class="fas fa-play"></i></div>
              <div class="video-overlay" aria-hidden="true"></div>
            </div>
          </div>
          <div class="video-info">
            <h3 class="video-title">${project.title}</h3>
            <p class="video-desc">${project.description}</p>
            <div class="video-tags">
              ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
          </div>
        </div>`
    )
    .join("");

  // ============ منع تشغيل فيديوين — الحل النهائي ============
  let activeContainer = null; // نحفظ الـ video-container النشط

  function restorePlaceholder(container) {
    // نجيب بيانات المشروع من data-project-id في الـ iframe أو من الكارت
    const card = container.closest(".video-card");
    const projectId = parseInt(card ? card.dataset.cardId : 0);
    const project = validProjects.find((p) => p.id === projectId);
    if (!project) return;

    const placeholder = document.createElement("div");
    placeholder.className = "video-placeholder";
    placeholder.dataset.videoId = project.videoId;
    placeholder.dataset.projectId = project.id;
    placeholder.setAttribute("role", "button");
    placeholder.setAttribute("tabindex", "0");
    placeholder.setAttribute("aria-label", `تشغيل ${project.title}`);
    placeholder.innerHTML = `
      ${project.thumbnail
        ? `<img src="${project.thumbnail}" alt="${project.title}" class="video-thumb" loading="lazy" onerror="this.style.display='none'" />`
        : ""}
      <div class="play-btn" aria-hidden="true"><i class="fas fa-play"></i></div>
      <div class="video-overlay" aria-hidden="true"></div>
    `;
    bindPlaceholder(placeholder);

    // استبدل الـ iframe بالـ placeholder
    const iframe = container.querySelector("iframe");
    if (iframe) container.replaceChild(placeholder, iframe);
  }

  function activateVideo(placeholder) {
    const container = placeholder.closest(".video-container");
    if (!container) return;

    // أوقف الفيديو السابق إذا كان مختلفاً
    if (activeContainer && activeContainer !== container) {
      restorePlaceholder(activeContainer);
    }

    const videoId = placeholder.dataset.videoId;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.title = "فيديو من أعمالي";

    container.replaceChild(iframe, placeholder);
    activeContainer = container;
  }

  function bindPlaceholder(placeholder) {
    placeholder.addEventListener("click", function () {
      activateVideo(this);
    });
    placeholder.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateVideo(this);
      }
    });
  }

  grid.querySelectorAll(".video-placeholder").forEach(bindPlaceholder);
}

document.addEventListener("DOMContentLoaded", loadProjects);
