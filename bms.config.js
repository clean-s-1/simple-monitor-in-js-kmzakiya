const BMS_CONFIG = {
  temperature: {
    name:'Temperature',
    min: 0,
    max: 45,
  },
  stateOfCharge: {
    min: 20,
    max: 80,
    name:'State of charge',
  },
  chargeRate: {
    max: 0.8,
    name:'Charge Rate'
  },
};
module.exports = BMS_CONFIG;