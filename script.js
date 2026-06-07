// =============================================
// Hardcoded data (file:// CORS 방지)
// =============================================

const BBA_AI_QA_DATA = {
    booster: [
        { q: "Q. 부스터펌프 압력이 너무 급격히 변동합니다.", a: "압력 트랜스미터 설정값을 확인하고, 질소 탱크 압력을 보충해 주십시오." },
        { q: "Q. 부스터펌프 전동기가 작동하지 않습니다.", a: "컨트롤러 운전 모드가 'Auto'인지 확인하고, 마그네트 스위치 접점을 확인해 주십시오." }
    ],
    volute: [
        { q: "Q. 볼류트펌프 공동현상(Cavitation)이 발생합니다.", a: "유효흡입양정(NPSH) 부족입니다. 흡입 밸브를 열어 유량을 늘려 주시거나, 스트레이너를 청소해 주십시오." },
        { q: "Q. 운전 중 베어링 온도가 급격히 상승합니다.", a: "축 중심(Alignment) 불량이나 그리스 부족/오염 상태일 확률이 높습니다." }
    ],
    submersible: [
        { q: "Q. 수중펌프 누전 차단기(ELB)가 트립됩니다.", a: "케이블 손상이나 전동기 코일 침수 절연 저하일 수 있습니다. 절연 저항을 측정해 주십시오." },
        { q: "Q. 모터 회전 방향이 거꾸로 회전합니다.", a: "결상 또는 상순서 오류입니다. R-S-T 상 배선을 바꿔 상순서를 올바르게 설정해 주십시오." }
    ],
    sludge: [
        { q: "Q. 슬러지펌프 막힘 현상이 발생합니다.", a: "슬러지 덩어리가 유입구 폭에 맞지 않을 수 있습니다. 입구 전단에 파쇄기(Macerator) 설치를 고려해 주십시오." },
        { q: "Q. 메카니컬 씰 누수가 발생합니다.", a: "오링 마모나 고무 컵 파손일 수 있습니다. 씰 어셈블리를 해체하여 점검 후 교체해 주십시오." }
    ],
    mono: [
        { q: "Q. 모노펌프 토출량이 저하됩니다.", a: "스테이터(Stator) 마모에 의한 밀폐성 상실입니다. 로터와의 간극을 측정하여 교체 주기를 검토하십시오." },
        { q: "Q. 기동 토크가 정상 이상으로 높습니다.", a: "고형물이 흡입 챔버 내에서 굳었거나 메카니컬 씰 소착일 수 있습니다. 수동 회전 후 기동해 보십시오." }
    ]
};

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 모바일 햄버거 메뉴
    // =============================================
    const hamburger = document.querySelector('.hamburger');
    const gnb = document.querySelector('.gnb');

    if (hamburger && gnb) {
        hamburger.addEventListener('click', () => {
            gnb.classList.toggle('active');
            const spans = hamburger.querySelectorAll('span');
            if (gnb.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        document.querySelectorAll('.gnb a').forEach(link => {
            link.addEventListener('click', () => {
                gnb.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                if (spans.length >= 3) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }


    // =============================================
    // 탭 UI (intro.html, equipment.html)
    // =============================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabBtns.length > 0 && tabPanes.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    // =============================================
    // URL 해시 기반 탭 자동 활성화
    // =============================================
    const activateTabFromHash = () => {
        if (!window.location.hash) return;
        let hash = window.location.hash;

        // GNB 링크 해시와 탭 ID 매핑
        const hashMap = {
            '#overview':      '#tab-overview',
            '#organization':  '#tab-organization',
            '#performance':   '#tab-performance',
            '#certification': '#tab-certification',
            '#factory':       '#tab-factory',
            '#equipment':     '#tab-equipment',
        };

        const mappedHash = hashMap[hash] || hash;
        const targetBtn = Array.from(tabBtns).find(
            btn => btn.getAttribute('data-target') === mappedHash
        );

        if (targetBtn) {
            targetBtn.click();
            setTimeout(() => {
                const container = document.querySelector('.tab-container');
                if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    if (tabBtns.length > 0) {
        activateTabFromHash();
        window.addEventListener('hashchange', activateTabFromHash);
    }

    // =============================================
    // 기업 접근성 시뮬레이터 (Interactive Route Guide - Google Maps 연동)
    // =============================================
    const ROUTE_DATA = {
        location: {
            icon:     'fa-building',
            start:    '비에이텍(주) 본사',
            distance: '본사 위치',
            taxi:     '무료 주차',
            guide:    '강원특별자치도 춘천시 퇴계공단2길 64 (퇴계제2농공단지내)에 위치하고 있습니다.',
            badge:    true,
            naverUrl: 'https://map.naver.com/v5/entry/place/19794503?c=15,0,0,0,dh',
            kakaoUrl: 'https://map.kakao.com/link/map/비에이텍,37.84889,127.72906',
            embedUrl: 'https://maps.google.com/maps?q=37.84889,127.72906&t=&z=16&ie=UTF8&iwloc=&output=embed'
        },
        namchuncheon: {
            icon:     'fa-train',
            start:    '남춘천역',
            distance: '3.8 km',
            taxi:     '약 10분',
            guide:    '남춘천역 2번 출구 이용 / 퇴계공단 방면 시내버스 탑승 (환승 불필요)',
            badge:    true,
            naverUrl: 'https://map.naver.com/v5/directions/남춘천역/강원특별자치도%20춘천시%20퇴계공단2길%2064/-/-/transit',
            kakaoUrl: 'https://map.kakao.com/link/from/남춘천역,37.8662,127.7217/to/비에이텍,37.8489,127.7290',
            embedUrl: 'https://maps.google.com/maps?saddr=37.8638,127.7238&daddr=37.84889,127.72906&t=&z=14&ie=UTF8&iwloc=&output=embed'
        },
        terminal: {
            icon:     'fa-bus',
            start:    '춘천시외버스터미널',
            distance: '4.2 km',
            taxi:     '약 12분',
            guide:    '터미널 건너편 정류장 이용 / 시내버스 탑승 (약 5개 정류장 이동)',
            badge:    false,
            naverUrl: 'https://map.naver.com/v5/directions/춘천시외버스터미널/강원특별자치도%20춘천시%20퇴계공단2길%2064/-/-/transit',
            kakaoUrl: 'https://map.kakao.com/link/from/춘천시외버스터미널,37.8625,127.7230/to/비에이텍,37.8489,127.7290',
            embedUrl: 'https://maps.google.com/maps?saddr=37.8625,127.7230&daddr=37.84889,127.72906&t=&z=14&ie=UTF8&iwloc=&output=embed'
        },
        chuncheon: {
            icon:     'fa-car',
            start:    '춘천 IC (중앙고속도로)',
            distance: '3.5 km',
            taxi:     '약 8분 (자가용)',
            guide:    '춘천 IC 진출 후 퇴계공단 사거리 방면 직진 후 우회전',
            badge:    false,
            naverUrl: 'https://map.naver.com/v5/directions/춘천IC/강원특별자치도%20춘천시%20퇴계공단2길%2064/-/-/car',
            kakaoUrl: 'https://map.kakao.com/link/from/춘천IC,37.8540,127.7660/to/비에이텍,37.8489,127.7290',
            embedUrl: 'https://maps.google.com/maps?saddr=37.8540,127.7660&daddr=37.84889,127.72906&t=&z=14&ie=UTF8&iwloc=&output=embed'
        }
    };

    const routeTabBtns  = document.querySelectorAll('.route-tab-btn');
    const mapIframe     = document.getElementById('route-map-iframe');
    const mapLoading    = document.getElementById('map-loading');

    // 동적으로 교체되는 텍스트 요소
    const elIcon        = document.getElementById('route-icon');
    const elStartName   = document.getElementById('route-start-name');
    const elDistance    = document.getElementById('route-distance');
    const elTaxi        = document.getElementById('route-taxi');
    const elGuideText   = document.getElementById('route-guide-text');
    const elBadge       = document.querySelector('.route-card-badge');
    const elNaverLink   = document.getElementById('naver-route-link');
    const elKakaoLink   = document.getElementById('kakao-route-link');
    const elCardIcon    = document.querySelector('.route-card-icon i');

    // 애니메이션을 위한 fade 트리거 헬퍼
    const triggerFade = (el) => {
        if (!el) return;
        el.classList.remove('route-fade');
        void el.offsetWidth; // reflow 강제 발생으로 animation 재시작
        el.classList.add('route-fade');
    };

    // 지도 iframe src 교체 + 로딩 스피너 처리
    const updateMap = (embedUrl) => {
        if (!mapIframe) return;
        if (mapLoading) {
            mapLoading.style.display = 'flex';
            mapLoading.classList.remove('hidden');
        }
        mapIframe.src = embedUrl;
    };

    const switchRoute = (key) => {
        const data = ROUTE_DATA[key];
        if (!data) return;

        // 탭 active 클래스 토글
        routeTabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.route === key);
        });

        // 카드 헤더 아이콘 교체
        if (elCardIcon) {
            elCardIcon.className = `fas ${data.icon}`;
        }
        if (elIcon) {
            elIcon.className = `fas ${data.icon}`;
        }

        // 텍스트 요소 교체 + fade 애니메이션
        if (elStartName)  { elStartName.textContent  = data.start;    triggerFade(elStartName);  }
        if (elDistance)   { elDistance.textContent    = data.distance; triggerFade(elDistance);   }
        if (elTaxi)       { elTaxi.textContent        = data.taxi;     triggerFade(elTaxi);       }
        if (elGuideText)  { elGuideText.textContent   = data.guide;    triggerFade(elGuideText);  }

        // 추천 배지 표시/숨김
        if (elBadge) {
            elBadge.style.display = data.badge ? 'flex' : 'none';
        }

        // 외부 길찾기 링크 업데이트
        if (elNaverLink) elNaverLink.href = data.naverUrl;
        if (elKakaoLink) elKakaoLink.href = data.kakaoUrl;

        // 지도 교체 (구글 지도 iframe src 동적 반영)
        updateMap(data.embedUrl);
    };

    if (routeTabBtns.length > 0) {
        // 첫 번째 탭 활성화 (초기 상태 설정)
        switchRoute('location');

        // 탭 클릭 이벤트 바인딩
        routeTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchRoute(btn.dataset.route);
            });
        });

        // 페이지 최초 로드 시 지도 로딩 처리
        if (mapIframe && mapLoading) {
            mapIframe.addEventListener('load', () => {
                mapLoading.classList.add('hidden');
                mapLoading.style.display = 'none';
            });
        }
    }
});

// =============================================
// BGM 플로팅 플레이어 제어 (IIFE)
// =============================================
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const audio = document.getElementById('bgm-audio');
        const toggleBtn = document.getElementById('bgm-toggle-btn');
        if (!audio || !toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(() => {
                    toggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                }).catch(err => {
                    console.log("BGM 재생 실패 (브라우저 정책 또는 파일 로드 오류):", err);
                });
            } else {
                audio.pause();
                toggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    });
})();

