# 공통 사이드바 모듈

> 웹 애플리케이션에서 공통적으로 사용할 수 있는 반응형 사이드바 컴포넌트

# 개발
### **> 방선우**

## 개요

이 사이드바 모듈은 다양한 웹 페이지에서 재사용 가능한 공통 사이드바 기능을 제공합니다.  
토글 기능, 리사이징, 상태 저장 등의 기능을 포함하여 사용자 친화적인 UI/UX를 제공합니다.

## 주요 기능

- **토글 기능**: 사이드바 열기/닫기 지원
- **리사이징**: 마우스 드래그로 사이드바 너비 조정
- **상태 저장**: localStorage를 통한 사이드바 상태 저장
- **반응형**: 다양한 화면 크기에 대응

## 빠른 시작

### 1. 파일 포함

```html
<link rel="stylesheet" href="/custom/css/swSidebar.css">
<script src="/js/sidebar/swSidebar.js"></script>
```

### 2. HTML 구조 설정

```html
<div id="main-container">
    <div id="content-container">
        <h2>메인 컨텐츠 영역</h2>
        <div id="toggle-container"></div>
        <!-- 메인 컨텐츠 -->
    </div>
    <div id="side-container"></div>
</div>
```

### 3. JavaScript 초기화

```javascript
$(document).ready(function() {
    window.sidebar = new SidebarModule({
        mainContainer: 'main-container',
        contentContainer: 'content-container',
        toggleContainer: 'toggle-container',
        sideContainer: 'side-container',
        defaultWidth: '350',
        minWidth: '400',
        maxWidth: '800'
    });
});
```

### 4. HTML 삽입
 ```
 let htmlStr = `
    <div>
        <table>
            ...
        </table>
    </div>
 `
 sidebar.setContent(htmlStr)
 ```

## 필수 HTML 구조

### 1. 컨테이너 요소

다음 4개의 div 요소가 반드시 필요합니다:

```html
<div id="main-container">        <!-- 최상위 컨테이너 -->
    <div id="content-container"> <!-- 메인 컨텐츠 영역 -->
        <div id="toggle-container"></div> <!-- 토글 버튼 위치 -->
        <!-- 메인 컨텐츠 -->
    </div>
    <div id="side-container"></div> <!-- 사이드바 위치 -->
</div>
```

### 2. CSS 클래스 자동 적용

모듈 초기화 시 다음 클래스들이 자동으로 적용됩니다:
- `.main-container` → 최상위 컨테이너
- `.content-container` → 메인 컨텐츠 영역
- `.side-container` → 사이드바 영역

## 사용법

### 기본 사용 예시

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/custom/css/sidebar-common.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/sidebar/swSidebar.js"></script>
</head>
    <script language="javascript">
        $(document).ready(function(){
            window.sidebar = new SidebarModule({
                mainContainer: 'main-container',
                contentContainer: 'content-container',
                toggleContainer: 'toggle-container',
                sideContainer: 'side-container',
                defaultWidth: '450',
                minWidth: '400',
                maxWidth: '800'
            });
    
            searchAjax(1);
        });
        
        // 검색
        function searchAjax(page){
            // data 불러오는 로직
        }
    
        // 클릭 시 view 제어 함수(custom)
        function onRowSelected (params) {
            let param = params.data.wfWjId
    
            goViewSide(param);
            sidebar.toggleSidebar();
        }
    
        // 사이드바
        function goViewSide(wfWjId) {
            let htmlStr = `
                    사이드바 구성 html 코드
            `;
            sidebar.setContent(htmlStr);
    
            $.ajax({
                type: 'POST',
                url: '/ticket/wait/formPopup.do',
                data: {
                    wfWjId: wfWjId,
                    actionType: 'json'
                },
                success: function (data) {
                    // 사이드바 내용입력 로직
                },
                error: function (error) {
                    console.error("error :: ", error);
                }
            })
        }
    
        // 팝업
        function goView(wfWjId) {
            // 팝업 로직
        }
    </script>

    <input type="hidden" name="toggleId" id="toggleId">
    <div id="main-container">	<#--필수요소-->
        <div id="content-container">	<#--필수요소-->
            <div id="toggle-container"></div>	<#--필수요소-->
            <#-- 메인 컨텐츠 (리스트, 테이블 등)-->
            <div>
                <table>
                    ....
                </table>
            </div>
    
            <!-- 사이드바 -->
            <div id="side-container"></div>	<#--필수요소-->
        </div>
    </div>
</html>
```

## 설정 옵션

### 생성자 옵션

| 옵션 | 타입 | 기본값               | 설명                |
|------|------|-------------------|-------------------|
| `mainContainer` | string | ''                | 최상위 컨테이너 div의 ID  |
| `contentContainer` | string | ''                | 메인 컨텐츠 div의 ID    |
| `toggleContainer` | string | ''                | 토글 버튼 div의 ID     |
| `sideContainer` | string | ''                | 사이드바 div의 ID      |
| `defaultWidth` | number | 300               | 사이드바 기본 너비 (px)   |
| `minWidth` | number | 200               | 사이드바 최소 너비 (px)   |
| `maxWidth` | number | 600               | 사이드바 최대 너비 (px)   |
| `storageKey` | string | 'sidebarToggleYn' | localStorage 저장 키 |
| `autoCreate` | boolean | true              | 자동 초기화 여부         |

&nbsp;
### 메서드

---
#### `toggleSidebar()`
사이드바를 열거나 닫습니다.
```javascript
sidebar.toggleSidebar();
```
---
#### `setContent(content)`
사이드바에 HTML 컨텐츠를 설정합니다.
- **매개변수**: `content` (string) - HTML 문자열

```javascript
sidebar.setContent('<h3>새로운 컨텐츠</h3><p>여기에 내용을 추가합니다.</p>');
```
---
#### `open()`
사이드바를 강제로 엽니다.
```javascript
sidebar.open();
```
---
#### `close()`
사이드바를 강제로 닫습니다.
```javascript
sidebar.close();
```
---
#### `isOpen()`
사이드바가 열려있는지 확인합니다.
- **반환값**: boolean

```javascript
if (sidebar.isOpen()) {
    console.log('사이드바가 열려있습니다.');
}
```
---

## ⚠️ 주의사항

### 1. 높이 설정
사이드바는 화면 높이(100vh)에 대응하도록 설계되었습니다. CSS에서 기본 설정을 제공하지만, 다음 사항을 주의바랍니다:

- 최상위 요소부터 사이드바 요소까지의 높이 설정이 중요합니다
- 기본 구조를 최대한 준수해주세요
- 내부 요소들의 높이/너비는 자유롭게 설정 가능합니다

### 2. jQuery 의존성
이 모듈은 jQuery에 의존합니다. jQuery가 먼저 로드되어야 합니다:

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="/js/sidebar/sidebar-common.js"></script>
```

### 3. 글로벌 인스턴스
`window.sidebar`로 글로벌 인스턴스를 생성하여 페이지 내 어디서든 접근할 수 있습니다.
