// basically a bitmask for what team it SHOULDN'T damage
class Team {
    static NONE = 0; // Damages all teams

    static PLAYER = 0x1;
    static ENEMY = 0x2;
    static ASTEROID = 0x4;

    static NEUTRAL = 0xFFFF; // Damages no teams
}
function getTeamColor(team) {
    switch (team) {
        case Team.PLAYER:
            return new Color(0x99, 0xdd, 0xff);
        case Team.ENEMY:
            return new Color(0xff, 0x55, 0x55); // red
        case Team.ASTEROID:
            return new Color(0x99, 0x99, 0x99); // green
        default:
            return new Color(0xff, 0xff, 0xff); // white
    }
}
function getTeamPriority(team) {
    switch (team) {
        case Team.PLAYER:
            return 0;
        case Team.ENEMY:
            return 1;
        case Team.ASTEROID:
            return 2;
        default:
            return -1;
    }
}