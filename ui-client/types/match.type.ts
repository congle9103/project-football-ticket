export interface IMatch {
  id: number;
  slug_match: string;
  away_team: string;
  image_away_team: string;
  time: string;
  round: string;
  season: string;
}

export interface IMatchProps {
  match: IMatch;
}