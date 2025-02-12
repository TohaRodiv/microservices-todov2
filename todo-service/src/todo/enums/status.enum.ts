export enum StatusEnum {
  TODO = 1,
  IN_PROGRESS = 2,
  DONE = 3,
  ON_HOLD = 4,
  CANCELLED = 5,
}

export const StatusTitles: { [key in StatusEnum]: string } = {
  [StatusEnum.TODO]: 'К выполнению',
  [StatusEnum.IN_PROGRESS]: 'В процессе',
  [StatusEnum.DONE]: 'Выполнено',
  [StatusEnum.ON_HOLD]: 'На паузе',
  [StatusEnum.CANCELLED]: 'Отменено',
};