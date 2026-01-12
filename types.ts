
export enum TimeOfDay {
  MORNING = '아침',
  LUNCH = '점심',
  EVENING = '저녁',
  NIGHT = '야식'
}

export enum Category {
  ALL = '전체',
  KOREAN = '한식',
  CHINESE = '중식',
  JAPANESE = '일식',
  WESTERN = '양식',
  MEXICAN = '멕시코'
}

export interface Recommendation {
  dish: string;
  reason: string;
}