// =============================================
// 문의 폼 조건부 필드 제어 (IIFE)
// =============================================
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const radioBtns = document.querySelectorAll('input[name="inquiryType"]');
        const quoteFields = document.getElementById('quote-fields');
        const form = document.getElementById('inquiryForm');
        
        if (radioBtns.length === 0 || !quoteFields) return;
        
        const quoteInputs = quoteFields.querySelectorAll('input:not([type="file"]), select');
        
        const updateFormFields = (typeValue) => {
            if (typeValue === 'quote') {
                quoteFields.style.display = 'block';
                quoteInputs.forEach(input => input.setAttribute('required', 'required'));
            } else {
                quoteFields.style.display = 'none';
                quoteInputs.forEach(input => input.removeAttribute('required'));
            }
        };
        
        radioBtns.forEach(btn => {
            btn.addEventListener('change', function() {
                updateFormFields(this.value);
            });
        });
        
        // 폼 리셋 시 디폴트('general')로 닫히게 처리
        if (form) {
            form.addEventListener('reset', () => {
                setTimeout(() => {
                    updateFormFields('general');
                }, 0);
            });
        }
    });
})();

// =============================================
// 현장 적용 사례 필터링 제어 (DOMContentLoaded)
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.ref-filter-btn[data-filter]');
    const galleryItems = document.querySelectorAll('.ref-gallery-item');

    if (filterBtns.length === 0 || galleryItems.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // 필터 버튼 활성화 상태 변경
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 아이템 필터링
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'flex';
                    // 부드러운 애니메이션 효과 적용
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                    // 트랜지션 시간 후 숨김 처리
                    setTimeout(() => {
                        if (item.style.opacity === '0') {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
});

// ==========================================
// UI 최적화 스크립트 (인디케이터 스크롤 스파이)
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const indicatorContainer = document.getElementById('main-scroll-indicator');
        if (!indicatorContainer) return;

        const snapTargets = document.querySelectorAll('main > .hero-video-container, main > .section');
        if (snapTargets.length === 0) return;

        // 도트 동적 생성
        indicatorContainer.innerHTML = '';
        snapTargets.forEach((target, index) => {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('data-index', index);
            indicatorContainer.appendChild(dot);
        });

        const dots = indicatorContainer.querySelectorAll('.indicator-dot');

        // 스크롤 시 활성 섹션 감지 (IntersectionObserver)
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(snapTargets).indexOf(entry.target);
                    if (index !== -1 && dots[index]) {
                        dots.forEach(dot => dot.classList.remove('active'));
                        dots[index].classList.add('active');
                    }
                }
            });
        }, observerOptions);

        snapTargets.forEach(target => {
            observer.observe(target);
        });

        // 클릭 시 해당 섹션으로 부드러운 스크롤 이동
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (snapTargets[index]) {
                    snapTargets[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    });
})();

