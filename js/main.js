(() => {
        const labels = { Contact: "Contact", Blog: "Blog", Education: "Education", Career: "Career", Certificates: "Certificates", Training: "Training", Others: "Others", Skill: "Skills", Projects: "Projects", "Other Development": "Other Development" };
        let sections = [...document.querySelectorAll("main > section")];
        const projectList = document.querySelector(".projects-section > .space-y-14");
        const projectTitle = (article) => article.querySelector(":scope > h3")?.textContent.trim() || "";
        const { addProjectTech, configureProject, setProjectCompany } = window.ResumeComponents;
        if (projectList) {
          const originalProjects = [...projectList.querySelectorAll(":scope > .project-page")];
          const military = originalProjects.find((article) => projectTitle(article).includes("군인공제회"));
          let militaryBuild;
          let militaryOperation;
          if (military) {
            militaryBuild = military.cloneNode(true);
            militaryOperation = military.cloneNode(true);
            militaryBuild.querySelector(":scope > h3").textContent = "군인공제회 회원관리시스템 구축";
            militaryOperation.querySelector(":scope > h3").textContent = "군인공제회 회원관리시스템 운영";
            militaryBuild.querySelector(".project-period p").textContent = "2023.05 ~ 2023.12";
            militaryOperation.querySelector(".project-period p").textContent = "2024.01 ~ 2024.12";
            const buildAchievement = [...militaryBuild.querySelectorAll(":scope > .mt-5.space-y-6 > div")].find((block) => block.querySelector(":scope > h4")?.textContent.trim() === "주요 성과");
            const operationAchievement = [...militaryOperation.querySelectorAll(":scope > .mt-5.space-y-6 > div")].find((block) => block.querySelector(":scope > h4")?.textContent.trim() === "주요 성과");
            const buildSections = [...(buildAchievement?.querySelectorAll(":scope > .space-y-5 > div") || [])];
            const operationSections = [...(operationAchievement?.querySelectorAll(":scope > .space-y-5 > div") || [])];
            buildSections.slice(1).forEach((section) => section.remove());
            operationSections.slice(0, 1).forEach((section) => section.remove());
            buildAchievement?.querySelector("h5")?.remove();
            operationAchievement?.querySelector("h5")?.remove();
            const operationIssue = [...militaryOperation.querySelectorAll(":scope > .mt-5.space-y-6 > div")].find((block) => {
              const title = block.querySelector(":scope > h4")?.textContent.trim() || "";
              return title.startsWith("주요 이슈") || title === "주요이슈 - 가입 프로세스 개선";
            });
            operationIssue?.remove();
            military.remove();
            configureProject(militaryBuild);
            configureProject(militaryOperation);
            addProjectTech(militaryOperation, ["Jennifer"]);
          }
          const currentProjects = originalProjects.filter((article) => article !== military);
          currentProjects.forEach((article) => configureProject(article, article.querySelector(".project-period") ? "standard" : "internal"));
          const solution = currentProjects.find((article) => projectTitle(article) === "헤드리스 이커머스 솔루션 개선");
          const daemyung = currentProjects.find((article) => projectTitle(article).includes("대명 아임레디몰"));
          addProjectTech(solution, ["Elasticsearch", "Argo CD"]);
          addProjectTech(daemyung, ["Elasticsearch"]);
          setProjectCompany(solution, "플래티어");
          setProjectCompany(daemyung, "플래티어");
          setProjectCompany(militaryOperation, "노아에이티에스");
          setProjectCompany(militaryBuild, "노아에이티에스");
          const internal = currentProjects.filter((article) => !article.querySelector(".project-period"));
          [solution, daemyung, militaryOperation, militaryBuild].filter(Boolean).forEach((article) => projectList.appendChild(article));
          if (internal.length) {
            const internalSection = document.createElement("section");
            internalSection.className = "internal-projects-section mb-11";
            const internalHeading = document.createElement("h2");
            internalHeading.className = "mb-5 border-b border-zinc-300 pb-2 text-2xl font-bold leading-tight text-zinc-950";
            internalHeading.textContent = "Other Development";
            const internalList = document.createElement("div");
            internalList.className = "internal-project-list";
            internal.forEach((article) => internalList.appendChild(article));
            internalSection.append(internalHeading, internalList);
            projectList.closest("section").insertAdjacentElement("afterend", internalSection);
            sections = [...document.querySelectorAll("main > section")];
          }
        }
        const nav = document.querySelector("#section-links");
        sections.forEach((section, index) => {
          const headings = [...section.querySelectorAll(":scope > h2, :scope > div > div > h2")];
          const title = headings.map((h) => h.textContent.trim()).join(" · ") || `Section ${index + 1}`;
          section.id = `section-${index + 1}`;
          const link = document.createElement("a");
          link.href = `#${section.id}`;
          link.textContent = headings.length === 1 ? (labels[title] || title) : title;
          nav.appendChild(link);
        });
        const links = [...nav.querySelectorAll("a")];
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
          });
        }, { rootMargin: "-25% 0px -65%", threshold: 0 });
        sections.forEach((section) => observer.observe(section));
        const toggle = document.querySelector("#theme-toggle");
        const saved = localStorage.getItem("portfolio-theme");
        if (saved === "dark") document.body.classList.add("dark");
        toggle.addEventListener("click", () => {
          document.body.classList.toggle("dark");
          localStorage.setItem("portfolio-theme", document.body.classList.contains("dark") ? "dark" : "light");
        });
      })();
