/**
 * 공통 사이드바 모듈
 * @class SidebarModule
 * @athor 방선우
 */
class SidebarModule {
    constructor(options = {}) {
        // 기본 옵션 설정
        this.options = {
            mainContainer: '',
            contentContainer: '',
            sideContainer: '',
            toggleContainer: '',
            defaultWidth: 300,
            minWidth: 200,
            maxWidth: 600,
            storageKey: 'sidebarToggleYn',
            autoCreate: true,
            ...options
        };

        // 상태 변수
        this.isResizing = false;
        this.startX = 0;
        this.startWidth = 0;

        // DOM 요소
        this.elements = {};

        // 초기화
        if (this.options.autoCreate) {
            this.init();
        }
    }

    /**
     * 사이드바 초기화
     */
    init() {
        this.createHTML();
        this.bindEvents();
        this.loadStoredState();
        document.documentElement.style.setProperty('--content-width', this.options.defaultWidth + 'px');
    }

    /**
     * HTML 구조 생성
     */
    createHTML() {
        const mainContainer = document.getElementById(this.options.mainContainer);
        mainContainer.classList.add('main-container');

        const contentContainer = document.getElementById(this.options.contentContainer);
        contentContainer.classList.add('content-container');

        const sideContainer = document.getElementById(this.options.sideContainer);
        sideContainer.classList.add('side-container');

        const toggleContainer = document.getElementById(this.options.toggleContainer);

        if (!sideContainer) {
            console.error(`Container element with id '${this.options.sideContainer}' not found`);
            return;
        }

        const html = `
                    <div class="sidebar-module" id="sidebar">
                        <div class="sidebar-resizer" id="sidebarResizer"></div>
                        <div style="text-align: right;">
                            <button id="sidebarBtn" class="sidebar-toggle">☰</button>
                        </div>
                        <div class="sidebar-content" id="sidebarContent">
                            <h3>사이드바 컨텐츠</h3>
                            <p>여기에 동적 컨텐츠가 로드됩니다.</p>
                        </div>
                    </div>
                `;
        const html2 = `
                    <div class="toggle-container">
                        <input type="checkbox" id="sidebarToggle" class="sidebar-toggle-input">
                        <label for="sidebarToggle" class="sidebar-toggle-switch">
                            <span id="toggle-button" class="toggle-button"></span>
                        </label>
                    </div>
        `;

        sideContainer.innerHTML = html;
        toggleContainer.innerHTML = html2;

        // DOM 요소 참조 저장
        this.elements.container = sideContainer;
        this.elements.mainContainer = mainContainer;
        this.elements.contentContainer = contentContainer;
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.toggle = document.getElementById('sidebarToggle');
        this.elements.toggleBtn = document.getElementById('sidebarBtn');
        this.elements.resizer = document.getElementById('sidebarResizer');
        this.elements.content = document.getElementById('sidebarContent');
    }

    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        // 토글 스위치 클릭
        this.elements.toggle.addEventListener('change', () => {
            this.handleToggleSave();
        });

        this.elements.toggleBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // 리사이저 이벤트
        this.elements.resizer.addEventListener('mousedown', (e) => {
            this.initResize(e);
        });
    }

    /**
     * 저장된 상태 로드
     */
    loadStoredState() {
        const storedState = localStorage.getItem(this.options.storageKey);
        if (storedState === 'true') {
            this.elements.toggle.checked = true;
        }
    }

    /**
     * 사이드바 토글
     */
    toggleSidebar() {
        const toggle = this.elements.toggle.checked;
        if(toggle) {
            this.elements.sidebar.classList.toggle('open');

            // 컨텐츠 영역도 함께 조정
            if (this.elements.sidebar.classList.contains('open')) {
                this.elements.contentContainer.classList.add('sidebar-open');
                this.enableResizer();
            } else {
                this.elements.contentContainer.classList.remove('sidebar-open');
                this.elements.sidebar.removeAttribute('style');
                this.disableResizer();
            }
        } else {
            close();
        }
    }

    /**
     * 사이드바 토글 유무 확인
     * */
    isToggle() {
        return this.elements.toggle.checked;
    }

    /**
     * 토글 저장 처리
     */
    handleToggleSave() {
        this.elements.sidebar.classList.remove('open');
        this.elements.contentContainer.classList.remove('sidebar-open');

        // localStorage 업데이트
        localStorage.removeItem(this.options.storageKey);
        localStorage.setItem(this.options.storageKey, this.elements.toggle.checked);
    }

    /**
     * 사이드바 콘텐츠 설정
     * @param {string} content - HTML 콘텐츠
     */
    setContent(content) {
        if (this.elements.content) {
            this.elements.content.innerHTML = content;
        }
    }

    /**
     * 리사이저 활성화
     */
    enableResizer() {
        this.elements.resizer.style.display = 'block';
    }

    /**
     * 리사이저 비활성화
     */
    disableResizer() {
        this.elements.resizer.style.display = 'none';
    }

    /**
     * 리사이징 시작
     */
    initResize(e) {
        this.isResizing = true;
        this.startX = e.clientX;
        this.elements.sidebar.classList.add('resizing');
        this.startWidth = parseInt(window.getComputedStyle(this.elements.sidebar).width, 10);

        document.body.classList.add('no-select');
        this.elements.resizer.classList.add('resizing');

        // 이벤트 리스너 추가
        this.boundDoResize = this.doResize.bind(this);
        this.boundStopResize = this.stopResize.bind(this);

        document.addEventListener('mousemove', this.boundDoResize);
        document.addEventListener('mouseup', this.boundStopResize);

        e.preventDefault();
    }

    /**
     * 리사이징 실행
     */
    doResize(e) {
        if (!this.isResizing) return;

        const dx = e.clientX - this.startX;
        let newWidth = this.startWidth - dx; // 방향 반대로 변경
        newWidth = Math.max(this.options.minWidth, Math.min(this.options.maxWidth, newWidth));

        // 사이드바 너비 설정
        document.documentElement.style.setProperty('--content-width', newWidth + 'px');

        // 콘텐츠 너비 조정
        if (this.elements.content) {
            this.elements.content.style.width = (newWidth - 20) + 'px';
        }

        e.preventDefault();
    }

    /**
     * 리사이징 종료
     */
    stopResize() {
        this.isResizing = false;

        document.body.classList.remove('no-select');
        this.elements.resizer.classList.remove('resizing');
        this.elements.sidebar.classList.remove('resizing');

        // 이벤트 리스너 제거
        document.removeEventListener('mousemove', this.boundDoResize);
        document.removeEventListener('mouseup', this.boundStopResize);
    }

    /**
     * 사이드바 강제 열기
     */
    open() {
        this.elements.sidebar.classList.add('open');
        this.elements.contentContainer.classList.add('sidebar-open');
        this.enableResizer();
    }

    /**
     * 사이드바 강제 닫기
     */
    close() {
        this.elements.sidebar.classList.remove('open');
        this.elements.contentContainer.classList.remove('sidebar-open');
        this.disableResizer();
    }

    /**
     * 사이드바 상태 확인
     */
    isOpen() {
        return this.elements.sidebar.classList.contains('open');
    }
}