// ==========================================
// 3D 브로슈어 모달 제어 (방어적 프로그래밍 적용)
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const openBtn = document.getElementById('open-brochure-btn');
        const brochureModal = document.getElementById('brochure-modal');
        const closeBtn = document.querySelector('.brochure-modal-close');
        const container = document.querySelector('.brochure-3d-container');

        if (openBtn && brochureModal && closeBtn && container) {
            // 모달 열기 함수
            const openBrochure = function() {
                brochureModal.classList.add('show');
                brochureModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // 메인 스크롤 방지
                
                setTimeout(() => {
                    container.classList.add('open');
                }, 50);
            };

            // 모달 닫기 함수
            const closeBrochure = function() {
                container.classList.remove('open');
                document.body.style.overflow = ''; // 스크롤 복구
                
                setTimeout(() => {
                    brochureModal.classList.remove('show');
                    brochureModal.classList.remove('active');
                }, 1200);
            };

            openBtn.addEventListener('click', openBrochure);
            closeBtn.addEventListener('click', closeBrochure);

            // 모달 배경 클릭 시 닫기
            brochureModal.addEventListener('click', function(e) {
                if (e.target === brochureModal) {
                    closeBrochure();
                }
            });

            // ESC 키 입력 시 닫기
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && (brochureModal.classList.contains('show') || brochureModal.classList.contains('active'))) {
                    closeBrochure();
                }
            });
        }
    });
})();

