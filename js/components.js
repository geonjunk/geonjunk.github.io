(() => {
  class CareerEntry extends HTMLElement {
    connectedCallback() {
      const article = document.createElement("article");
      article.className = "career-item";

      const period = document.createElement("p");
      period.className = "career-item-period";
      period.textContent = this.getAttribute("period") || "";

      const detail = document.createElement("div");
      const company = document.createElement("p");
      company.className = "career-item-company";
      company.textContent = this.getAttribute("company") || "";

      const department = document.createElement("p");
      department.className = "career-item-department";
      department.textContent = this.getAttribute("department") || "";

      detail.append(company, department);
      article.append(period, detail);
      this.replaceWith(article);
    }
  }

  class ComparisonDiagram extends HTMLElement {
    connectedCallback() {
      this.classList.add("perf-diagram");
      this.setAttribute("role", "img");
      if (!this.hasAttribute("aria-label")) {
        this.setAttribute("aria-label", "개선 전후 비교 다이어그램");
      }
    }
  }

  class ProjectCompany extends HTMLElement {
    connectedCallback() {
      this.classList.add("project-company");
      const name = document.createElement("p");
      name.textContent = this.getAttribute("name") || "";
      this.replaceChildren(name);
    }
  }

  const projectHeading = (block) =>
    block.querySelector(":scope > h4")?.textContent.trim() || "";

  const addProjectTech = (article, technologies) => {
    const list = article?.querySelector(".project-tech ul");
    if (!list) return;
    technologies.forEach((technology) => {
      const exists = [...list.querySelectorAll(":scope > li")].some(
        (item) => item.textContent.trim() === technology,
      );
      if (exists) return;
      const item = document.createElement("li");
      item.textContent = technology;
      list.appendChild(item);
    });
  };

  const setProjectCompany = (article, company) => {
    const period = article?.querySelector(".project-period");
    if (!period) return;
    period.querySelector("project-company, .project-company")?.remove();
    const companyBlock = document.createElement("project-company");
    companyBlock.setAttribute("name", company);
    period.prepend(companyBlock);
  };

  const classifyProjectBlocks = (blocks) => {
    blocks.forEach((block) => {
      const name = projectHeading(block);
      if (name === "프로젝트 요약") block.remove();
      else if (name === "사용 기술") block.classList.add("project-tech");
      else if (name === "주요 성과") block.classList.add("project-achievements");
      else if (
        name.startsWith("주요 이슈") ||
        name === "주요이슈 - 가입 프로세스 개선" ||
        name === "해결방안" ||
        name === "해결 방안" ||
        name === "결과"
      ) {
        block.classList.add("project-issues");
      } else if (name === "문제 사항") block.classList.add("project-problem");
      else if (name === "도입 내용") block.classList.add("project-introduction");
    });
  };

  const createIssueToggle = (body, issueBlocks) => {
    if (!issueBlocks.length) return;
    const firstIssueHeading = issueBlocks[0].querySelector(":scope > h4");
    const details = document.createElement("details");
    details.className = "project-issue-toggle";

    const summary = document.createElement("summary");
    summary.textContent =
      firstIssueHeading?.textContent.trim() || "주요 이슈 자세히 보기";

    const content = document.createElement("div");
    content.className = "project-issue-toggle-content";
    firstIssueHeading?.remove();

    const duplicateProblemHeading = [
      ...issueBlocks[0].querySelectorAll("h5"),
    ].find((heading) => heading.textContent.trim() === "문제사항");
    duplicateProblemHeading?.remove();

    const problemHeading = document.createElement("h4");
    problemHeading.className = "mt-5 mb-2 font-bold text-zinc-950";
    problemHeading.textContent = "문제사항";
    const issueDiagram = issueBlocks[0].querySelector(":scope > .rounded-lg");
    if (issueDiagram) issueDiagram.insertAdjacentElement("afterend", problemHeading);
    else issueBlocks[0].prepend(problemHeading);

    issueBlocks.forEach((block) => content.appendChild(block));
    details.append(summary, content);
    body.appendChild(details);
  };

  const configureProject = (article, type = "standard") => {
    const body = article.querySelector(":scope > .mt-5.space-y-6");
    if (!body) return;
    classifyProjectBlocks([...body.children]);

    const remaining = [...body.children];
    const pick = (className) =>
      remaining.find((block) => block.classList.contains(className));
    const all = (className) =>
      remaining.filter((block) => block.classList.contains(className));
    const period = pick("project-period");
    const issueBlocks = all("project-issues");
    const ordered =
      type === "internal"
        ? [pick("project-problem"), pick("project-introduction"), pick("project-achievements")]
        : [period, ...all("project-tech"), ...all("project-achievements"), ...issueBlocks];

    ordered.filter(Boolean).forEach((block) => body.appendChild(block));
    if (type === "standard") createIssueToggle(body, issueBlocks);
  };

  customElements.define("career-entry", CareerEntry);
  customElements.define("comparison-diagram", ComparisonDiagram);
  customElements.define("project-company", ProjectCompany);

  document.querySelectorAll(".perf-diagram").forEach((diagram) => {
    if (diagram.matches("comparison-diagram")) return;
    const component = document.createElement("comparison-diagram");
    [...diagram.attributes].forEach(({ name, value }) =>
      component.setAttribute(name, value),
    );
    component.append(...diagram.childNodes);
    diagram.replaceWith(component);
  });

  window.ResumeComponents = {
    addProjectTech,
    configureProject,
    setProjectCompany,
  };
})();
