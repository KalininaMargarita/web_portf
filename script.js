/**
 * Портфолио Калининой Маргариты
 * JavaScript функционал:
 * 1. Переключатель темы (светлая/тёмная)
 * 2. Плавная прокрутка к секциям
 * 3. Мобильное меню (бургер)
 * 4. Модальное окно для изображений
 * 5. Анимации при скролле
 * 6. Динамический цвет фона на основе видимого контента
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // Динамический цвет фона
    // ==========================================
    
    // Цвета для разных секций и проектов
    const sectionColors = {
        hero: { r: 255, g: 200, b: 180 },      // Персиковый (под аватар)
        about: { r: 180, g: 200, b: 180 },     // Мятный
        skills: { r: 255, g: 180, b: 100 },    // Оранжевый (игровой)
        kkat: { r: 193, g: 154, b: 139 },      // Коричнево-персиковый (под котика)
        photobook: { r: 120, g: 130, b: 110 }, // Серо-оливковый (под текстуры)
        video: { r: 100, g: 120, b: 140 },     // Серо-синий
        contacts: { r: 200, g: 180, b: 190 }   // Пыльно-розовый
    };
    
    // Текущий и целевой цвет
    let currentColor = { ...sectionColors.hero };
    let targetColor = { ...sectionColors.hero };
    
    // Плавная интерполяция цвета
    const lerpColor = (current, target, factor) => ({
        r: current.r + (target.r - current.r) * factor,
        g: current.g + (target.g - current.g) * factor,
        b: current.b + (target.b - current.b) * factor
    });
    
    // Адаптация цвета под тему
    const adjustColorForTheme = (color) => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            return {
                r: Math.round(color.r * 0.15),
                g: Math.round(color.g * 0.15),
                b: Math.round(color.b * 0.15)
            };
        } else {
            return {
                r: Math.round(color.r + (255 - color.r) * 0.7),
                g: Math.round(color.g + (255 - color.g) * 0.7),
                b: Math.round(color.b + (255 - color.b) * 0.7)
            };
        }
    };
    
    // Анимация фона
    const animateBackground = () => {
        currentColor = lerpColor(currentColor, targetColor, 0.05);
        const bgColor = adjustColorForTheme(currentColor);
        
        const r2 = Math.max(0, bgColor.r - 15);
        const g2 = Math.max(0, bgColor.g - 15);
        const b2 = Math.max(0, bgColor.b - 15);
        
        document.body.style.background = `linear-gradient(145deg, 
            rgb(${Math.round(bgColor.r)}, ${Math.round(bgColor.g)}, ${Math.round(bgColor.b)}) 0%, 
            rgb(${r2}, ${g2}, ${b2}) 100%)`;
        
        requestAnimationFrame(animateBackground);
    };
    
    animateBackground();
    
    // Определяем что сейчас на экране
    const detectVisibleContent = () => {
        const viewportCenter = window.innerHeight / 2;
        const scrollY = window.scrollY;
        
        // Проверяем проекты
        const kkatProject = document.querySelector('.project:nth-child(1)');
        const photobookProject = document.querySelector('.project:nth-child(2)');
        const videoProject = document.querySelector('.project:nth-child(3)');
        
        // Проверяем секции
        const sections = {
            hero: document.getElementById('hero'),
            about: document.getElementById('about'),
            skills: document.getElementById('skills'),
            projects: document.getElementById('projects'),
            contacts: document.getElementById('contacts')
        };
        
        // Функция проверки видимости элемента в центре экрана
        const isInCenter = (el) => {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.top < viewportCenter && rect.bottom > viewportCenter;
        };
        
        // Определяем цвет по приоритету (проекты важнее секций)
        if (kkatProject && isInCenter(kkatProject)) {
            targetColor = sectionColors.kkat;
        } else if (photobookProject && isInCenter(photobookProject)) {
            targetColor = sectionColors.photobook;
        } else if (videoProject && isInCenter(videoProject)) {
            targetColor = sectionColors.video;
        } else if (isInCenter(sections.hero)) {
            targetColor = sectionColors.hero;
        } else if (isInCenter(sections.about)) {
            targetColor = sectionColors.about;
        } else if (isInCenter(sections.skills)) {
            targetColor = sectionColors.skills;
        } else if (isInCenter(sections.contacts)) {
            targetColor = sectionColors.contacts;
        }
    };
    
    // Слушаем скролл
    window.addEventListener('scroll', detectVisibleContent, { passive: true });
    detectVisibleContent();
    // ==========================================
    // Переключатель темы
    // ==========================================
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Проверяем сохранённую тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        html.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Добавляем небольшую анимацию кнопке
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    // ==========================================
    // Плавная прокрутка к секциям
    // ==========================================
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Закрываем мобильное меню если открыто
                navMenu.classList.remove('active');
                navBurger.classList.remove('active');
                document.body.style.overflow = '';
                
                // Плавная прокрутка
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ==========================================
    // Мобильное меню (бургер)
    // ==========================================
    const navBurger = document.querySelector('.nav__burger');
    const navMenu = document.querySelector('.nav__menu');
    
    navBurger.addEventListener('click', () => {
        navBurger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Блокируем скролл body когда меню открыто
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navBurger.contains(e.target)) {
            navMenu.classList.remove('active');
            navBurger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ==========================================
    // Модальное окно для изображений
    // ==========================================
    const modal = document.getElementById('imageModal');
    const modalImage = modal.querySelector('.modal__image');
    const modalClose = modal.querySelector('.modal__close');
    
    // Все кликабельные изображения
    const clickableImages = document.querySelectorAll(
        '.project__main-image img, .emotion-card img, .photobook__item img'
    );
    
    clickableImages.forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Закрытие модального окна
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // ==========================================
    // Анимации при скролле
    // ==========================================
    const animatedElements = document.querySelectorAll(
        '.about__card, .about__education, .education-card, .inventory, ' +
        '.project, .contact-card, .inventory__slot:not(.inventory__slot--empty)'
    );
    
    // Добавляем класс для анимации
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Для слотов инвентаря добавляем задержку
                if (entry.target.classList.contains('inventory__slot')) {
                    const slots = document.querySelectorAll('.inventory__slot:not(.inventory__slot--empty)');
                    const index = Array.from(slots).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
    
    // ==========================================
    // Эффект параллакса для hero секции
    // ==========================================
    const heroAvatar = document.querySelector('.hero__avatar-wrapper');
    
    if (heroAvatar && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPos = (clientX / innerWidth - 0.5) * 20;
            const yPos = (clientY / innerHeight - 0.5) * 20;
            
            heroAvatar.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    }
    
    // ==========================================
    // Подсветка активной секции в навигации
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav__link');
    
    const updateActiveSection = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    
    // ==========================================
    // Скрытие подсказки скролла после прокрутки
    // ==========================================
    const scrollHint = document.querySelector('.hero__scroll-hint');
    
    if (scrollHint) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollHint.style.opacity = '0';
            } else {
                scrollHint.style.opacity = '1';
            }
        }, { passive: true });
    }
    
    console.log('🎨 Портфолио загружено! Создано с помощью Cursor AI');
});