// ==========================================
// AI 챗봇 모달 제어 (방어적 프로그래밍 적용)
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const aiModal = document.getElementById('bba-ai-modal');
        const messagesBox = document.getElementById('bba-ai-messages-box');
        const closeBtn = document.getElementById('bba-ai-close-btn');
        const chipsWrap = document.getElementById('bba-ai-chips-wrap');
        const chips = document.querySelectorAll('.bba-ai-chip');

        if (aiModal && messagesBox && closeBtn && chipsWrap && chips.length > 0) {
            
            // 모달 닫기 함수
            const closeChat = () => {
                aiModal.classList.remove('bba-ai-active');
            };

            closeBtn.addEventListener('click', closeChat);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeChat();
                }
            });

            // Static chips click handler (default mono Q&A in support.html)
            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const index = chip.getAttribute('data-index');
                    let questionText = chip.textContent;
                    let responseText = "";

                    if (index === "1") {
                        responseText = "해당 증상은 스테이터(Stator) 내부 마모로 인한 밀폐력 저하일 확률이 높습니다. 지침서 12페이지 '간극 점검 절차'를 확인하세요.";
                    } else if (index === "2") {
                        responseText = "구동 커플링 정렬 상태 및 로터의 휨 여부를 확인하십시오. 베어링 마모 시 즉시 교체해야 합니다.";
                    } else if (index === "3") {
                        responseText = "사용 환경 및 운전 시간에 따라 다르나, 일반적으로 스테이터는 1년, 로터는 2년을 권장 주기(교체 사이클)로 하고 있습니다.";
                    }

                    if (responseText) {
                        // 1. 칩 숨기기
                        chipsWrap.classList.add('bba-ai-hidden');

                        // 2. 사용자 말풍선 추가
                        const userMsg = document.createElement('div');
                        userMsg.className = 'bba-ai-msg bba-ai-msg-user';
                        userMsg.textContent = questionText;
                        messagesBox.appendChild(userMsg);
                        messagesBox.scrollTop = messagesBox.scrollHeight;

                        // 3. 로딩 애니메이션 추가 (1.5초 노출)
                        const loadingMsg = document.createElement('div');
                        loadingMsg.className = 'bba-ai-msg bba-ai-msg-loading';
                        loadingMsg.id = 'bba-ai-temp-loading';
                        loadingMsg.innerHTML = `
                            자료를 검색 중입니다...
                            <span class="bba-ai-dots">
                                <span class="bba-ai-dot"></span>
                                <span class="bba-ai-dot"></span>
                                <span class="bba-ai-dot"></span>
                            </span>
                        `;
                        messagesBox.appendChild(loadingMsg);
                        messagesBox.scrollTop = messagesBox.scrollHeight;

                        // 4. 1.5초 후 답변 노출 및 칩 다시 표시
                        setTimeout(() => {
                            const tempLoading = document.getElementById('bba-ai-temp-loading');
                            if (tempLoading) {
                                tempLoading.remove();
                            }

                            const botMsg = document.createElement('div');
                            botMsg.className = 'bba-ai-msg bba-ai-msg-bot';
                            botMsg.textContent = responseText;
                            messagesBox.appendChild(botMsg);

                            // 칩을 하단으로 이동시키고 다시 노출
                            messagesBox.appendChild(chipsWrap);
                            void chipsWrap.offsetWidth; // 강제 리플로우
                            chipsWrap.classList.remove('bba-ai-hidden');

                            messagesBox.scrollTop = messagesBox.scrollHeight;
                        }, 1500);
                    }
                });
            });
        }
    });

    // 전역 함수 등록 (HTML onclick 연동)
    window.openBBA_AI = function(pumpType) {
        const aiModal = document.getElementById('bba-ai-modal');
        const messagesBox = document.getElementById('bba-ai-messages-box');
        if (!aiModal || !messagesBox) return;

        // 1. 기존 채팅창 비우고 기본 안내 멘트
        messagesBox.innerHTML = '';

        const introMsg = document.createElement('div');
        introMsg.className = 'bba-ai-msg bba-ai-msg-bot';
        introMsg.textContent = '자주 묻는 질문 검색기입니다. 발생한 증상을 선택해 주세요.';
        messagesBox.appendChild(introMsg);

        // 2. Q&A 칩 생성
        const qaData = BBA_AI_QA_DATA[pumpType];
        if (qaData) {
            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'bba-ai-chips-wrap';
            chipsWrap.id = 'bba-ai-chips-wrap';

            qaData.forEach((item) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'bba-ai-chip';
                button.textContent = item.q;
                button.addEventListener('click', () => {
                    chipsWrap.classList.add('bba-ai-hidden');

                    const userMsg = document.createElement('div');
                    userMsg.className = 'bba-ai-msg bba-ai-msg-user';
                    userMsg.textContent = item.q;
                    messagesBox.appendChild(userMsg);
                    messagesBox.scrollTop = messagesBox.scrollHeight;

                    const loadingMsg = document.createElement('div');
                    loadingMsg.className = 'bba-ai-msg bba-ai-msg-loading';
                    loadingMsg.id = 'bba-ai-temp-loading';
                    loadingMsg.innerHTML = `
                        자료를 검색 중입니다...
                        <span class="bba-ai-dots">
                            <span class="bba-ai-dot"></span>
                            <span class="bba-ai-dot"></span>
                            <span class="bba-ai-dot"></span>
                        </span>
                    `;
                    messagesBox.appendChild(loadingMsg);
                    messagesBox.scrollTop = messagesBox.scrollHeight;

                    setTimeout(() => {
                        const tempLoading = document.getElementById('bba-ai-temp-loading');
                        if (tempLoading) {
                            tempLoading.remove();
                        }

                        const botMsg = document.createElement('div');
                        botMsg.className = 'bba-ai-msg bba-ai-msg-bot';
                        botMsg.textContent = item.a;
                        messagesBox.appendChild(botMsg);

                        messagesBox.appendChild(chipsWrap);
                        void chipsWrap.offsetWidth;
                        chipsWrap.classList.remove('bba-ai-hidden');

                        messagesBox.scrollTop = messagesBox.scrollHeight;
                    }, 1500);
                });
                chipsWrap.appendChild(button);
            });

            messagesBox.appendChild(chipsWrap);
        }

        aiModal.classList.add('bba-ai-active');
        messagesBox.scrollTop = messagesBox.scrollHeight;
    };
})();

