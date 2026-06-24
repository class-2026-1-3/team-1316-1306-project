// --- 기존 실시간 인기 검색어 코드 (유지) ---
// (기존 updateRanking 등등의 코드는 그대로 두세요!)

// --- 새로 추가된 검색 및 자동완성 코드 ---
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const suggestionsBox = document.getElementById('search-suggestions');
const searchContainer = document.getElementById('search-box-container');

// 검색 가능한 문서 목록 (원하는 대로 추가 가능)
const wikiData = [
    "레벨 0", "아몬드 워터", "엔티티", "스마일러", "노클립",
    "백룸 탈출", "파티고어", "프론트룸", "레벨 1", "레벨 2",
    "전방의 방", "MEG", "가짜 창문"
];

// 1) 페이지 이동 함수
function goToSearch() {
    const query = searchInput.value.trim().replace(/\s+/g, ''); // 띄어쓰기 무시 ("레벨 0" -> "레벨0")

    if (query === "레벨0") {
        // 레벨0 검색 시 지정된 링크로 이동
        window.location.href = "http://127.0.0.1:5500/html/con_ex.html";
    }
    else if (query === "아몬드워터") {
        // 레벨0 검색 시 지정된 링크로 이동
        window.location.href = "http://127.0.0.1:5500/html/con_ex1.html";
    } else if (query !== "") {
        alert("아직 작성되지 않은 문서입니다: " + searchInput.value);
        // 만약 검색어별로 다른 페이지를 만들게 되면 여기에 else if 로 추가하시면 됩니다.
    }
}

// 2) 돋보기 아이콘 클릭 시 검색 실행
searchBtn.addEventListener('click', goToSearch);

// 3) 엔터 키 누를 시 검색 실행
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        goToSearch();
    }
});

// 4) 타자 칠 때마다 드롭다운에 일치하는 단어 보여주기
searchInput.addEventListener('input', function () {
    const val = this.value.trim().replace(/\s+/g, '');
    suggestionsBox.innerHTML = ''; // 드롭다운 초기화

    if (val.length > 0) {
        // 입력한 글자가 포함된 단어 찾기 (띄어쓰기 무시)
        const filtered = wikiData.filter(item =>
            item.replace(/\s+/g, '').includes(val)
        );

        if (filtered.length > 0) {
            suggestionsBox.style.display = 'block';
            filtered.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item; // 예: "레벨 0" 표시

                // 드롭다운에서 단어를 클릭했을 때
                li.addEventListener('click', function () {
                    searchInput.value = item;
                    suggestionsBox.style.display = 'none';
                    goToSearch(); // 클릭하면 바로 이동하게 하려면 활성화
                });

                suggestionsBox.appendChild(li);
            });
        } else {
            suggestionsBox.style.display = 'none'; // 일치하는 거 없으면 닫기
        }
    } else {
        suggestionsBox.style.display = 'none'; // 지워서 빈칸되면 닫기
    }
});

// 5) 검색창 바깥 아무데나 클릭하면 드롭다운 닫히게 하기
document.addEventListener('click', function (e) {
    if (!searchContainer.contains(e.target)) {
        suggestionsBox.style.display = 'none';
    }
});