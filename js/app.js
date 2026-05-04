// js/app.js
import ProjectRenderer from './ProjectRenderer.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. 프로젝트 렌더링 초기화
    const renderer = new ProjectRenderer('project-grid');
    
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        renderer.render(projects);
        
        // 렌더링 된 후 애니메이션 관찰자 재설정
        setupScrollAnimations();
    } catch (error) {
        console.error('Failed to load projects:', error);
        document.getElementById('project-grid').innerHTML = `
            <div style="color: var(--accent-primary); text-align: center; grid-column: 1 / -1;">
                <p>프로젝트 데이터를 불러오는데 실패했습니다.</p>
            </div>
        `;
    }

    // 2. 부드러운 스크롤 (헤더 링크)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

/**
 * 스크롤 시 요소들이 부드럽게 나타나는 애니메이션을 설정합니다.
 */
function setupScrollAnimations() {
    // 동적으로 생성된 요소를 위한 추가 스타일
    const style = document.createElement('style');
    style.textContent = `
        .fade-up-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up-element.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 한번 나타나면 관찰 중지
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up-element').forEach(el => {
        observer.observe(el);
    });
}