// ==========================================
// 통합 탭 전환 및 해시 라우팅 로직 (LNB 지원)
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const supportTabs = document.querySelectorAll('.support-tab');
        const supportContents = document.querySelectorAll('.support-tab-content');
        const aiModal = document.getElementById('bba-ai-modal');

        if (supportTabs.length > 0 && supportContents.length > 0) {
            supportTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    supportTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    const targetId = tab.getAttribute('data-target').replace('#', '');
                    supportContents.forEach(content => {
                        if (content.id === targetId) {
                            content.style.display = 'block';
                            content.classList.add('active');
                        } else {
                            content.style.display = 'none';
                            content.classList.remove('active');
                        }
                    });

                    // URL 해시 업데이트 & 히스토리 동기화
                    const hashVal = tab.getAttribute('data-target');
                    history.replaceState(null, null, hashVal);

                    if (aiModal) {
                        aiModal.classList.remove('bba-ai-active');
                    }
                });
            });

            const handleHashRouting = () => {
                const hash = window.location.hash;
                if (hash) {
                    const allowedHashes = ['#tab-inquiry', '#tab-library', '#tab-sharing', '#tab-list', '#tab-gallery', '#tab-analytics'];
                    if (allowedHashes.indexOf(hash) !== -1) {
                        const targetTab = document.querySelector(`.support-tab[data-target="${hash}"]`);
                        if (targetTab) {
                            targetTab.click();
                        }
                    }
                }
            };

            window.addEventListener('hashchange', handleHashRouting);
            handleHashRouting();
        }
    });
})();

