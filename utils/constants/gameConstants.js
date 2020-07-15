import enumeration from '../enum';

const constants =  enumeration({
  SECOND_IN_MS: 1000,
  RACE_TIME: 60,
  HALF_OF_RACE: Math.round(60 / 2),
  PART_OF_RACE: Math.round(60 / 5)
});

export default constants;