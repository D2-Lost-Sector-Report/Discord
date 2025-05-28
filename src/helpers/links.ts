function getLeaderboardLink(sector: string) {
  return `https://d2lostsector.report/leaderboards?sector=${sector.toLowerCase().replace(/ /g, "_")}&mode=clears&difficulty=all`;
}

function getFastestTimesLink(sector: string, difficulty: string) {
  return `https://d2lostsector.report/leaderboards?sector=${sector.toLowerCase().replace(/ /g, "_")}&mode=speedrun&difficulty=${difficulty}`;
}

export { getLeaderboardLink, getFastestTimesLink };