// ==========================================
// ESG 캠페인 슬라이더 구동 로직
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const sliderWrapper = document.querySelector('.esg-slider-wrapper');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dots = document.querySelectorAll('.esg-dot');

        if (!sliderWrapper) return;

        let currentSlide = 0;
        const totalSlides = sliderWrapper.querySelectorAll('.esg-slide').length;

        function updateSlider() {
            if (currentSlide === 0) {
                sliderWrapper.style.transform = 'translateX(0%)';
            } else if (currentSlide === 1) {
                sliderWrapper.style.transform = 'translateX(-100%)';
            } else {
                sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            }

            // 점(Dot) 활성화 상태 표시
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'), 10);
                if (!isNaN(index)) {
                    currentSlide = index;
                    updateSlider();
                }
            });
        });
    });
})();

// ==========================================
// ESG 캠페인 포스터 클릭 시 확대 (Modal) 기능
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const posterWrappers = document.querySelectorAll('.esg-poster-wrapper');
        const esgModal = document.getElementById('esg-modal');
        const esgModalImg = document.getElementById('esg-modal-img');
        const closeModalBtn = document.querySelector('.esg-modal-close');

        if (!esgModal || !esgModalImg) return;

        posterWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                const img = wrapper.querySelector('.esg-poster');
                if (img) {
                    esgModalImg.src = img.src;
                    esgModal.style.display = 'block';
                }
            });
        });

        const closeModal = () => {
            esgModal.style.display = 'none';
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        esgModal.addEventListener('click', (e) => {
            if (e.target === esgModal) {
                closeModal();
            }
        });
    });
})();

