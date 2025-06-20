class FootballNews {
    constructor() {
        this.apiToken = 'fcd753c5dff04f55bc92be5ba941e129';
        this.baseUrl = 'https://api.football-data.org/v4';
        this.matches = [];
        this.competitions = [];
        this.init();
    }

    async init() {
        await this.loadCompetitions();
        await this.loadMatches();
        this.setupEventListeners();
    }

    async makeApiRequest(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'X-Auth-Token': this.apiToken
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async loadCompetitions() {
        try {
            // Load competitions từ API thực tế
            const response = await this.makeApiRequest('/competitions');
            const competitions = response.competitions.filter(comp => 
                ['PL', 'PD', 'SA', 'BL1', 'FL1', 'CL', 'EC'].includes(comp.code)
            );
            this.competitions = competitions;
            this.populateCompetitionFilter(competitions);
        } catch (error) {
            console.error('Error loading competitions:', error);
            // Fallback to demo competitions
            const demoCompetitions = [
                { code: 'PL', name: 'Premier League' },
                { code: 'PD', name: 'La Liga' },
                { code: 'SA', name: 'Serie A' },
                { code: 'BL1', name: 'Bundesliga' },
                { code: 'FL1', name: 'Ligue 1' },
                { code: 'CL', name: 'Champions League' }
            ];
            this.populateCompetitionFilter(demoCompetitions);
        }
    }

    populateCompetitionFilter(competitions) {
        const select = document.getElementById('competitionFilter');
        competitions.forEach(comp => {
            const option = document.createElement('option');
            option.value = comp.code || comp.id;
            option.textContent = comp.name;
            select.appendChild(option);
        });
    }

    async loadMatches() {
        this.showLoading(true);
        this.hideError();

        try {
            // Load recent matches (demo data since API requires token)
            await this.loadDemoData();
            this.displayMatches(this.matches);
        } catch (error) {
            console.error('Error loading matches:', error);
            this.showError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng và thử lại.');
        } finally {
            this.showLoading(false);
        }
    }

    async loadDemoData() {
        // Demo data để test giao diện
        this.matches = [
            {
                id: 1,
                homeTeam: { name: 'Manchester United', shortName: 'MUN' },
                awayTeam: { name: 'Liverpool', shortName: 'LIV' },
                competition: { name: 'Premier League' },
                utcDate: new Date().toISOString(),
                status: 'FINISHED',
                score: { fullTime: { home: 2, away: 1 } }
            },
            {
                id: 2,
                homeTeam: { name: 'Barcelona', shortName: 'BAR' },
                awayTeam: { name: 'Real Madrid', shortName: 'RMA' },
                competition: { name: 'La Liga' },
                utcDate: new Date(Date.now() + 86400000).toISOString(),
                status: 'SCHEDULED',
                score: { fullTime: { home: null, away: null } }
            },
            {
                id: 3,
                homeTeam: { name: 'Chelsea', shortName: 'CHE' },
                awayTeam: { name: 'Arsenal', shortName: 'ARS' },
                competition: { name: 'Premier League' },
                utcDate: new Date().toISOString(),
                status: 'IN_PLAY',
                score: { fullTime: { home: 1, away: 1 } }
            },
            {
                id: 4,
                homeTeam: { name: 'Bayern Munich', shortName: 'BAY' },
                awayTeam: { name: 'Borussia Dortmund', shortName: 'BVB' },
                competition: { name: 'Bundesliga' },
                utcDate: new Date(Date.now() - 3600000).toISOString(),
                status: 'FINISHED',
                score: { fullTime: { home: 3, away: 0 } }
            }
        ];
    }

    displayMatches(matches) {
        const container = document.getElementById('matchesContainer');
        const noMatchesDiv = document.getElementById('noMatches');

        if (matches.length === 0) {
            container.innerHTML = '';
            noMatchesDiv.style.display = 'block';
            return;
        }

        noMatchesDiv.style.display = 'none';
        container.innerHTML = matches.map(match => this.createMatchCard(match)).join('');
    }

    createMatchCard(match) {
        const date = new Date(match.utcDate);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusText = this.getStatusText(match.status);
        const statusClass = this.getStatusClass(match.status);
        const scoreDisplay = this.getScoreDisplay(match);

        return `
            <div class="match-card">
                <div class="match-header">
                    <div class="competition">${match.competition.name}</div>
                    <div class="match-date">${formattedDate}</div>
                </div>
                <div class="teams">
                    <div class="team">
                        <div class="team-name">${match.homeTeam.name}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-name">${match.awayTeam.name}</div>
                    </div>
                </div>
                ${scoreDisplay}
                <div class="status ${statusClass}">${statusText}</div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'SCHEDULED': 'Chưa diễn ra',
            'IN_PLAY': 'Đang thi đấu',
            'PAUSED': 'Tạm dừng',
            'FINISHED': 'Kết thúc',
            'POSTPONED': 'Hoãn',
            'CANCELLED': 'Hủy'
        };
        return statusMap[status] || status;
    }

    getStatusClass(status) {
        if (status === 'FINISHED') return 'finished';
        if (status === 'IN_PLAY' || status === 'PAUSED') return 'live';
        return 'scheduled';
    }

    getScoreDisplay(match) {
        if (match.score && match.score.fullTime && 
            (match.score.fullTime.home !== null && match.score.fullTime.away !== null)) {
            return `<div class="score">${match.score.fullTime.home} - ${match.score.fullTime.away}</div>`;
        }
        return '<div class="score">- : -</div>';
    }

    setupEventListeners() {
        const searchBox = document.getElementById('searchBox');
        const competitionFilter = document.getElementById('competitionFilter');

        searchBox.addEventListener('input', () => this.filterMatches());
        competitionFilter.addEventListener('change', () => this.filterMatches());
    }

    filterMatches() {
        const searchTerm = document.getElementById('searchBox').value.toLowerCase();
        const selectedCompetition = document.getElementById('competitionFilter').value;

        let filteredMatches = this.matches.filter(match => {
            const matchesSearch = searchTerm === '' || 
                match.homeTeam.name.toLowerCase().includes(searchTerm) ||
                match.awayTeam.name.toLowerCase().includes(searchTerm);

            const matchesCompetition = selectedCompetition === '' ||
                match.competition.name.includes(selectedCompetition);

            return matchesSearch && matchesCompetition;
        });

        this.displayMatches(filteredMatches);
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    hideError() {
        document.getElementById('error').style.display = 'none';
    }
}

// Khởi tạo ứng dụng khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
    new FootballNews();
});