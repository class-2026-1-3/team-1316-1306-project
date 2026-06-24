// 백룸위키에 어울리는 가상 검색어 데이터
const searchKeywords = [
    "레벨 0", "아몬드 워터", "엔티티", "스마일러", "노클립",
    "백룸 탈출", "파티고어", "프론트룸", "레벨 1", "레벨 2",
    "전방의 방", "MEG", "가짜 창문"
];

// 등락 상태 (상승, 하락, 유지, 진입)
const statuses = [
    { type: "up", icon: "▲" },
    { type: "down", icon: "▼" },
    { type: "keep", icon: "-" },
    { type: "new", icon: "NEW" }
];

function updateRanking() {
    const container = document.getElementById("realtime-container");
    container.innerHTML = "";

    // 검색어를 무작위로 섞음 (실시간 변동 효과)
    let shuffled = [...searchKeywords].sort(() => 0.5 - Math.random());

    // 상위 10개만 출력
    for (let i = 0; i < 10; i++) {
        const keyword = shuffled[i];
        // 무작위 등락폭 설정
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const li = document.createElement("li");

        let statusHtml = `<span class="rank-status status-${randomStatus.type}">${randomStatus.icon}</span>`;
        // 순위 변동 숫자가 필요한 경우 상승/하락 폭 추가 (ex: ▲ 2)
        if (randomStatus.type === "up" || randomStatus.type === "down") {
            const diff = Math.floor(Math.random() * 3) + 1;
            statusHtml = `<span class="rank-status status-${randomStatus.type}">${randomStatus.icon} ${diff}</span>`;
        }

        li.innerHTML = `
                    <span class="rank-num">${i + 1}</span>
                    <span class="rank-keyword">${keyword}</span>
                    ${statusHtml}
                `;
        container.appendChild(li);
    }
}

// 페이지 로드 시 최초 실행
updateRanking();

// 10초마다 자동으로 실검 갱신 (진짜 나무위키처럼 작동)
setInterval(updateRanking, 10000);