// ==========================================
// 3D 브로슈어 자동 전개 및 접기 모션 제어 로직
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const openBrochureBtn = document.getElementById('open-brochure-btn');
        const brochureModal = document.getElementById('brochure-modal');
        const closeBrochureBtn = document.querySelector('.brochure-close');
        const brochureContainer = document.querySelector('.brochure-container');

        if (!openBrochureBtn || !brochureModal || !brochureContainer) return;

        // 모달 열기 함수 (3D 병풍식 자동 전개)
        const openBrochure = () => {
            brochureModal.classList.add('show', 'active');
            document.body.style.overflow = 'hidden'; // 뒷배경 스크롤 잠금
            
            // 모달창이 표시된 후 50ms 딜레이를 주어 아코디언처럼 전개되는 모션을 부드럽게 재생
            setTimeout(() => {
                brochureContainer.classList.add('open');
            }, 50);
        };

        // 모달 닫기 함수 (3D 병풍식 자동 접기 후 퇴장)
        const closeBrochure = () => {
            brochureContainer.classList.remove('open');
            document.body.style.overflow = ''; // 스크롤 잠금 해제
            
            // 병풍이 완전히 접히는 트랜지션 시간(약 1200ms) 동안 대기한 후 모달창을 숨김
            setTimeout(() => {
                brochureModal.classList.remove('show', 'active');
            }, 1200);
        };

        openBrochureBtn.addEventListener('click', openBrochure);

        if (closeBrochureBtn) {
            closeBrochureBtn.addEventListener('click', closeBrochure);
        }

        // 모달 바깥의 어두운 배경 영역을 클릭했을 때 모달을 닫음
        brochureModal.addEventListener('click', (e) => {
            if (e.target === brochureModal) {
                closeBrochure();
            }
        });
    });
})();

// ==========================================
// ESG [E] 탄소 저감 카운트업 애니메이션 (IIFE)
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const counter = document.getElementById('esg-carbon-counter');
        if (!counter) return;

        const TARGET = 15;      // 목표값 (15 ton)
        const DURATION = 2000;  // 애니메이션 지속 시간 (ms)
        let animated = false;

        const animateCount = () => {
            if (animated) return;
            animated = true;

            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / DURATION, 1);

                // easeOutExpo 이징으로 자연스러운 감속
                const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentValue = Math.round(eased * TARGET);

                counter.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = TARGET;
                }
            };

            requestAnimationFrame(step);
        };

        // IntersectionObserver: 화면에 들어올 때 카운트업 시작
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount();
                    observer.unobserve(entry.target); // 한 번만 실행
                }
            });
        }, { threshold: 0.3 });

        observer.observe(counter);
    });
})();

// ==========================================
// ESG [G] 아코디언 (+ 버튼) 토글 기능 (IIFE)
// ==========================================
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const accordionHeaders = document.querySelectorAll('.esg-accordion-header');
        if (accordionHeaders.length === 0) return;

        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling; // .esg-accordion-content
                const isActive = this.classList.contains('active');

                // 다른 모든 아코디언 닫기 (1개만 열리는 방식)
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== this) {
                        otherHeader.classList.remove('active');
                        const otherContent = otherHeader.nextElementSibling;
                        if (otherContent) {
                            otherContent.style.maxHeight = null;
                        }
                    }
                });

                // 현재 클릭된 아코디언 토글
                if (isActive) {
                    this.classList.remove('active');
                    if (content) content.style.maxHeight = null;
                } else {
                    this.classList.add('active');
                    if (content) content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    });
})();



