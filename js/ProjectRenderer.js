// js/ProjectRenderer.js

/**
 * 프로젝트 데이터를 받아 화면에 렌더링하는 클래스입니다.
 */
export default class ProjectRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    /**
     * 프로젝트 데이터 배열을 받아서 각 카드 요소를 생성하고 컨테이너에 추가합니다.
     * @param {Array} projects 프로젝트 정보 배열
     */
    render(projects) {
        if (!this.container) {
            console.error('Project container not found!');
            return;
        }

        this.container.innerHTML = ''; // 초기화

        projects.forEach((project, index) => {
            const card = this.createCard(project);
            // 애니메이션 딜레이 설정 (순차적 등장 효과)
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-up-element'); 
            this.container.appendChild(card);
        });
    }

    /**
     * 개별 프로젝트 데이터를 기반으로 DOM 요소를 생성합니다.
     * @param {Object} project 프로젝트 정보 객체
     * @returns {HTMLElement} 생성된 카드 요소
     */
    createCard(project) {
        const a = document.createElement('a');
        a.href = project.link;
        a.className = 'project-card';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        // Tags HTML 생성
        const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        a.innerHTML = `
            <div class="card-image-wrap">
                <img src="${project.thumbnail}" alt="${project.title} thumbnail" loading="lazy">
            </div>
            <div class="card-content">
                <h3 class="card-title">${project.title}</h3>
                <p class="card-desc">${project.description}</p>
                <div class="card-tags">
                    ${tagsHtml}
                </div>
                <span class="card-link">View Project</span>
            </div>
        `;

        return a;
    }
}
